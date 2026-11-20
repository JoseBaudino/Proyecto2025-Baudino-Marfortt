import cotizaciones from '@/data/cotizaciones.json';
import logoRosario from '@/imagenes/logo-bolsa-rosario.png';
import logoCordoba from '@/imagenes/logo-bolsa-cordoba.png';

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
 * Lista dinámica de bolsas de cereales con sus precios de pizarra, generada desde un JSON local.
 * Los precios son los publicados por cada bolsa en la fecha indicada.
 * @method QuotesList
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} [props.items=cotizaciones] - Bolsas a mostrar (por defecto, las del JSON local)
 * @return {JSX.Element} Grilla de tarjetas de cotizaciones
 */
const QuotesList = ({ items = cotizaciones }) => {
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
