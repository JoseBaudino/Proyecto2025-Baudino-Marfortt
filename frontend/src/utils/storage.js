/**
 * Claves usadas en localStorage por la aplicación.
 * @constant
 * @type {{USUARIO: string, SESION: string, MAQUINARIA: string, GANADERIA: string}}
 */
export const CLAVES = {
  USUARIO: 'agroGestion_user',
  SESION: 'agroGestion_session',
  MAQUINARIA: 'agroGestion_machinery',
  GANADERIA: 'agroGestion_breeds',
};

/**
 * Lee un valor JSON de localStorage. Si no existe o está dañado devuelve el valor por defecto.
 * @method leerLocal
 * @param {string} clave - Clave de localStorage a leer
 * @param {*} porDefecto - Valor que se devuelve si la clave no existe o no se puede leer
 * @return {*} Valor almacenado (ya parseado) o el valor por defecto
 */
export const leerLocal = (clave, porDefecto = null) => {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo ? JSON.parse(crudo) : porDefecto;
  } catch (error) {
    console.error(`No se pudo leer "${clave}" de localStorage:`, error);
    return porDefecto;
  }
};

/**
 * Guarda un valor en localStorage serializado como JSON.
 * @method guardarLocal
 * @param {string} clave - Clave de localStorage donde se guarda el valor
 * @param {*} valor - Valor a guardar
 * @return {void}
 */
export const guardarLocal = (clave, valor) => {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    console.error(`No se pudo guardar "${clave}" en localStorage:`, error);
  }
};

/**
 * Elimina una clave de localStorage.
 * @method borrarLocal
 * @param {string} clave - Clave de localStorage a eliminar
 * @return {void}
 */
export const borrarLocal = (clave) => {
  try {
    localStorage.removeItem(clave);
  } catch (error) {
    console.error(`No se pudo borrar "${clave}" de localStorage:`, error);
  }
};
