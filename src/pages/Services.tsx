import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HarmoniousButton from '@/components/ui/harmonious-button';
import { Badge } from '@/components/ui/badge';
import { AnimatedSection, AnimatedTitle, AnimatedCard } from '@/components/ScrollAnimation';
import { Link } from 'react-router-dom';
import { PricingService } from '@/lib/pricing-service';
import {
  Heart,
  Star,
  Users,
  Clock,
  Baby,
  Calendar,
  MapPin,
  CheckCircle,
  Sun,
  Moon,
  AlertTriangle,
} from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les prix dynamiques
  useEffect(() => {
    const loadPricing = async () => {
      try {
        const { data: pricingData, error } = await PricingService.getPublicPricing();
        
        if (error) {
          console.error('Erreur lors du chargement des prix:', error);
          // Fallback vers les prix par défaut
          setServices(getDefaultServices());
        } else if (pricingData) {
          setServices(getDynamicServices(pricingData));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des prix:', error);
        setServices(getDefaultServices());
      } finally {
        setLoading(false);
      }
    };

    loadPricing();
  }, []);

  // Fonction pour obtenir les services par défaut avec les nouveaux tarifs
  const getDefaultServices = () => [
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: 'Garde d\'enfants',
      subtitle: 'Journée entière ou demi-journée',
      description:
        'Je m\'occupe de vos enfants avec des activités adaptées et une approche bienveillante.',
      features: [
        'Garde de 1 à 3 enfants (majoration de 5€ pour le 3ème enfant)',
        'Activitités adaptées à l\'âge',
        'Matériel pédagogique fourni',
        'Carnet de suivi d\'accompagnement',
      ],
      pricing: {
        day: '20€/heure',
        night: null,
        note: 'Tarif de jour uniquement'
      },
      color: 'bg-pink-50 border-pink-200',
      iconBg: 'bg-pink-100',
      minimum: 'Minimum = 3 heures',
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: 'Soutien événementiel',
      subtitle: 'Tarif de nuit à partir de 22h',
      description:
        'Profitez de vos événements en toute tranquillité pendant que je m\'occupe de vos enfants avec bienveillance.',
      features: [
        'Garde pendant événements',
        'Activités adaptées',
        'Garde de 1 à 6 enfants (majoration 5€ par enfant à partir du 3ème enfant)',
        'Flexibilité horaires',
      ],
      pricing: {
        day: '25€/heure',
        night: '30€/heure',
        note: null
      },
      color: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100',
      minimum: 'Minimum = 4 heures',
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      title: 'Garde en soirée',
      subtitle: 'À partir de 18h, tarif nuit à partir de 22h',
      description:
        'Pour vos soirées, je propose une garde flexible et adaptée à vos besoins.',
      features: [
        'Garde de 1 à 3 enfants (majoration de 5€ pour le 3ème enfant)',
        'Activités adaptées à l\'âge',
        'Flexibilité horaires',
      ],
      pricing: {
        day: '20€/heure',
        night: '25€/heure',
        note: null
      },
      color: 'bg-green-50 border-green-200',
      iconBg: 'bg-green-100',
      minimum: 'Minimum = 3 heures',
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      title: 'Garde d\'urgence',
      subtitle: 'Disponibilité rapide',
      description:
        'En cas d\'imprévu, je suis disponible rapidement pour vous dépanner et assurer la garde de vos enfants.',
      features: [
        'Réponse sous 2h (aux horaires indiqués)',
        'Disponible le week-end et jours fériés',
        'Garde de 1 à 3 enfants (majoration de 5€ pour le 3ème enfant)',
      ],
      pricing: {
        day: '40€/heure',
        night: null,
        note: null
      },
      color: 'bg-orange-50 border-orange-200',
      iconBg: 'bg-orange-100',
      minimum: 'Minimum = 2 heures',
    },
  ];

  // Fonction pour obtenir les services dynamiques
  const getDynamicServices = (pricingData: any) => {
    const serviceMapping: { [key: string]: any } = {
      babysitting: {
        icon: <Heart className="h-8 w-8 text-pink-500" />,
        title: 'Garde d\'enfants',
        subtitle: 'Journée entière ou demi-journée',
        description: 'Je m\'occupe de vos enfants avec des activités adaptées et une approche bienveillante.',
        features: ['Garde de 1 à 3 enfants (majoration de 5€ pour le 3ème enfant)', 'Activitités adaptées à l\'âge', 'Matériel pédagogique fourni', 'Carnet de suivi d\'accompagnement'],
        color: 'bg-pink-50 border-pink-200',
        iconBg: 'bg-pink-100',
        minimum: 'Minimum = 3 heures',
        pricing: {
          day: '20€/heure',
          night: null,
          note: 'Tarif de jour uniquement'
        }
      },
      emergency_care: {
        icon: <Clock className="h-8 w-8 text-orange-500" />,
        title: 'Garde d\'urgence',
        subtitle: 'Disponibilité rapide',
        description: 'En cas d\'imprévu, je suis disponible rapidement pour vous dépanner et assurer la garde de vos enfants.',
        features: ['Réponse sous 2h (aux horaires indiqués)', 'Disponible le week-end et jours fériés', 'Garde de 1 à 3 enfants (majoration de 5€ pour le 3ème enfant)'],
        color: 'bg-orange-50 border-orange-200',
        iconBg: 'bg-orange-100',
        minimum: 'Minimum = 2 heures',
        pricing: {
          day: '40€/heure',
          night: null,
          note: null
        }
      },
      event_support: {
        icon: <Users className="h-8 w-8 text-blue-500" />,
        title: 'Soutien événementiel',
        subtitle: 'Tarif de nuit à partir de 22h',
        description: 'Profitez de vos événements en toute tranquillité pendant que je m\'occupe de vos enfants avec bienveillance.',
        features: ['Garde pendant événements', 'Activités adaptées', 'Garde de 1 à 6 enfants (majoration de 5€ par enfant à partir du 3ème enfant)', 'Flexibilité horaires'],
        color: 'bg-blue-50 border-blue-200',
        iconBg: 'bg-blue-100',
        minimum: 'Minimum = 4 heures',
        pricing: {
          day: '25€/heure',
          night: '30€/heure',
          note: null
        }
      },
      weekend_care: {
        icon: <Calendar className="h-8 w-8 text-green-500" />,
        title: 'Garde en soirée',
        subtitle: 'À partir de 18h, tarif nuit à partir de 22h',
        description: 'Pour vos soirées, je propose une garde flexible et adaptée à vos besoins.',
        features: ['Garde de 1 à 3 enfants (majoration de 5€ pour le 3ème enfant)', 'Activités adaptées à l\'âge', 'Flexibilité horaires'],
        color: 'bg-green-50 border-green-200',
        iconBg: 'bg-green-100',
        minimum: 'Minimum = 3 heures',
        pricing: {
          day: '20€/heure',
          night: '25€/heure',
          note: null
        }
      },
    };

    return (pricingData.services || []).map((service: any) => {
      const serviceInfo = serviceMapping[service.type];
      if (!serviceInfo) {
        console.warn(`Service type "${service.type}" not found in mapping`);
        return null;
      }
      return {
        ...serviceInfo,
        pricing: serviceInfo.pricing
      };
    }).filter(Boolean); // Filtrer les services null
  };

  const additionalServices = [
    {
      icon: <Baby className="h-6 w-6 text-purple-600" />,
      title: 'Garde bébé',
      description: 'Spécialisée 0-3 ans',
    },
    {
      icon: <Heart className="h-6 w-6 text-pink-600" />,
      title: 'Accompagnement personnalisé',
      description: 'Sur mesure selon vos besoins',
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-600" />,
      title: 'Services sur mesure',
      description: 'Solutions adaptées à votre famille',
    },
  ];

  // Composant pour afficher les tarifs
  const PricingDisplay = ({ pricing }: { pricing: any }) => (
    <div className="space-y-3">
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Tarif de jour</span>
        </div>
        <span className="font-['Poppins'] text-lg font-bold text-gray-900 dark:text-white ml-2">
          {pricing.day}
        </span>
      </div>
      
      {pricing.night && (
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <Moon className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Tarif de nuit</span>
          </div>
          <span className="font-['Poppins'] text-lg font-bold text-gray-900 dark:text-white ml-2">
            {pricing.night}
          </span>
        </div>
      )}
      
      {pricing.note && (
        <div className="mt-3 flex items-start space-x-2 rounded-lg bg-orange-50 p-3 dark:bg-orange-900/20">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 text-orange-500 mt-0.5" />
          <span className="text-xs text-orange-700 dark:text-orange-300">
            {pricing.note}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-12 sm:py-16 md:py-20">
          <div className="text-center">
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
          </div>
        </div>

        {/* Main Services */}
        <div className="py-12 sm:py-16 md:py-20">
          {/* Séparateur animé - Bulles colorées */}
          <div className="relative mb-16">
            <div className="absolute inset-0 flex justify-center">
              <div className="flex space-x-3">
                <div className="h-3 w-3 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
                <div className="h-2 w-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2s' }}></div>
                <div className="h-4 w-4 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '2s' }}></div>
                <div className="h-2 w-2 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '2s' }}></div>
                <div className="h-3 w-3 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '2s' }}></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            {loading ? (
              // Affichage de chargement
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <Card className="h-full border-0 shadow-lg rounded-2xl overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/90 bg-opacity-90">
                    <CardHeader className="rounded-t-2xl">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              services.map((service, index) => (
              <AnimatedCard
                key={index}
                index={index}
                className={`${service.color} group transition-all duration-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900/90 rounded-2xl bg-opacity-90 hover:animate-shake`}
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
                        {service.title === 'Garde d\'urgence' && (
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                            (Pour les demandes 48h avant la garde)
                          </span>
                        )}
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
                    {service.features.map((feature: string, idx: number) => (
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
                      <div className="flex flex-col w-full sm:w-auto">
                        <PricingDisplay pricing={service.pricing} />
                        {service.minimum && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {service.minimum}
                          </div>
                        )}
                      </div>
                      <HarmoniousButton
                        asChild
                        variant="primary"
                        size="sm"
                        className="w-full sm:w-auto mt-3 sm:mt-0"
                      >
                        <Link to="/booking">Réserver</Link>
                      </HarmoniousButton>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>
              ))
            )}
          </div>
        </div>

        {/* Additional Services */}
        <div className="py-12 sm:py-16 md:py-20">
          {/* Séparateur animé - Bulles colorées */}
          <div className="relative mb-16">
            <div className="absolute inset-0 flex justify-center">
              <div className="flex space-x-3">
                <div className="h-3 w-3 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
                <div className="h-2 w-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2s' }}></div>
                <div className="h-4 w-4 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '2s' }}></div>
                <div className="h-2 w-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '2s' }}></div>
                <div className="h-3 w-3 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '2s' }}></div>
              </div>
            </div>
          </div>
          
          <AnimatedTitle className="mb-6 text-center font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:mb-8 sm:text-3xl" delay={0.4}>
            Services Complémentaires
          </AnimatedTitle>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className={`rounded-2xl border border-gray-100 p-4 text-center transition-all duration-300 hover:shadow-md hover:animate-shake dark:border-zinc-800 sm:rounded-3xl sm:p-6 bg-white/90 dark:bg-zinc-900/90`}
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-zinc-800 sm:mb-4 sm:h-12 sm:w-12">
                  {service.icon}
                </div>
                <h3 className={`mb-2 font-['Poppins'] font-semibold text-gray-900 dark:text-white text-lg sm:text-xl`}>
                  {service.title}
                </h3>
                <p className={`font-['Inter'] text-gray-600 dark:text-gray-300 text-sm sm:text-base`}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Note */}
        <div className="py-12 sm:py-16 md:py-20">
          {/* Séparateur animé - Bulles colorées */}
          <div className="relative mb-16">
            <div className="absolute inset-0 flex justify-center">
              <div className="flex space-x-3">
                <div className="h-3 w-3 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
                <div className="h-2 w-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2s' }}></div>
                <div className="h-4 w-4 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '2s' }}></div>
                <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '2s' }}></div>
                <div className="h-3 w-3 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '2s' }}></div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-r from-blue-50/90 to-green-50/90 p-6 text-center dark:from-zinc-900/90 dark:to-zinc-800/90 sm:rounded-2xl sm:p-8">
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
                    <span>Carnet de suivi d'accompagnement</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                  Conditions :
                </h4>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 sm:space-y-2 sm:text-base">
                  <li>• Le temps de garde réservé ne pourra pas être modifié</li>
                  <li>• Majoration de 5€ par enfant à partir du 3ème enfant</li>
                  <li>• Les tarifs de nuit s'appliquent à partir de 22h</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-12 sm:py-16 md:py-20">
          {/* Séparateur animé - Bulles colorées */}
          <div className="relative mb-16">
            <div className="absolute inset-0 flex justify-center">
              <div className="flex space-x-3">
                <div className="h-3 w-3 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2s' }}></div>
                <div className="h-4 w-4 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '2s' }}></div>
                <div className="h-2 w-2 rounded-full bg-lime-400 animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '2s' }}></div>
                <div className="h-3 w-3 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '2s' }}></div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <AnimatedTitle className="mb-4 font-['Poppins'] text-xl font-bold text-gray-900 dark:text-white sm:text-2xl" delay={0.6}>
              Besoin d'un service personnalisé ?
            </AnimatedTitle>
            <p className="mb-6 px-4 font-['Inter'] text-sm text-gray-600 dark:text-gray-300 sm:mb-8 sm:text-base">
              Chaque famille est unique. Contactez-moi pour un devis adapté à vos
              besoins spécifiques.
            </p>
            <div className="flex flex-col justify-center gap-3 px-4 sm:flex-row sm:gap-4">
              <HarmoniousButton
                asChild
                variant="primary"
                size="lg"
              >
                <Link to="/booking">
                  <Calendar className="mr-2 h-5 w-5" />
                  Faire une demande
                </Link>
              </HarmoniousButton>
              <HarmoniousButton
                asChild
                variant="secondary"
                size="lg"
              >
                <Link to="/about">En savoir plus sur moi</Link>
              </HarmoniousButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;

