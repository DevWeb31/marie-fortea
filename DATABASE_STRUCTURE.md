# Structure de la Base de Données - Système de Réservation

## Vue d'ensemble

Ce système de réservation fonctionne en **deux étapes** pour optimiser l'expérience utilisateur et la collecte d'informations :

1. **Première étape** : Formulaire initial simplifié (déjà implémenté)
2. **Deuxième étape** : Formulaire détaillé après confirmation de la demande

## Tables Principales

### 1. `booking_requests` - Demandes Initiales
Table existante qui capture les informations essentielles lors du premier contact.

**Champs clés :**
- Informations de base des parents (nom, téléphone, email)
- Type de service et dates souhaitées
- Nombre d'enfants et âges approximatifs
- Statut : `pending` → `contacted` → `confirmed`/`cancelled`

### 2. `children_details` - Informations Détaillées des Enfants
Nouvelle table pour stocker les informations complètes de chaque enfant.

**Champs inclus :**
- **Informations de base** : prénom, nom, date de naissance, âge calculé automatiquement
- **Informations médicales** : allergies, conditions médicales, médicaments
- **Préférences** : restrictions alimentaires, besoins spéciaux, activités préférées
- **Sécurité** : contacts d'urgence spécifiques, instructions d'urgence

### 3. `confirmed_bookings` - Réservations Confirmées
Table pour les réservations validées avec tous les détails finaux.

**Champs inclus :**
- **Localisation** : adresse exacte, code postal, ville
- **Horaires confirmés** : dates et heures finales
- **Tarification** : taux horaire final, montant total, acompte
- **Instructions** : procédures d'arrivée/départ, contacts sur place

### 4. `booking_sessions` - Sessions de Garde
Pour les réservations multi-jours, chaque session est tracée individuellement.

**Champs inclus :**
- Date et horaires de chaque session
- Statut : programmée → en cours → terminée
- Notes et activités réalisées
- Horaires réels (pour ajuster la facturation)

### 5. `booking_documents` - Gestion des Documents
Stockage des contrats, formulaires médicaux, etc.

**Types de documents :**
- Contrat de réservation
- Conditions générales
- Formulaire médical
- Autorisation photos
- Autres documents

### 6. `booking_reminders` - Système de Rappels
Notifications automatiques pour les clients et l'administration.

**Types de rappels :**
- Confirmation de réservation
- Rappel 24h avant
- Rappel 1h avant
- Suivi post-réservation

## Flux de Travail Recommandé

### Phase 1 : Demande Initiale
1. Client remplit le formulaire simplifié
2. Système crée une entrée dans `booking_requests`
3. Statut initial : `pending`
4. Notification envoyée à l'administrateur

### Phase 2 : Contact et Validation
1. Administrateur contacte le client
2. Vérification de la disponibilité
3. Discussion des détails et tarifs
4. Statut mis à jour : `contacted`

### Phase 3 : Confirmation et Détails
1. Si la demande est validée :
   - Statut mis à jour : `confirmed`
   - Création d'une entrée dans `confirmed_bookings`
   - Envoi du formulaire détaillé au client

2. Client remplit le formulaire détaillé :
   - Informations complètes sur chaque enfant
   - Adresse exacte de l'événement
   - Instructions spéciales
   - Contacts d'urgence

### Phase 4 : Exécution
1. Création des sessions de garde dans `booking_sessions`
2. Suivi en temps réel du statut
3. Gestion des documents et contrats
4. Rappels automatiques

## Avantages de cette Structure

### Pour le Client
- **Premier contact simplifié** : moins de friction pour initier la demande
- **Collecte progressive** : informations demandées au bon moment
- **Transparence** : suivi du statut de la demande

### Pour l'Administrateur
- **Gestion efficace** : vue d'ensemble de toutes les demandes
- **Flexibilité** : possibilité d'ajuster les détails avant confirmation
- **Traçabilité** : historique complet des interactions

### Pour le Système
- **Évolutivité** : facile d'ajouter de nouveaux champs
- **Performance** : requêtes optimisées avec les index
- **Sécurité** : politiques RLS pour la protection des données

## Exemples d'Utilisation

### Requête pour les Demandes en Attente
```sql
SELECT 
    br.id,
    br.parent_name,
    br.parent_phone,
    br.service_type,
    br.requested_date,
    br.children_count
FROM booking_requests br
WHERE br.status = 'pending'
ORDER BY br.created_at DESC;
```

### Requête pour les Réservations Confirmées du Mois
```sql
SELECT 
    cb.event_location,
    cb.confirmed_start_datetime,
    cb.final_total_amount,
    string_agg(cd.first_name, ', ') as children_names
FROM confirmed_bookings cb
JOIN children_details cd ON cb.booking_request_id = cd.booking_request_id
WHERE cb.confirmed_start_datetime >= date_trunc('month', current_date)
GROUP BY cb.id, cb.event_location, cb.confirmed_start_datetime, cb.final_total_amount;
```

### Requête pour les Sessions de la Semaine
```sql
SELECT 
    bs.session_date,
    bs.start_time,
    bs.end_time,
    cb.event_location,
    br.parent_name
FROM booking_sessions bs
JOIN confirmed_bookings cb ON bs.confirmed_booking_id = cb.id
JOIN booking_requests br ON cb.booking_request_id = br.id
WHERE bs.session_date BETWEEN current_date AND current_date + interval '7 days'
ORDER BY bs.session_date, bs.start_time;
```

## Maintenance et Évolutions

### Index Recommandés
Tous les index nécessaires sont créés automatiquement dans la migration.

### Sauvegarde
- Sauvegarde quotidienne recommandée
- Points de restauration avant chaque migration

### Monitoring
- Surveiller la taille des tables
- Vérifier les performances des requêtes
- Contrôler l'intégrité des contraintes

## Sécurité

### Politiques RLS
- Insertion publique autorisée pour les nouvelles demandes
- Lecture publique pour les données non sensibles
- Modification restreinte aux administrateurs

### Validation des Données
- Contraintes au niveau base de données
- Validation côté application
- Vérification des types et formats

Cette structure offre une base solide pour un système de réservation professionnel et évolutif, tout en respectant les bonnes pratiques de conception de base de données.
