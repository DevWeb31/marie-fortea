# Interface de Gestion des Statuts de Réservation

## Vue d'ensemble

Cette interface complète permet aux administrateurs de gérer efficacement le cycle de vie des réservations dans le back-office de Marie Fortea. Elle offre une gestion granulaire des statuts avec un workflow guidé, des validations automatiques et une traçabilité complète.

## 🚀 Fonctionnalités Principales

### 1. Tableau de Bord (Dashboard)
- **Métriques en temps réel** : Nombre total de réservations, en attente, confirmées
- **Répartition par statut** : Visualisation claire avec pourcentages et tendances
- **Actions rapides** : Acceptation en lot, export des données, navigation vers les archives
- **Activité récente** : Suivi des derniers changements de statut

### 2. Gestionnaire de Statuts
- **Workflow visuel** : Représentation graphique des 8 statuts disponibles
- **Transitions autorisées** : Affichage des règles métier et contraintes
- **Gestion des statuts** : Interface pour changer le statut d'une réservation
- **Historique des changements** : Traçabilité complète des modifications

### 3. Workflow de Transition
- **Processus guidé** : 5 étapes de validation et confirmation
- **Validation automatique** : Vérification des règles métier
- **Approbation administrative** : Contrôle des transitions sensibles
- **Actions automatiques** : Exécution de tâches lors des changements

### 4. Gestion des Archives
- **Système d'archivage** : Conservation des réservations terminées
- **Corbeille** : Suppression douce avec possibilité de restauration
- **Recherche et filtres** : Outils de navigation dans les archives

## 📊 Statuts Disponibles

| Statut | Code | Description | Couleur | Actions |
|--------|------|-------------|---------|---------|
| **Nouvelle** | `nouvelle` | Demande initiale reçue | 🟡 Jaune | Accepter, Annuler |
| **Acceptée** | `acceptee` | Validée par l'admin | 🔵 Bleu | Confirmer, Annuler, Retour |
| **Confirmée** | `confirmee` | Confirmée par le client | 🟢 Vert | Démarrer, Annuler, Retour |
| **En cours** | `en_cours` | En cours d'exécution | 🟣 Violet | Terminer, Annuler |
| **Terminée** | `terminee` | Réservation terminée | ⚫ Gris | Archiver, Reprendre |
| **Annulée** | `annulee` | Annulée | 🔴 Rouge | Restaurer, Archiver |
| **Archivée** | `archivée` | Conservée pour référence | ⚪ Blanc | Restaurer, Supprimer |
| **Supprimée** | `supprimee` | Supprimée (soft delete) | ⚫ Noir | Restaurer |

## 🔄 Transitions Autorisées

