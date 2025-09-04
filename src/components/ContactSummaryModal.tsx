import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Baby, 
  MapPin, 
  MessageSquare,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

interface ContactFormData {
  parentFirstName: string;
  parentLastName: string;
  parentPhone: string;
  parentEmail: string;
  serviceType: string;
  startDate: string;
  startTime: string;
  endTime: string;
  childrenCount: number;
  childrenAges: string;
  parentAddress: string;
  specialInstructions: string;
  emergencyContact: string;
  emergencyPhone: string;
  preferredContactMethod: string;
  contactNotes: string;
}

interface ContactSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onGoBack: () => void;
  formData: ContactFormData;
  estimatedTotal: number;
  isSubmitting?: boolean;
}

const ContactSummaryModal: React.FC<ContactSummaryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onGoBack,
  formData,
  estimatedTotal,
  isSubmitting = false
}) => {
  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non spécifié';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fonction pour formater l'heure
  const formatTime = (timeString: string) => {
    if (!timeString) return 'Non spécifié';
    return timeString;
  };

  // Fonction pour obtenir le nom du service
  const getServiceName = (serviceCode: string) => {
    const services: { [key: string]: string } = {
      'babysitting': 'Garde d\'enfants',
      'event_support': 'Soutien événementiel',
      'evening_care': 'Garde en soirée',
      'emergency_care': 'Garde d\'urgence'
    };
    return services[serviceCode] || serviceCode;
  };

  // Fonction pour obtenir la méthode de contact
  const getContactMethod = (method: string) => {
    const methods: { [key: string]: string } = {
      'phone': 'Téléphone',
      'email': 'Email',
      'sms': 'SMS'
    };
    return methods[method] || method;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-base font-bold text-gray-900 dark:text-white">
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            Récapitulatif de votre demande
          </DialogTitle>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Vérifiez les informations avant de confirmer.
          </p>
        </DialogHeader>

        <div className="space-y-3">
          {/* Informations personnelles - Version compacte */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center text-xs font-semibold text-blue-700 dark:text-blue-400">
                <User className="mr-1 h-3 w-3" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
              <div className="grid grid-cols-1 gap-1 text-xs">
                <div className="flex items-center">
                  <span className="font-medium text-gray-600 dark:text-gray-400 w-16">Nom :</span>
                  <span className="text-gray-900 dark:text-white">
                    {formData.parentFirstName} {formData.parentLastName}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-600 dark:text-gray-400 w-16">Tél :</span>
                  <span className="text-gray-900 dark:text-white flex items-center">
                    <Phone className="mr-1 h-3 w-3" />
                    {formData.parentPhone}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-600 dark:text-gray-400 w-16">Email :</span>
                  <span className="text-gray-900 dark:text-white flex items-center">
                    <Mail className="mr-1 h-3 w-3" />
                    {formData.parentEmail}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails du service - Version compacte */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center text-xs font-semibold text-green-700 dark:text-green-400">
                <Calendar className="mr-1 h-3 w-3" />
                Détails du service
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
              <div className="grid grid-cols-1 gap-1 text-xs">
                <div className="flex items-center">
                  <span className="font-medium text-gray-600 dark:text-gray-400 w-16">Service :</span>
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {getServiceName(formData.serviceType)}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-600 dark:text-gray-400 w-16">Date :</span>
                  <span className="text-gray-900 dark:text-white flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(formData.startDate)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-600 dark:text-gray-400 w-16">Heures :</span>
                  <span className="text-gray-900 dark:text-white flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations sur les enfants - Version compacte */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center text-xs font-semibold text-purple-700 dark:text-purple-400">
                <Baby className="mr-1 h-3 w-3" />
                Enfants
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
              <div className="grid grid-cols-1 gap-1 text-xs">
                <div className="flex items-center">
                  <span className="font-medium text-gray-600 dark:text-gray-400 w-16">Nombre :</span>
                  <span className="text-gray-900 dark:text-white">
                    {formData.childrenCount} enfant{formData.childrenCount > 1 ? 's' : ''}
                  </span>
                </div>
                {formData.childrenAges && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 dark:text-gray-400 w-16">Âges :</span>
                    <span className="text-gray-900 dark:text-white">
                      {formData.childrenAges}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions et notes - Version compacte */}
          {(formData.specialInstructions || formData.contactNotes) && (
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center text-xs font-semibold text-orange-700 dark:text-orange-400">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-2">
                <div className="space-y-1 text-xs">
                  {formData.specialInstructions && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Spéciales :</span>
                      <p className="text-gray-900 dark:text-white mt-0.5 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                        {formData.specialInstructions}
                      </p>
                    </div>
                  )}
                  {formData.contactNotes && (
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">Notes :</span>
                      <p className="text-gray-900 dark:text-white mt-0.5 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                        {formData.contactNotes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact d'urgence - Version compacte */}
          {(formData.emergencyContact || formData.emergencyPhone) && (
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center text-xs font-semibold text-red-700 dark:text-red-400">
                  <Phone className="mr-1 h-3 w-3" />
                  Contact d'urgence
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-2">
                <div className="grid grid-cols-1 gap-1 text-xs">
                  {formData.emergencyContact && (
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600 dark:text-gray-400 w-16">Nom :</span>
                      <span className="text-gray-900 dark:text-white">
                        {formData.emergencyContact}
                      </span>
                    </div>
                  )}
                  {formData.emergencyPhone && (
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600 dark:text-gray-400 w-16">Tél :</span>
                      <span className="text-gray-900 dark:text-white flex items-center">
                        <Phone className="mr-1 h-3 w-3" />
                        {formData.emergencyPhone}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estimation du prix - Version compacte */}
          {estimatedTotal > 0 && (
            <Card className="border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20">
              <CardContent className="pt-3 pb-3">
                <div className="text-center">
                  <div className="flex items-center justify-center text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Estimation du coût
                  </div>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {estimatedTotal.toFixed(2)} €
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Basée sur les informations fournies
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 pt-2">
          <Button
            variant="outline"
            onClick={onGoBack}
            disabled={isSubmitting}
            className="w-full sm:w-auto text-xs"
            size="sm"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Revenir en arrière
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-xs"
            size="sm"
          >
            {isSubmitting ? (
              <>
                <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Envoi...
              </>
            ) : (
              <>
                <CheckCircle className="mr-1 h-3 w-3" />
                Confirmer et envoyer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSummaryModal;