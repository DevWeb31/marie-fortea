import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
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
  Phone
} from 'lucide-react';

const About = () => {
  const qualifications = [
    {
      icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
      title: "CAP Petite Enfance",
      description: "Formation officielle en développement et soins de la petite enfance"
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Formation Premiers Secours",
      description: "Certification PSC1 à jour pour la sécurité de vos enfants"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-purple-600" />,
      title: "Formation Continue",
      description: "Régulièrement mise à jour sur les méthodes pédagogiques"
    },
    {
      icon: <Users className="w-6 h-6 text-pink-600" />,
      title: "5+ Années en Crèche",
      description: "Expérience approfondie avec des enfants de 3 mois à 6 ans"
    }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "Bienveillance",
      description: "Chaque enfant est unique et mérite une attention particulière adaptée à ses besoins.",
      color: "bg-pink-50 border-pink-200"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Sécurité",
      description: "La sécurité physique et émotionnelle de vos enfants est ma priorité absolue.",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Excellence",
      description: "Je m'engage à offrir un service de qualité supérieure à chaque intervention.",
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Confiance",
      description: "Établir une relation de confiance durable avec les familles est essentiel.",
      color: "bg-green-50 border-green-200"
    }
  ];

  const testimonials = [
    {
      name: "Claire D.",
      rating: 5,
      text: "Marie a une approche très professionnelle tout en étant chaleureuse. Nos enfants l'adorent et nous avons une confiance totale en elle.",
      service: "Garde week-end",
      location: "Toulouse"
    },
    {
      name: "Antoine M.",
      rating: 5,
      text: "Nous avons fait appel à Marie pour notre mariage. Elle a su occuper les 6 enfants présents avec des activités adaptées. Un vrai bonheur !",
      service: "Mariage",
      location: "Colomiers"
    },
    {
      name: "Sarah L.",
      rating: 5,
      text: "Marie nous dépanne régulièrement pour nos urgences professionnelles. Sa réactivité et sa disponibilité sont remarquables.",
      service: "Garde d'urgence",
      location: "Blagnac"
    }
  ];

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm font-medium">
            <Award className="w-4 h-4 mr-2" />
            Professionnelle Expérimentée
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-['Poppins']">
            À propos de
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 block">
              Marie Fortea
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-['Inter'] px-4">
            Passionnée par la petite enfance depuis toujours, je mets mon expérience et ma bienveillance 
            au service des familles toulousaines.
          </p>
        </div>

        {/* About Me Section */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-12 sm:mb-16 md:mb-20">
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/8612990/pexels-photo-8612990.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Marie Fortea portrait professionnel"
              className="w-full rounded-2xl sm:rounded-3xl shadow-2xl object-cover aspect-[4/5]"
            />
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600 font-['Poppins']">5+</div>
                <div className="text-xs sm:text-sm text-gray-600">Années d'expérience</div>
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 font-['Poppins']">
                Mon Parcours
              </h2>
              
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-700 font-['Inter'] leading-relaxed">
                <p>
                  Diplômée d'un CAP Petite Enfance, j'ai débuté ma carrière dans une crèche municipale 
                  de Toulouse où j'ai eu l'opportunité de travailler avec des enfants de 3 mois à 6 ans 
                  pendant plus de 5 années.
                </p>
                
                <p>
                  Cette expérience m'a permis de développer une expertise solide dans l'accompagnement 
                  du développement de l'enfant, la gestion des besoins spécifiques de chaque âge, 
                  et l'importance d'une approche individualisée et bienveillante.
                </p>
                
                <p>
                  Aujourd'hui, je souhaite mettre cette expérience au service des familles en proposant 
                  des services de garde occasionnelle de qualité, que ce soit pour vos événements 
                  spéciaux, vos urgences ou simplement pour vous offrir des moments de détente.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 font-['Poppins']">
                Ma Philosophie
              </h3>
              <p className="text-sm sm:text-base text-gray-700 font-['Inter'] leading-relaxed">
                "Chaque enfant est unique et mérite d'être accompagné avec bienveillance, respect et professionnalisme. 
                Mon rôle est de créer un environnement sécurisé et stimulant où il peut s'épanouir pleinement."
              </p>
            </div>
          </div>
        </div>

        {/* Qualifications */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 text-center font-['Poppins']">
            Qualifications & Certifications
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {qualifications.map((qual, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    {qual.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-['Poppins']">
                    {qual.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm font-['Inter']">
                    {qual.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* My Values */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 text-center font-['Poppins']">
            Mes Valeurs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <Card key={index} className={`${value.color} hover:shadow-lg transition-all duration-300 group`}>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <div className="scale-75 sm:scale-100">
                        {value.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 font-['Poppins']">
                        {value.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 font-['Inter'] leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-12 sm:mb-16 md:mb-20 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 font-['Poppins']">5+</div>
              <div className="text-xs sm:text-sm text-blue-100">Années d'expérience</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 font-['Poppins']">50+</div>
              <div className="text-xs sm:text-sm text-blue-100">Familles satisfaites</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 font-['Poppins']">200+</div>
              <div className="text-xs sm:text-sm text-blue-100">Heures de garde</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 font-['Poppins']">100%</div>
              <div className="text-xs sm:text-sm text-blue-100">Familles qui recommandent</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 text-center font-['Poppins']">
            Témoignages de Confiance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 font-['Inter'] leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-sm sm:text-base font-semibold text-gray-900 font-['Poppins']">
                      {testimonial.name}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600 font-medium">
                      {testimonial.service}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      {testimonial.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Area */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center font-['Poppins']">
            Zone d'Intervention
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 font-['Poppins']">
                Principalement dans la région toulousaine :
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {['Toulouse', 'Colomiers', 'Blagnac', 'L\'Union', 'Balma', 'Ramonville', 'Cugnaux', 'Tournefeuille'].map((city, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm sm:text-base text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-['Inter']">{city}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-600 mt-4 font-['Inter']">
                <strong>Frais de déplacement :</strong> Gratuit dans un rayon de 10km, 
                puis 0,50€/km au-delà.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-full mx-auto flex items-center justify-center">
                <MapPin className="w-10 h-10 sm:w-16 sm:h-16 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 font-['Poppins']">
            Prêts à faire confiance à une professionnelle ?
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 font-['Inter'] px-4">
            Contactez-moi pour discuter de vos besoins et planifier votre prochaine garde d'enfants.
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
              <a href="tel:+33123456789">
                <Phone className="w-5 h-5 mr-2" />
                06 12 34 56 78
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;