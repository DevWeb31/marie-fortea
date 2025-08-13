import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Clock, 
  Users, 
  Calendar,
  Star,
  MapPin,
  Baby,
  Cake,
  Moon,
  Coffee,
  CheckCircle
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Heart className="w-10 h-10 text-pink-500" />,
      title: "Mariages & Événements",
      subtitle: "Pour vos moments spéciaux",
      description: "Je prends soin de vos enfants pendant vos mariages, baptêmes, anniversaires et autres célébrations importantes.",
      features: [
        "Garde sur le lieu de l'événement",
        "Activités adaptées à l'âge",
        "Repas et collations inclus",
        "Photos souvenirs"
      ],
      pricing: "À partir de 25€/heure",
      color: "bg-pink-50 border-pink-200",
      iconBg: "bg-pink-100"
    },
    {
      icon: <Clock className="w-10 h-10 text-orange-500" />,
      title: "Garde d'Urgence",
      subtitle: "Disponible rapidement",
      description: "En cas d'imprévu professionnel ou personnel, je peux intervenir rapidement pour garder vos enfants.",
      features: [
        "Disponibilité sous 2h",
        "Service 7j/7",
        "À votre domicile",
        "Références vérifiables"
      ],
      pricing: "À partir de 30€/heure",
      color: "bg-orange-50 border-orange-200",
      iconBg: "bg-orange-100"
    },
    {
      icon: <Moon className="w-10 h-10 text-blue-500" />,
      title: "Soirées Parents",
      subtitle: "Profitez de vos sorties",
      description: "Sortez en amoureux ou entre amis l'esprit tranquille. Vos enfants sont entre de bonnes mains.",
      features: [
        "Routine du coucher respectée",
        "Jeux calmes et histoires",
        "Surveillance nocturne",
        "Compte-rendu de soirée"
      ],
      pricing: "À partir de 20€/heure",
      color: "bg-blue-50 border-blue-200",
      iconBg: "bg-blue-100"
    },
    {
      icon: <Coffee className="w-10 h-10 text-green-500" />,
      title: "Week-ends & Vacances",
      subtitle: "Temps libre garanti",
      description: "Quelques heures ou une journée complète, je m'occupe de vos enfants pour vous offrir du temps libre.",
      features: [
        "Demi-journée ou journée complète",
        "Sorties au parc possibles",
        "Activités créatives",
        "Goûter et repas inclus"
      ],
      pricing: "À partir de 18€/heure",
      color: "bg-green-50 border-green-200",
      iconBg: "bg-green-100"
    }
  ];

  const additionalServices = [
    {
      icon: <Baby className="w-6 h-6 text-blue-600" />,
      title: "Garde de nuit",
      description: "Pour vos déplacements professionnels"
    },
    {
      icon: <Cake className="w-6 h-6 text-pink-600" />,
      title: "Animation d'anniversaire",
      description: "Jeux et activités pour les fêtes d'enfants"
    },
    {
      icon: <MapPin className="w-6 h-6 text-green-600" />,
      title: "Accompagnement sorties",
      description: "Parc, cinéma, activités extérieures"
    }
  ];

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            Services Professionnels
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-['Poppins']">
            Mes Services de
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 block">
              Garde d'Enfants
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-['Inter'] px-4">
            Des solutions flexibles et professionnelles pour tous vos besoins de garde, 
            avec l'expertise d'une éducatrice expérimentée.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 md:mb-20">
          {services.map((service, index) => (
            <Card key={index} className={`${service.color} hover:shadow-xl transition-all duration-300 group`}>
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${service.iconBg} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <div className="scale-75 sm:scale-100">
                      {service.icon}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-['Poppins']">
                      {service.title}
                    </CardTitle>
                    <p className="text-sm sm:text-base text-gray-600 font-medium font-['Inter']">
                      {service.subtitle}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 sm:space-y-6">
                <p className="text-sm sm:text-base text-gray-700 font-['Inter'] leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2 sm:space-y-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700 font-['Inter']">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 font-['Poppins']">
                      {service.pricing}
                    </div>
                    <Button 
                      asChild 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base w-full sm:w-auto"
                    >
                      <Link to="/booking">Réserver</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center font-['Poppins']">
            Services Complémentaires
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  {service.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-['Poppins']">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm font-['Inter']">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Note */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 font-['Poppins']">
            Tarification Transparente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left max-w-4xl mx-auto">
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Inclus dans tous mes services :</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Activités adaptées à l'âge</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Matériel pédagogique fourni</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Compte-rendu détaillé</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Conditions :</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                <li>• Durée minimum : 3 heures</li>
                <li>• Frais de déplacement : 5€ au-delà de 10km</li>
                <li>• Majoration nocturne : +5€/heure après 22h</li>
                <li>• Devis gratuit sur demande</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 font-['Poppins']">
            Besoin d'un service personnalisé ?
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 font-['Inter'] px-4">
            Chaque famille est unique. Contactez-moi pour un devis adapté à vos besoins spécifiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
            >
              <Link to="/booking">
                <Calendar className="w-5 h-5 mr-2" />
                Faire une demande
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 text-base sm:text-lg"
            >
              <Link to="/about">En savoir plus sur moi</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;