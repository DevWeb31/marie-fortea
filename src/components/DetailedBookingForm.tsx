import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  MapPin, 
  User, 
  Baby, 
  Heart, 
  MessageSquare, 
  CheckCircle,
  ArrowLeft,
  Calendar,
  Clock
} from 'lucide-react';

interface ChildDetail {
  name: string;
  age: number;
  allergies: string;
  preferences: string;
  specialNeeds: string;
}

interface DetailedBookingData {
  id: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  serviceType: string;
  requestedDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  childrenCount: number;
  childrenDetails: string;
  childrenAges: string;
  specialInstructions: string;
  emergencyContact: string;
  emergencyPhone: string;
  preferredContactMethod: string;
  contactNotes: string;
  captchaVerified: boolean;
  ipAddress: string;
  userAgent: string;
  source: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  estimatedTotal: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const DetailedBookingForm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  // Fonction pour mapper les codes de service vers des noms lisibles
  const getServiceDisplayName = (serviceCode: string) => {
    const serviceNames: { [key: string]: string } = {
      'mariage': 'Mariage',
      'urgence': 'Garde d\'urgence',
      'soiree': 'Soirée parents',
      'weekend': 'Week-end/Vacances',
      'autre': 'Autre événement'
    };
    return serviceNames[serviceCode] || serviceCode;
  };
  
