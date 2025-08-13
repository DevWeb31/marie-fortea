import React from 'react';
import { Link } from 'react-router-dom';
import {
  Baby,
  Heart,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {/* Logo & Description */}
          <div className="sm:col-span-2">
            <Link to="/" className="group mb-6 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-green-400 transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10">
                <Baby className="h-4 w-4 text-white sm:h-5 sm:w-5" />
              </div>
              <span className="font-['Poppins'] text-lg font-bold sm:text-xl">
                Marie Fortea
              </span>
            </Link>

            <p className="mb-4 max-w-md font-['Inter'] text-sm leading-relaxed text-gray-300 sm:mb-6 sm:text-base">
              Professionnelle de la petite enfance avec plus de 5 ans
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
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400 sm:h-5 sm:w-5" />
                <div>
                  <a
                    href="tel:+33123456789"
                    className="font-['Inter'] text-sm text-gray-300 transition-colors duration-200 hover:text-white sm:text-base"
                  >
                    06 12 34 56 78
                  </a>
                  <div className="text-xs text-gray-400 sm:text-sm">
                    Disponible 7j/7
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400 sm:h-5 sm:w-5" />
                <div>
                  <a
                    href="mailto:marie.fortea@email.com"
                    className="break-all font-['Inter'] text-sm text-gray-300 transition-colors duration-200 hover:text-white sm:text-base"
                  >
                    marie.fortea@email.com
                  </a>
                  <div className="text-xs text-gray-400 sm:text-sm">
                    Réponse sous 24h
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400 sm:h-5 sm:w-5" />
                <div className="font-['Inter'] text-sm text-gray-300 sm:text-base">
                  <div>Région Toulousaine</div>
                  <div className="text-xs text-gray-400 sm:text-sm">
                    Déplacement possible
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
                <span>5+ ans d'expérience</span>
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-gray-700 pt-6 text-center sm:mt-8 sm:pt-8">
          <p className="font-['Inter'] text-xs text-gray-400 sm:text-sm">
            © 2024 Marie Fortea - Garde d'Enfants Professionnelle. Tous droits
            réservés.
          </p>
          <p className="mt-1 text-xs text-gray-500 sm:mt-2">
            Site réalisé avec <Heart className="inline h-3 w-3 text-red-400" />{' '}
            pour les familles toulousaines
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
