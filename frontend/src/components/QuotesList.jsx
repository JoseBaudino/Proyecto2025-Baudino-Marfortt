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
 * Lista dinámica de bolsas de cereales con precios de referencia, generada desde un JSON local.
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
            <p>{bolsa.descripcion}</p>
            <ul>
              {bolsa.precios.map(({ grano, precio }) => (
                <li key={grano}>
                  {grano}: <strong>USD {precio}/t</strong>
                </li>
              ))}
            </ul>
            <p className="muted">Valores de referencia (demo). Ver precios actualizados ↗</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default QuotesList;
