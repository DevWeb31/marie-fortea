/**
 * Utilitaires pour la gestion sécurisée des mots de passe
 */

/**
 * Hache un mot de passe en utilisant l'algorithme SHA-256
 * @param password - Le mot de passe en clair
 * @returns Le hash du mot de passe
 */
export const hashPassword = async (password: string): Promise<string> => {
  if (!password) return '';
  
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe:', error);
    throw new Error('Impossible de hacher le mot de passe');
  }
};

/**
 * Vérifie si un mot de passe correspond à un hash
 * @param password - Le mot de passe en clair à vérifier
 * @param hash - Le hash stocké
 * @returns true si le mot de passe correspond
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  if (!password || !hash) return false;
  
  try {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe:', error);
    return false;
  }
};

/**
 * Génère un salt aléatoire pour renforcer le hachage
 * @param length - Longueur du salt (défaut: 32)
 * @returns Le salt généré
 */
export const generateSalt = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Hache un mot de passe avec un salt
 * @param password - Le mot de passe en clair
 * @param salt - Le salt à utiliser
 * @returns Le hash avec salt
 */
export const hashPasswordWithSalt = async (password: string, salt: string): Promise<string> => {
  if (!password || !salt) return '';
  
  try {
    const passwordWithSalt = password + salt;
    return await hashPassword(passwordWithSalt);
  } catch (error) {
    console.error('Erreur lors du hachage avec salt:', error);
    throw new Error('Impossible de hacher le mot de passe avec salt');
  }
};
