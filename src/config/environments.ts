/**
 * Configuration des environnements - DevWeb31 Architecture
 * Détection automatique de l'environnement basée sur l'hostname et les variables
 */

export type Environment = 'development' | 'staging' | 'production' | 'test';

export interface EnvironmentConfig {
  name: string;
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  debug: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enableAnalytics: boolean;
  enableLogs: boolean;
  features: {
    auth: boolean;
    realtime: boolean;
    storage: boolean;
    edgeFunctions: boolean;
  };
}

/**
 * Détection automatique de l'environnement
 */
export function detectEnvironment(): Environment {
  // Vérification des variables d'environnement explicites
  const explicitEnv = import.meta.env.VITE_APP_ENV as Environment;
  if (
    explicitEnv &&
    ['development', 'staging', 'production', 'test'].includes(explicitEnv)
  ) {
    return explicitEnv;
  }

  // Détection basée sur l'hostname
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }

  if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
    return 'staging';
  }

  if (
    hostname.includes('mon-projet.com') ||
    hostname.includes('marie-fortea.com')
  ) {
    return 'production';
  }

  // Détection basée sur le port
  const port = window.location.port;
  if (port === '3000' || port === '5173' || port === '4173') {
    return 'development';
  }

  // Détection basée sur le protocole
  if (window.location.protocol === 'file:') {
    return 'development';
  }

  // Par défaut, considérer comme production
  return 'production';
}

/**
 * Configuration par environnement
 */
const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  development: {
    name: 'Développement',
    apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321',
    supabaseAnonKey:
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    debug: true,
    logLevel: 'debug',
    enableAnalytics: false,
    enableLogs: true,
    features: {
      auth: true,
      realtime: true,
      storage: true,
      edgeFunctions: true,
    },
  },

  staging: {
    name: 'Staging',
    apiUrl:
      import.meta.env.VITE_API_BASE_URL || 'https://staging.mon-projet.com/api',
    supabaseUrl:
      import.meta.env.VITE_SUPABASE_URL ||
      'https://staging-project.supabase.co',
    supabaseAnonKey:
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    debug: true,
    logLevel: 'info',
    enableAnalytics: true,
    enableLogs: true,
    features: {
      auth: true,
      realtime: true,
      storage: true,
      edgeFunctions: true,
    },
  },

  production: {
    name: 'Production',
    apiUrl: import.meta.env.VITE_API_BASE_URL || 'https://mon-projet.com/api',
    supabaseUrl:
      import.meta.env.VITE_SUPABASE_URL ||
      'https://qrstuvwxyzabcdef.supabase.co',
    supabaseAnonKey:
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    debug: false,
    logLevel: 'error',
    enableAnalytics: true,
    enableLogs: false,
    features: {
      auth: true,
      realtime: true,
      storage: true,
      edgeFunctions: true,
    },
  },

  test: {
    name: 'Test',
    apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321',
    supabaseAnonKey:
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    debug: true,
    logLevel: 'debug',
    enableAnalytics: false,
    enableLogs: true,
    features: {
      auth: true,
      realtime: false,
      storage: false,
      edgeFunctions: false,
    },
  },
};

/**
 * Configuration de l'environnement actuel
 */
export const currentEnvironment = detectEnvironment();
export const config = environmentConfigs[currentEnvironment];

/**
 * Utilitaires d'environnement
 */
export const isDevelopment = currentEnvironment === 'development';
export const isStaging = currentEnvironment === 'staging';
export const isProduction = currentEnvironment === 'production';
export const isTest = currentEnvironment === 'test';

export const isLocal = isDevelopment || isTest;
export const isRemote = isStaging || isProduction;

/**
 * Validation de la configuration
 */
export function validateConfig(): boolean {
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);

  if (missingVars.length > 0) {
    console.error("❌ Variables d'environnement manquantes:", missingVars);
    return false;
  }

  return true;
}

/**
 * Log de la configuration (uniquement en développement)
 */
if (isDevelopment) {
  console.group("🔧 Configuration de l'environnement");
  console.log('Environnement détecté:', currentEnvironment);
  console.log('Configuration:', config);
  console.log("Variables d'environnement:", {
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  });
  console.groupEnd();
}

/**
 * Export par défaut
 */
export default config;
