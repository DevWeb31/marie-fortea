#!/bin/bash

# Script pour appliquer la migration améliorée du système de réservation
# Date: 2025-01-17

set -e  # Arrêter le script en cas d'erreur

echo "🚀 Application de la migration améliorée du système de réservation..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis la racine du projet"
    exit 1
fi

# Vérifier que Supabase est démarré
if ! pg_isready -h localhost -p 54332 > /dev/null 2>&1; then
    echo "⚠️  Supabase n'est pas démarré. Démarrage..."
    npx supabase start
fi

# Attendre que Supabase soit prêt
echo "⏳ Attente que Supabase soit prêt..."
sleep 5

# Appliquer la migration
echo "📝 Application de la migration 20250117000002_enhance_booking_system.sql..."
npx supabase db reset --linked

if [ $? -eq 0 ]; then
    echo "✅ Migration appliquée avec succès !"
    echo ""
    echo "📊 Nouvelles tables créées :"
    echo "   - children_details (informations détaillées des enfants)"
    echo "   - confirmed_bookings (réservations confirmées)"
    echo "   - booking_sessions (sessions de garde)"
    echo "   - booking_documents (gestion des documents)"
    echo "   - booking_reminders (système de rappels)"
    echo ""
    echo "🔍 Vues créées :"
    echo "   - confirmed_bookings_summary"
    echo "   - booking_sessions_summary"
    echo ""
    echo "📚 Documentation disponible dans DATABASE_STRUCTURE.md"
else
    echo "❌ Erreur lors de l'application de la migration"
    exit 1
fi

echo ""
echo "🎉 Migration terminée ! Votre base de données est maintenant prête pour le système de réservation en deux étapes."
