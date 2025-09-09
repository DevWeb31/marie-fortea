import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, Database, UserCheck, Mail, Phone, Calendar } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Marie Fortea s'engage à protéger votre vie privée et vos données personnelles. 
              Cette politique de confidentialité explique comment nous collectons, utilisons, 
              stockons et protégeons vos informations personnelles conformément au Règlement 
              Général sur la Protection des Données (RGPD).
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Responsable du traitement :</strong> Marie Fortea<br />
                <strong>Contact :</strong> <a href="mailto:contact@marie-fortea.fr" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">contact@marie-fortea.fr</a><br />
                <strong>Adresse :</strong> 21 route de Toulouse, 31530 Montaigut sur Save
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              Données collectées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Nous collectons uniquement les données nécessaires à la fourniture de nos services de garde d'enfants :
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                  Informations des parents
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Nom et prénom</li>
                  <li>• Adresse email</li>
                  <li>• Numéro de téléphone</li>
                  <li>• Adresse postale</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Informations de réservation
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Dates et heures de garde</li>
                  <li>• Type de service demandé</li>
                  <li>• Instructions spéciales</li>
                  <li>• Contact d'urgence</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Eye className="h-4 w-4 text-orange-600" />
                Informations des enfants
              </h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Noms et âges</li>
                <li>• Allergies et conditions médicales</li>
                <li>• Préférences alimentaires</li>
                <li>• Besoins spéciaux</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note importante :</strong> Nous ne collectons jamais de données sensibles 
                sans votre consentement explicite et nous ne partageons jamais vos informations 
                avec des tiers sans votre autorisation.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-indigo-600" />
              Finalités du traitement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Vos données personnelles sont utilisées exclusivement pour :
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">1</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Gestion des réservations</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Traitement de vos demandes de garde d'enfants et organisation des services
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">2</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Communication</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vous contacter pour confirmer les réservations et vous informer des changements
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">3</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Sécurité</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Assurer la sécurité et le bien-être des enfants confiés
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">4</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Obligations légales</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Respecter les obligations légales en matière de garde d'enfants
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Base légale du traitement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Exécution du contrat
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Les données nécessaires à la fourniture du service de garde d'enfants
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Consentement
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Pour le traitement des données sensibles (santé des enfants)
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  Intérêt légitime
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Pour la sécurité et la communication avec les parents
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                  Obligation légale
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Respect des réglementations en matière de garde d'enfants
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-gray-600" />
              Conservation des données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium text-gray-900 dark:text-white">Données de réservation</span>
                <Badge variant="secondary">2 mois après la fin de garde</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium text-gray-900 dark:text-white">Données de contact</span>
                <Badge variant="secondary">2 mois après la dernière prestation</Badge>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Politique simple :</strong> Vos données sont automatiquement supprimées 2 mois après la fin de la garde. 
                Aucune conservation prolongée, aucune complexité.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              Vos droits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Droit d'accès</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Consulter vos données</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Obtenir une copie de toutes vos données personnelles
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Droit de rectification</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Corriger vos données</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Demander la correction de données inexactes
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Droit à l'effacement</Badge>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Supprimer vos données</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Demander la suppression immédiate de vos données
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Pour exercer vos droits :</strong> Contactez-nous à{' '}
                <a href="mailto:contact@marie-fortea.fr" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
                  contact@marie-fortea.fr
                </a>{' '}
                ou utilisez les fonctionnalités disponibles dans votre espace client.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Sécurité des données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Nous mettons en place des mesures techniques et organisationnelles appropriées pour protéger vos données :
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Mesures techniques</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Chiffrement des données en transit et au repos</li>
                  <li>• Authentification sécurisée</li>
                  <li>• Contrôle d'accès basé sur les rôles</li>
                  <li>• Sauvegardes régulières</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Mesures organisationnelles</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Formation du personnel à la protection des données</li>
                  <li>• Accès limité aux données personnelles</li>
                  <li>• Audit régulier des accès</li>
                  <li>• Procédures de gestion des incidents</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-purple-600" />
              Contact et réclamations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Nous contacter</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Email :</strong> <a href="mailto:contact@marie-fortea.fr" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">contact@marie-fortea.fr</a></p>
                  <p><strong>Téléphone :</strong> <a href="tel:0784976400" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">07 84 97 64 00</a></p>
                  <p><strong>Adresse :</strong> 21 route de Toulouse, 31530 Montaigut sur Save</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Autorité de contrôle</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>Si vous n'êtes pas satisfait de notre réponse, vous pouvez saisir la CNIL :</p>
                  <p><strong>CNIL</strong><br />
                  3 Place de Fontenoy<br />
                  TSA 80715<br />
                  75334 PARIS CEDEX 07</p>
                  <p><strong>Site web :</strong> <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">www.cnil.fr</a></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Modifications de la politique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              Cette politique de confidentialité peut être modifiée pour refléter les changements 
              dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires. 
              Nous vous informerons de tout changement significatif par email ou via notre site web.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
