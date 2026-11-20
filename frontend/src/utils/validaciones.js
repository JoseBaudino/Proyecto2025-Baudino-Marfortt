/**
 * Valida un email. Devuelve el mensaje de error o una cadena vacía si es válido.
 * @method validarEmail
 * @param {string} email - Email ingresado por el usuario
 * @return {string} Mensaje de error ('' si es válido)
 */
export const validarEmail = (email) => {
  if (!email.trim()) return 'El email es obligatorio';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? '' : 'Ingrese un email válido (ej: nombre@correo.com)';
};

/**
 * Valida una contraseña (mínimo 8 caracteres).
 * @method validarPassword
 * @param {string} password - Contraseña ingresada
 * @return {string} Mensaje de error ('' si es válida)
 */
export const validarPassword = (password) => {
  if (!password) return 'La contraseña es obligatoria';
  return password.length < 8 ? 'La contraseña debe tener al menos 8 caracteres' : '';
};

/**
 * Valida un campo de texto obligatorio, rechazando valores con solo espacios.
 * @method validarTexto
 * @param {string} valor - Texto ingresado
 * @param {string} etiqueta - Nombre del campo, usado en el mensaje de error
 * @return {string} Mensaje de error ('' si es válido)
 */
export const validarTexto = (valor, etiqueta) => (valor.trim() ? '' : `${etiqueta} es obligatorio`);

/**
 * Valida que un valor sea un número dentro de un rango.
 * Acepta coma o punto como separador decimal.
 * @method validarNumero
 * @param {string} valor - Valor ingresado en el input
 * @param {Object} opciones - Reglas de validación
 * @param {boolean} [opciones.requerido=false] - Si el campo es obligatorio
 * @param {number} [opciones.min=0] - Valor mínimo permitido
 * @param {number} [opciones.max=Infinity] - Valor máximo permitido
 * @param {boolean} [opciones.entero=false] - Si solo se aceptan números enteros
 * @return {string} Mensaje de error ('' si es válido)
 */
export const validarNumero = (valor, { requerido = false, min = 0, max = Infinity, entero = false } = {}) => {
  const texto = String(valor).trim();
  if (!texto) return requerido ? 'Este campo es obligatorio' : '';
  const numero = aNumero(texto);
  if (Number.isNaN(numero)) return 'Ingrese solo números';
  if (entero && !Number.isInteger(numero)) return 'Ingrese un número entero';
  if (numero < min) return min === 0 ? 'No se permiten números negativos' : `El valor mínimo es ${min}`;
  if (numero > max) return `El valor máximo es ${max}`;
  return '';
};

/**
 * Convierte el texto de un input en número (acepta coma decimal). Devuelve NaN si no es numérico.
 * @method aNumero
 * @param {string} valor - Texto a convertir
 * @return {number} Número resultante o NaN
 */
export const aNumero = (valor) => {
  const texto = String(valor).trim().replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(texto) ? Number(texto) : NaN;
};
