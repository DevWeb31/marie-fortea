// Script pour tester l'API Supabase directement
// À exécuter dans la console du navigateur sur votre site en production

// 1. Tester la connexion Supabase
console.log('🔍 Test de l\'API Supabase...');

// 2. Récupérer les données directement
async function testSupabaseAPI() {
  try {
    // Remplacer par votre URL et clé Supabase de production
    const supabaseUrl = 'https://hwtfbyknjwlmidxeazbe.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
    
    const response = await fetch(`${supabaseUrl}/rest/v1/booking_requests_with_status?select=*&order=created_at.desc&limit=5`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    console.log('📊 Données récupérées:', data);
    
    // Vérifier les durées
    data.forEach((booking, index) => {
      console.log(`📋 Réservation ${index + 1}:`, {
        id: booking.id,
        parent_name: booking.parent_name,
        start_time: booking.start_time,
        end_time: booking.end_time,
        duration_hours: booking.duration_hours,
        status: booking.duration_hours ? '✅ OK' : '❌ PROBLÈME'
      });
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// 3. Tester la fonction formatDuration
function testFormatDuration() {
  console.log('🧮 Test de formatDuration...');
  
  const formatDuration = (durationHours) => {
    if (!durationHours || durationHours <= 0) return '0h';
    
    const hours = Math.floor(durationHours);
    const minutes = Math.round((durationHours - hours) * 60);
    
    if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h${minutes.toString().padStart(2, '0')}`;
    }
  };
  
  // Tests
  console.log('Test 1 - 8.5 heures:', formatDuration(8.5));
  console.log('Test 2 - 16.5 heures:', formatDuration(16.5));
  console.log('Test 3 - 0 heures:', formatDuration(0));
  console.log('Test 4 - null:', formatDuration(null));
  console.log('Test 5 - undefined:', formatDuration(undefined));
}

// Exécuter les tests
testSupabaseAPI();
testFormatDuration();

console.log('✅ Tests terminés - Vérifiez les résultats ci-dessus');
