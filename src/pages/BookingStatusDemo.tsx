import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Info,
  BookOpen,
  Code,
  ExternalLink,
  Github
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingStatusManagement from '@/components/BookingStatusManagement';

const BookingStatusDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* En-tête de navigation */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Démo - Gestion des Statuts
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Version Beta
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>Interface de Gestion des Statuts de Réservation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Cette démonstration présente une interface complète pour gérer les différents statuts 
                  d'une réservation dans le back-office. L'interface inclut :
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                      Fonctionnalités Principales
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• <strong>Tableau de bord</strong> avec métriques en temps réel</li>
                      <li>• <strong>Gestionnaire de statuts</strong> avec workflow visuel</li>
                      <li>• <strong>Workflow de transition</strong> guidé et validé</li>
                      <li>• <strong>Historique complet</strong> des changements</li>
                      <li>• <strong>Transitions autorisées</strong> avec règles métier</li>
                      <li>• <strong>Approbation administrative</strong> si requise</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                      Statuts Disponibles
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Badge variant="outline" className="text-xs">Nouvelle</Badge>
                      <Badge variant="outline" className="text-xs">Acceptée</Badge>
                      <Badge variant="outline" className="text-xs">Confirmée</Badge>
                      <Badge variant="outline" className="text-xs">En cours</Badge>
                      <Badge variant="outline" className="text-xs">Terminée</Badge>
                      <Badge variant="outline" className="text-xs">Annulée</Badge>
                      <Badge variant="outline" className="text-xs">Archivée</Badge>
                      <Badge variant="outline" className="text-xs">Supprimée</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documentation technique */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Documentation Technique</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Architecture des Composants
                  </h4>
                  <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <p>• <strong>BookingStatusManagement</strong> : Composant principal avec onglets</p>
                    <p>• <strong>BookingStatusDashboard</strong> : Tableau de bord et métriques</p>
                    <p>• <strong>BookingStatusManager</strong> : Gestion des statuts et transitions</p>
                    <p>• <strong>StatusTransitionWorkflow</strong> : Workflow guidé des transitions</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                    Intégration avec Supabase
                  </h4>
                  <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <p>• Tables : <code>booking_statuses</code>, <code>booking_status_transitions</code></p>
                    <p>• Fonctions : <code>change_booking_status()</code>, <code>get_available_transitions()</code></p>
                    <p>• Triggers : Historique automatique des changements</p>
                    <p>• RLS : Sécurité au niveau des lignes</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                    Workflow de Validation
                  </h4>
                  <div className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                    <p>• <strong>Étape 1</strong> : Validation des données de la réservation</p>
                    <p>• <strong>Étape 2</strong> : Spécification de la raison du changement</p>
                    <p>• <strong>Étape 3</strong> : Ajout de notes optionnelles</p>
                    <p>• <strong>Étape 4</strong> : Approbation administrative si requise</p>
                    <p>• <strong>Étape 5</strong> : Confirmation et exécution</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interface principale */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Interface de Gestion</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BookingStatusManagement />
            </CardContent>
          </Card>
        </div>

        {/* Liens utiles */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ExternalLink className="h-5 w-5" />
                <span>Ressources et Liens</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Documentation
                  </h4>
                  <div className="space-y-2">
                    <a 
                      href="/DATABASE_STRUCTURE.md" 
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Structure de la base de données</span>
                    </a>
                    <a 
                      href="/ENHANCED_STATUS_SYSTEM.md" 
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Système de statuts avancé</span>
                    </a>
                    <a 
                      href="/ADMIN_INTERFACE_GUIDE.md" 
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Guide de l'interface admin</span>
                    </a>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Développement
                  </h4>
                  <div className="space-y-2">
                    <a 
                      href="https://github.com/your-repo/marie-fortea" 
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <Github className="h-4 w-4" />
                      <span>Code source sur GitHub</span>
                    </a>
                    <a 
                      href="/SUPABASE_SETUP.md" 
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Configuration Supabase</span>
                    </a>
                    <a 
                      href="/DEPLOYMENT_GUIDE.md" 
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Guide de déploiement</span>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Note de développement */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>Note de Développement</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                      État Actuel de l'Implémentation
                    </h4>
                    <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                      <p>
                        <strong>✅ Terminé :</strong> Interface utilisateur complète, composants React, 
                        workflow de validation, design responsive
                      </p>
                      <p>
                        <strong>🔄 En cours :</strong> Intégration avec l'API Supabase, 
                        gestion des erreurs, tests unitaires
                      </p>
                      <p>
                        <strong>⏳ À faire :</strong> Composant d'historique, actions automatiques, 
                        notifications en temps réel, export des données
                      </p>
                      <p>
                        <strong>💡 Prochaines étapes :</strong> Connecter les composants aux vraies données, 
                        implémenter la logique métier complète, ajouter la gestion des permissions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BookingStatusDemo;
