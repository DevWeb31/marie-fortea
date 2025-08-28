#!/bin/bash

# Script pour corriger les paramètres SMTP manquants
# Ce script exécute le script SQL pour insérer les paramètres SMTP

set -e

echo "🔧 Correction des paramètres SMTP manquants"
echo "=========================================="

# Vérifier que Supabase est en cours d'exécution
if ! supabase status &> /dev/null; then
    echo "❌ Supabase n'est pas démarré. Démarrage..."
    supabase start
fi

echo "✅ Supabase est en cours d'exécution"

# Vérifier que la base de données est accessible
echo "🗄️  Vérification de l'accès à la base de données..."

# Essayer de se connecter à la base de données
if ! psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "SELECT 1;" &> /dev/null; then
    echo "❌ Impossible de se connecter à la base de données"
    echo "   Vérifiez que Supabase est bien démarré"
    exit 1
fi

echo "✅ Connexion à la base de données réussie"

# Exécuter le script SQL
echo "📝 Exécution du script de correction..."

psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f scripts/check-smtp-settings.sql

echo ""
echo "🎉 Correction terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Rafraîchissez la page du back-office"
echo "   2. Allez dans Paramètres → Configuration SMTP"
echo "   3. Configurez vos paramètres Gmail"
echo "   4. Testez la connexion"
echo ""
echo "🔗 Accès au back-office : http://localhost:5173/admin"
echo "🔗 Accès à Supabase Studio : http://127.0.0.1:54333"
