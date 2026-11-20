import { useRef, useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';
import ConfirmModal from '@/components/ConfirmModal';
import useFormulario from '@/hooks/useFormulario';
import { validarNumero, validarTexto, aNumero } from '@/utils/validaciones';
import { formatearUSD } from '@/utils/calculos';

/**
 * Tipos de maquinaria disponibles en el formulario.
 * @constant
 * @type {Array<string>}
 */
const TIPOS = ['Tractor', 'Arado', 'Sembradora', 'Pulverizadora', 'Cosechadora', 'Mixer', 'Cabezal'];

/**
 * Estados posibles de una máquina.
 * @constant
 * @type {Array<string>}
 */
const ESTADOS = ['Activo', 'Inactivo'];

/**
 * Validadores del formulario de maquinaria.
 * @constant
 * @type {Object<string, Function>}
 */
const VALIDADORES = {
  nombre: (valor) => validarTexto(valor, 'El nombre'),
  tipo: (valor) => (valor ? '' : 'Seleccione un tipo'),
  estado: (valor) => (valor ? '' : 'Seleccione un estado'),
  precio: (valor) => validarNumero(valor, { requerido: true, max: 100000000 }),
};

/**
 * Sección "Organizador de Maquinaria": formulario de alta con foto opcional,
 * buscador con filtro por estado y listado de máquinas.
 * @method MachinerySection
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} props.maquinas - Lista de máquinas (guardada en localStorage por IndexPage)
 * @param {Function} props.setMaquinas - Función para actualizar la lista
 * @return {JSX.Element} Sección de maquinaria
 */
const MachinerySection = ({ maquinas, setMaquinas }) => {
  const form = useFormulario({ nombre: '', tipo: '', estado: '', precio: '', notas: '' }, VALIDADORES);
  const [foto, setFoto] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const inputFoto = useRef(null);

  // Lista filtrada en tiempo real: por nombre/tipo (texto) y por estado (select)
  const maquinasFiltradas = maquinas.filter((m) => {
    const texto = busqueda.trim().toLowerCase();
    const coincideTexto = m.name.toLowerCase().includes(texto) || m.type.toLowerCase().includes(texto);
    const coincideEstado = filtroEstado === '' || m.condition === filtroEstado;
    return coincideTexto && coincideEstado;
  });

  /**
   * Lee la imagen elegida y la guarda como data URL para mostrarla y persistirla.
   * @method cambiarFoto
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio del input file
   * @return {void}
   */
  const cambiarFoto = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) {
      setFoto(null);
      return;
    }
    if (!archivo.type.startsWith('image/')) {
      alert('El archivo seleccionado no es una imagen.');
      e.target.value = '';
      return;
    }
    const lector = new FileReader();
    lector.onload = (ev) => setFoto(ev.target.result);
    lector.readAsDataURL(archivo);
  };

  /**
   * Valida el formulario y agrega la máquina a la lista.
   * @method agregarMaquina
   * @param {React.FormEvent} e - Evento submit del formulario
   * @return {void}
   */
  const agregarMaquina = (e) => {
    e.preventDefault();
    const { valido, mensajes } = form.validarTodo();
    if (!valido) {
      alert(`Revise los datos de la maquinaria:\n- ${mensajes.join('\n- ')}`);
      return;
    }
    const { nombre, tipo, estado, precio, notas } = form.valores;
    const nueva = { id: `${Date.now()}-${Math.random()}`, name: nombre.trim(), type: tipo, condition: estado, price: aNumero(precio), notes: notas.trim(), photo: foto };
    setMaquinas((prev) => [...prev, nueva]);
    form.reiniciar();
    setFoto(null);
    if (inputFoto.current) inputFoto.current.value = '';
  };

  /**
   * Elimina la máquina seleccionada y cierra el modal.
   * @method confirmarEliminar
   * @return {void}
   */
  const confirmarEliminar = () => {
    setMaquinas((prev) => prev.filter((m) => m !== aEliminar));
    setAEliminar(null);
  };

  return (
    <section id="maquinaria" className="section">
      <h2>Organizador de Maquinaria</h2>
      <Card>
        <form id="machinery-form" className="form-grid" onSubmit={agregarMaquina} noValidate>
          <Input label="Nombre" id="m-name" name="nombre" placeholder="Ej: John Deere 6145J" maxLength={40} size={40} value={form.valores.nombre} onChange={form.cambiar} error={form.errores.nombre} />
          <Input label="Tipo" id="m-type" name="tipo" options={TIPOS} placeholderOption="Seleccionar tipo" value={form.valores.tipo} onChange={form.cambiar} error={form.errores.tipo} />
          <Input label="Estado" id="m-condition" name="estado" options={ESTADOS} placeholderOption="Seleccionar estado" value={form.valores.estado} onChange={form.cambiar} error={form.errores.estado} />
          <Input label="Precio (USD)" id="m-price" name="precio" inputMode="decimal" placeholder="Ej: 85000" maxLength={12} size={12} value={form.valores.precio} onChange={form.cambiar} error={form.errores.precio} />
          <Input label="Notas" id="m-notes" name="notas" placeholder="Observaciones (opcional)" maxLength={100} size={40} value={form.valores.notas} onChange={form.cambiar} />
          <div className="form-group">
            <label htmlFor="m-photo">Foto (opcional)</label>
            <input id="m-photo" type="file" accept="image/*" ref={inputFoto} onChange={cambiarFoto} />
          </div>
          <div className="form-actions">
            <Button type="submit" className="primary">Agregar</Button>
          </div>
        </form>
      </Card>

      {maquinas.length > 0 && (
        <div className="filtros">
          <Input label="Buscar" id="m-buscar" type="search" placeholder="Nombre o tipo de máquina" maxLength={40} size={30} value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <Input label="Estado" id="m-filtro-estado" options={ESTADOS} placeholderOption="Todos" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} />
        </div>
      )}

      {maquinas.length === 0 && <p className="muted">No hay maquinaria cargada.</p>}
      {maquinas.length > 0 && maquinasFiltradas.length === 0 && <p className="muted">Ninguna máquina coincide con la búsqueda.</p>}

      {maquinasFiltradas.length > 0 && (
        <ul id="machinery-list" className="grid">
          {maquinasFiltradas.map((m, idx) => (
            <li key={m.id ?? idx} className="item machinery-item">
              {m.photo && <img src={m.photo} alt={`Foto de ${m.name}`} className="machinery-image" />}
              <div className="machinery-info">
                <h3>{m.name}</h3>
                <p>
                  {m.type} · <span className={`badge ${m.condition === 'Activo' ? 'badge-ok' : 'badge-off'}`}>{m.condition}</span>
                </p>
                <p className="precio">{formatearUSD(m.price)}</p>
                {m.notes && <p className="muted">{m.notes}</p>}
              </div>
              <div className="item-actions">
                <Button className="danger" onClick={() => setAEliminar(m)}>Eliminar</Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        show={Boolean(aEliminar)}
        title="Confirmar eliminación"
        message="¿Estás seguro de que querés eliminar esta maquinaria?"
        details={aEliminar && (
          <>
            <strong>{aEliminar.name}</strong>
            Tipo: {aEliminar.type} · Estado: {aEliminar.condition} · Precio: {formatearUSD(aEliminar.price)}
          </>
        )}
        confirmText="Eliminar"
        onConfirm={confirmarEliminar}
        onCancel={() => setAEliminar(null)}
      />
    </section>
  );
};

export default MachinerySection;
