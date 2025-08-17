import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig, validateSupabaseConfig, logSupabaseConfig } from './supabase-config';

// Récupération de la configuration selon l'environnement
const config = getSupabaseConfig();

// Validation de la configuration
if (!validateSupabaseConfig(config)) {
  console.warn(`Configuration Supabase manquante pour l'environnement ${config.environment}. L'authentification sera simulée.`);
}

// Log de la configuration (en développement seulement)
logSupabaseConfig(config);

export const supabase = createClient(
  config.url || 'https://your-project.supabase.co',
  config.anonKey || 'your-anon-key'
);

// Fonctions d'authentification
export const auth = {
  // Connexion avec email/mot de passe
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Déconnexion
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Vérifier la session actuelle
  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      return { session: null, error };
    }
  },

  // Écouter les changements d'authentification
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Hook personnalisé pour l'authentification (à implémenter plus tard)
export const useAuth = () => {
  // TODO: Implémenter un hook React pour l'authentification
  return {
    user: null,
    session: null,
    signIn: auth.signIn,
    signOut: auth.signOut,
    isLoading: false,
  };
};