  const [bookingData, setBookingData] = useState<DetailedBookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Données du formulaire
  const [address, setAddress] = useState('');
  const [children, setChildren] = useState<ChildDetail[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState('phone');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [contactNotes, setContactNotes] = useState('');

  // Charger les données de la réservation
  useEffect(() => {
    const loadBookingData = async () => {
      if (!token) {
        setError('Token manquant');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('booking_requests')
          .select('*')
          .eq('detailed_form_token', token)
          .eq('status', 'contacted')
          .is('detailed_form_completed_at', null) // S'assurer que le formulaire n'a pas déjà été soumis
          .single();

        if (error || !data) {
          // Vérifier si le formulaire a déjà été soumis
          const { data: existingData } = await supabase
            .from('booking_requests')
            .select('detailed_form_completed_at, status')
            .eq('detailed_form_token', token)
            .single();
            
          if (existingData?.detailed_form_completed_at) {
            setError('Ce formulaire a déjà été soumis. Votre réservation est confirmée.');
          } else {
            setError('Réservation non trouvée ou token invalide');
          }
          setLoading(false);
          return;
        }

        setBookingData(data);
        
        // Initialiser les enfants
        const childrenCount = data.children_count || 1;
        const initialChildren: ChildDetail[] = Array.from({ length: childrenCount }, (_, index) => ({
          name: '',
          age: 0,
          allergies: '',
          preferences: '',
          specialNeeds: ''
        }));
        setChildren(initialChildren);
        
        // Pré-remplir les champs existants
        setAddress(data.parent_address || '');
        setAdditionalInfo(data.special_instructions || '');
        setEmergencyContact(data.emergency_contact || '');
        setEmergencyPhone(data.emergency_phone || '');
        setPreferredContactMethod(data.preferred_contact_method || 'phone');
        setSpecialInstructions(data.special_instructions || '');
        setContactNotes(data.contact_notes || '');
        
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setLoading(false);
      }
    };

    loadBookingData();
  }, [token]);

  const handleChildChange = (index: number, field: keyof ChildDetail, value: string | number) => {
    const updatedChildren = [...children];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    setChildren(updatedChildren);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData) return;

    // Validation des champs requis
    if (!address.trim()) {
      setError('L\'adresse est requise');
      return;
    }

    // Vérifier que tous les enfants ont un nom et un âge
    const invalidChildren = children.filter(child => !child.name.trim() || child.age <= 0);
    if (invalidChildren.length > 0) {
      setError('Veuillez renseigner le nom et l\'âge de tous les enfants');
      return;
    }

    setSubmitting(true);
    setError(null); // Réinitialiser les erreurs
    try {
      // Récupérer l'ID du statut "confirmee"
      const { data: statusData, error: statusError } = await supabase
        .from('booking_statuses')
        .select('id')
        .eq('code', 'confirmee')
        .single();

      if (statusError || !statusData) {
        throw new Error('Erreur lors de la récupération du statut');
      }

      // Préparer les données à mettre à jour
      const updateData = {
        parent_address: address,
        children_details: children.map(child => 
          `Nom: ${child.name}, Âge: ${child.age}, Allergies: ${child.allergies}, Préférences: ${child.preferences}, Besoins spéciaux: ${child.specialNeeds}`
        ).join(' | '),
        children_ages: children.map(child => child.age).join(', '),
        special_instructions: specialInstructions,
        emergency_contact: emergencyContact,
        emergency_phone: emergencyPhone,
        preferred_contact_method: preferredContactMethod,
        contact_notes: contactNotes,
        detailed_form_completed_at: new Date().toISOString(),
        status: 'confirmed', // Garder l'ancien système pour compatibilité
        status_id: statusData.id, // Utiliser le nouveau système de statuts
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('booking_requests')
        .update(updateData)
        .eq('id', bookingData.id);

      if (error) {
        throw new Error('Erreur lors de la mise à jour');
      }

      // Rediriger vers une page de confirmation
      navigate('/booking-confirmed', { 
        state: { 
          bookingId: bookingData.id,
          parentName: bookingData.parent_name 
        } 
      });
    } catch (err) {
      setError('Erreur lors de la soumission du formulaire');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du formulaire...</p>
        </div>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <CheckCircle className="h-12 w-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Erreur</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => navigate('/')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="mb-4 bg-white/80 hover:bg-white/90 text-gray-700 border-gray-200 hover:border-gray-300 dark:bg-transparent dark:hover:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:border-gray-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              Compléter votre réservation
            </h1>
            <p className="text-muted-foreground">
              Bonjour {bookingData.parent_name}, veuillez compléter les détails de votre réservation
            </p>
          </div>
        </div>

        {/* Résumé de la réservation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Résumé de votre réservation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Type de service</Label>
                <p className="font-medium">{getServiceDisplayName(bookingData.service_type) || 'Service personnalisé'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                <p className="font-medium">{new Date(bookingData.requested_date).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Horaires</Label>
                <p className="font-medium">
                  {bookingData.start_time} - {bookingData.end_time}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Nombre d'enfants</Label>
                <p className="font-medium">{bookingData.children_count}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affichage des erreurs */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <CheckCircle className="h-5 w-5" />
                <p className="font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulaire détaillé */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Adresse */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Adresse de la garde
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="address">Adresse complète *</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 rue de la Paix, 75001 Paris"
                  required
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations sur les enfants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5" />
                Informations sur les enfants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {children.map((child, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-4">Enfant {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`child-name-${index}`}>Prénom *</Label>
                        <Input
                          id={`child-name-${index}`}
                          value={child.name}
                          onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                          placeholder="Prénom de l'enfant"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`child-age-${index}`}>Âge *</Label>
                        <Input
                          id={`child-age-${index}`}
                          type="number"
                          min="0"
                          max="18"
                          value={child.age}
                          onChange={(e) => handleChildChange(index, 'age', parseInt(e.target.value) || 0)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`child-allergies-${index}`}>Allergies et particularités</Label>
                        <Textarea
                          id={`child-allergies-${index}`}
                          value={child.allergies}
                          onChange={(e) => handleChildChange(index, 'allergies', e.target.value)}
                          placeholder="Allergies alimentaires, médicamenteuses, particularités..."
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`child-preferences-${index}`}>Préférences et goûts</Label>
                        <Textarea
                          id={`child-preferences-${index}`}
                          value={child.preferences}
                          onChange={(e) => handleChildChange(index, 'preferences', e.target.value)}
                          placeholder="Aliments préférés, activités, jeux..."
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`child-special-needs-${index}`}>Besoins spéciaux</Label>
                        <Textarea
                          id={`child-special-needs-${index}`}
                          value={child.specialNeeds}
                          onChange={(e) => handleChildChange(index, 'specialNeeds', e.target.value)}
                          placeholder="Médicaments, soins particuliers, habitudes..."
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact d'urgence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact d'urgence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency-contact">Nom du contact d'urgence</Label>
                  <Input
                    id="emergency-contact"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Nom et prénom"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="emergency-phone">Téléphone d'urgence</Label>
                  <Input
                    id="emergency-phone"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions spéciales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Instructions et commentaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="special-instructions">Instructions spéciales</Label>
                  <Textarea
                    id="special-instructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Instructions particulières pour la garde..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-notes">Notes de contact</Label>
                  <Textarea
                    id="contact-notes"
                    value={contactNotes}
                    onChange={(e) => setContactNotes(e.target.value)}
                    placeholder="Informations supplémentaires..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Méthode de contact préférée</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={preferredContactMethod === 'phone'}
                        onCheckedChange={() => setPreferredContactMethod('phone')}
                      />
                      <span className="text-sm">Téléphone</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={preferredContactMethod === 'email'}
                        onCheckedChange={() => setPreferredContactMethod('email')}
                      />
                      <span className="text-sm">Email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={preferredContactMethod === 'sms'}
                        onCheckedChange={() => setPreferredContactMethod('sms')}
                      />
                      <span className="text-sm">SMS</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bouton de soumission */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              {submitting ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirmer la réservation
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetailedBookingForm;