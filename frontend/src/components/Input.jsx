/**
 * Campo de formulario genérico con label y mensaje de error accesible.
 * Si recibe "options" renderiza un select; si no, un input.
 * @method Input
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Texto del label
 * @param {string} props.id - Id del campo (se usa en el atributo for del label)
 * @param {string} [props.error=''] - Mensaje de error a mostrar debajo del campo
 * @param {Array<string>} [props.options] - Opciones del select (si se pasa, se renderiza un select)
 * @param {string} [props.placeholderOption] - Texto de la primera opción vacía del select
 * @return {JSX.Element} Grupo label + campo + error
 */
const Input = ({ label, id, error = '', options, placeholderOption = 'Seleccionar…', ...props }) => {
  const aria = error ? { 'aria-invalid': true, 'aria-describedby': `${id}-error` } : {};
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      {options ? (
        <select id={id} {...aria} {...props}>
          <option value="">{placeholderOption}</option>
          {options.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      ) : (
        <input id={id} {...aria} {...props} />
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
