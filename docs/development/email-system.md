# Système d'Email pour Marie Fortea

Ce document explique comment configurer et utiliser le système d'email automatique pour les réservations.

## 🎯 Fonctionnalités

- **Notifications automatiques** : Envoi d'emails lors de nouvelles réservations
- **Configuration flexible** : Email de réception configurable depuis le back-office
- **Configuration SMTP intégrée** : Paramètres SMTP configurables directement depuis le back-office
- **Activation/désactivation** : Possibilité d'activer ou désactiver les notifications
- **Templates personnalisables** : Emails formatés avec toutes les informations de réservation
- **Test de connexion** : Vérification de la configuration SMTP avant utilisation

## 🚀 Installation et Configuration

### 1. Prérequis

- Supabase CLI installé
- Projet Supabase configuré
- Accès au dashboard Supabase

### 2. Configuration automatique

Exécutez le script de configuration :

```bash
./scripts/setup-email-system.sh
```

Ce script :
- Applique les migrations de base de données
- Déploie la fonction Edge pour l'envoi d'emails
- Configure les paramètres par défaut

### 3. Configuration via le Back-Office (Recommandé)

**Plus besoin de configurer les variables SMTP dans Supabase !** 

Tout se fait maintenant depuis le back-office :

1. **Connectez-vous au back-office** (`/admin`)
2. **Allez dans l'onglet "Paramètres"**
3. **Sélectionnez l'onglet "Configuration SMTP"**
4. **Configurez vos paramètres SMTP** :
   - Serveur SMTP (ex: smtp.gmail.com)
   - Port (ex: 587)
   - Nom d'utilisateur (votre email)
   - Mot de passe (ou mot de passe d'application)
   - Email d'expédition
   - Type d'encryption (TLS recommandé)

### 4. Configurations prédéfinies

Le back-office propose des configurations prédéfinies pour les fournisseurs populaires :

- **Gmail** : `smtp.gmail.com:587` (TLS)
- **Outlook/Hotmail** : `smtp-mail.outlook.com:587` (TLS)
- **Yahoo** : `smtp.mail.yahoo.com:587` (TLS)
- **OVH** : `ssl0.ovh.net:587` (TLS)

Cliquez sur une configuration pour l'appliquer automatiquement !

## 📧 Utilisation

### 1. Configuration dans le back-office

1. Connectez-vous au back-office (`/admin`)
2. Allez dans l'onglet **Paramètres**
3. **Onglet "Général"** : Paramètres du site
4. **Onglet "Notifications"** : Configuration des emails de réservation
5. **Onglet "Configuration SMTP"** : Paramètres du serveur SMTP

### 2. Test de la configuration

1. Dans l'onglet **Configuration SMTP**
2. Remplissez vos paramètres SMTP
3. Cliquez sur **"Tester la connexion"**
4. Vérifiez que le test passe avec succès

### 3. Test du système complet

1. Allez sur `/test-email` pour tester le système
2. Utilisez le formulaire de test pour créer une réservation
3. Vérifiez que l'email est reçu à l'adresse configurée

### 4. Contenu des emails

Chaque email de notification contient :

- **Informations du parent** : Nom, téléphone, email, adresse
- **Détails de la réservation** : Service, date, heures, durée
- **Informations sur les enfants** : Nombre, âges, détails
- **Instructions spéciales** : Si fournies
- **Contact d'urgence** : Si fourni
- **Métadonnées** : Statut, date de soumission, source

## 🔧 Dépannage

### Problèmes courants

#### 1. Emails non reçus

- Vérifiez que les paramètres SMTP sont correctement configurés dans le back-office
- Vérifiez que les notifications sont activées dans l'onglet "Notifications"
- Testez la connexion SMTP depuis l'onglet "Configuration SMTP"
- Consultez les logs de la fonction Edge dans le dashboard Supabase

#### 2. Erreurs SMTP

- Vérifiez les identifiants SMTP dans le back-office
- Vérifiez que le port SMTP est correct
- Vérifiez que l'authentification à 2 facteurs est activée (Gmail)
- Utilisez le bouton "Tester la connexion" pour diagnostiquer

#### 3. Fonction Edge non déployée

```bash
# Redéployer la fonction
supabase functions deploy send-email

# Vérifier le statut
supabase functions list
```

### Logs et monitoring

1. **Logs de la fonction Edge** :
   - Dashboard Supabase > Functions > send-email > Logs

2. **Logs de l'application** :
   - Console du navigateur
   - Logs du serveur de développement

## 📝 Personnalisation

### Modifier le template d'email

Le template est défini dans `src/lib/email-service.ts`. Vous pouvez :

- Modifier le style CSS
- Ajouter/supprimer des sections
- Personnaliser le format des informations
- Ajouter des liens ou boutons d'action

### Ajouter de nouveaux paramètres

1. Ajoutez le paramètre dans la migration SQL
2. Mettez à jour `SiteSettingsService`
3. Ajoutez l'interface dans le composant approprié

## 🔒 Sécurité

- Les emails sont envoyés via HTTPS
- L'authentification SMTP est requise
- Les paramètres sensibles sont stockés dans la base de données avec chiffrement
- La fonction Edge valide toutes les données d'entrée
- Support des connexions TLS/SSL sécurisées

## 🆕 Nouveautés de cette version

### Configuration SMTP intégrée
- **Plus besoin de variables d'environnement** dans Supabase
- **Interface graphique** pour configurer tous les paramètres SMTP
- **Configurations prédéfinies** pour les fournisseurs populaires
- **Test de connexion** intégré pour vérifier la configuration

### Gestion des paramètres améliorée
- **Onglets organisés** : Général, Notifications, Configuration SMTP
- **Validation en temps réel** des paramètres
- **Sauvegarde automatique** des modifications
- **Interface intuitive** avec descriptions et exemples

### Support des différents types d'encryption
- **TLS** (recommandé, port 587)
- **SSL** (port 465)
- **Aucune** (non recommandé, port 25)

## 📚 Ressources

- [Documentation Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Guide d'envoi d'emails](https://supabase.com/docs/guides/functions/examples/send-emails)
- [Configuration SMTP Gmail](https://support.google.com/accounts/answer/185833)
- [Documentation Deno SMTP](https://deno.land/x/smtp@v0.7.0/mod.ts)

## 🆘 Support

En cas de problème :

1. **Testez la connexion SMTP** depuis le back-office
2. Vérifiez que tous les paramètres SMTP sont remplis
3. Consultez les logs de la fonction Edge
4. Vérifiez la configuration de votre fournisseur email

---

**Note** : Ce système est conçu pour être robuste et ne pas interrompre le processus de réservation même si l'envoi d'email échoue. La configuration SMTP se fait maintenant entièrement depuis le back-office, sans intervention technique requise.
