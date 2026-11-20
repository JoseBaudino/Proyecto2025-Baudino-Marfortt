/**
 * Dirección del JSON de cotizaciones. Es relativa a la página, así funciona igual
 * en desarrollo (localhost) y en GitHub Pages. El archivo lo actualiza todos los días
 * GitHub Actions con el script scripts/actualizar-cotizaciones.js.
 * @constant
 * @type {string}
 */
const URL_COTIZACIONES = 'data/cotizaciones.json';

/**
 * Pide las cotizaciones de las bolsas de cereales.
 * Usa "no-store" para que el navegador no muestre una versión vieja guardada en caché.
 * @method obtenerCotizaciones
 * @return {Promise<Array<Object>>} Lista de bolsas con su fecha y sus precios
 */
export const obtenerCotizaciones = async () => {
  const respuesta = await fetch(URL_COTIZACIONES, { cache: 'no-store' });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  return respuesta.json();
};
