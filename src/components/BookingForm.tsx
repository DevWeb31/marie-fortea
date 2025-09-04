import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import ContactSummaryModal from './ContactSummaryModal';
import SuccessAnimation from './SuccessAnimation';
import { BookingService } from '@/lib/booking-service';
import { PricingService } from '@/lib/pricing-service';
import { Calendar, Baby, User, CheckCircle, AlertCircle, Calculator } from 'lucide-react';

interface BookingFormProps {
  onSuccess?: () => void;
  className?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess, className = '' }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [estimatedTotal, setEstimatedTotal] = useState<number>(0);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [captchaResetTrigger, setCaptchaResetTrigger] = useState(0);

  // Fonction pour obtenir les services par défaut
  const getDefaultServices = () => [
    {
      code: 'babysitting',
      name: 'Garde d\'enfants',
      description: 'Garde d\'enfants professionnelle',
      basePrice: 20.00,
      nightPrice: null,
      hasNightPrice: false,
      minDurationHours: 3,
      maxChildren: 3,
      startHour: 9,
      endHour: 15,
      maxEndHour: 18,
      isActive: true
    },
    {
      code: 'event_support',
      name: 'Soutien événementiel',
      description: 'Garde d\'enfants pour événements',
      basePrice: 25.00,
      nightPrice: 30.00,
      hasNightPrice: true,
      minDurationHours: 4,
      maxChildren: 6,
      startHour: 14,
      endHour: 21,
      maxEndHour: 1,
      isActive: true
    },
    {
      code: 'evening_care',
      name: 'Garde en soirée',
      description: 'Garde d\'enfants en soirée',
      basePrice: 20.00,
      nightPrice: 25.00,
      hasNightPrice: true,
      minDurationHours: 3,
      maxChildren: 3,
      startHour: 18,
      endHour: 1,
      maxEndHour: 1,
      isActive: true
    },
    {
      code: 'emergency_care',
      name: 'Garde d\'urgence',
      description: 'Garde d\'enfants en urgence',
      basePrice: 40.00,
      nightPrice: null,
      hasNightPrice: false,
      minDurationHours: 2,
      maxChildren: 3,
      startHour: 8,
      endHour: 1,
      maxEndHour: 1,
      isActive: true
    }
  ];

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

  // État pour les services dynamiques
  const [dynamicServices, setDynamicServices] = useState<any[]>(getDefaultServices());
  const [servicesLoading, setServicesLoading] = useState(true);

  // Charger les services dynamiques
  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data: pricingData, error } = await PricingService.getPublicPricing();
        
        if (error) {
          console.error('Erreur lors du chargement des services:', error);
          // Fallback vers les services par défaut
          setDynamicServices(getDefaultServices());
        } else if (pricingData) {
          setDynamicServices(getDynamicServices(pricingData));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des services:', error);
        setDynamicServices(getDefaultServices());
      } finally {
        setServicesLoading(false);
      }
    };

    loadServices();
  }, []);

  // Calculer le total estimé quand les données changent
  useEffect(() => {
    const calculateTotal = async () => {
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
        
        // Utiliser le service de prix dynamiques
        try {
          const { data: calculation, error } = await PricingService.calculatePrice(
            formData.serviceType,
            durationHours,
            formData.childrenCount
          );
          
          if (error) {
            console.error('Erreur lors du calcul du prix:', error);
            // Fallback vers l'ancien calcul
            const basePrice = getServiceTypeInfo(formData.serviceType)?.basePrice || 0;
            const total = basePrice * Math.max(1, durationHours);
            setEstimatedTotal(total);
          } else if (calculation) {
            setEstimatedTotal(calculation.totalAmount);
          }
        } catch (error) {
          console.error('Erreur lors du calcul du prix:', error);
          // Fallback vers l'ancien calcul
          const basePrice = getServiceTypeInfo(formData.serviceType)?.basePrice || 0;
          const total = basePrice * Math.max(1, durationHours);
          setEstimatedTotal(total);
        }
      }
    };

    calculateTotal();
  }, [formData.serviceType, formData.startTime, formData.endTime, formData.startDate, formData.childrenCount]);

  // Fonction pour obtenir les services dynamiques
  const getDynamicServices = (pricingData: any) => {
    const serviceMapping: { [key: string]: any } = {
      babysitting: {
        name: 'Garde d\'enfants',
        description: 'Garde d\'enfants professionnelle',
        minDurationHours: 3,
        hasNightPrice: false,
        nightPrice: null,
        maxChildren: 3,
        startHour: 9,
        endHour: 18,
        maxEndHour: 18,
      },
      event_support: {
        name: 'Soutien événementiel',
        description: 'Garde d\'enfants pour événements',
        minDurationHours: 4,
        hasNightPrice: true,
        nightPrice: 30,
        maxChildren: 6,
        startHour: 14,
        endHour: 1,
        maxEndHour: 1,
      },
      evening_care: {
        name: 'Garde en soirée',
        description: 'Garde d\'enfants en soirée',
        minDurationHours: 3,
        hasNightPrice: true,
        nightPrice: 25,
        maxChildren: 3,
        startHour: 18,
        endHour: 1,
        maxEndHour: 1,
      },
      emergency_care: {
        name: 'Garde d\'urgence',
        description: 'Garde d\'enfants en urgence',
        minDurationHours: 2,
        hasNightPrice: false,
        nightPrice: null,
        maxChildren: 3,
        startHour: 8,
        endHour: 1,
        maxEndHour: 1,
      },
    };

    return pricingData.services.map((service: any) => ({
      code: service.type,
      ...serviceMapping[service.type],
      basePrice: service.price,
      nightPrice: service.nightPrice,
      hasNightPrice: service.hasNightPrice,
      isActive: true
    }));
  };

  // Fonction pour formater en Camel Case avec gestion des tirets
  const formatToCamelCase = (value: string): string => {
    if (!value) return '';
    // Diviser par les tirets, mettre en majuscule la première lettre de chaque partie, puis rejoindre
    return value.split('-').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join('-');
  };

  // Fonction pour formater le nom de famille avec gestion des espaces
  const formatLastName = (value: string): string => {
    if (!value) return '';
    // Diviser par les espaces, mettre en majuscule la première lettre de chaque mot, puis rejoindre
    return value.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
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

  // Fonction pour nettoyer l'email des caractères interdits
  const cleanEmailInput = (value: string): string => {
    // Supprimer les caractères spéciaux et accents, garder seulement lettres, chiffres, @, ., -, _
    return value.replace(/[^a-zA-Z0-9@.\-_]/g, '');
  };

  // Fonction pour valider et formater l'email
  const validateAndFormatEmail = (value: string): { value: string; isValid: boolean; error?: string } => {
    // Nettoyer d'abord l'email des caractères interdits
    const cleanedValue = cleanEmailInput(value);
    const trimmedValue = cleanedValue.trim().toLowerCase();
    
    if (!trimmedValue) {
      return { value: trimmedValue, isValid: false, error: 'Email requis' };
    }
    
    // Vérifier les caractères interdits (double vérification)
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
      
      // Vérifier la limite du service
      if (formData.serviceType) {
        const service = getServiceTypeInfo(formData.serviceType);
        const maxChildren = service?.maxChildren || 3;
        
        if (newCount > maxChildren) {
          toast({
            title: 'Limite dépassée',
            description: `Ce service accepte maximum ${maxChildren} enfants.`,
            variant: 'destructive',
          });
          return;
        }
      }
      
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
    } else if (field === 'serviceType') {
      // Réinitialiser les champs de date, d'heures et d'enfants quand le type de service change
      setFormData(prev => ({ 
        ...prev, 
        [field]: value as string,
        startDate: '',
        startTime: '',
        endTime: '',
        childrenCount: 1,
        childrenAges: '',
        childrenAgesArray: ['']
      }));
      
      // Réinitialiser l'estimation du prix
      setEstimatedTotal(0);
    } else if (field === 'startDate') {
      // Réinitialiser les champs d'heures quand la date change
      setFormData(prev => ({ 
        ...prev, 
        [field]: value as string,
        startTime: '',
        endTime: ''
      }));
    } else if (field === 'parentFirstName') {
      // Traitement spécial pour le prénom
      const processedValue = processFirstName(value as string);
      const formattedValue = formatToCamelCase(processedValue);
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
    } else if (field === 'parentLastName') {
      // Traitement spécial pour le nom
      const processedValue = processLastName(value as string);
      const formattedValue = formatLastName(processedValue);
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
    } else if (field === 'startTime') {
      // Réinitialiser l'heure de fin quand l'heure de début change
      setFormData(prev => ({ 
        ...prev, 
        [field]: value as string,
        endTime: ''
      }));
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

  // Fonction de validation des données du formulaire
  const validateFormData = (): boolean => {
    if (!captchaToken) {
      toast({
        title: 'Vérification requise',
        description: 'Veuillez compléter la vérification de sécurité avant d\'envoyer votre demande.',
        variant: 'destructive',
      });
      return false;
    }

    // Validation de l'email
    if (!emailValidation.isValid) {
      toast({
        title: 'Email invalide',
        description: emailValidation.error || 'Veuillez saisir un email valide.',
        variant: 'destructive',
      });
      return false;
    }

    // Validation des champs requis avec messages spécifiques
    if (!formData.parentFirstName?.trim()) {
      toast({
        title: 'Prénom manquant',
        description: 'Veuillez saisir votre prénom.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.parentLastName?.trim()) {
      toast({
        title: 'Nom manquant',
        description: 'Veuillez saisir votre nom de famille.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.parentPhone?.trim()) {
      toast({
        title: 'Téléphone manquant',
        description: 'Veuillez saisir votre numéro de téléphone.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.parentEmail?.trim()) {
      toast({
        title: 'Email manquant',
        description: 'Veuillez saisir votre adresse email.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.serviceType?.trim()) {
      toast({
        title: 'Type de service manquant',
        description: 'Veuillez sélectionner un type de service.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.startDate?.trim()) {
      toast({
        title: 'Date de garde manquante',
        description: 'Veuillez sélectionner une date de garde.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.startTime?.trim()) {
      toast({
        title: 'Heure de début manquante',
        description: 'Veuillez sélectionner une heure de début.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.endTime?.trim()) {
      toast({
        title: 'Heure de fin manquante',
        description: 'Veuillez sélectionner une heure de fin.',
        variant: 'destructive',
      });
      return false;
    }

    // Validation du nombre d'enfants
    if (formData.childrenCount < 1) {
      toast({
        title: 'Nombre d\'enfants invalide',
        description: 'Veuillez sélectionner au moins 1 enfant.',
        variant: 'destructive',
      });
      return false;
    }

    // Validation de la limite d'enfants selon le service
    if (formData.serviceType) {
      const service = getServiceTypeInfo(formData.serviceType);
      const maxChildren = service?.maxChildren || 3;
      
      if (formData.childrenCount > maxChildren) {
        toast({
          title: 'Nombre d\'enfants trop élevé',
          description: `Ce service accepte maximum ${maxChildren} enfant${maxChildren > 1 ? 's' : ''}.`,
          variant: 'destructive',
        });
        return false;
      }
    }

    // Validation des âges des enfants
    if (formData.childrenCount > 0) {
      const filledAges = formData.childrenAgesArray?.filter(age => age && age.trim()) || [];
      
      if (filledAges.length !== formData.childrenCount) {
        toast({
          title: 'Âges manquants',
          description: `Veuillez sélectionner l'âge pour tous les ${formData.childrenCount} enfant${formData.childrenCount > 1 ? 's' : ''}.`,
          variant: 'destructive',
        });
        return false;
      }
    }

    // Validation des heures
    if (formData.startTime && formData.endTime) {
      const startTime = new Date(`2000-01-01T${formData.startTime}`);
      const endTime = new Date(`2000-01-01T${formData.endTime}`);
      
      // Si l'heure de fin est avant l'heure de début, c'est le lendemain
      if (endTime <= startTime) {
        endTime.setDate(endTime.getDate() + 1);
      }
      
      const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      
      // Vérifier la durée minimale selon le type de service
      const serviceInfo = getServiceTypeInfo(formData.serviceType);
      const minDurationHours = serviceInfo?.minDurationHours || 1;
      
      if (durationHours < minDurationHours) {
        toast({
          title: 'Erreur de durée',
          description: `La durée minimale pour ce service est de ${minDurationHours} heure${minDurationHours > 1 ? 's' : ''}.`,
          variant: 'destructive',
        });
        return false;
      }
      
      // Vérifier la durée maximale (plus flexible pour les gardes de nuit)
      const maxDurationHours = 48; // Augmenter la limite pour permettre les gardes de nuit
      
      if (durationHours > maxDurationHours) {
        toast({
          title: 'Erreur de durée',
          description: `La durée maximale est de ${maxDurationHours} heures.`,
          variant: 'destructive',
        });
        return false;
      }
    }

    return true;
  };

  // Fonction pour gérer la soumission du formulaire (ouvre la modale)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateFormData()) {
      setShowSummaryModal(true);
    }
  };

  // Fonction pour confirmer et envoyer la demande
  const handleConfirmSubmission = async () => {
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

      // Fermer la modale et afficher l'animation
      setShowSummaryModal(false);
      setShowSuccessAnimation(true);
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

  // Fonction pour revenir en arrière depuis la modale
  const handleGoBack = () => {
    setShowSummaryModal(false);
  };

  // Fonction pour gérer la fin de l'animation
  const handleAnimationComplete = () => {
    setShowSuccessAnimation(false);
    
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
    
    // Réinitialiser le captcha
    setCaptchaResetTrigger(prev => prev + 1);

    // Appeler le callback de succès
    onSuccess?.();
  };

  const getServiceTypeInfo = (code: string) => {
    return dynamicServices.find(service => service.code === code);
  };

    // Générer les heures par intervalles de 30 minutes selon le service sélectionné
  const generateTimeOptions = () => {
    if (!formData.serviceType) {
      // Retourner toutes les heures si aucun service n'est sélectionné
      const times = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          times.push({
            value: timeString,
            label: timeString,
            isNextDay: false,
            key: `time-${timeString}`
          });
        }
      }
      return times;
    }

    const service = getServiceTypeInfo(formData.serviceType);
    if (!service) return [];

    const times = [];
    const startHour = service.startHour || 0;
    const endHour = service.endHour || 23;
    const minDurationHours = service.minDurationHours || 1;

    // Calculer l'heure maximale de début (limite maximale - durée minimale)
    let maxStartHour;
    if (endHour < startHour) {
      // Service qui va jusqu'au lendemain (ex: 14h à 1h)
      // L'heure maximale de début est la limite maximale du lendemain moins la durée minimale
      maxStartHour = endHour - minDurationHours;
      if (maxStartHour < 0) maxStartHour += 24; // Si négatif, c'est le même jour
    } else {
      // Service qui reste le même jour (ex: 9h à 18h)
      maxStartHour = endHour - minDurationHours;
    }

    // Gérer le cas spécial où endHour < startHour (ex: 14h à 01h)
    if (endHour < startHour) {
      // Première plage : de startHour à 23h
      for (let hour = startHour; hour < 24; hour++) {
        // Vérifier que l'heure respecte la durée minimale
        if (hour <= maxStartHour) {
          for (let minute = 0; minute < 60; minute += 30) {
            // Exclure la demi-heure de l'heure maximale
            if (hour === maxStartHour && minute === 30) continue;
            
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            times.push({
              value: timeString,
              label: timeString,
              isNextDay: false,
              key: `time-${timeString}`
            });
          }
        }
      }
      // Ne pas inclure les heures du lendemain dans les heures de début
    } else {
      // Plage normale : de startHour à maxStartHour
      for (let hour = startHour; hour <= maxStartHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          // Pour la dernière heure, ne pas inclure les 30 minutes si c'est l'heure exacte de fin
          if (hour === maxStartHour && minute === 30) continue;
          
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          times.push({
            value: timeString,
            label: timeString,
            isNextDay: false,
            key: `time-${timeString}`
          });
        }
      }
    }

    return times;
  };

  // Générer les heures de fin disponibles selon l'heure de début et le service sélectionné
  const generateEndTimeOptions = (startTime: string) => {
    if (!startTime) return generateTimeOptions();
    
    const times = [];
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    
    // Obtenir les informations du service
    const service = formData.serviceType ? getServiceTypeInfo(formData.serviceType) : null;
    if (!service) return [];
    
    const minDurationHours = service.minDurationHours || 1;
    const maxEndHour = service.maxEndHour || 23;
    
    // Calculer l'heure minimale de fin (durée minimale après l'heure de début)
    // Convertir en minutes pour gérer correctement les demi-heures
    const startTotalMinutes = startHour * 60 + startMinute;
    const minEndTotalMinutes = startTotalMinutes + (minDurationHours * 60);
    const minEndHour = Math.floor(minEndTotalMinutes / 60);
    const minEndMinute = minEndTotalMinutes % 60;
    
    // Logique basée sur les spécifications exactes
    if (maxEndHour < 12) {
      // Services qui vont jusqu'au lendemain (Soutien événementiel, Garde en soirée, Garde d'urgence)
      
      // Si l'heure minimale est le même jour
      if (minEndHour < 24) {
        // Ajouter toutes les heures du même jour à partir de l'heure minimale jusqu'à 23h30
        for (let hour = minEndHour; hour < 24; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            // Pour la première heure, commencer à partir de minEndMinute
            if (hour === minEndHour && minute < minEndMinute) continue;
            
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            times.push({
              value: timeString,
              label: timeString,
              isNextDay: false,
              key: `same-day-${timeString}`
            });
          }
        }
        
        // Ajouter les heures du lendemain jusqu'à maxEndHour
        // Gérer le cas spécial où maxEndHour = 0 (00h)
        if (maxEndHour === 0) {
          // Pour maxEndHour = 0, générer seulement 00h00
          const timeString = "00:00";
          times.push({
            value: timeString,
            label: timeString,
            isNextDay: true,
            key: `next-day-${timeString}`
          });
        } else {
          // Pour les autres cas (maxEndHour > 0)
          for (let hour = 0; hour <= maxEndHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
              // Exclure la demi-heure de l'heure maximale
              if (hour === maxEndHour && minute === 30) continue;
              
              const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              times.push({
                value: timeString,
                label: timeString,
                isNextDay: true,
                key: `next-day-${timeString}`
              });
            }
          }
        }
      } else {
        // L'heure minimale est déjà le lendemain
        const nextDayHour = minEndHour - 24;
        if (maxEndHour === 0) {
          // Pour maxEndHour = 0, vérifier si on peut inclure 00h00
          if (nextDayHour <= 0) {
            const timeString = "00:00";
            times.push({
              value: timeString,
              label: timeString,
              isNextDay: true,
              key: `next-day-${timeString}`
            });
          }
        } else {
          // Pour les autres cas (maxEndHour > 0)
          for (let hour = nextDayHour; hour <= maxEndHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
              // Pour la première heure, commencer à partir de minEndMinute
              if (hour === nextDayHour && minute < minEndMinute) continue;
              
              // Exclure la demi-heure de l'heure maximale
              if (hour === maxEndHour && minute === 30) continue;
              
              const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              times.push({
                value: timeString,
                label: timeString,
                isNextDay: true,
                key: `next-day-${timeString}`
              });
            }
          }
        }
      }
    } else {
      // Services qui restent le même jour (Garde d'enfant)
      for (let hour = minEndHour; hour <= maxEndHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          // Pour la première heure, commencer à partir de minEndMinute
          if (hour === minEndHour && minute < minEndMinute) continue;
          
          // Exclure la demi-heure de l'heure maximale
          if (hour === maxEndHour && minute === 30) continue;
          
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          times.push({
            value: timeString,
            label: timeString,
            isNextDay: false,
            key: `same-day-${timeString}`
          });
        }
      }
    }
    
    return times;
  };

  // Fonction pour calculer et formater la durée
  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime || !formData.startDate) {
      return null;
    }
    
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);
    
    // Si l'heure de fin est avant l'heure de début, c'est le lendemain
    if (endDateTime <= startDateTime) {
      endDateTime.setDate(endDateTime.getDate() + 1);
    }
    
    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    
    if (durationHours < 1) {
      const durationMinutes = Math.round(durationMs / (1000 * 60));
      return `${durationMinutes} minute${durationMinutes > 1 ? 's' : ''}`;
    } else if (durationHours < 24) {
      const hours = Math.floor(durationHours);
      const minutes = Math.round((durationHours - hours) * 60);
      
      if (minutes === 0) {
        return `${hours} heure${hours > 1 ? 's' : ''}`;
      } else {
        return `${hours}h${minutes.toString().padStart(2, '0')}`;
      }
    } else {
      const days = Math.floor(durationHours / 24);
      const remainingHours = Math.floor(durationHours % 24);
      
      if (remainingHours === 0) {
        return `${days} jour${days > 1 ? 's' : ''}`;
      } else {
        return `${days} jour${days > 1 ? 's' : ''} et ${remainingHours} heure${remainingHours > 1 ? 's' : ''}`;
      }
    }
  };

  // Fonction pour calculer les durées de jour et de nuit
  const calculateDayNightDuration = () => {
    if (!formData.startTime || !formData.endTime || !formData.startDate) {
      return null;
    }
    
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);
    
    // Si l'heure de fin est avant l'heure de début, c'est le lendemain
    if (endDateTime <= startDateTime) {
      endDateTime.setDate(endDateTime.getDate() + 1);
    }
    
    // Définir les heures de jour (6h à 22h) et de nuit (22h à 6h)
    const dayStartHour = 6;
    const dayEndHour = 22;
    
    let dayHours = 0;
    let nightHours = 0;
    
    // Parcourir chaque heure entre le début et la fin
    const currentTime = new Date(startDateTime);
    
    while (currentTime < endDateTime) {
      const hour = currentTime.getHours();
      
      // Déterminer si c'est une heure de jour ou de nuit
      if (hour >= dayStartHour && hour < dayEndHour) {
        dayHours += 0.5; // Incrément de 30 minutes
      } else {
        nightHours += 0.5; // Incrément de 30 minutes
      }
      
      // Avancer de 30 minutes
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    
    // Fonction pour formater les heures au format "XhXX"
    const formatHours = (hours: number) => {
      const wholeHours = Math.floor(hours);
      const minutes = Math.round((hours - wholeHours) * 60);
      
      if (minutes === 0) {
        return `${wholeHours}h`;
      } else {
        return `${wholeHours}h${minutes.toString().padStart(2, '0')}`;
      }
    };
    
    return {
      dayHours: Math.round(dayHours * 10) / 10, // Garder pour les calculs
      nightHours: Math.round(nightHours * 10) / 10, // Garder pour les calculs
      dayHoursFormatted: formatHours(dayHours),
      nightHoursFormatted: formatHours(nightHours)
    };
  };

  // Fonction pour obtenir les options d'enfants selon le service sélectionné
  const getChildrenOptions = () => {
    if (!formData.serviceType) {
      return [1, 2, 3, 4, 5, 6]; // Options par défaut
    }
    
    const service = getServiceTypeInfo(formData.serviceType);
    const maxChildren = service?.maxChildren || 3;
    
    return Array.from({ length: maxChildren }, (_, i) => i + 1);
  };

  // Fonction pour vérifier si le formulaire est complet
  const isFormComplete = () => {
    // Vérifier les champs obligatoires de base
    if (!formData.parentFirstName?.trim()) return false;
    if (!formData.parentLastName?.trim()) return false;
    if (!formData.parentPhone?.trim()) return false;
    if (!formData.parentEmail?.trim()) return false;
    if (!formData.serviceType?.trim()) return false;
    if (!formData.startDate?.trim()) return false;
    if (!formData.startTime?.trim()) return false;
    if (!formData.endTime?.trim()) return false;
    
    // Vérifier le nombre d'enfants
    if (formData.childrenCount < 1) return false;
    
    // Vérifier la limite d'enfants selon le service
    if (formData.serviceType) {
      const service = getServiceTypeInfo(formData.serviceType);
      const maxChildren = service?.maxChildren || 3;
      if (formData.childrenCount > maxChildren) return false;
    }
    
    // Vérifier que tous les âges sont renseignés
    if (formData.childrenCount > 0) {
      const filledAges = formData.childrenAgesArray?.filter(age => age && age.trim()) || [];
      if (filledAges.length !== formData.childrenCount) return false;
    }
    
    // Vérifier la validation de l'email
    if (!emailValidation.isValid) return false;
    
    // Vérifier le captcha
    if (!captchaToken) return false;
    
    return true;
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
                placeholder="Jean ou Jean-Luc"
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
                placeholder="Dupont ou De La Fontaine"
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
                placeholder="exemple@email.com"
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
                  {servicesLoading ? (
                    <SelectItem value="loading" disabled>
                      Chargement des services...
                    </SelectItem>
                  ) : dynamicServices.length > 0 ? (
                    dynamicServices.map(service => (
                      <SelectItem key={service.code} value={service.code}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className="font-medium">{service.name}</span>
                            {service.hasNightPrice && (
                              <span className="text-xs text-gray-500">
                                Jour: {service.basePrice}€/h | Nuit: {service.nightPrice}€/h
                              </span>
                            )}
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {service.hasNightPrice ? `${service.basePrice}€/h` : `${service.basePrice}€/h`}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-services" disabled>
                      Aucun service disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {formData.serviceType && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Plage horaire : {getServiceTypeInfo(formData.serviceType)?.startHour}h à {getServiceTypeInfo(formData.serviceType)?.endHour}h • Durée minimale : {getServiceTypeInfo(formData.serviceType)?.minDurationHours}h
                </p>
              )}
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
                disabled={!formData.serviceType}
                className={`mt-1 ${!formData.serviceType ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}`}
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
                disabled={!formData.serviceType || !formData.startDate}
              >
                <SelectTrigger className={`mt-1 ${(!formData.serviceType || !formData.startDate) ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}`}>
                  <SelectValue placeholder="Sélectionnez une heure" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem key={time.key} value={time.value}>
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
                disabled={!formData.serviceType || !formData.startDate || !formData.startTime}
              >
                <SelectTrigger className={`mt-1 ${(!formData.serviceType || !formData.startDate || !formData.startTime) ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}`}>
                  <SelectValue placeholder="Sélectionnez une heure" />
                </SelectTrigger>
                <SelectContent>
                  {generateEndTimeOptions(formData.startTime).map(time => (
                    <SelectItem key={time.key} value={time.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{time.label}</span>
                        {time.isNextDay && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 ml-2">
                            (lendemain)
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Informations sur les Enfants */}
        <div className="space-y-4">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <Baby className="mr-2 h-5 w-5 text-pink-600" />
            Vos Enfants
          </h3>
          
          <div>
            <Label htmlFor="childrenCount" className="text-sm font-medium">
              Nombre d'enfants *
            </Label>
            <Select
              value={formData.childrenCount.toString()}
              onValueChange={(value) => handleInputChange('childrenCount', parseInt(value))}
              required
              disabled={!formData.serviceType}
            >
              <SelectTrigger className={`mt-1 ${!formData.serviceType ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}`}>
                <SelectValue placeholder="Sélectionnez le nombre d'enfants" />
              </SelectTrigger>
              <SelectContent>
                {getChildrenOptions().map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    <div className="flex items-center space-x-2">
                      <span>{num}</span>
                      <span className="text-gray-500">enfant{num > 1 ? 's' : ''}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.serviceType && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Maximum {getServiceTypeInfo(formData.serviceType)?.maxChildren || 3} enfants pour ce service
              </p>
            )}
          </div>

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

        {/* Estimation du prix */}
        <div className="space-y-4">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <Calculator className="mr-2 h-5 w-5 text-green-600" />
            Estimation du Prix
          </h3>
          
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
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                <p>Basé sur {getServiceTypeInfo(formData.serviceType)?.name}</p>
                {calculateDuration() && (
                  <p>Durée totale : {calculateDuration()}</p>
                )}
                {(() => {
                  const dayNightDuration = calculateDayNightDuration();
                  return dayNightDuration && (
                    <div className="mt-1">
                      {dayNightDuration.dayHours > 0 && (
                        <p>• Jour (6h-22h) : {dayNightDuration.dayHoursFormatted}</p>
                      )}
                      {dayNightDuration.nightHours > 0 && (
                        <p>• Nuit (22h-6h) : {dayNightDuration.nightHoursFormatted}</p>
                      )}
                    </div>
                  );
                })()}
                {formData.childrenCount > 2 && (
                  <p>• Enfants supplémentaires (à partir du 3ème) : {formData.childrenCount - 2} enfant{(formData.childrenCount - 2) > 1 ? 's' : ''} × 5€/h</p>
                )}
                {getServiceTypeInfo(formData.serviceType)?.hasNightPrice ? (
                  <p>Tarifs: {getServiceTypeInfo(formData.serviceType)?.basePrice}€/h jour | {getServiceTypeInfo(formData.serviceType)?.nightPrice}€/h nuit</p>
                ) : (
                  <p>Tarif: {getServiceTypeInfo(formData.serviceType)?.basePrice}€/h</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Sélectionnez un service pour voir l'estimation
              </p>
            )}
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
          resetTrigger={captchaResetTrigger}
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
            disabled={isSubmitting || !isFormComplete()}
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
          
          {!isFormComplete() && (
            <div className="flex items-center mt-2 text-sm text-amber-600 dark:text-amber-400">
              <AlertCircle className="mr-2 h-4 w-4" />
              Veuillez compléter tous les champs obligatoires
            </div>
          )}
        </div>
      </form>

      {/* Modale de récapitulatif */}
      <ContactSummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        onConfirm={handleConfirmSubmission}
        onGoBack={handleGoBack}
        formData={{
          parentFirstName: formData.parentFirstName,
          parentLastName: formData.parentLastName,
          parentPhone: formData.parentPhone,
          parentEmail: formData.parentEmail,
          serviceType: formData.serviceType,
          startDate: formData.startDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          childrenCount: formData.childrenCount,
          childrenAges: formData.childrenAges,
          parentAddress: 'À préciser lors du contact',
          specialInstructions: '',
          emergencyContact: '',
          emergencyPhone: '',
          preferredContactMethod: 'phone',
          contactNotes: ''
        }}
        estimatedTotal={estimatedTotal}
        isSubmitting={isSubmitting}
      />

      {/* Animation de succès moderne */}
      <SuccessAnimation
        isVisible={showSuccessAnimation}
        onComplete={handleAnimationComplete}
      />
    </div>
  );
};

export default BookingForm;

