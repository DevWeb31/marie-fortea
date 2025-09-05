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
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto sm:w-full rounded-2xl border-0 shadow-2xl bg-white dark:bg-gray-900">
        <DialogHeader className="pb-4 px-6 pt-6">
          <DialogTitle className="flex items-center text-base font-semibold text-gray-900 dark:text-white">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 mr-3">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            Récapitulatif de votre demande
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
            Vérifiez les informations avant de confirmer
          </p>
        </DialogHeader>

        <div className="px-6 space-y-3">
          {/* Informations personnelles - Version épurée */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 mr-2">
                <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400">Informations personnelles</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center min-w-0">
                <span className="font-medium text-gray-600 dark:text-gray-400 w-16 flex-shrink-0">Nom</span>
                <span className="text-gray-900 dark:text-white truncate ml-2">
                  {formData.parentFirstName} {formData.parentLastName}
                </span>
              </div>
              <div className="flex items-center min-w-0">
                <span className="font-medium text-gray-600 dark:text-gray-400 w-16 flex-shrink-0">Téléphone</span>
                <span className="text-gray-900 dark:text-white flex items-center truncate ml-2">
                  <Phone className="mr-1 h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{formData.parentPhone}</span>
                </span>
              </div>
              <div className="flex items-center min-w-0 sm:col-span-2">
                <span className="font-medium text-gray-600 dark:text-gray-400 w-16 flex-shrink-0">Email</span>
                <span className="text-gray-900 dark:text-white flex items-center min-w-0 ml-2">
                  <Mail className="mr-1 h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{formData.parentEmail}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Détails du service - Version épurée */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/50">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 mr-2">
                <Calendar className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-sm font-semibold text-green-700 dark:text-green-400">Détails du service</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center min-w-0">
                <span className="font-medium text-gray-600 dark:text-gray-400 w-16 flex-shrink-0">Service</span>
                <Badge variant="secondary" className="text-xs px-2 py-1 ml-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 border-0">
                  {getServiceName(formData.serviceType)}
                </Badge>
              </div>
              <div className="flex items-center min-w-0">
                <span className="font-medium text-gray-600 dark:text-gray-400 w-16 flex-shrink-0">Date</span>
                <span className="text-gray-900 dark:text-white flex items-center min-w-0 ml-2">
                  <Calendar className="mr-1 h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{formatDate(formData.startDate)}</span>
                </span>
              </div>
              <div className="flex items-center min-w-0 sm:col-span-2">
                <span className="font-medium text-gray-600 dark:text-gray-400 w-16 flex-shrink-0">Heures</span>
                <span className="text-gray-900 dark:text-white flex items-center min-w-0 ml-2">
                  <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{formatTime(formData.startTime)} - {formatTime(formData.endTime)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Informations sur les enfants - Version épurée */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/50">
            <div className="flex items-center mb-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 mr-2">
                <Baby className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-400">Enfants</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center min-w-0">
                <span className="font-medium text-gray-600 dark:text-gray-400 w-16 flex-shrink-0">Nombre</span>
                <span className="text-gray-900 dark:text-white ml-2">
                  {formData.childrenCount} enfant{formData.childrenCount > 1 ? 's' : ''}
                </span>
              </div>
              {formData.childrenAges && (
                <div className="flex items-center min-w-0">
                  <span className="font-medium text-gray-600 dark:text-gray-400 w-16 flex-shrink-0">Âges</span>
                  <span className="text-gray-900 dark:text-white truncate ml-2">
                    {formData.childrenAges}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Instructions et notes - Version épurée */}
          {(formData.specialInstructions || formData.contactNotes) && (
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800/50">
              <div className="flex items-center mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/50 mr-2">
                  <MessageSquare className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-sm font-semibold text-orange-700 dark:text-orange-400">Instructions</h3>
              </div>
              <div className="space-y-3 text-sm">
                {formData.specialInstructions && (
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Instructions spéciales</span>
                    <p className="text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-800 rounded-lg text-sm max-h-20 overflow-y-auto border border-gray-200 dark:border-gray-700">
                      {formData.specialInstructions}
                    </p>
                  </div>
                )}
                {formData.contactNotes && (
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Notes</span>
                    <p className="text-gray-900 dark:text-white mt-1 p-3 bg-white dark:bg-gray-800 rounded-lg text-sm max-h-20 overflow-y-auto border border-gray-200 dark:border-gray-700">
                      {formData.contactNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact d'urgence - Version épurée */}
          {(formData.emergencyContact || formData.emergencyPhone) && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-100 dark:border-red-800/50">
              <div className="flex items-center mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 mr-2">
                  <Phone className="h-3 w-3 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">Contact d'urgence</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {formData.emergencyContact && (
                  <div className="flex items-center min-w-0">
                    <span className="font-medium text-gray-600 dark:text-gray-400 w-16 flex-shrink-0">Nom</span>
                    <span className="text-gray-900 dark:text-white truncate ml-2">
                      {formData.emergencyContact}
                    </span>
                  </div>
                )}
                {formData.emergencyPhone && (
                  <div className="flex items-center min-w-0">
                    <span className="font-medium text-gray-600 dark:text-gray-400 w-16 flex-shrink-0">Téléphone</span>
                    <span className="text-gray-900 dark:text-white flex items-center min-w-0 ml-2">
                      <Phone className="mr-1 h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{formData.emergencyPhone}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Estimation du prix - Version épurée */}
          {estimatedTotal > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800/50">
              <div className="text-center">
                <div className="flex items-center justify-center text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 mr-2">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  Estimation du coût
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {estimatedTotal.toFixed(2)} €
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Basée sur les informations fournies
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 px-6 pb-6">
          <Button
            variant="outline"
            onClick={onGoBack}
            disabled={isSubmitting}
            className="w-full sm:w-auto text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Revenir en arrière
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm rounded-lg shadow-lg"
            size="sm"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Envoi en cours...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
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