import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3,
  Settings,
  Workflow,
  History,
  Eye,
  RefreshCw,
  Info,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BookingStatusDashboard from './BookingStatusDashboard';
import BookingStatusManager from './BookingStatusManager';
import StatusTransitionWorkflow from './StatusTransitionWorkflow';

interface BookingStatusManagementProps {
  className?: string;
}

const BookingStatusManagement: React.FC<BookingStatusManagementProps> = ({ 
  className = '' 
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  // Fonction pour rafraîchir tous les composants
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast({
      title: 'Actualisation',
      description: 'Tous les composants ont été actualisés',
    });
  };

  // Fonction appelée lors d'un changement de statut
  const handleStatusChange = () => {
    toast({
      title: 'Statut mis à jour',
      description: 'Le statut a été modifié avec succès',
    });
    // Rafraîchir les composants
    handleRefresh();
  };

  // Fonction appelée lors de la completion d'une transition
  const handleTransitionComplete = () => {
    toast({
      title: 'Transition terminée',
      description: 'Le workflow de transition a été exécuté avec succès',
    });
    // Rafraîchir les composants
    handleRefresh();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête principal */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Gestion des Statuts de Réservation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Interface complète pour gérer le cycle de vie des réservations
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Tableau de Bord</span>
          </TabsTrigger>
          <TabsTrigger value="manager" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Gestionnaire</span>
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center space-x-2">
            <Workflow className="h-4 w-4" />
            <span>Workflow</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>Historique</span>
          </TabsTrigger>
        </TabsList>

        {/* Contenu du tableau de bord */}
        <TabsContent value="dashboard" className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Vue d'ensemble des Statuts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BookingStatusDashboard 
                key={refreshKey}
                onStatusChange={handleStatusChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contenu du gestionnaire de statuts */}
        <TabsContent value="manager" className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Gestionnaire des Statuts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BookingStatusManager 
                key={refreshKey}
                onStatusChange={handleStatusChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contenu du workflow de transition */}
        <TabsContent value="workflow" className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Workflow className="h-5 w-5" />
                <span>Workflow de Transition</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 dark:text-blue-100">
                        Workflow de Transition des Statuts
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                        Ce composant permet de gérer les transitions de statut avec un workflow guidé, 
                        incluant la validation, l'approbation administrative et l'exécution des actions automatiques.
                      </p>
                    </div>
                  </div>
                </div>

                <StatusTransitionWorkflow 
                  key={refreshKey}
                  onTransitionComplete={handleTransitionComplete}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contenu de l'historique */}
        <TabsContent value="history" className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Historique des Changements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Eye className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        Historique des Changements de Statut
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Consultez l'historique complet de tous les changements de statut, 
                        avec les détails des transitions, les raisons et les utilisateurs impliqués.
                      </p>
                    </div>
                  </div>
                </div>

                {/* TODO: Implémenter le composant d'historique */}
                <div className="text-center py-12 text-gray-500">
                  <History className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Historique des Changements</h3>
                  <p className="text-sm">
                    Ce composant sera implémenté pour afficher l'historique complet des transitions de statut.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Informations sur le système */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>Informations sur le Système de Statuts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Statuts Disponibles
              </h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• <strong>Nouvelle</strong> : Demande initiale reçue</p>
                <p>• <strong>Acceptée</strong> : Validée par l'administrateur</p>
                <p>• <strong>Confirmée</strong> : Confirmée par le client</p>
                <p>• <strong>En cours</strong> : En cours d'exécution</p>
                <p>• <strong>Terminée</strong> : Réservation terminée</p>
                <p>• <strong>Annulée</strong> : Annulée par le client ou l'admin</p>
                <p>• <strong>Archivée</strong> : Conservée pour référence</p>
                <p>• <strong>Supprimée</strong> : Supprimée (soft delete)</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Fonctionnalités Clés
              </h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• <strong>Workflow guidé</strong> pour les transitions</p>
                <p>• <strong>Validation automatique</strong> des règles métier</p>
                <p>• <strong>Approbation administrative</strong> si requise</p>
                <p>• <strong>Traçabilité complète</strong> des changements</p>
                <p>• <strong>Actions automatiques</strong> lors des transitions</p>
                <p>• <strong>Métriques et tableaux de bord</strong> en temps réel</p>
                <p>• <strong>Gestion des archives</strong> et de la corbeille</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                  Note d'Implémentation
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                  Cette interface utilise actuellement des données simulées. Pour une utilisation en production, 
                  il faudra implémenter les appels API vers Supabase et connecter les composants aux vraies données.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingStatusManagement;
