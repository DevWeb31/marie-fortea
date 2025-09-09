# Implémentation RGPD - Marie Fortea

## Vue d'ensemble

Ce document décrit l'implémentation de la conformité RGPD (Règlement Général sur la Protection des Données) pour l'application Marie Fortea.

## Composants implémentés

### 1. Politique de confidentialité
- **Fichier** : `src/pages/PrivacyPolicy.tsx`
- **Route** : `/privacy-policy`
- **Description** : Page complète expliquant la collecte, l'utilisation et la protection des données personnelles

### 2. Gestion du consentement
- **Fichier** : `src/components/GDPRConsent.tsx`
- **Description** : Composant modal pour gérer les préférences de cookies et consentements
- **Fonctionnalités** :
  - Consentement granulaire (nécessaire, fonctionnel, analytique, marketing)
  - Sauvegarde des préférences
  - Interface utilisateur intuitive

### 3. Bannière de cookies
- **Fichier** : `src/components/CookieBanner.tsx`
- **Description** : Bannière d'information sur les cookies
- **Fonctionnalités** :
  - Affichage automatique pour les nouveaux visiteurs
  - Options d'acceptation/rejet
  - Liens vers les politiques

### 4. Gestion des données personnelles
- **Fichier** : `src/components/DataManagement.tsx`
- **Route** : `/data-management`
- **Description** : Interface pour exercer les droits RGPD
- **Fonctionnalités** :
  - Export des données personnelles
  - Demande de suppression
  - Historique des actions

### 5. Checkbox de consentement
- **Fichier** : `src/components/ConsentCheckbox.tsx`
- **Description** : Composant réutilisable pour les formulaires
- **Utilisation** : Intégré dans le formulaire de réservation

### 6. Service GDPR
- **Fichier** : `src/lib/gdpr-service.ts`
- **Description** : Service centralisé pour les opérations RGPD
- **Fonctionnalités** :
  - Gestion des consentements
  - Export des données
  - Demandes de suppression
  - Audit des accès

## Base de données

### Tables créées

#### 1. `gdpr_consents`
Stockage des consentements par utilisateur et type :
```sql
- id (UUID)
- user_email (VARCHAR)
- consent_type (VARCHAR) -- 'necessary', 'functional', 'analytics', 'marketing'
- consent_given (BOOLEAN)
- consent_date (TIMESTAMP)
- consent_version (VARCHAR)
- ip_address (INET)
- user_agent (TEXT)
```

#### 2. `data_deletion_requests`
Demandes de suppression de données :
```sql
- id (UUID)
- user_email (VARCHAR)
- user_phone (VARCHAR)
- deletion_reason (TEXT)
- status (VARCHAR) -- 'pending', 'processing', 'completed', 'rejected'
- requested_at (TIMESTAMP)
- processed_at (TIMESTAMP)
- processed_by (UUID)
```

#### 3. `data_exports`
Historique des exports de données :
```sql
- id (UUID)
- user_email (VARCHAR)
- export_type (VARCHAR) -- 'full', 'partial'
- status (VARCHAR) -- 'pending', 'processing', 'completed', 'failed'
- requested_at (TIMESTAMP)
- completed_at (TIMESTAMP)
- file_path (TEXT)
- file_size (BIGINT)
- expires_at (TIMESTAMP)
```

#### 4. `data_access_audit`
Audit des accès aux données :
```sql
- id (UUID)
- user_email (VARCHAR)
- action (VARCHAR) -- 'view', 'export', 'delete', 'modify'
- table_name (VARCHAR)
- record_id (UUID)
- accessed_by (UUID)
- ip_address (INET)
- user_agent (TEXT)
- accessed_at (TIMESTAMP)
- metadata (JSONB)
```

### Champs ajoutés aux tables existantes

#### `booking_requests`
- `consent_given` (BOOLEAN)
- `consent_date` (TIMESTAMP)
- `consent_version` (VARCHAR)
- `data_retention_until` (TIMESTAMP)
- `deletion_requested` (BOOLEAN)
- `deletion_requested_at` (TIMESTAMP)
- `deletion_reason` (TEXT)
- `data_exported` (BOOLEAN)
- `data_exported_at` (TIMESTAMP)

