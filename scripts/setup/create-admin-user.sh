#!/bin/bash

# Script pour créer un utilisateur administrateur dans Supabase
# Date: 2025-01-17
#
# ⚠️  SÉCURITÉ : Ce script contient des placeholders pour les données sensibles
# Remplacez les valeurs suivantes avant utilisation :
# - YOUR_SUPABASE_SERVICE_ROLE_KEY : Votre vraie clé service role Supabase
# - admin@your-domain.com : Votre vraie adresse email admin
# - YOUR_SECURE_PASSWORD : Un mot de passe sécurisé

echo "🔐 Création d'un utilisateur administrateur dans Supabase..."

# Vérifier que Supabase est démarré
if ! pg_isready -h 127.0.0.1 -p 54322 > /dev/null 2>&1; then
    echo "❌ Supabase n'est pas démarré. Démarrez-le avec 'supabase start'"
    exit 1
fi

# Créer l'utilisateur administrateur
echo "👤 Création de l'utilisateur administrateur..."

# Utiliser l'API Supabase pour créer l'utilisateur
curl -X POST "http://127.0.0.1:54331/auth/v1/admin/users" \
  -H "apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@your-domain.com",
    "password": "YOUR_SECURE_PASSWORD",
    "email_confirm": true,
    "user_metadata": {
      "role": "admin",
      "full_name": "Administrateur Marie Fortea"
    }
  }'

echo ""
echo "✅ Utilisateur administrateur créé !"
echo ""
echo "🔑 Identifiants de connexion :"
echo "   Email: admin@your-domain.com"
echo "   Mot de passe: YOUR_SECURE_PASSWORD"
echo ""
echo "⚠️  IMPORTANT: Changez ce mot de passe en production !"
echo ""
echo "🌐 Vous pouvez maintenant vous connecter au back-office :"
echo "   http://localhost:3000/admin"
