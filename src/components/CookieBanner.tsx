import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Cookie, 
  CheckCircle, 
  XCircle, 
  Settings,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CookieBannerProps {
  onConsentChange?: (consent: boolean) => void;
  className?: string;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ 
  onConsentChange, 
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier si le consentement a déjà été donné
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    onConsentChange?.(true);
    
    toast({
      title: "Cookies acceptés",
      description: "Vous acceptez l'utilisation de cookies pour améliorer votre expérience.",
    });
  };

  const rejectAll = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    onConsentChange?.(false);
    
    toast({
      title: "Cookies rejetés",
      description: "Seuls les cookies nécessaires au fonctionnement du site sont utilisés.",
    });
  };

  const openSettings = () => {
    setShowDetails(true);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${className}`}>
        <Card className="max-w-4xl mx-auto shadow-lg border-2">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Cookie className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Nous utilisons des cookies
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Nous utilisons des cookies pour améliorer votre expérience. 
                    Vos données sont conservées 2 mois maximum. 
                    <a 
                      href="/privacy-policy" 
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-1 inline-flex items-center gap-1"
                    >
                      En savoir plus
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rejectAll}
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Rejeter
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openSettings}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Button>
                
                <Button
                  onClick={acceptAll}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Accepter tout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de paramètres détaillés */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Paramètres des cookies
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Cookies nécessaires */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Cookies nécessaires
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Essentiels au fonctionnement du site
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Toujours actif
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ces cookies sont nécessaires au fonctionnement du site web et ne peuvent pas être désactivés. 
                    Ils incluent les cookies de session, d'authentification et de sécurité.
                  </p>
                </div>

                {/* Cookies fonctionnels */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Cookies fonctionnels
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mémorisent vos préférences (thème, langue)
                      </p>
                    </div>
                    <Badge variant="outline">Optionnel</Badge>
                  </div>
                </div>

                {/* Liens utiles */}
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 dark:text-white">En savoir plus</h4>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <a 
                      href="/privacy-policy" 
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                      Politique de confidentialité
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <a 
                      href="/cookies-policy" 
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                      Politique des cookies
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={rejectAll}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter tout
                  </Button>
                  
                  <Button
                    onClick={acceptAll}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accepter tout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
