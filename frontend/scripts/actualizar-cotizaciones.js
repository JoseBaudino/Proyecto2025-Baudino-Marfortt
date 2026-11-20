/*
 * Actualiza las cotizaciones de la Bolsa de Cereales leyendo las pizarras oficiales.
 * Lo ejecuta todos los días GitHub Actions (.github/workflows/actualizar-cotizaciones.yml),
 * pero también se puede correr a mano con: npm run cotizaciones
 *
 * Las bolsas no permiten leer sus páginas desde el navegador (CORS), por eso
 * la lectura se hace acá, en Node, y el resultado se guarda como JSON estático
 * que la app después pide con fetch.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const carpetaFrontend = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Archivos donde se guarda el JSON: el de public (código fuente) y el de docs (sitio publicado).
 * @constant
 * @type {Array<string>}
 */
const DESTINOS = [
  path.join(carpetaFrontend, 'public', 'data', 'cotizaciones.json'),
  path.join(carpetaFrontend, '..', 'docs', 'data', 'cotizaciones.json'),
];

/**
 * Convierte un número con formato argentino ("294.084,00") a número (294084).
 * @method aNumero
 * @param {string} texto - Número con puntos de miles y coma decimal
 * @return {number} Número convertido
 */
const aNumero = (texto) => Number(texto.replace(/\./g, '').replace(',', '.'));

/**
 * Descarga una página y la devuelve como texto plano (sin etiquetas HTML ni espacios repetidos).
 * @method leerPagina
 * @param {string} url - Dirección de la página
 * @return {Promise<string>} Texto visible de la página
 */
const leerPagina = async (url) => {
  const respuesta = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (AgroGestion360)' } });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status} en ${url}`);
  const html = await respuesta.text();
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
};

/**
 * Lee la pizarra de Rosario de la Cámara Arbitral de Cereales (BCR).
 * Formato del texto: "Precios Pizarra del día 19/11/2026 Trigo $294.084,00 US$ 189,00 Girasol S/C (E) $746.880,00 US$ (E) 480,00 ..."
 * @method leerRosario
 * @return {Promise<{fecha: string, precios: Array<Object>}>} Fecha de la pizarra y precios
 */
const leerRosario = async () => {
  const texto = await leerPagina('https://www.cac.bcr.com.ar/es/precios-de-pizarra');
  const fecha = texto.match(/Precios Pizarra del d[ií]a (\d{2}\/\d{2}\/\d{4})/)?.[1];
  const regla = /([A-ZÁÉÍÓÚ][a-záéíóúñ]+) (S\/C \(E\) )?\$([\d.]+,\d{2}) US\$ (?:\(E\) )?([\d.]+,\d{2})/g;
  const precios = [...texto.matchAll(regla)].map(([, producto, sinCotizacion, pesos, dolares]) => ({
    producto,
    pesos: aNumero(pesos),
    dolares: aNumero(dolares),
    unidad: 't',
    estimado: Boolean(sinCotizacion),
  }));
  return { fecha, precios };
};

/**
 * Lee la pizarra de Córdoba de la Bolsa de Cereales de Córdoba (BCCBA).
 * Formato del texto: "Pizarra Córdoba 20/11/2026 Trigo duro DIF. $/tn DIF. %/tn S/N (Precio Estimado) $267.075,00 Maní Runner ... $1.056.278,00 U$S681,00 Ver pizarras"
 * @method leerCordoba
 * @return {Promise<{fecha: string, precios: Array<Object>}>} Fecha de la pizarra y precios
 */
const leerCordoba = async () => {
  const texto = await leerPagina('https://www.bccba.org.ar/');
  const bloque = texto.match(/Pizarra C[óo]rdoba (\d{2}\/\d{2}\/\d{4})(.*?)Ver pizarras/);
  if (!bloque) return { fecha: undefined, precios: [] };
  const [, fecha, contenido] = bloque;
  const regla = /([A-ZÁÉÍÓÚ][A-Za-záéíóúñÁÉÍÓÚ ]*?) DIF\. \$\/tn[^$]*?DIF\. %\/tn ([^$]*?)\$([\d.]+,\d{2})(?: U\$S ?([\d.]+,\d{2}))?/g;
  const precios = [...contenido.matchAll(regla)].map(([, producto, notas, pesos, dolares]) => ({
    producto: producto.trim(),
    pesos: aNumero(pesos),
    dolares: dolares ? aNumero(dolares) : null,
    unidad: 't',
    estimado: /S\/[CN]/.test(notas),
  }));
  return { fecha, precios };
};

/**
 * Datos fijos de cada bolsa (nombre, logo, enlace) y la función que lee sus precios.
 * @constant
 * @type {Array<Object>}
 */
const BOLSAS = [
  {
    id: 'rosario',
    nombre: 'Bolsa de Comercio de Rosario',
    descripcion: 'Precios pizarra de la Cámara Arbitral de Cereales',
    logo: 'rosario',
    alt: 'Logo de la Cámara Arbitral de Cereales de Rosario',
    url: 'https://www.cac.bcr.com.ar/es/precios-de-pizarra',
    leer: leerRosario,
  },
  {
    id: 'cordoba',
    nombre: 'Bolsa de Cereales de Córdoba',
    descripcion: 'Pizarra Córdoba',
    logo: 'cordoba',
    alt: 'Logo de la Bolsa de Cereales de Córdoba',
    url: 'https://www.bccba.org.ar/',
    leer: leerCordoba,
  },
];

/**
 * Lee todas las bolsas y guarda el JSON. Si una bolsa no se puede leer,
 * se conservan sus datos anteriores para que la app nunca quede vacía.
 * @method actualizar
 * @return {Promise<void>}
 */
const actualizar = async () => {
  const anteriores = JSON.parse(fs.readFileSync(DESTINOS[0], 'utf8'));
  let leidas = 0;

  const resultado = await Promise.all(
    BOLSAS.map(async ({ leer, ...datos }) => {
      const anterior = anteriores.find((b) => b.id === datos.id);
      try {
        const { fecha, precios } = await leer();
        if (!fecha || precios.length === 0) throw new Error('no se encontraron precios en la página');
        leidas += 1;
        console.log(`✔ ${datos.nombre}: ${precios.length} precios del ${fecha}`);
        return { ...datos, fecha, precios };
      } catch (error) {
        console.warn(`✖ ${datos.nombre}: ${error.message}. Se mantienen los datos anteriores.`);
        return anterior;
      }
    }),
  );

  const json = `${JSON.stringify(resultado.filter(Boolean), null, 2)}\n`;
  DESTINOS.forEach((destino) => {
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.writeFileSync(destino, json);
  });

  if (leidas === 0) {
    console.error('No se pudo leer ninguna bolsa.');
    process.exitCode = 1;
  }
};

actualizar();
