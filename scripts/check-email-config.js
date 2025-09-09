#!/usr/bin/env node

/**
 * Script pour vérifier la configuration des emails
 * Usage: node scripts/check-email-config.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Vérification de la configuration des emails...\n');

// 1. Vérifier les variables d'environnement Supabase
console.log('1️⃣ Variables d\'environnement Supabase:');
console.log('  VITE_SUPABASE_URL:', supabaseUrl ? '✅ Définie' : '❌ Manquante');
console.log('  SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Définie' : '❌ Manquante');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Configuration Supabase incomplète');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkConfiguration() {
  try {
    // 2. Vérifier les paramètres SMTP dans la base de données
    console.log('\n2️⃣ Paramètres SMTP dans la base de données:');
    
    const { data: smtpSettings, error: smtpError } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'smtp_from', 'smtp_encryption']);

    if (smtpError) {
      console.error('  ❌ Erreur lors de la récupération des paramètres SMTP:', smtpError.message);
    } else {
      const smtpConfig = {};
      smtpSettings?.forEach(setting => {
        smtpConfig[setting.key] = setting.value;
      });

      console.log('  smtp_host:', smtpConfig.smtp_host ? '✅ Défini' : '❌ Manquant');
      console.log('  smtp_port:', smtpConfig.smtp_port ? '✅ Défini' : '❌ Manquant');
      console.log('  smtp_username:', smtpConfig.smtp_username ? '✅ Défini' : '❌ Manquant');
      console.log('  smtp_password:', smtpConfig.smtp_password ? '✅ Défini' : '❌ Manquant');
      console.log('  smtp_from:', smtpConfig.smtp_from ? '✅ Défini' : '❌ Manquant');
      console.log('  smtp_encryption:', smtpConfig.smtp_encryption ? '✅ Défini' : '❌ Manquant');
    }

    // 3. Vérifier les fonctions Edge
    console.log('\n3️⃣ Test des fonctions Edge:');
    
    // Test de la fonction Mailgun
    console.log('  Test de send-email-mailgun...');
    const { data: mailgunTest, error: mailgunError } = await supabase.functions.invoke('send-email-mailgun', {
      body: {
        to: 'test@example.com',
        subject: 'Test de configuration',
        html: '<p>Test</p>'
      }
    });

    if (mailgunError) {
      console.log('  ❌ Erreur Mailgun:', mailgunError.message);
    } else {
      console.log('  ✅ Mailgun fonctionne:', mailgunTest?.simulated ? '(simulation)' : '(réel)');
    }

    // Test de la fonction de fallback
    console.log('  Test de send-email...');
    const { data: fallbackTest, error: fallbackError } = await supabase.functions.invoke('send-email', {
      body: {
        to: 'test@example.com',
        subject: 'Test de configuration',
        html: '<p>Test</p>'
      }
    });

    if (fallbackError) {
      console.log('  ❌ Erreur fallback:', fallbackError.message);
    } else {
      console.log('  ✅ Fallback fonctionne:', fallbackTest?.message);
    }

    // 4. Vérifier les tables GDPR
    console.log('\n4️⃣ Tables GDPR:');
    
    const tables = ['secure_download_tokens', 'data_exports', 'data_access_audit', 'gdpr_consents'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`  ${table}: ❌ Erreur - ${error.message}`);
      } else {
        console.log(`  ${table}: ✅ Accessible`);
      }
    }

    console.log('\n🎉 Vérification terminée !');
    
    // Résumé des recommandations
    console.log('\n📋 Recommandations:');
    if (!smtpSettings || smtpSettings.length === 0) {
      console.log('  ⚠️  Configurez les paramètres SMTP dans la table site_settings');
    }
    if (mailgunTest?.simulated) {
      console.log('  ⚠️  Mailgun est en mode simulation - configurez MAILGUN_API_KEY et MAILGUN_DOMAIN');
    }
    console.log('  ✅ Le système d\'export de données est prêt à être testé');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

checkConfiguration();
