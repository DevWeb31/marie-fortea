// Configuration Supabase pour les environnements de développement et production

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  environment: 'development' | 'production';
}

// Détection automatique de l'environnement
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';

// Configuration selon l'environnement
export const getSupabaseConfig = (): SupabaseConfig => {
  // Configuration fixe pour résoudre le problème de connexion
  const config = {
    url: 'https://hwtfbyknjwlmidxeazbe.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dGZieWtuandsbWlkeGVhemJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMTMyNDcsImV4cCI6MjA3MDg4OTI0N30.qlVUwwRYxxxx2pK0wwkVn-qiopFMATK3jeZsOo4FWSU',
    environment: isDevelopment ? 'development' : 'production'
  };

  return config;
};

// Vérification de la configuration
export const validateSupabaseConfig = (config: SupabaseConfig): boolean => {
  if (!config.url || !config.anonKey) {
    console.warn(`Configuration Supabase manquante pour l'environnement ${config.environment}`);
    return false;
  }

  if (!config.url.includes('supabase.co')) {
    console.warn(`URL Supabase invalide: ${config.url}`);
    return false;
  }

  return true;
};

// Log de la configuration (en développement seulement)
export const logSupabaseConfig = (config: SupabaseConfig): void => {
  if (isDevelopment) {
    console.log(`🚀 Supabase configuré pour l'environnement: ${config.environment}`);
    console.log(`📍 URL: ${config.url}`);
    console.log(`🔑 Clé: ${config.anonKey.substring(0, 20)}...`);
  }
};
