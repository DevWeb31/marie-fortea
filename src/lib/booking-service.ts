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
import { PricingService } from './pricing-service';

export class BookingService {
  // Créer une nouvelle demande de réservation
  static async createBookingRequest(data: CreateBookingRequest): Promise<{ data: BookingRequest | null; error: string | null }> {
    try {
      console.log('🔍 DEBUG BOOKING SERVICE - Données reçues:', {
        serviceType: data.serviceType,
        serviceTypeType: typeof data.serviceType,
        allData: data
      });

      // Validation des données
      const validationError = this.validateBookingData(data);
      if (validationError) {
        return { data: null, error: validationError };
      }

      // Calculer le prix AVANT l'insertion
      
      // Calculer la durée
      const startDateTime = new Date(`${data.requestedDate}T${data.startTime}`);
      const endDateTime = new Date(`${data.requestedDate}T${data.endTime}`);
      
      if (endDateTime <= startDateTime) {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }
      
      const durationMs = endDateTime.getTime() - startDateTime.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      
      
      // Calculer le prix avec le service de prix
      let estimatedTotal = 0;
      try {
        const { data: priceCalculation, error: priceError } = await PricingService.calculatePrice(
          data.serviceType,
          durationHours,
          data.childrenCount
        );
        
        if (priceError) {
          // Utiliser un calcul de fallback simple
          const fallbackPrice = data.serviceType === 'babysitting' ? 15 : 
                               data.serviceType === 'event_support' ? 18 :
                               data.serviceType === 'evening_care' ? 20 : 27;
          estimatedTotal = fallbackPrice * durationHours;
        } else if (priceCalculation) {
          estimatedTotal = priceCalculation.totalAmount;
        } else {
          estimatedTotal = 15 * durationHours; // Fallback
        }
      } catch (error) {
        estimatedTotal = 15 * durationHours; // Fallback simple
      }

      // Préparer les données pour l'insertion avec le prix calculé
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
        captcha_verified: true,
        source: 'website',
        ip_address: null,
        user_agent: navigator.userAgent,
        estimated_total: estimatedTotal // Prix calculé et inclus directement
      };
      
      console.log('🔍 DEBUG BOOKING SERVICE - Données à insérer en base:', {
        service_type: bookingData.service_type,
        service_typeType: typeof bookingData.service_type,
        allBookingData: bookingData
      });

      const { data: result, error } = await supabase
        .from('booking_requests')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        return { data: null, error: 'Erreur lors de la création de la demande' };
      }

      // Le prix est maintenant calculé automatiquement par le trigger de la base de données

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
        utmCampaign: result.utm_campaign,
        estimatedTotal: result.estimated_total
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
      console.log('🔍 DEBUG BOOKING SERVICE - getAllBookingRequests appelé');
      
