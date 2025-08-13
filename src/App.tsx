import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/Navigation';
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import About from '@/pages/About';
import Booking from '@/pages/Booking';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import Footer from '@/components/Footer';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="marie-childcare-theme">
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-green-50/20">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;