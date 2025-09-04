# 🚀 Installation - Marie Fortea

Ce guide vous explique comment installer et configurer le projet Marie Fortea en local.

## 📋 Prérequis

### Logiciels requis
- **Node.js** 18+ (recommandé : version LTS)
- **npm** ou **yarn** (gestionnaire de paquets)
- **Git** (contrôle de version)
- **Supabase CLI** (pour la base de données locale)

### Comptes requis
- **GitHub** (pour le code source)
- **Supabase** (pour la base de données)
- **Vercel** (pour le déploiement, optionnel)

## 🔧 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/marie-fortea.git
cd marie-fortea
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

### 3. Configuration Supabase

Suivez le guide [Configuration Supabase](./configuration.md) pour configurer votre base de données.

### 4. Variables d'environnement

Créez un fichier `.env.local` :

```bash
# Supabase - Développement
VITE_SUPABASE_URL_DEV=http://localhost:54321
VITE_SUPABASE_ANON_KEY_DEV=votre-clé-anon-dev

# Configuration de l'application
VITE_APP_NAME=Marie Fortea - Dev
VITE_APP_ENV=development
VITE_DEBUG=true
```

### 5. Démarrer Supabase (local)

```bash
supabase start
```

### 6. Lancer l'application

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible sur `http://localhost:5173`

## ✅ Vérification

### Vérifier l'installation

1. **Application** : Ouvrez `http://localhost:5173`
2. **Base de données** : Vérifiez que Supabase fonctionne
3. **Console** : Aucune erreur dans la console du navigateur

### Tests

```bash
npm run test
# ou
yarn test
```

## 🐛 Dépannage

### Problèmes courants

#### Port déjà utilisé
```bash
# Changer le port
npm run dev -- --port 3000
```

#### Erreur Supabase
```bash
# Redémarrer Supabase
supabase stop
supabase start
```

#### Erreurs de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## 📚 Prochaines étapes

1. **Configuration** : Suivez [Configuration Supabase](./configuration.md)
2. **Développement** : Consultez [Structure de la base de données](../development/database.md)
3. **Déploiement** : Lisez [Déploiement en production](../deployment/production.md)

---

**Besoin d'aide ?** Consultez le [README principal](../../README.md) ou la [documentation complète](../README.md).
