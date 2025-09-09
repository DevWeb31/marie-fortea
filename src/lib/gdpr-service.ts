import { supabase } from './supabase';
import { EmailService } from './email-service';

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface DataExportRequest {
  userEmail: string;
  exportType?: 'full' | 'partial';
}

export interface SecureDownloadToken {
  token: string;
  expiresAt: string;
  userEmail: string;
  used: boolean;
}

export interface DataDeletionRequest {
  userEmail: string;
  userPhone?: string;
  reason: string;
}

export interface ConsentRecord {
  id: string;
  userEmail: string;
  consentType: string;
  consentGiven: boolean;
  consentDate: string;
  consentVersion: string;
}

export class GDPRService {
  /**
   * Enregistrer les préférences de consentement
   */
  static async saveConsentPreferences(
    userEmail: string,
    preferences: ConsentPreferences,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const consentTypes = [
        { type: 'necessary', given: preferences.necessary },
        { type: 'functional', given: preferences.functional },
        { type: 'analytics', given: preferences.analytics },
        { type: 'marketing', given: preferences.marketing }
      ];

      // Enregistrer chaque type de consentement
      for (const consent of consentTypes) {
        const { error } = await supabase
          .from('gdpr_consents')
          .insert({
            user_email: userEmail,
            consent_type: consent.type,
            consent_given: consent.given,
            consent_date: new Date().toISOString(),
            consent_version: '1.0',
            ip_address: ipAddress,
            user_agent: userAgent
          });

        if (error) {
          console.error('Erreur lors de l\'enregistrement du consentement:', error);
          return { success: false, error: error.message };
        }
      }

      // Sauvegarder aussi dans le localStorage pour l'interface
      localStorage.setItem('gdpr-consent', JSON.stringify(preferences));
      localStorage.setItem('gdpr-consent-date', new Date().toISOString());

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
      return { success: false, error: 'Erreur lors de la sauvegarde des préférences' };
    }
  }

  /**
   * Récupérer les préférences de consentement
   */
  static async getConsentPreferences(userEmail: string): Promise<{
    data: ConsentPreferences | null;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('gdpr_consents')
        .select('*')
        .eq('user_email', userEmail)
        .order('consent_date', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data || data.length === 0) {
        return { data: null };
      }

      // Convertir les données en format ConsentPreferences
      const preferences: ConsentPreferences = {
        necessary: true, // Toujours true
        analytics: false,
        marketing: false,
        functional: false
      };

      data.forEach(record => {
        switch (record.consent_type) {
          case 'analytics':
            preferences.analytics = record.consent_given;
            break;
          case 'marketing':
            preferences.marketing = record.consent_given;
            break;
          case 'functional':
            preferences.functional = record.consent_given;
            break;
        }
      });

      return { data: preferences };
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error);
      return { data: null, error: 'Erreur lors de la récupération des préférences' };
    }
  }

  /**
   * Vérifier si un utilisateur a des données en base
   */
  static async checkUserDataExists(userEmail: string): Promise<{
    hasData: boolean;
    dataCount?: number;
    error?: string;
  }> {
    try {
      // Vérifier les réservations
      const { data: bookings, error: bookingsError } = await supabase
        .from('booking_requests')
        .select('id')
        .eq('parent_email', userEmail);

      if (bookingsError) {
        return { hasData: false, error: bookingsError.message };
      }

      const bookingCount = bookings?.length || 0;
      const hasData = bookingCount > 0;

      return { 
        hasData, 
        dataCount: bookingCount 
      };
    } catch (error) {
      console.error('Erreur lors de la vérification des données:', error);
      return { hasData: false, error: 'Erreur lors de la vérification des données' };
    }
  }

  /**
   * Demander l'export des données (envoie un email avec lien sécurisé)
   */
  static async requestDataExport(request: DataExportRequest): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Vérifier d'abord si l'utilisateur a des données
      const checkResult = await this.checkUserDataExists(request.userEmail);
      if (checkResult.error) {
        return { success: false, error: checkResult.error };
      }

      // SÉCURITÉ : Ne pas envoyer d'email si l'adresse n'existe pas en base
      if (!checkResult.hasData) {
        console.log(`Tentative d'export pour une adresse email inexistante: ${request.userEmail}`);
        
        // Enregistrer l'audit pour traçabilité (sans envoyer d'email)
        await supabase
          .from('data_access_audit')
          .insert({
            user_email: request.userEmail,
            action: 'export_request_denied',
            table_name: 'booking_requests',
            metadata: {
              reason: 'email_not_found_in_database',
              data_count: 0,
              email_sent: false
            }
          });

        // Retourner un succès mais sans envoyer d'email
        // L'utilisateur verra le message de succès mais ne recevra pas d'email
        return { success: true };
      }

      // L'utilisateur a des données, procéder à l'export
      const token = this.generateSecureToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

      // Créer l'enregistrement du token
      const { error: tokenError } = await supabase
        .from('secure_download_tokens')
        .insert({
          token: token,
          user_email: request.userEmail,
          expires_at: expiresAt.toISOString(),
          used: false,
          export_type: request.exportType || 'full'
        });

      if (tokenError) {
        return { success: false, error: tokenError.message };
      }

      // Envoyer l'email avec le lien sécurisé
      const downloadUrl = `${window.location.origin}/data-download/${token}`;
      
      // Utiliser le service d'email pour envoyer l'email d'export
      const emailResult = await EmailService.sendDataExportEmail(
        request.userEmail, 
        downloadUrl, 
        true // hasData est toujours true ici car on a vérifié plus haut
      );

      if (emailResult.error) {
        console.error('Erreur lors de l\'envoi de l\'email d\'export:', emailResult.error);
        return { success: false, error: `Erreur lors de l'envoi de l'email: ${emailResult.error}` };
      }

      console.log(`Email d'export envoyé à ${request.userEmail} avec le lien: ${downloadUrl}`);

      // Enregistrer l'audit
      await supabase
        .from('data_access_audit')
        .insert({
          user_email: request.userEmail,
          action: 'export_request',
          table_name: 'secure_download_tokens',
          metadata: {
            token: token,
            expires_at: expiresAt.toISOString(),
            has_data: true,
            data_count: checkResult.dataCount,
            email_sent: true
          }
        });

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la demande d\'export:', error);
      return { success: false, error: 'Erreur lors de la demande d\'export' };
    }
  }

  /**
   * Valider un token de téléchargement et récupérer les données
   */
  static async validateDownloadToken(token: string): Promise<{
    data: any | null;
    error?: string;
  }> {
    try {
      // Vérifier le token
      const { data: tokenData, error: tokenError } = await supabase
        .from('secure_download_tokens')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .single();

      if (tokenError || !tokenData) {
        return { data: null, error: 'Token invalide ou déjà utilisé' };
      }

      // Vérifier l'expiration
      const now = new Date();
      const expiresAt = new Date(tokenData.expires_at);
      if (now > expiresAt) {
        return { data: null, error: 'Token expiré' };
      }

      // Récupérer les données utilisateur
      const result = await this.exportUserData({
        userEmail: tokenData.user_email,
        exportType: tokenData.export_type
      });

      if (result.error) {
        return { data: null, error: result.error };
      }

      // Vérifier si des données existent
      if (!result.data || !result.data.user_data || 
          (!result.data.user_data.bookings || result.data.user_data.bookings.length === 0)) {
        return { data: null, error: 'Aucune donnée trouvée pour cette adresse email' };
      }

      return { data: result.data };
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error);
      return { data: null, error: 'Erreur lors de la validation du token' };
    }
  }

  /**
   * Invalider un token après utilisation
   */
  static async invalidateDownloadToken(token: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { error } = await supabase
        .from('secure_download_tokens')
        .update({ used: true, used_at: new Date().toISOString() })
        .eq('token', token);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'invalidation du token:', error);
      return { success: false, error: 'Erreur lors de l\'invalidation du token' };
    }
  }

  /**
   * Générer un token sécurisé
   */
  private static generateSecureToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Exporter les données personnelles (version interne)
   */
  static async exportUserData(request: DataExportRequest): Promise<{
    data: any | null;
    error?: string;
  }> {
    try {
      // Créer l'enregistrement d'export
      const { data: exportRecord, error: exportError } = await supabase
        .from('data_exports')
        .insert({
          user_email: request.userEmail,
          export_type: request.exportType || 'full',
          status: 'pending',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 jours
        })
        .select()
        .single();

      if (exportError) {
        return { data: null, error: exportError.message };
      }

      // Récupérer les données de réservation
      const { data: bookings, error: bookingsError } = await supabase
        .from('booking_requests')
        .select('*')
        .eq('parent_email', request.userEmail);

      if (bookingsError) {
        return { data: null, error: bookingsError.message };
      }

      // Récupérer les détails des enfants
      const bookingIds = bookings?.map(b => b.id) || [];
      let childrenDetails = [];
      if (bookingIds.length > 0) {
        const { data: children, error: childrenError } = await supabase
          .from('children_details')
          .select('*')
          .in('booking_request_id', bookingIds);

        if (childrenError) {
          console.warn('Erreur lors de la récupération des détails des enfants:', childrenError);
        } else {
          childrenDetails = children || [];
        }
      }

      // Récupérer les consentements
      const { data: consents, error: consentsError } = await supabase
        .from('gdpr_consents')
        .select('*')
        .eq('user_email', request.userEmail);

      if (consentsError) {
        console.warn('Erreur lors de la récupération des consentements:', consentsError);
      }

      // Préparer les données d'export
      const exportData = {
        export_info: {
          export_id: exportRecord.id,
          user_email: request.userEmail,
          export_date: new Date().toISOString(),
          export_type: request.exportType || 'full',
          total_bookings: bookings?.length || 0,
          total_children: childrenDetails.length
        },
        user_data: {
          bookings: bookings || [],
          children_details: childrenDetails,
          consents: consents || []
        },
        metadata: {
          generated_at: new Date().toISOString(),
          data_categories: ['bookings', 'children_details', 'consents'],
          retention_info: {
            bookings_retained_until: bookings?.map(b => b.data_retention_until) || [],
            deletion_policy: 'Les données sont conservées 3 ans après la dernière prestation'
          }
        }
      };

      // Mettre à jour le statut de l'export
      await supabase
        .from('data_exports')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          file_size: JSON.stringify(exportData).length
        })
        .eq('id', exportRecord.id);

      // Enregistrer l'audit
      await supabase
        .from('data_access_audit')
        .insert({
          user_email: request.userEmail,
          action: 'export',
          table_name: 'booking_requests',
          metadata: {
            export_id: exportRecord.id,
            record_count: bookings?.length || 0
          }
        });

      return { data: exportData };
    } catch (error) {
      console.error('Erreur lors de l\'export des données:', error);
      return { data: null, error: 'Erreur lors de l\'export des données' };
    }
  }

  /**
   * Demander la suppression des données
   */
  static async requestDataDeletion(request: DataDeletionRequest): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Créer la demande de suppression
      const { error } = await supabase
        .from('data_deletion_requests')
        .insert({
          user_email: request.userEmail,
          user_phone: request.userPhone,
          deletion_reason: request.reason,
          status: 'pending'
        });

      if (error) {
        return { success: false, error: error.message };
      }

      // Marquer les réservations pour suppression
      const { error: updateError } = await supabase
        .from('booking_requests')
        .update({
          deletion_requested: true,
          deletion_requested_at: new Date().toISOString(),
          deletion_reason: request.reason
        })
        .eq('parent_email', request.userEmail);

      if (updateError) {
        console.warn('Erreur lors de la mise à jour des réservations:', updateError);
      }

      // Enregistrer l'audit
      await supabase
        .from('data_access_audit')
        .insert({
          user_email: request.userEmail,
          action: 'delete_request',
          table_name: 'booking_requests',
          metadata: {
            reason: request.reason,
            phone: request.userPhone
          }
        });

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la demande de suppression:', error);
      return { success: false, error: 'Erreur lors de la demande de suppression' };
    }
  }

  /**
   * Vérifier si l'utilisateur a donné son consentement
   */
  static async hasUserConsented(userEmail: string): Promise<{
    data: boolean | null;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('gdpr_consents')
        .select('consent_given')
        .eq('user_email', userEmail)
        .eq('consent_type', 'necessary')
        .order('consent_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data?.consent_given || false };
    } catch (error) {
      console.error('Erreur lors de la vérification du consentement:', error);
      return { data: null, error: 'Erreur lors de la vérification du consentement' };
    }
  }

  /**
   * Obtenir l'historique des exports
   */
  static async getExportHistory(userEmail: string): Promise<{
    data: any[] | null;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('data_exports')
        .select('*')
        .eq('user_email', userEmail)
        .order('requested_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return { data: null, error: 'Erreur lors de la récupération de l\'historique' };
    }
  }

  /**
   * Obtenir l'historique des demandes de suppression
   */
  static async getDeletionHistory(userEmail: string): Promise<{
    data: any[] | null;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('data_deletion_requests')
        .select('*')
        .eq('user_email', userEmail)
        .order('requested_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return { data: null, error: 'Erreur lors de la récupération de l\'historique' };
    }
  }

  /**
   * Nettoyer les données expirées (fonction admin)
   */
  static async cleanupExpiredData(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { error } = await supabase.rpc('cleanup_expired_data');

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur lors du nettoyage des données:', error);
      return { success: false, error: 'Erreur lors du nettoyage des données' };
    }
  }
}
