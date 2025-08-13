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
  Phone
} from 'lucide-react';

const Home = () => {
  const services = [
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "Mariages & Événements",
      description: "Garde professionnelle pendant vos moments spéciaux",
      color: "bg-pink-50 border-pink-200"
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-500" />,
      title: "Urgences",
      description: "Disponible rapidement en cas d'imprévu",
      color: "bg-orange-50 border-orange-200"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Soirées Parents",
      description: "Profitez de vos soirées en toute tranquillité",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Calendar className="w-8 h-8 text-green-500" />,
      title: "Week-ends",
      description: "Garde occasionnelle pour vos week-ends",
      color: "bg-green-50 border-green-200"
    }
  ];

  const testimonials = [
    {
      name: "Sophie M.",
      rating: 5,
      text: "Marie a gardé nos deux enfants pendant notre mariage. Elle était parfaite, très professionnelle et les enfants l'adoraient !",
      location: "Toulouse"
    },
    {
      name: "Thomas L.",
      rating: 5,
      text: "Nous faisons appel à Marie régulièrement pour nos sorties. Elle est fiable, douce et très expérimentée avec les enfants.",
      location: "Colomiers"
    },
    {
      name: "Julie R.",
      rating: 5,
      text: "Marie nous a dépannés en urgence quand notre fille était malade. Sa bienveillance et son professionnalisme sont remarquables.",
      location: "Blagnac"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-green-400/10 to-yellow-400/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm font-medium">
                <Award className="w-4 h-4 mr-2" />
                Professionnelle Expérimentée
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-['Poppins'] leading-tight">
                Garde d'enfants
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 block">
                  de confiance
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed font-['Inter'] px-4 lg:px-0">
                Je suis Marie Fortea, professionnelle de la petite enfance avec plus de 5 ans d'expérience en crèche. 
                Je propose des services de garde occasionnelle pour vos mariages, événements spéciaux et urgences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 lg:px-0">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg font-medium"
                >
                  <Link to="/booking">
                    <Baby className="w-5 h-5 mr-2" />
                    Réserver maintenant
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium transition-all duration-300"
                >
                  <Link to="/about">En savoir plus</Link>
                </Button>
              </div>

              <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 px-4 lg:px-0">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 font-['Poppins']">5+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Années d'expérience</div>
                </div>
                <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 font-['Poppins']">50+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Familles satisfaites</div>
                </div>
                <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 font-['Poppins']">24/7</div>
                  <div className="text-xs sm:text-sm text-gray-600">Disponibilité urgences</div>
                </div>
              </div>
            </div>
            
            <div className="relative order-1 lg:order-2">
              <div className="relative z-10">
                <img 
                  src="https://images.pexels.com/photos/8613313/pexels-photo-8613313.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Marie Fortea avec des enfants"
                  className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto rounded-2xl sm:rounded-3xl shadow-2xl object-cover aspect-[4/5]"
                />
              </div>
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400 to-green-400 rounded-full opacity-20 animate-pulse animation-delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-['Poppins']">
              Mes Services de Garde
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-['Inter'] px-4">
              Des solutions flexibles adaptées à tous vos besoins, avec la sécurité et la bienveillance d'une professionnelle expérimentée.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <Card key={index} className={`${service.color} hover:shadow-lg transition-all duration-300 group cursor-pointer`}>
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-['Poppins']">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm font-['Inter']">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-full">
              <Link to="/services">
                Découvrir tous les services
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-['Poppins']">
                Pourquoi choisir Marie ?
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-['Poppins']">
                      Expérience Professionnelle
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 font-['Inter']">
                      Plus de 5 ans d'expérience en crèche et formations spécialisées en petite enfance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-['Poppins']">
                      Approche Bienveillante
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 font-['Inter']">
                      Une attention particulière au bien-être et à l'épanouissement de chaque enfant.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-['Poppins']">
                      Flexibilité & Fiabilité
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 font-['Inter']">
                      Disponible selon vos besoins, même en cas d'urgence ou d'imprévu.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/8613098/pexels-photo-8613098.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Marie avec des enfants en activité"
                className="w-full rounded-2xl sm:rounded-3xl shadow-2xl object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-['Poppins']">
              Ce que disent les parents
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-['Inter'] px-4">
              La confiance des familles est ma plus belle récompense.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 font-['Inter'] leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm sm:text-base font-semibold text-gray-900 font-['Poppins']">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
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
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 font-['Poppins']">
            Prêts à confier vos enfants à une professionnelle ?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 font-['Inter'] px-4">
            Réservez dès maintenant pour vos prochains événements ou en cas d'urgence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button 
              asChild 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg font-medium"
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
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium transition-all duration-300"
            >
              <a href="tel:+33123456789">
                <Phone className="w-5 h-5 mr-2" />
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