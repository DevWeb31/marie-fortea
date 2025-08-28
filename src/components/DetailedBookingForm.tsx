import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  Baby, 
  MapPin, 
  Phone, 
  AlertTriangle, 
  Heart, 
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-react';

interface ChildDetail {
  id: string;
  childOrder: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  allergies: string;
  medicalConditions: string;
  medications: string;
  dietaryRestrictions: string;
  specialNeeds: string;
  favoriteActivities: string;
  comfortItems: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

interface DetailedBookingFormProps {
  bookingRequestId: string;
  childrenCount: number;
  onSuccess?: () => void;
  className?: string;
}

const DetailedBookingForm: React.FC<DetailedBookingFormProps> = ({ 
  bookingRequestId, 
  childrenCount, 
  onSuccess, 
  className = '' 
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    // Informations de l'événement
    eventLocation: '',
    eventAddress: '',
    eventPostalCode: '',
    eventCity: '',
    eventNotes: '',
    
    // Horaires confirmés
    confirmedStartDate: '',
    confirmedStartTime: '',
    confirmedEndDate: '',
    confirmedEndTime: '',
    
    // Instructions spéciales
    specialInstructions: '',
    arrivalInstructions: '',
    departureInstructions: '',
    emergencyProcedures: '',
    
    // Contacts sur place
    onSiteContactName: '',
    onSiteContactPhone: '',
    onSiteContactRole: '',
    
    // Informations supplémentaires
    hasAllergies: false,
    hasMedicalConditions: false,
    hasSpecialNeeds: false,
    requiresSpecialAttention: false
  });

  const [childrenDetails, setChildrenDetails] = useState<ChildDetail[]>([]);

