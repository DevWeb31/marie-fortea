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
  LegacyBookingStatus,
  BookingStatusCode,
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
  AlertCircle,
  Trash2,
  RotateCcw,
  Trash
} from 'lucide-react';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { supabase } from '@/lib/supabase';

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
  
  // Type union pour tous les statuts possibles
  type AllBookingStatus = LegacyBookingStatus | BookingStatusCode;
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AllBookingStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');
  
  // Actions
  const [newStatus, setNewStatus] = useState<AllBookingStatus>('pending');
  const [statusNote, setStatusNote] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Gestion des vues (actives, archivées, corbeille)
  const [currentView, setCurrentView] = useState<'active' | 'archived' | 'trash'>('active');
  const [archivedRequests, setArchivedRequests] = useState<BookingRequestSummary[]>([]);
  const [deletedRequests, setDeletedRequests] = useState<BookingRequestSummary[]>([]);
  const [isArchivedLoading, setIsArchivedLoading] = useState(false);
  const [isTrashLoading, setIsTrashLoading] = useState(false);

  // États des boîtes de confirmation
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'trash' | 'restore' | 'delete' | 'archive' | 'unarchive' | null;
    requestId: string | null;
    requestName: string | null;
  }>({
    isOpen: false,
    type: null,
    requestId: null,
    requestName: null,
  });

  // État pour le dialogue de sélection de statut après désarchivage
  const [unarchiveStatusDialog, setUnarchiveStatusDialog] = useState<{
    isOpen: boolean;
    requestId: string | null;
    requestName: string | null;
  }>({
    isOpen: false,
    requestId: null,
    requestName: null,
  });

  // État pour le dialogue de sélection de statut après restauration de la corbeille
  const [restoreStatusDialog, setRestoreStatusDialog] = useState<{
    isOpen: boolean;
    requestId: string | null;
    requestName: string | null;
  }>({
    isOpen: false,
    requestId: null,
    requestName: null,
  });

  // Charger les demandes
  useEffect(() => {
    loadRequests();
  }, []);

  // Charger les réservations selon la vue actuelle
  useEffect(() => {
    switch (currentView) {
      case 'active':
        loadRequests();
        break;
      case 'archived':
        loadArchivedRequests();
        break;
      case 'trash':
        loadDeletedRequests();
        break;
    }
  }, [currentView]);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = requests;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.parentPhone.includes(searchTerm) ||
        request.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Filtre par date
    if (dateFilter) {
      filtered = filtered.filter(request => 
        request.requestedDate.includes(dateFilter)
      );
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
      } else {
        setRequests(result.data || []);
      }
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

  const loadArchivedRequests = async () => {
    setIsArchivedLoading(true);
    try {
      const result = await BookingService.getArchivedBookingRequests();
      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }
      setArchivedRequests(result.data || []);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement des réservations archivées',
        variant: 'destructive',
      });
    } finally {
      setIsArchivedLoading(false);
    }
  };

  const loadDeletedRequests = async () => {
    setIsTrashLoading(true);
    try {
      const result = await BookingService.getDeletedBookingRequests();
      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }
      setDeletedRequests(result.data || []);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement des réservations supprimées',
        variant: 'destructive',
      });
    } finally {
      setIsTrashLoading(false);
    }
  };

  const openConfirmDialog = (type: 'trash' | 'restore' | 'delete' | 'archive' | 'unarchive', id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      type,
      requestId: id,
      requestName: name,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: null,
      requestId: null,
      requestName: null,
    });
  };

  // Fonction utilitaire pour recharger tous les compteurs
  const reloadAllCounters = async () => {
    await Promise.all([
      loadRequests(),
      loadDeletedRequests(),
      loadArchivedRequests()
    ]);
  };

  const handleMoveToTrash = async (id: string) => {
    try {
      console.log('🔄 Mise en corbeille avec mise à jour automatique du statut...');
      console.log('Réservation:', id);

      // 1. D'abord, mettre à jour le statut vers "cancelled" (annulée)
      const { error: statusError } = await supabase
        .from('booking_requests')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (statusError) {
        console.error('❌ Erreur lors de la mise à jour du statut:', statusError);
        toast({
          title: 'Erreur',
          description: `Erreur lors de la mise à jour du statut: ${statusError.message}`,
          variant: 'destructive',
        });
        return;
      }

      console.log('✅ Statut mis à jour vers "cancelled"');

      // 2. Ensuite, mettre la réservation dans la corbeille
      const result = await BookingService.moveToTrash(id);
      
      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      if (result.data) {
        console.log('✅ Réservation mise dans la corbeille avec succès');
        toast({
          title: 'Réservation supprimée',
          description: 'La réservation a été mise dans la corbeille et le statut a été mis à jour vers "Annulée"',
          variant: 'default',
        });

        // Recharger automatiquement tous les compteurs
        await reloadAllCounters();
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise en corbeille:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise en corbeille',
        variant: 'destructive',
      });
    }
  };

  const handleRestoreFromTrash = async (id: string) => {
    try {
      console.log('🔄 Restauration avec sélection de nouveau statut...');
      console.log('Réservation:', id);

      // 1. D'abord, restaurer la réservation de la corbeille
      const result = await BookingService.restoreFromTrash(id);
      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      if (result.data) {
        console.log('✅ Réservation restaurée avec succès');
        
        // 2. Ouvrir le dialogue de sélection de statut
        const request = deletedRequests.find(r => r.id === id);
        setRestoreStatusDialog({
          isOpen: true,
          requestId: id,
          requestName: request?.parentName || 'Réservation'
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors de la restauration:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la restauration',
        variant: 'destructive',
      });
    }
  };

  const handlePermanentlyDelete = async (id: string) => {
    try {
      const result = await BookingService.permanentlyDelete(id);
      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Réservation supprimée',
        description: 'La réservation a été supprimée définitivement',
        variant: 'default',
      });

      // Recharger automatiquement tous les compteurs
      await reloadAllCounters();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression définitive',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmedAction = async () => {
    if (!confirmDialog.requestId || !confirmDialog.type) return;

    switch (confirmDialog.type) {
      case 'trash':
        await handleMoveToTrash(confirmDialog.requestId);
        break;
      case 'restore':
        await handleRestoreFromTrash(confirmDialog.requestId);
        break;
      case 'delete':
        await handlePermanentlyDelete(confirmDialog.requestId);
        break;
      case 'archive':
        await handleArchiveBooking(confirmDialog.requestId);
        break;
      case 'unarchive':
        await handleUnarchiveBooking(confirmDialog.requestId);
        break;
    }
  };

  const handleArchiveBooking = async (id: string) => {
    try {
      console.log('🔄 Archivage avec mise à jour automatique du statut...');
      console.log('Réservation:', id);

      // 1. D'abord, mettre à jour le statut vers "completed" (terminée)
      const { error: statusError } = await supabase
        .from('booking_requests')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (statusError) {
        console.error('❌ Erreur lors de la mise à jour du statut:', statusError);
        toast({
          title: 'Erreur',
          description: `Erreur lors de la mise à jour du statut: ${statusError.message}`,
          variant: 'destructive',
        });
        return;
      }

      console.log('✅ Statut mis à jour vers "completed"');

      // 2. Ensuite, archiver la réservation
      const result = await BookingService.archiveBooking(id);
      
      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      if (result.data) {
        console.log('✅ Réservation archivée avec succès');
        toast({
          title: 'Réservation archivée',
          description: 'La réservation a été archivée avec succès et le statut a été mis à jour vers "Terminée"',
          variant: 'default',
        });

        // Recharger automatiquement tous les compteurs
        await reloadAllCounters();
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'archivage:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'archivage',
        variant: 'destructive',
      });
    }
  };

  const handleUnarchiveBooking = async (id: string) => {
    try {
      console.log('🔄 Désarchivage avec sélection de nouveau statut...');
      console.log('Réservation:', id);

      // 1. D'abord, désarchiver la réservation
      const result = await BookingService.unarchiveBooking(id);
      
      if (result.error) {
        toast({
          title: 'Erreur',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      if (result.data) {
        console.log('✅ Réservation désarchivée avec succès');
        
        // 2. Ouvrir le dialogue de sélection de statut
        const request = archivedRequests.find(r => r.id === id);
        setUnarchiveStatusDialog({
          isOpen: true,
          requestId: id,
          requestName: request?.parentName || 'Réservation'
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors du désarchivage:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors du désarchivage',
        variant: 'destructive',
      });
    }
  };

  // Fonction pour mettre à jour le statut après restauration de la corbeille
  const handleRestoreStatusUpdate = async (newStatus: AllBookingStatus) => {
    if (!restoreStatusDialog.requestId) return;

    setIsUpdating(true);
    try {
      console.log('🔄 Mise à jour du statut après restauration...');
      console.log('Réservation:', restoreStatusDialog.requestId);
      console.log('Nouveau statut:', newStatus);

      // Mettre à jour le statut
      const { error: statusError } = await supabase
        .from('booking_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', restoreStatusDialog.requestId);

      if (statusError) {
        console.error('❌ Erreur lors de la mise à jour du statut:', statusError);
        toast({
          title: 'Erreur',
          description: `Erreur lors de la mise à jour du statut: ${statusError.message}`,
          variant: 'destructive',
        });
        return;
      }

      console.log('✅ Statut mis à jour avec succès');
      toast({
        title: 'Réservation restaurée',
        description: `La réservation a été restaurée avec succès et le statut a été mis à jour vers "${formatBookingStatus(newStatus)}"`,
        variant: 'default',
      });

      // Fermer le dialogue et recharger les données
      setRestoreStatusDialog({
        isOpen: false,
        requestId: null,
        requestName: null,
      });

      // Recharger automatiquement tous les compteurs
      await reloadAllCounters();
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour du statut',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Fonction pour mettre à jour le statut après désarchivage
  const handleUnarchiveStatusUpdate = async (newStatus: AllBookingStatus) => {
    if (!unarchiveStatusDialog.requestId) return;

    setIsUpdating(true);
    try {
      console.log('🔄 Mise à jour du statut après désarchivage...');
      console.log('Réservation:', unarchiveStatusDialog.requestId);
      console.log('Nouveau statut:', newStatus);

      // Mettre à jour le statut
      const { error: statusError } = await supabase
        .from('booking_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', unarchiveStatusDialog.requestId);

      if (statusError) {
        console.error('❌ Erreur lors de la mise à jour du statut:', statusError);
        toast({
          title: 'Erreur',
          description: `Erreur lors de la mise à jour du statut: ${statusError.message}`,
          variant: 'destructive',
        });
        return;
      }

      console.log('✅ Statut mis à jour avec succès');
      toast({
        title: 'Réservation désarchivée',
        description: `La réservation a été désarchivée avec succès et le statut a été mis à jour vers "${formatBookingStatus(newStatus)}"`,
        variant: 'default',
      });

      // Fermer le dialogue et recharger les données
      setUnarchiveStatusDialog({
        isOpen: false,
        requestId: null,
        requestName: null,
      });

      // Recharger automatiquement tous les compteurs
      await reloadAllCounters();
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour du statut',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };
  const handleStatusUpdate = async () => {
    if (!selectedRequest) return;

    setIsUpdating(true);
    try {
      console.log('🔄 Mise à jour ULTRA SIMPLE du statut...');
      console.log('Réservation:', selectedRequest.id);
      console.log('Ancien statut:', selectedRequest.status);
      console.log('Nouveau statut:', newStatus);
      console.log('Note:', statusNote);

      // UNIQUEMENT la mise à jour du statut dans booking_requests
      const { error: statusError } = await supabase
        .from('booking_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id);

      if (statusError) {
        console.error('❌ Erreur lors de la mise à jour du statut:', statusError);
        toast({
          title: 'Erreur',
          description: `Erreur lors de la mise à jour du statut: ${statusError.message}`,
          variant: 'destructive',
        });
        return;
      }

      console.log('✅ Statut mis à jour avec succès - AUCUNE autre table utilisée');

      // Tentative d'ajout de note (optionnel, sans historique complexe)
      if (statusNote && statusNote.trim()) {
        try {
          // Essayer d'ajouter une note simple dans admin_notes
          const { error: noteError } = await supabase
            .from('admin_notes')
            .insert({
              booking_request_id: selectedRequest.id,
              note: `Changement de statut: ${selectedRequest.status} → ${newStatus}. ${statusNote}`,
              created_by: 'admin',
              created_at: new Date().toISOString()
            });

          if (noteError) {
            console.warn('⚠️ Erreur lors de l\'ajout de la note:', noteError);
            // Ne pas échouer si la note échoue
          } else {
            console.log('✅ Note ajoutée avec succès');
          }
        } catch (noteError) {
          console.warn('⚠️ Erreur lors de l\'ajout de la note:', noteError);
        }
      }

      toast({
        title: 'Statut mis à jour',
        description: `Le statut de la demande a été mis à jour vers "${formatBookingStatus(newStatus)}"`,
        variant: 'default',
      });

      // Recharger automatiquement tous les compteurs
      await reloadAllCounters();
      setIsStatusDialogOpen(false);
      setStatusNote('');
      setSelectedRequest(null);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour du statut',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Fonction supprimée - remplacée par la logique ultra-simple

  // Fonction supprimée - plus nécessaire avec la logique ultra-simple

  // Fonction pour obtenir les transitions disponibles (simplifiée)
  const getAvailableTransitions = (currentStatus: string) => {
    // Toutes les transitions sont autorisées (simplification)
    return [
      { fromCode: currentStatus, toCode: 'pending', requiresAdminApproval: false },
      { fromCode: currentStatus, toCode: 'contacted', requiresAdminApproval: false },
      { fromCode: currentStatus, toCode: 'confirmed', requiresAdminApproval: false },
      { fromCode: currentStatus, toCode: 'cancelled', requiresAdminApproval: false },
      { fromCode: currentStatus, toCode: 'completed', requiresAdminApproval: false },
    ];
  };

  const handleAddNote = async () => {
    if (!selectedRequest || !adminNote.trim()) return;

    setIsUpdating(true);
    try {
      const result = await BookingService.addAdminNote(
        selectedRequest.id,
        adminNote
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
        title: 'Note ajoutée',
        description: 'La note administrative a été ajoutée avec succès',
      });

      // Recharger les demandes
      await loadRequests();
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
    setNewStatus(request.status as AllBookingStatus);
    setStatusNote('');
    setIsStatusDialogOpen(true);
  };

  const openNoteDialog = (request: BookingRequestSummary) => {
    setSelectedRequest(request);
    setAdminNote('');
    setIsNoteDialogOpen(true);
  };

  const getStatusIcon = (status: AllBookingStatus) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-3 w-3" />;
      case 'contacted':
        return <Phone className="h-3 w-3" />;
      case 'confirmed':
        return <CheckCircle className="h-3 w-3" />;
      case 'cancelled':
        return <XCircle className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Recherche</Label>
              <Input
                id="search"
                placeholder="Nom, téléphone, service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AllBookingStatus | 'all')}>
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
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={loadRequests} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Système d'onglets pour les 3 vues */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestion des Réservations</CardTitle>
            <div className="flex items-center space-x-2">
              <Button onClick={loadRequests} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Onglets */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setCurrentView('active')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  currentView === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Demandes Actives</span>
                  <Badge variant="secondary" className="ml-1">
                    {filteredRequests.length}
                  </Badge>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView('archived')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  currentView === 'archived'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-4 w-4" />
                  <span>Archivées</span>
                  <Badge variant="secondary" className="ml-1">
                    {archivedRequests.length}
                  </Badge>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView('trash')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  currentView === 'trash'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Corbeille</span>
                  <Badge variant="secondary" className="ml-1">
                    {deletedRequests.length}
                  </Badge>
                </div>
              </button>
            </nav>
          </div>

          {/* Contenu des onglets */}
          {currentView === 'active' && (
            <div>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Chargement...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Aucune demande active trouvée
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
                              {getStatusIcon(request.status as AllBookingStatus)}
                              <span className="ml-1">{formatBookingStatus(request.status as AllBookingStatus)}</span>
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
                              {request.estimatedTotal ? request.estimatedTotal.toFixed(2) : '0.00'}€
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
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfirmDialog('archive', request.id, request.parentName)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfirmDialog('trash', request.id, request.parentName)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentView === 'archived' && (
            <div>
              {isArchivedLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Chargement...</p>
                </div>
              ) : archivedRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Aucune réservation archivée trouvée
                </div>
              ) : (
                <div className="space-y-4">
                  {archivedRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg">{request.parentName}</h3>
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status as AllBookingStatus)}
                              <span className="ml-1">{formatBookingStatus(request.status as AllBookingStatus)}</span>
                            </Badge>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              Archivée
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
                              {request.estimatedTotal ? request.estimatedTotal.toFixed(2) : '0.00'}€
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
                            onClick={() => openConfirmDialog('unarchive', request.id, request.parentName)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfirmDialog('delete', request.id, request.parentName)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentView === 'trash' && (
            <div>
              {isTrashLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Chargement...</p>
                </div>
              ) : deletedRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Aucune réservation dans la corbeille
                </div>
              ) : (
                <div className="space-y-4">
                  {deletedRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-red-50 dark:bg-red-900/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg">{request.parentName}</h3>
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status as AllBookingStatus)}
                              <span className="ml-1">{formatBookingStatus(request.status as AllBookingStatus)}</span>
                            </Badge>
                            <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Supprimée
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
                              {request.estimatedTotal ? request.estimatedTotal.toFixed(2) : '0.00'}€
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfirmDialog('restore', request.id, request.parentName)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfirmDialog('delete', request.id, request.parentName)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                    {formatBookingStatus(selectedRequest.status as AllBookingStatus)}
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
                  <p><strong>Prix estimé:</strong> {selectedRequest.estimatedTotal ? selectedRequest.estimatedTotal.toFixed(2) : '0.00'}€</p>
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
                              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as AllBookingStatus)}>
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

      {/* Boîte de dialogue de confirmation */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleConfirmedAction}
        title={
          confirmDialog.type === 'trash' ? 'Mettre en corbeille' :
          confirmDialog.type === 'restore' ? 'Restaurer la réservation' :
          confirmDialog.type === 'delete' ? 'Supprimer définitivement' :
          confirmDialog.type === 'archive' ? 'Archiver la réservation' :
          confirmDialog.type === 'unarchive' ? 'Désarchiver la réservation' : ''
        }
        description={
          confirmDialog.type === 'trash' 
            ? `Êtes-vous sûr de vouloir mettre la réservation de "${confirmDialog.requestName}" dans la corbeille ?` :
          confirmDialog.type === 'restore'
            ? `Êtes-vous sûr de vouloir restaurer la réservation de "${confirmDialog.requestName}" ?` :
          confirmDialog.type === 'delete'
            ? `⚠️ ATTENTION : Cette action est irréversible ! Êtes-vous absolument sûr de vouloir supprimer définitivement la réservation de "${confirmDialog.requestId}" ?` :
          confirmDialog.type === 'archive'
            ? `Êtes-vous sûr de vouloir archiver la réservation de "${confirmDialog.requestName}" ? Elle sera déplacée dans les archives.` :
          confirmDialog.type === 'unarchive'
            ? `Êtes-vous sûr de vouloir désarchiver la réservation de "${confirmDialog.requestName}" ? Elle redeviendra active.` : ''
        }
        confirmText={
          confirmDialog.type === 'trash' ? 'Mettre en corbeille' :
          confirmDialog.type === 'restore' ? 'Restaurer' :
          confirmDialog.type === 'delete' ? 'Supprimer définitivement' :
          confirmDialog.type === 'archive' ? 'Archiver' :
          confirmDialog.type === 'unarchive' ? 'Désarchiver' : 'Confirmer'
        }
        cancelText="Annuler"
        variant={confirmDialog.type === 'delete' ? 'destructive' : 'default'}
      />

      {/* Dialogue de sélection de statut après désarchivage */}
      <Dialog open={unarchiveStatusDialog.isOpen} onOpenChange={(open) => {
        if (!open) {
          setUnarchiveStatusDialog({
            isOpen: false,
            requestId: null,
            requestName: null,
          });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choisir le nouveau statut</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              La réservation de <strong>"{unarchiveStatusDialog.requestName}"</strong> a été désarchivée avec succès.
              <br />
              Veuillez choisir le nouveau statut pour cette réservation :
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={() => handleUnarchiveStatusUpdate('pending')}
                disabled={isUpdating}
                className="justify-start"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>En attente</span>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleUnarchiveStatusUpdate('contacted')}
                disabled={isUpdating}
                className="justify-start"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Contacté</span>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleUnarchiveStatusUpdate('confirmed')}
                disabled={isUpdating}
                className="justify-start"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Confirmé</span>
                </div>
              </Button>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setUnarchiveStatusDialog({
                  isOpen: false,
                  requestId: null,
                  requestName: null,
                })}
                disabled={isUpdating}
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue de sélection de statut après restauration de la corbeille */}
      <Dialog open={restoreStatusDialog.isOpen} onOpenChange={(open) => {
        if (!open) {
          setRestoreStatusDialog({
            isOpen: false,
            requestId: null,
            requestName: null,
          });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choisir le nouveau statut</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              La réservation de <strong>"{restoreStatusDialog.requestName}"</strong> a été restaurée avec succès.
              <br />
              Veuillez choisir le nouveau statut pour cette réservation :
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={() => handleRestoreStatusUpdate('pending')}
                disabled={isUpdating}
                className="justify-start"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>En attente</span>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleRestoreStatusUpdate('contacted')}
                disabled={isUpdating}
                className="justify-start"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Contacté</span>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleRestoreStatusUpdate('confirmed')}
                disabled={isUpdating}
                className="justify-start"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Confirmé</span>
                </div>
              </Button>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setRestoreStatusDialog({
                  isOpen: false,
                  requestId: null,
                  requestName: null,
                })}
                disabled={isUpdating}
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingRequestsList;
