#!/bin/bash

# Script pour appliquer le système d'archivage
# Date: 2025-01-17

echo "🔄 Application du système d'archivage..."

# Vérifier que Supabase est démarré
if ! pg_isready -h 127.0.0.1 -p 54322 > /dev/null 2>&1; then
    echo "❌ Supabase n'est pas démarré. Démarrez-le avec 'supabase start'"
    exit 1
fi

# Appliquer la migration
echo "📊 Application de la migration 20250117000007_add_archive_system.sql..."
supabase migration up

if [ $? -eq 0 ]; then
    echo "✅ Migration appliquée avec succès !"
    echo ""
    echo "🎉 Système d'archivage maintenant disponible :"
    echo "   • Vue 'Demandes Actives' : Réservations en cours"
    echo "   • Vue 'Archivées' : Réservations archivées"
    echo "   • Vue 'Corbeille' : Réservations supprimées"
    echo ""
    echo "🔧 Fonctions disponibles :"
    echo "   • archive_booking_request() : Archiver une réservation"
    echo "   • unarchive_booking_request() : Désarchiver une réservation"
    echo "   • hard_delete_booking_request() : Suppression définitive"
    echo ""
    echo "🌐 Redémarrez votre application pour voir les changements !"
else
    echo "❌ Erreur lors de l'application de la migration"
    exit 1
fi
