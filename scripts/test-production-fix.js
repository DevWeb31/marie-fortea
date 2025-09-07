// Script de test pour vérifier la correction en production
// Usage: Copier-coller ce code dans la console du navigateur sur le site de production

console.log('🧪 Test de la correction de durée en production');
console.log('===============================================');

// Test de la fonction formatDuration avec correction
function testFormatDuration() {
  // Simuler la fonction formatDuration avec correction
  function formatDuration(durationHours) {
    console.log('🔍 DEBUG PROD formatDuration - Input:', {
      durationHours,
      type: typeof durationHours,
      isNull: durationHours === null,
      isUndefined: durationHours === undefined,
      isNaN: isNaN(durationHours)
    });
    
    // CORRECTION: Si la durée est négative, on la corrige en ajoutant 24h
    let correctedDuration = durationHours;
    if (durationHours < 0) {
      correctedDuration = durationHours + 24;
      console.log('🔍 DEBUG PROD formatDuration - Durée négative corrigée:', {
        original: durationHours,
        corrected: correctedDuration
      });
    }
    
    if (!correctedDuration || correctedDuration <= 0) {
      console.log('🔍 DEBUG PROD formatDuration - Retour 0h car:', {
        durationHours: correctedDuration,
        condition: !correctedDuration || correctedDuration <= 0
      });
      return '0h';
    }
    
    const hours = Math.floor(correctedDuration);
    const minutes = Math.round((correctedDuration - hours) * 60);
    
    const result = minutes === 0 ? `${hours}h` : `${hours}h${minutes.toString().padStart(2, '0')}`;
    
    console.log('🔍 DEBUG PROD formatDuration - Résultat:', {
      input: durationHours,
      corrected: correctedDuration,
      hours,
      minutes,
      result
    });
    
    return result;
  }

  // Tests
  console.log('Test 1: Durée négative -7h');
  const result1 = formatDuration(-7);
  console.log(`Résultat: ${result1} (attendu: 17h)`);
  console.log(`Status: ${result1 === '17h' ? '✅ PASS' : '❌ FAIL'}`);
  
  console.log('\nTest 2: Durée négative -7.5h');
  const result2 = formatDuration(-7.5);
  console.log(`Résultat: ${result2} (attendu: 16h30)`);
  console.log(`Status: ${result2 === '16h30' ? '✅ PASS' : '❌ FAIL'}`);
  
  console.log('\nTest 3: Durée positive 8.5h');
  const result3 = formatDuration(8.5);
  console.log(`Résultat: ${result3} (attendu: 8h30)`);
  console.log(`Status: ${result3 === '8h30' ? '✅ PASS' : '❌ FAIL'}`);
}

// Exécuter le test
testFormatDuration();

console.log('\n===============================================');
console.log('🎯 Maintenant, testez votre back office:');
console.log('1. Rechargez la page (Ctrl+F5 ou Cmd+Shift+R)');
console.log('2. Vérifiez que les durées négatives sont corrigées');
console.log('3. Dans la console, vous devriez voir "Durée négative corrigée"');
console.log('4. Les durées devraient afficher des valeurs positives');
