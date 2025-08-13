import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Détecter quand l'utilisateur a scrollé suffisamment pour afficher le bouton
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Fonction pour remonter en haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        // Base styles
        'fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full p-0 shadow-lg transition-all duration-300',
        // Couleurs et thème
        'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        'dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800',
        // Animation d'apparition/disparition
        'transform transition-all duration-300 ease-in-out',
        isVisible
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-16 opacity-0 scale-75',
        // Hover effects
        'hover:scale-110 hover:shadow-xl',
        // Focus states
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900'
      )}
      aria-label="Remonter en haut de la page"
    >
      <ChevronUp className="h-6 w-6 text-white" />
    </Button>
  );
};
