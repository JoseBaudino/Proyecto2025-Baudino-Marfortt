import { validarNumero, validarEmail, validarPassword, aNumero } from '@/utils/validaciones';
import { calcularCostosSiembra } from '@/utils/calculos';

describe('Validaciones', () => {
  test('validarNumero rechaza letras, negativos y vacíos obligatorios', () => {
    expect(validarNumero('abc')).toBe('Ingrese solo números');
    expect(validarNumero('-5')).toBe('No se permiten números negativos');
    expect(validarNumero('', { requerido: true })).toBe('Este campo es obligatorio');
    expect(validarNumero('', { requerido: false })).toBe('');
    expect(validarNumero('2.5', { entero: true })).toBe('Ingrese un número entero');
    expect(validarNumero('500', { max: 100 })).toBe('El valor máximo es 100');
    expect(validarNumero('12,5')).toBe('');
  });

  test('aNumero acepta coma decimal y devuelve NaN con texto', () => {
    expect(aNumero('12,5')).toBe(12.5);
    expect(aNumero('1e3')).toBeNaN();
  });

  test('validarEmail y validarPassword detectan datos inválidos', () => {
    expect(validarEmail('juan@correo.com')).toBe('');
    expect(validarEmail('juan@')).not.toBe('');
    expect(validarPassword('1234')).toBe('La contraseña debe tener al menos 8 caracteres');
    expect(validarPassword('12345678')).toBe('');
  });
});

describe('Cálculo de costos de siembra', () => {
  test('calcula costo, ingreso y utilidad correctamente', () => {
    const r = calcularCostosSiembra({
      hectareas: 10, densidad: 80, precioSemilla: 1, fertilizante: 20, rendimiento: 3, precioGrano: 100,
    });
    expect(r.costoHa).toBe(100);
    expect(r.costoTotal).toBe(1000);
    expect(r.ingresoTotal).toBe(3000);
    expect(r.utilidad).toBe(2000);
  });

  test('con todo en cero el resultado es cero', () => {
    const r = calcularCostosSiembra({ hectareas: 0, densidad: 0, precioSemilla: 0 });
    expect(r).toEqual({ costoHa: 0, costoTotal: 0, ingresoTotal: 0, utilidad: 0 });
  });
});
