/**
 * Utilitaires pour le formatage des durées
 */

/**
 * Calcule la durée entre deux heures en tenant compte du passage à minuit
 * @param startTime - Heure de début (format "HH:MM")
 * @param endTime - Heure de fin (format "HH:MM")
 * @returns Durée en heures décimales
 */
export const calculateDurationHours = (startTime: string, endTime: string): number => {
  // Convertir les heures en minutes pour faciliter le calcul
  const parseTime = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);

  let durationMinutes: number;

  // Si l'heure de fin est avant l'heure de début, c'est le lendemain
  if (endMinutes <= startMinutes) {
    // Ajouter 24 heures (1440 minutes) pour le passage à minuit
    durationMinutes = (1440 - startMinutes) + endMinutes;
  } else {
    // Même jour
    durationMinutes = endMinutes - startMinutes;
  }

  // Convertir en heures avec 2 décimales
  return Math.round((durationMinutes / 60) * 100) / 100;
};

/**
 * Corrige une durée négative en ajoutant 24h (pour les cas qui passent minuit)
 * @param durationHours - Durée en heures (peut être négative)
 * @returns Durée corrigée (toujours positive)
 */
export const correctNegativeDuration = (durationHours: number): number => {
  if (durationHours < 0) {
    return durationHours + 24;
  }
  return durationHours;
};

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
  
  // CORRECTION: Si la durée est négative, on la corrige en ajoutant 24h
  let correctedDuration = durationHours;
  if (durationHours < 0) {
    correctedDuration = durationHours + 24;
    console.log('🔍 DEBUG PROD formatDuration - Durée négative corrigée:', {
      original: durationHours,
      corrected: correctedDuration
    });
  }
  
  if (!correctedDuration || correctedDuration <= 0) {
    console.log('🔍 DEBUG PROD formatDuration - Retour 0h car:', {
      durationHours: correctedDuration,
      condition: !correctedDuration || correctedDuration <= 0
    });
    return '0h';
  }
  
  const hours = Math.floor(correctedDuration);
  const minutes = Math.round((correctedDuration - hours) * 60);
  
  const result = minutes === 0 ? `${hours}h` : `${hours}h${minutes.toString().padStart(2, '0')}`;
  
  console.log('🔍 DEBUG PROD formatDuration - Résultat:', {
    input: durationHours,
    corrected: correctedDuration,
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
