import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Calendar,
  Users,
  TrendingUp,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import AdminBookingManager from './AdminBookingManager';
import BookingKanbanBoard from './BookingKanbanBoard';
import StatusChangeHistory from './StatusChangeHistory';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Données de démonstration pour le tableau de bord
  const dashboardStats = {
    totalBookings: 156,
    newBookings: 23,
    confirmedBookings: 89,
    completedBookings: 34,
    pendingActions: 12,
    thisWeek: 45,
    thisMonth: 189,
    averageResponseTime: '2.3h'
  };

  const recentActivity = [
    { id: 1, type: 'status_change', message: 'Réservation #1234 passée en "Confirmée"', time: '2 min', status: 'success' },
    { id: 2, type: 'new_booking', message: 'Nouvelle réservation de Marie Dupont', time: '15 min', status: 'info' },
    { id: 3, type: 'status_change', message: 'Réservation #1230 passée en "Terminée"', time: '1h', status: 'success' },
    { id: 4, type: 'reminder', message: 'Rappel: 3 réservations demain', time: '2h', status: 'warning' },
    { id: 5, type: 'status_change', message: 'Réservation #1228 annulée', time: '3h', status: 'error' }
  ];

  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'success': <CheckCircle className="w-4 h-4 text-green-500" />,
      'info': <Clock className="w-4 h-4 text-blue-500" />,
      'warning': <AlertCircle className="w-4 h-4 text-yellow-500" />,
      'error': <AlertCircle className="w-4 h-4 text-red-500" />
    };
    return iconMap[status] || <Clock className="w-4 h-4 text-gray-500" />;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'success': 'text-green-600',
      'info': 'text-blue-600',
      'warning': 'text-yellow-600',
      'error': 'text-red-600'
    };
    return colorMap[status] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête principal */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex flex-col space-y-2 sm:space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                Tableau de Bord d'Administration
              </h1>
              <p className="text-gray-600 mt-1 text-xs sm:text-sm lg:text-base truncate">
                Gestion des réservations et suivi des activités
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:p-3 sm:gap-3 flex-shrink-0">
              <Badge variant="secondary" className="text-xs sm:text-sm justify-center px-2 sm:px-3 py-1">
                <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="hidden lg:inline">Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</span>
                <span className="hidden sm:inline lg:hidden">Mise à jour: {new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</span>
                <span className="sm:hidden">Mise à jour: {new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</span>
              </Badge>
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm text-center">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Paramètres</span>
                <span className="sm:hidden">Config</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {/* Navigation mobile - scrollable horizontal */}
          <div className="block sm:hidden">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <BarChart3 className="w-5 h-5" />
                  <span>Vue</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Calendar className="w-5 h-5" />
                  <span>Réserv.</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('kanban')}
                className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'kanban'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <BarChart3 className="w-5 h-5" />
                  <span>Kanban</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Clock className="w-5 h-5" />
                  <span>Hist.</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('test')}
                className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'test'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Settings className="w-5 h-5" />
                  <span>Test</span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Navigation desktop - grille classique */}
          <div className="hidden sm:block">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2">
              <TabsTrigger value="overview" className="flex items-center justify-center gap-2 text-sm px-3 py-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>Vue d'ensemble</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center justify-center gap-2 text-sm px-3 py-2.5">
                <Calendar className="w-4 h-4" />
                <span>Réservations</span>
              </TabsTrigger>
              <TabsTrigger value="kanban" className="flex items-center justify-center gap-2 text-sm px-3 py-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>Kanban</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center justify-center gap-2 text-sm px-3 py-2.5">
                <Clock className="w-4 h-4" />
                <span>Historique</span>
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center justify-center gap-2 text-sm px-3 py-2.5">
                <Settings className="w-4 h-4" />
                <span>Test</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Réservations</CardTitle>
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="text-xl sm:text-2xl font-bold">{dashboardStats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    +{dashboardStats.thisMonth} ce mois
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">Nouvelles</CardTitle>
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="text-2xl font-bold text-yellow-600">{dashboardStats.newBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    En attente de traitement
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">Confirmées</CardTitle>
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="text-2xl font-bold text-green-600">{dashboardStats.confirmedBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    Prêtes pour exécution
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">Terminées</CardTitle>
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="text-2xl font-bold text-blue-600">{dashboardStats.completedBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    Ce mois
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Graphiques et métriques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-sm sm:text-base">Activité Récente</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-2 sm:space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50">
                        {getStatusIcon(activity.status)}
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-sm sm:text-base">Métriques de Performance</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-2 sm:space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Temps de réponse moyen</span>
                      <span className="text-base sm:text-lg font-semibold">{dashboardStats.averageResponseTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Réservations cette semaine</span>
                      <span className="text-base sm:text-lg font-semibold">{dashboardStats.thisWeek}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Actions en attente</span>
                      <span className="text-base sm:text-lg font-semibold text-orange-600">{dashboardStats.pendingActions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Taux de confirmation</span>
                      <span className="text-base sm:text-lg font-semibold text-green-600">
                        {Math.round((dashboardStats.confirmedBookings / dashboardStats.totalBookings) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-sm sm:text-base">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <Button 
                    variant="outline" 
                    className="h-14 sm:h-16 lg:h-20 flex-col"
                    onClick={() => setActiveTab('bookings')}
                  >
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mb-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-center">Gérer les réservations</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-14 sm:h-16 lg:h-20 flex-col"
                    onClick={() => setActiveTab('kanban')}
                  >
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mb-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-center">Vue Kanban</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-14 sm:h-16 lg:h-20 flex-col"
                    onClick={() => setActiveTab('history')}
                  >
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mb-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-center">Historique</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-14 sm:h-16 lg:h-20 flex-col"
                  >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mb-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-center">Clients</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Réservations */}
          <TabsContent value="bookings" className="space-y-6">
            <AdminBookingManager />
          </TabsContent>

          {/* Onglet Kanban */}
          <TabsContent value="kanban" className="space-y-6">
            <BookingKanbanBoard />
          </TabsContent>

          {/* Onglet Historique */}
          <TabsContent value="history" className="space-y-6">
            <StatusChangeHistory />
          </TabsContent>

          {/* Onglet Test */}
          <TabsContent value="test" className="space-y-6">
            <div className="text-center text-gray-500">
              Composant de test supprimé
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