      const { data, error } = await supabase
        .from('active_booking_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      console.log('🔍 DEBUG BOOKING SERVICE - Réponse Supabase getAllBookingRequests:', {
        dataLength: data?.length || 0,
        error: error?.message || 'Aucune erreur',
        errorCode: error?.code,
        errorDetails: error?.details,
        firstRecord: data?.[0] ? {
          id: data[0].id,
          service_type: data[0].service_type,
          parent_name: data[0].parent_name
        } : 'Aucune donnée',
        allData: data
      });

      if (error) {
        console.error('🔍 DEBUG BOOKING SERVICE - Erreur Supabase:', error);
        return { data: null, error: 'Erreur lors de la récupération des demandes' };
      }

      
      const summaries: BookingRequestSummary[] = data.map(row => ({
        id: row.id,
        status: row.status as BookingStatus,
        createdAt: row.created_at,
        parentName: row.parent_name,
        parentEmail: row.parent_email,
        parentPhone: row.parent_phone,
        serviceType: row.service_type,
        requestedDate: row.requested_date,
        startTime: row.start_time,
        endTime: row.end_time,
        durationHours: row.duration_hours,
        childrenCount: row.children_count,
        childrenDetails: row.children_details,
        specialInstructions: row.special_instructions,
        contactNotes: row.contact_notes,
        serviceName: row.service_name,
        basePrice: row.base_price,
        estimatedTotal: row.estimated_total
      }));
      
      console.log('🔍 DEBUG BOOKING SERVICE - Données mappées:', {
        summariesLength: summaries.length,
        firstSummary: summaries[0] ? {
          id: summaries[0].id,
          serviceType: summaries[0].serviceType,
          parentName: summaries[0].parentName
        } : 'Aucune donnée mappée'
      });

      return { data: summaries, error: null };
    } catch (error) {
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
        return { data: null, error: 'Erreur lors de la mise à jour du statut' };
      }

      // Ajouter une note si fournie
      if (notes) {
        await this.addAdminNote(id, notes);
      }

      return { data: true, error: null };
    } catch (error) {
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
        return { data: null, error: 'Erreur lors de l\'ajout de la note' };
      }

      return { data: true, error: null };
    } catch (error) {
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

    // Vérifier que l'heure de fin est après l'heure de début (en tenant compte du passage à minuit)
    const startTime = new Date(`2000-01-01T${data.startTime}`);
    const endTime = new Date(`2000-01-01T${data.endTime}`);
    
    // Si l'heure de fin est avant l'heure de début, c'est le lendemain
    if (endTime <= startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    
    // Vérifier la durée minimale (3 heures)
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
      
      // D'abord, vérifier l'état actuel de la réservation
      const { data: checkData, error: checkError } = await supabase
        .from('booking_requests')
        .select('id, deleted_at, archived_at, status')
        .eq('id', id)
        .single();

      if (checkError) {
        return { data: null, error: `Erreur lors de la vérification: ${checkError.message}` };
      }

      if (!checkData) {
        return { data: null, error: 'Réservation non trouvée' };
      }

      if (checkData.deleted_at) {
        return { data: null, error: 'Réservation déjà dans la corbeille' };
      }

      if (checkData.archived_at) {
        return { data: null, error: 'Réservation déjà archivée' };
      }

      // Mise à jour directe de la table
      const { data: directData, error: directError } = await supabase
        .from('booking_requests')
        .update({ 
          deleted_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('id, deleted_at');

      if (directError) {
        return { data: null, error: `Erreur lors de la mise en corbeille: ${directError.message}` };
      }

      if (directData && directData.length > 0) {
        return { data: true, error: null };
      } else {
        return { data: null, error: 'Problème de permissions - impossible de mettre à jour la réservation' };
      }
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors de la mise en corbeille' };
    }
  }

    // Restaurer une réservation depuis la corbeille
  static async restoreFromTrash(id: string): Promise<{ data: boolean | null; error: string | null }> {
    try {
      // Mise à jour directe de la table (plus fiable que RPC)
      const { data, error } = await supabase
        .from('booking_requests')
        .update({ 
          deleted_at: null
        })
        .eq('id', id)
        .not('deleted_at', 'is', null) // S'assurer qu'elle est bien dans la corbeille
        .select('id, deleted_at');

      if (error) {
        return { data: null, error: `Erreur lors de la restauration: ${error.message}` };
      }

      if (data && data.length > 0) {
        return { data: true, error: null };
      } else {
        return { data: null, error: 'Aucune réservation trouvée ou pas dans la corbeille' };
      }
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors de la restauration' };
    }
  }

  // Archiver une réservation
  static async archiveBooking(id: string): Promise<{ data: boolean | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .rpc('archive_booking_request', { booking_id: id });

      if (error) {
        return { data: null, error: 'Erreur lors de l\'archivage' };
      }

      // Vérifier que la fonction a bien mis à jour une ligne
      if (data === false) {
        return { data: null, error: 'Aucune réservation trouvée ou déjà archivée' };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors de l\'archivage' };
    }
  }

  // Désarchiver une réservation
  static async unarchiveBooking(id: string): Promise<{ data: boolean | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .rpc('unarchive_booking_request', { booking_id: id });

      if (error) {
        return { data: null, error: 'Erreur lors de la désarchivage' };
      }

      // Vérifier que la fonction a bien mis à jour une ligne
      if (data === false) {
        return { data: null, error: 'Aucune réservation trouvée ou pas archivée' };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors de la désarchivage' };
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
        .from('trashed_booking_requests')
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
        parentEmail: row.parent_email,
        parentPhone: row.parent_phone,
        serviceType: row.service_type,
        requestedDate: row.requested_date,
        startTime: row.start_time,
        endTime: row.end_time,
        durationHours: row.duration_hours,
        childrenCount: row.children_count,
        childrenDetails: row.children_details,
        specialInstructions: row.special_instructions,
        contactNotes: row.contact_notes,
        serviceName: row.service_name,
        basePrice: row.base_price,
        estimatedTotal: row.estimated_total
      }));

      return { data: summaries, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors de la récupération des réservations supprimées' };
    }
  }

  // Récupérer les réservations archivées
  static async getArchivedBookingRequests(): Promise<{ data: BookingRequestSummary[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('archived_booking_requests')
        .select('*')
        .order('archived_at', { ascending: false });

      if (error) {
        return { data: null, error: 'Erreur lors de la récupération des réservations archivées' };
      }

      const summaries: BookingRequestSummary[] = data.map(row => ({
        id: row.id,
        status: row.status as BookingStatus,
        createdAt: row.created_at,
        parentName: row.parent_name,
        parentEmail: row.parent_email,
        parentPhone: row.parent_phone,
        serviceType: row.service_type,
        requestedDate: row.requested_date,
        startTime: row.start_time,
        endTime: row.end_time,
        durationHours: row.duration_hours,
        childrenCount: row.children_count,
        childrenDetails: row.children_details,
        specialInstructions: row.special_instructions,
        contactNotes: row.contact_notes,
        serviceName: row.service_name,
        basePrice: row.base_price,
        estimatedTotal: row.estimated_total
      }));

      return { data: summaries, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors de la récupération des réservations archivées' };
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
