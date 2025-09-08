# 🔍 Guide de débogage pour la production

## Problème
Les durées s'affichent correctement en développement mais pas en production (affichage "0h").

## Code de débogage ajouté

### 1. Logs dans la console
- **AdminBookingManager.tsx** : Logs des données brutes de Supabase
- **BookingKanbanBoard.tsx** : Logs des données brutes de Supabase  
- **BookingRequestsList.tsx** : Logs des données brutes de Supabase
- **duration-utils.ts** : Logs détaillés de la fonction formatDuration

### 2. Affichage visuel de débogage
- Affichage de la valeur brute `[DEBUG: X]` à côté de chaque durée
- Couleur rouge pour bien voir les valeurs de débogage

## Comment utiliser le débogage

### Étape 1 : Ouvrir les outils de développement
1. Aller sur votre site en production
2. Appuyer sur **F12** (ou Cmd+Option+I sur Mac)
3. Aller dans l'onglet **Console**

### Étape 2 : Recharger la page
1. Recharger la page (Ctrl+F5 ou Cmd+Shift+R)
2. Observer les logs dans la console

### Étape 3 : Analyser les logs
Chercher ces messages dans la console :
- `🔍 DEBUG PROD - Début du chargement des réservations...`
- `🔍 DEBUG PROD - Réponse Supabase:`
- `🔍 DEBUG PROD - Données brutes booking:`
- `🔍 DEBUG PROD formatDuration - Input:`

### Étape 4 : Tester l'API directement
Copier et coller ce code dans la console :

```javascript
// Test direct de l'API
async function testAPI() {
  const { data, error } = await window.supabase
    .from('booking_requests_with_status')
    .select('id, parent_name, start_time, end_time, duration_hours')
    .limit(3);
  
  console.log('Résultat API:', { data, error });
  
  if (data) {
    data.forEach(booking => {
      console.log(`${booking.parent_name}: ${booking.start_time} à ${booking.end_time} = ${booking.duration_hours}h`);
    });
  }
}

testAPI();
```

### Étape 5 : Utiliser le script de débogage complet
Copier et coller le contenu de `scripts/debug-production.js` dans la console.

## Ce qu'il faut vérifier

### 1. Données de Supabase
- `duration_hours` est-il présent dans les données ?
- Quelle est la valeur de `duration_hours` ?
- Le type est-il correct (number) ?

### 2. Fonction formatDuration
- Quelle valeur reçoit-elle en entrée ?
- Pourquoi retourne-t-elle "0h" ?

### 3. Affichage visuel
- Les valeurs `[DEBUG: X]` s'affichent-elles ?
- Sont-elles correctes ?

## Solutions possibles

### Si `duration_hours` est null/undefined
- Problème de base de données
- Vérifier les migrations

### Si `duration_hours` a une valeur mais formatDuration retourne "0h"
- Problème dans la fonction formatDuration
- Vérifier la logique de la fonction

### Si les données sont correctes mais l'affichage est "0h"
- Problème de cache
- Problème de rendu React

## Nettoyage après débogage

Une fois le problème résolu, supprimer :
1. Tous les `console.log` avec `DEBUG PROD`
2. Tous les `<span className="text-xs text-red-500">[DEBUG: ...]</span>`
3. Ce fichier `DEBUG_PRODUCTION.md`

## Fichiers modifiés pour le débogage

- `src/components/AdminBookingManager.tsx`
- `src/components/BookingKanbanBoard.tsx` 
- `src/components/BookingRequestsList.tsx`
- `src/lib/duration-utils.ts`
- `scripts/debug-production.js`
- `DEBUG_PRODUCTION.md` (ce fichier)
