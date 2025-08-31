import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HarmoniousButton from '@/components/ui/harmonious-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedSection, AnimatedTitle, AnimatedCard } from '@/components/ScrollAnimation';
import PhoneHoursDialog from '@/components/PhoneHoursDialog';
import AnimatedNumber from '@/components/AnimatedNumber';

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
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [whyMarieMousePosition, setWhyMarieMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const whyMarieImageRef = useRef<HTMLDivElement>(null);

  const handlePhoneClick = () => {
    setIsPhoneDialogOpen(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * -10; // Rotation X inversée
      const rotateY = (x - centerX) / centerX * 10; // Rotation Y
      
      setMousePosition({ x: rotateY, y: rotateX });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const handleWhyMarieMouseMove = (e: React.MouseEvent) => {
    if (whyMarieImageRef.current) {
      const rect = whyMarieImageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * -10; // Rotation X inversée
      const rotateY = (x - centerX) / centerX * 10; // Rotation Y
      
      setWhyMarieMousePosition({ x: rotateY, y: rotateX });
    }
  };

  const handleWhyMarieMouseLeave = () => {
    setWhyMarieMousePosition({ x: 0, y: 0 });
  };



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
      color: 'bg-pink-50 border-pink-200',
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
      <div className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <Badge className="mb-6 bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200">
                <Award className="mr-2 h-4 w-4" />
                Professionnelle Expérimentée
              </Badge>

              <AnimatedTitle className="mb-4 font-['Poppins'] text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl" delay={0.2}>
                Garde d'enfants
                <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-emerald-400">
                  de confiance
                </span>
              </AnimatedTitle>

              <p className="mb-6 px-4 font-['Inter'] text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:mb-8 sm:text-xl lg:px-0">
                Je suis Marie Fortea, professionnelle de la petite enfance avec
                plus de 9 ans d'expérience en crèche et 7 ans de garde à domicile. Je propose des services de
                garde occasionnelle pour vos mariages, événements spéciaux et
                urgences.
              </p>

              <div className="flex flex-col justify-center gap-3 px-4 sm:flex-row sm:gap-4 lg:justify-start lg:px-0">
                            <HarmoniousButton
              asChild
              variant="primary"
              size="lg"
            >
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Réserver maintenant
              </Link>
            </HarmoniousButton>
                <HarmoniousButton
                  asChild
                  variant="secondary"
                  size="lg"
                >
                  <Link to="/services">En savoir plus</Link>
                </HarmoniousButton>
              </div>

              {/* Statistics */}
              <div className="mt-8 grid grid-cols-3 gap-4 px-4 lg:px-0">
                <div className="text-center">
                  <AnimatedNumber value={16} colorClass="text-blue-600 dark:text-blue-400" />
                  <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">Années d'expérience</div>
                </div>
                <div className="text-center">
                  <AnimatedNumber value={50} suffix="+" colorClass="text-green-600 dark:text-green-400" />
                  <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">Familles satisfaites</div>
                </div>
                <div className="text-center">
                  <AnimatedNumber value={20} suffix="km" colorClass="text-purple-600 dark:text-purple-400" />
                  <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">Rayon d'intervention</div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div 
                ref={imageRef}
                className="relative perspective-1000"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div 
                  className="rainbow-outline rounded-2xl p-0.5 sm:rounded-3xl mx-auto max-w-sm sm:max-w-md lg:max-w-lg transition-transform duration-300 ease-out"
                  style={{
                    transform: `rotateY(${mousePosition.x}deg) rotateX(${mousePosition.y}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <img
                    src="https://images.pexels.com/photos/8613313/pexels-photo-8613313.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Marie Fortea avec des enfants"
                    className="w-full aspect-[4/5] rounded-2xl object-cover shadow-2xl sm:rounded-3xl"
                  />
                </div>
                <div className="absolute -right-4 -top-4 h-20 w-20 animate-pulse rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 opacity-20 sm:-right-6 sm:-top-6 sm:h-32 sm:w-32"></div>
                <div className="animation-delay-1000 absolute -bottom-4 -left-4 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-blue-400 to-green-400 opacity-20 sm:-bottom-6 sm:-left-6 sm:h-24 sm:w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
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
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <AnimatedTitle className="mb-4 font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-4xl" delay={0.3}>
              Mes Services de Garde
            </AnimatedTitle>
            <p className="mx-auto max-w-3xl px-4 font-['Inter'] text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
              Des solutions flexibles adaptées à tous vos besoins, avec la
              sécurité et la bienveillance d'une professionnelle expérimentée.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {services.map((service, index) => (
              <AnimatedCard
                key={index}
                index={index}
                className="group cursor-pointer border-2 border-pink-100 bg-white transition-all duration-300 hover:shadow-xl hover:border-pink-200 dark:border-zinc-700 dark:bg-zinc-900 rounded-2xl shadow-sm hover:animate-shake"
              >
                <CardContent className="p-4 text-center sm:p-6">
                  <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                    {service.icon}
                  </div>
                  <h3 className="mb-2 font-['Poppins'] text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                    {service.title}
                  </h3>
                  <p className="font-['Inter'] text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                    {service.description}
                  </p>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>

          <div className="mt-12 text-center">
            <HarmoniousButton
              asChild
              variant="secondary"
              size="lg"
            >
              <Link to="/services">Découvrir tous les services</Link>
            </HarmoniousButton>
          </div>
        </div>
      </div>

      {/* Why Choose Me Section */}
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
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <AnimatedTitle className="mb-6 font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-4xl" delay={0.4}>
                Pourquoi choisir Marie ?
              </AnimatedTitle>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/40 sm:h-12 sm:w-12">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-['Poppins'] text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                      Expérience Professionnelle
                    </h3>
                    <p className="font-['Inter'] text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                      Plus de 9 ans d'expérience en crèche et 7 ans de garde à domicile avec formations
                      spécialisées en petite enfance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-emerald-950/40 sm:h-12 sm:w-12">
                    <Heart className="h-5 w-5 text-green-600 dark:text-emerald-400 sm:h-6 sm:w-6" />
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
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-amber-950/40 sm:h-12 sm:w-12">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-amber-400 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-['Poppins'] text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                      Flexibilité & Fiabilité
                    </h3>
                    <p className="font-['Inter'] text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                      Disponible en urgence et adaptable à tous vos besoins,
                      même en dernière minute.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div 
              ref={whyMarieImageRef}
              className="relative perspective-1000"
              onMouseMove={handleWhyMarieMouseMove}
              onMouseLeave={handleWhyMarieMouseLeave}
            >
              <div 
                className="rainbow-outline rounded-2xl p-0.5 sm:rounded-3xl w-full transition-transform duration-300 ease-out"
                style={{
                  transform: `rotateY(${whyMarieMousePosition.x}deg) rotateX(${whyMarieMousePosition.y}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <img
                  src="https://images.pexels.com/photos/8613098/pexels-photo-8613098.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Marie avec des enfants en activité"
                  className="w-full aspect-[4/3] rounded-2xl object-cover shadow-2xl sm:rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
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
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <AnimatedTitle className="mb-4 font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-4xl" delay={0.5}>
              Ce que disent les parents
            </AnimatedTitle>
            <p className="mx-auto max-w-3xl px-4 font-['Inter'] text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
              La confiance des familles est ma plus belle récompense.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <AnimatedCard
                key={index}
                index={index}
                className="border-2 border-blue-100 bg-white transition-all duration-300 hover:shadow-xl hover:border-blue-200 dark:border-zinc-700 dark:bg-zinc-900 rounded-2xl shadow-sm hover:animate-shake"
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
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20">
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
        <div className="w-full px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:mb-6 sm:text-3xl md:text-4xl">
            Prêts à confier vos enfants à une professionnelle ?
          </h2>
          <p className="mb-6 px-4 font-['Inter'] text-lg text-gray-600 dark:text-gray-300 sm:mb-8 sm:text-xl">
            Réservez dès maintenant pour vos prochains événements ou en cas
            d'urgence.
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
        </div>
      </section>

      {/* Phone Hours Dialog */}
      <PhoneHoursDialog
        isOpen={isPhoneDialogOpen}
        onClose={() => setIsPhoneDialogOpen(false)}
        phoneNumber="07 57 57 93 30"
      />
    </div>
  );
};

export default Home;
