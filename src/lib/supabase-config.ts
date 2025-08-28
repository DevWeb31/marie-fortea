// Configuration Supabase pour les environnements de développement et production
import { getCurrentConfig, getCurrentEnvironment } from '@/config/environments';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  environment: 'development' | 'production';
}

// Configuration selon l'environnement
export const getSupabaseConfig = (): SupabaseConfig => {
  const config = getCurrentConfig();
  const environment = getCurrentEnvironment();
  
  return {
    url: config.url,
    anonKey: config.anonKey,
    environment
  };
};

// Vérification de la configuration
export const validateSupabaseConfig = (config: SupabaseConfig): boolean => {
  if (!config.url || !config.anonKey) {
    console.warn(`Configuration Supabase manquante pour l'environnement ${config.environment}. L'authentification sera simulée.`);
    return false;
  }

  if (!config.url.includes('supabase.co') && !config.url.includes('127.0.0.1') && !config.url.includes('localhost')) {
    console.warn(`URL Supabase invalide: ${config.url}`);
    return false;
  }

  return true;
};

// Log de la configuration (en développement seulement)
export const logSupabaseConfig = (config: SupabaseConfig): void => {
  if (config.environment === 'development') {
    console.log(`🚀 Supabase configuré pour l'environnement: ${config.environment}`);
    console.log(`📍 URL: ${config.url}`);
    console.log(`🔑 Clé: ${config.anonKey.substring(0, 20)}...`);
  }
};
