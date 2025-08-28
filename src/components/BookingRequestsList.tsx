import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { BookingService } from '@/lib/booking-service';
import { 
  BookingRequestSummary, 
  BookingStatus, 
  formatBookingStatus, 
  getStatusColor,
  formatDate 
} from '@/types/booking';
import {
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  MapPin,
  Baby,
  Euro,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface BookingRequestsListProps {
  className?: string;
}

const BookingRequestsList: React.FC<BookingRequestsListProps> = ({ className = '' }) => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<BookingRequestSummary[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BookingRequestSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<BookingRequestSummary | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');
  
  // Actions
  const [newStatus, setNewStatus] = useState<BookingStatus>('pending');
  const [statusNote, setStatusNote] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Charger les demandes
  useEffect(() => {
    loadRequests();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = requests;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.parentPhone.includes(searchTerm) ||
        request.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Filtre par date
    if (dateFilter) {
      filtered = filtered.filter(request => request.requestedDate === dateFilter);
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, dateFilter]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const result = await BookingService.getAllBookingRequests();
      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }
      setRequests(result.data || []);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement des demandes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedRequest) return;

    setIsUpdating(true);
    try {
      const result = await BookingService.updateBookingStatus(
        selectedRequest.id,
        newStatus,
        statusNote
      );

      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Statut mis à jour',
        description: `Le statut de la demande a été mis à jour vers "${formatBookingStatus(newStatus)}"`,
      });

      // Recharger les demandes
      await loadRequests();
      setIsStatusDialogOpen(false);
      setStatusNote('');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour du statut',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!selectedRequest || !adminNote.trim()) return;

    setIsUpdating(true);
    try {
      const result = await BookingService.addAdminNote(selectedRequest.id, adminNote);

      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Note ajoutée',
        description: 'La note administrative a été ajoutée avec succès',
      });

      setIsNoteDialogOpen(false);
      setAdminNote('');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'ajout de la note',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const openDetailDialog = (request: BookingRequestSummary) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
  };

  const openStatusDialog = (request: BookingRequestSummary) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setIsStatusDialogOpen(true);
  };

  const openNoteDialog = (request: BookingRequestSummary) => {
    setSelectedRequest(request);
    setIsNoteDialogOpen(true);
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'contacted':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Contactés</p>
                <p className="text-2xl font-bold text-blue-600">
                  {requests.filter(r => r.status === 'contacted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confirmés</p>
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Euro className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total estimé</p>
                <p className="text-2xl font-bold text-purple-600">
                  {requests.reduce((sum, r) => sum + r.estimatedTotal, 0).toFixed(0)}€
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Recherche</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nom, téléphone, service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="statusFilter">Statut</Label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BookingStatus | 'all')}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="contacted">Contacté</SelectItem>
                  <SelectItem value="confirmed">Confirmé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dateFilter">Date de garde</Label>
              <Input
                id="dateFilter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredRequests.length} demande{filteredRequests.length !== 1 ? 's' : ''} trouvée{filteredRequests.length !== 1 ? 's' : ''}
            </p>
            <Button onClick={loadRequests} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des demandes */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes de Réservation</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Aucune demande trouvée
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{request.parentName}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{formatBookingStatus(request.status)}</span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{request.parentPhone}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(request.requestedDate)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{request.startTime} - {request.endTime}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Baby className="h-4 w-4" />
                          <span>{request.childrenCount} enfant{request.childrenCount > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          Service: {request.serviceName}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          Durée: {request.durationHours}h
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">•</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {request.estimatedTotal.toFixed(2)}€
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailDialog(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openStatusDialog(request)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openNoteDialog(request)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de détails */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Statut</Label>
                  <Badge className={`mt-1 ${getStatusColor(selectedRequest.status)}`}>
                    {formatBookingStatus(selectedRequest.status)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date de création</Label>
                  <p className="mt-1">{formatDate(selectedRequest.createdAt)}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Informations de contact</h4>
                <div className="space-y-2">
                  <p><strong>Nom:</strong> {selectedRequest.parentName}</p>
                  <p><strong>Téléphone:</strong> {selectedRequest.parentPhone}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Détails du service</h4>
                <div className="space-y-2">
                  <p><strong>Service:</strong> {selectedRequest.serviceName}</p>
                  <p><strong>Date:</strong> {formatDate(selectedRequest.requestedDate)}</p>
                  <p><strong>Heures:</strong> {selectedRequest.startTime} - {selectedRequest.endTime}</p>
                  <p><strong>Durée:</strong> {selectedRequest.durationHours}h</p>
                  <p><strong>Prix estimé:</strong> {selectedRequest.estimatedTotal.toFixed(2)}€</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de mise à jour de statut */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mettre à jour le statut</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newStatus">Nouveau statut</Label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as BookingStatus)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="contacted">Contacté</SelectItem>
                  <SelectItem value="confirmed">Confirmé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="statusNote">Note (optionnel)</Label>
              <Textarea
                id="statusNote"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Note sur le changement de statut..."
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsStatusDialogOpen(false)}
                disabled={isUpdating}
              >
                Annuler
              </Button>
              <Button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Mise à jour...
                  </>
                ) : (
                  'Mettre à jour'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog d'ajout de note */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une note administrative</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminNote">Note</Label>
              <Textarea
                id="adminNote"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Note administrative..."
                className="mt-1"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsNoteDialogOpen(false)}
                disabled={isUpdating}
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddNote}
                disabled={isUpdating || !adminNote.trim()}
              >
                {isUpdating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Ajout...
                  </>
                ) : (
                  'Ajouter la note'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingRequestsList;
