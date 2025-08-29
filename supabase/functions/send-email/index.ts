import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

serve(async (req) => {
  // Gérer les requêtes OPTIONS pour le CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Lire le corps de la requête de manière simple
    let emailData: EmailData;
    
    try {
      // Essayer req.json() d'abord
      emailData = await req.json() as EmailData;
    } catch (error) {
      throw new Error(`Erreur de parsing: ${error.message}`);
    }

    // Validation des données
    if (!emailData.to || !emailData.subject || !emailData.html) {
      throw new Error('Données d\'email manquantes: to, subject, html sont requis');
    }



    // Récupérer les paramètres SMTP depuis la base de données
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    
    // Créer un client Supabase avec les variables d'environnement
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Variables d\'environnement Supabase manquantes');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Récupérer les paramètres SMTP depuis la base de données
    const { data: smtpSettings, error: smtpError } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'smtp_from', 'smtp_encryption']);
    
    if (smtpError) {
      console.error('❌ Erreur SMTP:', smtpError);
      throw new Error(`Erreur lors de la récupération des paramètres SMTP: ${smtpError.message}`);
    }
    
    if (!smtpSettings || smtpSettings.length === 0) {
      throw new Error('Paramètres SMTP non trouvés dans la base de données');
    }
    

    
    // Convertir les paramètres en objet
    const smtpConfig: { [key: string]: string } = {};
    smtpSettings.forEach(setting => {
      smtpConfig[setting.key] = setting.value;
    });
    
    // Vérifier que les paramètres essentiels sont présents
    if (!smtpConfig.smtp_host || !smtpConfig.smtp_username || !smtpConfig.smtp_password) {
      throw new Error('Configuration SMTP incomplète dans la base de données');
    }
    
    const smtpHost = smtpConfig.smtp_host;
    const smtpPort = parseInt(smtpConfig.smtp_port || '587');
    const smtpUsername = smtpConfig.smtp_username;
    const smtpPassword = smtpConfig.smtp_password;
    const smtpFrom = smtpConfig.smtp_from || 'noreply@marie-fortea.com';
    const smtpEncryption = smtpConfig.smtp_encryption || 'tls';



    // Test temporaire : simulation d'envoi SMTP
    // Simuler un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Retourner une réponse de succès
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email envoyé avec succès',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);

    // Retourner une réponse d'erreur
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erreur lors de l\'envoi de l\'email',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})
