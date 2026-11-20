import { useState } from 'react';

/**
 * Hook para manejar formularios controlados con validación en tiempo real (onChange).
 * @method useFormulario
 * @param {Object<string, string>} valoresIniciales - Valor inicial de cada campo (clave = atributo name)
 * @param {Object<string, Function>} validadores - Función validadora por campo: (valor, valores) => mensaje de error ('' si es válido)
 * @return {{valores: Object, errores: Object, cambiar: Function, validarTodo: Function, reiniciar: Function, setValor: Function}} Estado y acciones del formulario
 */
const useFormulario = (valoresIniciales, validadores = {}) => {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});

  /**
   * Obtiene el mensaje de error de un campo según su validador.
   * @method errorDe
   * @param {string} campo - Nombre del campo
   * @param {Object} todos - Valores actuales de todo el formulario
   * @return {string} Mensaje de error ('' si es válido o no tiene validador)
   */
  const errorDe = (campo, todos) => (validadores[campo] ? validadores[campo](todos[campo], todos) : '');

  /**
   * Cambia el valor de un campo y lo valida al instante.
   * @method setValor
   * @param {string} campo - Nombre del campo
   * @param {string} valor - Nuevo valor
   * @return {void}
   */
  const setValor = (campo, valor) => {
    const nuevos = { ...valores, [campo]: valor };
    setValores(nuevos);
    setErrores((prev) => ({ ...prev, [campo]: errorDe(campo, nuevos) }));
  };

  /**
   * Manejador onChange para inputs y selects (usa el atributo name).
   * @method cambiar
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e - Evento de cambio
   * @return {void}
   */
  const cambiar = (e) => setValor(e.target.name, e.target.value);

  /**
   * Valida todos los campos. Los que son inválidos se blanquean y quedan con su mensaje de error.
   * @method validarTodo
   * @return {{valido: boolean, mensajes: Array<string>}} Si el formulario es válido y la lista de errores
   */
  const validarTodo = () => {
    const nuevosErrores = {};
    const nuevosValores = { ...valores };
    Object.keys(valores).forEach((campo) => {
      const error = errorDe(campo, valores);
      nuevosErrores[campo] = error;
      if (error) nuevosValores[campo] = '';
    });
    setErrores(nuevosErrores);
    setValores(nuevosValores);
    const mensajes = Object.values(nuevosErrores).filter(Boolean);
    return { valido: mensajes.length === 0, mensajes };
  };

  /**
   * Vuelve el formulario a sus valores iniciales y borra los errores.
   * @method reiniciar
   * @return {void}
   */
  const reiniciar = () => {
    setValores(valoresIniciales);
    setErrores({});
  };

  return { valores, errores, cambiar, validarTodo, reiniciar, setValor };
};

export default useFormulario;
