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
import StatusTestComponent from './StatusTestComponent';

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
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de Bord d'Administration
              </h1>
              <p className="text-gray-600 mt-1">
                Gestion des réservations et suivi des activités
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                <Clock className="w-3 h-3 mr-1" />
                Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Réservations
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Historique
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Test
            </TabsTrigger>
          </TabsList>

          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Réservations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    +{dashboardStats.thisMonth} ce mois
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nouvelles</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{dashboardStats.newBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    En attente de traitement
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confirmées</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{dashboardStats.confirmedBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    Prêtes pour exécution
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Terminées</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{dashboardStats.completedBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    Ce mois
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Graphiques et métriques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activité Récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
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
                <CardHeader>
                  <CardTitle>Métriques de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Temps de réponse moyen</span>
                      <span className="text-lg font-semibold">{dashboardStats.averageResponseTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Réservations cette semaine</span>
                      <span className="text-lg font-semibold">{dashboardStats.thisWeek}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Actions en attente</span>
                      <span className="text-lg font-semibold text-orange-600">{dashboardStats.pendingActions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Taux de confirmation</span>
                      <span className="text-lg font-semibold text-green-600">
                        {Math.round((dashboardStats.confirmedBookings / dashboardStats.totalBookings) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setActiveTab('bookings')}
                  >
                    <Calendar className="w-6 h-6 mb-2" />
                    <span className="text-sm">Gérer les réservations</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setActiveTab('kanban')}
                  >
                    <BarChart3 className="w-6 h-6 mb-2" />
                    <span className="text-sm">Vue Kanban</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setActiveTab('history')}
                  >
                    <Clock className="w-6 h-6 mb-2" />
                    <span className="text-sm">Historique</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                  >
                    <Users className="w-6 h-6 mb-2" />
                    <span className="text-sm">Clients</span>
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
            <StatusTestComponent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
