import React from 'react';
import { Toaster } from '@/components/ui/toaster';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default AdminLayout;
