import React from 'react';
import { Link } from 'react-router-dom';
import { Baby, Heart, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo & Description */}
          <div className="sm:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Baby className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="font-bold text-lg sm:text-xl font-['Poppins']">
                Marie Fortea
              </span>
            </Link>
            
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 font-['Inter'] leading-relaxed max-w-md">
              Professionnelle de la petite enfance avec plus de 5 ans d'expérience en crèche. 
              Je propose des services de garde occasionnelle de qualité pour vos événements spéciaux et urgences.
            </p>
            
            <div className="flex items-center space-x-2 text-yellow-400">
              <Heart className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Plus de 50 familles font confiance à Marie</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6 font-['Poppins']">
              Navigation
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: 'Accueil', href: '/' },
                { name: 'Services', href: '/services' },
                { name: 'À propos', href: '/about' },
                { name: 'Réservation', href: '/booking' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href}
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-200 font-['Inter']"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6 font-['Poppins']">
              Contact
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <a 
                    href="tel:+33123456789"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-200 font-['Inter']"
                  >
                    06 12 34 56 78
                  </a>
                  <div className="text-xs sm:text-sm text-gray-400">Disponible 7j/7</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <a 
                    href="mailto:marie.fortea@email.com"
                    className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-200 font-['Inter'] break-all"
                  >
                    marie.fortea@email.com
                  </a>
                  <div className="text-xs sm:text-sm text-gray-400">Réponse sous 24h</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm sm:text-base text-gray-300 font-['Inter']">
                  <div>Région Toulousaine</div>
                  <div className="text-xs sm:text-sm text-gray-400">Déplacement possible</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="border-t border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="text-center">
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>CAP Petite Enfance</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Formation Premiers Secours</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>5+ ans d'expérience</span>
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm font-['Inter']">
            © 2024 Marie Fortea - Garde d'Enfants Professionnelle. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-xs mt-1 sm:mt-2">
            Site réalisé avec <Heart className="w-3 h-3 inline text-red-400" /> pour les familles toulousaines
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;