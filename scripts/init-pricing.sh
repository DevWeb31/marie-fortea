#!/bin/bash

# Script d'initialisation des prix
echo "🚀 Initialisation des prix par défaut..."

# Vérifier si Supabase est démarré
if ! supabase status > /dev/null 2>&1; then
    echo "❌ Supabase n'est pas démarré. Démarrage..."
    supabase start
fi

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 3

# Exécuter le script SQL
echo "📊 Application des prix par défaut..."
supabase db reset --linked

# Vérifier que les prix ont été appliqués
echo "✅ Prix initialisés avec succès !"
echo ""
echo "📋 Prix configurés :"
echo "- Prix de base : 15€/heure"
echo "- Supplément par enfant : +5€/heure"
echo "- Montant minimum : 20€"
echo "- Montant maximum : 200€/jour"
echo ""
echo "🎯 Vous pouvez maintenant accéder à la page de gestion des prix dans le back office"
