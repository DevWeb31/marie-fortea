import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { AnimatedSection, AnimatedTitle } from '@/components/ScrollAnimation';
import PhoneHoursDialog from '@/components/PhoneHoursDialog';
import BookingForm from '@/components/BookingForm';
import DynamicPricing from '@/components/DynamicPricing';
import {
  Star,
  Shield,
  CheckCircle,
  Phone,
  Calendar,
  Heart
} from 'lucide-react';

const Booking = () => {

  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handlePhoneClick = () => {
    setIsPhoneDialogOpen(true);
  };

  const handleBookingSuccess = () => {
    setShowSuccessMessage(true);
    // Masquer le message de succès après 5 secondes
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };



  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="mb-12 text-center">
          <Badge className="mb-6 bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
            <Star className="mr-2 h-4 w-4" />
            Réservation Simple & Sécurisée
          </Badge>

          <AnimatedTitle className="mb-4 font-['Poppins'] text-3xl font-bold text-gray-900 dark:text-white sm:mb-6 sm:text-4xl md:text-5xl" delay={0.2}>
            Réserver une
            <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-emerald-400">
              Garde d'Enfants
            </span>
          </AnimatedTitle>

          <p className="mx-auto max-w-3xl px-4 font-['Inter'] text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            Remplissez ce formulaire simple pour prendre un premier contact. 
            Je vous recontacterai rapidement pour confirmer votre réservation et prendre plus de détails.
          </p>
        </AnimatedSection>

        {/* Message de succès */}
        {showSuccessMessage && (
          <AnimatedSection className="mb-8">
            <Card className="border-green-200 bg-green-50/90 backdrop-blur-sm dark:border-green-800 dark:bg-green-900/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center space-x-3 text-green-700 dark:text-green-300">
                  <CheckCircle className="h-8 w-8" />
                  <div>
                    <h3 className="text-lg font-semibold">Demande envoyée avec succès !</h3>
                    <p className="text-sm">Je vous contacterai dans les plus brefs délais pour confirmer votre réservation.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        )}

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="order-2 lg:order-1 lg:col-span-2">
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-zinc-800 dark:to-zinc-700 rounded-t-xl">
                <CardTitle className="flex items-center font-['Poppins'] text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400 sm:mr-3 sm:h-6 sm:w-6" />
                  Formulaire de Contact
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Ce formulaire me permet de prendre un premier contact avec vous pour organiser la garde de vos enfants.
                </p>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 lg:p-8">
                <BookingForm onSuccess={handleBookingSuccess} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="order-1 space-y-4 sm:space-y-6 lg:order-2">
            {/* Sécurité et Confiance */}
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-zinc-800/50 dark:to-zinc-700/50 backdrop-blur-sm rounded-t-xl">
                <CardTitle className="font-['Poppins'] text-base sm:text-lg flex items-center text-gray-900 dark:text-white">
                  <Shield className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Sécurité & Confiance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Vérification anti-spam</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Données protégées</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Contact sous 24h</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Confirmation obligatoire</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Direct */}
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-zinc-800/50 dark:to-zinc-700/50 backdrop-blur-sm rounded-t-xl">
                <CardTitle className="font-['Poppins'] text-base sm:text-lg text-gray-900 dark:text-white">
                  Contact Direct
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handlePhoneClick}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                  >
                    <Phone className="h-5 w-5 text-white" />
                  </button>
                  <div>
                    <div className="text-sm font-medium sm:text-base text-left">
                      07 57 57 93 30
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                      Horaires d'appel :
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 sm:text-sm">
                      Lun-Ven : 19h-21h
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 sm:text-sm">
                      Week-end : 9h-21h
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tarifs & Conditions */}
            <DynamicPricing />

            {/* Processus Simplifié */}
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-zinc-800/50 dark:to-zinc-700/50 backdrop-blur-sm rounded-t-xl">
                <CardTitle className="font-['Poppins'] text-base dark:text-white sm:text-lg">
                  Processus Simplifié
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                      1
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 sm:text-sm">
                      Envoyez votre demande via ce formulaire
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600 dark:bg-green-900 dark:text-green-400">
                      2
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 sm:text-sm">
                      Je vous contacte sous 24h pour confirmer
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                      3
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 sm:text-sm">
                      Réservation confirmée et planifiée
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
      </div>

      {/* Phone Hours Dialog */}
      <PhoneHoursDialog
        isOpen={isPhoneDialogOpen}
        onClose={() => setIsPhoneDialogOpen(false)}
        phoneNumber="07 57 57 93 30"
      />
    </div>
  );
};

export default Booking;
