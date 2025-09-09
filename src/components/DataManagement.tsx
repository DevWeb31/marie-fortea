import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Download, 
  Trash2, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Mail,
  Phone,
  Calendar,
  User,
  Baby,
  FileText,
  Database,
  Clock,
  Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GDPRService } from '@/lib/gdpr-service';

interface DataManagementProps {
  className?: string;
}

const DataManagement: React.FC<DataManagementProps> = ({ className = "" }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<'export' | 'delete' | null>(null);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [requestCount, setRequestCount] = useState<number>(0);
  const { toast } = useToast();
  
  // Protection anti-spam : maximum 3 demandes par heure
  const MAX_REQUESTS_PER_HOUR = 3;
  const HOUR_IN_MS = 60 * 60 * 1000;

  // Vérifier la protection anti-spam
  const checkSpamProtection = (): boolean => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    // Si plus d'une heure s'est écoulée, réinitialiser le compteur
    if (timeSinceLastRequest > HOUR_IN_MS) {
      setRequestCount(0);
      setLastRequestTime(now);
      return true;
    }
    
    // Vérifier si on a atteint la limite
    if (requestCount >= MAX_REQUESTS_PER_HOUR) {
      const remainingTime = Math.ceil((HOUR_IN_MS - timeSinceLastRequest) / (60 * 1000));
      toast({
        title: "Limite de demandes atteinte",
        description: `Vous avez atteint la limite de ${MAX_REQUESTS_PER_HOUR} demandes par heure. Veuillez attendre ${remainingTime} minutes.`,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleDataExport = async () => {
    if (!email.trim()) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email pour recevoir vos données.",
        variant: "destructive",
      });
      return;
    }

    // Vérifier la protection anti-spam
    if (!checkSpamProtection()) {
      return;
    }

    setIsLoading(true);
    try {
      // Incrémenter le compteur de demandes
      setRequestCount(prev => prev + 1);
      setLastRequestTime(Date.now());

      // Vérifier d'abord si l'email existe en base de données
      const checkResult = await GDPRService.checkUserDataExists(email);
      
      if (checkResult.error) {
        throw new Error(checkResult.error);
      }

      // Utiliser le service GDPR pour envoyer un email avec lien de téléchargement
      const result = await GDPRService.requestDataExport({
        userEmail: email,
        exportType: 'full'
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.success) {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }

      // Message adapté selon la présence de données
      if (checkResult.hasData) {
        toast({
          title: "Email envoyé",
          description: "Un email avec un lien sécurisé pour télécharger vos données a été envoyé à votre adresse email.",
        });
      } else {
        toast({
          title: "Email envoyé",
          description: "Un email a été envoyé. Si aucune donnée n'est trouvée pour cette adresse, vous recevrez un message d'information.",
        });
      }

      // Réinitialiser le formulaire
      setEmail('');

    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur d'envoi",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi de l'email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataDeletion = async () => {
    if (!email.trim() || !reason.trim()) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez saisir votre email et la raison de la suppression.",
        variant: "destructive",
      });
      return;
    }

    // Vérifier la protection anti-spam
    if (!checkSpamProtection()) {
      return;
    }

    setIsLoading(true);
    try {
      // Incrémenter le compteur de demandes
      setRequestCount(prev => prev + 1);
      setLastRequestTime(Date.now());

      // Utiliser le service GDPR pour demander la suppression
      const result = await GDPRService.requestDataDeletion({
        userEmail: email,
        userPhone: phone,
        reason: reason
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.success) {
        throw new Error('Erreur lors de la demande de suppression');
      }

      toast({
        title: "Demande de suppression enregistrée",
        description: "Vos données seront supprimées immédiatement.",
      });

      // Réinitialiser le formulaire
      setEmail('');
      setPhone('');
      setReason('');

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur de suppression",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la demande de suppression.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPhone('');
    setReason('');
    setAction(null);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Gestion de vos données personnelles
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Conformément au RGPD, vous avez le droit d'accéder, modifier et supprimer vos données personnelles.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Export des données */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-green-600" />
              Exporter mes données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Recevez un email avec un lien sécurisé pour télécharger toutes vos données personnelles.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FileText className="h-4 w-4" />
                <span>Informations de réservation</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Baby className="h-4 w-4" />
                <span>Détails des enfants</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="h-4 w-4" />
                <span>Informations de contact</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="export-email">Adresse email *</Label>
                <Input
                  id="export-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>
              
              {email.trim() && (
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    <strong>Information :</strong> Si cette adresse email correspond à des données enregistrées sur notre site, 
                    vous recevrez un lien de téléchargement. Sinon, vous recevrez un message d'information.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Button 
              onClick={handleDataExport}
              disabled={isLoading}
              className="w-full"
            >
              <Mail className="h-4 w-4 mr-2" />
              {isLoading ? 'Envoi en cours...' : 'Recevoir par email'}
            </Button>

            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Un email avec un lien sécurisé vous sera envoyé. Le lien expire après 24h pour votre sécurité.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Suppression des données */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Supprimer mes données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Demandez la suppression de toutes vos données personnelles. Cette action est irréversible.
            </p>

            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>Attention :</strong> La suppression de vos données est définitive. 
                Vous ne pourrez plus accéder à vos réservations passées.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div>
                <Label htmlFor="delete-email">Adresse email *</Label>
                <Input
                  id="delete-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <Label htmlFor="delete-phone">Numéro de téléphone</Label>
                <Input
                  id="delete-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div>
                <Label htmlFor="delete-reason">Raison de la suppression *</Label>
                <Textarea
                  id="delete-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Expliquez pourquoi vous souhaitez supprimer vos données..."
                  rows={3}
                />
              </div>
            </div>

            <Button 
              onClick={handleDataDeletion}
              disabled={isLoading}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isLoading ? 'Suppression en cours...' : 'Demander la suppression'}
            </Button>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Vos données seront supprimées immédiatement après votre demande. 
                Elles sont également automatiquement supprimées 2 mois après la fin de la garde.
              </AlertDescription>
            </Alert>

            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
              <Clock className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                <strong>Protection anti-spam :</strong> Maximum 3 demandes par heure pour éviter les abus.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Informations supplémentaires */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Informations sur vos droits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Délais de traitement</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Export des données</span>
                  <Badge variant="outline">Email envoyé</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Suppression des données</span>
                  <Badge variant="outline">Immédiat</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Conservation automatique</span>
                  <Badge variant="outline">2 mois après garde</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">Contact</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:contact@marie-fortea.fr" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">contact@marie-fortea.fr</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:0784976400" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">07 84 97 64 00</a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManagement;
