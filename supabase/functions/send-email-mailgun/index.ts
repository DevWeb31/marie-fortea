import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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

    // Configuration Mailgun depuis les variables d'environnement
    let mailgunApiKey = Deno.env.get('MAILGUN_API_KEY');
    let mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
    
    // Fallback: utiliser des valeurs codées en dur pour le développement local
    if (!mailgunApiKey || !mailgunDomain) {
      throw new Error('Mailgun API key or domain not configured');
    }

    // Préparer les données pour Mailgun
    const formData = new FormData();
    formData.append('from', `Marie Fortea <noreply@${mailgunDomain}>`);
    formData.append('to', emailData.to);
    formData.append('subject', emailData.subject);
    formData.append('html', emailData.html);
    
    if (emailData.text) {
      formData.append('text', emailData.text);
    }

    // Envoyer l'email via Mailgun
    // Encoder en base64 avec Deno
    const credentials = `api:${mailgunApiKey}`;
    const encodedCredentials = btoa(credentials);
    
    const response = await fetch(`https://api.eu.mailgun.net/v3/${mailgunDomain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur Mailgun: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    // Retourner une réponse de succès
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email envoyé avec succès via Mailgun',
        mailgunId: result.id,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
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
});
