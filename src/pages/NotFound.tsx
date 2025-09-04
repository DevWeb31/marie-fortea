import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HarmoniousButton from '@/components/ui/harmonious-button';
import { AnimatedSection, AnimatedTitle } from '@/components/ScrollAnimation';
import {
  Home,
  Search,
  Baby,
  Heart,
  Star,
  Smile,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header avec animation */}
        <AnimatedSection className="mb-12 text-center">
          <div className="relative">
            {/* Émojis flottants */}
            <div className="absolute -top-8 -left-8 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>
              🧸
            </div>
            <div className="absolute -top-4 -right-12 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>
              🌟
            </div>
            <div className="absolute top-8 -left-16 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>
              🎈
            </div>
            <div className="absolute top-4 -right-8 text-3xl animate-bounce" style={{ animationDelay: '1.5s' }}>
              🎨
            </div>
            
            <Badge className="mb-6 bg-gradient-to-r from-pink-100 to-blue-100 px-4 py-2 text-sm font-medium text-pink-700 hover:from-pink-200 hover:to-blue-200 dark:from-pink-900 dark:to-blue-900 dark:text-pink-300">
              <Search className="mr-2 h-4 w-4" />
              Page introuvable
            </Badge>

            <AnimatedTitle className="mb-4 font-['Poppins'] text-6xl font-bold text-gray-900 dark:text-white sm:mb-6 sm:text-7xl md:text-8xl" delay={0.2}>
              4
              <span className="inline-block animate-spin text-pink-500">0</span>
              4
            </AnimatedTitle>

            <h2 className="mb-4 font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white sm:mb-6 sm:text-3xl">
              Oups ! Cette page s'est cachée ! 
              <span className="block text-pink-500">Comme un petit jeu de cache-cache 🫣</span>
            </h2>

            <p className="mx-auto max-w-2xl px-4 font-['Inter'] text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
              La page que vous cherchez a peut-être été emmenée par nos petits amis pour une sieste ! 
              Mais ne vous inquiétez pas, nous allons vous aider à la retrouver.
            </p>
          </div>
        </AnimatedSection>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          {/* Carte principale */}
          <AnimatedSection className="lg:col-span-2" delay={0.4}>
            <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-white to-pink-50 dark:from-zinc-800 dark:to-zinc-700">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="mb-8">
                  <div className="text-8xl mb-4 animate-pulse">🧸</div>
                  <h3 className="font-['Poppins'] text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Nos petits amis vous attendent !
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Retournez à la maison pour découvrir tous nos services de garde d'enfants
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <HarmoniousButton
                    asChild
                    variant="primary"
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                  >
                    <Link to="/">
                      <Home className="mr-2 h-5 w-5" />
                      Retour à l'accueil
                    </Link>
                  </HarmoniousButton>

                  <HarmoniousButton
                    asChild
                    variant="secondary"
                    size="lg"
                  >
                    <Link to="/booking">
                      <Heart className="mr-2 h-5 w-5" />
                      Faire une demande
                    </Link>
                  </HarmoniousButton>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Cartes d'activités */}
          <AnimatedSection delay={0.6}>
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h4 className="font-['Poppins'] text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Activités créatives
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Découvrez nos services de garde avec des activités ludiques
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.8}>
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🌟</div>
                <h4 className="font-['Poppins'] text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Soins attentionnés
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Une garde personnalisée avec amour et professionnalisme
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        {/* Section de navigation rapide */}
        <AnimatedSection className="mt-12" delay={1.0}>
          <div className="text-center">
            <h3 className="font-['Poppins'] text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Ou explorez nos autres pages :
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link 
                to="/services" 
                className="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-zinc-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors duration-200 shadow-sm"
              >
                <Baby className="mr-2 h-4 w-4" />
                Services
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-zinc-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors duration-200 shadow-sm"
              >
                <Smile className="mr-2 h-4 w-4" />
                À propos
              </Link>
              <Link 
                to="/booking" 
                className="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-zinc-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors duration-200 shadow-sm"
              >
                <Star className="mr-2 h-4 w-4" />
                Réservation
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Message d'encouragement */}
        <AnimatedSection className="mt-12 text-center" delay={1.2}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30">
            <Sparkles className="mr-2 h-5 w-5 text-yellow-600" />
            <span className="text-yellow-800 dark:text-yellow-300 font-medium">
              Chaque aventure commence par un premier pas ! 🚀
            </span>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default NotFound;
