import React from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import MaintenanceToggle from './MaintenanceToggle';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin';

  return (
    <div className={`min-h-screen ${isLoginPage ? '' : 'bg-gray-50 dark:bg-gray-900'}`}>
      {/* Barre de maintenance en haut - seulement si ce n'est pas la page de connexion */}
      {!isLoginPage && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <MaintenanceToggle />
          </div>
        </div>
      )}
      
      {/* Contenu principal */}
      <div className={`${isLoginPage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
        {children}
      </div>
      
      <Toaster />
    </div>
  );
};

export default AdminLayout;
