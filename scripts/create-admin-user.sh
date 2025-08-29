#!/bin/bash

# Script pour créer un utilisateur administrateur dans Supabase
# Date: 2025-01-17

echo "🔐 Création d'un utilisateur administrateur dans Supabase..."

# Vérifier que Supabase est démarré
if ! pg_isready -h 127.0.0.1 -p 54322 > /dev/null 2>&1; then
    echo "❌ Supabase n'est pas démarré. Démarrez-le avec 'supabase start'"
    exit 1
fi

# Créer l'utilisateur administrateur
echo "👤 Création de l'utilisateur admin@marie-fortea.fr..."

# Utiliser l'API Supabase pour créer l'utilisateur
curl -X POST "http://127.0.0.1:54331/auth/v1/admin/users" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@marie-fortea.fr",
    "password": "admin123",
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
echo "   Email: admin@marie-fortea.fr"
echo "   Mot de passe: admin123"
echo ""
echo "⚠️  IMPORTANT: Changez ce mot de passe en production !"
echo ""
echo "🌐 Vous pouvez maintenant vous connecter au back-office :"
echo "   http://localhost:3000/admin"
