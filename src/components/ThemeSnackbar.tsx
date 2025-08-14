import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ThemeSnackbarProps {
  isVisible: boolean;
  theme: string;
  onClose: () => void;
}

const ThemeSnackbar = ({ isVisible, theme, onClose }: ThemeSnackbarProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Attendre la fin de l'animation de sortie
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getThemeInfo = () => {
    switch (theme) {
      case 'light':
        return { icon: '☀️', label: 'Thème clair', color: 'bg-yellow-500' };
      case 'dark':
        return { icon: '🌙', label: 'Thème sombre', color: 'bg-blue-500' };
      case 'system':
        return { icon: '🖥️', label: 'Thème système', color: 'bg-gray-500' };
      default:
        return { icon: '✨', label: 'Thème', color: 'bg-purple-500' };
    }
  };

  const themeInfo = getThemeInfo();

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-500 ease-out ${
      isAnimating 
        ? 'translate-x-0 opacity-100 scale-100' 
        : 'translate-x-full opacity-0 scale-95'
    }`}>
      <div className={`${themeInfo.color}/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] ${
        theme === 'light' ? 'text-black' : 'text-white'
      }`}>
        <div className="text-xl">{themeInfo.icon}</div>
        <div className="flex-1">
          <div className="font-medium">Thème changé</div>
          <div className={`text-sm ${theme === 'light' ? 'opacity-80' : 'opacity-90'}`}>{themeInfo.label} activé</div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSnackbar;
