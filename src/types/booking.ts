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

export interface BookingRequest {
  id: string;
  status: BookingStatus;
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

export interface BookingStatusHistory {
  id: string;
  bookingRequestId: string;
  status: BookingStatus;
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
  status: BookingStatus;
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

export type BookingStatus = 
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

export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diffMs = end.getTime() - start.getTime();
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
};

export const calculateEstimatedTotal = (serviceType: string, startTime: string, endTime: string): number => {
  const basePrice = getServiceTypePrice(serviceType);
  const duration = calculateDuration(startTime, endTime);
  return Math.round(basePrice * duration * 100) / 100;
};

export const formatBookingStatus = (status: BookingStatus): string => {
  const statusLabels: Record<BookingStatus, string> = {
    pending: 'En attente',
    contacted: 'Contacté',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
    completed: 'Terminé'
  };
  return statusLabels[status] || status;
};

export const getStatusColor = (status: BookingStatus): string => {
  const statusColors: Record<BookingStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    contacted: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-800'
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
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
