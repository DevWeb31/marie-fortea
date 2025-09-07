import React, { useState, useEffect } from 'react';
import { 
  BookingRequest, 
  BookingStatusCode,
  BOOKING_STATUSES,
  getBookingStatusName,
  getBookingStatusColor,
  getBookingStatusIcon,
  formatStatusDisplay
} from '../types/booking-status';
import { supabase } from '../lib/supabase';
import { formatDuration } from '../lib/duration-utils';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  Clock, 
  CheckCircle, 
  CalendarCheck, 
  PlayCircle, 
  CheckSquare, 
  XCircle, 
  Archive, 
  Trash2,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  History
} from 'lucide-react';


interface BookingWithStatus extends BookingRequest {
  statusCode: string;
  statusName: string;
  statusColor: string;
  statusIcon: string;
  statusDescription: string;
}

interface StatusCount {
  code: string;
  name: string;
  color: string;
  icon: string;
  count: number;
}

const AdminBookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<BookingWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithStatus | null>(null);
  const [changeStatusDialog, setChangeStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNotes, setStatusNotes] = useState('');
  const [statusReason, setStatusReason] = useState('');

  // Charger les réservations avec leurs statuts
  const loadBookings = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 DEBUG PROD - Début du chargement des réservations...');
      
      const { data, error } = await supabase
        .from('booking_requests_with_status')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('🔍 DEBUG PROD - Réponse Supabase:', {
        data: data?.length || 0,
        error: error?.message || 'Aucune erreur',
        firstRecord: data?.[0] ? {
          id: data[0].id,
          duration_hours: data[0].duration_hours,
          start_time: data[0].start_time,
          end_time: data[0].end_time
        } : 'Aucune donnée'
      });

      if (error) {
        return;
      }

      // Mapper les données de snake_case vers camelCase
      const mappedBookings = (data || []).map((booking: any) => {
        // DEBUG: Log des données brutes pour la production
        console.log('🔍 DEBUG PROD - Données brutes booking:', {
          id: booking.id,
          parent_name: booking.parent_name,
          start_time: booking.start_time,
          end_time: booking.end_time,
          duration_hours: booking.duration_hours,
          duration_hours_type: typeof booking.duration_hours
        });
        
        return {
          ...booking,
          // Mapper les champs snake_case vers camelCase
          parentName: booking.parent_name,
          parentEmail: booking.parent_email,
          parentPhone: booking.parent_phone,
          parentAddress: booking.parent_address,
          serviceType: booking.service_type,
          requestedDate: booking.requested_date,
          startTime: booking.start_time,
          endTime: booking.end_time,
          durationHours: booking.duration_hours,
        childrenCount: booking.children_count,
        childrenDetails: booking.children_details,
        childrenAges: booking.children_ages,
        specialInstructions: booking.special_instructions,
        emergencyContact: booking.emergency_contact,
        emergencyPhone: booking.emergency_phone,
        preferredContactMethod: booking.preferred_contact_method,
        contactNotes: booking.contact_notes,
        captchaVerified: booking.captcha_verified,
        ipAddress: booking.ip_address,
        userAgent: booking.user_agent,
        utmSource: booking.utm_source,
        utmMedium: booking.utm_medium,
        utmCampaign: booking.utm_campaign,
        estimatedTotal: booking.estimated_total, // Mapper le prix estimé
        deletedAt: booking.deleted_at,
        archivedAt: booking.archived_at,
        statusCode: booking.status_code,
        statusName: booking.status_name,
        statusColor: booking.status_color,
        statusIcon: booking.status_icon,
        statusDescription: booking.status_description,
        serviceName: booking.service_name,
        basePrice: booking.base_price
        };
      });

      setBookings(mappedBookings);
    } catch (error) {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  // Charger les compteurs par statut
  const loadStatusCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_status_overview')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        return;
      }

      setStatusCounts(data || []);
    } catch (error) {
      // Erreur silencieuse
    }
  };

  // Filtrer les réservations
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = selectedStatus === 'all' || booking.statusCode === selectedStatus;
    const matchesSearch = 
      booking.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.parentPhone.includes(searchTerm) ||
      booking.parentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Obtenir l'icône pour un statut
  const getStatusIcon = (statusCode: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'nouvelle': <Clock className="w-4 h-4" />,
      'acceptee': <CheckCircle className="w-4 h-4" />,
      'confirmee': <CalendarCheck className="w-4 h-4" />,
      'en_cours': <PlayCircle className="w-4 h-4" />,
      'terminee': <CheckSquare className="w-4 h-4" />,
      'annulee': <XCircle className="w-4 h-4" />,
      'archivée': <Archive className="w-4 h-4" />,
      'supprimee': <Trash2 className="w-4 h-4" />
    };
    
    return iconMap[statusCode] || <Clock className="w-4 h-4" />;
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Formater l'heure
  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  // Charger les données au montage
  useEffect(() => {
    loadBookings();
    loadStatusCounts();
  }, []);

  // Rafraîchir les données
  const handleRefresh = () => {
    loadBookings();
    loadStatusCounts();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Réservations
          </h1>
          <p className="text-gray-600 mt-2">
            Gérer le statut et le suivi de toutes les réservations
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Vue d'ensemble des statuts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Vue d'ensemble des statuts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {statusCounts.map((status) => (
              <div
                key={status.code}
                className={`text-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedStatus === status.code 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedStatus(status.code === selectedStatus ? 'all' : status.code)}
              >
                <div className="flex items-center justify-center mb-2">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: status.color }}
                  />
                  {getStatusIcon(status.code)}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {status.count}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {status.name}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Nom, téléphone, email ou service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="status-filter">Statut</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {BOOKING_STATUSES.map((status) => (
                    <SelectItem key={status.code} value={status.code}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des réservations */}
      <Card>
        <CardHeader>
          <CardTitle>
            Réservations ({filteredBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-600 mt-2">Chargement des réservations...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucune réservation trouvée</p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge 
                            variant="secondary"
                            className="flex items-center gap-2"
                            style={{ 
                              backgroundColor: `${booking.statusColor}20`,
                              color: booking.statusColor,
                              borderColor: booking.statusColor
                            }}
                          >
                            {getStatusIcon(booking.statusCode)}
                            {booking.statusName}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            #{booking.id.slice(0, 8)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <Label className="text-xs text-gray-500">Client</Label>
                            <p className="font-medium">{booking.parentName}</p>
                            <p className="text-sm text-gray-600">{booking.parentPhone}</p>
                            {booking.parentEmail && (
                              <p className="text-sm text-gray-600">{booking.parentEmail}</p>
                            )}
                          </div>
                          
                          <div>
                            <Label className="text-xs text-gray-500">Service</Label>
                            <p className="font-medium">{booking.serviceType}</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(booking.requestedDate)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Durée: {formatDuration(booking.durationHours)}
                              {/* DEBUG PROD */}
                              <span className="text-xs text-red-500 ml-2">
                                [DEBUG: {booking.durationHours}]
                              </span>
                            </p>
                            {booking.estimatedTotal && (
                              <p className="text-sm font-medium text-green-600">
                                {booking.estimatedTotal.toFixed(2)}€
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <Label className="text-xs text-gray-500">Enfants</Label>
                            <p className="font-medium">{booking.childrenCount} enfant(s)</p>
                            <p className="text-sm text-gray-600">{booking.childrenDetails}</p>
                          </div>
                          
                          <div>
                            <Label className="text-xs text-gray-500">Créé le</Label>
                            <p className="text-sm text-gray-600">
                              {formatDate(booking.createdAt)}
                            </p>
                            {booking.updatedAt !== booking.createdAt && (
                              <p className="text-xs text-gray-500">
                                Modifié le {formatDate(booking.updatedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setChangeStatusDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Changer statut
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </Card>

      {/* Dialog de changement de statut */}
      <Dialog open={changeStatusDialog} onOpenChange={setChangeStatusDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Changer le statut de la réservation</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <Label>Statut actuel</Label>
                <div className="flex items-center gap-2 mt-1 p-2 bg-gray-50 rounded">
                  {getStatusIcon(selectedBooking.statusCode)}
                  <span className="font-medium">{selectedBooking.statusName}</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="new-status">Nouveau statut</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOKING_STATUSES
                      .filter(status => status.code !== selectedBooking.statusCode)
                      .map((status) => (
                        <SelectItem key={status.code} value={status.code}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: status.color }}
                            />
                            {status.name}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  placeholder="Raison du changement de statut..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setChangeStatusDialog(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Implémenter le changement de statut
                    setChangeStatusDialog(false);
                  }}
                  disabled={!newStatus}
                >
                  Confirmer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de détails de la réservation */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la réservation</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="status">Statut</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Informations client</h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm text-gray-500">Nom</Label>
                        <p className="font-medium">{selectedBooking.parentName}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Téléphone</Label>
                        <p className="font-medium">{selectedBooking.parentPhone}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Email</Label>
                        <p className="font-medium">{selectedBooking.parentEmail || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Adresse</Label>
                        <p className="font-medium">{selectedBooking.parentAddress}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Détails de la réservation</h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm text-gray-500">Service</Label>
                        <p className="font-medium">{selectedBooking.serviceType}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Date</Label>
                        <p className="font-medium">{formatDate(selectedBooking.requestedDate)}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Horaires</Label>
                        <p className="font-medium">
                          {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Durée</Label>
                        <p className="font-medium">
                          {formatDuration(selectedBooking.durationHours)}
                          {/* DEBUG PROD */}
                          <span className="text-xs text-red-500 ml-2">
                            [DEBUG: {selectedBooking.durationHours}]
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3">Informations sur les enfants</h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm text-gray-500">Nombre d'enfants</Label>
                      <p className="font-medium">{selectedBooking.childrenCount}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Détails</Label>
                      <p className="font-medium">{selectedBooking.childrenDetails}</p>
                    </div>
                    {selectedBooking.childrenAges && (
                      <div>
                        <Label className="text-sm text-gray-500">Âges</Label>
                        <p className="font-medium">{selectedBooking.childrenAges}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedBooking.specialInstructions && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Instructions spéciales</h3>
                      <p className="text-gray-700">{selectedBooking.specialInstructions}</p>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="status" className="space-y-4">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {getStatusIcon(selectedBooking.statusCode)}
                    <h3 className="text-xl font-semibold">{selectedBooking.statusName}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{selectedBooking.statusDescription}</p>
                  <Badge 
                    variant="secondary"
                    className="text-lg px-4 py-2"
                    style={{ 
                      backgroundColor: `${selectedBooking.statusColor}20`,
                      color: selectedBooking.statusColor,
                      borderColor: selectedBooking.statusColor
                    }}
                  >
                    {selectedBooking.statusCode}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <Button
                    onClick={() => {
                      setChangeStatusDialog(true);
                      setSelectedBooking(null);
                    }}
                    className="w-full"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Changer le statut
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Historique des changements de statut</p>
                  <p className="text-sm">Fonctionnalité à implémenter</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookingManager;
