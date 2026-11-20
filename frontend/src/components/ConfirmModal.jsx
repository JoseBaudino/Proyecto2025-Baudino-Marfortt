import Button from '@/components/Button';

/**
 * Diálogo modal de confirmación reutilizable (eliminar, cerrar sesión, etc.).
 * @method ConfirmModal
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.show - Si el modal está visible
 * @param {string} [props.title='Confirmar acción'] - Título del modal
 * @param {string} [props.message=''] - Mensaje principal
 * @param {React.ReactNode} [props.details=null] - Detalle extra del elemento afectado
 * @param {string} [props.confirmText='Confirmar'] - Texto del botón de confirmación
 * @param {string} [props.cancelText='Cancelar'] - Texto del botón de cancelación
 * @param {Function} props.onConfirm - Función que se ejecuta al confirmar
 * @param {Function} props.onCancel - Función que se ejecuta al cancelar o hacer clic fuera
 * @return {JSX.Element|null} El modal o null si está oculto
 */
const ConfirmModal = ({
  show,
  title = 'Confirmar acción',
  message = '',
  details = null,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  /**
   * Cierra el modal si el clic fue sobre el fondo oscuro (fuera del contenido).
   * @method cerrarAlHacerClicAfuera
   * @param {React.MouseEvent} e - Evento de clic
   * @return {void}
   */
  const cerrarAlHacerClicAfuera = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div className="modal-overlay show" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={cerrarAlHacerClicAfuera}>
      <div className="modal-content">
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
          {details && <div className="confirmation-details">{details}</div>}
        </div>
        <div className="modal-footer">
          <Button className="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button className="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
