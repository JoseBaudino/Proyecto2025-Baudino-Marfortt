import { useEffect, useRef, useState } from 'react';
import Button from '@/components/Button';
import useLocalStorage from '@/hooks/useLocalStorage';
import { obtenerClima } from '@/api/clima';
import { CLAVES, leerLocal } from '@/utils/storage';

/**
 * Centro del mapa cuando no hay un campo guardado (aprox. centro de Argentina).
 * @constant
 * @type {Array<number>}
 */
const CENTRO_ARGENTINA = [-31.4, -64.2];

/**
 * Promesa compartida de la carga de Leaflet. Se guarda para no descargar la librería dos veces
 * (React en modo estricto monta el componente dos veces y eso cargaba dos copias distintas).
 * @type {Promise<Object>|null}
 */
let promesaLeaflet = null;

/**
 * Carga Leaflet (librería de mapas) desde CDN una sola vez.
 * @method cargarLeaflet
 * @return {Promise<Object>} Objeto global L de Leaflet
 */
const cargarLeaflet = () => {
  if (promesaLeaflet) return promesaLeaflet;
  promesaLeaflet = new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L);
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve(window.L);
    script.onerror = () => {
      promesaLeaflet = null; // permite reintentar si falló la descarga
      reject(new Error('No se pudo cargar Leaflet'));
    };
    document.body.appendChild(script);
  });
  return promesaLeaflet;
};

/**
 * Consulta el clima de un punto y actualiza el estado del componente.
 * @method buscarClima
 * @param {number} lat - Latitud
 * @param {number} lng - Longitud
 * @param {Function} setEstado - Función que actualiza el estado {cargando, error, datos}
 * @return {Promise<void>}
 */
const buscarClima = async (lat, lng, setEstado) => {
  setEstado({ cargando: true, error: '', datos: null });
  try {
    setEstado({ cargando: false, error: '', datos: await obtenerClima(lat, lng) });
  } catch (error) {
    console.error('Error al consultar el clima:', error);
    setEstado({ cargando: false, error: 'No se pudo obtener el clima. Intente nuevamente.', datos: null });
  }
};

/**
 * Muestra un valor con su unidad o "N/D" si no está disponible.
 * @method mostrar
 * @param {number|null|undefined} valor - Valor a mostrar
 * @param {string} unidad - Unidad que se agrega al valor
 * @return {string} Texto a mostrar
 */
const mostrar = (valor, unidad) => (valor != null ? `${valor} ${unidad}` : 'N/D');

/**
 * Mapa interactivo: al hacer clic en un punto muestra su clima.
 * Permite guardar un punto como "mi campo" en localStorage para verlo al volver a entrar.
 * @method WeatherPicker
 * @return {JSX.Element} Mapa, botones de "mi campo" y resultados del clima
 */
