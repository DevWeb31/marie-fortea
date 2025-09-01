import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Clock, X, Info } from 'lucide-react';

interface PhoneHoursDialogProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
}

const PhoneHoursDialog = ({ isOpen, onClose, phoneNumber }: PhoneHoursDialogProps) => {
  const handleCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
    onClose();
  };

  // Fonction pour déterminer le jour actuel et la disponibilité
  const getCurrentDayInfo = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
    const currentHour = now.getHours();
    
    // Lundi = 1, Mardi = 2, Mercredi = 3, Jeudi = 4, Vendredi = 5
    const isWeekday = currentDay >= 1 && currentDay <= 5;
    // Samedi = 6, Dimanche = 0
    const isWeekend = currentDay === 0 || currentDay === 6;
    
    // Vérifier si l'heure actuelle correspond aux horaires
    let isCurrentlyAvailable = false;
    let currentTimeSlot = '';
    
    if (isWeekday) {
      currentTimeSlot = 'weekday';
      isCurrentlyAvailable = currentHour >= 19 && currentHour < 21;
    } else if (isWeekend) {
      currentTimeSlot = 'weekend';
      isCurrentlyAvailable = currentHour >= 9 && currentHour < 21;
    }
    
    return {
      isWeekday,
      isWeekend,
      isCurrentlyAvailable,
      currentTimeSlot,
      currentDay,
      currentHour
    };
  };

  const dayInfo = getCurrentDayInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[92vw] max-w-sm mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 md:gap-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="flex flex-col sm:flex-row items-center justify-center sm:justify-start text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white gap-2 sm:gap-3 md:gap-4">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Phone className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-center sm:text-left">
              Horaires d'appel
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Numéro de téléphone */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-blue-100 dark:border-blue-800/30">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 sm:mb-3 font-mono tracking-wider">
              {phoneNumber}
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-xs sm:max-w-sm mx-auto">
              Cliquez sur le bouton "Appeler" ci-dessous
            </p>
          </div>

          {/* Statut actuel */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-amber-200 dark:border-amber-800/30">
            <div className="flex items-center justify-center sm:justify-start mb-2 sm:mb-3 md:mb-4 gap-2 sm:gap-3">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse ${
                dayInfo.isCurrentlyAvailable ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm md:text-base">
                {dayInfo.isCurrentlyAvailable ? 'Disponible maintenant' : 'Fermé actuellement'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              {dayInfo.isCurrentlyAvailable 
                ? `Nous sommes ouverts et disponibles.`
                : `Nous sommes fermés. Appelez pendant nos horaires.`
              }
            </p>
          </div>

          {/* Horaires détaillés */}
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-200 dark:border-blue-800/30">
            <div className="flex items-center mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base md:text-lg">
                Horaires de disponibilité
              </span>
            </div>
            
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {/* Lundi - Vendredi */}
              <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl transition-all duration-300 ${
                dayInfo.isWeekday 
                  ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-300 dark:border-blue-600 shadow-lg' 
                  : 'bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-center mb-2 sm:mb-0">
                  <span className={`font-semibold text-xs sm:text-sm md:text-base flex-1 ${
                    dayInfo.isWeekday 
                      ? 'text-blue-800 dark:text-blue-200' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Lundi - Vendredi
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-center px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base transition-all duration-200 ${
                    dayInfo.isWeekday && dayInfo.isCurrentlyAvailable
                      ? 'text-white bg-green-500 shadow-lg'
                      : dayInfo.isWeekday && !dayInfo.isCurrentlyAvailable
                      ? 'text-white bg-red-500 shadow-lg'
                      : 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700'
                  }`}>
                    19h - 21h
                  </span>
                  {dayInfo.isWeekday && (
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                      dayInfo.isCurrentlyAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  )}
                </div>
              </div>
              
              {/* Samedi - Dimanche */}
              <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl transition-all duration-300 ${
                dayInfo.isWeekend 
                  ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-300 dark:border-blue-600 shadow-lg' 
                  : 'bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-center mb-2 sm:mb-0">
                  <span className={`font-semibold text-xs sm:text-sm md:text-base flex-1 ${
                    dayInfo.isWeekend 
                      ? 'text-blue-800 dark:text-blue-200' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Samedi - Dimanche
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-center px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base transition-all duration-200 ${
                    dayInfo.isWeekend && dayInfo.isCurrentlyAvailable
                      ? 'text-white bg-green-500 shadow-lg'
                      : dayInfo.isWeekend && !dayInfo.isCurrentlyAvailable
                      ? 'text-white bg-red-500 shadow-lg'
                      : 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700'
                  }`}>
                    9h - 21h
                  </span>
                  {dayInfo.isWeekend && (
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                      dayInfo.isCurrentlyAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informations supplémentaires - Optionnel sur mobile */}
          <div className="hidden sm:block bg-gray-50 dark:bg-gray-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-2 sm:gap-3">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">
                  <strong>Note :</strong> Ces horaires peuvent varier selon les disponibilités. 
                  En cas d'urgence, n'hésitez pas à laisser un message.
                </p>
                <p>
                  <strong>Zone d'intervention :</strong> Paris et sa périphérie (dans un rayon de 20km)
                </p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 pt-1 sm:pt-2">
            <Button 
              onClick={handleCall}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              size="lg"
            >
              <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              Appeler maintenant
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              size="lg"
              aria-label="Fermer la boîte de dialogue"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              <span className="sr-only">Fermer</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneHoursDialog;
