import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Captcha from './Captcha';
import { BookingService } from '@/lib/booking-service';
import { SERVICE_TYPES, calculateEstimatedTotal } from '@/types/booking';
import { Calendar, Clock, Baby, User, Phone, CheckCircle, AlertCircle } from 'lucide-react';

interface BookingFormProps {
  onSuccess?: () => void;
  className?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess, className = '' }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [estimatedTotal, setEstimatedTotal] = useState<number>(0);

  const [formData, setFormData] = useState({
    parentFirstName: '',
    parentLastName: '',
    parentPhone: '',
    parentEmail: '',
    serviceType: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    childrenCount: 1,
    childrenAges: '',
    childrenAgesArray: [''],
  });

  // Calculer le total estimé quand les données changent
  useEffect(() => {
    if (formData.serviceType && formData.startTime && formData.endTime && formData.startDate && formData.endDate) {
      // Calculer la durée totale en heures
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      const durationMs = endDateTime.getTime() - startDateTime.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      
      // Calculer le prix par heure et multiplier par la durée
      const basePrice = getServiceTypeInfo(formData.serviceType)?.basePrice || 0;
      const total = basePrice * Math.max(1, durationHours);
      setEstimatedTotal(total);
    }
  }, [formData.serviceType, formData.startTime, formData.endTime, formData.startDate, formData.endDate]);

  const handleInputChange = (field: string, value: string | number) => {
    if (field === 'childrenCount') {
      // Gérer le changement du nombre d'enfants
      const newCount = typeof value === 'string' ? parseInt(value) : value;
      setFormData(prev => {
        const currentAges = prev.childrenAgesArray || [];
        let newAgesArray: string[];
        
        if (newCount > currentAges.length) {
          // Ajouter des champs vides
          newAgesArray = [...currentAges, ...Array(newCount - currentAges.length).fill('')];
        } else if (newCount < currentAges.length) {
          // Supprimer des champs
          newAgesArray = currentAges.slice(0, newCount);
        } else {
          newAgesArray = currentAges;
        }
        
        // Mettre à jour aussi le champ childrenAges
        const childrenAges = newAgesArray.filter(age => age.trim()).join(', ');
        
        return {
          ...prev,
          childrenCount: newCount,
          childrenAgesArray: newAgesArray,
          childrenAges
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleChildAgeChange = (index: number, value: string) => {
    setFormData(prev => {
      const newAgesArray = [...(prev.childrenAgesArray || [])];
      newAgesArray[index] = value;
      
      // Mettre à jour aussi le champ childrenAges pour la compatibilité
      const childrenAges = newAgesArray.filter(age => age.trim()).join(', ');
      
      return {
        ...prev,
        childrenAgesArray: newAgesArray,
        childrenAges
      };
    });
  };

  const handleCaptchaVerified = (token: string) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      console.log('❌ Pas de token captcha');
      toast({
        title: 'Vérification requise',
        description: 'Veuillez compléter la vérification de sécurité avant d\'envoyer votre demande.',
        variant: 'destructive',
      });
      return;
    }

    // Validation des dates
    if (formData.startDate >= formData.endDate) {
      toast({
        title: 'Erreur de dates',
        description: 'La date de fin doit être après la date de début.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const result = await BookingService.createBookingRequest({
        ...formData,
        parentName: `${formData.parentFirstName} ${formData.parentLastName}`.trim(),
        parentEmail: formData.parentEmail,
        parentAddress: 'À préciser lors du contact',
        requestedDate: formData.startDate, // Utiliser la date de début comme date principale
        childrenDetails: `${formData.childrenCount} enfant${formData.childrenCount > 1 ? 's' : ''} - Âges: ${formData.childrenAges}`,
        specialInstructions: '',
        emergencyContact: '',
        emergencyPhone: '',
        preferredContactMethod: 'phone',
        contactNotes: '',
        captchaToken
      });

      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Demande envoyée avec succès !',
        description: 'Je vous contacterai dans les plus brefs délais pour confirmer votre réservation et prendre plus de détails.',
      });

      // Réinitialiser le formulaire
      setFormData({
        parentFirstName: '',
        parentLastName: '',
        parentPhone: '',
        parentEmail: '',
        serviceType: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        childrenCount: 1,
        childrenAges: '',
        childrenAgesArray: [''],
      });
      setCaptchaToken('');
      setEstimatedTotal(0);

      // Appeler le callback de succès
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceTypeInfo = (code: string) => {
    return SERVICE_TYPES.find(service => service.code === code);
  };

  // Générer les heures en quarts d'heure
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className={`space-y-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations des Parents - Simplifié */}
        <div className="space-y-4">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <User className="mr-2 h-5 w-5 text-blue-600" />
            Vos Coordonnées
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parentFirstName" className="text-sm font-medium">
                Prénom *
              </Label>
              <Input
                id="parentFirstName"
                value={formData.parentFirstName}
                onChange={(e) => handleInputChange('parentFirstName', e.target.value)}
                placeholder="Marie"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="parentLastName" className="text-sm font-medium">
                Nom de famille *
              </Label>
              <Input
                id="parentLastName"
                value={formData.parentLastName}
                onChange={(e) => handleInputChange('parentLastName', e.target.value)}
                placeholder="Dupont"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parentPhone" className="text-sm font-medium">
                Téléphone *
              </Label>
              <Input
                id="parentPhone"
                type="tel"
                value={formData.parentPhone}
                onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                placeholder="06 12 34 56 78"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="parentEmail" className="text-sm font-medium">
                Email *
              </Label>
              <Input
                id="parentEmail"
                type="email"
                value={formData.parentEmail}
                onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                placeholder="marie.dupont@email.com"
                required
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Détails du Service */}
        <div className="space-y-4">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <Calendar className="mr-2 h-5 w-5 text-green-600" />
            Détails de la Garde
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceType" className="text-sm font-medium">
                Type de service *
              </Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => handleInputChange('serviceType', value)}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez un service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map(service => (
                    <SelectItem key={service.code} value={service.code}>
                      <div className="flex items-center justify-between w-full">
                        <span>{service.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {service.basePrice}€/h
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium">
                Date de début *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="endDate" className="text-sm font-medium">
                Date de fin *
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime" className="text-sm font-medium">
                Heure de début *
              </Label>
              <Select
                value={formData.startTime}
                onValueChange={(value) => handleInputChange('startTime', value)}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez une heure" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="endTime" className="text-sm font-medium">
                Heure de fin *
              </Label>
              <Select
                value={formData.endTime}
                onValueChange={(value) => handleInputChange('endTime', value)}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez une heure" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estimation du prix - Affichage permanent */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Estimation du prix :
              </span>
              <span className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                {estimatedTotal > 0 ? `${estimatedTotal.toFixed(2)}€` : '--- €'}
              </span>
            </div>
            {formData.serviceType ? (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Basé sur {getServiceTypeInfo(formData.serviceType)?.name} ({getServiceTypeInfo(formData.serviceType)?.basePrice}€/h)
              </p>
            ) : (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Sélectionnez un service pour voir l'estimation
              </p>
            )}
          </div>
        </div>

        {/* Informations sur les Enfants - Simplifié */}
        <div className="space-y-4">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <Baby className="mr-2 h-5 w-5 text-pink-600" />
            Vos Enfants
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="childrenCount" className="text-sm font-medium">
                Nombre d'enfants *
              </Label>
              <Select
                value={formData.childrenCount.toString()}
                onValueChange={(value) => handleInputChange('childrenCount', parseInt(value))}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} enfant{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Champs d'âge dynamiques */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Âges des enfants *
            </Label>
            {Array.from({ length: formData.childrenCount }, (_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <Input
                    id={`childAge-${index}`}
                    value={formData.childrenAgesArray?.[index] || ''}
                    onChange={(e) => handleChildAgeChange(index, e.target.value)}
                    placeholder={`Âge de l'enfant ${index + 1}`}
                    required
                    className="mt-1"
                  />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 min-w-[80px]">
                  Enfant {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Captcha */}
        <Captcha
          onVerified={handleCaptchaVerified}
          onError={(error) => {
            toast({
              title: 'Erreur Captcha',
              description: error,
              variant: 'destructive',
            });
          }}
        />

        {/* Message d'information */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>Note :</strong> Ce formulaire permet un premier contact. 
            Je vous recontacterai rapidement pour confirmer votre réservation et prendre plus de détails 
            (adresse, instructions spéciales, contacts d'urgence, etc.).
          </p>
        </div>

        {/* Bouton de soumission */}
        <div className="pt-4 border-t">
          <Button
            type="submit"
            disabled={isSubmitting || !captchaToken}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Envoyer ma demande
              </>
            )}
          </Button>
          
          {!captchaToken && (
            <div className="flex items-center mt-2 text-sm text-amber-600 dark:text-amber-400">
              <AlertCircle className="mr-2 h-4 w-4" />
              Veuillez compléter la vérification de sécurité
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
