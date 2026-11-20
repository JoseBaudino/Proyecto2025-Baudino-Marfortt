import { useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';
import useFormulario from '@/hooks/useFormulario';
import { validarNumero, aNumero } from '@/utils/validaciones';
import { calcularCostosSiembra, formatearUSD } from '@/utils/calculos';

/**
 * Definición de los campos de la calculadora (id, etiqueta, si es obligatorio y valor máximo).
 * @constant
 * @type {Array<{campo: string, id: string, label: string, requerido: boolean, max: number}>}
 */
const CAMPOS = [
  { campo: 'hectareas', id: 'hectareas', label: 'Hectáreas *', requerido: true, max: 1000000 },
  { campo: 'densidad', id: 'densidad', label: 'Dosis de semilla (kg/ha) *', requerido: true, max: 10000 },
  { campo: 'precioSemilla', id: 'precio-semilla', label: 'Precio semilla (USD/kg) *', requerido: true, max: 100000 },
  { campo: 'fertilizante', id: 'fertil', label: 'Fertilizante (USD/ha)', requerido: false, max: 100000 },
  { campo: 'labores', id: 'labores', label: 'Labores (USD/ha)', requerido: false, max: 100000 },
  { campo: 'combustible', id: 'combustible', label: 'Combustible (USD/ha)', requerido: false, max: 100000 },
  { campo: 'otros', id: 'otros', label: 'Otros (USD/ha)', requerido: false, max: 100000 },
  { campo: 'rendimiento', id: 'rendimiento', label: 'Rendimiento (t/ha)', requerido: false, max: 1000 },
  { campo: 'precioGrano', id: 'precio-grano', label: 'Precio grano (USD/t)', requerido: false, max: 100000 },
];

/**
 * Valores iniciales (vacíos) de todos los campos.
 * @constant
 * @type {Object<string, string>}
 */
const INICIALES = Object.fromEntries(CAMPOS.map(({ campo }) => [campo, '']));

/**
 * Validadores de la calculadora (todos numéricos, no negativos).
 * @constant
 * @type {Object<string, Function>}
 */
const VALIDADORES = Object.fromEntries(
  CAMPOS.map(({ campo, requerido, max }) => [campo, (valor) => validarNumero(valor, { requerido, max })]),
);

/**
 * Sección "Calculadora de Costos de Siembra": calcula costo total, ingreso y utilidad estimada.
 * @method CostCalculator
 * @return {JSX.Element} Sección de la calculadora
 */
const CostCalculator = () => {
  const form = useFormulario(INICIALES, VALIDADORES);
  const [resultado, setResultado] = useState(null);

  /**
   * Valida los datos ingresados y muestra el resultado del cálculo.
   * Si hay datos inválidos avisa con un alert y blanquea esos campos.
   * @method calcular
   * @param {React.FormEvent} e - Evento submit del formulario
   * @return {void}
   */
  const calcular = (e) => {
    e.preventDefault();
    const { valido, mensajes } = form.validarTodo();
    if (!valido) {
      setResultado(null);
      alert(`No se pudo calcular. Revise los campos marcados:\n- ${[...new Set(mensajes)].join('\n- ')}`);
      return;
    }
    const numeros = Object.fromEntries(Object.entries(form.valores).map(([campo, valor]) => [campo, valor ? aNumero(valor) : 0]));
    setResultado(calcularCostosSiembra(numeros));
  };

  /**
   * Limpia el formulario y el resultado.
   * @method limpiar
   * @return {void}
   */
  const limpiar = () => {
    form.reiniciar();
    setResultado(null);
  };

  return (
    <section id="siembra" className="section">
      <h2>Calculadora de Costos de Siembra</h2>
      <p className="muted">Los campos con * son obligatorios.</p>
      <Card>
        <form id="calc-form" onSubmit={calcular} noValidate>
          {CAMPOS.map(({ campo, id, label }) => (
            <Input key={campo} label={label} id={id} name={campo} inputMode="decimal" placeholder="0" maxLength={10} size={10} value={form.valores[campo]} onChange={form.cambiar} error={form.errores[campo]} />
          ))}
          <Button type="submit" className="primary">Calcular</Button>
          <Button className="secondary" onClick={limpiar}>Limpiar</Button>
        </form>
      </Card>
      {resultado && (
        <div id="calc-results" className="card" aria-live="polite">
          <p><strong>Costo por hectárea:</strong> {formatearUSD(resultado.costoHa)}</p>
          <p><strong>Costo total:</strong> {formatearUSD(resultado.costoTotal)}</p>
          <p><strong>Ingreso esperado:</strong> {formatearUSD(resultado.ingresoTotal)}</p>
          <p><strong>Utilidad estimada:</strong> {formatearUSD(resultado.utilidad)}</p>
        </div>
      )}
    </section>
  );
};

export default CostCalculator;
