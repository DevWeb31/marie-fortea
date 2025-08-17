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
  if (isDevelopment) {
    return {
      url: import.meta.env.VITE_SUPABASE_URL_DEV || import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY_DEV || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      environment: 'development'
    };
  }

  if (isProduction) {
    return {
      url: import.meta.env.VITE_SUPABASE_URL_PROD || import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY_PROD || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      environment: 'production'
    };
  }

  // Fallback vers l'ancienne configuration
  return {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    environment: 'development'
  };
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
