import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import SessionProvider from '@/contexts/SessionProvider';
import MainLayout from '@/layouts/MainLayout';
import IndexPage from '@/pages/IndexPage';
import HomePage from '@/pages/HomePage';
import useTema from '@/hooks/useTema';

/**
 * Componente raíz: define el proveedor de sesión, el tema y las rutas de la aplicación.
 * "/home" es la página de login/registro y "/" la aplicación principal (protegida).
 * @method App
 * @return {JSX.Element} Aplicación con enrutamiento
 */
const App = () => {
  // El tema se maneja acá para que se aplique en todas las páginas (también en el login)
  const { tema, alternarTema } = useTema();

  return (
    <SessionProvider>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route element={<MainLayout tema={tema} alternarTema={alternarTema} />}>
            <Route path="/" element={<IndexPage />} />
          </Route>
          <Route path="/home" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </SessionProvider>
  );
};

export default App;
