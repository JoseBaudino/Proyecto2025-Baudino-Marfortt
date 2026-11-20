import cotizaciones from '@/data/cotizaciones.json';

/**
 * Tiempo (en milisegundos) que simula la demora de un servidor real.
 * @constant
 * @type {number}
 */
const DEMORA_SIMULADA = 300;

/**
 * Servicio simulado ("mockeado") de cotizaciones: devuelve los precios de pizarra
 * guardados en el JSON local como si vinieran de un servidor.
 * Si en el futuro hay un backend, solo hay que cambiar esta función por un fetch.
 * @method obtenerCotizaciones
 * @return {Promise<Array<Object>>} Lista de bolsas con sus precios
 */
export const obtenerCotizaciones = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(cotizaciones), DEMORA_SIMULADA);
  });
