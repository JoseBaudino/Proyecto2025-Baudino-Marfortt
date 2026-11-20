/**
 * Botón genérico reutilizable con las clases de estilo de la aplicación.
 * @method Button
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {string} [props.className=''] - Clases extra (primary, secondary, danger)
 * @param {string} [props.type='button'] - Tipo del botón (button, submit)
 * @return {JSX.Element} Elemento button
 */
const Button = ({ children, className = '', type = 'button', ...props }) => (
  <button type={type} className={`btn ${className}`.trim()} {...props}>
    {children}
  </button>
);

export default Button;
