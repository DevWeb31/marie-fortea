import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'À propos', href: '/about' },
    { name: 'Réservation', href: '/booking' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between sm:h-16">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-green-400 transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10">
              <Baby className="h-4 w-4 text-white sm:h-5 sm:w-5" />
            </div>
            <span className="font-['Poppins'] text-lg font-bold text-gray-800 dark:text-white sm:text-xl">
              Marie Fortea
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 lg:flex xl:space-x-8">
            {navigation.map(item => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'relative whitespace-nowrap text-sm font-medium transition-colors duration-200',
                  isActive(item.href)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400'
                )}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-blue-600 dark:bg-blue-300" />
                )}
              </Link>
            ))}
            <Button
              asChild
              className="whitespace-nowrap rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl xl:px-6"
            >
              <Link to="/booking">Réserver maintenant</Link>
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-gray-600 hover:text-gray-900 sm:p-2"
            >
              {isOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
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
                    'block rounded-lg px-3 py-2.5 text-base font-medium transition-colors duration-200',
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-300'
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
                className="mt-3 w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 py-2.5 text-white hover:from-blue-600 hover:to-blue-700"
                onClick={() => setIsOpen(false)}
              >
                <Link to="/booking">Réserver maintenant</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
