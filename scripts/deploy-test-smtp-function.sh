#!/bin/bash

# Script pour déployer la fonction Edge Function test-smtp

echo "🚀 Déploiement de la fonction test-smtp..."

# Vérifier que Supabase est démarré
if ! supabase status > /dev/null 2>&1; then
    echo "❌ Supabase n'est pas démarré. Démarrage..."
    supabase start
fi

# Déployer la fonction
echo "📦 Déploiement de la fonction test-smtp..."
supabase functions deploy test-smtp

if [ $? -eq 0 ]; then
    echo "✅ Fonction test-smtp déployée avec succès !"
    echo "🌐 URL de test: http://127.0.0.1:54331/functions/v1/test-smtp"
else
    echo "❌ Erreur lors du déploiement de la fonction test-smtp"
    exit 1
fi

echo "🎉 Déploiement terminé !"
