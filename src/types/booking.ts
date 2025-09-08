// Types pour le système de réservation

export interface ServiceType {
  id: number;
  code: string;
  name: string;
  description: string;
  basePrice: number;
  minDurationHours: number;
  isActive: boolean;
  createdAt: string;
}

// Nouveau système de statuts
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

export interface BookingStatusTransition {
  id: number;
  fromStatusId: number;
  toStatusId: number;
  requiresAdminApproval: boolean;
  requiresNotes: boolean;
  autoActions?: string[];
  createdAt: string;
}

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

export interface BookingRequest {
  id: string;
  status: string; // Legacy field for backward compatibility
  statusId: number; // New field referencing booking_statuses
  createdAt: string;
  updatedAt: string;
  
  // Informations des parents
  parentName: string;
  parentEmail?: string;
  parentPhone: string;
  parentAddress: string;
  
  // Détails de la demande
  serviceType: string;
  requestedDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  
  // Informations sur les enfants
  childrenCount: number;
  childrenDetails: string;
  childrenAges?: string;
  
  // Informations supplémentaires
  specialInstructions?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  
  // Informations de contact
  preferredContactMethod: ContactMethod;
  contactNotes?: string;
  
  // Validation et sécurité
  captchaVerified: boolean;
  ipAddress?: string;
  userAgent?: string;
  
  // Métadonnées
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  
  // Nouveaux champs pour le système de statuts
  statusCode?: string;
  statusName?: string;
  statusColor?: string;
  statusIcon?: string;
  statusDescription?: string;
  
  // Prix estimé
  estimatedTotal?: number;
}

export interface CreateBookingRequest {
  parentName: string;
  parentEmail?: string;
  parentPhone: string;
  parentAddress: string;
  serviceType: string;
  requestedDate: string;
  startTime: string;
  endTime: string;
  childrenCount: number;
  childrenDetails: string;
  childrenAges?: string;
  specialInstructions?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  preferredContactMethod?: ContactMethod;
  contactNotes?: string;
  captchaToken: string;
}

// Legacy interface for backward compatibility
export interface BookingStatusHistory {
  id: string;
  bookingRequestId: string;
  status: string;
  notes?: string;
  changedBy: string;
  changedAt: string;
}

export interface AdminNote {
  id: string;
  bookingRequestId: string;
  note: string;
  adminUserId?: string;
  createdAt: string;
  isInternal: boolean;
}

export interface BookingRequestSummary {
  id: string;
  status: string;
  createdAt: string;
  parentName: string;
  parentPhone: string;
  serviceType: string;
  requestedDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  childrenCount: number;
  serviceName: string;
  basePrice: number;
  estimatedTotal: number;
}

// Nouveau type pour les statuts avec code string
export type BookingStatusCode = 
  | 'nouvelle'      // Nouvelle réservation
  | 'acceptee'      // Réservation acceptée
  | 'confirmee'     // Réservation confirmée
  | 'en_cours'      // En cours
  | 'terminee'      // Terminée
  | 'annulee'       // Annulée
  | 'archivée'      // Archivée
  | 'supprimee';    // Supprimée

// Legacy type for backward compatibility
export type LegacyBookingStatus = 
  | 'pending'      // En attente de contact
  | 'contacted'    // Contacté par l'admin
  | 'confirmed'    // Réservation confirmée
  | 'cancelled'    // Annulée
  | 'completed';   // Terminée

export type ContactMethod = 'phone' | 'email' | 'sms';

export interface CaptchaVerification {
  token: string;
  verified: boolean;
  timestamp: number;
}

export interface BookingFormData {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentAddress: string;
  serviceType: string;
  requestedDate: string;
  startTime: string;
  endTime: string;
  childrenCount: number;
  childrenDetails: string;
  childrenAges: string;
  specialInstructions: string;
  emergencyContact: string;
  emergencyPhone: string;
  preferredContactMethod: ContactMethod;
  captchaToken: string;
}

export interface BookingFormErrors {
  [key: string]: string;
}

export interface BookingFormValidation {
  isValid: boolean;
  errors: BookingFormErrors;
}

// Constantes pour les services
export const SERVICE_TYPES: Omit<ServiceType, 'id' | 'createdAt'>[] = [
  {
    code: 'mariage',
    name: 'Mariage',
    description: 'Garde d\'enfants pour cérémonies de mariage',
    basePrice: 25.00,
    minDurationHours: 4,
    isActive: true
  },
  {
    code: 'urgence',
    name: 'Garde d\'urgence',
    description: 'Garde d\'enfants en urgence',
    basePrice: 30.00,
    minDurationHours: 2,
    isActive: true
  },
  {
    code: 'soiree',
    name: 'Soirée parents',
    description: 'Garde d\'enfants pour soirées entre parents',
    basePrice: 20.00,
    minDurationHours: 3,
    isActive: true
  },
  {
    code: 'weekend',
    name: 'Week-end/Vacances',
    description: 'Garde d\'enfants prolongée',
    basePrice: 18.00,
    minDurationHours: 6,
    isActive: true
  },
  {
    code: 'autre',
    name: 'Autre événement',
    description: 'Autres types de garde d\'enfants',
    basePrice: 22.00,
    minDurationHours: 3,
    isActive: true
  }
];