  // Initialiser les détails des enfants
  useEffect(() => {
    const initialChildren: ChildDetail[] = Array.from({ length: childrenCount }, (_, index) => ({
      id: `child-${index}`,
      childOrder: index + 1,
      firstName: '',
      lastName: '',
      birthDate: '',
      allergies: '',
      medicalConditions: '',
      medications: '',
      dietaryRestrictions: '',
      specialNeeds: '',
      favoriteActivities: '',
      comfortItems: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: ''
    }));
    setChildrenDetails(initialChildren);
  }, [childrenCount]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChildChange = (childId: string, field: string, value: string) => {
    setChildrenDetails(prev => 
      prev.map(child => 
        child.id === childId 
          ? { ...child, [field]: value }
          : child
      )
    );
  };

  const addChild = () => {
    const newChild: ChildDetail = {
      id: `child-${Date.now()}`,
      childOrder: childrenDetails.length + 1,
      firstName: '',
      lastName: '',
      birthDate: '',
      allergies: '',
      medicalConditions: '',
      medications: '',
      dietaryRestrictions: '',
      specialNeeds: '',
      favoriteActivities: '',
      comfortItems: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: ''
    };
    setChildrenDetails(prev => [...prev, newChild]);
  };

  const removeChild = (childId: string) => {
    if (childrenDetails.length > 1) {
      setChildrenDetails(prev => prev.filter(child => child.id !== childId));
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.eventLocation && formData.eventAddress && formData.eventCity);
      case 2:
        return !!(formData.confirmedStartDate && formData.confirmedStartTime && 
                  formData.confirmedEndDate && formData.confirmedEndTime);
      case 3:
        return childrenDetails.every(child => 
          child.firstName && child.birthDate
        );
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: 'Champs manquants',
        description: 'Veuillez remplir tous les champs obligatoires avant de continuer.',
        variant: 'destructive',
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      toast({
        title: 'Validation requise',
        description: 'Veuillez compléter toutes les étapes avant de soumettre.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Ici, vous appelleriez votre service pour sauvegarder les données
      // const result = await DetailedBookingService.saveDetails({
      //   bookingRequestId,
      //   formData,
      //   childrenDetails
      // });

      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Informations enregistrées !',
        description: 'Tous les détails ont été sauvegardés avec succès.',
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              index + 1 < currentStep 
                ? 'bg-green-500 border-green-500 text-white' 
                : index + 1 === currentStep 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'bg-gray-200 border-gray-300 text-gray-500'
            }`}>
              {index + 1 < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            {index < totalSteps - 1 && (
              <div className={`w-16 h-1 mx-2 ${
                index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-2 text-sm text-gray-600">
        Étape {currentStep} sur {totalSteps}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
        <MapPin className="mr-2 h-5 w-5 text-blue-600" />
        Localisation de l'Événement
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="eventLocation" className="text-sm font-medium">
            Lieu de l'événement *
          </Label>
          <Input
            id="eventLocation"
            value={formData.eventLocation}
            onChange={(e) => handleInputChange('eventLocation', e.target.value)}
            placeholder="Ex: Salle des fêtes, Restaurant, Domicile..."
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="eventAddress" className="text-sm font-medium">
            Adresse complète *
          </Label>
          <Textarea
            id="eventAddress"
            value={formData.eventAddress}
            onChange={(e) => handleInputChange('eventAddress', e.target.value)}
            placeholder="Numéro, rue, complément d'adresse..."
            required
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eventPostalCode" className="text-sm font-medium">
              Code postal
            </Label>
            <Input
              id="eventPostalCode"
              value={formData.eventPostalCode}
              onChange={(e) => handleInputChange('eventPostalCode', e.target.value)}
              placeholder="75001"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="eventCity" className="text-sm font-medium">
              Ville *
            </Label>
            <Input
              id="eventCity"
              value={formData.eventCity}
              onChange={(e) => handleInputChange('eventCity', e.target.value)}
              placeholder="Paris"
              required
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="eventNotes" className="text-sm font-medium">
            Notes sur le lieu
          </Label>
          <Textarea
            id="eventNotes"
            value={formData.eventNotes}
            onChange={(e) => handleInputChange('eventNotes', e.target.value)}
            placeholder="Informations utiles sur l'accès, le parking, etc."
            className="mt-1"
            rows={2}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
        <Clock className="mr-2 h-5 w-5 text-green-600" />
        Horaires Confirmés
      </h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="confirmedStartDate" className="text-sm font-medium">
              Date de début *
            </Label>
            <Input
              id="confirmedStartDate"
              type="date"
              value={formData.confirmedStartDate}
              onChange={(e) => handleInputChange('confirmedStartDate', e.target.value)}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="confirmedStartTime" className="text-sm font-medium">
              Heure de début *
            </Label>
            <Input
              id="confirmedStartTime"
              type="time"
              value={formData.confirmedStartTime}
              onChange={(e) => handleInputChange('confirmedStartTime', e.target.value)}
              required
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="confirmedEndDate" className="text-sm font-medium">
              Date de fin *
            </Label>
            <Input
              id="confirmedEndDate"
              type="date"
              value={formData.confirmedEndDate}
              onChange={(e) => handleInputChange('confirmedEndDate', e.target.value)}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="confirmedEndTime" className="text-sm font-medium">
              Heure de fin *
            </Label>
            <Input
              id="confirmedEndTime"
              type="time"
              value={formData.confirmedEndTime}
              onChange={(e) => handleInputChange('confirmedEndTime', e.target.value)}
              required
              className="mt-1"
            />
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Note :</strong> Ces horaires seront utilisés pour planifier la garde et la facturation.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <Baby className="mr-2 h-5 w-5 text-pink-600" />
          Informations Détaillées des Enfants
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addChild}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un enfant
        </Button>
      </div>
      
      <div className="space-y-6">
        {childrenDetails.map((child, index) => (
          <div key={child.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">
                Enfant {child.childOrder}
              </h4>
              {childrenDetails.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeChild(child.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`firstName-${child.id}`} className="text-sm font-medium">
                  Prénom *
                </Label>
                <Input
                  id={`firstName-${child.id}`}
                  value={child.firstName}
                  onChange={(e) => handleChildChange(child.id, 'firstName', e.target.value)}
                  placeholder="Prénom de l'enfant"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`lastName-${child.id}`} className="text-sm font-medium">
                  Nom de famille
                </Label>
                <Input
                  id={`lastName-${child.id}`}
                  value={child.lastName}
                  onChange={(e) => handleChildChange(child.id, 'lastName', e.target.value)}
                  placeholder="Nom de famille"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`birthDate-${child.id}`} className="text-sm font-medium">
                  Date de naissance *
                </Label>
                <Input
                  id={`birthDate-${child.id}`}
                  type="date"
                  value={child.birthDate}
                  onChange={(e) => handleChildChange(child.id, 'birthDate', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`allergies-${child.id}`} className="text-sm font-medium">
                  Allergies
                </Label>
                <Input
                  id={`allergies-${child.id}`}
                  value={child.allergies}
                  onChange={(e) => handleChildChange(child.id, 'allergies', e.target.value)}
                  placeholder="Allergies alimentaires, environnementales..."
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`medicalConditions-${child.id}`} className="text-sm font-medium">
                  Conditions médicales
                </Label>
                <Textarea
                  id={`medicalConditions-${child.id}`}
                  value={child.medicalConditions}
                  onChange={(e) => handleChildChange(child.id, 'medicalConditions', e.target.value)}
                  placeholder="Conditions médicales importantes à connaître"
                  className="mt-1"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor={`medications-${child.id}`} className="text-sm font-medium">
                  Médicaments
                </Label>
                <Textarea
                  id={`medications-${child.id}`}
                  value={child.medications}
                  onChange={(e) => handleChildChange(child.id, 'medications', e.target.value)}
                  placeholder="Médicaments à administrer, posologie..."
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`dietaryRestrictions-${child.id}`} className="text-sm font-medium">
                  Restrictions alimentaires
                </Label>
                <Input
                  id={`dietaryRestrictions-${child.id}`}
                  value={child.dietaryRestrictions}
                  onChange={(e) => handleChildChange(child.id, 'dietaryRestrictions', e.target.value)}
                  placeholder="Végétarien, sans gluten, etc."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`specialNeeds-${child.id}`} className="text-sm font-medium">
                  Besoins spéciaux
                </Label>
                <Input
                  id={`specialNeeds-${child.id}`}
                  value={child.specialNeeds}
                  onChange={(e) => handleChildChange(child.id, 'specialNeeds', e.target.value)}
                  placeholder="Besoins particuliers, handicaps..."
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`favoriteActivities-${child.id}`} className="text-sm font-medium">
                  Activités préférées
                </Label>
                <Input
                  id={`favoriteActivities-${child.id}`}
                  value={child.favoriteActivities}
                  onChange={(e) => handleChildChange(child.id, 'favoriteActivities', e.target.value)}
                  placeholder="Jeux, activités, centres d'intérêt..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`comfortItems-${child.id}`} className="text-sm font-medium">
                  Objets de réconfort
                </Label>
                <Input
                  id={`comfortItems-${child.id}`}
                  value={child.comfortItems}
                  onChange={(e) => handleChildChange(child.id, 'comfortItems', e.target.value)}
                  placeholder="Doudou, tétine, peluche..."
                  className="mt-1"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Contact d'urgence spécifique à cet enfant
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`emergencyContactName-${child.id}`} className="text-sm font-medium">
                    Nom du contact
                  </Label>
                  <Input
                    id={`emergencyContactName-${child.id}`}
                    value={child.emergencyContactName}
                    onChange={(e) => handleChildChange(child.id, 'emergencyContactName', e.target.value)}
                    placeholder="Nom du contact d'urgence"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`emergencyContactPhone-${child.id}`} className="text-sm font-medium">
                    Téléphone
                  </Label>
                  <Input
                    id={`emergencyContactPhone-${child.id}`}
                    value={child.emergencyContactPhone}
                    onChange={(e) => handleChildChange(child.id, 'emergencyContactPhone', e.target.value)}
                    placeholder="Téléphone d'urgence"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`emergencyContactRelationship-${child.id}`} className="text-sm font-medium">
                    Relation
                  </Label>
                  <Input
                    id={`emergencyContactRelationship-${child.id}`}
                    value={child.emergencyContactRelationship}
                    onChange={(e) => handleChildChange(child.id, 'emergencyContactRelationship', e.target.value)}
                    placeholder="Père, mère, grand-parent..."
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Formulaire Détaillé de Réservation
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Complétez les informations détaillées pour finaliser votre réservation.
        </p>
      </div>

      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderCurrentStep()}

        {/* Navigation entre les étapes */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            Précédent
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center"
            >
              Suivant
              <span className="ml-2">→</span>
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Finaliser la Réservation
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DetailedBookingForm;
