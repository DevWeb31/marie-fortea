import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import HarmoniousButton from '@/components/ui/harmonious-button';
import { Link } from 'react-router-dom';
import { AnimatedSection, AnimatedTitle, AnimatedCard } from '@/components/ScrollAnimation';
import PhoneHoursDialog from '@/components/PhoneHoursDialog';
import {
  Award,
  Heart,
  Star,
  GraduationCap,
  Users,
  Clock,
  Baby,
  Shield,
  BookOpen,
  CheckCircle,
  MapPin,
  Calendar,
  Phone,
} from 'lucide-react';

const About = () => {
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);

  const handlePhoneClick = () => {
    setIsPhoneDialogOpen(true);
  };

  const qualifications = [
    {
      icon: <GraduationCap className="h-6 w-6 text-blue-600" />,
      title: 'CAP Petite Enfance',
      description:
        'Formation officielle en développement et soins de la petite enfance',
    },
    {
      icon: <Shield className="h-6 w-6 text-green-600" />,
      title: 'Formation Premiers Secours',
      description: 'Certification PSC1 à jour pour la sécurité de vos enfants',
    },
    {
      icon: <BookOpen className="h-6 w-6 text-purple-600" />,
      title: 'Formation Continue',
      description: 'Régulièrement mise à jour sur les méthodes pédagogiques',
    },
    {
      icon: <Users className="h-6 w-6 text-pink-600" />,
      title: '5+ Années en Crèche',
      description: 'Expérience approfondie avec des enfants de 3 mois à 6 ans',
    },
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: 'Bienveillance',
      description:
        'Chaque enfant est unique et mérite une attention particulière adaptée à ses besoins.',
      color: 'bg-pink-50 border-pink-200',
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: 'Sécurité',
      description:
        'La sécurité physique et émotionnelle de vos enfants est ma priorité absolue.',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: 'Excellence',
      description:
        "Je m'engage à offrir un service de qualité supérieure à chaque intervention.",
      color: 'bg-yellow-50 border-yellow-200',
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: 'Confiance',
      description:
        'Établir une relation de confiance durable avec les familles est essentiel.',
      color: 'bg-green-50 border-green-200',
    },
  ];

  const testimonials = [
    {
      name: 'Claire D.',
      rating: 5,
      text: "Marie a une approche très professionnelle tout en étant chaleureuse. Nos enfants l'adorent et nous avons une confiance totale en elle.",
      service: 'Garde week-end',
      location: 'Toulouse',
    },
    {
      name: 'Antoine M.',
      rating: 5,
      text: 'Nous avons fait appel à Marie pour notre mariage. Elle a su occuper les 6 enfants présents avec des activités adaptées. Un vrai bonheur !',
      service: 'Mariage',
      location: 'Colomiers',
    },
    {
      name: 'Sarah L.',
      rating: 5,
      text: 'Marie nous dépanne régulièrement pour nos urgences professionnelles. Sa réactivité et sa disponibilité sont remarquables.',
      service: "Garde d'urgence",
      location: 'Blagnac',
    },
  ];

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="mb-12 text-center sm:mb-16">
          <Badge className="mb-6 bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200">
            <Award className="mr-2 h-4 w-4" />
            Professionnelle Expérimentée
          </Badge>

          <AnimatedTitle className="mb-4 font-['Poppins'] text-3xl font-bold text-gray-900 dark:text-white sm:mb-6 sm:text-4xl md:text-5xl" delay={0.2}>
            À propos de
            <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-emerald-400">
              Marie Fortea
            </span>
          </AnimatedTitle>

          <p className="mx-auto max-w-3xl px-4 font-['Inter'] text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            Passionnée par la petite enfance depuis toujours, je mets mon
            expérience et ma bienveillance au service des familles toulousaines.
          </p>
        </AnimatedSection>

        {/* About Me Section */}
        <AnimatedSection className="mb-12 sm:mb-16 md:mb-20" delay={0.1}>
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/8612990/pexels-photo-8612990.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Marie Fortea portrait professionnel"
                className="aspect-[4/5] w-full rounded-2xl object-cover shadow-2xl sm:rounded-3xl"
              />
                          <div className="absolute -bottom-4 -right-4 rounded-xl bg-white p-3 shadow-lg dark:bg-zinc-800 sm:-bottom-6 sm:-right-6 sm:rounded-2xl sm:p-4">
              <div className="text-center">
                <div className="font-['Poppins'] text-xl font-bold text-blue-600 dark:text-blue-400 sm:text-2xl">
                  16
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
                  Années d'expérience
                </div>
              </div>
            </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="mb-4 font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:mb-6 sm:text-3xl">
                  Mon Parcours
                </h2>

                <div className="space-y-4 font-['Inter'] text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:space-y-6 sm:text-base">
                                  <p>
                  Diplômée d'un CAP Petite Enfance, j'ai débuté ma carrière dans
                  une crèche municipale où j'ai eu l'opportunité de
                  travailler avec des enfants de 3 mois à 6 ans pendant plus de
                  16 années.
                </p>

                  <p>
                    Cette expérience m'a permis de développer une expertise solide
                    dans l'accompagnement du développement de l'enfant, la gestion
                    des besoins spécifiques de chaque âge, et l'importance d'une
                    approche individualisée et bienveillante.
                  </p>

                  <p>
                    Aujourd'hui, je souhaite mettre cette expérience au service
                    des familles en proposant des services de garde occasionnelle
                    de qualité, que ce soit pour vos événements spéciaux, vos
                    urgences ou simplement pour vous offrir des moments de
                    détente.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-green-50 p-4 dark:from-zinc-900 dark:to-zinc-800 sm:rounded-2xl sm:p-6">
                <h3 className="mb-3 font-['Poppins'] text-lg font-semibold text-gray-900 dark:text-white sm:mb-4 sm:text-xl">
                  Ma Philosophie
                </h3>
                <p className="font-['Inter'] text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base">
                  "Chaque enfant est unique et mérite d'être accompagné avec
                  bienveillance, respect et professionnalisme. Mon rôle est de
                  créer un environnement sécurisé et stimulant où il peut
                  s'épanouir pleinement."
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Qualifications */}
        <AnimatedSection className="mb-12 sm:mb-16 md:mb-20" delay={0.2}>
          <AnimatedTitle className="mb-8 text-center font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:mb-12 sm:text-3xl" delay={0.4}>
            Qualifications & Certifications
          </AnimatedTitle>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {qualifications.map((qual, index) => (
              <AnimatedCard
                key={index}
                index={index}
                className="group border-2 border-gray-100 transition-all duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              >
                <CardContent className="p-4 text-center sm:p-6">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 transition-transform duration-300 group-hover:scale-110 dark:bg-zinc-800 sm:mb-4 sm:h-12 sm:w-12">
                    {qual.icon}
                  </div>
                  <h3 className="mb-2 font-['Poppins'] text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    {qual.title}
                  </h3>
                  <p className="font-['Inter'] text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
                    {qual.description}
                  </p>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        </AnimatedSection>

        {/* My Values */}
        <AnimatedSection className="mb-12 sm:mb-16 md:mb-20" delay={0.3}>
          <AnimatedTitle className="mb-8 text-center font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:mb-12 sm:text-3xl" delay={0.5}>
            Mes Valeurs
          </AnimatedTitle>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <AnimatedCard
                key={index}
                index={index}
                className={`${value.color} group transition-all duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900`}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                      <div className="scale-75 sm:scale-100">{value.icon}</div>
                    </div>
                    <div>
                      <h3 className="mb-2 font-['Poppins'] text-lg font-semibold text-gray-900 dark:text-white sm:mb-3 sm:text-xl">
                        {value.title}
                      </h3>
                      <p className="font-['Inter'] text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        </AnimatedSection>

        {/* Statistics */}
        <AnimatedSection className="mb-12 sm:mb-16 md:mb-20" delay={0.4}>
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white sm:rounded-3xl sm:p-8">
            <div className="grid grid-cols-2 gap-4 text-center sm:gap-8 md:grid-cols-4">
                          <div>
              <div className="mb-1 font-['Poppins'] text-2xl font-bold sm:mb-2 sm:text-3xl">
                16
              </div>
              <div className="text-xs text-blue-100 sm:text-sm">
                Années d'expérience
              </div>
            </div>
              <div>
                <div className="mb-1 font-['Poppins'] text-2xl font-bold sm:mb-2 sm:text-3xl">
                  50+
                </div>
                <div className="text-xs text-blue-100 sm:text-sm">
                  Familles satisfaites
                </div>
              </div>
              <div>
                <div className="mb-1 font-['Poppins'] text-2xl font-bold sm:mb-2 sm:text-3xl">
                  200+
                </div>
                <div className="text-xs text-blue-100 sm:text-sm">
                  Heures de garde
                </div>
              </div>
              <div>
                <div className="mb-1 font-['Poppins'] text-2xl font-bold sm:mb-2 sm:text-3xl">
                  100%
                </div>
                <div className="text-xs text-blue-100 sm:text-sm">
                  Familles qui recommandent
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Testimonials */}
        <AnimatedSection className="mb-12 sm:mb-16 md:mb-20" delay={0.5}>
          <AnimatedTitle className="mb-8 text-center font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:mb-12 sm:text-3xl" delay={0.7}>
            Témoignages de Confiance
          </AnimatedTitle>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <AnimatedCard
                key={index}
                index={index}
                className="group border-2 border-gray-100 transition-all duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="mb-4 flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-current text-yellow-400 sm:h-5 sm:w-5"
                      />
                    ))}
                  </div>
                  <p className="mb-4 font-['Inter'] text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-['Poppins'] text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                        {testimonial.name}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                        {testimonial.location}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.service}
                    </Badge>
                  </div>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        </AnimatedSection>

        {/* Service Area */}
        <AnimatedSection className="mb-12 sm:mb-16 md:mb-20" delay={0.6}>
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-green-50 p-6 dark:from-zinc-900 dark:to-zinc-800 sm:rounded-3xl sm:p-8">
            <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="mb-4 font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:mb-6 sm:text-3xl">
                  Zone d'Intervention
                </h2>
                <p className="mb-6 font-['Inter'] text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base">
                  Je me déplace dans un rayon de 20km autour de Montaigut sur Save pour
                  assurer mes services de garde. Ma zone couvre principalement :
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm sm:text-base">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">Montaigut sur Save</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">Toulouse</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <span className="text-gray-700 dark:text-gray-300">L'Isle-Jourdain</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span className="text-gray-700 dark:text-gray-300">Grenade</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/8613098/pexels-photo-8613098.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Marie avec des enfants en activité"
                  className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl sm:rounded-3xl"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="text-center" delay={0.7}>
          <h2 className="mb-4 font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:mb-6 sm:text-3xl">
            Prêt à me faire confiance ?
          </h2>
          <p className="mb-6 px-4 font-['Inter'] text-sm text-gray-600 dark:text-gray-300 sm:mb-8 sm:text-base">
            Contactez-moi pour discuter de vos besoins et planifier une première
            rencontre.
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
            
            <button
              onClick={handlePhoneClick}
              className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-6 py-3 text-lg font-semibold text-gray-700 backdrop-blur-sm transition-all duration-200 hover:bg-gray-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Phone className="h-6 w-6" />
            </button>
          </div>
        </AnimatedSection>

        {/* Phone Hours Dialog */}
        <PhoneHoursDialog
          isOpen={isPhoneDialogOpen}
          onClose={() => setIsPhoneDialogOpen(false)}
          phoneNumber="07 57 57 93 30"
        />
      </div>
    </div>
  );
};

export default About;
