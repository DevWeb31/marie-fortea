# 🚀 Guide de Déploiement - Marie Fortea

## 📋 Vue d'ensemble

Ce guide explique comment déployer et configurer le site Marie Fortea en production.

## 🔧 Configuration requise

### Variables d'environnement

Créez un fichier `.env.production` avec les variables suivantes :

```bash
# Supabase Production
VITE_SUPABASE_URL_PROD=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY_PROD=votre-clé-anon-production

# Configuration de l'application
VITE_APP_NAME=Marie Fortea
VITE_APP_ENV=production
VITE_DEBUG=false
```

### Configuration SMTP (optionnel)

Le système d'email peut être configuré via l'interface d'administration :
- Accédez à `/admin` après connexion
- Configurez les paramètres SMTP dans la section "Paramètres du site"
- Testez la configuration avant activation

## 🌐 Déploiement

### Vercel (recommandé)

1. **Connectez votre repository GitHub à Vercel**
2. **Configurez les variables d'environnement** dans le dashboard Vercel
3. **Déployez** - Le déploiement se fait automatiquement

### Autres plateformes

Le projet est compatible avec toute plateforme supportant Node.js et les variables d'environnement.

## 🔐 Sécurité

- ✅ Toutes les données sensibles sont protégées
- ✅ Les clés API utilisent des variables d'environnement
- ✅ Le système de hachage des mots de passe est sécurisé
- ✅ Les fichiers sensibles sont ignorés par Git

## 📞 Support

Pour toute question technique, consultez :
- `README.md` - Documentation principale
- `SECURITY_GUIDE.md` - Guide de sécurité
- `SUPABASE_SETUP.md` - Configuration Supabase
