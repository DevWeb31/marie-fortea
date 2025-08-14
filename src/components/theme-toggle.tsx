import React from 'react';
import { useTheme } from './theme-provider';
import { Button } from '@/components/ui/button';
import ThemeSnackbar from './ThemeSnackbar';

// Icônes SVG personnalisées modernes avec animations
const SunIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="transition-all duration-500 ease-out group-hover:rotate-12 group-hover:scale-110"
  >
    <circle cx="12" cy="12" r="4" className="animate-pulse"/>
    <path d="M12 2v2" className="transition-all duration-300"/>
    <path d="M12 20v2" className="transition-all duration-300"/>
    <path d="m4.93 4.93 1.41 1.41" className="transition-all duration-300"/>
    <path d="m17.66 17.66 1.41 1.41" className="transition-all duration-300"/>
    <path d="M2 12h2" className="transition-all duration-300"/>
    <path d="M20 12h2" className="transition-all duration-300"/>
    <path d="m6.34 17.66-1.41 1.41" className="transition-all duration-300"/>
    <path d="m19.07 4.93-1.41 1.41" className="transition-all duration-300"/>
  </svg>
);

const MoonIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" className="animate-pulse"/>
  </svg>
);

const MonitorIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="transition-all duration-500 ease-out group-hover:scale-110"
  >
    <rect width="20" height="14" x="2" y="3" rx="2" ry="2" className="transition-all duration-300"/>
    <line x1="8" x2="16" y1="21" y2="21" className="transition-all duration-300"/>
    <line x1="12" x2="12" y1="17" y2="21" className="transition-all duration-300"/>
  </svg>
);

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>('light');
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = () => setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    updateSystemTheme();
    mediaQuery.addEventListener('change', updateSystemTheme);
    
    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, []);

  // Détermine l'icône à afficher
  const getCurrentIcon = () => {
    if (theme === 'dark') return <MoonIcon />;
    if (theme === 'light') return <SunIcon />;
    if (theme === 'system') return systemTheme === 'dark' ? <MoonIcon /> : <SunIcon />;
    return <SunIcon />;
  };

  // Animation key pour forcer le re-render et l'animation
  const [iconKey, setIconKey] = React.useState(0);

  React.useEffect(() => {
    setIconKey(prev => prev + 1);
  }, [theme, systemTheme]);

  // Fonction pour passer au thème suivant
  const cycleToNextTheme = () => {
    const themeOrder = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const nextTheme = themeOrder[nextIndex] as 'light' | 'dark' | 'system';
    
    setTheme(nextTheme);
    setShowSnackbar(true);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={cycleToNextTheme}
        className="h-9 w-9 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors relative overflow-hidden group"
      >
        <div 
          key={iconKey}
          className="text-gray-700 dark:text-gray-300 transition-all duration-500 ease-out transform animate-in fade-in-0 zoom-in-95 slide-in-from-top-1"
        >
          {getCurrentIcon()}
        </div>
        <span className="sr-only">Changer le thème</span>
      </Button>

      <ThemeSnackbar
        isVisible={showSnackbar}
        theme={theme}
        onClose={() => setShowSnackbar(false)}
      />
    </>
  );
}

// Composant simple pour les boutons individuels
export function ThemeToggleButtons() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={theme === 'light' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTheme('light')}
        className="flex items-center gap-2"
      >
        <SunIcon />
        Clair
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'outline'}
        onClick={() => setTheme('dark')}
        size="sm"
        className="flex items-center gap-2"
      >
        <MoonIcon />
        Sombre
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTheme('system')}
        className="flex items-center gap-2"
      >
        <MonitorIcon />
        Système
      </Button>
    </div>
  );
}
