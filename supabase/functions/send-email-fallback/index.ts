import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

serve(async (req) => {
  // Gérer les requêtes OPTIONS pour le CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Lire le corps de la requête
    const emailData: EmailData = await req.json();

    // Validation des données
    if (!emailData.to || !emailData.subject || !emailData.html) {
      throw new Error('Données d\'email manquantes: to, subject, html sont requis');
    }

    // Configuration Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Configuration Supabase manquante');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Récupérer la configuration SMTP depuis la base de données
    const { data: smtpSettings, error: smtpError } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'smtp_from', 'smtp_encryption']);

    if (smtpError) {
      throw new Error(`Erreur lors de la récupération des paramètres SMTP: ${smtpError.message}`);
    }

    // Convertir les paramètres en objet
    const smtpConfig: { [key: string]: string } = {};
    smtpSettings?.forEach(setting => {
      smtpConfig[setting.key] = setting.value;
    });

    // Vérifier que les paramètres SMTP essentiels sont présents
    if (!smtpConfig.smtp_host || !smtpConfig.smtp_username || !smtpConfig.smtp_password) {
      // Fallback : simulation
      console.log('Configuration SMTP incomplète, simulation de l\'envoi');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email simulé (configuration SMTP incomplète)',
          simulated: true,
          to: emailData.to,
          subject: emailData.subject,
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Utiliser l'Edge Function send-email existante
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailData
    });

    if (error) {
      throw new Error(`Erreur SMTP: ${error.message}`);
    }

    // Retourner une réponse de succès
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email envoyé avec succès via SMTP',
        smtpUsed: true,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erreur dans send-email-fallback:', error);
    
    // En cas d'erreur, retourner une simulation de succès
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email simulé (fallback en cas d\'erreur)',
        simulated: true,
        error: error.message || 'Erreur lors de l\'envoi de l\'email',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  }
});
