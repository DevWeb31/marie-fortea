// Configuration des environnements Supabase
export const SUPABASE_CONFIG = {
  development: {
    url: process.env.VITE_SUPABASE_URL_DEV || 'http://127.0.0.1:54331',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY_DEV || 'your-dev-anon-key',
    serviceRoleKey: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY_DEV || 'your-dev-service-role-key'
  },
  production: {
    url: process.env.VITE_SUPABASE_URL_PROD || 'https://your-project.supabase.co',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY_PROD || 'your-production-anon-key',
    serviceRoleKey: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY_PROD || 'your-production-service-role-key'
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
  console.log('Environnement:', getCurrentEnvironment());
  console.log('URL:', config.url);
  console.log('Clé anonyme:', config.anonKey.substring(0, 20) + '...');
  console.groupEnd();
}
