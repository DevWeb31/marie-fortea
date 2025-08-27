import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Phone,
  MapPin,
  Info,
} from 'lucide-react';
import PhoneHoursDialog from './PhoneHoursDialog';
import MapDialog from './MapDialog';
import Logo from './Logo';

const Footer = () => {
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

  const handlePhoneClick = () => {
    setIsPhoneDialogOpen(true);
  };

  const handleMapClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🗺️ Footer: handleMapClick appelé');
    console.log('🗺️ Footer: État actuel isMapDialogOpen:', isMapDialogOpen);
    setIsMapDialogOpen(true);
    console.log('🗺️ Footer: isMapDialogOpen mis à true');
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {/* Logo & Description */}
          <div className="sm:col-span-2">
            <Link to="/" className="group mb-6 flex items-center space-x-2">
              <Logo size="md" />
              <div className="flex items-center space-x-2">
                <span className="font-['Poppins'] text-lg font-bold sm:text-xl">
                  Marie Fortea
                </span>
                <svg 
                  onClick={() => window.location.href = '/admin'}
                  className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors duration-200 opacity-60 hover:opacity-100 cursor-pointer"
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  title="Accès administrateur"
                >
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>

            <p className="mb-4 max-w-md font-['Inter'] text-sm leading-relaxed text-gray-300 sm:mb-6 sm:text-base">
              Professionnelle de la petite enfance avec plus de 16 ans
              d'expérience en crèche. Je propose des services de garde
              occasionnelle de qualité pour vos événements spéciaux et urgences.
            </p>

            <div className="flex items-center space-x-2 text-yellow-400">
              <Heart className="h-4 w-4" />
              <span className="text-xs font-medium sm:text-sm">
                Plus de 50 familles font confiance à Marie
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-['Poppins'] text-base font-semibold sm:mb-6 sm:text-lg">
              Navigation
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: 'Accueil', href: '/' },
                { name: 'Services', href: '/services' },
                { name: 'À propos', href: '/about' },
                { name: 'Réservation', href: '/booking' },
              ].map(item => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="font-['Inter'] text-sm text-gray-300 transition-colors duration-200 hover:text-white sm:text-base"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-['Poppins'] text-base font-semibold sm:mb-6 sm:text-lg">
              Contact
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <button
                  onClick={handlePhoneClick}
                  className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
                >
                  <span className="text-white text-xs font-bold">📞</span>
                </button>
                <div>
                  <div className="font-['Inter'] text-sm text-gray-300 sm:text-base">
                    07 57 57 93 30
                  </div>
                  <div className="text-xs text-gray-400 sm:text-sm">
                    Horaires d'appel :
                  </div>
                  <div className="text-xs text-gray-400 sm:text-sm">
                    Lun-Ven : 19h-21h
                  </div>
                  <div className="text-xs text-gray-400 sm:text-sm">
                    Week-end : 9h-21h
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <button
                  onClick={handleMapClick}
                  className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 cursor-pointer"
                >
                  <MapPin className="h-4 w-4 flex-shrink-0 text-white sm:h-5 sm:w-5" />
                </button>
                <div className="font-['Inter'] text-sm text-gray-300 sm:text-base">
                  <div>Montaigut sur Save</div>
                  <div className="text-xs text-gray-400 sm:text-sm flex items-center space-x-1">
                    <span>Rayon de 20km</span>
                    <div className="group relative">
                      <Info className="h-3 w-3 text-blue-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        <div className="font-medium mb-1">Villes exemples (rayon 20km) :</div>
                        <div>Blagnac, Mondonville,</div>
                        <div>Grenade, L'Isle-Jourdain,</div>
                        <div>Lévignac, Daux,</div>
                        <div>Saint-Paul-sur-Save</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-8 border-t border-gray-700 pt-6 sm:mt-12 sm:pt-8">
          <div className="text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 sm:gap-8 sm:text-sm">
              <span className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span>CAP Petite Enfance</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <span>Formation Premiers Secours</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                <span>16 ans d'expérience</span>
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-gray-700 pt-6 text-center sm:mt-8 sm:pt-8">
                      <p className="font-['Inter'] text-xs text-gray-400 sm:text-sm">
              © {new Date().getFullYear()} Marie Fortea - Garde d'Enfants Professionnelle. Tous droits
              réservés.
            </p>
                                <p className="mt-1 text-xs text-gray-500 sm:mt-2">
            Site réalisé par{' '}
            <a
              href="https://www.devweb31.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              DevWeb31
            </a>
          </p>

        </div>
      </div>

      {/* Phone Hours Dialog */}
      <PhoneHoursDialog
        isOpen={isPhoneDialogOpen}
        onClose={() => setIsPhoneDialogOpen(false)}
        phoneNumber="07 57 57 93 30"
      />

      {/* Map Dialog */}
      <MapDialog
        isOpen={isMapDialogOpen}
        onClose={() => setIsMapDialogOpen(false)}
      />
    </footer>
  );
};

export default Footer;
