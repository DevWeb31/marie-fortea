# 🚀 Configuration Supabase pour le Back-Office

## 📋 Prérequis

1. **Compte Supabase** : Créez un compte sur [supabase.com](https://supabase.com)
2. **Nouveau projet** : Créez un nouveau projet pour Marie Fortea

## ⚙️ Configuration

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet avec :

```bash
# URL de votre projet Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Clé anonyme de votre projet Supabase
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Récupération des informations

1. Allez dans votre **Dashboard Supabase**
2. Cliquez sur **Settings** → **API**
3. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

## 🔐 Configuration de l'authentification

### 1. Activer l'authentification par email

1. **Authentication** → **Providers**
2. **Email** → Activez "Enable email confirmations"
3. **Settings** → Désactivez "Enable email confirmations" (pour le développement)

### 2. Créer un utilisateur administrateur

1. **Authentication** → **Users**
2. Cliquez sur **Add user**
3. Remplissez :
   - Email : `admin@marie-fortea.fr`
   - Password : `admin123` (à changer en production)

## 🛡️ Sécurité

- ✅ **Clés publiques** : Les variables `VITE_*` sont publiques
- ❌ **Clés privées** : Ne jamais exposer `service_role` key
- 🔒 **Règles RLS** : À configurer pour les tables de données

## 🚧 Développement

### Authentification simulée

Si Supabase n'est pas configuré, l'authentification est simulée avec :
- Email : `admin@marie-fortea.fr`
- Mot de passe : `admin123`

### Prochaines étapes

1. **Tables de données** : Demandes, disponibilités, etc.
2. **Règles RLS** : Sécurité des données
3. **Fonctionnalités** : Gestion des demandes, planning, etc.

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Guide d'authentification](https://supabase.com/docs/guides/auth)
- [Exemples React](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
