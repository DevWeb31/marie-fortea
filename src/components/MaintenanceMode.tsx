import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Clock, Mail, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import MouseTrail from './MouseTrail';

const MaintenanceMode: React.FC = () => {
  const handleAdminAccess = () => {
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Fond grille - en arrière-plan */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10"></div>
      
      {/* Sphères flottantes - en arrière-plan */}
      <div className="floating-sphere-1 -z-10"></div>
      <div className="floating-sphere-2 -z-10"></div>
      <div className="floating-sphere-3 -z-10"></div>
      
      {/* Effet de traînée de bulles - en arrière-plan */}
      <div className="-z-10">
        <MouseTrail />
      </div>
      
      {/* Bouton de changement de thème en haut à droite */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Bouton d'accès admin discret en bas à droite */}
      <Button
        onClick={handleAdminAccess}
        variant="ghost"
        size="sm"
        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 opacity-60 hover:opacity-100 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-200 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-20"
        title="Accès administrateur"
      >
        <Settings className="h-4 w-4 mr-1" />
        <span className="text-xs hidden sm:inline">Admin</span>
      </Button>

      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl relative z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-xl mx-4 sm:mx-6 lg:mx-8">
        <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6">
          <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
            <Wrench className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Mode Maintenance
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
            Notre site est temporairement en maintenance pour améliorer votre expérience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Retour prévu sous peu</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Nous travaillons activement pour vous offrir une meilleure expérience. 
              Merci de votre patience.
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                Besoin d'une garde d'enfant en urgence ?
              </p>
              <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                <a 
                  href="mailto:contact@marie-fortea.com" 
                  className="text-xs sm:text-sm font-medium hover:underline break-all sm:break-normal"
                >
                  contact@marie-fortea.com
                </a>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Marie Fortea - Garde d'enfants à domicile
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceMode;
