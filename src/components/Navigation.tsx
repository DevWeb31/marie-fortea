import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Baby className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-gray-800 font-['Poppins']">
              Marie Fortea
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 relative whitespace-nowrap",
                  isActive(item.href)
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                )}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            ))}
            <Button 
              asChild 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 xl:px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm whitespace-nowrap"
            >
              <Link to="/booking">Réserver maintenant</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 p-1.5 sm:p-2"
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-blue-100 shadow-lg">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 text-base font-medium rounded-lg transition-colors duration-200",
                    isActive(item.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Button 
                asChild 
                className="w-full mt-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full py-2.5"
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