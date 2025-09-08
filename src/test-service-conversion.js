// Script de test pour vérifier la conversion des types de service
// À exécuter dans la console du navigateur

console.log('🧪 TEST - Conversion des types de service');

const serviceNames = {
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

const testCodes = ['emergency_care', 'babysitting', 'event_support', 'evening_care', 'mariage', 'urgence', 'soiree', 'weekend', 'autre', 'unknown_code'];

testCodes.forEach(code => {
  const result = serviceNames[code] || code;
  console.log(`✅ ${code} → ${result}`);
});

console.log('🧪 TEST - Fin des tests de conversion');
