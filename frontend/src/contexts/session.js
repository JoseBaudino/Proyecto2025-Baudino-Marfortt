import { createContext, useContext } from 'react';

/**
 * Contexto que comparte la sesión del usuario en toda la aplicación.
 * @constant
 * @type {React.Context<{session: Object|null, login: Function, logout: Function}|null>}
 */
export const SessionContext = createContext(null);

/**
 * Hook para acceder a la sesión actual (usa useContext).
 * @method useSession
 * @return {{session: Object|null, login: Function, logout: Function}} Sesión y acciones de login/logout
 */
export const useSession = () => {
  const contexto = useContext(SessionContext);
  if (!contexto) throw new Error('useSession debe usarse dentro de <SessionProvider>');
  return contexto;
};
