# 🚀 Marie Fortea - Architecture DevWeb31

Application web moderne construite avec l'architecture DevWeb31, intégrant React, TypeScript, Vite, Tailwind CSS, Supabase et Vercel.

## 🏗️ **Architecture**

### **Technologies**
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI
- **Base de données**: Supabase (PostgreSQL)
- **Déploiement**: Vercel avec CI/CD automatique
- **Qualité**: ESLint + Prettier + Husky
- **Tests**: Vitest + Testing Library

### **Structure du Projet**
```
marie-fortea/
├── .github/workflows/     # Pipeline CI/CD GitHub Actions
├── .husky/               # Hooks Git automatiques
├── scripts/              # Scripts de gestion des environnements
├── supabase/             # Configuration et migrations Supabase
├── src/
│   ├── components/       # Composants React réutilisables
│   ├── pages/           # Pages de l'application
│   ├── hooks/           # Hooks React personnalisés
│   ├── lib/             # Utilitaires et configurations
│   ├── config/          # Configuration des environnements
│   └── test/            # Configuration des tests
└── vercel.json          # Configuration Vercel
```

## 🚀 **Démarrage Rapide**

### **Prérequis**
- Node.js 18+ et npm
- Docker (pour Supabase local)
- Git

### **Installation**
```bash
# Cloner le projet
git clone <repository-url>
cd marie-fortea

# Configuration automatique de l'environnement
./scripts/setup-dev-env.sh

# Ou installation manuelle
npm install
npm run dev
```

### **Environnements**

#### **Développement Local**
```bash
# Démarrer l'application
npm run dev

# Démarrer Supabase local
npm run supabase:dev start

# Appliquer les migrations
npm run db:dev
```

#### **Production**
```bash
# Build de production
npm run build

# Déploiement Vercel
npm run vercel:deploy
```

## 🛠️ **Scripts Disponibles**

### **Développement**
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Preview du build

### **Qualité du Code**
- `npm run lint` - Vérification ESLint
- `npm run format` - Formatage Prettier
- `npm run type-check` - Vérification TypeScript

### **Tests**
- `npm run test` - Tests en mode watch
- `npm run test:coverage` - Tests avec couverture
- `npm run test:ui` - Interface de tests

### **Supabase**
- `npm run supabase:dev` - Gestion environnement dev
- `npm run supabase:prod` - Gestion environnement prod
- `npm run db:dev` - Migrations développement
- `npm run db:prod` - Migrations production

### **Utilitaires**
- `npm run setup:dev` - Configuration initiale
- `npm run analyze` - Analyse du bundle
- `npm run vercel:dev` - Développement Vercel

## 🔧 **Configuration**

### **Variables d'Environnement**

#### **Développement (.env.development)**
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-dev-key
VITE_API_BASE_URL=http://localhost:3000/api
```

#### **Production (.env.production)**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_README.md
VITE_SUPABASE_ANON_KEY=your-prod-key
VITE_API_BASE_URL=https://your-domain.com/api
```

### **Supabase**

#### **Configuration Locale**
```bash
# Démarrer Supabase
./scripts/supabase-dev.sh start

# Statut
./scripts/supabase-dev.sh status

# Migrations
./scripts/supabase-dev.sh migrate
```

#### **Configuration Production**
```bash
# Statut
./scripts/supabase-prod.sh status

# Surveillance
./scripts/supabase-prod.sh monitor
```

## 🚀 **Déploiement**

### **Vercel (Automatique)**
- Déploiement automatique sur push vers `main`
- Preview automatique sur pull request
- Configuration via `vercel.json`

### **GitHub Actions**
- Pipeline CI/CD complet
- Tests automatiques
- Build et déploiement
- Qualité du code

## 🧪 **Tests**

### **Exécution des Tests**
```bash
# Tests en mode watch
npm run test

# Tests avec couverture
npm run test:coverage

# Interface de tests
npm run test:ui
```

### **Configuration des Tests**
- Vitest pour les tests unitaires
- Testing Library pour les composants React
- Mocks automatiques pour Supabase et React Router
- Couverture de code configurée

## 🔒 **Sécurité**

### **Fonctionnalités**
- Row Level Security (RLS) Supabase
- Validation des données avec Zod
- Protection CSRF
- Headers de sécurité Vercel

### **Bonnes Pratiques**
- Variables d'environnement sécurisées
- Pas de clés API dans le code
- Validation côté client et serveur
- Logs sécurisés

## 📊 **Monitoring et Performance**

### **Métriques**
- Bundle analyzer intégré
- Tests de performance
- Monitoring Supabase
- Logs structurés

### **Optimisations**
- Code splitting automatique
- Lazy loading des composants
- Optimisation des images
- Cache intelligent

## 🤝 **Contribution**

### **Workflow Git**
1. Fork du projet
2. Création d'une branche feature
3. Développement avec tests
4. Pull request avec description
5. Review et merge

### **Standards de Code**
- ESLint + Prettier configurés
- Hooks Git automatiques
- Tests obligatoires
- Documentation des composants

## 📚 **Documentation**

### **Liens Utiles**
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation React](https://react.dev)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)

### **Architecture DevWeb31**
- Documentation interne de l'architecture
- Patterns de développement
- Standards de qualité
- Bonnes pratiques

## 🆘 **Support**

### **Problèmes Courants**
- Vérifiez que Docker est démarré pour Supabase
- Assurez-vous que les variables d'environnement sont configurées
- Vérifiez la connectivité réseau

### **Contact**
- Équipe de développement
- Issues GitHub
- Documentation interne

## 📄 **Licence**

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ par l'équipe DevWeb31**
