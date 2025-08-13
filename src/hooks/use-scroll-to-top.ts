import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll vers le haut de la page à chaque changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Animation fluide
    });
  }, [pathname]); // Se déclenche à chaque changement de pathname
};
