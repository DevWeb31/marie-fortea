import React from 'react';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      value: 'light',
      label: 'Thème clair',
      icon: Sun,
    },
    {
      value: 'dark',
      label: 'Thème sombre',
      icon: Moon,
    },
    {
      value: 'system',
      label: 'Système',
      icon: Monitor,
    },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Changer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className={`flex items-center gap-2 ${
              theme === value ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {theme === value && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
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
        <Sun className="h-4 w-4" />
        Clair
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTheme('dark')}
        className="flex items-center gap-2"
      >
        <Moon className="h-4 w-4" />
        Sombre
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setTheme('system')}
        className="flex items-center gap-2"
      >
        <Monitor className="h-4 w-4" />
        Système
      </Button>
    </div>
  );
}
