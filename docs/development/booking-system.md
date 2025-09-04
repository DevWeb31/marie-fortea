# Système de Réservation - Marie Fortea

## Vue d'ensemble

Ce document décrit le nouveau système de réservation mis en place pour le site de Marie Fortea. Le système a été complètement refactorisé pour offrir une expérience utilisateur simplifiée et une gestion administrative complète.

## 🎯 Objectifs du nouveau système

1. **Formulaire simplifié** : Premier contact simple avec les parents
2. **Protection anti-spam** : Captcha intégré pour éviter les abus
3. **Gestion structurée** : Base de données bien organisée pour les demandes
4. **Interface administrative** : Back-office complet pour gérer les demandes
5. **Suivi des statuts** : Workflow clair de traitement des demandes

## 🏗️ Architecture technique

### Base de données

Le système utilise Supabase avec les tables suivantes :

- **`booking_requests`** : Demandes principales de réservation
- **`service_types`** : Types de services disponibles
- **`booking_status_history`** : Historique des changements de statut
- **`admin_notes`** : Notes administratives sur les demandes

### Composants React

- **`BookingForm`** : Formulaire de réservation simplifié
- **`Captcha`** : Vérification anti-spam
- **`BookingRequestsList`** : Liste des demandes côté admin
- **`AdminDashboard`** : Tableau de bord d'administration

### Services

- **`BookingService`** : Logique métier pour la gestion des réservations
- **`supabase.ts`** : Configuration et connexion à la base de données

## 📋 Workflow des demandes

### 1. Soumission de la demande
```
Parent remplit le formulaire → Captcha validé → Demande enregistrée → Statut "pending"
```

### 2. Traitement administratif
```
Admin consulte la demande → Contacte le parent → Met à jour le statut → Ajoute des notes
```

### 3. Statuts possibles
- **`pending`** : En attente de contact
- **`contacted`** : Contacté par l'admin
- **`confirmed`** : Réservation confirmée
- **`cancelled`** : Annulée
- **`completed`** : Terminée

## 🚀 Installation et configuration

### 1. Migration de base de données

Exécutez la migration pour créer les tables :

```bash
# Dans le dossier supabase/migrations/
# Le fichier 20250117000001_create_booking_requests.sql sera exécuté
```

### 2. Variables d'environnement

Assurez-vous que vos variables Supabase sont configurées dans `.env` :

```env
VITE_SUPABASE_URL_DEV=your_dev_url
VITE_SUPABASE_ANON_KEY_DEV=your_dev_key
VITE_SUPABASE_URL_PROD=your_prod_url
VITE_SUPABASE_ANON_KEY_PROD=your_prod_key
```

### 3. Démarrage

```bash
npm install
npm run dev
```

## 📱 Utilisation

### Côté utilisateur (site public)

1. **Accès au formulaire** : Page `/booking`
2. **Remplissage** : Informations des parents, service, date, enfants
3. **Validation** : Captcha mathématique simple
4. **Soumission** : Demande envoyée et confirmée

### Côté administration

1. **Connexion** : `/admin` avec identifiants
2. **Tableau de bord** : Vue d'ensemble des statistiques
3. **Gestion des demandes** : Onglet dédié avec liste complète
4. **Actions disponibles** :
   - Voir les détails d'une demande
   - Mettre à jour le statut
   - Ajouter des notes administratives
   - Filtrer et rechercher

## 🔧 Fonctionnalités principales

### Formulaire de réservation

- **Champs essentiels** : Nom, téléphone, adresse, service, date, enfants
- **Validation** : Vérifications côté client et serveur
- **Estimation de prix** : Calcul automatique basé sur le service et la durée
- **Captcha** : Protection anti-spam avec questions mathématiques

### Interface administrative

- **Statistiques en temps réel** : Compteurs par statut
- **Filtres avancés** : Recherche, statut, date
- **Gestion des statuts** : Workflow de traitement
- **Notes administratives** : Suivi des actions et commentaires
- **Historique** : Traçabilité complète des modifications

### Sécurité

- **Captcha** : Protection contre les bots
- **Validation** : Vérification des données côté serveur
- **RLS** : Row Level Security Supabase
- **Sanitisation** : Nettoyage des entrées utilisateur

## 📊 Structure des données

### Demande de réservation

```typescript
interface BookingRequest {
  id: string;
  status: BookingStatus;
  parentName: string;
  parentPhone: string;
  parentAddress: string;
  serviceType: string;
  requestedDate: string;
  startTime: string;
  endTime: string;
  childrenCount: number;
  childrenDetails: string;
  // ... autres champs
}
```

### Types de services

```typescript
interface ServiceType {
  code: string;        // 'mariage', 'urgence', 'soiree', etc.
  name: string;        // Nom affiché
  basePrice: number;   // Prix de base par heure
  minDurationHours: number; // Durée minimale
}
```

## 🎨 Personnalisation

### Styles

Le système utilise Tailwind CSS avec un thème sombre/clair. Les composants sont basés sur shadcn/ui pour une cohérence visuelle.

### Messages

Tous les textes sont en français et peuvent être facilement modifiés dans les composants.

### Validation

Les règles de validation sont configurables dans `BookingService.validateBookingData()`.

## 🔍 Dépannage

### Problèmes courants

1. **Erreur de connexion Supabase** : Vérifiez les variables d'environnement
2. **Migration échouée** : Vérifiez les permissions de base de données
3. **Formulaire ne s'envoie pas** : Vérifiez la validation du captcha

### Logs

Les erreurs sont loggées dans la console du navigateur et peuvent être surveillées côté serveur Supabase.

## 🚧 Évolutions futures

### Fonctionnalités prévues

- **Notifications** : Emails automatiques aux parents
- **Calendrier** : Vue des disponibilités
- **Paiements** : Intégration de solutions de paiement
- **Mobile** : Application mobile dédiée

### Améliorations techniques

- **Cache** : Mise en cache des données fréquemment consultées
- **API** : Endpoints REST pour intégrations externes
- **Tests** : Couverture de tests automatisés

## 📞 Support

Pour toute question ou problème technique, consultez :

1. **Documentation Supabase** : [supabase.com/docs](https://supabase.com/docs)
2. **Logs d'erreur** : Console navigateur et logs Supabase
3. **Code source** : Composants React et services TypeScript

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2025  
**Auteur** : Équipe de développement
