# 🚀 Marie Fortea - Site Web Professionnel

Site web moderne pour les services de garde d'enfants professionnels, développé avec l'architecture DevWeb31.

## 📋 **Description**

Marie Fortea propose des services de garde d'enfants de qualité, incluant :
- Garde d'enfants à domicile
- Services d'urgence
- Garde pour événements spéciaux
- Services de week-end

## 🛠️ **Technologies**

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS + Radix UI
- **Base de données** : Supabase (PostgreSQL)
- **Déploiement** : Vercel avec CI/CD automatique
- **Qualité** : ESLint + Prettier + Husky
- **Tests** : Vitest + Testing Library

## 🚀 **Démarrage Rapide**

### **Prérequis**
- Node.js 18+ et npm
- Docker (pour Supabase local)

### **Installation**
```bash
# Cloner le projet
git clone <repository-url>
cd marie-fortea

# Installation des dépendances
npm install

# Configuration de l'environnement
./scripts/setup-dev-env.sh

# Démarrer en développement
npm run dev
```

## 🛠️ **Scripts Principaux**

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run lint` - Vérification du code
- `npm run format` - Formatage automatique
- `npm run test` - Exécution des tests

## 🔧 **Configuration**

### **Variables d'Environnement**
```env
# Développement
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-dev-key

# Production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-key
```

### **Supabase Local**
```bash
# Démarrer Supabase
npm run supabase:dev start

# Appliquer les migrations
npm run db:dev
```

## 🚀 **Déploiement**

Le site se déploie automatiquement sur Vercel via GitHub Actions lors des pushes vers la branche `main`.

## 📚 **Documentation**

### 📖 Documentation complète
- **[Documentation complète](./docs/README.md)** - Index de toute la documentation

### 🚀 Démarrage rapide
- [Installation](./docs/getting-started/installation.md) - Guide d'installation
- [Configuration Supabase](./docs/getting-started/configuration.md) - Configuration initiale
- [Scripts utilitaires](./scripts/README.md) - Scripts de configuration et déploiement

### 🚀 Déploiement
- [Déploiement en production](./docs/deployment/production.md) - Guide de déploiement
- [Gestion des environnements](./docs/deployment/environments.md) - Configuration dev/prod

### 🛠️ Développement
- [Structure de la base de données](./docs/development/database.md) - Schéma et relations
- [Système de réservation](./docs/development/booking-system.md) - Architecture
- [Système d'email](./docs/development/email-system.md) - Configuration email

### 🔐 Sécurité
- [Guide de sécurité](./docs/security/security-guide.md) - Bonnes pratiques

### Documentation externe
- [Architecture DevWeb31](https://devweb31.com)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vercel](https://vercel.com/docs)

## 📞 **Contact**

- **Développeur** : Damien Oriente (Damiodev)
- **Société** : DevWeb31
- **Email** : contact@devweb31.com
- **Site** : https://devweb31.com

---

## 📄 **Licence et Droits d'Auteur**

**© 2025 Damien Oriente (Damiodev) - DevWeb31. Tous droits réservés.**

Ce projet et son code source sont la propriété exclusive de **Damien Oriente**, également connu sous le nom **Damiodev**, et de sa société **DevWeb31**.

### **Conditions d'Utilisation**

- **Interdiction totale** de reproduction, distribution ou modification du code source
- **Interdiction totale** d'utilisation commerciale sans autorisation écrite
- **Interdiction totale** de reverse engineering ou décompilation
- **Interdiction totale** de création de travaux dérivés

### **Sanctions**

Toute violation de ces droits d'auteur sera poursuivie en justice conformément aux lois françaises et européennes sur la propriété intellectuelle.

### **Autorisations**

Les autorisations d'utilisation, de modification ou de distribution ne peuvent être accordées que par **écrit** par Damien Oriente ou DevWeb31.

---

**Développé avec ❤️ par Damien Oriente (Damiodev) - DevWeb31**
