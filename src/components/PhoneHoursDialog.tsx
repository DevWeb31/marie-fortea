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
      <DialogContent className="w-[90vw] max-w-xs mx-auto sm:max-w-sm md:max-w-md p-3 sm:p-4 gap-2 sm:gap-3 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center text-base sm:text-lg font-semibold text-gray-900 dark:text-white gap-2">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span>Horaires d'appel</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 sm:space-y-3">
          {/* Numéro de téléphone */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg p-3 sm:p-4 border border-blue-100 dark:border-blue-800/30">
            <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 mb-1 font-mono tracking-wider">
              {phoneNumber}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Cliquez sur le bouton "Appeler" ci-dessous
            </p>
          </div>

          {/* Statut actuel */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800/30">
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                dayInfo.isCurrentlyAvailable ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
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
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800/30">
            <div className="flex items-center mb-2 gap-2">
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                Horaires de disponibilité
              </span>
            </div>
            
            <div className="space-y-1.5">
              {/* Lundi - Vendredi */}
              <div className={`flex items-center justify-between p-2 rounded-md transition-all duration-300 ${
                dayInfo.isWeekday 
                  ? 'bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-600' 
                  : 'bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
              }`}>
                <span className={`font-medium text-xs sm:text-sm ${
                  dayInfo.isWeekday 
                    ? 'text-blue-800 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Lundi - Vendredi
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`font-semibold text-center px-2 py-1 rounded text-xs transition-all duration-200 ${
                    dayInfo.isWeekday && dayInfo.isCurrentlyAvailable
                      ? 'text-white bg-green-500'
                      : dayInfo.isWeekday && !dayInfo.isCurrentlyAvailable
                      ? 'text-white bg-red-500'
                      : 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700'
                  }`}>
                    19h - 21h
                  </span>
                  {dayInfo.isWeekday && (
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      dayInfo.isCurrentlyAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  )}
                </div>
              </div>
              
              {/* Samedi - Dimanche */}
              <div className={`flex items-center justify-between p-2 rounded-md transition-all duration-300 ${
                dayInfo.isWeekend 
                  ? 'bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-600' 
                  : 'bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
              }`}>
                <span className={`font-medium text-xs sm:text-sm ${
                  dayInfo.isWeekend 
                    ? 'text-blue-800 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Samedi - Dimanche
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`font-semibold text-center px-2 py-1 rounded text-xs transition-all duration-200 ${
                    dayInfo.isWeekend && dayInfo.isCurrentlyAvailable
                      ? 'text-white bg-green-500'
                      : dayInfo.isWeekend && !dayInfo.isCurrentlyAvailable
                      ? 'text-white bg-red-500'
                      : 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700'
                  }`}>
                    9h - 21h
                  </span>
                  {dayInfo.isWeekend && (
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      dayInfo.isCurrentlyAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informations supplémentaires - Masqué sur mobile pour plus de compacité */}
          <div className="hidden md:block bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-2">
              <Info className="h-3 w-3 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <p>
                  <strong>Note :</strong> Horaires variables selon disponibilités.
                </p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleCall}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-2.5 text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Phone className="mr-2 h-4 w-4" />
              Appeler maintenant
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full py-2.5 text-sm rounded-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="Fermer la boîte de dialogue"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneHoursDialog;
