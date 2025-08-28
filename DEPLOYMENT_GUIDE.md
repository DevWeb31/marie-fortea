# 🚀 Guide de Déploiement en Production - Système de Réservation

## ⚠️ **IMPORTANT : Sécurité**

**NE JAMAIS COMMITER** les informations suivantes sur GitHub :
- ❌ URLs Supabase de production
- ❌ Clés API Supabase
- ❌ Mots de passe
- ❌ Tokens d'accès

## 🔐 **Méthodes Sécurisées de Déploiement**

### **Option 1 : Variables d'Environnement (Recommandée)**

```bash
# 1. Définir les variables (NE PAS COMMITER)
export SUPABASE_PROD_URL="https://votre-projet.supabase.co"
export SUPABASE_PROD_ANON_KEY="votre-clé-anon"

# 2. Exécuter le script
./scripts/deploy-to-production.sh

# 3. Nettoyer les variables (IMPORTANT !)
unset SUPABASE_PROD_URL SUPABASE_PROD_ANON_KEY
```

### **Option 2 : Fichier .env.production (Ajouté à .gitignore)**

```bash
# 1. Créer le fichier .env.production (NE PAS COMMITER)
cat > .env.production << EOF
SUPABASE_PROD_URL=https://votre-projet.supabase.co
SUPABASE_PROD_ANON_KEY=votre-clé-anon
EOF

# 2. Charger les variables
source .env.production

# 3. Exécuter le script
./scripts/deploy-to-production.sh

# 4. Supprimer le fichier
rm .env.production
```

### **Option 3 : Ligne de Commande Directe**

```bash
# Exécuter en une seule commande (variables temporaires)
SUPABASE_PROD_URL="https://votre-projet.supabase.co" \
SUPABASE_PROD_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
./scripts/deploy-to-production.sh
```

## 📋 **Étapes de Déploiement**

### **1. Préparation**
- [ ] Récupérer l'URL de votre projet Supabase de production
- [ ] Récupérer la clé anonyme de production
- [ ] Vérifier que vous avez les droits d'administration
- [ ] Faire une sauvegarde de la base de production

### **2. Déploiement**
- [ ] Définir les variables d'environnement
- [ ] Exécuter le script de déploiement
- [ ] Vérifier que les tables sont créées
- [ ] Nettoyer les variables d'environnement

### **3. Vérification**
- [ ] Aller sur votre dashboard Supabase de production
- [ ] Vérifier la présence des nouvelles tables
- [ ] Tester les nouvelles fonctionnalités
- [ ] Vérifier que l'application fonctionne

## 🔍 **Tables Créées par le Déploiement**

- **`children_details`** - Informations détaillées des enfants
- **`confirmed_bookings`** - Réservations confirmées
- **`booking_sessions`** - Sessions de garde
- **`booking_documents`** - Gestion des documents
- **`booking_reminders`** - Système de rappels

## 🛡️ **Bonnes Pratiques de Sécurité**

### **✅ À FAIRE :**
- Utiliser des variables d'environnement temporaires
- Nettoyer les variables après utilisation
- Vérifier le `.gitignore` avant chaque commit
- Utiliser des clés d'accès avec des permissions minimales

### **❌ À NE JAMAIS FAIRE :**
- Commiter des fichiers `.env*` contenant des vraies valeurs
- Laisser des variables d'environnement dans le terminal
- Partager des clés API dans des messages ou discussions
- Stocker des informations sensibles dans le code source

## 🚨 **En Cas de Problème**

### **Erreur : "Variables d'environnement manquantes"**
```bash
# Vérifier que les variables sont définies
echo $SUPABASE_PROD_URL
echo $SUPABASE_PROD_ANON_KEY
```

### **Erreur : "Permission denied"**
```bash
# Vérifier les droits sur le script
chmod +x scripts/deploy-to-production.sh
```

### **Erreur : "Project not found"**
- Vérifier l'URL du projet
- Vérifier que vous avez accès au projet
- Vérifier que la clé API est correcte

## 📚 **Ressources**

- [Documentation Supabase](https://supabase.com/docs)
- [Guide des migrations](https://supabase.com/docs/guides/database/migrations)
- [Gestion des environnements](https://supabase.com/docs/guides/getting-started/environment-variables)

## 🔄 **Rollback en Cas de Problème**

Si quelque chose ne va pas après le déploiement :

```bash
# 1. Se connecter à votre dashboard Supabase de production
# 2. Aller dans SQL Editor
# 3. Exécuter les commandes de suppression des tables

DROP TABLE IF EXISTS booking_reminders CASCADE;
DROP TABLE IF EXISTS booking_documents CASCADE;
DROP TABLE IF EXISTS booking_sessions CASCADE;
DROP TABLE IF EXISTS confirmed_bookings CASCADE;
DROP TABLE IF EXISTS children_details CASCADE;
```

**⚠️ ATTENTION : Cette opération supprimera définitivement les données !**
