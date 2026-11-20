/**
 * Tarjeta genérica (contenedor con fondo blanco y sombra).
 * @method Card
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido de la tarjeta
 * @param {string} [props.className=''] - Clases extra
 * @return {JSX.Element} Elemento div con estilo de tarjeta
 */
const Card = ({ children, className = '', ...props }) => (
  <div className={`card ${className}`.trim()} {...props}>
    {children}
  </div>
);

export default Card;
