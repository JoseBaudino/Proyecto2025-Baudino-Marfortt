import { useEffect, useRef, useState } from 'react';
import { obtenerClima } from '@/utils/clima';

/**
 * Carga Leaflet (librería de mapas) desde CDN una sola vez.
 * @method cargarLeaflet
 * @return {Promise<Object>} Objeto global L de Leaflet
 */
const cargarLeaflet = () =>
  new Promise((resolve, reject) => {
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
    script.onerror = reject;
    document.body.appendChild(script);
  });

/**
 * Muestra un valor con su unidad o "N/D" si no está disponible.
 * @method mostrar
 * @param {number|null|undefined} valor - Valor a mostrar
 * @param {string} unidad - Unidad que se agrega al valor
 * @return {string} Texto a mostrar
 */
const mostrar = (valor, unidad) => (valor != null ? `${valor} ${unidad}` : 'N/D');

/**
 * Mapa interactivo: al hacer clic en un punto consulta y muestra el clima de ese lugar.
 * @method WeatherPicker
 * @return {JSX.Element} Mapa y resultados del clima
 */
const WeatherPicker = () => {
  const contenedorMapa = useRef(null);
  const marcador = useRef(null);
  const [estado, setEstado] = useState({ cargando: false, error: '', datos: null });

  useEffect(() => {
    let mapa;
    let cancelado = false;

    /**
     * Coloca el marcador en el punto clickeado (reemplazando el anterior) y busca el clima.
     * @method alHacerClic
     * @param {Object} evento - Evento de clic de Leaflet con la propiedad latlng
     * @return {Promise<void>}
     */
    const alHacerClic = async ({ latlng }) => {
      const { lat, lng } = latlng;
      if (marcador.current) marcador.current.remove();
      marcador.current = window.L.marker([lat, lng]).addTo(mapa);
      setEstado({ cargando: true, error: '', datos: null });
      try {
        setEstado({ cargando: false, error: '', datos: await obtenerClima(lat, lng) });
      } catch (error) {
        console.error('Error al consultar el clima:', error);
        setEstado({ cargando: false, error: 'No se pudo obtener el clima. Intente nuevamente.', datos: null });
      }
    };

    cargarLeaflet()
      .then((L) => {
        if (cancelado) return;
        mapa = L.map(contenedorMapa.current).setView([-31.4, -64.2], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap',
        }).addTo(mapa);
        mapa.on('click', alHacerClic);
      })
      .catch(() => setEstado({ cargando: false, error: 'No se pudo cargar el mapa', datos: null }));

    return () => {
      cancelado = true;
      marcador.current = null;
      if (mapa) mapa.remove();
    };
  }, []);

  const { cargando, error, datos } = estado;
  return (
    <div>
      <div className="map-container" ref={contenedorMapa} role="application" aria-label="Mapa para seleccionar ubicación"></div>
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
