import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  Clock,
  Baby,
  MapPin,
  Phone,
  Mail,
  User,
  MessageSquare,
  CheckCircle,
  Star,
  Heart
} from 'lucide-react';

const Booking = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: '',
    serviceType: '',
    date: '',
    startTime: '',
    endTime: '',
    numberOfChildren: '',
    childrenDetails: '',
    specialInstructions: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Demande envoyée avec succès !",
        description: "Je vous contacterai dans les plus brefs délais pour confirmer votre réservation.",
      });
      
      // Reset form
      setFormData({
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        address: '',
        serviceType: '',
        date: '',
        startTime: '',
        endTime: '',
        numberOfChildren: '',
        childrenDetails: '',
        specialInstructions: '',
        emergencyContact: '',
        emergencyPhone: ''
      });
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceTypes = [
    { value: 'mariage', label: 'Mariage', price: '25€/h' },
    { value: 'urgence', label: 'Garde d\'urgence', price: '30€/h' },
    { value: 'soiree', label: 'Soirée parents', price: '20€/h' },
    { value: 'weekend', label: 'Week-end/Vacances', price: '18€/h' },
    { value: 'autre', label: 'Autre événement', price: 'Sur devis' }
  ];

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            Réservation Simple & Rapide
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-['Poppins']">
            Réserver une
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 block">
              Garde d'Enfants
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-['Inter'] px-4">
            Remplissez ce formulaire détaillé pour que je puisse vous proposer 
            le service le plus adapté à vos besoins et à vos enfants.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 font-['Poppins'] flex items-center">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-600" />
                  Formulaire de Réservation
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  {/* Parent Information */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-['Poppins'] flex items-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                      Informations des Parents
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="parentName" className="text-xs sm:text-sm font-medium text-gray-700">
                          Nom et Prénom *
                        </Label>
                        <Input
                          id="parentName"
                          type="text"
                          value={formData.parentName}
                          onChange={(e) => handleInputChange('parentName', e.target.value)}
                          placeholder="Marie Dupont"
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="parentPhone" className="text-xs sm:text-sm font-medium text-gray-700">
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
                    </div>
                    
                    <div>
                      <Label htmlFor="parentEmail" className="text-xs sm:text-sm font-medium text-gray-700">
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
                    
                    <div>
                      <Label htmlFor="address" className="text-xs sm:text-sm font-medium text-gray-700">
                        Adresse de la garde *
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="123 Rue de la République, 31000 Toulouse"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-['Poppins'] flex items-center">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-pink-600" />
                      Détails du Service
                    </h3>
                    
                    <div>
                      <Label htmlFor="serviceType" className="text-xs sm:text-sm font-medium text-gray-700">
                        Type de service *
                      </Label>
                      <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choisissez le type de garde" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((service) => (
                            <SelectItem key={service.value} value={service.value}>
                              <div className="flex items-center justify-between w-full text-sm">
                                <span>{service.label}</span>
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  {service.price}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="date" className="text-xs sm:text-sm font-medium text-gray-700">
                          Date *
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="startTime" className="text-xs sm:text-sm font-medium text-gray-700">
                          Heure de début *
                        </Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={(e) => handleInputChange('startTime', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="endTime" className="text-xs sm:text-sm font-medium text-gray-700">
                          Heure de fin *
                        </Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => handleInputChange('endTime', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Children Information */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-['Poppins'] flex items-center">
                      <Baby className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                      Informations sur les Enfants
                    </h3>
                    
                    <div>
                      <Label htmlFor="numberOfChildren" className="text-xs sm:text-sm font-medium text-gray-700">
                        Nombre d'enfants *
                      </Label>
                      <Select value={formData.numberOfChildren} onValueChange={(value) => handleInputChange('numberOfChildren', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionnez le nombre d'enfants" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} enfant{num > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="childrenDetails" className="text-xs sm:text-sm font-medium text-gray-700">
                        Détails des enfants (prénom, âge, particularités) *
                      </Label>
                      <Textarea
                        id="childrenDetails"
                        value={formData.childrenDetails}
                        onChange={(e) => handleInputChange('childrenDetails', e.target.value)}
                        placeholder="Ex: Lucas 4 ans (allergie aux noix), Emma 2 ans (sieste vers 14h), ..."
                        required
                        className="mt-1 min-h-[100px]"
                      />
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-['Poppins'] flex items-center">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                      Instructions Spéciales
                    </h3>
                    
                    <div>
                      <Label htmlFor="specialInstructions" className="text-xs sm:text-sm font-medium text-gray-700">
                        Instructions particulières (optionnel)
                      </Label>
                      <Textarea
                        id="specialInstructions"
                        value={formData.specialInstructions}
                        onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                        placeholder="Habitudes, jeux préférés, routine du coucher, médicaments, allergies, etc."
                        className="mt-1 min-h-[100px]"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-['Poppins'] flex items-center">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600" />
                      Contact d'Urgence
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="emergencyContact" className="text-xs sm:text-sm font-medium text-gray-700">
                          Nom du contact d'urgence
                        </Label>
                        <Input
                          id="emergencyContact"
                          type="text"
                          value={formData.emergencyContact}
                          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                          placeholder="Grand-mère, Oncle, etc."
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="emergencyPhone" className="text-xs sm:text-sm font-medium text-gray-700">
                          Téléphone d'urgence
                        </Label>
                        <Input
                          id="emergencyPhone"
                          type="tel"
                          value={formData.emergencyPhone}
                          onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                          placeholder="06 12 34 56 78"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 sm:pt-6 border-t">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Envoyer ma demande
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            {/* Contact Info */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
                <CardTitle className="font-['Poppins'] text-base sm:text-lg">
                  Contact Direct
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="text-sm sm:text-base font-medium">06 12 34 56 78</div>
                    <div className="text-xs sm:text-sm text-gray-600">Réponse rapide</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="text-sm sm:text-base font-medium break-all">marie.fortea@email.com</div>
                    <div className="text-xs sm:text-sm text-gray-600">Réponse sous 24h</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Info */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="font-['Poppins'] text-base sm:text-lg">
                  Tarifs & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  {serviceTypes.map((service) => (
                    <div key={service.value} className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-medium">{service.label}</span>
                      <Badge variant="secondary" className="text-xs">{service.price}</Badge>
                    </div>
                  ))}
                </div>
                <div className="pt-3 sm:pt-4 border-t space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <div>• Durée minimum : 3 heures</div>
                  <div>• Majoration nocturne : +5€/h après 22h</div>
                  <div>• Frais de déplacement : 5€ au-delà de 10km</div>
                </div>
              </CardContent>
            </Card>

            {/* Process */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="font-['Poppins'] text-base sm:text-lg">
                  Processus de Réservation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs sm:text-sm font-bold flex-shrink-0">1</div>
                    <div className="text-xs sm:text-sm">
                      <div className="font-medium">Demande envoyée</div>
                      <div className="text-gray-600">Formulaire reçu instantanément</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs sm:text-sm font-bold flex-shrink-0">2</div>
                    <div className="text-xs sm:text-sm">
                      <div className="font-medium">Contact sous 24h</div>
                      <div className="text-gray-600">Échange pour finaliser</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs sm:text-sm font-bold flex-shrink-0">3</div>
                    <div className="text-xs sm:text-sm">
                      <div className="font-medium">Confirmation</div>
                      <div className="text-gray-600">Réservation validée</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;