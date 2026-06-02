import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que resetea el scroll al tope de la página
 * cada vez que cambia la ruta. Sin esto, al navegar entre
 * páginas el usuario puede aterrizar a mitad del contenido.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
