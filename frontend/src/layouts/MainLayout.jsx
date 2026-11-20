import { useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/session';
import ConfirmModal from '@/components/ConfirmModal';

/**
 * Secciones de la página principal que aparecen en el menú de navegación.
 * @constant
 * @type {Array<{id: string, texto: string}>}
 */
const SECCIONES = [
  { id: 'inicio', texto: 'Inicio' },
  { id: 'maquinaria', texto: 'Maquinaria' },
  { id: 'ganaderia', texto: 'Ganadería' },
  { id: 'siembra', texto: 'Calculadora' },
  { id: 'clima', texto: 'Clima' },
  { id: 'bolsa', texto: 'Bolsa de Cereales' },
];

/**
 * Layout principal: cabecera con navegación, contenido de la ruta hija (Outlet) y pie de página.
 * Si no hay sesión iniciada redirige a la página de login.
 * @method MainLayout
 * @return {JSX.Element} Estructura común de las páginas protegidas
 */
const MainLayout = () => {
  const navigate = useNavigate();
  const { session, logout } = useSession();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  if (!session) return <Navigate to="/home" replace />;

  /**
   * Cierra la sesión y vuelve a la página de login.
   * @method confirmarLogout
   * @return {void}
   */
  const confirmarLogout = () => {
    setMostrarModal(false);
    logout();
    navigate('/home');
  };

  /**
   * Devuelve un manejador de clic que hace scroll suave hasta la sección indicada
   * y cierra el menú (en celulares).
   * @method irASeccion
   * @param {string} id - Id de la sección destino
   * @return {Function} Manejador del evento click
   */
  const irASeccion = (id) => (e) => {
    e.preventDefault();
    setMenuAbierto(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Abre el modal de confirmación de cierre de sesión.
   * @method pedirLogout
   * @param {React.MouseEvent} e - Evento de clic
   * @return {void}
   */
  const pedirLogout = (e) => {
    e.preventDefault();
    setMenuAbierto(false);
    setMostrarModal(true);
  };

  return (
    <div>
      <header className="site-header">
        <h1 className="site-title">
          <span className="logo">
            🌾 AgroGestión <span className="accent">360</span>
          </span>
        </h1>
        {/* Botón hamburguesa: solo se ve en pantallas chicas (ver estilos) */}
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          aria-controls="menu-principal"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {menuAbierto ? '✕' : '☰'}
        </button>
        <nav id="menu-principal" className={`main-nav ${menuAbierto ? 'abierto' : ''}`} aria-label="Navegación principal">
          <span id="user-info" className="user-info">
            👤 {session.email}
          </span>
          {SECCIONES.map(({ id, texto }) => (
            <a key={id} href={`#${id}`} onClick={irASeccion(id)}>
              {texto}
            </a>
          ))}
          <a href="#/home" id="logout-btn" className="logout-btn" onClick={pedirLogout}>
            Cerrar Sesión
          </a>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2025 AgroGestión 360 - Marfortt, Renzo y Baudino, José</p>
      </footer>

      <ConfirmModal
        show={mostrarModal}
        title="Cerrar sesión"
        message="Se cerrará tu sesión actual y volverás a la página de inicio."
        details={<strong>👤 {session.email}</strong>}
        confirmText="Cerrar sesión"
        onConfirm={confirmarLogout}
        onCancel={() => setMostrarModal(false)}
      />
    </div>
  );
};

export default MainLayout;
