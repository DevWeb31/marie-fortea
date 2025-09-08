/**
 * Utilitaires pour la gestion des types de services
 */

/**
 * Convertit un code de service en nom lisible
 * @param serviceCode - Le code du service (ex: 'emergency_care', 'mariage')
 * @returns Le nom lisible du service (ex: 'Garde d'urgence', 'Mariage')
 */
export const getServiceTypeName = (serviceCode: string): string => {
  const serviceNames: { [key: string]: string } = {
    // Codes de la base de données
    'mariage': 'Mariage',
    'urgence': 'Garde d\'urgence',
    'soiree': 'Soirée parents',
    'weekend': 'Week-end/Vacances',
    'autre': 'Autre événement',
    // Codes du formulaire
    'babysitting': 'Garde d\'enfants',
    'event_support': 'Soutien événementiel',
    'evening_care': 'Garde en soirée',
    'emergency_care': 'Garde d\'urgence'
  };
  
  return serviceNames[serviceCode] || serviceCode;
};

/**
 * Obtient la description d'un service
 * @param serviceCode - Le code du service
 * @returns La description du service
 */
export const getServiceTypeDescription = (serviceCode: string): string => {
  const serviceDescriptions: { [key: string]: string } = {
    'mariage': 'Garde d\'enfants pour cérémonies de mariage',
    'urgence': 'Garde d\'enfants en urgence',
    'soiree': 'Garde d\'enfants pour soirées entre parents',
    'weekend': 'Garde d\'enfants prolongée',
    'autre': 'Autres types de garde d\'enfants',
    'babysitting': 'Garde d\'enfants professionnelle',
    'event_support': 'Garde d\'enfants pour événements',
    'evening_care': 'Garde d\'enfants en soirée',
    'emergency_care': 'Garde d\'enfants en urgence'
  };
  
  return serviceDescriptions[serviceCode] || 'Service personnalisé';
};

/**
 * Obtient le prix de base d'un service
 * @param serviceCode - Le code du service
 * @returns Le prix de base du service
 */
export const getServiceBasePrice = (serviceCode: string): number => {
  const servicePrices: { [key: string]: number } = {
    'mariage': 25.00,
    'urgence': 30.00,
    'soiree': 20.00,
    'weekend': 18.00,
    'autre': 22.00,
    'babysitting': 20.00,
    'event_support': 25.00,
    'evening_care': 20.00,
    'emergency_care': 40.00
  };
  
  return servicePrices[serviceCode] || 20.00;
};
