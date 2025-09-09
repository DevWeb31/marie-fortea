# RGPD Simplifié - Marie Fortea

## Politique de conservation : 2 mois maximum

### Principe simple
- **Conservation** : 2 mois après la fin de la garde
- **Suppression** : Automatique ou sur demande
- **Complexité** : Minimale

## Composants implémentés

### 1. Politique de confidentialité simplifiée
- **Route** : `/privacy-policy`
- **Contenu** : Explication claire de la conservation 2 mois
- **Droits** : Accès, rectification, suppression

### 2. Gestion des données
- **Route** : `/data-management`
- **Fonctionnalités** :
  - Export immédiat des données
  - Suppression immédiate sur demande
  - Information sur la conservation automatique

### 3. Consentement minimaliste
- **Cookies nécessaires** : Toujours actifs
- **Cookies fonctionnels** : Optionnels (préférences)
- **Pas de cookies analytiques ou marketing**

### 4. Bannière de cookies
- **Message simple** : "Conservées 2 mois maximum"
- **Options** : Accepter/Rejeter
- **Lien** : Vers la politique de confidentialité

## Base de données

### Tables simplifiées
- `gdpr_consents` : Consentements (conservation 1 an)
- `data_deletion_requests` : Demandes de suppression
- `data_exports` : Exports (conservation 30 jours)
- `data_access_audit` : Audit (conservation 1 an)

### Champs ajoutés
- `data_retention_until` : Date limite (2 mois)
- `deletion_requested` : Demande de suppression
- `consent_given` : Consentement donné

## Fonctions automatiques

### 1. Calcul de rétention
```sql
-- 2 mois après la dernière prestation
data_retention_until = updated_at + INTERVAL '2 months'
```

### 2. Nettoyage automatique
- Suppression des données expirées
- Nettoyage des exports anciens
- Audit des accès

### 3. Vue de surveillance
```sql
-- Vue des données en cours de conservation
SELECT * FROM data_to_cleanup;
```

## Droits des utilisateurs

### 1. Droit d'accès
- **Export immédiat** des données
- **Format JSON** structuré
- **Téléchargement** direct

### 2. Droit de rectification
- **Modification** via formulaires
- **Validation** en temps réel

### 3. Droit à l'effacement
- **Suppression immédiate** sur demande
- **Suppression automatique** après 2 mois
- **Confirmation** de l'action

## Sécurité

### Mesures techniques
- **Chiffrement** des données
- **Authentification** sécurisée
- **Audit** des accès

### Mesures organisationnelles
- **Accès limité** aux données
- **Formation** du personnel
- **Procédures** de gestion

## Utilisation

### Pour les utilisateurs
1. **Première visite** : Bannière de cookies
2. **Formulaires** : Consentement obligatoire
3. **Gestion** : Accès via footer

### Pour l'administrateur
1. **Surveillance** : Vue `data_to_cleanup`
2. **Nettoyage** : Fonction automatique
3. **Audit** : Consultation des logs

## Maintenance

### Tâches automatiques
- Nettoyage des données expirées
- Suppression des exports anciens
- Calcul des dates de rétention

### Tâches manuelles
- Traitement des demandes de suppression
- Surveillance de la conservation
- Mise à jour des politiques

## Avantages de cette approche

### Simplicité
- **Politique claire** : 2 mois maximum
- **Interface simple** : Moins de complexité
- **Maintenance facile** : Automatique

### Conformité
- **RGPD respecté** : Tous les droits couverts
- **Transparence** : Politique claire
- **Sécurité** : Données protégées

### Efficacité
- **Conservation minimale** : Seulement 2 mois
- **Suppression automatique** : Pas de gestion manuelle
- **Audit simple** : Traçabilité claire

## Contact

### Responsable du traitement
- **Nom** : Marie Fortea
- **Email** : [À configurer]
- **Adresse** : [À configurer]

### Autorité de contrôle
- **CNIL** : www.cnil.fr
- **Adresse** : 3 Place de Fontenoy, TSA 80715, 75334 PARIS CEDEX 07

## Évolutions

### Améliorations possibles
1. **Notifications email** : Confirmation des actions
2. **Dashboard admin** : Interface de surveillance
3. **Rapports** : Statistiques de conservation

### Surveillance
- **Révision** : Politique claire et simple
- **Mise à jour** : Selon l'évolution réglementaire
- **Tests** : Vérification de la conformité
