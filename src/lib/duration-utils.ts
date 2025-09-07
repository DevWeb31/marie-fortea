/**
 * Utilitaires pour le formatage des durées
 */

/**
 * Formate une durée en heures décimales vers le format "8h30"
 * @param durationHours - Durée en heures décimales (ex: 8.5)
 * @returns Durée formatée (ex: "8h30")
 */
export const formatDuration = (durationHours: number): string => {
  // DEBUG PROD: Log de la fonction formatDuration
  console.log('🔍 DEBUG PROD formatDuration - Input:', {
    durationHours,
    type: typeof durationHours,
    isNull: durationHours === null,
    isUndefined: durationHours === undefined,
    isNaN: isNaN(durationHours)
  });
  
  if (!durationHours || durationHours <= 0) {
    console.log('🔍 DEBUG PROD formatDuration - Retour 0h car:', {
      durationHours,
      condition: !durationHours || durationHours <= 0
    });
    return '0h';
  }
  
  const hours = Math.floor(durationHours);
  const minutes = Math.round((durationHours - hours) * 60);
  
  const result = minutes === 0 ? `${hours}h` : `${hours}h${minutes.toString().padStart(2, '0')}`;
  
  console.log('🔍 DEBUG PROD formatDuration - Résultat:', {
    input: durationHours,
    hours,
    minutes,
    result
  });
  
  return result;
};

/**
 * Formate une durée en heures décimales vers le format "8h30" avec le texte "Durée:"
 * @param durationHours - Durée en heures décimales (ex: 8.5)
 * @returns Durée formatée avec préfixe (ex: "Durée: 8h30")
 */
export const formatDurationWithLabel = (durationHours: number): string => {
  return `Durée: ${formatDuration(durationHours)}`;
};
