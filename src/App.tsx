import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/Navigation';
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import About from '@/pages/About';
import Booking from '@/pages/Booking';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import PricingManagement from '@/pages/PricingManagement';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import TestEmail from '@/pages/TestEmail';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import MouseTrail from '@/components/MouseTrail';
import './App.css';

// Composant wrapper pour le scroll automatique
function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  useScrollToTop(); // Hook pour le scroll automatique

  // Si c'est une page admin, on n'affiche que le contenu
  if (isAdminPage) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout><AdminLogin /></AdminLayout>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/pricing" element={<ProtectedRoute><AdminLayout><PricingManagement /></AdminLayout></ProtectedRoute>} />
      </Routes>
    );
  }

  // Sinon, on affiche le site complet avec navigation et footer
  return (
    <div className="min-h-screen">
      {/* Sphères flottantes */}
      <div className="floating-sphere-1"></div>
      <div className="floating-sphere-2"></div>
      <div className="floating-sphere-3"></div>
      
      {/* Effet de traînée de bulles */}
      <MouseTrail />
      
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/test-email" element={<TestEmail />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="marie-childcare-theme">
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
