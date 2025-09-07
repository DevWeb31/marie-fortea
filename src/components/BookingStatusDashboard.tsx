import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  CalendarCheck,
  PlayCircle,
  CheckSquare,
  XCircle,
  Archive,
  Trash2,
  AlertCircle,
  BarChart3,
  RefreshCw,
  Filter,
  Download,
  Eye,
  Plus,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react';
import { 
  BookingRequestSummary, 
  BookingStatusCode,
  formatBookingStatus, 
  getStatusColor,
  BOOKING_STATUSES 
} from '@/types/booking';

interface BookingStatusDashboardProps {
  className?: string;
  onStatusChange?: () => void;
}

interface StatusMetrics {
  statusCode: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  color: string;
  icon: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
}

const BookingStatusDashboard: React.FC<BookingStatusDashboardProps> = ({ 
  className = '',
  onStatusChange 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [statusMetrics, setStatusMetrics] = useState<StatusMetrics[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Charger les métriques des statuts
  useEffect(() => {
    loadStatusMetrics();
  }, []);

  const loadStatusMetrics = async () => {
    setIsLoading(true);
    try {
      // TODO: Implémenter l'appel à l'API pour récupérer les vraies métriques
      // Pour l'instant, on simule des données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMetrics: StatusMetrics[] = [
        {
          statusCode: 'nouvelle',
          count: 12,
          percentage: 24,
          trend: 'up',
          trendValue: 8,
          color: '#F59E0B',
          icon: 'clock'
        },
        {
          statusCode: 'acceptee',
          count: 8,
          percentage: 16,
          trend: 'stable',
          trendValue: 0,
          color: '#3B82F6',
          icon: 'check-circle'
        },
        {
          statusCode: 'confirmee',
          count: 15,
          percentage: 30,
          trend: 'up',
          trendValue: 12,
          color: '#10B981',
          icon: 'calendar-check'
        },
        {
          statusCode: 'en_cours',
          count: 3,
          percentage: 6,
          trend: 'down',
          trendValue: -2,
          color: '#8B5CF6',
          icon: 'play-circle'
        },
        {
          statusCode: 'terminee',
          count: 10,
          percentage: 20,
          trend: 'up',
          trendValue: 5,
          color: '#6B7280',
          icon: 'check-square'
        },
        {
          statusCode: 'annulee',
          count: 2,
          percentage: 4,
          trend: 'down',
          trendValue: -1,
          color: '#EF4444',
          icon: 'x-circle'
        }
      ];
      
      setStatusMetrics(mockMetrics);
      setTotalBookings(mockMetrics.reduce((sum, metric) => sum + metric.count, 0));
      
      // Simuler l'activité récente
      setRecentActivity([
        {
          id: '1',
          action: 'Statut mis à jour',
          details: 'Réservation #1234 → Confirmée',
          timestamp: new Date().toISOString(),
          user: 'Admin'
        },
        {
          id: '2',
          action: 'Nouvelle réservation',
          details: 'Marie Dupont - Mariage 15/02/2025',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          user: 'Système'
        }
      ]);
      
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement des métriques',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Obtenir l'icône pour un statut
  const getStatusIcon = (iconName: string) => {
    switch (iconName) {
      case 'clock': return <Clock className="h-4 w-4" />;
      case 'check-circle': return <CheckCircle className="h-4 w-4" />;
      case 'calendar-check': return <CalendarCheck className="h-4 w-4" />;
      case 'play-circle': return <PlayCircle className="h-4 w-4" />;
      case 'check-square': return <CheckSquare className="h-4 w-4" />;
      case 'x-circle': return <XCircle className="h-4 w-4" />;
      case 'archive': return <Archive className="h-4 w-4" />;
      case 'trash-2': return <Trash2 className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Obtenir la couleur pour un statut
  const getStatusColorClass = (statusCode: string): string => {
    const status = BOOKING_STATUSES.find(s => s.code === statusCode);
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const colorMap: Record<string, string> = {
      '#F59E0B': 'bg-yellow-100 text-yellow-800',
      '#3B82F6': 'bg-blue-100 text-blue-800',
      '#10B981': 'bg-green-100 text-green-800',
      '#8B5CF6': 'bg-purple-100 text-purple-800',
      '#6B7280': 'bg-gray-100 text-gray-800',
      '#EF4444': 'bg-red-100 text-red-800',
      '#9CA3AF': 'bg-gray-100 text-gray-600',
      '#374151': 'bg-gray-100 text-gray-900'
    };
    
    return colorMap[status.color] || 'bg-gray-100 text-gray-800';
  };

  // Actions rapides
  const quickActions: QuickAction[] = [
    {
      id: 'bulk-accept',
      title: 'Accepter en lot',
      description: 'Accepter plusieurs réservations en attente',
      icon: <CheckCircle className="h-5 w-5" />,
      action: () => {
        toast({
          title: 'Action en lot',
          description: 'Fonctionnalité d\'acceptation en lot à implémenter',
        });
      },
      variant: 'default'
    },
    {
      id: 'export-data',
      title: 'Exporter les données',
      description: 'Télécharger un rapport des réservations',
      icon: <Download className="h-5 w-5" />,
      action: () => {
        toast({
          title: 'Export',
          description: 'Fonctionnalité d\'export à implémenter',
        });
      },
      variant: 'outline'
    },
    {
      id: 'view-archived',
      title: 'Voir les archives',
      description: 'Consulter les réservations archivées',
      icon: <Archive className="h-5 w-5" />,
      action: () => {
        toast({
          title: 'Archives',
          description: 'Navigation vers les archives à implémenter',
        });
      },
      variant: 'secondary'
    }
  ];

  // Formater le pourcentage de tendance
  const formatTrend = (trend: 'up' | 'down' | 'stable', value: number) => {
    if (trend === 'stable') return '0%';
    const sign = trend === 'up' ? '+' : '';
    return `${sign}${value}%`;
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec actions rapides */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Tableau de Bord des Réservations
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Vue d'ensemble des statuts et métriques
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={loadStatusMetrics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Réservations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusMetrics.find(m => m.statusCode === 'nouvelle')?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Réservations à traiter
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmées</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusMetrics.find(m => m.statusCode === 'confirmee')?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Prêtes pour exécution
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              +5% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Répartition des statuts */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Répartition par Statut</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusMetrics.map((metric) => (
              <div key={metric.statusCode} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getStatusColorClass(metric.statusCode)}`}>
                      {getStatusIcon(metric.icon)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {formatBookingStatus(metric.statusCode)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {metric.count} réservation{metric.count > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{metric.percentage}%</p>
                      <div className="flex items-center space-x-1">
                        {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                        {metric.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                        {metric.trend === 'stable' && <div className="h-3 w-3 text-gray-400">—</div>}
                        <span className={`text-xs ${
                          metric.trend === 'up' ? 'text-green-500' : 
                          metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          {formatTrend(metric.trend, metric.trendValue)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Progress value={metric.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Actions Rapides</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-start space-y-2"
                onClick={action.action}
              >
                <div className="flex items-center space-x-2">
                  {action.icon}
                  <span className="font-medium">{action.title}</span>
                </div>
                <p className="text-xs text-left opacity-80">
                  {action.description}
                </p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Activité Récente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-xl">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Eye className="h-4 w-4 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.details}</p>
                  <p className="text-xs text-gray-400">
                    par {activity.user} • {new Date(activity.timestamp).toLocaleString('fr-FR')}
                  </p>
                </div>
                
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {recentActivity.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>Aucune activité récente</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingStatusDashboard;
