import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedSection, AnimatedTitle, AnimatedCard } from '@/components/ScrollAnimation';
import { Link } from 'react-router-dom';
import {
  Heart,
  Star,
  Users,
  Clock,
  Baby,
  Calendar,
  MapPin,
  CheckCircle,
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: 'Mariages & Événements',
      subtitle: 'Garde professionnelle',
      description:
        'Je moccupe de vos enfants pendant vos moments spéciaux avec des activités adaptées et une approche bienveillante.',
      features: [
        'Garde de 3 à 12 enfants',
        'Activitités adaptées à lâge',
        'Matériel pédagogique fourni',
        'Compte-rendu détaillé',
      ],
      pricing: '25€/heure',
      color: 'bg-pink-50 border-pink-200',
      iconBg: 'bg-pink-100',
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      title: "Garde d'Urgence",
      subtitle: 'Disponibilité rapide',
      description:
        'En cas dimprévu, je suis disponible rapidement pour vous dépanner et assurer la garde de vos enfants.',
      features: [
        'Réponse sous 2h',
        'Disponibilité 7j/7',
        'Garde de 1 à 4 enfants',
        'Tarification adaptée',
      ],
      pricing: '30€/heure',
      color: 'bg-orange-50 border-orange-200',
      iconBg: 'bg-orange-100',
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: 'Soirées Parents',
      subtitle: 'Moment de détente',
      description:
        'Profitez de vos soirées en toute tranquillité pendant que je moccupe de vos enfants avec bienveillance.',
      features: [
        'Garde de 18h à 23h',
        'Activitités calmes',
        'Préparation coucher',
        'Flexibilité horaires',
      ],
      pricing: '20€/heure',
      color: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100',
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      title: 'Week-ends & Vacances',
      subtitle: 'Garde occasionnelle',
      description:
        'Pour vos week-ends ou vacances, je propose une garde flexible et adaptée à vos besoins.',
      features: [
        'Garde de 1 à 6 enfants',
        'Activitités variées',
        'Sorties possibles',
        'Tarifs dégressifs',
      ],
      pricing: '18€/heure',
      color: 'bg-green-50 border-green-200',
      iconBg: 'bg-green-100',
    },
  ];

  const additionalServices = [
    {
      icon: <Baby className="h-6 w-6 text-purple-600" />,
      title: 'Garde bébé',
      description: 'Spécialisée 0-3 ans',
    },
    {
      icon: <MapPin className="h-6 w-6 text-green-600" />,
      title: 'Accompagnement sorties',
      description: 'Parc, cinéma, activités extérieures',
    },
  ];

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="mb-12 text-center sm:mb-16">
          <Badge className="mb-6 bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200">
            <Star className="mr-2 h-4 w-4" />
            Services Professionnels
          </Badge>

          <AnimatedTitle className="mb-4 font-['Poppins'] text-3xl font-bold text-gray-900 dark:text-white sm:mb-6 sm:text-4xl md:text-5xl" delay={0.2}>
            Mes Services de
            <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-emerald-400">
              Garde d'Enfants
            </span>
          </AnimatedTitle>

          <p className="mx-auto max-w-3xl px-4 font-['Inter'] text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            Des solutions flexibles et professionnelles pour tous vos besoins de
            garde, avec l'expertise d'une éducatrice expérimentée.
          </p>
        </AnimatedSection>

        {/* Main Services */}
        <AnimatedSection className="mb-12 sm:mb-16 md:mb-20" delay={0.1}>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            {services.map((service, index) => (
              <AnimatedCard
                key={index}
                index={index}
                className={`${service.color} group transition-all duration-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900`}
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="mb-4 flex items-center space-x-4">
                    <div
                      className={`h-12 w-12 sm:h-16 sm:w-16 ${service.iconBg} flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 dark:bg-zinc-800 sm:rounded-2xl`}
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
              </AnimatedCard>
            ))}
          </div>
        </AnimatedSection>

        {/* Additional Services */}
        <AnimatedSection className="mb-12 sm:mb-16" delay={0.2}>
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-900 sm:rounded-3xl sm:p-8">
            <AnimatedTitle className="mb-6 text-center font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:mb-8 sm:text-3xl" delay={0.4}>
              Services Complémentaires
            </AnimatedTitle>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
              {additionalServices.map((service, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-100 p-4 text-center transition-all duration-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 sm:rounded-2xl sm:p-6"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-zinc-800 sm:mb-4 sm:h-12 sm:w-12">
                    {service.icon}
                  </div>
                  <h3 className="mb-2 font-['Poppins'] text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    {service.title}
                  </h3>
                  <p className="font-['Inter'] text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Pricing Note */}
        <AnimatedSection className="mb-8" delay={0.3}>
          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-green-50 p-6 text-center dark:from-zinc-900 dark:to-zinc-800 sm:rounded-2xl sm:p-8">
            <AnimatedTitle className="mb-4 font-['Poppins'] text-xl font-bold text-gray-900 dark:text-white sm:text-2xl" delay={0.5}>
              Tarification Transparente
            </AnimatedTitle>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 text-left sm:gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                  Inclus dans tous mes services :
                </h4>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 sm:space-y-2 sm:text-base">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Activités adaptées à l'âge</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Matériel pédagogique fourni</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Compte-rendu détaillé</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                  Conditions :
                </h4>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 sm:space-y-2 sm:text-base">
                  <li>• Durée minimum : 3 heures</li>
                  <li>• Frais de déplacement : 5€ au-delà de 10km</li>
                  <li>• Majoration nocturne : +5€/heure après 22h</li>
                  <li>• Devis gratuit sur demande</li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="mt-12 text-center sm:mt-16" delay={0.4}>
          <AnimatedTitle className="mb-4 font-['Poppins'] text-xl font-bold text-gray-900 dark:text-white sm:text-2xl" delay={0.6}>
            Besoin d'un service personnalisé ?
          </AnimatedTitle>
          <p className="mb-6 px-4 font-['Inter'] text-sm text-gray-600 dark:text-gray-300 sm:mb-8 sm:text-base">
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
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Services;
