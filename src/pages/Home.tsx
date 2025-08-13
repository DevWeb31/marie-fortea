import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
  Heart,
  Star,
  Users,
  Clock,
  Shield,
  Award,
  Baby,
  Calendar,
  MapPin,
  Phone,
} from 'lucide-react';

const Home = () => {
  const services = [
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: 'Mariages & Événements',
      description: 'Garde professionnelle pendant vos moments spéciaux',
      color: 'bg-pink-50 border-pink-200',
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      title: 'Urgences',
      description: "Disponible rapidement en cas d'imprévu",
      color: 'bg-orange-50 border-orange-200',
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: 'Soirées Parents',
      description: 'Profitez de vos soirées en toute tranquillité',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      title: 'Week-ends',
      description: 'Garde occasionnelle pour vos week-ends',
      color: 'bg-green-50 border-green-200',
    },
  ];

  const testimonials = [
    {
      name: 'Sophie M.',
      rating: 5,
      text: "Marie a gardé nos deux enfants pendant notre mariage. Elle était parfaite, très professionnelle et les enfants l'adoraient !",
      location: 'Toulouse',
    },
    {
      name: 'Thomas L.',
      rating: 5,
      text: 'Nous faisons appel à Marie régulièrement pour nos sorties. Elle est fiable, douce et très expérimentée avec les enfants.',
      location: 'Colomiers',
    },
    {
      name: 'Julie R.',
      rating: 5,
      text: 'Marie nous a dépannés en urgence quand notre fille était malade. Sa bienveillance et son professionnalisme sont remarquables.',
      location: 'Blagnac',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-green-400/10 to-yellow-400/10 dark:from-blue-400/5 dark:via-green-400/5 dark:to-yellow-400/5"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <Badge className="mb-6 bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200">
                <Award className="mr-2 h-4 w-4" />
                Professionnelle Expérimentée
              </Badge>

              <h1 className="mb-4 font-['Poppins'] text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
                Garde d'enfants
                <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-green-400">
                  de confiance
                </span>
              </h1>

              <p className="mb-6 px-4 font-['Inter'] text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:mb-8 sm:text-xl lg:px-0">
                Je suis Marie Fortea, professionnelle de la petite enfance avec
                plus de 5 ans d'expérience en crèche. Je propose des services de
                garde occasionnelle pour vos mariages, événements spéciaux et
                urgences.
              </p>

              <div className="flex flex-col justify-center gap-3 px-4 sm:flex-row sm:gap-4 lg:justify-start lg:px-0">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg"
                >
                  <Link to="/booking">
                    <Baby className="mr-2 h-5 w-5" />
                    Réserver maintenant
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-2 border-blue-200 px-6 py-3 text-base font-medium text-blue-600 transition-all duration-300 hover:bg-blue-50 sm:px-8 sm:py-4 sm:text-lg"
                >
                  <Link to="/about">En savoir plus</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 px-4 sm:mt-12 sm:gap-8 lg:justify-start lg:px-0">
                <div className="text-center">
                  <div className="font-['Poppins'] text-xl font-bold text-blue-600 dark:text-blue-400 sm:text-2xl">
                    5+
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                    Années d'expérience
                  </div>
                </div>
                <div className="hidden h-12 w-px bg-gray-300 dark:bg-gray-600 sm:block"></div>
                <div className="text-center">
                  <div className="font-['Poppins'] text-xl font-bold text-blue-600 dark:text-blue-400 sm:text-2xl">
                    50+
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                    Familles satisfaites
                  </div>
                </div>
                <div className="hidden h-12 w-px bg-gray-300 dark:bg-gray-600 sm:block"></div>
                <div className="text-center">
                  <div className="font-['Poppins'] text-xl font-bold text-blue-600 dark:text-blue-400 sm:text-2xl">
                    24/7
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                    Disponibilité urgences
                  </div>
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="relative z-10">
                <img
                  src="https://images.pexels.com/photos/8613313/pexels-photo-8613313.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Marie Fortea avec des enfants"
                  className="mx-auto aspect-[4/5] w-full max-w-sm rounded-2xl object-cover shadow-2xl sm:max-w-md sm:rounded-3xl lg:max-w-lg"
                />
              </div>
              <div className="absolute -right-4 -top-4 h-20 w-20 animate-pulse rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 opacity-20 sm:-right-6 sm:-top-6 sm:h-32 sm:w-32"></div>
              <div className="animation-delay-1000 absolute -bottom-4 -left-4 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-blue-400 to-green-400 opacity-20 sm:-bottom-6 sm:-left-6 sm:h-24 sm:w-24"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-12 dark:bg-slate-900 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
              Mes Services de Garde
            </h2>
            <p className="mx-auto max-w-3xl px-4 font-['Inter'] text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
              Des solutions flexibles adaptées à tous vos besoins, avec la
              sécurité et la bienveillance d'une professionnelle expérimentée.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {services.map((service, index) => (
              <Card
                key={index}
                className={`${service.color} group cursor-pointer transition-all duration-300 hover:shadow-lg`}
              >
                <CardContent className="p-4 text-center sm:p-6">
                  <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                    {service.icon}
                  </div>
                  <h3 className="mb-2 font-['Poppins'] text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    {service.title}
                  </h3>
                  <p className="font-['Inter'] text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Link to="/services">Découvrir tous les services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-12 dark:from-slate-800 dark:to-slate-700 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-6 font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
                Pourquoi choisir Marie ?
              </h2>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:h-12 sm:w-12">
                    <Shield className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-['Poppins'] text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                      Expérience Professionnelle
                    </h3>
                    <p className="font-['Inter'] text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                      Plus de 5 ans d'expérience en crèche et formations
                      spécialisées en petite enfance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 sm:h-12 sm:w-12">
                    <Heart className="h-5 w-5 text-green-600 dark:text-green-400 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-['Poppins'] text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                      Approche Bienveillante
                    </h3>
                    <p className="font-['Inter'] text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                      Une attention particulière au bien-être et à
                      l'épanouissement de chaque enfant.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 sm:h-12 sm:w-12">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-['Poppins'] text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                      Flexibilité & Fiabilité
                    </h3>
                    <p className="font-['Inter'] text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                      Disponible selon vos besoins, même en cas d'urgence ou
                      d'imprévu.
                    </p>
                  </div>
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
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-12 dark:bg-slate-900 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-4 font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
              Ce que disent les parents
            </h2>
            <p className="mx-auto max-w-3xl px-4 font-['Inter'] text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
              La confiance des familles est ma plus belle récompense.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-2 border-gray-100 transition-all duration-300 hover:shadow-lg"
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
                  <p className="mb-4 font-['Inter'] text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    <div>
                      <div className="font-['Poppins'] text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                        {testimonial.name}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-['Poppins'] text-2xl font-bold text-white sm:mb-6 sm:text-3xl md:text-4xl">
            Prêts à confier vos enfants à une professionnelle ?
          </h2>
          <p className="mb-6 px-4 font-['Inter'] text-lg text-blue-100 sm:mb-8 sm:text-xl">
            Réservez dès maintenant pour vos prochains événements ou en cas
            d'urgence.
          </p>

          <div className="flex flex-col justify-center gap-3 px-4 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg"
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
              className="rounded-full border-2 border-white px-6 py-3 text-base font-medium text-white transition-all duration-300 hover:bg-white hover:text-blue-600 sm:px-8 sm:py-4 sm:text-lg"
            >
              <a href="tel:+33123456789">
                <Phone className="mr-2 h-5 w-5" />
                Appeler maintenant
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
