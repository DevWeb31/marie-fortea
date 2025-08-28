import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Gérer les requêtes OPTIONS pour CORS - toujours autorisées
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  try {
    // Vérifier l'authentification pour toutes les requêtes non-OPTIONS
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'En-tête d\'autorisation manquant' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Vérifier que c'est une requête POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Méthode non autorisée' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Récupérer les paramètres SMTP de la requête
    const smtpConfig = await req.json();
    console.log('📧 Configuration SMTP reçue:', smtpConfig);
    
    // Valider les paramètres requis
    const requiredFields = ['host', 'port', 'username', 'password'];
    for (const field of requiredFields) {
      if (!smtpConfig[field]) {
        return new Response(
          JSON.stringify({ error: `Champ requis manquant: ${field}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    console.log('🔗 Configuration SMTP validée');
    console.log('📍 Host:', smtpConfig.host);
    console.log('🔌 Port:', smtpConfig.port);
    console.log('👤 Username:', smtpConfig.username);
    console.log('🔐 Password:', smtpConfig.password ? '***' : 'manquant');
    console.log('🔒 Encryption:', smtpConfig.encryption);

    // Pour le moment, on simule le test sans se connecter réellement
    // Cela nous permet de vérifier que la fonction Edge fonctionne
    console.log('🧪 Simulation du test SMTP (connexion réelle désactivée)');
    
    // Simuler un délai de test
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ Test SMTP simulé avec succès');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test SMTP simulé - La fonction Edge fonctionne correctement. La connexion réelle sera testée plus tard.' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 Erreur lors du test SMTP:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    
    return new Response(
      JSON.stringify({ 
        error: `Test de connexion SMTP échoué: ${errorMessage}`,
        details: errorMessage
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