### Règles Métier
- **Nouvelle → Acceptée** : Requiert approbation admin + notes
- **Acceptée → Confirmée** : Automatique (pas d'approbation)
- **Confirmée → En cours** : Automatique
- **En cours → Terminée** : Automatique
- **Terminée → Archivée** : Automatique
- **Toute transition vers Annulée** : Requiert approbation admin + notes

### Contraintes
- Certaines transitions nécessitent une **approbation administrative**
- Les transitions sensibles requièrent des **notes obligatoires**
- **Actions automatiques** peuvent être déclenchées (emails, notifications)

## 🛠️ Architecture Technique

### Composants React
```
BookingStatusManagement (Principal)
├── BookingStatusDashboard (Tableau de bord)
├── BookingStatusManager (Gestion des statuts)
├── StatusTransitionWorkflow (Workflow guidé)
└── (À venir) StatusHistory (Historique complet)
```

### Structure de Base de Données
```sql
-- Table des statuts prédéfinis
booking_statuses (
  id, code, name, description, color, icon, 
  is_active, sort_order, created_at
)

-- Table des transitions autorisées
booking_status_transitions (
  id, from_status_id, to_status_id,
  requires_admin_approval, requires_notes,
  auto_actions, created_at
)

-- Table de l'historique des changements
booking_status_changes (
  id, booking_request_id, from_status_id, to_status_id,
  changed_by, changed_at, notes, transition_reason
)
```

### Fonctions Supabase
```sql
-- Changer le statut d'une réservation
SELECT change_booking_status(
  booking_id, new_status_code, notes, 
  changed_by, transition_reason
);

-- Obtenir les transitions disponibles
SELECT * FROM get_available_transitions(booking_id);

-- Récupérer l'historique des changements
SELECT * FROM get_booking_status_history(booking_id);
```

## 🚀 Installation et Configuration

### 1. Prérequis
- Node.js 18+ et npm/yarn
- Base de données Supabase configurée
- Composants UI installés (shadcn/ui)

### 2. Installation des Composants
```bash
# Copier les composants dans src/components/
cp BookingStatusManagement.tsx src/components/
cp BookingStatusDashboard.tsx src/components/
cp BookingStatusManager.tsx src/components/
cp StatusTransitionWorkflow.tsx src/components/

# Installer les dépendances
npm install lucide-react
```

### 3. Configuration des Routes
```tsx
// Dans App.tsx ou le routeur principal
import BookingStatusDemo from './pages/BookingStatusDemo';

// Ajouter la route
<Route path="/booking-status-demo" element={<BookingStatusDemo />} />
```

### 4. Configuration Supabase
```bash
# Appliquer les migrations
supabase db push

# Vérifier les tables créées
supabase db diff
```

## 📱 Utilisation

### Navigation
1. **Tableau de Bord** : Vue d'ensemble et métriques
2. **Gestionnaire** : Gestion des statuts individuels
3. **Workflow** : Processus guidé pour les transitions
4. **Historique** : Consultation des changements passés

### Changer un Statut
1. Sélectionner la réservation dans la liste
2. Cliquer sur "Changer le statut"
3. Choisir le nouveau statut dans la liste des transitions autorisées
4. Remplir la raison et les notes si requis
5. Confirmer l'approbation administrative si nécessaire
6. Valider la transition

### Workflow Guidé
1. **Validation** : Vérification des données de la réservation
2. **Raison** : Spécification du motif du changement
3. **Notes** : Ajout de commentaires optionnels
4. **Approbation** : Validation admin si requise
5. **Confirmation** : Récapitulatif et exécution

## 🔧 Personnalisation

### Ajouter un Nouveau Statut
```sql
INSERT INTO booking_statuses (code, name, description, color, icon, sort_order)
VALUES ('nouveau_statut', 'Nouveau Statut', 'Description...', '#FF0000', 'icon-name', 9);
```

### Modifier les Transitions
```sql
-- Ajouter une nouvelle transition
INSERT INTO booking_status_transitions (from_status_id, to_status_id, requires_admin_approval, requires_notes)
VALUES (
  (SELECT id FROM booking_statuses WHERE code = 'statut_source'),
  (SELECT id FROM booking_statuses WHERE code = 'statut_destination'),
  true, true
);
```

### Personnaliser les Couleurs
```typescript
// Dans les composants, modifier la fonction getStatusColorClass
const colorMap: Record<string, string> = {
  '#FF0000': 'bg-red-100 text-red-800', // Rouge
  '#00FF00': 'bg-green-100 text-green-800', // Vert
  // ... autres couleurs
};
```

## 🧪 Tests et Développement

### Données de Test
L'interface utilise actuellement des données simulées. Pour les tests :
```typescript
// Dans les composants, remplacer les appels API par :
const mockData = [
  // Données de test
];

// Puis implémenter les vrais appels API
const result = await supabase.from('table').select('*');
```

### Développement Local
```bash
# Démarrer l'application
npm run dev

# Accéder à la démo
http://localhost:5173/booking-status-demo

# Tests unitaires
npm run test

# Build de production
npm run build
```

## 📚 Documentation Associée

- [Structure de la Base de Données](../DATABASE_STRUCTURE.md)
- [Système de Statuts Avancé](../ENHANCED_STATUS_SYSTEM.md)
- [Guide de l'Interface Admin](../ADMIN_INTERFACE_GUIDE.md)
- [Configuration Supabase](../SUPABASE_SETUP.md)
- [Guide de Déploiement](../DEPLOYMENT_GUIDE.md)

## 🐛 Dépannage

### Problèmes Courants

#### Composant ne se charge pas
```bash
# Vérifier les imports
npm run build

# Vérifier les dépendances
npm install
```

#### Erreurs de base de données
```bash
# Vérifier la connexion Supabase
supabase status

# Appliquer les migrations
supabase db reset
```

#### Problèmes de style
```bash
# Vérifier Tailwind CSS
npm run build:css

# Vérifier les composants UI
npx shadcn-ui@latest add [component]
```

### Logs et Debug
```typescript
// Activer le mode debug
console.log('Debug:', { status, transitions, validation });

// Vérifier les états React
console.log('State:', { 
  currentStep, 
  workflowSteps, 
  validation 
});
```

## 🤝 Contribution

### Ajouter une Fonctionnalité
1. Créer un nouveau composant dans `src/components/`
2. Ajouter les tests unitaires
3. Mettre à jour la documentation
4. Créer une pull request

### Signaler un Bug
1. Vérifier les issues existantes
2. Créer une nouvelle issue avec :
   - Description du problème
   - Étapes pour reproduire
   - Environnement (OS, navigateur, version)
   - Logs d'erreur

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](../LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Consulter la documentation technique
- Contacter l'équipe de développement

---

**Dernière mise à jour** : Janvier 2025  
**Version** : 1.0.0-beta  
**Auteur** : Équipe de développement Marie Fortea
