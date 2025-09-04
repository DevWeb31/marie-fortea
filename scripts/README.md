# 🛠️ Scripts - Marie Fortea

Ce dossier contient tous les scripts utilitaires pour le projet Marie Fortea, organisés par catégories.

## 📁 Structure

```
scripts/
├── README.md                    # Ce fichier - Index des scripts
├── setup/                       # Scripts de configuration initiale
│   ├── setup-dev-env.sh        # Configuration environnement de développement
│   ├── create-admin-user.sh    # Création utilisateur administrateur
│   └── setup-email-system.sh   # Configuration système d'email
├── deployment/                  # Scripts de déploiement
│   ├── deploy-to-production.sh # Déploiement en production
│   ├── supabase-prod.sh        # Gestion Supabase production
│   └── supabase-dev.sh         # Gestion Supabase développement
└── database/                    # Scripts de base de données
    ├── create-site-settings.sql # Création table site_settings
    └── restore-tables.sql       # Restauration des tables
```

## 🚀 Scripts de Configuration

### `setup/setup-dev-env.sh`
Configure l'environnement de développement avec les variables d'environnement nécessaires.

```bash
./scripts/setup/setup-dev-env.sh
```

### `setup/create-admin-user.sh`
Crée un utilisateur administrateur dans Supabase.

```bash
./scripts/setup/create-admin-user.sh
```

### `setup/setup-email-system.sh`
Configure le système d'email avec les paramètres SMTP.

```bash
./scripts/setup/setup-email-system.sh
```

## 🚀 Scripts de Déploiement

### `deployment/deploy-to-production.sh`
Déploie l'application en production sur Vercel.

```bash
./scripts/deployment/deploy-to-production.sh
```

### `deployment/supabase-prod.sh`
Gère les opérations Supabase en production.

```bash
./scripts/deployment/supabase-prod.sh
```

### `deployment/supabase-dev.sh`
Gère les opérations Supabase en développement.

```bash
./scripts/deployment/supabase-dev.sh
```

## 🗄️ Scripts de Base de Données

### `database/create-site-settings.sql`
Crée la table `site_settings` avec les paramètres par défaut.

```sql
-- À exécuter dans l'éditeur SQL de Supabase
\i scripts/database/create-site-settings.sql
```

### `database/restore-tables.sql`
Restaure toutes les tables de la base de données.

```sql
-- À exécuter dans l'éditeur SQL de Supabase
\i scripts/database/restore-tables.sql
```

## ⚠️ Sécurité

**Important** : Tous les scripts contiennent des placeholders pour les données sensibles. Remplacez les valeurs suivantes avant utilisation :

- `YOUR_SUPABASE_SERVICE_ROLE_KEY` : Votre vraie clé service role Supabase
- `admin@your-domain.com` : Votre vraie adresse email admin
- `YOUR_SECURE_PASSWORD` : Un mot de passe sécurisé

## 📚 Documentation

Pour plus d'informations, consultez :
- [Documentation complète](../docs/README.md)
- [Guide de sécurité](../docs/security/security-guide.md)
- [Guide de déploiement](../docs/deployment/production.md)

---

**Note** : Ces scripts sont maintenus à jour avec le projet. Pour toute question, consultez la documentation.
