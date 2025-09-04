import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import Logo from './Logo';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'À propos', href: '/about' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1920px]">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Logo size="md" />
                <span className="hidden font-['Poppins'] text-lg font-bold text-gray-900 dark:text-white sm:block">
                  Marie Fortea
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              {navigation.map(item => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors duration-200 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300',
                    isActive(item.href)
                      ? 'text-blue-600 dark:text-blue-300'
                      : 'text-gray-700 dark:text-slate-300'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <ThemeToggle />
              <Button
                asChild
                className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 text-white hover:from-blue-600 hover:to-blue-700 hover:text-blue-100"
              >
                <Link to="/booking">Réserver maintenant</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all duration-300 ease-out"
                aria-label="Menu de navigation"
              >
                {/* Ligne du haut */}
                <div className={cn(
                  "absolute h-0.5 w-5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ease-out",
                  isOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"
                )} />
                
                {/* Ligne du milieu */}
                <div className={cn(
                  "absolute h-0.5 w-5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ease-out",
                  isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                )} />
                
                {/* Ligne du bas */}
                <div className={cn(
                  "absolute h-0.5 w-5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ease-out",
                  isOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"
                )} />
                
                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden">
              <div className="space-y-1 border-t border-blue-100 bg-white px-2 pb-3 pt-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                {navigation.map(item => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block rounded-lg px-3 py-2.5 text-base font-medium transition-all duration-200 hover:scale-[1.02]',
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500 dark:text-slate-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-300'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Thème :
                  </span>
                  <ThemeToggle />
                </div>
                <Button
                  asChild
                  className="mt-3 w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 py-2.5 text-white hover:from-blue-600 hover:to-blue-700 hover:text-blue-100 transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/booking">Réserver maintenant</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
