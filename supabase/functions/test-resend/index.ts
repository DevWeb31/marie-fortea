import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gérer les requêtes OPTIONS pour le CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Lire le corps de la requête
    const { apiKey } = await req.json();
    
    if (!apiKey) {
      throw new Error('Clé API manquante');
    }



    // Tester la connexion Resend avec un email de test
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@marie-fortea.com',
        to: 'test@example.com',
        subject: 'Test de connexion Resend',
        html: '<p>Ceci est un test de connexion à l\'API Resend.</p>',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur Resend: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Connexion Resend testée avec succès',
        details: result,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Erreur lors du test Resend:', error);

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erreur lors du test de connexion Resend',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})
