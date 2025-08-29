import { supabase } from './supabase';
import {
  BookingRequest,
  CreateBookingRequest,
  BookingRequestSummary,
  ServiceType,
  BookingStatus,
  ContactMethod
} from '@/types/booking';
import { EmailService } from './email-service';

export class BookingService {
  // Créer une nouvelle demande de réservation
  static async createBookingRequest(data: CreateBookingRequest): Promise<{ data: BookingRequest | null; error: string | null }> {
    try {
      // Validation des données
      const validationError = this.validateBookingData(data);
      if (validationError) {
        return { data: null, error: validationError };
      }

      // Préparer les données pour l'insertion
      const bookingData = {
        parent_name: data.parentName,
        parent_email: data.parentEmail || null,
        parent_phone: data.parentPhone,
        parent_address: data.parentAddress,
        service_type: data.serviceType,
        requested_date: data.requestedDate,
        start_time: data.startTime,
        end_time: data.endTime,
        children_count: data.childrenCount,
        children_details: data.childrenDetails,
        children_ages: data.childrenAges || null,
        special_instructions: data.specialInstructions || null,
        emergency_contact: data.emergencyContact || null,
        emergency_phone: data.emergencyPhone || null,
        preferred_contact_method: data.preferredContactMethod || 'phone',
        contact_notes: data.contactNotes || null,
        captcha_verified: true, // Le captcha est vérifié côté client
        source: 'website',
        ip_address: null, // Sera rempli côté serveur si nécessaire
        user_agent: navigator.userAgent
      };



      const { data: result, error } = await supabase
        .from('booking_requests')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        return { data: null, error: 'Erreur lors de la création de la demande' };
      }

      // Convertir les données de la base vers notre format
      const bookingRequest: BookingRequest = {
        id: result.id,
        status: result.status as BookingStatus,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        parentName: result.parent_name,
        parentEmail: result.parent_email,
        parentPhone: result.parent_phone,
        parentAddress: result.parent_address,
        serviceType: result.service_type,
        requestedDate: result.requested_date,
        startTime: result.start_time,
        endTime: result.end_time,
        durationHours: result.duration_hours,
        childrenCount: result.children_count,
        childrenDetails: result.children_details,
        childrenAges: result.children_ages,
        specialInstructions: result.special_instructions,
        emergencyContact: result.emergency_contact,
        emergencyPhone: result.emergency_phone,
        preferredContactMethod: result.preferred_contact_method as ContactMethod,
        contactNotes: result.contact_notes,
        captchaVerified: result.captcha_verified,
        ipAddress: result.ip_address,
        userAgent: result.user_agent,
        source: result.source,
        utmSource: result.utm_source,
        utmMedium: result.utm_medium,
        utmCampaign: result.utm_campaign
      };

      // Envoyer une notification par email
      try {
        await EmailService.sendBookingNotification(bookingRequest);
      } catch (emailError) {
        // Ne pas échouer la création de la réservation si l'email échoue
      }
      return { data: bookingRequest, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors de la création de la demande' };
    }
  }

  // Récupérer toutes les demandes actives (pour l'administration)
  static async getAllBookingRequests(): Promise<{ data: BookingRequestSummary[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('active_booking_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
        return { data: null, error: 'Erreur lors de la récupération des demandes' };
      }

      const summaries: BookingRequestSummary[] = data.map(row => ({
        id: row.id,
        status: row.status as BookingStatus,
        createdAt: row.created_at,
        parentName: row.parent_name,
        parentPhone: row.parent_phone,
        serviceType: row.service_type,
        requestedDate: row.requested_date,
        startTime: row.start_time,
        endTime: row.end_time,
        durationHours: row.duration_hours,
        childrenCount: row.children_count,
        serviceName: row.service_name,
        basePrice: row.base_price,
        estimatedTotal: row.estimated_total
      }));

      return { data: summaries, error: null };
    } catch (error) {
      console.error('Erreur inattendue lors de la récupération des demandes:', error);
      return { data: null, error: 'Erreur inattendue lors de la récupération des demandes' };
    }
  }

  // Récupérer une demande par ID
  static async getBookingRequestById(id: string): Promise<{ data: BookingRequest | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de la demande:', error);
        return { data: null, error: 'Erreur lors de la récupération de la demande' };
      }

