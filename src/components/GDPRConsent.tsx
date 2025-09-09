import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Info, 
  ExternalLink,
  Cookie,
  Database,
  Mail,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GDPRService } from '@/lib/gdpr-service';

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface GDPRConsentProps {
  onConsentChange?: (consent: ConsentPreferences) => void;
  showDetailed?: boolean;
  className?: string;
}

const GDPRConsent: React.FC<GDPRConsentProps> = ({ 
  onConsentChange, 
  showDetailed = false,
  className = "" 
}) => {
  const [consent, setConsent] = useState<ConsentPreferences>({
    necessary: true, // Toujours true car nécessaire au fonctionnement
    analytics: false,
    marketing: false,
    functional: false
  });
  
  const [showDetails, setShowDetails] = useState(showDetailed);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  // Vérifier si le consentement a déjà été donné
  useEffect(() => {
    const savedConsent = localStorage.getItem('gdpr-consent');
    if (savedConsent) {
      const parsedConsent = JSON.parse(savedConsent);
      setConsent(parsedConsent);
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleConsentChange = (key: keyof ConsentPreferences, value: boolean) => {
    const newConsent = { ...consent, [key]: value };
    setConsent(newConsent);
    onConsentChange?.(newConsent);
  };

  const saveConsent = async () => {
    try {
      // Obtenir l'email de l'utilisateur (si disponible)
      const userEmail = 'anonymous@example.com'; // À remplacer par l'email réel de l'utilisateur
      
      // Sauvegarder dans la base de données
      const result = await GDPRService.saveConsentPreferences(
        userEmail,
        consent,
        undefined, // IP address
        navigator.userAgent
      );

      if (result.error) {
        console.error('Erreur lors de la sauvegarde:', result.error);
      }

      // Sauvegarder aussi dans le localStorage
      localStorage.setItem('gdpr-consent', JSON.stringify(consent));
      localStorage.setItem('gdpr-consent-date', new Date().toISOString());
      setIsVisible(false);
      
      toast({
        title: "Consentement enregistré",
        description: "Vos préférences de confidentialité ont été sauvegardées.",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du consentement:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de vos préférences.",
        variant: "destructive",
      });
    }
  };

  const acceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setConsent(allConsent);
    localStorage.setItem('gdpr-consent', JSON.stringify(allConsent));
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());
    setIsVisible(false);
    
    toast({
      title: "Tous les cookies acceptés",
      description: "Vous avez accepté tous les types de cookies.",
    });
  };

  const rejectAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setConsent(minimalConsent);
    localStorage.setItem('gdpr-consent', JSON.stringify(minimalConsent));
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());
    setIsVisible(false);
    
    toast({
      title: "Cookies rejetés",
      description: "Seuls les cookies nécessaires sont activés.",
    });
  };

  const resetConsent = () => {
    localStorage.removeItem('gdpr-consent');
    localStorage.removeItem('gdpr-consent-date');
    setConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    });
    setIsVisible(true);
    
    toast({
      title: "Préférences réinitialisées",
      description: "Vous pouvez maintenant modifier vos préférences de cookies.",
    });
  };

  if (!isVisible) {
    return (
      <div className={`fixed bottom-4 left-4 z-50 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={resetConsent}
          className="bg-white dark:bg-gray-800 shadow-lg"
        >
          <Shield className="h-4 w-4 mr-2" />
          Gérer les cookies
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Gestion de vos préférences de confidentialité
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience. 
            Vous pouvez choisir quels types de cookies accepter.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Cookies nécessaires */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Cookies nécessaires
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Essentiels au fonctionnement du site
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Toujours actif
                </Badge>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">
              Ces cookies sont nécessaires au fonctionnement du site web et ne peuvent pas être désactivés. 
              Ils incluent les cookies de session, d'authentification et de sécurité.
            </p>
          </div>

          <Separator />

          {/* Cookies fonctionnels */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cookie className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Cookies fonctionnels
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mémorisent vos préférences (thème, langue)
                  </p>
                </div>
              </div>
              <Checkbox
                checked={consent.functional}
                onCheckedChange={(checked) => handleConsentChange('functional', checked as boolean)}
              />
            </div>
          </div>

          <Separator />

          {/* Liens utiles */}
          <div className="space-y-2">
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
              onClick={saveConsent}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Enregistrer mes choix
            </Button>
            
            <Button
              onClick={acceptAll}
              variant="default"
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Accepter tout
            </Button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Vous pouvez modifier vos préférences à tout moment en cliquant sur 
            "Gérer les cookies" en bas à droite de l'écran.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GDPRConsent;
