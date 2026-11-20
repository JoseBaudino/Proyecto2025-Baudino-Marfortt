/**
 * Consulta el clima actual y la probabilidad de lluvia de la hora actual en Open-Meteo.
 * @method obtenerClima
 * @param {number} lat - Latitud del punto elegido
 * @param {number} lon - Longitud del punto elegido
 * @return {Promise<{temp: number, wind: number, rh: number, prob: number|null, precip: number|null}>} Datos del clima (viento en km/h)
 */
export const obtenerClima = async (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,precipitation&hourly=precipitation_probability&timezone=auto&forecast_days=1`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  const json = await respuesta.json();
  // "current.time" y "hourly.time" vienen en la hora local del punto, así que se comparan entre sí
  const horaActual = json.current?.time?.slice(0, 13);
  const idx = json.hourly?.time?.findIndex((t) => t.slice(0, 13) === horaActual) ?? -1;
  return {
    temp: json.current?.temperature_2m,
    wind: json.current?.wind_speed_10m,
    rh: json.current?.relative_humidity_2m,
    precip: json.current?.precipitation ?? null,
    prob: idx >= 0 ? json.hourly.precipitation_probability[idx] : null,
  };
};
