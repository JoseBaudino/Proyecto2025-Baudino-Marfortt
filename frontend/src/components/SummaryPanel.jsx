import { formatearUSD } from '@/utils/calculos';

/**
 * Panel de resumen de la portada: totales calculados a partir de la maquinaria y la ganadería.
 * @method SummaryPanel
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} props.maquinas - Lista de máquinas cargadas
 * @param {Array<Object>} props.razas - Lista de razas cargadas
 * @return {JSX.Element} Recuadros con los totales
 */
const SummaryPanel = ({ maquinas, razas }) => {
  // reduce() recorre la lista y va acumulando un total
  const totalAnimales = razas.reduce((total, r) => total + r.count, 0);
  const valorMaquinaria = maquinas.reduce((total, m) => total + m.price, 0);
  const maquinasActivas = maquinas.filter((m) => m.condition === 'Activo').length;

  return (
    <div className="resumen" aria-label="Resumen del campo">
      <div className="resumen-item">
        <span>Máquinas activas</span>
        <strong>{maquinasActivas} / {maquinas.length}</strong>
      </div>
      <div className="resumen-item">
        <span>Animales</span>
        <strong>{totalAnimales.toLocaleString('es-AR')}</strong>
      </div>
      <div className="resumen-item">
        <span>Valor de la maquinaria</span>
        <strong>{formatearUSD(valorMaquinaria)}</strong>
      </div>
    </div>
  );
};

export default SummaryPanel;
