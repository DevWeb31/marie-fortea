# 🔐 Guide de Sécurité - Marie Fortea

## ⚠️ Données Sensibles et Versioning

Ce projet a été nettoyé pour être **sécurisé** lors du versioning sur GitHub. Toutes les données sensibles ont été remplacées par des placeholders.

### 🚫 Ce qui a été supprimé/remplacé :

#### **Clés API Supabase**
- ❌ Clés anonymes en dur → ✅ `your-dev-anon-key-here`
- ❌ Clés service role en dur → ✅ `YOUR_SUPABASE_SERVICE_ROLE_KEY`

#### **Identifiants Administrateur**
- ❌ Email admin en dur → ✅ `admin@your-domain.com`
- ❌ Mot de passe admin en dur → ✅ `YOUR_SECURE_PASSWORD`

#### **Clés Stripe**
- ❌ Clés de test en dur → ✅ `your-stripe-test-key-here`
- ❌ Clés de production en dur → ✅ `your-stripe-live-key-here`

### ✅ Ce qui reste (légitime) :

#### **Données Publiques**
- ✅ Numéro de téléphone : `07 57 57 93 30` (visible sur le site)
- ✅ Email de contact : `noreply@marie-fortea.com` (visible sur le site)

#### **Configuration par défaut**
- ✅ Paramètres SMTP par défaut (smtp.gmail.com, etc.)
- ✅ URLs de développement (localhost, etc.)

## 🔧 Configuration pour le Développement

### 1. Variables d'environnement
Créez un fichier `.env.local` avec vos vraies valeurs :

```bash
# Supabase
VITE_SUPABASE_URL_DEV=http://localhost:54321
VITE_SUPABASE_ANON_KEY_DEV=votre_vraie_cle_dev

# Production
VITE_SUPABASE_URL_PROD=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY_PROD=votre_vraie_cle_prod
```

### 2. Scripts de configuration
Les scripts dans `/scripts/` contiennent des placeholders. Remplacez :
- `YOUR_SUPABASE_SERVICE_ROLE_KEY` par votre vraie clé service role
- `admin@your-domain.com` par votre vraie adresse admin
- `YOUR_SECURE_PASSWORD` par un mot de passe sécurisé

## 🛡️ Bonnes Pratiques

### ✅ À faire :
- Utiliser des variables d'environnement pour les données sensibles
- Créer des fichiers `.env.local` (ignorés par Git)
- Utiliser des placeholders dans les scripts
- Documenter les variables nécessaires

### ❌ À éviter :
- Commiter des clés API réelles
- Hardcoder des mots de passe
- Exposer des données sensibles dans le code
- Oublier de mettre à jour `.gitignore`

## 📁 Fichiers Protégés

Le fichier `.gitignore` a été mis à jour pour protéger :
- Tous les fichiers `.env*`
- Les fichiers contenant `*secret*`, `*key*`, `*token*`
- Les fichiers de configuration locale
- Les backups de fichiers sensibles

## 🚀 Déploiement

Pour le déploiement en production :
1. Configurez les variables d'environnement sur votre plateforme
2. Remplacez les placeholders dans les scripts
3. Testez la configuration avant le déploiement
4. Surveillez les logs pour détecter d'éventuelles fuites

---

**Note** : Ce guide garantit que votre projet est sécurisé pour le versioning public tout en conservant toutes les fonctionnalités nécessaires.
