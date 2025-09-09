import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Cookie, Shield, Clock, Database, CheckCircle } from 'lucide-react';

const CookiesPolicy: React.FC = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Politique des Cookies
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-blue-600" />
              Qu'est-ce qu'un cookie ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile 
              lorsque vous visitez notre site web. Les cookies nous aident à améliorer votre 
              expérience de navigation et à mémoriser vos préférences.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Notre engagement :</strong> Nous utilisons uniquement les cookies 
                nécessaires au fonctionnement du site et quelques cookies optionnels pour 
                améliorer votre expérience.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              Types de cookies utilisés
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cookies nécessaires */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
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
              <div className="ml-8 space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ces cookies sont indispensables au bon fonctionnement du site web :
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                  <li>• <strong>Cookies de session :</strong> Maintiennent votre connexion pendant votre visite</li>
                  <li>• <strong>Cookies de sécurité :</strong> Protègent contre les attaques malveillantes</li>
                  <li>• <strong>Cookies de consentement :</strong> Mémorisent vos préférences de cookies</li>
                </ul>
              </div>
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
                      Améliorent votre expérience utilisateur
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Optionnel</Badge>
              </div>
              <div className="ml-8 space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ces cookies mémorisent vos préférences pour améliorer votre expérience :
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                  <li>• <strong>Préférences de thème :</strong> Mode sombre/clair</li>
                  <li>• <strong>Préférences de langue :</strong> Langue d'affichage</li>
                  <li>• <strong>Paramètres d'interface :</strong> Disposition et préférences</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Durée de conservation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Nous appliquons une politique de conservation simple et transparente :
            </p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium text-gray-900 dark:text-white">Cookies de session</span>
                <Badge variant="secondary">Fin de session</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium text-gray-900 dark:text-white">Cookies de préférences</span>
                <Badge variant="secondary">1 an maximum</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium text-gray-900 dark:text-white">Données personnelles</span>
                <Badge variant="secondary">2 mois après garde</Badge>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Politique simple :</strong> Aucune conservation prolongée. 
                Vos données et cookies sont automatiquement supprimés selon les délais indiqués.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              Gestion de vos cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Vous avez le contrôle total sur vos cookies :
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">1</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Bannière de cookies</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Lors de votre première visite, une bannière vous permet d'accepter ou refuser 
                    les cookies optionnels.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">2</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Bouton "Gérer les cookies"</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    En bas à gauche de l'écran, vous pouvez modifier vos préférences à tout moment.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">3</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Paramètres du navigateur</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vous pouvez également gérer les cookies directement dans les paramètres 
                    de votre navigateur.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-red-600" />
              Cookies que nous n'utilisons PAS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Par souci de simplicité et de respect de votre vie privée, nous n'utilisons pas :
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Cookies analytiques</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pas de Google Analytics, pas de suivi de comportement, 
                  pas d'analyse de trafic.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Cookies marketing</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pas de publicité ciblée, pas de retargeting, 
                  pas de partage avec des tiers.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Cookies sociaux</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pas de boutons de partage social, 
                  pas d'intégration avec les réseaux sociaux.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Cookies publicitaires</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pas de publicité, pas de partenaires publicitaires, 
                  pas de monétisation des données.
                </p>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Notre approche :</strong> Nous privilégions la simplicité et le respect 
                de votre vie privée. Seuls les cookies essentiels sont utilisés.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Sécurité et protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Vos données et cookies sont protégés par :
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Chiffrement</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Toutes les données sont chiffrées en transit et au repos
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Accès sécurisé</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Authentification sécurisée et contrôle d'accès
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Suppression automatique</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nettoyage automatique des données expirées
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Audit régulier</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Surveillance et audit des accès aux données
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-indigo-600" />
              Contact et questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Si vous avez des questions sur notre utilisation des cookies :
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Nous contacter</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Responsable technique :</strong> Damien Oriente</p>
                  <p><strong>Société :</strong> <a href="https://www.devweb31.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">DevWeb31</a></p>
                  <p><strong>Email :</strong> contact@devweb31.fr</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Liens utiles</h4>
                <div className="space-y-2 text-sm">
                  <a 
                    href="/privacy-policy" 
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block"
                  >
                    Politique de confidentialité
                  </a>
                  <a 
                    href="/data-management" 
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block"
                  >
                    Gestion des données personnelles
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note :</strong> Cette politique des cookies peut être mise à jour 
                pour refléter les changements dans nos pratiques. Nous vous informerons 
                de tout changement significatif.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookiesPolicy;
