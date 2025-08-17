# 🚀 Configuration des Environnements Supabase

## 📋 Vue d'ensemble

Ce projet utilise **deux environnements Supabase** pour séparer le développement de la production :

- **🔧 Développement** : Pour créer et tester les tables
- **🚀 Production** : Pour le site en ligne

---

## ⚙️ Configuration des Variables d'Environnement

### 1. Créer le fichier `.env` à la racine du projet :

```bash
# ===== ENVIRONNEMENT DE DÉVELOPPEMENT =====
VITE_SUPABASE_URL_DEV=https://votre-projet-dev.supabase.co
VITE_SUPABASE_ANON_KEY_DEV=votre-clé-anon-dev

# ===== ENVIRONNEMENT DE PRODUCTION =====
VITE_SUPABASE_URL_PROD=https://votre-projet-prod.supabase.co
VITE_SUPABASE_ANON_KEY_PROD=votre-clé-anon-prod
```

### 2. Détection automatique de l'environnement :

- **`npm run dev`** → Utilise `VITE_SUPABASE_URL_DEV`
- **`npm run build`** → Utilise `VITE_SUPABASE_URL_PROD`
- **Vercel/Netlify** → Utilise automatiquement la production

---

## 🏗️ Création des Projets Supabase

### 1. Projet de Développement :
- **Nom** : `marie-fortea-dev`
- **URL** : `https://abcdefghijklmnop.supabase.co`
- **Usage** : Création des tables, tests, développement

### 2. Projet de Production :
- **Nom** : `marie-fortea-prod` (ou votre projet actuel)
- **URL** : `https://xyzabcdefghijklm.supabase.co`
- **Usage** : Site en ligne, données réelles

---

## 📊 Gestion des Tables

### 🔧 Phase de Développement :
1. **Connectez-vous** à votre projet `marie-fortea-dev`
2. **Créez les tables** dans l'interface Supabase
3. **Testez** les fonctionnalités
4. **Validez** que tout fonctionne

### 🚀 Phase de Production :
1. **Mergez** `develop` vers `main`
2. **Déployez** sur Vercel/Netlify
3. **Les tables** sont automatiquement créées dans la production
4. **Les données** de développement restent séparées

---

## 🔄 Workflow de Développement

### 1. Branche `develop` :
```bash
git checkout develop
# Développez avec marie-fortea-dev
# Créez et testez les tables
```

### 2. Branche `main` :
```bash
git checkout main
git merge develop
# Déploiement automatique avec marie-fortea-prod
```

---

## 🛡️ Sécurité

### ✅ Variables Publiques (VITE_*) :
- `VITE_SUPABASE_URL_DEV` : URL du projet dev
- `VITE_SUPABASE_ANON_KEY_DEV` : Clé anonyme dev
- `VITE_SUPABASE_URL_PROD` : URL du projet prod
- `VITE_SUPABASE_ANON_KEY_PROD` : Clé anonyme prod

### ❌ Variables Privées (à ne jamais exposer) :
- `service_role` keys
- `JWT_SECRET`
- `DATABASE_URL`

---

## 🧪 Test de la Configuration

### 1. Vérifiez la console en développement :
```
🚀 Supabase configuré pour l'environnement: development
📍 URL: https://votre-projet-dev.supabase.co
🔑 Clé: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Vérifiez la console en production :
```
🚀 Supabase configuré pour l'environnement: production
📍 URL: https://votre-projet-prod.supabase.co
🔑 Clé: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚨 Dépannage

### Problème : "Configuration Supabase manquante"
**Solution** : Vérifiez que votre fichier `.env` contient les bonnes variables

### Problème : "URL Supabase invalide"
**Solution** : Vérifiez que l'URL se termine par `.supabase.co`

### Problème : Mauvais environnement utilisé
**Solution** : Redémarrez le serveur après modification du `.env`

---

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Guide des environnements](https://supabase.com/docs/guides/getting-started/environment-variables)
- [Migrations de base de données](https://supabase.com/docs/guides/database/migrations)