// Constantes pour les nouveaux statuts
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

// Fonctions utilitaires
export const getServiceTypeByCode = (code: string): Omit<ServiceType, 'id' | 'createdAt'> | undefined => {
  return SERVICE_TYPES.find(service => service.code === code);
};

export const getServiceTypeName = (code: string): string => {
  const service = getServiceTypeByCode(code);
  return service?.name || code;
};

export const getServiceTypePrice = (code: string): number => {
  const service = getServiceTypeByCode(code);
  return service?.basePrice || 0;
};

// Nouvelles fonctions utilitaires pour les statuts
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

export const calculateDuration = (startTime: string, endTime: string): number => {
  // Convertir les heures en minutes pour faciliter le calcul
  const parseTime = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);

  let durationMinutes: number;

  // Si l'heure de fin est avant l'heure de début, c'est le lendemain
  if (endMinutes <= startMinutes) {
    // Ajouter 24 heures (1440 minutes) pour le passage à minuit
    durationMinutes = (1440 - startMinutes) + endMinutes;
  } else {
    // Même jour
    durationMinutes = endMinutes - startMinutes;
  }

  // Convertir en heures avec 2 décimales
  return Math.round((durationMinutes / 60) * 100) / 100;
};

export const calculateEstimatedTotal = (serviceType: string, startTime: string, endTime: string): number => {
  const basePrice = getServiceTypePrice(serviceType);
  const duration = calculateDuration(startTime, endTime);
  return Math.round(basePrice * duration * 100) / 100;
};

// Fonction mise à jour pour le nouveau système de statuts
export const formatBookingStatus = (status: string): string => {
  const statusLabels: Record<string, string> = {
    // Nouveaux statuts
    'nouvelle': 'Nouvelle réservation',
    'acceptee': 'Réservation acceptée',
    'confirmee': 'Réservation confirmée',
    'en_cours': 'En cours',
    'terminee': 'Terminée',
    'annulee': 'Annulée',
    'archivée': 'Archivée',
    'supprimee': 'Supprimée',
    // Legacy statuts pour la compatibilité
    'pending': 'En attente',
    'contacted': 'Contacté',
    'confirmed': 'Confirmé',
    'cancelled': 'Annulé',
    'completed': 'Terminé'
  };
  return statusLabels[status] || status;
};

// Fonction mise à jour pour les couleurs des statuts
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Nouveaux statuts
    'nouvelle': 'bg-yellow-100 text-yellow-800',
    'acceptee': 'bg-blue-100 text-blue-800',
    'confirmee': 'bg-green-100 text-green-800',
    'en_cours': 'bg-purple-100 text-purple-800',
    'terminee': 'bg-gray-100 text-gray-800',
    'annulee': 'bg-red-100 text-red-800',
    'archivée': 'bg-gray-100 text-gray-600',
    'supprimee': 'bg-gray-100 text-gray-900',
    // Legacy statuts pour la compatibilité
    'pending': 'bg-yellow-100 text-yellow-800',
    'contacted': 'bg-blue-100 text-blue-800',
    'confirmed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'completed': 'bg-gray-100 text-gray-800'
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

// Fonction pour obtenir les transitions disponibles (à implémenter avec l'API)
export const getAvailableTransitions = async (bookingId: string): Promise<{
  toStatusCode: string;
  toStatusName: string;
  toStatusColor: string;
  toStatusIcon: string;
  requiresAdminApproval: boolean;
  requiresNotes: boolean;
}[]> => {
  // TODO: Implémenter l'appel à l'API Supabase
  // SELECT * FROM get_available_transitions(booking_id)
  return [];
};

// Fonction pour changer le statut d'une réservation (à implémenter avec l'API)
export const changeBookingStatus = async (
  bookingId: string,
  newStatusCode: string,
  notes?: string,
  changedBy?: string,
  transitionReason?: string
): Promise<boolean> => {
  // TODO: Implémenter l'appel à l'API Supabase
  // SELECT change_booking_status(booking_id, new_status_code, notes, changed_by, transition_reason)
  return false;
};

// Fonction pour formater les dates
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return dateString;
  }
};
