// Script de test pour vérifier les durées en production
// Usage: Copier-coller ce code dans la console du navigateur sur le site de production

console.log('🧪 Test des durées en production');
console.log('===============================');

// Test 1: Vérifier la fonction calculateDurationHours
function calculateDurationHours(startTime, endTime) {
  const parseTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);

  let durationMinutes;

  if (endMinutes <= startMinutes) {
    durationMinutes = (1440 - startMinutes) + endMinutes;
  } else {
    durationMinutes = endMinutes - startMinutes;
  }

  return Math.round((durationMinutes / 60) * 100) / 100;
}

// Tests de la fonction
const testCases = [
  { start: '08:30', end: '01:00', expected: 16.5, description: '8h30 à 1h00 (lendemain)' },
  { start: '08:00', end: '23:30', expected: 15.5, description: '8h00 à 23h30 (même jour)' },
  { start: '20:00', end: '02:00', expected: 6, description: '20h00 à 2h00 (lendemain)' },
];

console.log('Tests de la fonction calculateDurationHours:');
testCases.forEach((test, index) => {
  const result = calculateDurationHours(test.start, test.end);
  const passed = result === test.expected;
  console.log(`Test ${index + 1}: ${test.description}`);
  console.log(`  ${test.start} → ${test.end} = ${result}h (attendu: ${test.expected}h)`);
  console.log(`  ${passed ? '✅ PASS' : '❌ FAIL'}`);
});

console.log('===============================');

// Test 2: Vérifier les données du back office
console.log('Pour tester les données du back office:');
console.log('1. Allez sur la page d\'administration');
console.log('2. Ouvrez la console (F12)');
console.log('3. Exécutez ce code:');
console.log(`
// Test des données du back office
fetch('/api/booking-requests')
  .then(response => response.json())
  .then(data => {
    console.log('📊 Données des réservations:');
    data.forEach(booking => {
      console.log(\`ID: \${booking.id}\`);
      console.log(\`  Heure: \${booking.start_time} → \${booking.end_time}\`);
      console.log(\`  Durée: \${booking.duration_hours}h\`);
      console.log(\`  Statut: \${booking.duration_hours < 0 ? '❌ NÉGATIF' : booking.duration_hours > 0 ? '✅ OK' : '❌ ZERO'}\`);
      console.log('---');
    });
  })
  .catch(error => console.error('Erreur:', error));
`);

console.log('===============================');
console.log('🎯 Résultat attendu:');
console.log('- Les durées devraient être positives');
console.log('- 8h30 à 1h00 devrait afficher 16h30 (pas 0h)');
console.log('- Plus de valeurs négatives dans la console');
