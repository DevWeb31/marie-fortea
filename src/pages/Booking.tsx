import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import HarmoniousButton from '@/components/ui/harmonious-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { AnimatedSection, AnimatedTitle } from '@/components/ScrollAnimation';
import PhoneHoursDialog from '@/components/PhoneHoursDialog';
import {
  Calendar,
  Clock,
  Baby,
  MapPin,
  Phone,
  User,
  MessageSquare,
  CheckCircle,
  Star,
  Heart,
} from 'lucide-react';

const Booking = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);

  const handlePhoneClick = () => {
    setIsPhoneDialogOpen(true);
  };
  const [formData, setFormData] = useState({
    parentName: '',
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
    emergencyPhone: '',
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
        title: 'Demande envoyée avec succès !',
        description:
          'Je vous contacterai dans les plus brefs délais pour confirmer votre réservation.',
      });

      // Reset form
      setFormData({
        parentName: '',
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
        emergencyPhone: '',
      });
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

  const serviceTypes = [
    { value: 'mariage', label: 'Mariage', price: '25€/h' },
    { value: 'urgence', label: "Garde d'urgence", price: '30€/h' },
    { value: 'soiree', label: 'Soirée parents', price: '20€/h' },
    { value: 'weekend', label: 'Week-end/Vacances', price: '18€/h' },
    { value: 'autre', label: 'Autre événement', price: 'Sur devis' },
  ];

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="mb-12 text-center">
          <Badge className="mb-6 bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200">
            <Star className="mr-2 h-4 w-4" />
            Réservation Simple & Rapide
          </Badge>

          <AnimatedTitle className="mb-4 font-['Poppins'] text-3xl font-bold text-gray-900 dark:text-white sm:mb-6 sm:text-4xl md:text-5xl" delay={0.2}>
            Réserver une
            <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-emerald-400">
              Garde d'Enfants
            </span>
          </AnimatedTitle>

          <p className="mx-auto max-w-3xl px-4 font-['Inter'] text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            Remplissez ce formulaire détaillé pour que je puisse vous proposer
            le service le plus adapté à vos besoins et à vos enfants.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="order-2 lg:order-1 lg:col-span-2">
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-zinc-800 dark:to-zinc-700 rounded-t-xl">
                <CardTitle className="flex items-center font-['Poppins'] text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400 sm:mr-3 sm:h-6 sm:w-6" />
                  Formulaire de Réservation
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 lg:p-8">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 sm:space-y-8"
                >
                  {/* Parent Information */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="flex items-center font-['Poppins'] text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                      <User className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5" />
                      Informations des Parents
                    </h3>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                      <div>
                        <Label
                          htmlFor="parentName"
                          className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm"
                        >
                          Nom et Prénom *
                        </Label>
                        <Input
                          id="parentName"
                          type="text"
                          value={formData.parentName}
                          onChange={e =>
                            handleInputChange('parentName', e.target.value)
                          }
                          placeholder="Marie Dupont"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="parentPhone"
                          className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm"
                        >
                          Téléphone *
                        </Label>
                        <Input
                          id="parentPhone"
                          type="tel"
                          value={formData.parentPhone}
                          onChange={e =>
                            handleInputChange('parentPhone', e.target.value)
                          }
                          placeholder="06 12 34 56 78"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>



                    <div>
                      <Label
                        htmlFor="address"
                        className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm"
                      >
                        Adresse de garde *
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={e =>
                          handleInputChange('address', e.target.value)
                        }
                        placeholder="123 Rue de la Paix, Toulouse"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="flex items-center font-['Poppins'] text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                      <Calendar className="mr-2 h-4 w-4 text-green-600 dark:text-green-400 sm:h-5 sm:w-5" />
                      Détails du Service
                    </h3>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                      <div>
                        <Label
                          htmlFor="serviceType"
                          className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm"
                        >
                          Type de service *
                        </Label>
                        <Select
                          value={formData.serviceType}
                          onValueChange={value =>
                            handleInputChange('serviceType', value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Sélectionnez un service" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceTypes.map(service => (
                              <SelectItem key={service.value} value={service.value}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{service.label}</span>
                                  <Badge variant="secondary" className="ml-2">
                                    {service.price}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label
                          htmlFor="date"
                          className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm"
                        >
                          Date *
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={e =>
                            handleInputChange('date', e.target.value)
                          }
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                      <div>
                        <Label
                          htmlFor="startTime"
                          className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm"
                        >
                          Heure de début *
                        </Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={formData.startTime}
                          onChange={e =>
                            handleInputChange('startTime', e.target.value)
                          }
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="endTime"
                          className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm"
                        >
                          Heure de fin *
                        </Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={formData.endTime}
                          onChange={e =>
                            handleInputChange('endTime', e.target.value)
                          }
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Children Information */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="flex items-center font-['Poppins'] text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                      <Baby className="mr-2 h-4 w-4 text-pink-600 dark:text-pink-400 sm:h-5 sm:w-5" />
                      Informations sur les Enfants
                    </h3>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                      <div>
                        <Label
                          htmlFor="numberOfChildren"
                          className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm"
                        >
                          Nombre d'enfants *
                        </Label>
                        <Select
                          value={formData.numberOfChildren}
                          onValueChange={value =>
                            handleInputChange('numberOfChildren', value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Sélectionnez" />
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

                    <div>
                      <Label
                        htmlFor="childrenDetails"
                        className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm"
                      >
                        Détails des enfants (âges, prénoms) *
                      </Label>
                      <Textarea
                        id="childrenDetails"
                        value={formData.childrenDetails}
                        onChange={e =>
                          handleInputChange('childrenDetails', e.target.value)
                        }
                        placeholder="Ex: Emma, 4 ans - Lucas, 2 ans"
                        required
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="specialInstructions"
                        className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm"
                      >
                        Instructions spéciales
                      </Label>
                      <Textarea
                        id="specialInstructions"
                        value={formData.specialInstructions}
                        onChange={e =>
                          handleInputChange('specialInstructions', e.target.value)
                        }
                        placeholder="Allergies, habitudes, préférences..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="flex items-center font-['Poppins'] text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                      <Phone className="mr-2 h-4 w-4 text-red-600 dark:text-red-400 sm:h-5 sm:w-5" />
                      Contact d'Urgence
                    </h3>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                      <div>
                        <Label
                          htmlFor="emergencyContact"
                          className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm"
                        >
                          Nom et prénom
                        </Label>
                        <Input
                          id="emergencyContact"
                          type="text"
                          value={formData.emergencyContact}
                          onChange={e =>
                            handleInputChange('emergencyContact', e.target.value)
                          }
                          placeholder="Jean Dupont"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="emergencyPhone"
                          className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm"
                        >
                          Téléphone d'urgence
                        </Label>
                        <Input
                          id="emergencyPhone"
                          type="tel"
                          value={formData.emergencyPhone}
                          onChange={e =>
                            handleInputChange('emergencyPhone', e.target.value)
                          }
                          placeholder="06 12 34 56 78"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="border-t pt-4 sm:pt-6">
                    <HarmoniousButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full"
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
                    </HarmoniousButton>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="order-1 space-y-4 sm:space-y-6 lg:order-2">
            {/* Contact Info */}
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="bg-gradient-to-br from-blue-500 to-green-500 text-white rounded-t-xl">
                <CardTitle className="font-['Poppins'] text-base sm:text-lg">
                  Contact Direct
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handlePhoneClick}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                  >
                    <span className="text-white text-xs font-bold">📞</span>
                  </button>
                  <div>
                    <div className="text-sm font-medium sm:text-base text-left">
                      07 57 57 93 30
                    </div>
                    <div className="text-xs text-gray-600 sm:text-sm">
                      Horaires d'appel :
                    </div>
                    <div className="text-xs text-gray-500 sm:text-sm">
                      Lun-Ven : 19h-21h
                    </div>
                    <div className="text-xs text-gray-500 sm:text-sm">
                      Week-end : 9h-21h
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Info */}
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="rounded-t-xl">
                <CardTitle className="font-['Poppins'] text-base dark:text-white sm:text-lg">
                  Tarifs & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                <div className="space-y-2 sm:space-y-3">
                  {serviceTypes.map(service => (
                    <div
                      key={service.value}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs font-medium sm:text-sm">
                        {service.label}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {service.price}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 text-xs text-gray-600 dark:text-gray-400">
                  <p>• Durée minimum : 3h</p>
                  <p>• Frais déplacement : +5€ au-delà de 10km</p>
                  <p>• Majoration nocturne : +5€/h après 22h</p>
                </div>
              </CardContent>
            </Card>

            {/* Process Steps */}
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="rounded-t-xl">
                <CardTitle className="font-['Poppins'] text-base dark:text-white sm:text-lg">
                  Processus de Réservation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                      1
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 sm:text-sm">
                      Envoyez votre demande via ce formulaire
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600 dark:bg-green-900 dark:text-green-400">
                      2
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 sm:text-sm">
                      Je vous contacte sous 24h pour confirmer
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                      3
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 sm:text-sm">
                      Réservation confirmée et planifiée
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Phone Hours Dialog */}
      <PhoneHoursDialog
        isOpen={isPhoneDialogOpen}
        onClose={() => setIsPhoneDialogOpen(false)}
        phoneNumber="07 57 57 93 30"
      />
    </div>
  );
};

export default Booking;
