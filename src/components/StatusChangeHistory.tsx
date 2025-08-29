import React, { useState, useEffect } from 'react';
import { 
  BookingStatusChange,
  getStatusChangeHistory,
  getBookingStatusByCode,
  getBookingStatusName,
  getBookingStatusColor,
  getBookingStatusIcon
} from '../types/booking-status';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  History,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  User,
  MessageSquare,
  ArrowRight,
  Clock
} from 'lucide-react';

interface StatusChangeWithDetails extends BookingStatusChange {
  fromStatus?: {
    code: string;
    name: string;
    color: string;
    icon: string;
  };
  toStatus: {
    code: string;
    name: string;
    color: string;
    icon: string;
  };
  bookingDetails?: {
    parentName: string;
    serviceType: string;
    requestedDate: string;
  };
}

const StatusChangeHistory: React.FC = () => {
  const [changes, setChanges] = useState<StatusChangeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Charger l'historique des changements
  const loadStatusChanges = async () => {
    try {
      setLoading(true);
      
      // Récupérer tous les changements de statut
      const { data: changesData, error: changesError } = await supabase
        .from('booking_status_changes')
        .select(`
          *,
          from_status:from_status_id(*),
          to_status:to_status_id(*)
        `)
        .order('changed_at', { ascending: false });

      if (changesError) {
        console.error('Erreur lors du chargement des changements:', changesError);
        return;
      }

      // Récupérer les détails des réservations pour chaque changement
      const changesWithDetails = await Promise.all(
        (changesData || []).map(async (change) => {
          const { data: bookingData } = await supabase
            .from('booking_requests')
            .select('parent_name, service_type, requested_date')
            .eq('id', change.booking_request_id)
            .single();

          return {
            ...change,
            fromStatus: change.from_status_id ? {
              code: change.from_status?.code || 'unknown',
              name: change.from_status?.name || 'Statut inconnu',
              color: change.from_status?.color || '#6B7280',
              icon: change.from_status?.icon || 'help-circle'
            } : undefined,
            toStatus: {
              code: change.to_status?.code || 'unknown',
              name: change.to_status?.name || 'Statut inconnu',
              color: change.to_status?.color || '#6B7280',
              icon: change.to_status?.icon || 'help-circle'
            },
            bookingDetails: bookingData || {
              parentName: 'Client inconnu',
              serviceType: 'Service inconnu',
              requestedDate: 'Date inconnue'
            }
          };
        })
      );

      setChanges(changesWithDetails);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les changements
  const filteredChanges = changes.filter(change => {
    const matchesSearch = 
      change.bookingDetails?.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.bookingDetails?.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.changedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (change.notes && change.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || 
      change.toStatus.code === selectedStatus ||
      (change.fromStatus && change.fromStatus.code === selectedStatus);
    
    const matchesUser = selectedUser === 'all' || change.changedBy === selectedUser;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const changeDate = new Date(change.changed_at);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      switch (dateFilter) {
        case 'today':
          return changeDate.toDateString() === today.toDateString();
        case 'yesterday':
          return changeDate.toDateString() === yesterday.toDateString();
        case 'last_week':
          return changeDate >= lastWeek;
        case 'last_month':
          return changeDate >= lastMonth;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesUser && matchesDate;
  });

  // Obtenir la liste unique des utilisateurs
  const uniqueUsers = Array.from(new Set(changes.map(change => change.changedBy))).sort();

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir l'icône pour un statut
  const getStatusIcon = (statusCode: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'nouvelle': <Clock className="w-4 h-4" />,
      'acceptee': <Clock className="w-4 h-4" />,
      'confirmee': <Clock className="w-4 h-4" />,
      'en_cours': <Clock className="w-4 h-4" />,
      'terminee': <Clock className="w-4 h-4" />,
      'annulee': <Clock className="w-4 h-4" />,
      'archivée': <Clock className="w-4 h-4" />,
      'supprimee': <Clock className="w-4 h-4" />
    };
    
    return iconMap[statusCode] || <Clock className="w-4 h-4" />;
  };

  // Charger les données au montage
  useEffect(() => {
    loadStatusChanges();
  }, []);

  // Rafraîchir les données
  const handleRefresh = () => {
    loadStatusChanges();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Historique des Changements de Statut
          </h1>
          <p className="text-gray-600 mt-2">
            Suivre tous les changements de statut des réservations
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Client, service, utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status-filter">Statut</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="nouvelle">Nouvelle réservation</SelectItem>
                  <SelectItem value="acceptee">Réservation acceptée</SelectItem>
                  <SelectItem value="confirmee">Réservation confirmée</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="terminee">Terminée</SelectItem>
                  <SelectItem value="annulee">Annulée</SelectItem>
                  <SelectItem value="archivée">Archivée</SelectItem>
                  <SelectItem value="supprimee">Supprimée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="user-filter">Utilisateur</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les utilisateurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les utilisateurs</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date-filter">Période</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les périodes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="yesterday">Hier</SelectItem>
                  <SelectItem value="last_week">Cette semaine</SelectItem>
                  <SelectItem value="last_month">Ce mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{filteredChanges.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">
              Changements filtrés
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">
                {Array.from(new Set(filteredChanges.map(c => c.changedBy))).length}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Utilisateurs actifs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">
                {filteredChanges.filter(c => c.notes).length}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Avec notes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">
                {filteredChanges.length > 0 ? 
                  formatDate(filteredChanges[0].changed_at).split(' ')[0] : 
                  'N/A'
                }
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Dernier changement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des changements */}
      <Card>
        <CardHeader>
          <CardTitle>
            Changements de Statut ({filteredChanges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-600 mt-2">Chargement de l'historique...</p>
            </div>
          ) : filteredChanges.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Aucun changement de statut trouvé</p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredChanges.map((change) => (
                  <div
                    key={change.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* En-tête avec transition de statut */}
                        <div className="flex items-center gap-3 mb-3">
                          {change.fromStatus ? (
                            <>
                              <Badge 
                                variant="secondary"
                                className="flex items-center gap-2"
                                style={{ 
                                  backgroundColor: `${change.fromStatus.color}20`,
                                  color: change.fromStatus.color,
                                  borderColor: change.fromStatus.color
                                }}
                              >
                                {getStatusIcon(change.fromStatus.code)}
                                {change.fromStatus.name}
                              </Badge>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">Statut initial</span>
                          )}
                          
                          <Badge 
                            variant="secondary"
                            className="flex items-center gap-2"
                            style={{ 
                              backgroundColor: `${change.toStatus.color}20`,
                              color: change.toStatus.color,
                              borderColor: change.toStatus.color
                            }}
                          >
                            {getStatusIcon(change.toStatus.code)}
                            {change.toStatus.name}
                          </Badge>
                        </div>
                        
                        {/* Informations de la réservation */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <Label className="text-xs text-gray-500">Client</Label>
                            <p className="font-medium">{change.bookingDetails?.parentName}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Service</Label>
                            <p className="font-medium">{change.bookingDetails?.serviceType}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Date demandée</Label>
                            <p className="font-medium">
                              {change.bookingDetails?.requestedDate ? 
                                new Date(change.bookingDetails.requestedDate).toLocaleDateString('fr-FR') : 
                                'N/A'
                              }
                            </p>
                          </div>
                        </div>
                        
                        {/* Métadonnées du changement */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{change.changedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(change.changed_at)}</span>
                          </div>
                          {change.transitionReason && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>{change.transitionReason}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Notes du changement */}
                        {change.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <Label className="text-xs text-gray-500 mb-1">Notes</Label>
                            <p className="text-sm text-gray-700">{change.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* ID de la réservation */}
                      <div className="ml-4 text-right">
                        <span className="text-xs text-gray-500">
                          #{change.booking_request_id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusChangeHistory;
