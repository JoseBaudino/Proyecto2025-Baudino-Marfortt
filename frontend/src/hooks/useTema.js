import { useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { CLAVES } from '@/utils/storage';

/**
 * Hook del tema visual (claro u oscuro). Guarda la preferencia en localStorage
 * y la aplica con el atributo data-tema en la etiqueta <html>, que usan los estilos.
 * @method useTema
 * @return {{tema: string, alternarTema: Function}} Tema actual y función para cambiarlo
 */
const useTema = () => {
  const [tema, setTema] = useLocalStorage(CLAVES.TEMA, 'claro');

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
  }, [tema]);

  /**
   * Cambia de claro a oscuro y viceversa.
   * @method alternarTema
   * @return {void}
   */
  const alternarTema = () => setTema(tema === 'claro' ? 'oscuro' : 'claro');

  return { tema, alternarTema };
};

export default useTema;
