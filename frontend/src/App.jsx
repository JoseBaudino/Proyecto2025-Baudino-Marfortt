import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import SessionProvider from '@/contexts/SessionProvider';
import MainLayout from '@/layouts/MainLayout';
import IndexPage from '@/pages/IndexPage';
import HomePage from '@/pages/HomePage';

/**
 * Componente raíz: define el proveedor de sesión y las rutas de la aplicación.
 * "/home" es la página de login/registro y "/" la aplicación principal (protegida).
 * @method App
 * @return {JSX.Element} Aplicación con enrutamiento
 */
const App = () => (
  <SessionProvider>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<IndexPage />} />
        </Route>
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  </SessionProvider>
);

export default App;
