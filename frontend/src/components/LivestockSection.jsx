import { useEffect, useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';
import ConfirmModal from '@/components/ConfirmModal';
import useFormulario from '@/hooks/useFormulario';
import { CLAVES, leerLocal, guardarLocal } from '@/utils/storage';
import { validarNumero, validarTexto, aNumero } from '@/utils/validaciones';

/**
 * Tipos de animales que se pueden registrar.
 * @constant
 * @type {Array<string>}
 */
const ANIMALES = ['Vaca', 'Toro', 'Oveja', 'Gallina', 'Cerdo', 'Caballo'];

/**
 * Validadores del formulario de ganadería.
 * @constant
 * @type {Object<string, Function>}
 */
const VALIDADORES = {
  tipo: (valor) => (valor ? '' : 'Seleccione un tipo de animal'),
  raza: (valor) => validarTexto(valor, 'La raza'),
  cantidad: (valor) => validarNumero(valor, { requerido: true, entero: true, max: 100000 }),
};

/**
 * Sección "Registro de Ganadería": alta de razas con contador +1/-1 persistido en localStorage.
 * @method LivestockSection
 * @return {JSX.Element} Sección de ganadería
 */
const LivestockSection = () => {
  const form = useFormulario({ tipo: '', raza: '', cantidad: '0' }, VALIDADORES);
  const [razas, setRazas] = useState(() => leerLocal(CLAVES.GANADERIA, []));
  const [aEliminar, setAEliminar] = useState(null);

  useEffect(() => {
    guardarLocal(CLAVES.GANADERIA, razas);
  }, [razas]);

  /**
   * Valida el formulario y agrega la raza al inventario.
   * @method agregarRaza
   * @param {React.FormEvent} e - Evento submit del formulario
   * @return {void}
   */
  const agregarRaza = (e) => {
    e.preventDefault();
    const { valido, mensajes } = form.validarTodo();
    if (!valido) {
      alert(`Revise los datos de ganadería:\n- ${mensajes.join('\n- ')}`);
      return;
    }
    const { tipo, raza, cantidad } = form.valores;
    setRazas((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, type: tipo, name: raza.trim(), count: aNumero(cantidad) }]);
    form.reiniciar();
  };

  /**
   * Suma o resta animales a una raza (nunca baja de 0).
   * @method modificarCantidad
   * @param {Object} raza - Raza a modificar
   * @param {number} delta - Cantidad a sumar (1) o restar (-1)
   * @return {void}
   */
  const modificarCantidad = (raza, delta) => {
    setRazas((prev) => prev.map((r) => (r === raza ? { ...r, count: Math.max(0, r.count + delta) } : r)));
  };

  /**
   * Elimina la raza seleccionada y cierra el modal.
   * @method confirmarEliminar
   * @return {void}
   */
  const confirmarEliminar = () => {
    setRazas((prev) => prev.filter((r) => r !== aEliminar));
    setAEliminar(null);
  };

  return (
    <section id="ganaderia" className="section">
      <h2>Registro de Ganadería</h2>
      <Card>
        <form id="breed-form" onSubmit={agregarRaza} noValidate>
          <Input label="Tipo de animal" id="b-type" name="tipo" options={ANIMALES} placeholderOption="Seleccionar animal" value={form.valores.tipo} onChange={form.cambiar} error={form.errores.tipo} />
          <Input label="Raza" id="b-name" name="raza" placeholder="Ej: Aberdeen Angus" maxLength={30} size={30} value={form.valores.raza} onChange={form.cambiar} error={form.errores.raza} />
          <Input label="Cantidad inicial" id="b-initial" name="cantidad" inputMode="numeric" placeholder="0" maxLength={6} size={6} value={form.valores.cantidad} onChange={form.cambiar} error={form.errores.cantidad} />
          <Button type="submit" className="primary">Agregar</Button>
        </form>
      </Card>

      {razas.length === 0 ? (
        <p className="muted">No hay razas registradas.</p>
      ) : (
        <ul id="breeds-list" className="grid">
          {razas.map((r, idx) => (
            <li key={r.id ?? idx} className="item">
              <strong>{r.type}</strong> - {r.name}: {r.count} {r.count === 1 ? 'animal' : 'animales'}
              <Button onClick={() => modificarCantidad(r, 1)} aria-label={`Sumar un animal a ${r.name}`}>+1</Button>
              <Button onClick={() => modificarCantidad(r, -1)} aria-label={`Restar un animal a ${r.name}`}>-1</Button>
              <Button onClick={() => setAEliminar(r)}>Eliminar</Button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        show={Boolean(aEliminar)}
        title="Confirmar eliminación"
        message="¿Estás seguro de que querés eliminar esta raza completa?"
        details={aEliminar && (
          <>
            <strong>{aEliminar.type} - {aEliminar.name}</strong>
            Cantidad actual: {aEliminar.count} {aEliminar.count === 1 ? 'animal' : 'animales'}
          </>
        )}
        confirmText="Eliminar"
        onConfirm={confirmarEliminar}
        onCancel={() => setAEliminar(null)}
      />
    </section>
  );
};

export default LivestockSection;
