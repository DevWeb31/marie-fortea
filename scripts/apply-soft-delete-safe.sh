#!/bin/bash

# Script pour appliquer la migration sûre de soft delete aux réservations
# Date: 2025-01-17
# Cette migration est sûre et n'efface pas les données existantes

echo "🗑️ Application de la migration sûre de soft delete aux réservations..."

# Vérifier que Supabase est démarré
if ! pg_isready -h 127.0.0.1 -p 54322 > /dev/null 2>&1; then
    echo "❌ Supabase n'est pas démarré. Démarrez-le avec 'supabase start'"
    exit 1
fi

# Appliquer la migration sûre
echo "📝 Application de la migration 20250117000006_add_soft_delete_safe.sql..."
supabase migration up

echo "✅ Migration sûre appliquée avec succès !"
echo ""
echo "🎯 Nouvelles fonctionnalités disponibles :"
echo "   - Bouton 'Mettre en corbeille' sur chaque réservation"
echo "   - Vue 'Corbeille' pour voir les réservations supprimées"
echo "   - Bouton 'Restaurer' pour récupérer une réservation"
echo "   - Bouton 'Supprimer définitivement' pour suppression finale"
echo ""
echo "🔧 Pour tester :"
echo "   1. Allez dans le back-office"
echo "   2. Cliquez sur le bouton corbeille d'une réservation"
echo "   3. Utilisez le bouton 'Voir la corbeille' pour basculer"
echo "   4. Restaurez ou supprimez définitivement selon vos besoins"
echo ""
echo "💾 Vos données existantes ont été préservées !"
