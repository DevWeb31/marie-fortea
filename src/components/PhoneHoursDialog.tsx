import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Clock, X } from 'lucide-react';

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <Phone className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            Horaires d'appel
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {phoneNumber}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Cliquez sur le bouton ci-dessous pour composer le numéro
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="font-semibold text-gray-900 dark:text-white">
                Horaires de disponibilité
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                dayInfo.isWeekday 
                  ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-300 dark:border-blue-600' 
                  : ''
              }`}>
                <span className={`font-medium flex-1 ${
                  dayInfo.isWeekday 
                    ? 'text-blue-800 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Lundi - Vendredi
                </span>
                <span className={`font-bold text-center min-w-[80px] px-3 py-1.5 rounded-md ${
                  dayInfo.isWeekday && dayInfo.isCurrentlyAvailable
                    ? 'text-white bg-green-500'
                    : dayInfo.isWeekday && !dayInfo.isCurrentlyAvailable
                    ? 'text-white bg-red-500'
                    : 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700'
                }`}>
                  19h - 21h
                </span>
              </div>
              
              <div className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                dayInfo.isWeekend 
                  ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-300 dark:border-blue-600' 
                  : ''
              }`}>
                <span className={`font-medium flex-1 ${
                  dayInfo.isWeekend 
                    ? 'text-blue-800 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Samedi - Dimanche
                </span>
                <span className={`font-bold text-center min-w-[80px] px-3 py-1.5 rounded-md ${
                  dayInfo.isWeekend && dayInfo.isCurrentlyAvailable
                    ? 'text-white bg-green-500'
                    : dayInfo.isWeekend && !dayInfo.isCurrentlyAvailable
                    ? 'text-white bg-red-500'
                    : 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700'
                }`}>
                  9h - 21h
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleCall}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Phone className="mr-2 h-4 w-4" />
              Appeler
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneHoursDialog;
