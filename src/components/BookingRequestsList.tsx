import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  Trash,
  CheckSquare,
  Square
} from 'lucide-react';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { supabase } from '@/lib/supabase';

// Fonction utilitaire pour formater les heures sans les secondes
const formatTimeWithoutSeconds = (time: string): string => {
  if (!time) return '';
  // Si le format est HH:MM:SS, on prend seulement HH:MM
  if (time.includes(':')) {
    const parts = time.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
  }
  return time;
};

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
  
  // États pour la sélection multiple
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [bulkActionDialog, setBulkActionDialog] = useState<{
    isOpen: boolean;
    action: 'status' | 'archive' | 'unarchive' | 'trash' | 'delete' | null;
    newStatus?: AllBookingStatus;
  }>({
    isOpen: false,
    action: null,
  });

  // État pour le dialogue de sélection de statut après désarchivage en lot
  const [bulkUnarchiveStatusDialog, setBulkUnarchiveStatusDialog] = useState<{
    isOpen: boolean;
    selectedRequests: BookingRequestSummary[];
  }>({
    isOpen: false,
    selectedRequests: [],
  });
  
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

  // Réinitialiser la sélection quand on change de vue
  useEffect(() => {
    setSelectedItems(new Set());
    setSelectAll(false);
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

  // Fonctions pour la sélection multiple
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentViewRequests = getCurrentViewRequests();
      setSelectedItems(new Set(currentViewRequests.map(req => req.id)));
      setSelectAll(true);
    } else {
      setSelectedItems(new Set());
      setSelectAll(false);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
    
    // Vérifier si tous les éléments sont sélectionnés
    const currentViewRequests = getCurrentViewRequests();
    setSelectAll(newSelected.size === currentViewRequests.length);
  };

  const getCurrentViewRequests = (): BookingRequestSummary[] => {
    switch (currentView) {
      case 'active':
        return filteredRequests;
      case 'archived':
        return archivedRequests;
      case 'trash':
        return deletedRequests;
      default:
        return [];
    }
  };

  const getSelectedRequests = (): BookingRequestSummary[] => {
    const currentViewRequests = getCurrentViewRequests();
    return currentViewRequests.filter(req => selectedItems.has(req.id));
  };

  // Actions en lot
  const handleBulkAction = (action: 'status' | 'archive' | 'unarchive' | 'trash' | 'delete') => {
    if (selectedItems.size === 0) {
      toast({
        title: 'Aucune sélection',
        description: 'Veuillez sélectionner au moins une réservation',
        variant: 'destructive',
      });
      return;
    }

    // Pour la désarchivage, ouvrir directement le dialogue de sélection de statut
    if (action === 'unarchive') {
      setBulkUnarchiveStatusDialog({
        isOpen: true,
        selectedRequests: getSelectedRequests(),
      });
      return;
    }

    setBulkActionDialog({
      isOpen: true,
      action,
    });
  };

  const executeBulkAction = async () => {
    if (!bulkActionDialog.action || selectedItems.size === 0) return;

    setIsUpdating(true);
    const selectedRequests = getSelectedRequests();
    
    try {
      switch (bulkActionDialog.action) {
        case 'status':
          if (bulkActionDialog.newStatus) {
            await Promise.all(
              selectedRequests.map(async (request) => {
                const { error } = await supabase
                  .from('booking_requests')
                  .update({ 
                    status: bulkActionDialog.newStatus,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', request.id);
                
                if (error) throw error;
              })
            );
            
            toast({
              title: 'Statuts mis à jour',
              description: `${selectedRequests.length} réservation(s) mise(s) à jour vers "${formatBookingStatus(bulkActionDialog.newStatus!)}"`,
              variant: 'default',
            });
          }
          break;

        case 'archive':
          if (currentView === 'active') {
            // Archiver depuis les demandes actives
            await Promise.all(
              selectedRequests.map(async (request) => {
                // Mettre à jour le statut vers "completed"
                const { error: statusError } = await supabase
                  .from('booking_requests')
                  .update({ 
                    status: 'completed',
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', request.id);
                
                if (statusError) throw statusError;

                // Archiver la réservation
                const result = await BookingService.archiveBooking(request.id);
                if (result.error) throw new Error(result.error);
              })
            );
            
            toast({
              title: 'Réservations archivées',
              description: `${selectedRequests.length} réservation(s) archivée(s) avec succès`,
              variant: 'default',
            });
          }
          break;



        case 'trash':
          if (currentView === 'active') {
            // Mettre en corbeille depuis les demandes actives
            let successCount = 0;
            let errorCount = 0;
            
            for (const request of selectedRequests) {
              try {
                // Mettre à jour le statut vers "cancelled"
                const { error: statusError } = await supabase
                  .from('booking_requests')
                  .update({ 
                    status: 'cancelled',
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', request.id);
                
                if (statusError) {
                  console.error(`Erreur statut pour ${request.id}:`, statusError);
                  errorCount++;
                  continue;
                }

                // Mettre dans la corbeille - utiliser directement la mise à jour de la base
                const { error: trashError } = await supabase
                  .from('booking_requests')
                  .update({ 
                    deleted_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', request.id);
                
                if (trashError) {
                  console.error(`Erreur corbeille pour ${request.id}:`, trashError);
                  errorCount++;
                  continue;
                }
                
                successCount++;
              } catch (error) {
                console.error(`Erreur générale pour ${request.id}:`, error);
                errorCount++;
              }
            }
            
            // Afficher le résultat
            if (successCount > 0) {
              toast({
                title: 'Mise en corbeille terminée',
                description: `${successCount} réservation(s) mise(s) dans la corbeille${errorCount > 0 ? `, ${errorCount} échec(s)` : ''}`,
                variant: errorCount > 0 ? 'destructive' : 'default',
              });
            } else {
              toast({
                title: 'Erreur',
                description: `Aucune réservation n'a pu être mise dans la corbeille (${errorCount} échec(s))`,
                variant: 'destructive',
              });
            }
          }
          break;

        case 'delete':
          await Promise.all(
            selectedRequests.map(async (request) => {
              const result = await BookingService.permanentlyDelete(request.id);
              if (result.error) throw new Error(result.error);
            })
          );
          
          toast({
            title: 'Réservations supprimées',
            description: `${selectedRequests.length} réservation(s) supprimée(s) définitivement`,
            variant: 'default',
          });
          break;
      }

      // Recharger les données et réinitialiser la sélection
      await reloadAllCounters();
      setSelectedItems(new Set());
      setSelectAll(false);
      setBulkActionDialog({ isOpen: false, action: null });
      
    } catch (error) {
      console.error('Erreur lors de l\'action en lot:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'exécution de l\'action en lot',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

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

  // Fonction pour désarchiver en lot avec sélection de statut
  const handleBulkUnarchiveWithStatus = async (newStatus: AllBookingStatus) => {
    if (bulkUnarchiveStatusDialog.selectedRequests.length === 0) return;

    setIsUpdating(true);
    try {
      console.log('🔄 Désarchivage en lot avec mise à jour du statut...');
      console.log('Réservations:', bulkUnarchiveStatusDialog.selectedRequests.length);
      console.log('Nouveau statut:', newStatus);

      // 1. D'abord, désarchiver toutes les réservations
      await Promise.all(
        bulkUnarchiveStatusDialog.selectedRequests.map(async (request) => {
          const result = await BookingService.unarchiveBooking(request.id);
          if (result.error) throw new Error(result.error);
        })
      );

      console.log('✅ Toutes les réservations désarchivées');

      // 2. Ensuite, mettre à jour le statut de toutes les réservations
      await Promise.all(
        bulkUnarchiveStatusDialog.selectedRequests.map(async (request) => {
          const { error: statusError } = await supabase
            .from('booking_requests')
            .update({ 
              status: newStatus,
              updated_at: new Date().toISOString()
            })
            .eq('id', request.id);

          if (statusError) throw statusError;
        })
      );

      console.log('✅ Statuts mis à jour avec succès');
      toast({
        title: 'Réservations désarchivées',
        description: `${bulkUnarchiveStatusDialog.selectedRequests.length} réservation(s) désarchivée(s) avec succès et le statut a été mis à jour vers "${formatBookingStatus(newStatus)}"`,
        variant: 'default',
      });

      // Fermer le dialogue et recharger les données
      setBulkUnarchiveStatusDialog({
        isOpen: false,
        selectedRequests: [],
      });

      // Recharger automatiquement tous les compteurs
      await reloadAllCounters();
      setSelectedItems(new Set());
      setSelectAll(false);
      
    } catch (error) {
      console.error('❌ Erreur lors de la désarchivage en lot:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la désarchivage en lot',
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

  // Fonction pour obtenir le background coloré avec transparence basé sur le statut
  const getStatusBackgroundColor = (status: string): string => {
    const statusBackgrounds: Record<string, string> = {
      // Legacy statuts pour la compatibilité
      'pending': 'bg-yellow-50/60 dark:bg-yellow-900/20',
      'contacted': 'bg-blue-50/60 dark:bg-blue-900/20',
      'confirmed': 'bg-green-50/60 dark:bg-green-900/20',
      'cancelled': 'bg-red-50/60 dark:bg-red-900/20',
      'completed': 'bg-gray-50/60 dark:bg-gray-900/20',
      // Nouveaux statuts
      'nouvelle': 'bg-yellow-50/60 dark:bg-yellow-900/20',
      'acceptee': 'bg-blue-50/60 dark:bg-blue-900/20',
      'confirmee': 'bg-green-50/60 dark:bg-green-900/20',
      'en_cours': 'bg-purple-50/60 dark:bg-purple-900/20',
      'terminee': 'bg-gray-50/60 dark:bg-gray-900/20',
      'annulee': 'bg-red-50/60 dark:bg-red-900/20',
      'archivée': 'bg-gray-50/60 dark:bg-gray-600/20',
      'supprimee': 'bg-gray-50/60 dark:bg-gray-900/20'
    };
    return statusBackgrounds[status] || 'bg-gray-50/60 dark:bg-gray-900/20';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filtres et recherche */}
      <Card className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
        <CardHeader className="p-4 sm:p-6 pb-0">
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
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
            
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <Button onClick={loadRequests} variant="outline" size="sm" className="w-full sm:w-auto">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Système d'onglets pour les 3 vues */}
      <Card className="overflow-hidden bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 mt-6">
        <CardHeader className="p-4 sm:p-6 pb-0">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg sm:text-xl mt-2">Gestion des Réservations</CardTitle>
            <div className="flex items-center justify-center sm:justify-end">
              <Button onClick={loadRequests} variant="outline" size="sm" className="w-full sm:w-auto">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* Onglets */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-6">
            <nav className="-mb-px flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-6 xl:space-x-8">
              <button
                onClick={() => setCurrentView('active')}
                className={`py-3 sm:py-2 px-4 sm:px-3 lg:px-1 border-b-2 font-medium text-xs sm:text-sm w-full sm:w-auto text-center transition-colors duration-200 ${
                  currentView === 'active'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-zinc-800'
                }`}
              >
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Demandes Actives</span>
                  <Badge variant="secondary" className="ml-1 flex-shrink-0 text-xs sm:text-sm">
                    {filteredRequests.length}
                  </Badge>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView('archived')}
                className={`py-3 sm:py-2 px-4 sm:px-3 lg:px-1 border-b-2 font-medium text-xs sm:text-sm w-full sm:w-auto text-center transition-colors duration-200 ${
                  currentView === 'archived'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-zinc-800'
                }`}
              >
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Archivées</span>
                  <Badge variant="secondary" className="ml-1 flex-shrink-0 text-xs sm:text-sm">
                    {archivedRequests.length}
                  </Badge>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView('trash')}
                className={`py-3 sm:py-2 px-4 sm:px-3 lg:px-1 border-b-2 font-medium text-xs sm:text-sm w-full sm:w-auto text-center transition-colors duration-200 ${
                  currentView === 'trash'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-zinc-800'
                }`}
              >
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Corbeille</span>
                  <Badge variant="secondary" className="ml-1 flex-shrink-0 text-xs sm:text-sm">
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
                <div className="text-center py-6 sm:py-8">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm sm:text-base text-gray-600">Chargement...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm sm:text-base">Aucune demande active trouvée</p>
                </div>
              ) : (
                <div>
                  {/* Barre d'actions en lot */}
                  {selectedItems.size > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 mb-4">
                      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            {selectedItems.size} réservation(s) sélectionnée(s)
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItems(new Set());
                              setSelectAll(false);
                            }}
                            className="text-blue-600 hover:text-blue-700 w-full sm:w-auto"
                          >
                            Désélectionner tout
                          </Button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkAction('status')}
                            className="w-full sm:w-auto"
                          >
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Changer le statut
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkAction('archive')}
                            className="text-blue-600 hover:text-blue-700 w-full sm:w-auto"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Archiver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkAction('trash')}
                            className="text-red-600 hover:text-red-700 w-full sm:w-auto"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Mettre en corbeille
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* En-tête avec case à cocher "Tout sélectionner" */}
                  {/* En-tête avec case à cocher "Tout sélectionner" */}
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                        className="mt-0.5"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {selectAll ? "Désélectionner tout" : "Sélectionner tout"}
                      </span>
                    </div>
                    {selectedItems.size > 0 && (
                      <Badge variant="secondary" className="sm:ml-auto">
                        {selectedItems.size} sélectionné(s)
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    {filteredRequests.map((request) => (
                      <div
                        key={request.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          selectedItems.has(request.id) 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                            : `${getStatusBackgroundColor(request.status)} hover:bg-opacity-80`
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-3 lg:space-y-0">
                          <div className="flex items-start space-x-3 flex-1">
                            <Checkbox
                              checked={selectedItems.has(request.id)}
                              onCheckedChange={(checked) => handleSelectItem(request.id, checked as boolean)}
                              className="mt-1"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mb-3">
                                <h3 className="font-semibold text-base sm:text-lg truncate">{request.parentName}</h3>
                                <Badge className={getStatusColor(request.status)}>
                                  {getStatusIcon(request.status as AllBookingStatus)}
                                  <span className="ml-1">{formatBookingStatus(request.status as AllBookingStatus)}</span>
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="truncate">{request.parentPhone}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="truncate">{formatDate(request.requestedDate)}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="truncate">{formatTimeWithoutSeconds(request.startTime)} - {formatTimeWithoutSeconds(request.endTime)}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Baby className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="truncate">{request.childrenCount} enfant{request.childrenCount > 1 ? 's' : ''}</span>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm">
                                <span className="text-gray-500 dark:text-gray-400 truncate">
                                  Service: {request.serviceName}
                                </span>
                                <span className="hidden sm:inline text-gray-500 dark:text-gray-400">•</span>
                                <span className="text-gray-500 dark:text-gray-400 truncate">
                                  Durée: {request.durationHours}h
                                </span>
                                <span className="hidden sm:inline text-gray-500 dark:text-gray-400">•</span>
                                <span className="font-medium text-green-600 dark:text-green-400 truncate">
                                  {request.estimatedTotal ? request.estimatedTotal.toFixed(2) : '0.00'}€
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDetailDialog(request)}
                              className="w-10 h-10 p-0 flex items-center justify-center"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openStatusDialog(request)}
                              className="w-10 h-10 p-0 flex items-center justify-center"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openNoteDialog(request)}
                              className="w-10 h-10 p-0 flex items-center justify-center"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openConfirmDialog('archive', request.id, request.parentName)}
                              className="w-10 h-10 p-0 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openConfirmDialog('trash', request.id, request.parentName)}
                              className="w-10 h-10 p-0 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === 'archived' && (
            <div>
              {isArchivedLoading ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm sm:text-base text-gray-600">Chargement...</p>
                </div>
              ) : archivedRequests.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm sm:text-base">Aucune réservation archivée trouvée</p>
                </div>
              ) : (
                <div>
                  {/* Barre d'actions en lot */}
                  {selectedItems.size > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 mb-4">
                      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            {selectedItems.size} réservation(s) sélectionnée(s)
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItems(new Set());
                              setSelectAll(false);
                            }}
                            className="text-blue-600 hover:text-blue-700 w-full sm:w-auto"
                          >
                            Désélectionner tout
                          </Button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkAction('status')}
                            className="w-full sm:w-auto"
                          >
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Changer le statut
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkAction('unarchive')}
                            className="text-green-600 hover:text-green-700 w-full sm:w-auto"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Désarchiver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkAction('delete')}
                            className="text-red-600 hover:text-red-700 w-full sm:w-auto"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Supprimer définitivement
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* En-tête avec case à cocher "Tout sélectionner" */}
                  {/* En-tête avec case à cocher "Tout sélectionner" */}
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                        className="mt-0.5"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {selectAll ? "Désélectionner tout" : "Sélectionner tout"}
                      </span>
                    </div>
                    {selectedItems.size > 0 && (
                      <Badge variant="secondary" className="sm:ml-auto">
                        {selectedItems.size} sélectionné(s)
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    {archivedRequests.map((request) => (
                      <div
                        key={request.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          selectedItems.has(request.id) 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                            : `${getStatusBackgroundColor(request.status)} hover:bg-opacity-80`
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-3 lg:space-y-0">
                          <div className="flex items-start space-x-3 flex-1">
                            <Checkbox
                              checked={selectedItems.has(request.id)}
                              onCheckedChange={(checked) => handleSelectItem(request.id, checked as boolean)}
                              className="mt-1"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mb-3">
                                <h3 className="font-semibold text-base sm:text-lg truncate">{request.parentName}</h3>
                                <Badge className={getStatusColor(request.status)}>
                                  {getStatusIcon(request.status as AllBookingStatus)}
                                  <span className="ml-1">{formatBookingStatus(request.status as AllBookingStatus)}</span>
                                </Badge>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  Archivée
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="truncate">{request.parentPhone}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="truncate">{formatDate(request.requestedDate)}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="truncate">{formatTimeWithoutSeconds(request.startTime)} - {formatTimeWithoutSeconds(request.endTime)}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Baby className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="truncate">{request.childrenCount} enfant{request.childrenCount > 1 ? 's' : ''}</span>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm">
                                <span className="text-gray-500 dark:text-gray-400 truncate">
                                  Service: {request.serviceName}
                                </span>
                                <span className="hidden sm:inline text-gray-500 dark:text-gray-400">•</span>
                                <span className="text-gray-500 dark:text-gray-400 truncate">
                                  Durée: {request.durationHours}h
                                </span>
                                <span className="hidden sm:inline text-gray-500 dark:text-gray-400">•</span>
                                <span className="font-medium text-green-600 dark:text-green-400 truncate">
                                  {request.estimatedTotal ? request.estimatedTotal.toFixed(2) : '0.00'}€
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDetailDialog(request)}
                              className="w-10 h-10 p-0 flex items-center justify-center"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openConfirmDialog('unarchive', request.id, request.parentName)}
                              className="w-10 h-10 p-0 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openConfirmDialog('delete', request.id, request.parentName)}
                              className="w-10 h-10 p-0 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === 'trash' && (
            <div>
              {isTrashLoading ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm sm:text-base text-gray-600">Chargement...</p>
                </div>
              ) : deletedRequests.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm sm:text-base">Aucune réservation dans la corbeille</p>
                </div>
              ) : (
                <div>
                  {/* Barre d'actions en lot */}
                  {selectedItems.size > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 mb-4">
                      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            {selectedItems.size} réservation(s) sélectionnée(s)
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItems(new Set());
                              setSelectAll(false);
                            }}
                            className="text-blue-600 hover:text-blue-700 w-full sm:w-auto"
                          >
                            Désélectionner tout
                          </Button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkAction('status')}
                            className="w-full sm:w-auto"
                          >
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Changer le statut
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkAction('archive')}
                            className="text-green-600 hover:text-green-700 w-full sm:w-auto"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restaurer
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkAction('delete')}
                            className="text-red-600 hover:text-red-700 w-full sm:w-auto"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Supprimer définitivement
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* En-tête avec case à cocher "Tout sélectionner" */}
                  {/* En-tête avec case à cocher "Tout sélectionner" */}
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                        className="mt-0.5"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {selectAll ? "Désélectionner tout" : "Sélectionner tout"}
                      </span>
                    </div>
                    {selectedItems.size > 0 && (
                      <Badge variant="secondary" className="sm:ml-auto">
                        {selectedItems.size} sélectionné(s)
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    {deletedRequests.map((request) => (
                      <div
                        key={request.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          selectedItems.has(request.id) 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                            : `${getStatusBackgroundColor(request.status)} hover:bg-opacity-80`
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-3 lg:space-y-0">
                          <div className="flex items-start space-x-3 flex-1">
                            <Checkbox
                              checked={selectedItems.has(request.id)}
                              onCheckedChange={(checked) => handleSelectItem(request.id, checked as boolean)}
                              className="mt-1"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mb-3">
                                <h3 className="font-semibold text-base sm:text-lg truncate">{request.parentName}</h3>
                                <Badge className={getStatusColor(request.status)}>
                                  {getStatusIcon(request.status as AllBookingStatus)}
                                  <span className="ml-1">{formatBookingStatus(request.status as AllBookingStatus)}</span>
                                </Badge>
                                <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                  Supprimée
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="truncate">{request.parentPhone}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="truncate">{formatDate(request.requestedDate)}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="truncate">{formatTimeWithoutSeconds(request.startTime)} - {formatTimeWithoutSeconds(request.endTime)}</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Baby className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span className="truncate">{request.childrenCount} enfant{request.childrenCount > 1 ? 's' : ''}</span>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-sm">
                                <span className="text-gray-500 dark:text-gray-400 truncate">
                                  Service: {request.serviceName}
                                </span>
                                <span className="hidden sm:inline text-gray-500 dark:text-gray-400">•</span>
                                <span className="text-gray-500 dark:text-gray-400 truncate">
                                  Durée: {request.durationHours}h
                                </span>
                                <span className="hidden sm:inline text-gray-500 dark:text-gray-400">•</span>
                                <span className="font-medium text-green-600 dark:text-green-400 truncate">
                                  {request.estimatedTotal ? request.estimatedTotal.toFixed(2) : '0.00'}€
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openConfirmDialog('restore', request.id, request.parentName)}
                              className="w-10 h-10 p-0 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openConfirmDialog('delete', request.id, request.parentName)}
                              className="w-10 h-10 p-0 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <p><strong>Heures:</strong> {formatTimeWithoutSeconds(selectedRequest.startTime)} - {formatTimeWithoutSeconds(selectedRequest.endTime)}</p>
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



      {/* Dialog d'action en lot */}
      <Dialog open={bulkActionDialog.isOpen} onOpenChange={(open) => {
        if (!open) {
          setBulkActionDialog({ isOpen: false, action: null });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bulkActionDialog.action === 'status' ? 'Changer le statut en lot' : 
               bulkActionDialog.action === 'archive' ? 'Archiver en lot' : 
               bulkActionDialog.action === 'trash' ? 'Mettre en corbeille en lot' : 
               'Supprimer définitivement en lot'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Vous êtes sur le point d'exécuter l'action suivante sur {selectedItems.size} réservation(s) sélectionnée(s) :
            </p>
            
            {bulkActionDialog.action === 'status' ? (
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                  <p className="font-medium">Changer le statut</p>
                </div>
                
                <div>
                  <Label htmlFor="bulkStatus">Nouveau statut</Label>
                  <Select 
                    value={bulkActionDialog.newStatus || 'pending'} 
                    onValueChange={(value) => setBulkActionDialog({
                      ...bulkActionDialog,
                      newStatus: value as AllBookingStatus
                    })}
                  >
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
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <p className="font-medium">
                  {bulkActionDialog.action === 'archive' ? 'Archiver' : 
                   bulkActionDialog.action === 'trash' ? 'Mettre en corbeille' : 
                   'Supprimer définitivement'}
                </p>
                {bulkActionDialog.action === 'archive' && (
                  <p className="text-sm text-gray-600 mt-1">Les réservations seront archivées et leur statut sera mis à jour vers "Terminée"</p>
                )}
                {bulkActionDialog.action === 'trash' && (
                  <p className="text-sm text-gray-600 mt-1">Les réservations seront mises dans la corbeille et leur statut sera mis à jour vers "Annulée"</p>
                )}
                {bulkActionDialog.action === 'delete' && (
                  <p className="text-sm text-red-600 mt-1">⚠️ ATTENTION : Cette action est irréversible !</p>
                )}
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setBulkActionDialog({ isOpen: false, action: null })}
                disabled={isUpdating}
              >
                Annuler
              </Button>
              <Button
                onClick={executeBulkAction}
                disabled={isUpdating || selectedItems.size === 0 || (bulkActionDialog.action === 'status' && !bulkActionDialog.newStatus)}
                variant={bulkActionDialog.action === 'delete' ? 'destructive' : 'default'}
              >
                {isUpdating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Exécuter...
                  </>
                ) : (
                  'Exécuter l\'action'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue de sélection de statut après désarchivage en lot */}
      <Dialog open={bulkUnarchiveStatusDialog.isOpen} onOpenChange={(open) => {
        if (!open) {
          setBulkUnarchiveStatusDialog({
            isOpen: false,
            selectedRequests: [],
          });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choisir le nouveau statut</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {bulkUnarchiveStatusDialog.selectedRequests.length} réservation(s) ont été désarchivée(s) avec succès.
              <br />
              Veuillez choisir le nouveau statut pour ces réservations :
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={() => handleBulkUnarchiveWithStatus('pending')}
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
                onClick={() => handleBulkUnarchiveWithStatus('contacted')}
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
                onClick={() => handleBulkUnarchiveWithStatus('confirmed')}
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
                onClick={() => setBulkUnarchiveStatusDialog({
                  isOpen: false,
                  selectedRequests: [],
                })}
                disabled={isUpdating}
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Marge en bas de page */}
      <div className="h-8"></div>
    </div>
  );
};

export default BookingRequestsList;