const WeatherPicker = () => {
  const contenedorMapa = useRef(null);
  const mapa = useRef(null);
  const marcador = useRef(null);
  const marcadorCampo = useRef(null);
  const [mapaListo, setMapaListo] = useState(false);
  const [estado, setEstado] = useState({ cargando: false, error: '', datos: null });
  const [puntoElegido, setPuntoElegido] = useState(null);
  const [campo, setCampo] = useLocalStorage(CLAVES.CAMPO, null);

  // 1) Crear el mapa una sola vez. Si hay un campo guardado, se centra ahí y muestra su clima.
  useEffect(() => {
    let cancelado = false;
    const campoGuardado = leerLocal(CLAVES.CAMPO);

    /**
     * Carga Leaflet, crea el mapa y registra el clic para elegir un punto.
     * @method iniciarMapa
     * @return {Promise<void>}
     */
    const iniciarMapa = async () => {
      try {
        const L = await cargarLeaflet();
        if (cancelado) return;
        const centro = campoGuardado ? [campoGuardado.lat, campoGuardado.lng] : CENTRO_ARGENTINA;
        mapa.current = L.map(contenedorMapa.current).setView(centro, campoGuardado ? 12 : 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap',
        }).addTo(mapa.current);

        // Al hacer clic: marcador temporal en el punto y clima de ese lugar
        mapa.current.on('click', ({ latlng }) => {
          if (marcador.current) marcador.current.remove();
          marcador.current = L.marker(latlng).addTo(mapa.current);
          setPuntoElegido({ lat: latlng.lat, lng: latlng.lng });
          buscarClima(latlng.lat, latlng.lng, setEstado);
        });

        setMapaListo(true);
        if (campoGuardado) buscarClima(campoGuardado.lat, campoGuardado.lng, setEstado);
      } catch (err) {
        console.error('Error al cargar el mapa:', err);
        setEstado({ cargando: false, error: 'No se pudo cargar el mapa', datos: null });
      }
    };
    iniciarMapa();

    return () => {
      cancelado = true;
      if (mapa.current) mapa.current.remove();
      mapa.current = null;
    };
  }, []);

  // 2) Dibujar (o quitar) el círculo verde de "mi campo" cada vez que cambia
  useEffect(() => {
    if (!mapaListo) return;
    if (marcadorCampo.current) marcadorCampo.current.remove();
    marcadorCampo.current = null;
    if (campo) {
      marcadorCampo.current = window.L.circleMarker([campo.lat, campo.lng], { radius: 10, color: '#1b5e20', fillColor: '#77e38e', fillOpacity: 0.9 })
        .addTo(mapa.current)
        .bindTooltip('Mi campo');
    }
  }, [mapaListo, campo]);

  /**
   * Guarda el último punto elegido como "mi campo".
   * @method guardarCampo
   * @return {void}
   */
  const guardarCampo = () => {
    setCampo(puntoElegido);
    if (marcador.current) marcador.current.remove();
  };

  /**
   * Centra el mapa en "mi campo" y muestra su clima.
   * @method irAMiCampo
   * @return {void}
   */
  const irAMiCampo = () => {
    mapa.current?.setView([campo.lat, campo.lng], 12);
    buscarClima(campo.lat, campo.lng, setEstado);
  };

  const { cargando, error, datos } = estado;
  return (
    <div>
      <div className="map-container" ref={contenedorMapa} role="application" aria-label="Mapa para seleccionar ubicación"></div>

      <div className="campo-acciones">
        <Button className="primary" onClick={guardarCampo} disabled={!puntoElegido}>
          📍 Guardar punto como mi campo
        </Button>
        {campo && (
          <>
            <Button onClick={irAMiCampo}>Ver mi campo</Button>
            <Button className="danger" onClick={() => setCampo(null)}>Quitar mi campo</Button>
          </>
        )}
      </div>
      <p className="muted">
        {campo
          ? `Mi campo: ${campo.lat.toFixed(4)}, ${campo.lng.toFixed(4)} (círculo verde en el mapa)`
          : 'Todavía no guardaste tu campo: hacé clic en el mapa y tocá "Guardar punto como mi campo".'}
      </p>

      <div className="weather-results" aria-live="polite">
        {cargando && <p>Consultando clima…</p>}
        {error && <p className="field-error" role="alert">{error}</p>}
        {datos && (
          <div>
            <p><strong>Temperatura:</strong> {mostrar(datos.temp, '°C')}</p>
            <p><strong>Viento:</strong> {mostrar(datos.wind, 'km/h')}</p>
            <p><strong>Humedad:</strong> {mostrar(datos.rh, '%')}</p>
            <p><strong>Prob. de lluvia (hora actual):</strong> {mostrar(datos.prob, '%')}</p>
            <p><strong>Precipitación actual:</strong> {mostrar(datos.precip, 'mm')}</p>
          </div>
        )}
        {!datos && !cargando && !error && <p className="muted">Hacé clic en el mapa para ver el clima.</p>}
      </div>
    </div>
  );
};

export default WeatherPicker;
