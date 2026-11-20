import { useEffect, useState } from 'react';
import { leerLocal, guardarLocal } from '@/utils/storage';

/**
 * Hook que funciona como useState pero guarda el valor en localStorage automáticamente.
 * @method useLocalStorage
 * @param {string} clave - Clave de localStorage donde se guarda el valor
 * @param {*} valorInicial - Valor que se usa si todavía no hay nada guardado
 * @return {Array} Par [valor, setValor], igual que useState
 */
const useLocalStorage = (clave, valorInicial) => {
  const [valor, setValor] = useState(() => leerLocal(clave, valorInicial));

  // Cada vez que cambia el valor, se guarda en localStorage
  useEffect(() => {
    guardarLocal(clave, valor);
  }, [clave, valor]);

  return [valor, setValor];
};

export default useLocalStorage;
