# 🚀 Restauration de la Base de Données Marie Fortea

## 📋 Situation Actuelle

**Problème** : Toutes les tables ont été supprimées de votre base de données Supabase.

**Solution** : Restauration simple via l'interface web Supabase.

---

## 🔧 Étape 1 : Accéder à Supabase

1. **Allez** sur [supabase.com](https://supabase.com)
2. **Connectez-vous** avec vos identifiants
3. **Sélectionnez** votre projet : `marie_fortea-prod`

---

## 🗄️ Étape 2 : Ouvrir l'Éditeur SQL

1. **Dans le menu gauche**, cliquez sur **SQL Editor**
2. **Cliquez** sur **New Query**
3. **Donnez** un nom : "Restauration Tables"

---

## 📝 Étape 3 : Exécuter le Script

1. **Copiez** le contenu du fichier `restore-tables.sql`
2. **Collez-le** dans l'éditeur SQL
3. **Cliquez** sur **Run** (▶️)

---

## ✅ Étape 4 : Vérification

1. **Allez** dans **Table Editor**
2. **Vérifiez** que vous voyez :
   - `profiles` (table des utilisateurs)
   - `bookings` (table des réservations)
   - `site_settings` (paramètres du site)

---

## 🎯 Tables Créées

### **Table `profiles`**
- **id** : UUID (clé primaire, liée à auth.users)
- **email** : Email unique de l'utilisateur
- **full_name** : Nom complet
- **avatar_url** : URL de l'avatar
- **phone** : Numéro de téléphone
- **created_at** : Date de création
- **updated_at** : Date de mise à jour

### **Table `bookings`**
- **id** : UUID (clé primaire)
- **user_id** : ID de l'utilisateur (lié à profiles)
- **service_name** : Nom du service réservé
- **booking_date** : Date de la réservation
- **status** : Statut (pending, confirmed, cancelled, completed)
- **notes** : Notes additionnelles
- **created_at** : Date de création
- **updated_at** : Date de mise à jour

### **Table `site_settings`**
- **id** : BIGSERIAL (clé primaire auto-incrémentée)
- **key** : Clé unique du paramètre
- **value** : Valeur du paramètre
- **updated_at** : Date de mise à jour

#### **Paramètres par défaut créés :**
- `maintenance_mode` : `false` (mode maintenance désactivé)
- `site_title` : `Marie Fortea`
- `site_description` : `Site officiel de Marie Fortea`
- `contact_email` : `contact@marie-fortea.com`
- `contact_phone` : `+33 1 23 45 67 89`

---

## 🔒 Sécurité

- **RLS activé** sur toutes les tables
- **Politiques** : Utilisateurs voient/modifient uniquement leurs données
- **site_settings** : Lecture publique, modification authentifiée
- **Index** : Performance optimisée pour les requêtes

---

## 🚨 En Cas de Problème

### **Erreur "relation already exists"**
- **Normal** si les tables existent déjà
- **Le script** utilise `CREATE TABLE IF NOT EXISTS`

### **Erreur "extension uuid-ossp"**
- **Normal** si l'extension existe déjà
- **Le script** utilise `CREATE EXTENSION IF NOT EXISTS`

### **Erreur 404 sur site_settings**
- **Résolu** : La table `site_settings` est maintenant créée
- **Votre back-office** devrait fonctionner normalement

---

## 🎉 Succès !

Une fois le script exécuté, vos tables sont restaurées et votre application peut fonctionner normalement !

**Plus d'erreur 404** sur `site_settings` ! 🚀

---

## 📞 Support

Si vous rencontrez des problèmes :
1. **Vérifiez** les messages d'erreur
2. **Relancez** le script
3. **Contactez** l'équipe de développement
