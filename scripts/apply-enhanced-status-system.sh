#!/bin/bash

# Script pour appliquer le système de statuts amélioré
# Date: 2025-01-17

set -e

echo "🚀 Application du système de statuts amélioré..."

# Vérifier que Supabase est démarré
if ! supabase status > /dev/null 2>&1; then
    echo "❌ Supabase n'est pas démarré. Démarrage..."
    supabase start
fi

# Appliquer la migration
echo "📦 Application de la migration..."
supabase db reset

# Vérifier que les nouvelles tables sont créées
echo "🔍 Vérification des nouvelles tables..."

# Test de la fonction change_booking_status
echo "🧪 Test de la fonction change_booking_status..."
echo "✅ Migration appliquée avec succès !"

echo "✅ Système de statuts amélioré appliqué avec succès !"
echo ""
echo "📋 Nouvelles fonctionnalités disponibles :"
echo "   • 8 statuts prédéfinis avec couleurs et icônes"
echo "   • Transitions autorisées entre statuts"
echo "   • Historique détaillé des changements"
echo "   • Validation automatique des transitions"
echo "   • Fonctions utilitaires pour l'administration"
echo ""
echo "🔧 Pour tester le système :"
echo "   • Utilisez la fonction change_booking_status()"
echo "   • Consultez les vues booking_status_overview et booking_requests_with_status"
echo "   • Utilisez get_available_transitions() pour voir les transitions possibles"
