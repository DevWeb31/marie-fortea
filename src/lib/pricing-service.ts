import { supabase } from './supabase';
import { SiteSettingsService } from './site-settings-service';

export interface PricingConfig {
  // Prix par type de service (prix direct par heure)
  servicePrices: {
    babysitting: number;
    event_support: number;
    evening_care: number;
    emergency_care: number;
  };
  
  // Tarifs de nuit par type de service
  serviceNightPrices: {
    event_support: number;
    evening_care: number;
  };
  
  // Configuration des tarifs de nuit
  serviceNightConfig: {
    event_support: boolean;
    evening_care: boolean;
    babysitting: boolean;
    emergency_care: boolean;
  };
  
  // Supplément par enfant (à partir du 3ème enfant)
  additionalChildRate: number;
  
  // Dernière mise à jour
  lastUpdated: Date;
}

export interface PriceCalculation {
  baseAmount: number;
  additionalChildrenAmount: number;
  serviceMultiplier: number;
  totalAmount: number;
  breakdown: {
    hourlyRate: number;
    serviceType: string;
    childrenCount: number;
    durationHours: number;
  };
}

export class PricingService {
  // Récupérer la configuration complète des prix
  static async getPricingConfig(): Promise<{ data: PricingConfig | null; error: string | null }> {
    try {
      const { data: settings, error } = await SiteSettingsService.getAllSettings();
      
      if (error) {
        return { data: null, error };
      }

      if (!settings) {
        return { data: null, error: 'Aucun paramètre trouvé' };
      }

      // Créer un objet pour faciliter l'accès aux valeurs
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as { [key: string]: string });

      const config: PricingConfig = {
        servicePrices: {
          babysitting: parseFloat(settingsMap['pricing_service_babysitting'] || '20'),
          event_support: parseFloat(settingsMap['pricing_service_event_support'] || '25'),
          evening_care: parseFloat(settingsMap['pricing_service_evening_care'] || '20'),
          emergency_care: parseFloat(settingsMap['pricing_service_emergency_care'] || '40'),
        },
        serviceNightPrices: {
          event_support: parseFloat(settingsMap['pricing_service_event_support_night'] || '30'),
          evening_care: parseFloat(settingsMap['pricing_service_evening_care_night'] || '25'),
        },
        serviceNightConfig: {
          event_support: settingsMap['pricing_service_event_support_has_night'] === 'true',
          evening_care: settingsMap['pricing_service_evening_care_has_night'] === 'true',
          babysitting: settingsMap['pricing_service_babysitting_has_night'] === 'true',
          emergency_care: settingsMap['pricing_service_emergency_care_has_night'] === 'true',
        },
        additionalChildRate: parseFloat(settingsMap['pricing_additional_child_rate'] || '5'),
        lastUpdated: new Date(settingsMap['pricing_last_updated'] || Date.now())
      };

      return { data: config, error: null };
    } catch (error) {
      console.error('Erreur lors de la récupération de la configuration des prix:', error);
      return { data: null, error: 'Erreur lors de la récupération de la configuration des prix' };
    }
  }

  // Mettre à jour la configuration des prix
  static async updatePricingConfig(config: Partial<PricingConfig>): Promise<{ data: boolean | null; error: string | null }> {
    try {
      const updates: Promise<{ data: boolean | null; error: string | null }>[] = [];

      // Mettre à jour le supplément par enfant
      if (config.additionalChildRate !== undefined) {
        updates.push(SiteSettingsService.upsertSetting('pricing_additional_child_rate', config.additionalChildRate.toString()));
      }

      // Mettre à jour les prix par type de service
      if (config.servicePrices) {
        Object.entries(config.servicePrices).forEach(([service, price]) => {
          updates.push(SiteSettingsService.upsertSetting(`pricing_service_${service}`, price.toString()));
        });
      }

      // Mettre à jour les tarifs de nuit
      if (config.serviceNightPrices) {
        Object.entries(config.serviceNightPrices).forEach(([service, price]) => {
          updates.push(SiteSettingsService.upsertSetting(`pricing_service_${service}_night`, price.toString()));
        });
      }

      // Mettre à jour la configuration des tarifs de nuit
      if (config.serviceNightConfig) {
        Object.entries(config.serviceNightConfig).forEach(([service, hasNight]) => {
          updates.push(SiteSettingsService.upsertSetting(`pricing_service_${service}_has_night`, hasNight.toString()));
        });
      }

      // Mettre à jour la date de dernière modification
      updates.push(SiteSettingsService.upsertSetting('pricing_last_updated', new Date().toISOString()));

      // Exécuter toutes les mises à jour
      const results = await Promise.all(updates);
      
      // Vérifier s'il y a des erreurs
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        return { data: null, error: `Erreurs lors de la mise à jour: ${errors.map(e => e.error).join(', ')}` };
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la configuration des prix:', error);
      return { data: null, error: 'Erreur lors de la mise à jour de la configuration des prix' };
    }
  }

  // Calculer le prix d'une réservation
  static async calculatePrice(
    serviceType: string,
    durationHours: number,
    childrenCount: number
  ): Promise<{ data: PriceCalculation | null; error: string | null }> {
    try {
      console.log('🔧 Calcul de prix demandé:', { serviceType, durationHours, childrenCount });
      
      const { data: config, error } = await this.getPricingConfig();
      
      console.log('📋 Configuration récupérée:', { config, error });
      
      if (error || !config) {
        console.error('❌ Configuration des prix non disponible:', error);
        return { data: null, error: error || 'Configuration des prix non disponible' };
      }

      // Prix direct du service par heure
      const servicePrice = config.servicePrices[serviceType as keyof typeof config.servicePrices] || 15;
      const baseAmount = servicePrice * durationHours;

      // Supplément pour enfants supplémentaires (à partir du 3ème enfant)
      const additionalChildren = Math.max(0, childrenCount - 2);
      const additionalChildrenAmount = additionalChildren * config.additionalChildRate * durationHours;

      // Calcul du montant total
      const totalAmount = baseAmount + additionalChildrenAmount;

      const calculation: PriceCalculation = {
        baseAmount,
        additionalChildrenAmount,
        serviceMultiplier: 1, // Plus de multiplicateur, prix direct
        totalAmount: Math.round(totalAmount * 100) / 100, // Arrondir à 2 décimales
        breakdown: {
          hourlyRate: servicePrice,
          serviceType,
          childrenCount,
          durationHours
        }
      };

      return { data: calculation, error: null };
    } catch (error) {
      console.error('Erreur lors du calcul du prix:', error);
      return { data: null, error: 'Erreur lors du calcul du prix' };
    }
  }

  // Récupérer les prix pour l'affichage public
  static async getPublicPricing(): Promise<{ data: { [key: string]: any } | null; error: string | null }> {
    try {
      const { data: config, error } = await this.getPricingConfig();
      
      if (error || !config) {
        return { data: null, error: error || 'Configuration des prix non disponible' };
      }

      // Préparer les données pour l'affichage public
      const publicPricing = {
        additionalChildRate: config.additionalChildRate,
        services: Object.entries(config.servicePrices).map(([service, price]) => ({
          type: service,
          name: this.getServiceDisplayName(service),
          price: price,
          nightPrice: config.serviceNightPrices[service as keyof typeof config.serviceNightPrices] || null,
          hasNightPrice: config.serviceNightConfig[service as keyof typeof config.serviceNightConfig] || false
        })),
        lastUpdated: config.lastUpdated
      };

      return { data: publicPricing, error: null };
    } catch (error) {
      console.error('Erreur lors de la récupération des prix publics:', error);
      return { data: null, error: 'Erreur lors de la récupération des prix publics' };
    }
  }

  // Obtenir le nom d'affichage d'un service
  private static getServiceDisplayName(serviceType: string): string {
    const serviceNames: { [key: string]: string } = {
      'babysitting': 'Garde d\'enfants',
      'event_support': 'Soutien événementiel',
      'evening_care': 'Garde en soirée',
      'emergency_care': 'Garde d\'urgence'
    };
    return serviceNames[serviceType] || serviceType;
  }

  // Initialiser les prix par défaut
  static async initializeDefaultPricing(): Promise<{ data: boolean | null; error: string | null }> {
    try {
      const defaultConfig: PricingConfig = {
        servicePrices: {
          babysitting: 20,
          event_support: 25,
          evening_care: 20,
          emergency_care: 40,
        },
        serviceNightPrices: {
          event_support: 30,
          evening_care: 25,
        },
        serviceNightConfig: {
          event_support: true,
          evening_care: true,
          babysitting: false,
          emergency_care: false,
        },
        additionalChildRate: 5,
        lastUpdated: new Date()
      };

      return await this.updatePricingConfig(defaultConfig);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des prix par défaut:', error);
      return { data: null, error: 'Erreur lors de l\'initialisation des prix par défaut' };
    }
  }

  // Valider une configuration de prix
  static validatePricingConfig(config: Partial<PricingConfig>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (config.additionalChildRate !== undefined && config.additionalChildRate < 0) {
      errors.push('Le supplément par enfant ne peut pas être négatif');
    }

    if (config.servicePrices) {
      Object.entries(config.servicePrices).forEach(([service, price]) => {
        if (price <= 0) {
          errors.push(`Le prix pour ${service} doit être positif`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
