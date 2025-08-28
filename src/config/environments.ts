// Configuration des environnements Supabase
export const SUPABASE_CONFIG = {
  development: {
    url: import.meta.env.VITE_SUPABASE_URL_DEV || 'http://127.0.0.1:54331',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY_DEV || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY_DEV || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
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
  console.log('Environnement:', getCurrentEnvironment());
  console.log('URL:', config.url);
  console.log('Clé anonyme:', config.anonKey.substring(0, 20) + '...');
  console.groupEnd();
}
