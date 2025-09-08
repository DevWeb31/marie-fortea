// Script de débogage pour la production
// À exécuter dans la console du navigateur (F12 > Console)

console.log('🔍 DÉBUT DU DÉBOGAGE PRODUCTION');

// 1. Vérifier si Supabase est disponible
if (typeof window.supabase !== 'undefined') {
  console.log('✅ Supabase disponible');
} else {
  console.log('❌ Supabase non disponible');
}

// 2. Tester l'API directement
async function testSupabaseDirect() {
  console.log('🔍 Test direct de l\'API Supabase...');
  
  try {
    // Utiliser l'instance Supabase du site
    const { data, error } = await window.supabase
      .from('booking_requests_with_status')
      .select('id, parent_name, start_time, end_time, duration_hours')
      .limit(3);
    
    console.log('📊 Résultat API direct:', {
      data,
      error,
      count: data?.length || 0
    });
    
    if (data && data.length > 0) {
      data.forEach((booking, index) => {
        console.log(`📋 Réservation ${index + 1}:`, {
          id: booking.id,
          parent_name: booking.parent_name,
          start_time: booking.start_time,
          end_time: booking.end_time,
          duration_hours: booking.duration_hours,
          type: typeof booking.duration_hours
        });
      });
    }
    
  } catch (err) {
    console.error('❌ Erreur API direct:', err);
  }
}

// 3. Tester la fonction formatDuration
function testFormatDuration() {
  console.log('🔍 Test de formatDuration...');
  
  const testValues = [8.5, 16.5, 0, null, undefined, '8.5'];
  
  testValues.forEach(value => {
    try {
      // Simuler la fonction formatDuration
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
      
      const result = formatDuration(value);
      console.log(`🧮 formatDuration(${value}) = "${result}"`);
    } catch (err) {
      console.error(`❌ Erreur formatDuration(${value}):`, err);
    }
  });
}

// 4. Vérifier les éléments DOM
function checkDOM() {
  console.log('🔍 Vérification des éléments DOM...');
  
  const durationElements = document.querySelectorAll('[class*="duration"], [class*="Duration"]');
  console.log(`📊 Éléments DOM avec "duration": ${durationElements.length}`);
  
  durationElements.forEach((el, index) => {
    console.log(`📋 Élément ${index + 1}:`, {
      text: el.textContent,
      className: el.className,
      innerHTML: el.innerHTML
    });
  });
}

// 5. Vérifier les variables globales
function checkGlobals() {
  console.log('🔍 Vérification des variables globales...');
  
  const globals = ['supabase', 'window.supabase'];
  globals.forEach(global => {
    try {
      const value = eval(global);
      console.log(`🌐 ${global}:`, typeof value, value ? '✅ Disponible' : '❌ Non disponible');
    } catch (err) {
      console.log(`❌ ${global}: Non disponible`);
    }
  });
}

// Exécuter tous les tests
async function runAllTests() {
  console.log('🚀 Lancement de tous les tests...');
  
  checkGlobals();
  await testSupabaseDirect();
  testFormatDuration();
  checkDOM();
  
  console.log('✅ Tests terminés - Vérifiez les résultats ci-dessus');
}

// Lancer les tests
runAllTests();
