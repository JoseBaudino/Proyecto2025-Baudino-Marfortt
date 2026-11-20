import { useState } from 'react';
import { SessionContext } from '@/contexts/session';
import { CLAVES, leerLocal, guardarLocal, borrarLocal } from '@/utils/storage';

/**
 * Proveedor de sesión: guarda la sesión en estado y en localStorage y la comparte por contexto.
 * @method SessionProvider
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes que tendrán acceso a la sesión
 * @return {JSX.Element} Proveedor del contexto de sesión
 */
const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(() => leerLocal(CLAVES.SESION));

  /**
   * Inicia la sesión de un usuario y la persiste en localStorage.
   * @method login
   * @param {string} email - Email del usuario que inicia sesión
   * @return {void}
   */
  const login = (email) => {
    const nuevaSesion = { email, loginTime: new Date().toISOString() };
    guardarLocal(CLAVES.SESION, nuevaSesion);
    setSession(nuevaSesion);
  };

  /**
   * Cierra la sesión actual y la elimina de localStorage.
   * @method logout
   * @return {void}
   */
  const logout = () => {
    borrarLocal(CLAVES.SESION);
    setSession(null);
  };

  return <SessionContext.Provider value={{ session, login, logout }}>{children}</SessionContext.Provider>;
};

export default SessionProvider;
