/**
 * Utilitaires pour le formatage des durées
 */

/**
 * Formate une durée en heures décimales vers le format "8h30"
 * @param durationHours - Durée en heures décimales (ex: 8.5)
 * @returns Durée formatée (ex: "8h30")
 */
export const formatDuration = (durationHours: number): string => {
  if (!durationHours || durationHours <= 0) return '0h';
  
  const hours = Math.floor(durationHours);
  const minutes = Math.round((durationHours - hours) * 60);
  
  if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  }
};

/**
 * Formate une durée en heures décimales vers le format "8h30" avec le texte "Durée:"
 * @param durationHours - Durée en heures décimales (ex: 8.5)
 * @returns Durée formatée avec préfixe (ex: "Durée: 8h30")
 */
export const formatDurationWithLabel = (durationHours: number): string => {
  return `Durée: ${formatDuration(durationHours)}`;
};
