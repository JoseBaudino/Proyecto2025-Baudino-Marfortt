import { useEffect, useState } from 'react';
import { obtenerCotizaciones } from '@/api/cotizaciones';
import logoRosario from '@/assets/imagenes/logo-bolsa-rosario.png';
import logoCordoba from '@/assets/imagenes/logo-bolsa-cordoba.png';

/**
 * Relación entre el nombre de logo del JSON y la imagen importada.
 * @constant
 * @type {Object<string, string>}
 */
const LOGOS = { rosario: logoRosario, cordoba: logoCordoba };

/**
 * Formatea un importe en pesos argentinos (ej: "$ 550.000").
 * @method formatearPesos
 * @param {number} valor - Importe en pesos
 * @return {string} Importe formateado
 */
const formatearPesos = (valor) => `$ ${valor.toLocaleString('es-AR', { maximumFractionDigits: 2 })}`;

/**
 * Lista dinámica de bolsas de cereales con sus precios de pizarra.
 * Los datos se piden al servicio simulado de la carpeta api (que lee un JSON local).
 * @method QuotesList
 * @return {JSX.Element} Grilla de tarjetas de cotizaciones
 */
const QuotesList = () => {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    /**
     * Pide las cotizaciones al servicio y las guarda en el estado.
     * @method cargarCotizaciones
     * @return {Promise<void>}
     */
    const cargarCotizaciones = async () => {
      try {
        setItems(await obtenerCotizaciones());
      } catch (err) {
        console.error('Error al obtener las cotizaciones:', err);
        setError('No se pudieron cargar las cotizaciones.');
      } finally {
        setCargando(false);
      }
    };
    cargarCotizaciones();
  }, []);

  if (cargando) return <p className="muted">Cargando cotizaciones…</p>;
  if (error) return <p className="field-error" role="alert">{error}</p>;
  if (items.length === 0) return <p className="muted">No hay cotizaciones disponibles.</p>;
  return (
    <div className="preview-grid">
      {items.map((bolsa) => (
        <a key={bolsa.id} className="preview-card" href={bolsa.url} target="_blank" rel="noopener noreferrer">
          <img src={LOGOS[bolsa.logo]} alt={bolsa.alt} />
          <div className="preview-info">
            <h3>{bolsa.nombre}</h3>
            <p>{bolsa.descripcion} del {bolsa.fecha}</p>
            <table className="tabla-precios">
              <caption>Precios por tonelada</caption>
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Pesos</th>
                  <th scope="col">Dólares</th>
                </tr>
              </thead>
              <tbody>
                {bolsa.precios.map(({ producto, pesos, dolares, estimado }) => (
                  <tr key={producto}>
                    <td>
                      {producto}
                      {estimado && <abbr title="Precio estimado (sin cotización ese día)"> (E)</abbr>}
                    </td>
                    <td>{formatearPesos(pesos)}</td>
                    <td>{dolares != null ? `US$ ${dolares.toLocaleString('es-AR')}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="muted">(E) = precio estimado. Ver pizarra actualizada ↗</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default QuotesList;
