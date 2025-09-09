import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Lock,
  Clock,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GDPRService } from '@/lib/gdpr-service';

const DataDownload: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [hasNoData, setHasNoData] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setError('Token manquant');
      setIsLoading(false);
      return;
    }

    const validateAndFetchData = async () => {
      try {
        const result = await GDPRService.validateDownloadToken(token);
        
        if (result.error) {
          if (result.error.includes('expiré') || result.error.includes('expired')) {
            setIsExpired(true);
          } else if (result.error.includes('Aucune donnée trouvée')) {
            setHasNoData(true);
            setIsValid(true);
          } else {
            setError(result.error);
          }
          setIsValid(false);
        } else {
          setIsValid(true);
          setUserData(result.data);
        }
      } catch (error) {
        console.error('Erreur lors de la validation du token:', error);
        setError('Erreur lors de la validation du lien');
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateAndFetchData();
  }, [token]);

  const handleDownload = () => {
    if (!userData) return;

    try {
      // Créer et télécharger le fichier JSON
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `mes-donnees-marie-fortea-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Téléchargement réussi",
        description: "Vos données ont été téléchargées avec succès.",
      });

      // Invalider le token après téléchargement
      GDPRService.invalidateDownloadToken(token!);

    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur est survenue lors du téléchargement.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Validation du lien en cours...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Clock className="h-5 w-5" />
                Lien expiré
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  Ce lien de téléchargement a expiré. Les liens de téléchargement sont valides pendant 24 heures pour votre sécurité.
                </AlertDescription>
              </Alert>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pour obtenir un nouveau lien de téléchargement, veuillez faire une nouvelle demande d'export de vos données.
              </p>

              <Button 
                onClick={() => navigate('/data-management')}
                className="w-full"
              >
                Faire une nouvelle demande
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (hasNoData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <CheckCircle className="h-5 w-5" />
                Aucune donnée trouvée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  Aucune donnée personnelle n'a été trouvée pour cette adresse email dans notre système.
                </AlertDescription>
              </Alert>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cela peut signifier que :
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                <li>Vous n'avez jamais effectué de réservation sur notre site</li>
                <li>Vos données ont déjà été supprimées (conservation limitée à 2 mois)</li>
                <li>L'adresse email utilisée ne correspond pas à celle de vos réservations</li>
              </ul>

              <Button 
                onClick={() => navigate('/data-management')}
                className="w-full"
              >
                Retour à la gestion des données
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isValid || error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Lien invalide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error || 'Ce lien de téléchargement n\'est pas valide ou a déjà été utilisé.'}
                </AlertDescription>
              </Alert>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le support.
              </p>

              <Button 
                onClick={() => navigate('/data-management')}
                className="w-full"
              >
                Retour à la gestion des données
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Shield className="h-5 w-5" />
              Téléchargement sécurisé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Votre lien de téléchargement est valide. Vous pouvez maintenant télécharger vos données personnelles.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Données disponibles :</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Informations de réservation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Détails des enfants</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Informations de contact</span>
                </div>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <Lock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Sécurité :</strong> Ce lien ne peut être utilisé qu'une seule fois et expire automatiquement après 24 heures.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleDownload}
              className="w-full"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger mes données
            </Button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Le fichier sera téléchargé au format JSON et contiendra toutes vos données personnelles.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataDownload;
