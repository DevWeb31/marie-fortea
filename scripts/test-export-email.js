#!/usr/bin/env node

/**
 * Script de test pour l'envoi d'email d'export de données
 * Usage: node scripts/test-export-email.js <email>
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.error('VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testExportEmail(userEmail) {
  console.log(`🧪 Test d'envoi d'email d'export pour: ${userEmail}`);
  
  try {
    // 1. Tester la fonction Mailgun directement
    console.log('\n1️⃣ Test de la fonction Mailgun...');
    
    const emailData = {
      to: userEmail,
      subject: 'Test d\'export de données - Marie Fortea',
      html: `
        <h2>Test d'export de données</h2>
        <p>Ceci est un email de test pour vérifier que l'envoi d'emails d'export fonctionne correctement.</p>
        <p>Si vous recevez cet email, le système fonctionne !</p>
        <p>Date du test: ${new Date().toLocaleString('fr-FR')}</p>
      `,
      text: `
Test d'export de données - Marie Fortea

Ceci est un email de test pour vérifier que l'envoi d'emails d'export fonctionne correctement.

Si vous recevez cet email, le système fonctionne !

Date du test: ${new Date().toLocaleString('fr-FR')}
      `
    };

    const { data: mailgunResult, error: mailgunError } = await supabase.functions.invoke('send-email-mailgun', {
      body: emailData
    });

    if (mailgunError) {
      console.error('❌ Erreur Mailgun:', mailgunError);
    } else {
      console.log('✅ Mailgun:', mailgunResult);
    }

    // 2. Tester la fonction de fallback
    console.log('\n2️⃣ Test de la fonction de fallback...');
    
    const { data: fallbackResult, error: fallbackError } = await supabase.functions.invoke('send-email', {
      body: emailData
    });

    if (fallbackError) {
      console.error('❌ Erreur fallback:', fallbackError);
    } else {
      console.log('✅ Fallback:', fallbackResult);
    }

    // 3. Tester le service GDPR complet
    console.log('\n3️⃣ Test du service GDPR complet...');
    
    // Simuler une demande d'export
    const testToken = 'test-token-' + Date.now();
    const downloadUrl = `https://marie-fortea.vercel.app/data-download/${testToken}`;
    
    // Créer un token de test dans la base
    const { error: tokenError } = await supabase
      .from('secure_download_tokens')
      .insert({
        token: testToken,
        user_email: userEmail,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        used: false,
        export_type: 'full'
      });

    if (tokenError) {
      console.error('❌ Erreur création token:', tokenError);
    } else {
      console.log('✅ Token de test créé');
      
      // Tester l'envoi d'email d'export
      const { data: exportEmailResult, error: exportEmailError } = await supabase.functions.invoke('send-email-mailgun', {
        body: {
          to: userEmail,
          subject: 'Test - Vos données personnelles - Marie Fortea',
          html: `
            <h2>Test d'export de données</h2>
            <p>Ceci est un test du système d'export de données.</p>
            <p><strong>Lien de test:</strong> <a href="${downloadUrl}">${downloadUrl}</a></p>
            <p>Date du test: ${new Date().toLocaleString('fr-FR')}</p>
          `,
          text: `
Test d'export de données - Marie Fortea

Ceci est un test du système d'export de données.

Lien de test: ${downloadUrl}

Date du test: ${new Date().toLocaleString('fr-FR')}
          `
        }
      });

      if (exportEmailError) {
        console.error('❌ Erreur email d\'export:', exportEmailError);
      } else {
        console.log('✅ Email d\'export test envoyé:', exportEmailResult);
      }
    }

    console.log('\n🎉 Tests terminés !');
    console.log('Vérifiez votre boîte email pour confirmer la réception des emails de test.');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Récupérer l'email depuis les arguments
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('❌ Usage: node scripts/test-export-email.js <email>');
  console.error('Exemple: node scripts/test-export-email.js test@example.com');
  process.exit(1);
}

// Valider le format email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(userEmail)) {
  console.error('❌ Format d\'email invalide');
  process.exit(1);
}

testExportEmail(userEmail);
