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
import { 
  Clock,
  CheckCircle,
  CalendarCheck,
  PlayCircle,
  CheckSquare,
  XCircle,
  Archive,
  Trash2,
  ArrowRight,
  AlertCircle,
  Info,
  History,
  User,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  RefreshCw,
  Eye,
  Edit,
  Save,
  X
} from 'lucide-react';
import { 
  BookingRequestSummary, 
  BookingStatusCode,
  formatBookingStatus, 
  getStatusColor,
  formatDate,
  BOOKING_STATUSES 
} from '@/types/booking';

interface BookingStatusManagerProps {
  className?: string;
  onStatusChange?: () => void;
}

interface StatusTransition {
  fromCode: string;
  toCode: string;
  requiresAdminApproval: boolean;
  requiresNotes: boolean;
  autoActions?: string[];
}

interface StatusChangeHistory {
  id: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  changedAt: string;
  notes?: string;
  transitionReason?: string;
}

const BookingStatusManager: React.FC<BookingStatusManagerProps> = ({ 
  className = '',
  onStatusChange 
}) => {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<BookingRequestSummary | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isTransitionDialogOpen, setIsTransitionDialogOpen] = useState(false);
  
  // États pour la gestion des statuts
  const [newStatus, setNewStatus] = useState<BookingStatusCode>('nouvelle');
  const [transitionNotes, setTransitionNotes] = useState('');
  const [transitionReason, setTransitionReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // États pour l'historique
  const [statusHistory, setStatusHistory] = useState<StatusChangeHistory[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  
  // États pour les transitions disponibles
  const [availableTransitions, setAvailableTransitions] = useState<StatusTransition[]>([]);
  const [isTransitionsLoading, setIsTransitionsLoading] = useState(false);

  // Transitions prédéfinies basées sur la migration
  const predefinedTransitions: StatusTransition[] = [
    // Transitions depuis "Nouvelle réservation"
    { fromCode: 'nouvelle', toCode: 'acceptee', requiresAdminApproval: true, requiresNotes: true },
    { fromCode: 'nouvelle', toCode: 'annulee', requiresAdminApproval: true, requiresNotes: true },
    
    // Transitions depuis "Réservation acceptée"
    { fromCode: 'acceptee', toCode: 'confirmee', requiresAdminApproval: false, requiresNotes: false },
    { fromCode: 'acceptee', toCode: 'annulee', requiresAdminApproval: true, requiresNotes: true },
    { fromCode: 'acceptee', toCode: 'nouvelle', requiresAdminApproval: true, requiresNotes: true },
    
    // Transitions depuis "Réservation confirmée"
    { fromCode: 'confirmee', toCode: 'en_cours', requiresAdminApproval: false, requiresNotes: false },
    { fromCode: 'confirmee', toCode: 'annulee', requiresAdminApproval: true, requiresNotes: true },
    { fromCode: 'confirmee', toCode: 'acceptee', requiresAdminApproval: true, requiresNotes: true },
    
    // Transitions depuis "En cours"
    { fromCode: 'en_cours', toCode: 'terminee', requiresAdminApproval: false, requiresNotes: false },
    { fromCode: 'en_cours', toCode: 'annulee', requiresAdminApproval: true, requiresNotes: true },
    
    // Transitions depuis "Terminée"
    { fromCode: 'terminee', toCode: 'archivée', requiresAdminApproval: false, requiresNotes: false },
    { fromCode: 'terminee', toCode: 'en_cours', requiresAdminApproval: true, requiresNotes: true },
    
    // Transitions depuis "Annulée"
    { fromCode: 'annulee', toCode: 'nouvelle', requiresAdminApproval: true, requiresNotes: true },
    { fromCode: 'annulee', toCode: 'archivée', requiresAdminApproval: false, requiresNotes: false },
    
    // Transitions depuis "Archivée"
    { fromCode: 'archivée', toCode: 'terminee', requiresAdminApproval: true, requiresNotes: true },
    { fromCode: 'archivée', toCode: 'supprimee', requiresAdminApproval: true, requiresNotes: true },
    
    // Transitions depuis "Supprimée" (restauration possible)
    { fromCode: 'supprimee', toCode: 'archivée', requiresAdminApproval: true, requiresNotes: true }
  ];

  // Obtenir les transitions disponibles pour un statut donné
  const getAvailableTransitions = (currentStatus: string): StatusTransition[] => {
    return predefinedTransitions.filter(transition => transition.fromCode === currentStatus);
  };

  // Obtenir l'icône pour un statut
  const getStatusIcon = (statusCode: string) => {
    const status = BOOKING_STATUSES.find(s => s.code === statusCode);
    if (!status) return <AlertCircle className="h-4 w-4" />;
    
    switch (status.icon) {
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
    
    // Convertir la couleur hex en classes Tailwind
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

  // Ouvrir le dialogue de changement de statut
  const openStatusDialog = (booking: BookingRequestSummary) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status as BookingStatusCode);
    setTransitionNotes('');
    setTransitionReason('');
    setAvailableTransitions(getAvailableTransitions(booking.status));
    setIsStatusDialogOpen(true);
  };

  // Ouvrir le dialogue d'historique
  const openHistoryDialog = (booking: BookingRequestSummary) => {
    setSelectedBooking(booking);
    loadStatusHistory(booking.id);
    setIsHistoryDialogOpen(true);
  };

  // Charger l'historique des changements de statut
  const loadStatusHistory = async (bookingId: string) => {
    setIsHistoryLoading(true);
    try {
      // TODO: Implémenter l'appel à l'API pour récupérer l'historique
      // Pour l'instant, on simule des données
      const mockHistory: StatusChangeHistory[] = [
        {
          id: '1',
          fromStatus: 'nouvelle',
          toStatus: 'acceptee',
          changedBy: 'Admin',
          changedAt: new Date().toISOString(),
          notes: 'Réservation validée après vérification des disponibilités',
          transitionReason: 'Validation administrative'
        }
      ];
      setStatusHistory(mockHistory);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement de l\'historique',
        variant: 'destructive',
      });
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // Mettre à jour le statut d'une réservation
  const handleStatusUpdate = async () => {
    if (!selectedBooking) return;

    setIsUpdating(true);
    try {
      // TODO: Implémenter l'appel à l'API pour mettre à jour le statut
      // const result = await BookingService.updateBookingStatus(
      //   selectedBooking.id,
      //   newStatus,
      //   transitionNotes
      // );

      // Simulation d'une mise à jour réussie
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Statut mis à jour',
        description: `Le statut de la réservation a été mis à jour vers "${formatBookingStatus(newStatus)}"`,
      });

      // Fermer le dialogue et notifier le composant parent
      setIsStatusDialogOpen(false);
      onStatusChange?.();
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

  // Vérifier si une transition nécessite des notes
  const isNotesRequired = (fromStatus: string, toStatus: string): boolean => {
    const transition = predefinedTransitions.find(t => 
      t.fromCode === fromStatus && t.toCode === toStatus
    );
    return transition?.requiresNotes || false;
  };

  // Vérifier si une transition nécessite une approbation admin
  const isAdminApprovalRequired = (fromStatus: string, toStatus: string): boolean => {
    const transition = predefinedTransitions.find(t => 
      t.fromCode === fromStatus && t.toCode === toStatus
    );
    return transition?.requiresAdminApproval || false;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Workflow des statuts */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>Workflow des Statuts de Réservation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 min-w-max p-4">
              {BOOKING_STATUSES.map((status, index) => (
                <div key={status.code} className="flex flex-col items-center space-y-2">
                  <div className={`p-3 rounded-full ${getStatusColorClass(status.code)}`}>
                    {getStatusIcon(status.code)}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {status.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-24">
                      {status.description}
                    </p>
                  </div>
                  {index < BOOKING_STATUSES.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transitions autorisées */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowRight className="h-5 w-5" />
            <span>Transitions Autorisées</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BOOKING_STATUSES.map(status => {
              const transitions = getAvailableTransitions(status.code);
              return (
                <div key={status.code} className="border rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className={`p-2 rounded-full ${getStatusColorClass(status.code)}`}>
                      {getStatusIcon(status.code)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{status.name}</h4>
                      <p className="text-xs text-gray-500">{status.code}</p>
                    </div>
                  </div>
                  
                  {transitions.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Transitions vers :</p>
                      {transitions.map(transition => {
                        const toStatus = BOOKING_STATUSES.find(s => s.code === transition.toCode);
                        if (!toStatus) return null;
                        
                        return (
                          <div key={transition.toCode} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div className={`p-1 rounded ${getStatusColorClass(transition.toCode)}`}>
                                {getStatusIcon(transition.toCode)}
                              </div>
                              <span>{toStatus.name}</span>
                            </div>
                            <div className="flex space-x-1">
                              {transition.requiresAdminApproval && (
                                <Badge variant="secondary" className="text-xs">Admin</Badge>
                              )}
                              {transition.requiresNotes && (
                                <Badge variant="outline" className="text-xs">Notes</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Aucune transition disponible</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialogue de changement de statut */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Changer le Statut</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              {/* Informations de la réservation */}
              <div className="rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{selectedBooking.parentName}</span>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{formatDate(selectedBooking.requestedDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{selectedBooking.startTime} - {selectedBooking.endTime}</span>
                </div>
              </div>

              {/* Statut actuel */}
              <div>
                <Label className="text-sm font-medium text-gray-500">Statut actuel</Label>
                <div className={`mt-1 inline-flex items-center space-x-2 px-3 py-2 rounded-md ${getStatusColorClass(selectedBooking.status)}`}>
                  {getStatusIcon(selectedBooking.status)}
                  <span className="text-sm font-medium">{formatBookingStatus(selectedBooking.status)}</span>
                </div>
              </div>

              {/* Nouveau statut */}
              <div>
                <Label htmlFor="newStatus">Nouveau statut</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as BookingStatusCode)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableTransitions(selectedBooking.status).map(transition => {
                      const toStatus = BOOKING_STATUSES.find(s => s.code === transition.toCode);
                      if (!toStatus) return null;
                      
                      return (
                        <SelectItem key={transition.toCode} value={transition.toCode}>
                          <div className="flex items-center space-x-2">
                            <div className={`p-1 rounded ${getStatusColorClass(transition.toCode)}`}>
                              {getStatusIcon(transition.toCode)}
                            </div>
                            <span>{toStatus.name}</span>
                            {transition.requiresAdminApproval && (
                              <Badge variant="secondary" className="text-xs">Admin</Badge>
                            )}
                            {transition.requiresNotes && (
                              <Badge variant="outline" className="text-xs">Notes</Badge>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Raison du changement (si requise) */}
              {isNotesRequired(selectedBooking.status, newStatus) && (
                <div>
                  <Label htmlFor="transitionReason">Raison du changement *</Label>
                  <Select value={transitionReason} onValueChange={setTransitionReason}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner une raison..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="validation_admin">Validation administrative</SelectItem>
                      <SelectItem value="confirmation_client">Confirmation client</SelectItem>
                      <SelectItem value="annulation_client">Annulation client</SelectItem>
                      <SelectItem value="indisponibilite">Indisponibilité</SelectItem>
                      <SelectItem value="autre">Autre raison</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Notes (si requises) */}
              {isNotesRequired(selectedBooking.status, newStatus) && (
                <div>
                  <Label htmlFor="transitionNotes">Notes *</Label>
                  <Textarea
                    id="transitionNotes"
                    value={transitionNotes}
                    onChange={(e) => setTransitionNotes(e.target.value)}
                    placeholder="Détails sur le changement de statut..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsStatusDialogOpen(false)}
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={
                    isUpdating || 
                    (isNotesRequired(selectedBooking.status, newStatus) && (!transitionNotes.trim() || !transitionReason))
                  }
                >
                  {isUpdating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Mettre à jour
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialogue d'historique des statuts */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Historique des Changements de Statut</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              {/* Informations de la réservation */}
              <div className="rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{selectedBooking.parentName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{formatDate(selectedBooking.requestedDate)}</span>
                </div>
              </div>

              {/* Historique */}
              {isHistoryLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Chargement de l'historique...</p>
                </div>
              ) : statusHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>Aucun changement de statut enregistré</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {statusHistory.map((change, index) => (
                    <div key={change.id} className="border rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-full ${getStatusColorClass(change.toStatus)}`}>
                            {getStatusIcon(change.toStatus)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {formatBookingStatus(change.fromStatus)} → {formatBookingStatus(change.toStatus)}
                            </p>
                            <p className="text-xs text-gray-500">
                              par {change.changedBy} • {new Date(change.changedAt).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {change.transitionReason && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500">Raison : {change.transitionReason}</p>
                        </div>
                      )}
                      
                      {change.notes && (
                        <div className="rounded p-2 border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-800 dark:text-blue-200">{change.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingStatusManager;
