import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/Navigation';
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import About from '@/pages/About';
import Booking from '@/pages/Booking';
import NotFound from '@/pages/NotFound';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import PricingManagement from '@/pages/PricingManagement';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import TestEmail from '@/pages/TestEmail';
import DetailedBookingForm from '@/components/DetailedBookingForm';
import BookingConfirmed from '@/pages/BookingConfirmed';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import DataManagementPage from '@/pages/DataManagementPage';
import CookiesPolicy from '@/pages/CookiesPolicy';
import DataDownload from '@/pages/DataDownload';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import GDPRConsent from '@/components/GDPRConsent';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import MouseTrail from '@/components/MouseTrail';
import MaintenanceMode from '@/components/MaintenanceMode';
import { SiteSettingsService } from '@/lib/site-settings-service';
import './App.css';

// Composant wrapper pour le scroll automatique
function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean | null>(null);
  useScrollToTop(); // Hook pour le scroll automatique

  // Vérifier le mode maintenance au chargement
  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const result = await SiteSettingsService.isMaintenanceModeEnabled();
        if (result.data !== null) {
          setIsMaintenanceMode(result.data);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du mode maintenance:', error);
        setIsMaintenanceMode(false); // En cas d'erreur, on considère que le mode maintenance est désactivé
      }
    };

    checkMaintenanceMode();
  }, []);

  // Afficher un indicateur de chargement pendant la vérification du mode maintenance
  if (isMaintenanceMode === null && !isAdminPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si le mode maintenance est activé et que ce n'est pas une page admin, afficher la page de maintenance
  if (isMaintenanceMode === true && !isAdminPage) {
    return <MaintenanceMode />;
  }

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
          <Route path="/detailed-booking-form/:token" element={<DetailedBookingForm />} />
          <Route path="/booking-confirmed" element={<BookingConfirmed />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/data-management" element={<DataManagementPage />} />
          <Route path="/cookies-policy" element={<CookiesPolicy />} />
          <Route path="/data-download/:token" element={<DataDownload />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopButton />
      
      {/* Composants RGPD */}
      <CookieBanner />
      <GDPRConsent />
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
