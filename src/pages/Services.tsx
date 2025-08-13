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
  CheckCircle,
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Heart className="h-10 w-10 text-pink-500" />,
      title: 'Mariages & Événements',
      subtitle: 'Pour vos moments spéciaux',
      description:
        'Je prends soin de vos enfants pendant vos mariages, baptêmes, anniversaires et autres célébrations importantes.',
      features: [
        "Garde sur le lieu de l'événement",
        "Activités adaptées à l'âge",
        'Repas et collations inclus',
        'Photos souvenirs',
      ],
      pricing: 'À partir de 25€/heure',
      color: 'bg-pink-50 border-pink-200',
      iconBg: 'bg-pink-100',
    },
    {
      icon: <Clock className="h-10 w-10 text-orange-500" />,
      title: "Garde d'Urgence",
      subtitle: 'Disponible rapidement',
      description:
        "En cas d'imprévu professionnel ou personnel, je peux intervenir rapidement pour garder vos enfants.",
      features: [
        'Disponibilité sous 2h',
        'Service 7j/7',
        'À votre domicile',
        'Références vérifiables',
      ],
      pricing: 'À partir de 30€/heure',
      color: 'bg-orange-50 border-orange-200',
      iconBg: 'bg-orange-100',
    },
    {
      icon: <Moon className="h-10 w-10 text-blue-500" />,
      title: 'Soirées Parents',
      subtitle: 'Profitez de vos sorties',
      description:
        "Sortez en amoureux ou entre amis l'esprit tranquille. Vos enfants sont entre de bonnes mains.",
      features: [
        'Routine du coucher respectée',
        'Jeux calmes et histoires',
        'Surveillance nocturne',
        'Compte-rendu de soirée',
      ],
      pricing: 'À partir de 20€/heure',
      color: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100',
    },
    {
      icon: <Coffee className="h-10 w-10 text-green-500" />,
      title: 'Week-ends & Vacances',
      subtitle: 'Temps libre garanti',
      description:
        "Quelques heures ou une journée complète, je m'occupe de vos enfants pour vous offrir du temps libre.",
      features: [
        'Demi-journée ou journée complète',
        'Sorties au parc possibles',
        'Activités créatives',
        'Goûter et repas inclus',
      ],
      pricing: 'À partir de 18€/heure',
      color: 'bg-green-50 border-green-200',
      iconBg: 'bg-green-100',
    },
  ];

  const additionalServices = [
    {
      icon: <Baby className="h-6 w-6 text-blue-600" />,
      title: 'Garde de nuit',
      description: 'Pour vos déplacements professionnels',
    },
    {
      icon: <Cake className="h-6 w-6 text-pink-600" />,
      title: "Animation d'anniversaire",
      description: "Jeux et activités pour les fêtes d'enfants",
    },
    {
      icon: <MapPin className="h-6 w-6 text-green-600" />,
      title: 'Accompagnement sorties',
      description: 'Parc, cinéma, activités extérieures',
    },
  ];

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-16">
          <Badge className="mb-6 bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200">
            <Star className="mr-2 h-4 w-4" />
            Services Professionnels
          </Badge>

          <h1 className="mb-4 font-['Poppins'] text-3xl font-bold text-gray-900 dark:text-white sm:mb-6 sm:text-4xl md:text-5xl">
            Mes Services de
            <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-emerald-400">
              Garde d'Enfants
            </span>
          </h1>

          <p className="mx-auto max-w-3xl px-4 font-['Inter'] text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            Des solutions flexibles et professionnelles pour tous vos besoins de
            garde, avec l'expertise d'une éducatrice expérimentée.
          </p>
        </div>

        {/* Main Services */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:mb-16 sm:gap-8 md:mb-20 lg:grid-cols-2">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`${service.color} dark:bg-zinc-900 dark:border-zinc-800 group transition-all duration-300 hover:shadow-xl`}
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className="mb-4 flex items-center space-x-4">
                  <div
                    className={`h-12 w-12 sm:h-16 sm:w-16 ${service.iconBg} dark:bg-zinc-800 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 sm:rounded-2xl`}
                  >
                    <div className="scale-75 sm:scale-100">{service.icon}</div>
                  </div>
                  <div>
                    <CardTitle className="font-['Poppins'] text-lg font-bold text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
                      {service.title}
                    </CardTitle>
                    <p className="font-['Inter'] text-sm font-medium text-gray-600 dark:text-gray-300 sm:text-base">
                      {service.subtitle}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6">
                <p className="font-['Inter'] text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base">
                  {service.description}
                </p>

                <div className="space-y-2 sm:space-y-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600 sm:h-5 sm:w-5" />
                      <span className="font-['Inter'] text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
                    <div className="font-['Poppins'] text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                      {service.pricing}
                    </div>
                    <Button
                      asChild
                      className="w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm text-white hover:from-blue-600 hover:to-blue-700 sm:w-auto sm:px-6 sm:text-base"
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
        <div className="mb-12 rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900 sm:mb-16 sm:rounded-3xl sm:p-8">
          <h2 className="mb-6 text-center font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:mb-8 sm:text-3xl">
            Services Complémentaires
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-100 p-4 text-center transition-all duration-300 hover:shadow-md sm:rounded-2xl sm:p-6"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 sm:mb-4 sm:h-12 sm:w-12">
                  {service.icon}
                </div>
                <h3 className="mb-2 font-['Poppins'] text-base font-semibold text-gray-900 sm:text-lg">
                  {service.title}
                </h3>
                <p className="font-['Inter'] text-xs text-gray-600 sm:text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Note */}
        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-green-50 p-6 text-center sm:rounded-2xl sm:p-8">
          <h3 className="mb-4 font-['Poppins'] text-xl font-bold text-gray-900 sm:text-2xl">
            Tarification Transparente
          </h3>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 text-left sm:gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">
                Inclus dans tous mes services :
              </h4>
              <ul className="space-y-1 text-sm text-gray-700 sm:space-y-2 sm:text-base">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Activités adaptées à l'âge</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Matériel pédagogique fourni</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Compte-rendu détaillé</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">
                Conditions :
              </h4>
              <ul className="space-y-1 text-sm text-gray-700 sm:space-y-2 sm:text-base">
                <li>• Durée minimum : 3 heures</li>
                <li>• Frais de déplacement : 5€ au-delà de 10km</li>
                <li>• Majoration nocturne : +5€/heure après 22h</li>
                <li>• Devis gratuit sur demande</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center sm:mt-16">
          <h3 className="mb-4 font-['Poppins'] text-xl font-bold text-gray-900 sm:text-2xl">
            Besoin d'un service personnalisé ?
          </h3>
          <p className="mb-6 px-4 font-['Inter'] text-sm text-gray-600 sm:mb-8 sm:text-base">
            Chaque famille est unique. Contactez-moi pour un devis adapté à vos
            besoins spécifiques.
          </p>
          <div className="flex flex-col justify-center gap-3 px-4 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-base text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg"
            >
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Faire une demande
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-2 border-blue-200 px-6 py-3 text-base text-blue-600 transition-all duration-300 hover:bg-blue-50 sm:px-8 sm:py-4 sm:text-lg"
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