#### `children_details`
- `consent_given` (BOOLEAN)
- `consent_date` (TIMESTAMP)
- `data_retention_until` (TIMESTAMP)

## Fonctions de base de données

### 1. `calculate_data_retention_date()`
Calcule automatiquement la date de rétention des données (3 ans après la dernière prestation).

### 2. `cleanup_expired_data()`
Nettoie automatiquement les données expirées selon les politiques de rétention.

### 3. `create_data_export(user_email_param)`
Crée un export de données pour un utilisateur donné.

### 4. `process_deletion_request(request_id, admin_user_id)`
Traite une demande de suppression de données.

## Sécurité

### Row Level Security (RLS)
Toutes les nouvelles tables ont RLS activé avec des politiques appropriées :
- Les utilisateurs ne peuvent accéder qu'à leurs propres données
- Les administrateurs ont accès complet pour la gestion

### Audit
Tous les accès aux données personnelles sont enregistrés dans `data_access_audit`.

## Droits des utilisateurs

### 1. Droit d'accès
- Export complet des données via `/data-management`
- Format JSON structuré
- Téléchargement immédiat

### 2. Droit de rectification
- Modification des données via les formulaires existants
- Validation et mise à jour en base

### 3. Droit à l'effacement
- Demande de suppression via `/data-management`
- Traitement dans les 30 jours
- Confirmation par email

### 4. Droit à la portabilité
- Export des données en format structuré
- Compatible avec d'autres systèmes

### 5. Droit d'opposition
- Gestion granulaire des consentements
- Possibilité de retirer le consentement

### 6. Droit de limitation
- Possibilité de limiter le traitement
- Statuts de rétention configurables

## Politiques de rétention

### Données de réservation
- **Durée** : 3 ans après la dernière prestation
- **Justification** : Obligations légales et contractuelles

### Données de contact
- **Durée** : Jusqu'à demande de suppression
- **Justification** : Relation commerciale continue

### Données de facturation
- **Durée** : 10 ans
- **Justification** : Obligation légale française

### Données d'audit
- **Durée** : 7 ans
- **Justification** : Traçabilité et sécurité

## Conformité

### Base légale du traitement
1. **Exécution du contrat** : Données nécessaires au service
2. **Consentement** : Données sensibles (santé des enfants)
3. **Intérêt légitime** : Sécurité et communication
4. **Obligation légale** : Réglementation garde d'enfants

### Mesures de sécurité
- Chiffrement des données en transit et au repos
- Authentification sécurisée
- Contrôle d'accès basé sur les rôles
- Sauvegardes régulières
- Audit des accès

## Utilisation

### Pour les utilisateurs
1. **Première visite** : Bannière de cookies s'affiche
2. **Formulaires** : Checkbox de consentement obligatoire
3. **Gestion** : Accès via footer ou `/data-management`

### Pour les administrateurs
1. **Audit** : Consultation des logs d'accès
2. **Suppression** : Traitement des demandes
3. **Nettoyage** : Exécution des tâches de maintenance

## Maintenance

### Tâches automatiques
- Nettoyage des données expirées
- Suppression des exports expirés
- Calcul des dates de rétention

### Tâches manuelles
- Traitement des demandes de suppression
- Mise à jour des politiques
- Audit régulier des accès

## Contact et réclamations

### Responsable du traitement
- **Nom** : Marie Fortea
- **Email** : [À configurer]
- **Adresse** : [À configurer]

### Autorité de contrôle
- **CNIL** : 3 Place de Fontenoy, TSA 80715, 75334 PARIS CEDEX 07
- **Site web** : www.cnil.fr

## Évolutions futures

### Améliorations prévues
1. **Notifications email** : Confirmation des actions RGPD
2. **Dashboard admin** : Interface de gestion des demandes
3. **API webhook** : Intégration avec des services tiers
4. **Analytics** : Métriques de conformité

### Surveillance
- Révision annuelle des politiques
- Mise à jour selon l'évolution réglementaire
- Tests de conformité réguliers
