import React, { useState, useEffect } from 'react';
import { 
  BookingRequest, 
  BOOKING_STATUSES,
  getBookingStatusName,
  getBookingStatusColor,
  getBookingStatusIcon
} from '../types/booking-status';
import { supabase } from '../lib/supabase';
import { formatDuration } from '../lib/duration-utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { 
  Clock, 
  CheckCircle, 
  CalendarCheck, 
  PlayCircle, 
  CheckSquare, 
  XCircle, 
  Archive, 
  Trash2,
  Eye,
  Edit,
  Plus,
  RefreshCw
} from 'lucide-react';


interface BookingWithStatus extends BookingRequest {
  statusCode: string;
  statusName: string;
  statusColor: string;
  statusIcon: string;
  statusDescription: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  icon: React.ReactNode;
  bookings: BookingWithStatus[];
}

const BookingKanbanBoard: React.FC = () => {
  const [bookings, setBookings] = useState<BookingWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithStatus | null>(null);
  const [changeStatusDialog, setChangeStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');

  // Charger les réservations
  const loadBookings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('booking_requests_with_status')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des réservations:', error);
        return;
      }

      // Mapper les données de snake_case vers camelCase
      const mappedBookings = (data || []).map((booking: any) => ({
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
      }));

      setBookings(mappedBookings);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Organiser les réservations par colonne
  const getKanbanColumns = (): KanbanColumn[] => {
    const iconMap: Record<string, React.ReactNode> = {
      'nouvelle': <Clock className="w-5 h-5" />,
      'acceptee': <CheckCircle className="w-5 h-5" />,
      'confirmee': <CalendarCheck className="w-5 h-5" />,
      'en_cours': <PlayCircle className="w-5 h-5" />,
      'terminee': <CheckSquare className="w-5 h-5" />,
      'annulee': <XCircle className="w-5 h-5" />,
      'archivée': <Archive className="w-5 h-5" />,
      'supprimee': <Trash2 className="w-5 h-5" />
    };

    return BOOKING_STATUSES.map(status => ({
      id: status.code,
      title: status.name,
      color: status.color,
      icon: iconMap[status.code] || <Clock className="w-5 h-5" />,
      bookings: bookings.filter(booking => booking.statusCode === status.code)
    }));
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  // Formater l'heure
  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

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

  // Charger les données au montage
  useEffect(() => {
    loadBookings();
  }, []);

  // Rafraîchir les données
  const handleRefresh = () => {
    loadBookings();
  };

  const columns = getKanbanColumns();

  return (
    <div className="p-6 max-w-full mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau Kanban des Réservations
          </h1>
          <p className="text-gray-600 mt-2">
            Visualiser le flux des réservations par statut
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Tableau Kanban */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto text-gray-400" />
          <p className="text-gray-600 mt-4">Chargement du tableau Kanban...</p>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-80"
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    {column.icon}
                    <span className="flex-1">{column.title}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {column.bookings.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-3">
                      {column.bookings.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <div 
                            className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center"
                            style={{ backgroundColor: `${column.color}20` }}
                          >
                            {column.icon}
                          </div>
                          <p className="text-sm">Aucune réservation</p>
                        </div>
                      ) : (
                        column.bookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="border rounded-lg p-3 bg-white hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <div className="space-y-2">
                              {/* En-tête de la carte */}
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant="secondary"
                                    className="text-xs"
                                    style={{ 
                                      backgroundColor: `${column.color}20`,
                                      color: column.color,
                                      borderColor: column.color
                                    }}
                                  >
                                    {getStatusIcon(booking.statusCode)}
                                    {booking.statusName}
                                  </Badge>
                                </div>
                                <span className="text-xs text-gray-500">
                                  #{booking.id.slice(0, 6)}
                                </span>
                              </div>
                              
                              {/* Informations principales */}
                              <div>
                                <h4 className="font-medium text-sm text-gray-900 mb-1">
                                  {booking.parentName}
                                </h4>
                                <p className="text-xs text-gray-600 mb-1">
                                  {booking.serviceType}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(booking.requestedDate)} • {formatTime(booking.startTime)}-{formatTime(booking.endTime)}
                                </p>
                              </div>
                              
                              {/* Détails rapides */}
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{booking.childrenCount} enfant(s)</span>
                                <span>{formatDuration(booking.durationHours)}</span>
                              </div>
                              
                              {/* Actions rapides */}
                              <div className="flex gap-1 pt-2 border-t">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBooking(booking);
                                  }}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  Voir
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBooking(booking);
                                    setChangeStatusDialog(true);
                                  }}
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  Statut
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      
                      {/* Bouton d'ajout (pour les colonnes actives) */}
                      {['nouvelle', 'acceptee', 'confirmee'].includes(column.id) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-8 text-xs text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            // TODO: Implémenter l'ajout de réservation
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Ajouter
                        </Button>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Dialog de changement de statut */}
      <Dialog open={changeStatusDialog} onOpenChange={setChangeStatusDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Changer le statut de la réservation</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Statut actuel</p>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  {getStatusIcon(selectedBooking.statusCode)}
                  <span className="font-medium">{selectedBooking.statusName}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Nouveau statut</p>
                <div className="grid grid-cols-2 gap-2">
                  {BOOKING_STATUSES
                    .filter(status => status.code !== selectedBooking.statusCode)
                    .map((status) => (
                      <Button
                        key={status.code}
                        variant={newStatus === status.code ? "default" : "outline"}
                        size="sm"
                        className="h-auto p-3 flex-col items-start"
                        onClick={() => setNewStatus(status.code)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          {getStatusIcon(status.code)}
                        </div>
                        <span className="text-xs text-left">{status.name}</span>
                      </Button>
                    ))}
                </div>
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la réservation</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              {/* En-tête avec statut */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Badge 
                  variant="secondary"
                  className="flex items-center gap-2"
                  style={{ 
                    backgroundColor: `${selectedBooking.statusColor}20`,
                    color: selectedBooking.statusColor,
                    borderColor: selectedBooking.statusColor
                  }}
                >
                  {getStatusIcon(selectedBooking.statusCode)}
                  {selectedBooking.statusName}
                </Badge>
                <span className="text-sm text-gray-500">
                  #{selectedBooking.id.slice(0, 8)}
                </span>
              </div>
              
              {/* Informations client */}
              <div>
                <h3 className="font-semibold mb-2">Client</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nom:</span>
                    <p className="font-medium">{selectedBooking.parentName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Téléphone:</span>
                    <p className="font-medium">{selectedBooking.parentPhone}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-medium">{selectedBooking.parentEmail || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Adresse:</span>
                    <p className="font-medium">{selectedBooking.parentAddress}</p>
                  </div>
                </div>
              </div>
              
              {/* Détails de la réservation */}
              <div>
                <h3 className="font-semibold mb-2">Réservation</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Service:</span>
                    <p className="font-medium">{selectedBooking.serviceType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <p className="font-medium">{formatDate(selectedBooking.requestedDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Horaires:</span>
                    <p className="font-medium">
                      {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Durée:</span>
                    <p className="font-medium">{formatDuration(selectedBooking.durationHours)}</p>
                  </div>
                </div>
              </div>
              
              {/* Enfants */}
              <div>
                <h3 className="font-semibold mb-2">Enfants</h3>
                <div className="text-sm">
                  <span className="text-gray-500">Nombre:</span>
                  <p className="font-medium">{selectedBooking.childrenCount} enfant(s)</p>
                  <span className="text-gray-500">Détails:</span>
                  <p className="font-medium">{selectedBooking.childrenDetails}</p>
                  {selectedBooking.childrenAges && (
                    <>
                      <span className="text-gray-500">Âges:</span>
                      <p className="font-medium">{selectedBooking.childrenAges}</p>
                    </>
                  )}
                </div>
              </div>
              
              {/* Instructions spéciales */}
              {selectedBooking.specialInstructions && (
                <div>
                  <h3 className="font-semibold mb-2">Instructions spéciales</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedBooking.specialInstructions}
                  </p>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setChangeStatusDialog(true);
                    setSelectedBooking(null);
                  }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Changer le statut
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Implémenter l'édition
                  }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Éditer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingKanbanBoard;
