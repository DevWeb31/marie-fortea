#!/bin/bash

# Script de correction du calcul de durée et montant
# Date: 2025-01-17

echo "🔧 Application de la correction du calcul de durée et montant..."

# Vérifier que le fichier SQL existe
if [ ! -f "scripts/fix-duration-calculation.sql" ]; then
    echo "❌ Erreur: Le fichier scripts/fix-duration-calculation.sql n'existe pas"
    exit 1
fi

echo "📝 Exécution du script SQL de correction..."

# Exécuter le script SQL
# Note: Vous devrez exécuter ce script dans l'éditeur SQL de Supabase
echo "✅ Script SQL créé: scripts/fix-duration-calculation.sql"
echo ""
echo "📋 Instructions:"
echo "1. Allez sur https://supabase.com"
echo "2. Connectez-vous à votre projet"
echo "3. Ouvrez l'éditeur SQL"
echo "4. Copiez le contenu du fichier scripts/fix-duration-calculation.sql"
echo "5. Collez et exécutez le script"
echo ""
echo "🔍 Vérification:"
echo "Après l'exécution, vérifiez que:"
echo "- Les durées négatives sont devenues positives"
echo "- Les montants sont correctement calculés"
echo "- Le back office affiche les bonnes valeurs"

echo ""
echo "✅ Script terminé !"
