// Configuration des environnements Supabase
export const SUPABASE_CONFIG = {
  development: {
    url: import.meta.env.VITE_SUPABASE_URL_DEV || 'http://127.0.0.1:54331',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY_DEV || '',
    serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY_DEV || ''
  },
  production: {
    url: import.meta.env.VITE_SUPABASE_URL_PROD || 'https://your-project.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY_PROD || 'your-production-anon-key',
    serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY_PROD || 'your-production-service-role-key'
  }
};

// Détection automatique de l'environnement
export const getCurrentEnvironment = () => {
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    return 'development';
  }
  return 'production';
};

// Configuration actuelle
export const getCurrentConfig = () => {
  const env = getCurrentEnvironment();
  return SUPABASE_CONFIG[env];
};

// Utilitaires d'environnement
export const isDevelopment = getCurrentEnvironment() === 'development';
export const isProduction = getCurrentEnvironment() === 'production';

// Log de la configuration (uniquement en développement)
if (isDevelopment) {
  const config = getCurrentConfig();
  console.group("🔧 Configuration Supabase");

  console.groupEnd();
}
