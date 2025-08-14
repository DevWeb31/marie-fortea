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
              Cliquez sur "Appeler maintenant" pour composer le numéro
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="font-semibold text-gray-900 dark:text-white">
                Horaires de disponibilité
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Lundi - Vendredi :</span>
                <span className="font-medium text-gray-900 dark:text-white">19h - 21h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">Samedi - Dimanche :</span>
                <span className="font-medium text-gray-900 dark:text-white">9h - 21h</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleCall}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Phone className="mr-2 h-4 w-4" />
              Appeler maintenant
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
