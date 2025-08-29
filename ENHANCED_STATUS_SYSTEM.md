# Système de Statuts Amélioré - Guide Complet

## Vue d'ensemble

Ce document décrit le nouveau système de statuts pour les réservations, qui remplace l'ancien système simple par un système granulaire avec transitions autorisées et validation automatique.

## 🎯 Objectifs

- **Gestion granulaire** : 8 statuts distincts au lieu de 5
- **Transitions contrôlées** : Seules les transitions logiques sont autorisées
- **Traçabilité complète** : Historique détaillé de tous les changements
- **Validation automatique** : Vérification des prérequis avant chaque transition
- **Interface visuelle** : Couleurs et icônes pour chaque statut

## 📊 Statuts Disponibles

### 1. **Nouvelle réservation** (`nouvelle`)
- **Couleur** : 🟡 Jaune (#F59E0B)
- **Icône** : `clock`
- **Description** : Demande initiale reçue, en attente de traitement
- **Actions possibles** : Accepter, Annuler

### 2. **Réservation acceptée** (`acceptee`)
- **Couleur** : 🔵 Bleu (#3B82F6)
- **Icône** : `check-circle`
- **Description** : Demande validée par l'administrateur, en attente de confirmation client
- **Actions possibles** : Confirmer, Annuler, Remettre en attente

### 3. **Réservation confirmée** (`confirmee`)
- **Couleur** : 🟢 Vert (#10B981)
- **Icône** : `calendar-check`
- **Description** : Réservation confirmée par le client, prête pour exécution
- **Actions possibles** : Démarrer, Annuler, Remettre en attente

### 4. **En cours** (`en_cours`)
- **Couleur** : 🟣 Violet (#8B5CF6)
- **Icône** : `play-circle`
- **Description** : Réservation en cours d'exécution
- **Actions possibles** : Terminer, Annuler

### 5. **Terminée** (`terminee`)
- **Couleur** : ⚫ Gris (#6B7280)
- **Icône** : `check-square`
- **Description** : Réservation terminée avec succès
- **Actions possibles** : Archiver, Remettre en cours

### 6. **Annulée** (`annulee`)
- **Couleur** : 🔴 Rouge (#EF4444)
- **Icône** : `x-circle`
- **Description** : Réservation annulée par le client ou l'administrateur
- **Actions possibles** : Remettre en attente, Archiver

### 7. **Archivée** (`archivée`)
- **Couleur** : ⚪ Gris clair (#9CA3AF)
- **Icône** : `archive`
- **Description** : Réservation archivée pour conservation
- **Actions possibles** : Restaurer, Supprimer définitivement

### 8. **Supprimée** (`supprimee`)
- **Couleur** : ⚫ Noir (#374151)
- **Icône** : `trash-2`
- **Description** : Réservation supprimée (soft delete)
- **Actions possibles** : Restaurer depuis la corbeille

## 🔄 Transitions Autorisées

### Depuis "Nouvelle réservation"
- → **Réservation acceptée** (✅ Admin requis, 📝 Notes requises)
- → **Annulée** (✅ Admin requis, 📝 Notes requises)

### Depuis "Réservation acceptée"
- → **Réservation confirmée** (❌ Admin non requis, ❌ Notes non requises)
- → **Annulée** (✅ Admin requis, 📝 Notes requises)
- → **Nouvelle réservation** (✅ Admin requis, 📝 Notes requises)

### Depuis "Réservation confirmée"
- → **En cours** (❌ Admin non requis, ❌ Notes non requises)
- → **Annulée** (✅ Admin requis, 📝 Notes requises)
- → **Réservation acceptée** (✅ Admin requis, 📝 Notes requises)

### Depuis "En cours"
- → **Terminée** (❌ Admin non requis, ❌ Notes non requises)
- → **Annulée** (✅ Admin requis, 📝 Notes requises)

### Depuis "Terminée"
- → **Archivée** (❌ Admin non requis, ❌ Notes non requises)
- → **En cours** (✅ Admin requis, 📝 Notes requises)

### Depuis "Annulée"
- → **Nouvelle réservation** (✅ Admin requis, 📝 Notes requises)
- → **Archivée** (❌ Admin non requis, ❌ Notes non requises)

### Depuis "Archivée"
- → **Terminée** (✅ Admin requis, 📝 Notes requises)
- → **Supprimée** (✅ Admin requis, 📝 Notes requises)

### Depuis "Supprimée"
- → **Archivée** (✅ Admin requis, 📝 Notes requises)

## 🛠️ Fonctions Disponibles

### `change_booking_status()`
Change le statut d'une réservation avec validation automatique.

```sql
SELECT change_booking_status(
    'uuid-de-la-reservation',
    'nouveau-statut',
    'Notes optionnelles',
    'admin@example.com',
    'Raison du changement'
);
```

### `get_available_transitions()`
Retourne toutes les transitions possibles pour une réservation donnée.

```sql
SELECT * FROM get_available_transitions('uuid-de-la-reservation');
```

## 📊 Vues Utiles

### `booking_status_overview`
Vue d'ensemble avec le nombre de réservations par statut.

```sql
SELECT * FROM booking_status_overview;
```

### `booking_requests_with_status`
Réservations avec toutes les informations de statut.

```sql
SELECT * FROM booking_requests_with_status;
```

## 🔒 Sécurité et Validation

### Contrôles Automatiques
- **Transitions autorisées** : Seules les transitions définies sont possibles
- **Prérequis** : Vérification des notes et approbations requises
- **Historique** : Tous les changements sont tracés avec métadonnées

### Politiques RLS
- **Lecture publique** : Les statuts et transitions sont visibles par tous
- **Modification restreinte** : Seuls les administrateurs peuvent changer les statuts
- **Audit trail** : Tous les changements sont enregistrés

## 📱 Interface d'Administration

### Composants Recommandés
1. **Vue d'ensemble** : Tableau de bord avec compteurs par statut
2. **Kanban board** : Visualisation du flux des réservations
3. **Gestionnaire de statuts** : Interface pour changer les statuts
4. **Historique des changements** : Timeline des modifications
5. **Filtres avancés** : Recherche par statut, date, client

### Actions Contextuelles
- **Boutons d'action** : Affichés selon le statut actuel
- **Validation** : Confirmation avant les actions importantes
- **Notes obligatoires** : Saisie forcée quand nécessaire
- **Notifications** : Alertes pour les changements de statut

## 🚀 Déploiement

### 1. Appliquer la Migration
```bash
./scripts/apply-enhanced-status-system.sh
```

### 2. Vérifier l'Installation
```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%status%';

-- Vérifier les statuts
SELECT * FROM booking_statuses;

-- Vérifier les transitions
SELECT * FROM booking_status_transitions;
```

### 3. Tester le Système
```sql
-- Créer une réservation de test
INSERT INTO booking_requests (parent_name, parent_phone, parent_address, service_type, requested_date, start_time, end_time, children_count, children_details)
VALUES ('Test User', '0123456789', '123 Test St', 'mariage', '2025-02-01', '14:00', '18:00', 2, 'Test children');

-- Changer le statut
SELECT change_booking_status(
    (SELECT id FROM booking_requests WHERE parent_name = 'Test User'),
    'acceptee',
    'Test d''acceptation',
    'admin@test.com',
    'Test de transition'
);
```

## 🔧 Maintenance

### Nettoyage Automatique
- **Réservations supprimées** : Nettoyage après 12 mois par défaut
- **Archivage automatique** : Possibilité de règles d'archivage automatique
- **Optimisation des index** : Index automatiques sur les colonnes clés

### Monitoring
- **Performance** : Surveiller les temps de réponse des requêtes
- **Intégrité** : Vérifier la cohérence des données
- **Utilisation** : Analyser les patterns de changement de statut

## 📈 Évolutions Futures

### Fonctionnalités Possibles
- **Workflows personnalisés** : Définition de processus métier spécifiques
- **Notifications automatiques** : Emails/SMS lors des changements de statut
- **Intégrations** : Synchronisation avec calendriers externes
- **Analytics** : Statistiques détaillées sur le cycle de vie des réservations
- **API webhooks** : Notifications en temps réel vers des systèmes externes

---

**Note** : Ce système est conçu pour être évolutif et peut être étendu selon les besoins futurs de l'entreprise.
