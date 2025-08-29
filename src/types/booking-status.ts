// Types spécifiques pour le système de statuts des réservations
// Date: 2025-01-17

import { supabase } from '../lib/supabase';

// Interface pour un statut de réservation
export interface BookingStatus {
  id: number;
  code: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

// Interface pour une transition entre statuts
export interface BookingStatusTransition {
  id: number;
  fromStatusId: number;
  toStatusId: number;
  requiresAdminApproval: boolean;
  requiresNotes: boolean;
  autoActions?: string[];
  createdAt: string;
}

// Interface pour un changement de statut
export interface BookingStatusChange {
  id: string;
  bookingRequestId: string;
  fromStatusId?: number;
  toStatusId: number;
  changedBy: string;
  changedAt: string;
  notes?: string;
  transitionReason?: string;
  metadata?: Record<string, any>;
}

// Type pour les codes de statut
export type BookingStatusCode = 
  | 'nouvelle'      // Nouvelle réservation
  | 'acceptee'      // Réservation acceptée
  | 'confirmee'     // Réservation confirmée
  | 'en_cours'      // En cours
  | 'terminee'      // Terminée
  | 'annulee'       // Annulée
  | 'archivée'      // Archivée
  | 'supprimee';    // Supprimée

// Interface pour une transition disponible
export interface AvailableTransition {
  toStatusCode: string;
  toStatusName: string;
  toStatusColor: string;
  toStatusIcon: string;
  requiresAdminApproval: boolean;
  requiresNotes: boolean;
}

// Interface pour la réponse de l'API de changement de statut
export interface ChangeStatusResponse {
  success: boolean;
  message?: string;
  error?: string;
  newStatus?: BookingStatus;
  transition?: BookingStatusChange;
}

// Constantes pour les statuts
export const BOOKING_STATUSES: Omit<BookingStatus, 'id' | 'createdAt'>[] = [
  {
    code: 'nouvelle',
    name: 'Nouvelle réservation',
    description: 'Demande initiale reçue, en attente de traitement',
    color: '#F59E0B',
    icon: 'clock',
    isActive: true,
    sortOrder: 1
  },
  {
    code: 'acceptee',
    name: 'Réservation acceptée',
    description: 'Demande validée par l\'administrateur, en attente de confirmation client',
    color: '#3B82F6',
    icon: 'check-circle',
    isActive: true,
    sortOrder: 2
  },
  {
    code: 'confirmee',
    name: 'Réservation confirmée',
    description: 'Réservation confirmée par le client, prête pour exécution',
    color: '#10B981',
    icon: 'calendar-check',
    isActive: true,
    sortOrder: 3
  },
  {
    code: 'en_cours',
    name: 'En cours',
    description: 'Réservation en cours d\'exécution',
    color: '#8B5CF6',
    icon: 'play-circle',
    isActive: true,
    sortOrder: 4
  },
  {
    code: 'terminee',
    name: 'Terminée',
    description: 'Réservation terminée avec succès',
    color: '#6B7280',
    icon: 'check-square',
    isActive: true,
    sortOrder: 5
  },
  {
    code: 'annulee',
    name: 'Annulée',
    description: 'Réservation annulée par le client ou l\'administrateur',
    color: '#EF4444',
    icon: 'x-circle',
    isActive: true,
    sortOrder: 6
  },
  {
    code: 'archivée',
    name: 'Archivée',
    description: 'Réservation archivée pour conservation',
    color: '#9CA3AF',
    icon: 'archive',
    isActive: true,
    sortOrder: 7
  },
  {
    code: 'supprimee',
    name: 'Supprimée',
    description: 'Réservation supprimée (soft delete)',
    color: '#374151',
    icon: 'trash-2',
    isActive: true,
    sortOrder: 8
  }
];

// Fonctions utilitaires pour les statuts
export const getBookingStatusByCode = (code: string): Omit<BookingStatus, 'id' | 'createdAt'> | undefined => {
  return BOOKING_STATUSES.find(status => status.code === code);
};

export const getBookingStatusName = (code: string): string => {
  const status = getBookingStatusByCode(code);
  return status?.name || code;
};

export const getBookingStatusColor = (code: string): string => {
  const status = getBookingStatusByCode(code);
  return status?.color || '#6B7280';
};

export const getBookingStatusIcon = (code: string): string => {
  const status = getBookingStatusByCode(code);
  return status?.icon || 'help-circle';
};

export const getBookingStatusDescription = (code: string): string => {
  const status = getBookingStatusByCode(code);
  return status?.description || '';
};

// Fonction pour obtenir les transitions disponibles depuis l'API
export const getAvailableTransitions = async (bookingId: string): Promise<AvailableTransition[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_available_transitions', { p_booking_id: bookingId });

    if (error) {
      console.error('Erreur lors de la récupération des transitions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de l\'appel à get_available_transitions:', error);
    return [];
  }
};

// Fonction pour changer le statut d'une réservation via l'API
export const changeBookingStatus = async (
  bookingId: string,
  newStatusCode: string,
  notes?: string,
  changedBy?: string,
  transitionReason?: string
): Promise<ChangeStatusResponse> => {
  try {
    const { data, error } = await supabase
      .rpc('change_booking_status', {
        p_booking_id: bookingId,
        p_new_status_code: newStatusCode,
        p_notes: notes || null,
        p_changed_by: changedBy || 'system',
        p_transition_reason: transitionReason || null
      });

    if (error) {
      console.error('Erreur lors du changement de statut:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      message: 'Statut changé avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de l\'appel à change_booking_status:', error);
    return {
      success: false,
      error: 'Erreur inattendue lors du changement de statut'
    };
  }
};

// Fonction pour récupérer l'historique des changements de statut
export const getStatusChangeHistory = async (bookingId: string): Promise<BookingStatusChange[]> => {
  try {
    const { data, error } = await supabase
      .from('booking_status_changes')
      .select(`
        *,
        from_status:from_status_id(*),
        to_status:to_status_id(*)
      `)
      .eq('booking_request_id', bookingId)
      .order('changed_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return [];
  }
};

// Fonction pour récupérer tous les statuts actifs
export const getAllActiveStatuses = async (): Promise<BookingStatus[]> => {
  try {
    const { data, error } = await supabase
      .from('booking_statuses')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des statuts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des statuts:', error);
    return [];
  }
};

// Fonction pour récupérer la vue d'ensemble des statuts
export const getStatusOverview = async (): Promise<{
  code: string;
  name: string;
  color: string;
  icon: string;
  count: number;
  sortOrder: number;
}[]> => {
  try {
    const { data, error } = await supabase
      .from('booking_status_overview')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération de la vue d\'ensemble:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération de la vue d\'ensemble:', error);
    return [];
  }
};

// Fonction pour formater l'affichage des statuts
export const formatStatusDisplay = (statusCode: string): {
  name: string;
  color: string;
  icon: string;
  description: string;
  cssClasses: string;
} => {
  const status = getBookingStatusByCode(statusCode);
  
  if (!status) {
    return {
      name: statusCode,
      color: '#6B7280',
      icon: 'help-circle',
      description: 'Statut inconnu',
      cssClasses: 'bg-gray-100 text-gray-800'
    };
  }

  // Générer les classes CSS Tailwind basées sur la couleur
  const getCssClasses = (color: string): string => {
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
    
    return colorMap[color] || 'bg-gray-100 text-gray-800';
  };

  return {
    name: status.name,
    color: status.color,
    icon: status.icon,
    description: status.description,
    cssClasses: getCssClasses(status.color)
  };
};

// Fonction pour vérifier si une transition est autorisée
export const isTransitionAllowed = async (
  fromStatusCode: string,
  toStatusCode: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('booking_status_transitions')
      .select('*')
      .eq('from_status_id', fromStatusCode)
      .eq('to_status_id', toStatusCode)
      .single();

    if (error) {
      return false;
    }

    return !!data;
  } catch (error) {
    return false;
  }
};

// Fonction pour obtenir les prérequis d'une transition
export const getTransitionRequirements = async (
  fromStatusCode: string,
  toStatusCode: string
): Promise<{
  requiresAdminApproval: boolean;
  requiresNotes: boolean;
} | null> => {
  try {
    const { data, error } = await supabase
      .from('booking_status_transitions')
      .select('requires_admin_approval, requires_notes')
      .eq('from_status_id', fromStatusCode)
      .eq('to_status_id', toStatusCode)
      .single();

    if (error) {
      return null;
    }

    return {
      requiresAdminApproval: data.requires_admin_approval,
      requiresNotes: data.requires_notes
    };
  } catch (error) {
    return null;
  }
};
