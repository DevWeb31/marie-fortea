#!/bin/bash

# Script de configuration du système d'email pour Marie Fortea
# Ce script configure la base de données et déploie la fonction Edge pour l'envoi d'emails

set -e

echo "🚀 Configuration du système d'email pour Marie Fortea"
echo "=================================================="

# Vérifier que Supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI n'est pas installé. Veuillez l'installer d'abord."
    echo "   Instructions: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Ce script doit être exécuté depuis la racine du projet"
    exit 1
fi

echo "📋 Vérification de la configuration Supabase..."

# Vérifier la configuration Supabase
if ! supabase status &> /dev/null; then
    echo "❌ Supabase n'est pas démarré. Démarrage..."
    supabase start
fi

echo "✅ Supabase est démarré"

echo "🗄️  Application de la migration pour les paramètres d'email..."

# Appliquer la migration
supabase db reset --linked

echo "✅ Migration appliquée avec succès"

echo "🚀 Déploiement de la fonction Edge pour l'envoi d'emails..."

# Déployer la fonction Edge
supabase functions deploy send-email

echo "✅ Fonction Edge déployée avec succès"

echo ""
echo "📧 Configuration des variables d'environnement SMTP..."
echo ""
echo "⚠️  IMPORTANT: Vous devez configurer les variables d'environnement SMTP dans votre projet Supabase :"
echo ""
echo "   Allez dans votre dashboard Supabase :"
echo "   https://supabase.com/dashboard/project/[VOTRE_PROJET_ID]/settings/functions"
echo ""
echo "   Ajoutez les variables suivantes :"
echo "   - SMTP_HOST (ex: smtp.gmail.com)"
echo "   - SMTP_PORT (ex: 587)"
echo "   - SMTP_USERNAME (votre email)"
echo "   - SMTP_PASSWORD (votre mot de passe d'application)"
echo "   - SMTP_FROM (email d'expédition, optionnel)"
echo ""
echo "📝 Exemple de configuration Gmail :"
echo "   SMTP_HOST=smtp.gmail.com"
echo "   SMTP_PORT=587"
echo "   SMTP_USERNAME=votre.email@gmail.com"
echo "   SMTP_PASSWORD=votre_mot_de_passe_d_application"
echo "   SMTP_FROM=noreply@marie-fortea.com"
echo ""
echo "🔐 Pour Gmail, vous devrez créer un mot de passe d'application :"
echo "   https://support.google.com/accounts/answer/185833"
echo ""

echo "🎉 Configuration terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Configurez les variables SMTP dans votre dashboard Supabase"
echo "   2. Testez l'envoi d'email en créant une réservation"
echo "   3. Vérifiez que l'email de notification est configuré dans le back-office"
echo ""
echo "🔗 Liens utiles :"
echo "   - Dashboard Supabase : https://supabase.com/dashboard"
echo "   - Documentation Edge Functions : https://supabase.com/docs/guides/functions"
echo "   - Guide SMTP : https://supabase.com/docs/guides/functions/examples/send-emails"
echo ""
