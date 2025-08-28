#!/bin/bash

# Script pour déployer les nouvelles tables en production Supabase
# Date: 2025-01-17
# IMPORTANT: Ne jamais commiter ce script avec des vraies valeurs !

set -e  # Arrêter le script en cas d'erreur

echo "🚀 Déploiement des nouvelles tables en production Supabase..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis la racine du projet"
    exit 1
fi

# Vérifier que les variables d'environnement de production sont définies
if [ -z "$SUPABASE_PROD_URL" ] || [ -z "$SUPABASE_PROD_ANON_KEY" ]; then
    echo "⚠️  Variables d'environnement de production non définies"
    echo ""
    echo "🔐 Pour des raisons de sécurité, définissez ces variables AVANT d'exécuter le script :"
    echo ""
    echo "   # Option 1: Variables d'environnement (recommandé)"
    echo "   export SUPABASE_PROD_URL=https://votre-projet.supabase.co"
    echo "   export SUPABASE_PROD_ANON_KEY=votre-clé-anon"
    echo ""
    echo "   # Option 2: Fichier .env.production (ajoutez à .gitignore)"
    echo "   # Créez un fichier .env.production avec :"
    echo "   # SUPABASE_PROD_URL=https://votre-projet.supabase.co"
    echo "   # SUPABASE_PROD_ANON_KEY=votre-clé-anon"
    echo ""
    echo "   # Option 3: Ligne de commande directe"
    echo "   SUPABASE_PROD_URL=https://votre-projet.supabase.co SUPABASE_PROD_ANON_KEY=votre-clé-anon ./scripts/deploy-to-production.sh"
    echo ""
    echo "🚨 IMPORTANT: Ne jamais commiter ces informations sur GitHub !"
    exit 1
fi

# Afficher l'URL de manière sécurisée (seulement le début)
echo "📍 URL de production: ${SUPABASE_PROD_URL:0:20}..."
echo "🔑 Clé anonyme: ${SUPABASE_PROD_ANON_KEY:0:20}..."

# Créer un fichier de configuration temporaire pour la production
echo "📝 Création de la configuration temporaire pour la production..."
cat > supabase/config.prod.toml << EOF
# Configuration Supabase Production - Temporaire
project_id = "marie-fortea-prod"

[api]
enabled = true
port = 54321
schemas = ["public", "storage", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[db]
port = 54322
shadow_port = 54320
major_version = 15

[db.pooler]
enabled = false
port = 54329
pool_mode = "transaction"
default_pool_size = 15

[realtime]
enabled = true

[studio]
enabled = true
port = 54323
api_url = "http://localhost:54321"

[inbucket]
enabled = true
port = 54324
smtp_port = 54325
pop3_port = 54326

[storage]
enabled = true
file_size_limit = "50MiB"

[auth]
enabled = true
site_url = "http://localhost:3000"
additional_redirect_urls = ["https://localhost:3000"]
jwt_expiry = 3600

[edge_runtime]
enabled = true
EOF

# Sauvegarder l'ancienne configuration
echo "💾 Sauvegarde de la configuration locale..."
cp supabase/config.toml supabase/config.local.toml

# Remplacer par la configuration de production
echo "🔄 Application de la configuration de production..."
cp supabase/config.prod.toml supabase/config.toml

# Extraire la référence du projet de manière sécurisée
PROJECT_REF=$(echo "$SUPABASE_PROD_URL" | sed 's|https://||' | sed 's|.supabase.co||')

# Lier le projet de production
echo "🔗 Liaison avec le projet de production..."
echo "   Référence du projet: ${PROJECT_REF:0:10}..."
npx supabase link --project-ref "$PROJECT_REF"

# Appliquer la migration
echo "📝 Application de la migration en production..."
npx supabase db push

if [ $? -eq 0 ]; then
    echo "✅ Migration appliquée avec succès en production !"
    echo ""
    echo "📊 Nouvelles tables créées en production :"
    echo "   - children_details (informations détaillées des enfants)"
    echo "   - confirmed_bookings (réservations confirmées)"
    echo "   - booking_sessions (sessions de garde)"
    echo "   - booking_documents (gestion des documents)"
    echo "   - booking_reminders (système de rappels)"
    echo ""
    echo "🔍 Vues créées en production :"
    echo "   - confirmed_bookings_summary"
    echo "   - booking_sessions_summary"
    echo ""
    echo "🌐 Vérifiez dans votre dashboard Supabase de production :"
    echo "   ${SUPABASE_PROD_URL:0:20}..."
else
    echo "❌ Erreur lors de l'application de la migration en production"
    echo "🔄 Restauration de la configuration locale..."
    cp supabase/config.local.toml supabase/config.toml
    exit 1
fi

# Restaurer la configuration locale
echo "🔄 Restauration de la configuration locale..."
cp supabase/config.local.toml supabase/config.toml

# Nettoyer les fichiers temporaires
echo "🧹 Nettoyage des fichiers temporaires..."
rm -f supabase/config.prod.toml supabase/config.local.toml

echo ""
echo "🎉 Déploiement terminé ! Vos nouvelles tables sont maintenant en production."
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Vérifiez les tables dans votre dashboard Supabase de production"
echo "   2. Testez les nouvelles fonctionnalités"
echo "   3. Déployez votre application mise à jour"
echo ""
echo "🔐 N'oubliez pas de nettoyer vos variables d'environnement :"
echo "   unset SUPABASE_PROD_URL SUPABASE_PROD_ANON_KEY"
