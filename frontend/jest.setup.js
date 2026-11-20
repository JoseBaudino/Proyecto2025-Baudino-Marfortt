import '@testing-library/jest-dom';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Cotizaciones del JSON publicado (public/data), que los tests usan como respuesta de fetch.
 * @constant
 * @type {Array<Object>}
 */
const cotizaciones = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', 'cotizaciones.json'), 'utf8'));

// En los tests no hay red: fetch devuelve siempre el JSON local de cotizaciones
beforeEach(() => {
  global.fetch = jest.fn(async () => ({ ok: true, json: async () => cotizaciones }));
});
