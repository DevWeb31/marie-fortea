import React from 'react';
import { useLocation } from 'react-router-dom';
import { CustomToaster } from '@/components/ui/custom-toaster';
import { ToastProvider } from '@/hooks/use-custom-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin';

  return (
    <ToastProvider>
      <div className="min-h-screen">
        {/* Contenu principal */}
        <div className={`${isLoginPage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
          {children}
        </div>
        
        <CustomToaster />
      </div>
    </ToastProvider>
  );
};

export default AdminLayout;
