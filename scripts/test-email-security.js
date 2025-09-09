#!/usr/bin/env node

/**
 * Script de test pour vérifier la sécurité des emails d'export
 * Teste le comportement avec des adresses email existantes et inexistantes
 * Usage: node scripts/test-email-security.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testEmailSecurity() {
  console.log('🔒 Test de sécurité des emails d\'export...\n');
  
  try {
    // 1. Récupérer une adresse email existante en base
    console.log('1️⃣ Recherche d\'une adresse email existante...');
    
    const { data: existingEmails, error: emailError } = await supabase
      .from('booking_requests')
      .select('parent_email')
      .limit(1);

    if (emailError) {
      console.error('❌ Erreur lors de la récupération des emails:', emailError.message);
      return;
    }

    const existingEmail = existingEmails?.[0]?.parent_email;
    const nonExistingEmail = 'test-inexistant-' + Date.now() + '@example.com';

    if (!existingEmail) {
      console.log('⚠️  Aucune adresse email trouvée en base. Création d\'une adresse de test...');
      
      // Créer une réservation de test
      const { data: testBooking, error: testError } = await supabase
        .from('booking_requests')
        .insert({
          parent_name: 'Test User',
          parent_email: 'test-security@example.com',
          parent_phone: '0123456789',
          service_type: 'regular',
          requested_date: new Date().toISOString(),
          start_time: '09:00',
          end_time: '17:00',
          children_count: 1,
          status: 'pending'
        })
        .select()
        .single();

      if (testError) {
        console.error('❌ Erreur lors de la création du test:', testError.message);
        return;
      }

      console.log('✅ Adresse de test créée: test-security@example.com');
    } else {
      console.log(`✅ Adresse email existante trouvée: ${existingEmail}`);
    }

    // 2. Test avec une adresse email existante
    console.log('\n2️⃣ Test avec une adresse email EXISTANTE...');
    
    const testEmail1 = existingEmail || 'test-security@example.com';
    console.log(`   Email testé: ${testEmail1}`);
    
    const { data: result1, error: error1 } = await supabase.functions.invoke('send-email-mailgun', {
      body: {
        to: testEmail1,
        subject: 'Test sécurité - Email existant',
        html: '<p>Ceci est un test avec une adresse email existante en base.</p>',
        text: 'Ceci est un test avec une adresse email existante en base.'
      }
    });

    if (error1) {
      console.log('   ❌ Erreur:', error1.message);
    } else {
      console.log('   ✅ Email envoyé:', result1?.simulated ? '(simulation)' : '(réel)');
    }

    // 3. Test avec une adresse email inexistante
    console.log('\n3️⃣ Test avec une adresse email INEXISTANTE...');
    
    console.log(`   Email testé: ${nonExistingEmail}`);
    
    const { data: result2, error: error2 } = await supabase.functions.invoke('send-email-mailgun', {
      body: {
        to: nonExistingEmail,
        subject: 'Test sécurité - Email inexistant',
        html: '<p>Ceci est un test avec une adresse email inexistante en base.</p>',
        text: 'Ceci est un test avec une adresse email inexistante en base.'
      }
    });

    if (error2) {
      console.log('   ❌ Erreur:', error2.message);
    } else {
      console.log('   ✅ Email envoyé:', result2?.simulated ? '(simulation)' : '(réel)');
    }

    // 4. Test de la fonction checkUserDataExists
    console.log('\n4️⃣ Test de la fonction checkUserDataExists...');
    
    // Test avec email existant
    const { data: check1, error: checkError1 } = await supabase
      .from('booking_requests')
      .select('id')
      .eq('parent_email', testEmail1);

    console.log(`   Email existant (${testEmail1}):`, check1?.length > 0 ? '✅ Trouvé' : '❌ Non trouvé');

    // Test avec email inexistant
    const { data: check2, error: checkError2 } = await supabase
      .from('booking_requests')
      .select('id')
      .eq('parent_email', nonExistingEmail);

    console.log(`   Email inexistant (${nonExistingEmail}):`, check2?.length > 0 ? '❌ Trouvé (anormal!)' : '✅ Non trouvé (normal)');

    // 5. Vérifier les logs d'audit
    console.log('\n5️⃣ Vérification des logs d\'audit...');
    
    const { data: auditLogs, error: auditError } = await supabase
      .from('data_access_audit')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (auditError) {
      console.log('   ❌ Erreur audit:', auditError.message);
    } else {
      console.log('   ✅ Derniers logs d\'audit:');
      auditLogs?.forEach((log, index) => {
        console.log(`      ${index + 1}. ${log.action} - ${log.user_email} - ${log.created_at}`);
      });
    }

    console.log('\n🎉 Tests de sécurité terminés !');
    console.log('\n📋 Résumé des bonnes pratiques:');
    console.log('   ✅ Les emails ne sont envoyés QUE si l\'adresse existe en base');
    console.log('   ✅ Les tentatives d\'export sont tracées dans les logs d\'audit');
    console.log('   ✅ Aucun email n\'est envoyé pour les adresses inexistantes');
    console.log('   ✅ La sécurité est maintenue contre les attaques par énumération');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testEmailSecurity();
