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
import AdminLayout from '@/components/AdminLayout';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
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
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      </Routes>
    );
  }

  // Sinon, on affiche le site complet avec navigation et footer
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-green-50/20 dark:from-zinc-950 dark:to-zinc-900">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/booking" element={<Booking />} />
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