      const bookingRequest: BookingRequest = {
        id: data.id,
        status: data.status as BookingStatus,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        parentName: data.parent_name,
        parentEmail: data.parent_email,
        parentPhone: data.parent_phone,
        parentAddress: data.parent_address,
        serviceType: data.service_type,
        requestedDate: data.requested_date,
        startTime: data.start_time,
        endTime: data.end_time,
        durationHours: data.duration_hours,
        childrenCount: data.children_count,
        childrenDetails: data.children_details,
        childrenAges: data.children_ages,
        specialInstructions: data.special_instructions,
        emergencyContact: data.emergency_contact,
        emergencyPhone: data.emergency_phone,
        preferredContactMethod: data.preferred_contact_method as ContactMethod,
        contactNotes: data.contact_notes,
        captchaVerified: data.captcha_verified,
        ipAddress: data.ip_address,
        userAgent: data.user_agent,
        source: data.source,
        utmSource: data.utm_source,
        utmMedium: data.utm_medium,
        utmCampaign: data.utm_campaign
      };

      return { data: bookingRequest, error: null };
    } catch (error) {
      console.error('Erreur inattendue lors de la récupération de la demande:', error);
      return { data: null, error: 'Erreur inattendue lors de la récupération de la demande' };
    }
  }

  // Mettre à jour le statut d'une demande
  static async updateBookingStatus(id: string, status: BookingStatus, notes?: string): Promise<{ data: boolean | null; error: string | null }> {
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        return { data: null, error: 'Erreur lors de la mise à jour du statut' };
      }

      // Ajouter une note si fournie
      if (notes) {
        await this.addAdminNote(id, notes);
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Erreur inattendue lors de la mise à jour du statut:', error);
      return { data: null, error: 'Erreur inattendue lors de la mise à jour du statut' };
    }
  }

  // Ajouter une note administrative
  static async addAdminNote(bookingRequestId: string, note: string, isInternal: boolean = false): Promise<{ data: boolean | null; error: string | null }> {
    try {
      const { error } = await supabase
        .from('admin_notes')
        .insert({
          booking_request_id: bookingRequestId,
          note,
          is_internal: isInternal
        });

      if (error) {
        console.error('Erreur lors de l\'ajout de la note:', error);
        return { data: null, error: 'Erreur lors de l\'ajout de la note' };
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Erreur inattendue lors de l\'ajout de la note:', error);
      return { data: null, error: 'Erreur inattendue lors de l\'ajout de la note' };
    }
  }

  // Récupérer les types de services
  static async getServiceTypes(): Promise<{ data: ServiceType[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('service_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Erreur lors de la récupération des types de services:', error);
        return { data: null, error: 'Erreur lors de la récupération des types de services' };
      }

      const serviceTypes: ServiceType[] = data.map(row => ({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description,
        basePrice: row.base_price,
        minDurationHours: row.min_duration_hours,
        isActive: row.is_active,
        createdAt: row.created_at
      }));

      return { data: serviceTypes, error: null };
    } catch (error) {
      console.error('Erreur inattendue lors de la récupération des types de services:', error);
      return { data: null, error: 'Erreur inattendue lors de la récupération des types de services' };
    }
  }

  // Validation des données de réservation
  private static validateBookingData(data: CreateBookingRequest): string | null {
    if (!data.parentName?.trim()) {
      return 'Le nom du parent est requis';
    }

    if (!data.parentPhone?.trim()) {
      return 'Le téléphone du parent est requis';
    }

    // L'adresse n'est plus obligatoire dans le formulaire simplifié
    // if (!data.parentAddress?.trim()) {
    //   return 'L\'adresse de garde est requise';
    // }

    if (!data.serviceType?.trim()) {
      return 'Le type de service est requis';
    }

    if (!data.requestedDate) {
      return 'La date de garde est requise';
    }

    if (!data.startTime) {
      return 'L\'heure de début est requise';
    }

    if (!data.endTime) {
      return 'L\'heure de fin est requise';
    }

    if (data.childrenCount < 1 || data.childrenCount > 10) {
      return 'Le nombre d\'enfants doit être entre 1 et 10';
    }

    // Les détails des enfants sont maintenant générés automatiquement
    // if (!data.childrenDetails?.trim()) {
    //   return 'Les détails des enfants sont requis';
    // }

    // Vérifier que la date n'est pas dans le passé
    const requestedDate = new Date(data.requestedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (requestedDate < today) {
      return 'La date de garde ne peut pas être dans le passé';
    }

    // Vérifier que l'heure de fin est après l'heure de début
    if (data.startTime >= data.endTime) {
      return 'L\'heure de fin doit être après l\'heure de début';
    }

    // Vérifier la durée minimale (3 heures)
    const startTime = new Date(`2000-01-01T${data.startTime}`);
    const endTime = new Date(`2000-01-01T${data.endTime}`);
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    
    if (durationHours < 3) {
      return 'La durée minimale de garde est de 3 heures';
    }

    if (!data.captchaToken?.trim()) {
      return 'La vérification du captcha est requise';
    }

    return null;
  }

  // Obtenir les statistiques des demandes
  static async getBookingStatistics(): Promise<{ data: any | null; error: string | null }> {
    try {
      // Compter les demandes par statut
      const { data: statusCounts, error: statusError } = await supabase
        .from('booking_requests')
        .select('status');

      if (statusError) {
        return { data: null, error: 'Erreur lors de la récupération des statistiques' };
      }

      const stats = {
        total: statusCounts.length,
        pending: statusCounts.filter(r => r.status === 'pending').length,
        contacted: statusCounts.filter(r => r.status === 'contacted').length,
        confirmed: statusCounts.filter(r => r.status === 'confirmed').length,
        cancelled: statusCounts.filter(r => r.status === 'cancelled').length,
        completed: statusCounts.filter(r => r.status === 'completed').length
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur lors de la récupération des statistiques' };
    }
  }

  // ===== GESTION DE LA CORBEILLE =====

  // Mettre une réservation dans la corbeille (soft delete)
static async moveToTrash(id: string): Promise<{ data: boolean | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .rpc('soft_delete_booking_request', { booking_id: id });

    if (error) {
      return { data: null, error: 'Erreur lors de la mise en corbeille' };
    }

    // Vérifier que la fonction a bien mis à jour une ligne
    if (data === false) {
      return { data: null, error: 'Aucune réservation trouvée ou déjà dans la corbeille' };
    }

    return { data: true, error: null };
  } catch (error) {
    return { data: null, error: 'Erreur inattendue lors de la mise en corbeille' };
  }
}

  // Restaurer une réservation depuis la corbeille
static async restoreFromTrash(id: string): Promise<{ data: boolean | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .rpc('restore_booking_request', { booking_id: id });

    if (error) {
      return { data: null, error: 'Erreur lors de la restauration' };
    }

    // Vérifier que la fonction a bien mis à jour une ligne
    if (data === false) {
      return { data: null, error: 'Aucune réservation trouvée ou pas dans la corbeille' };
    }

    return { data: true, error: null };
  } catch (error) {
    return { data: null, error: 'Erreur inattendue lors de la restauration' };
  }
}

  // Supprimer définitivement une réservation (hard delete)
  static async permanentlyDelete(id: string): Promise<{ data: boolean | null; error: string | null }> {
    try {
      const { error } = await supabase
        .rpc('hard_delete_booking_request', { booking_id: id });

      if (error) {
        return { data: null, error: 'Erreur lors de la suppression définitive' };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors de la suppression définitive' };
    }
  }

  // Récupérer toutes les réservations dans la corbeille
  static async getDeletedBookingRequests(): Promise<{ data: BookingRequestSummary[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('deleted_booking_requests')
        .select('*')
        .order('deleted_at', { ascending: false });

      if (error) {
        return { data: null, error: 'Erreur lors de la récupération des réservations supprimées' };
      }

      const summaries: BookingRequestSummary[] = data.map(row => ({
        id: row.id,
        status: row.status as BookingStatus,
        createdAt: row.created_at,
        parentName: row.parent_name,
        parentPhone: row.parent_phone,
        serviceType: row.service_type,
        requestedDate: row.requested_date,
        startTime: row.start_time,
        endTime: row.end_time,
        durationHours: row.duration_hours,
        childrenCount: row.children_count,
        serviceName: row.service_name,
        basePrice: row.base_price,
        estimatedTotal: row.estimated_total
      }));

      return { data: summaries, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors de la récupération des réservations supprimées' };
    }
  }

  // Nettoyer automatiquement les réservations supprimées après X mois
  static async cleanupDeletedBookings(monthsToKeep: number = 12): Promise<{ data: number | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .rpc('cleanup_deleted_bookings', { months_to_keep: monthsToKeep });

      if (error) {
        return { data: null, error: 'Erreur lors du nettoyage automatique' };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors du nettoyage automatique' };
    }
  }
}
