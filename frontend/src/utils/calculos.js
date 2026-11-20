/**
 * Calcula el costo total, el ingreso esperado y la utilidad de una siembra.
 * @method calcularCostosSiembra
 * @param {Object} datos - Datos de la siembra (todos numéricos)
 * @param {number} datos.hectareas - Superficie sembrada en hectáreas
 * @param {number} datos.densidad - Dosis de semilla en kg por hectárea
 * @param {number} datos.precioSemilla - Precio de la semilla en USD por kg
 * @param {number} [datos.fertilizante=0] - Costo de fertilizante en USD por hectárea
 * @param {number} [datos.labores=0] - Costo de labores en USD por hectárea
 * @param {number} [datos.combustible=0] - Costo de combustible en USD por hectárea
 * @param {number} [datos.otros=0] - Otros costos en USD por hectárea
 * @param {number} [datos.rendimiento=0] - Rendimiento esperado en toneladas por hectárea
 * @param {number} [datos.precioGrano=0] - Precio del grano en USD por tonelada
 * @return {{costoHa: number, costoTotal: number, ingresoTotal: number, utilidad: number}} Resultados del cálculo
 */
export const calcularCostosSiembra = ({
  hectareas,
  densidad,
  precioSemilla,
  fertilizante = 0,
  labores = 0,
  combustible = 0,
  otros = 0,
  rendimiento = 0,
  precioGrano = 0,
}) => {
  const costoHa = densidad * precioSemilla + fertilizante + labores + combustible + otros;
  const costoTotal = costoHa * hectareas;
  const ingresoTotal = rendimiento * precioGrano * hectareas;
  return { costoHa, costoTotal, ingresoTotal, utilidad: ingresoTotal - costoTotal };
};

/**
 * Formatea un número como importe en dólares con dos decimales (formato argentino).
 * @method formatearUSD
 * @param {number} valor - Importe a formatear
 * @return {string} Importe formateado, por ejemplo "USD 1.234,50"
 */
export const formatearUSD = (valor) =>
  `USD ${Number(valor).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
