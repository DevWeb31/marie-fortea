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
    startTime: '',
    endTime: '',
    childrenCount: 1,
    childrenAges: '',
    childrenAgesArray: [''],
  });

  // État pour la validation de l'email
  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean;
    error?: string;
  }>({ isValid: true });

  // Calculer le total estimé quand les données changent
  useEffect(() => {
    if (formData.serviceType && formData.startTime && formData.endTime && formData.startDate) {
      // Calculer la durée totale en heures
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);
      
      // Si l'heure de fin est avant l'heure de début, c'est le lendemain
      if (endDateTime <= startDateTime) {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }
      
      const durationMs = endDateTime.getTime() - startDateTime.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      
      // Calculer le prix par heure et multiplier par la durée
      const basePrice = getServiceTypeInfo(formData.serviceType)?.basePrice || 0;
      const total = basePrice * Math.max(1, durationHours);
      setEstimatedTotal(total);
    }
  }, [formData.serviceType, formData.startTime, formData.endTime, formData.startDate]);

  // Fonction pour formater en Camel Case
  const formatToCamelCase = (value: string): string => {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  // Fonction pour nettoyer les caractères non autorisés (lettres et tirets uniquement)
  const cleanNameInput = (value: string): string => {
    return value.replace(/[^a-zA-ZÀ-ÿ\s-]/g, '');
  };

  // Fonction pour traiter le prénom (remplacer espaces par tirets)
  const processFirstName = (value: string): string => {
    const cleaned = cleanNameInput(value);
    return cleaned.replace(/\s+/g, '-');
  };

  // Fonction pour traiter le nom (pas de remplacement d'espaces)
  const processLastName = (value: string): string => {
    return cleanNameInput(value);
  };

  // Fonction pour formater le numéro de téléphone au format "00 00 00 00 00"
  const formatPhoneNumber = (value: string): string => {
    // Supprimer tous les caractères non numériques
    const cleaned = value.replace(/\D/g, '');
    
    // Limiter à 10 chiffres maximum
    const limited = cleaned.slice(0, 10);
    
    // Formater avec des espaces tous les 2 chiffres
    if (limited.length <= 2) return limited;
    if (limited.length <= 4) return `${limited.slice(0, 2)} ${limited.slice(2)}`;
    if (limited.length <= 6) return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4)}`;
    if (limited.length <= 8) return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4, 6)} ${limited.slice(6)}`;
    return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4, 6)} ${limited.slice(6, 8)} ${limited.slice(8)}`;
  };

  // Fonction pour valider et formater l'email
  const validateAndFormatEmail = (value: string): { value: string; isValid: boolean; error?: string } => {
    const trimmedValue = value.trim().toLowerCase();
    
    if (!trimmedValue) {
      return { value: trimmedValue, isValid: false, error: 'Email requis' };
    }
    
    // Vérifier les caractères interdits
    const forbiddenChars = /[<>()[\]\\,;:\s"{}|]/;
    if (forbiddenChars.test(trimmedValue)) {
      return { value: trimmedValue, isValid: false, error: 'Caractères interdits détectés' };
    }
    
    // Vérifier qu'il y a exactement un @
    const atCount = (trimmedValue.match(/@/g) || []).length;
    if (atCount !== 1) {
      return { value: trimmedValue, isValid: false, error: 'Un seul @ autorisé' };
    }
    
    // Séparer la partie locale et le domaine
    const [localPart, domain] = trimmedValue.split('@');
    
    // Vérifier la partie locale
    if (!localPart || localPart.length === 0) {
      return { value: trimmedValue, isValid: false, error: 'Partie locale manquante' };
    }
    
    if (localPart.length > 64) {
      return { value: trimmedValue, isValid: false, error: 'Partie locale trop longue' };
    }
    
    // Vérifier que la partie locale ne commence ou ne finit pas par un point
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      return { value: trimmedValue, isValid: false, error: 'Partie locale ne peut pas commencer ou finir par un point' };
    }
    
    // Vérifier qu'il n'y a pas de points consécutifs dans la partie locale
    if (localPart.includes('..')) {
      return { value: trimmedValue, isValid: false, error: 'Points consécutifs interdits' };
    }
    
    // Vérifier le domaine
    if (!domain || domain.length === 0) {
      return { value: trimmedValue, isValid: false, error: 'Domaine manquant' };
    }
    
    if (domain.length > 253) {
      return { value: trimmedValue, isValid: false, error: 'Domaine trop long' };
    }
    
    // Vérifier que le domaine a au moins un point
    if (!domain.includes('.')) {
      return { value: trimmedValue, isValid: false, error: 'Domaine invalide (extension manquante)' };
    }
    
    // Vérifier que le domaine ne commence ou ne finit pas par un point
    if (domain.startsWith('.') || domain.endsWith('.')) {
      return { value: trimmedValue, isValid: false, error: 'Domaine ne peut pas commencer ou finir par un point' };
    }
    
    // Vérifier qu'il n'y a pas de points consécutifs dans le domaine
    if (domain.includes('..')) {
      return { value: trimmedValue, isValid: false, error: 'Points consécutifs interdits dans le domaine' };
    }
    
    // Vérifier l'extension du domaine (au moins 2 caractères)
    const domainParts = domain.split('.');
    const extension = domainParts[domainParts.length - 1];
    if (extension.length < 2) {
      return { value: trimmedValue, isValid: false, error: 'Extension de domaine trop courte' };
    }
    
    // Vérifier que l'extension ne contient que des lettres
    if (!/^[a-z]+$/i.test(extension)) {
      return { value: trimmedValue, isValid: false, error: 'Extension de domaine invalide' };
    }
    
    // Vérifier la longueur totale
    if (trimmedValue.length > 254) {
      return { value: trimmedValue, isValid: false, error: 'Email trop long' };
    }
    
    return { value: trimmedValue, isValid: true };
  };

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
    } else if (field === 'parentFirstName') {
      // Traitement spécial pour le prénom
      const processedValue = processFirstName(value as string);
      const formattedValue = formatToCamelCase(processedValue);
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
    } else if (field === 'parentLastName') {
      // Traitement spécial pour le nom
      const processedValue = processLastName(value as string);
      const formattedValue = formatToCamelCase(processedValue);
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
    } else if (field === 'parentPhone') {
      // Traitement spécial pour le téléphone
      const formattedValue = formatPhoneNumber(value as string);
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
    } else if (field === 'parentEmail') {
      // Traitement spécial pour l'email
      const validation = validateAndFormatEmail(value as string);
      setFormData(prev => ({ ...prev, [field]: validation.value }));
      setEmailValidation({ isValid: validation.isValid, error: validation.error });
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

      toast({
        title: 'Vérification requise',
        description: 'Veuillez compléter la vérification de sécurité avant d\'envoyer votre demande.',
        variant: 'destructive',
      });
      return;
    }

    // Validation de l'email
    if (!emailValidation.isValid) {
      toast({
        title: 'Email invalide',
        description: emailValidation.error || 'Veuillez saisir un email valide.',
        variant: 'destructive',
      });
      return;
    }

    // Validation des heures
    if (formData.startTime && formData.endTime) {
      const startTime = new Date(`2000-01-01T${formData.startTime}`);
      const endTime = new Date(`2000-01-01T${formData.endTime}`);
      
      if (endTime <= startTime) {
        // Si l'heure de fin est avant l'heure de début, c'est le lendemain
        endTime.setDate(endTime.getDate() + 1);
      }
      
      const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      
      if (durationHours < 1) {
        toast({
          title: 'Erreur de durée',
          description: 'La durée minimale est de 1 heure.',
          variant: 'destructive',
        });
        return;
      }
      
      if (durationHours > 24) {
        toast({
          title: 'Erreur de durée',
          description: 'La durée maximale est de 24 heures.',
          variant: 'destructive',
        });
        return;
      }
    }
    setIsSubmitting(true);

    try {
      const result = await BookingService.createBookingRequest({
        ...formData,
        parentName: `${formData.parentFirstName} ${formData.parentLastName}`.trim(),
        parentEmail: formData.parentEmail,
        parentAddress: 'À préciser lors du contact',
        requestedDate: formData.startDate,
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
        startTime: '',
        endTime: '',
        childrenCount: 1,
        childrenAges: '',
        childrenAgesArray: [''],
      });
      setCaptchaToken('');
      setEstimatedTotal(0);
      setEmailValidation({ isValid: true });

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

  // Générer les heures par intervalles de 30 minutes
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push({
          value: timeString,
          label: timeString,
          isNextDay: false
        });
      }
    }
    return times;
  };

  // Générer les heures de fin disponibles selon l'heure de début
  const generateEndTimeOptions = (startTime: string) => {
    if (!startTime) return generateTimeOptions();
    
    const times = [];
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    
    // Heures du même jour (après l'heure de début)
    for (let hour = startHour; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Pour la même heure, ne pas inclure les minutes inférieures ou égales
        if (hour === startHour && minute <= startMinute) continue;
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push({
          value: timeString,
          label: timeString,
          isNextDay: false
        });
      }
    }
    
    // Heures du lendemain (avant l'heure de début)
    for (let hour = 0; hour < startHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push({
          value: timeString,
          label: timeString,
          isNextDay: true
        });
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
                placeholder="Marie ou Marie-Claire"
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
                placeholder="marie.dupont@gmail.com"
                required
                className={`mt-1 ${
                  formData.parentEmail && !emailValidation.isValid
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : formData.parentEmail && emailValidation.isValid
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : ''
                }`}
              />
              {formData.parentEmail && !emailValidation.isValid && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  {emailValidation.error}
                </p>
              )}
              {formData.parentEmail && emailValidation.isValid && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ✓ Email valide
                </p>
              )}
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
            
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium">
                Date de garde *
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
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
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
                  {generateEndTimeOptions(formData.startTime).map(time => (
                    <SelectItem key={time.value} value={time.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{time.label}</span>
                        {time.isNextDay && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                            (le lendemain)
                          </span>
                        )}
                      </div>
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

        {/* Informations sur les Enfants - Amélioré */}
        <div className="space-y-4">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <Baby className="mr-2 h-5 w-5 text-pink-600" />
            Vos Enfants
          </h3>
          
          {/* Sélection du nombre d'enfants */}
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
                <SelectValue placeholder="Sélectionnez le nombre d'enfants" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    <div className="flex items-center space-x-2">
                      <span>{num}</span>
                      <span className="text-gray-500">enfant{num > 1 ? 's' : ''}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cartes des enfants */}
          {formData.childrenCount > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Âges des enfants *
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: formData.childrenCount }, (_, index) => (
                  <div key={index} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <Select
                          value={formData.childrenAgesArray?.[index] || ''}
                          onValueChange={(value) => handleChildAgeChange(index, value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner l'âge" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(age => (
                              <SelectItem key={age} value={age.toString()}>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{age}</span>
                                  <span className="text-gray-500">
                                    {age === 0 ? 'an' : age === 1 ? 'an' : 'ans'}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Résumé des enfants */}
          {formData.childrenCount > 0 && formData.childrenAgesArray?.some(age => age) && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Résumé : {formData.childrenCount} enfant{formData.childrenCount > 1 ? 's' : ''} 
              {formData.childrenAgesArray?.filter(age => age).length > 0 && (
                <span>
                  {' '}de {formData.childrenAgesArray.filter(age => age).join(', ')} an{formData.childrenAgesArray.filter(age => age).length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
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
