#!/bin/bash

# Script pour appliquer les fonctions de soft delete manquantes
# Date: 2025-01-17

echo "🔧 Application des fonctions de soft delete manquantes..."

# Vérifier que Supabase est démarré
if ! curl -s "http://127.0.0.1:54331/rest/v1/site_settings" > /dev/null 2>&1; then
    echo "❌ Supabase n'est pas démarré. Démarrez-le avec 'supabase start'"
    exit 1
fi

echo "📝 Exécution du script SQL..."

# Exécuter le script SQL via l'API Supabase
curl -X POST "http://127.0.0.1:54331/rest/v1/rpc/exec_sql" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU" \
  -H "Content-Type: application/json" \
  -d @scripts/fix-soft-delete-functions.sql

echo ""
echo "✅ Script SQL exécuté !"
echo ""
echo "🧪 Test des fonctions..."
echo "1. Allez dans le back-office"
echo "2. Cliquez sur le bouton corbeille d'une réservation"
echo "3. Vérifiez que la réservation disparaît de la liste"
echo "4. Utilisez le bouton 'Voir la corbeille' pour la retrouver"
