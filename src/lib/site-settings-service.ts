import { supabase } from './supabase';

export interface SiteSettings {
  id: number;
  key: string;
  value: string;
  updatedAt: Date;
}

export class SiteSettingsService {
  // Récupérer tous les paramètres du site
  static async getAllSettings(): Promise<{ data: SiteSettings[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');

      if (error) {
        return { data: null, error: 'Erreur lors de la récupération des paramètres' };
      }

      const settings: SiteSettings[] = data.map(row => ({
        id: row.id,
        key: row.key,
        value: row.value,
        updatedAt: new Date(row.updated_at)
      }));

      return { data: settings, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur inattendue lors de la récupération des paramètres' };
    }
  }

  // Récupérer un paramètre par sa clé
  static async getSettingByKey(key: string): Promise<{ data: string | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single();

      if (error) {
        return { data: null, error: `Erreur lors de la récupération du paramètre ${key}` };
      }

      return { data: data.value, error: null };
    } catch (error) {
      return { data: null, error: `Erreur inattendue lors de la récupération du paramètre ${key}` };
    }
  }

  // Mettre à jour un paramètre
  static async updateSetting(key: string, value: string): Promise<{ data: boolean | null; error: string | null }> {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          value,
          updated_at: new Date().toISOString()
        })
        .eq('key', key);

      if (error) {
        return { data: null, error: `Erreur lors de la mise à jour du paramètre ${key}` };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: `Erreur inattendue lors de la mise à jour du paramètre ${key}` };
    }
  }

  // Créer un nouveau paramètre
  static async createSetting(key: string, value: string): Promise<{ data: boolean | null; error: string | null }> {
    try {
      const { error } = await supabase
        .from('site_settings')
        .insert({ 
          key,
          value,
          updated_at: new Date().toISOString()
        });

      if (error) {
        return { data: null, error: `Erreur lors de la création du paramètre ${key}` };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: `Erreur inattendue lors de la création du paramètre ${key}` };
    }
  }

  // Créer ou mettre à jour un paramètre (upsert)
  static async upsertSetting(key: string, value: string): Promise<{ data: boolean | null; error: string | null }> {
    try {
      // Vérifier si le paramètre existe
      const { data: existingSetting } = await this.getSettingByKey(key);
      
      if (existingSetting !== null) {
        // Le paramètre existe, le mettre à jour
        return await this.updateSetting(key, value);
      } else {
        // Le paramètre n'existe pas, le créer
        return await this.createSetting(key, value);
      }
    } catch (error) {
      return { data: null, error: `Erreur lors de l'upsert du paramètre ${key}` };
    }
  }

  // Récupérer l'email de notification des réservations
  static async getBookingNotificationEmail(): Promise<{ data: string | null; error: string | null }> {
    return await this.getSettingByKey('booking_notification_email');
  }

  // Vérifier si les notifications par email sont activées
  static async areEmailNotificationsEnabled(): Promise<{ data: boolean | null; error: string | null }> {
    const result = await this.getSettingByKey('enable_booking_email_notifications');
    if (result.error) {
      return { data: null, error: result.error };
    }
    
    return { data: result.data === 'true', error: null };
  }

  // Récupérer le template d'email
  static async getEmailTemplate(): Promise<{ data: string | null; error: string | null }> {
    return await this.getSettingByKey('booking_email_template');
  }

  // Récupérer tous les paramètres SMTP
  static async getSmtpSettings(): Promise<{ data: { [key: string]: string } | null; error: string | null }> {
    try {
      const smtpKeys = ['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'smtp_from', 'smtp_encryption'];
      const settings: { [key: string]: string } = {};

      for (const key of smtpKeys) {
        const result = await this.getSettingByKey(key);
        if (result.error) {
          return { data: null, error: `Erreur lors de la récupération de ${key}: ${result.error}` };
        }
        settings[key] = result.data || '';
      }

      return { data: settings, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur lors de la récupération des paramètres SMTP' };
    }
  }

  // Vérifier si la configuration SMTP est complète
  static async isSmtpConfigured(): Promise<{ data: boolean | null; error: string | null }> {
    try {
      const smtpSettings = await this.getSmtpSettings();
      if (smtpSettings.error) {
        return { data: null, error: smtpSettings.error };
      }

      if (!smtpSettings.data) {
        return { data: false, error: null };
      }

      // Vérifier que les paramètres essentiels sont remplis
      const requiredFields = ['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password'];
      const isConfigured = requiredFields.every(field => 
        smtpSettings.data[field] && smtpSettings.data[field].trim() !== ''
      );

      return { data: isConfigured, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur lors de la vérification de la configuration SMTP' };
    }
  }

  // Tester la configuration SMTP
  static async testSmtpConnection(): Promise<{ data: boolean | null; error: string | null }> {
    try {
      // Cette méthode sera implémentée pour tester la connexion SMTP
      // Pour l'instant, on vérifie juste que la configuration est complète
      const isConfigured = await this.isSmtpConfigured();
      if (isConfigured.error) {
        return { data: null, error: isConfigured.error };
      }

      if (!isConfigured.data) {
        return { data: null, error: 'Configuration SMTP incomplète' };
      }

      // TODO: Implémenter un vrai test de connexion SMTP
      // Pour l'instant, on retourne true si la configuration est complète
      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur lors du test de connexion SMTP' };
    }
  }

  // Vérifier si le mode maintenance est activé
  static async isMaintenanceModeEnabled(): Promise<{ data: boolean | null; error: string | null }> {
    try {
      const result = await this.getSettingByKey('maintenance_mode');
      
      if (result.error) {
        return { data: null, error: result.error };
      }
      
      if (result.data === null) {
        // Si le paramètre n'existe pas, le créer avec la valeur par défaut
        await this.upsertSetting('maintenance_mode', 'false');
        return { data: false, error: null };
      }
      
      return { data: result.data === 'true', error: null };
    } catch (error) {
      return { data: null, error: 'Erreur lors de la vérification du mode maintenance' };
    }
  }

  // Activer ou désactiver le mode maintenance
  static async setMaintenanceMode(enabled: boolean): Promise<{ data: boolean | null; error: string | null }> {
    try {
      const result = await this.upsertSetting('maintenance_mode', enabled.toString());
      
      if (result.error) {
        return { data: null, error: result.error };
      }
      
      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: 'Erreur lors de la modification du mode maintenance' };
    }
  }
}
