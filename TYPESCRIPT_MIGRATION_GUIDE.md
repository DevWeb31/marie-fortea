# Guide de Migration TypeScript - Système de Statuts

## Vue d'ensemble

Ce document décrit les changements apportés aux types TypeScript pour supporter le nouveau système de statuts des réservations.

## 🔄 Changements Majeurs

### 1. **Nouveau Type Principal : `BookingStatusCode`**

**Avant :**
```typescript
export type BookingStatus = 
  | 'pending'      // En attente de contact
  | 'contacted'    // Contacté par l'admin
  | 'confirmed'    // Réservation confirmée
  | 'cancelled'    // Annulée
  | 'completed';   // Terminée
```

**Après :**
```typescript
export type BookingStatusCode = 
  | 'nouvelle'      // Nouvelle réservation
  | 'acceptee'      // Réservation acceptée
  | 'confirmee'     // Réservation confirmée
  | 'en_cours'      // En cours
  | 'terminee'      // Terminée
  | 'annulee'       // Annulée
  | 'archivée'      // Archivée
  | 'supprimee';    // Supprimée

// Legacy type pour la compatibilité
export type LegacyBookingStatus = 
  | 'pending' | 'contacted' | 'confirmed' | 'cancelled' | 'completed';
```

### 2. **Nouvelles Interfaces**

#### `BookingStatus`
```typescript
export interface BookingStatus {
  id: number;
  code: string;
  name: string;
  description: string;
  color: string;        // Couleur hexadécimale
  icon: string;         // Nom de l'icône
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}
```

#### `BookingStatusTransition`
```typescript
export interface BookingStatusTransition {
  id: number;
  fromStatusId: number;
  toStatusId: number;
  requiresAdminApproval: boolean;
  requiresNotes: boolean;
  autoActions?: string[];
  createdAt: string;
}
```

#### `BookingStatusChange`
```typescript
export interface BookingStatusChange {
  id: string;
  bookingRequestId: string;
  fromStatusId?: number;
  toStatusId: number;
  changedBy: string;
  changedAt: string;
  notes?: string;
  transitionReason?: string;
  metadata?: Record<string, any>;
}
```

### 3. **Interface `BookingRequest` Mise à Jour**

**Champs ajoutés :**
```typescript
export interface BookingRequest {
  // ... champs existants ...
  
  // Nouveaux champs pour le système de statuts
  statusId: number;           // Référence vers booking_statuses
  statusCode?: string;        // Code du statut actuel
  statusName?: string;        // Nom du statut actuel
  statusColor?: string;       // Couleur du statut actuel
  statusIcon?: string;        // Icône du statut actuel
  statusDescription?: string; // Description du statut actuel
}
```

## 🆕 Nouvelles Fonctions Utilitaires

### 1. **Gestion des Statuts**
```typescript
// Obtenir un statut par son code
export const getBookingStatusByCode = (code: string): Omit<BookingStatus, 'id' | 'createdAt'> | undefined

// Obtenir le nom d'un statut
export const getBookingStatusName = (code: string): string

// Obtenir la couleur d'un statut
export const getBookingStatusColor = (code: string): string

// Obtenir l'icône d'un statut
export const getBookingStatusIcon = (code: string): string

// Obtenir la description d'un statut
export const getBookingStatusDescription = (code: string): string
```

### 2. **Gestion des Transitions**
```typescript
// Obtenir les transitions disponibles
export const getAvailableTransitions = async (bookingId: string): Promise<AvailableTransition[]>

// Changer le statut d'une réservation
export const changeBookingStatus = async (
  bookingId: string,
  newStatusCode: string,
  notes?: string,
  changedBy?: string,
  transitionReason?: string
): Promise<ChangeStatusResponse>

// Vérifier si une transition est autorisée
export const isTransitionAllowed = async (fromStatusCode: string, toStatusCode: string): Promise<boolean>

// Obtenir les prérequis d'une transition
export const getTransitionRequirements = async (
  fromStatusCode: string, 
  toStatusCode: string
): Promise<{ requiresAdminApproval: boolean; requiresNotes: boolean } | null>
```

### 3. **Fonctions d'Affichage**
```typescript
// Formater l'affichage d'un statut
export const formatStatusDisplay = (statusCode: string): {
  name: string;
  color: string;
  icon: string;
  description: string;
  cssClasses: string;
}

// Obtenir les classes CSS Tailwind pour un statut
export const getStatusColor = (status: string): string
```

## 🔧 Migration des Composants Existants

### 1. **Mise à Jour des Imports**

**Avant :**
```typescript
import { BookingStatus, formatBookingStatus, getStatusColor } from '../types/booking';
```

**Après :**
```typescript
import { 
  BookingStatusCode, 
  formatBookingStatus, 
  getStatusColor,
  getBookingStatusName,
  getBookingStatusColor 
} from '../types/booking-status';
```

### 2. **Mise à Jour des Types de Props**

**Avant :**
```typescript
interface BookingCardProps {
  status: BookingStatus;
  // ...
}
```

**Après :**
```typescript
interface BookingCardProps {
  status: string; // ou BookingStatusCode pour plus de type safety
  // ...
}
```

### 3. **Mise à Jour des Fonctions de Formatage**

**Avant :**
```typescript
const statusLabel = formatBookingStatus(status);
const statusColor = getStatusColor(status);
```

**Après :**
```typescript
const statusLabel = formatBookingStatus(status);
const statusColor = getStatusColor(status);
const statusName = getBookingStatusName(status);
const statusIcon = getBookingStatusIcon(status);
```

## 📊 Constantes et Données

### 1. **Statuts Prédéfinis**
```typescript
export const BOOKING_STATUSES: Omit<BookingStatus, 'id' | 'createdAt'>[] = [
  {
    code: 'nouvelle',
    name: 'Nouvelle réservation',
    description: 'Demande initiale reçue, en attente de traitement',
    color: '#F59E0B',
    icon: 'clock',
    isActive: true,
    sortOrder: 1
  },
  // ... autres statuts
];
```

### 2. **Utilisation dans les Composants**
```typescript
import { BOOKING_STATUSES } from '../types/booking-status';

const StatusSelector: React.FC = () => {
  return (
    <select>
      {BOOKING_STATUSES.map(status => (
        <option key={status.code} value={status.code}>
          {status.name}
        </option>
      ))}
    </select>
  );
};
```

## 🚀 Nouvelles Fonctionnalités

### 1. **Validation des Transitions**
```typescript
// Vérifier si une transition est autorisée avant de l'effectuer
const canTransition = await isTransitionAllowed(currentStatus, newStatus);
if (!canTransition) {
  console.error('Transition non autorisée');
  return;
}

// Obtenir les prérequis
const requirements = await getTransitionRequirements(currentStatus, newStatus);
if (requirements?.requiresNotes && !notes) {
  console.error('Notes requises pour cette transition');
  return;
}
```

### 2. **Historique des Changements**
```typescript
// Récupérer l'historique complet des changements de statut
const history = await getStatusChangeHistory(bookingId);
history.forEach(change => {
  console.log(`${change.changedAt}: ${change.fromStatusId} → ${change.toStatusId}`);
  if (change.notes) console.log(`Notes: ${change.notes}`);
});
```

### 3. **Vue d'Ensemble des Statuts**
```typescript
// Obtenir le nombre de réservations par statut
const overview = await getStatusOverview();
overview.forEach(status => {
  console.log(`${status.name}: ${status.count} réservations`);
});
```

## 🔒 Sécurité et Validation

### 1. **Contrôles Automatiques**
- **Transitions autorisées** : Seules les transitions définies sont possibles
- **Prérequis** : Vérification des notes et approbations requises
- **Historique** : Tous les changements sont tracés

### 2. **Types Stricts**
- **Codes de statut** : Union types pour limiter les valeurs possibles
- **Interfaces complètes** : Tous les champs requis sont typés
- **Fonctions async** : Gestion appropriée des appels API

## 📝 Exemples d'Utilisation

### 1. **Composant de Sélection de Statut**
```typescript
import React from 'react';
import { BOOKING_STATUSES, getBookingStatusColor } from '../types/booking-status';

const StatusSelector: React.FC<{ 
  value: string; 
  onChange: (status: string) => void; 
}> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      {BOOKING_STATUSES.map(status => (
        <button
          key={status.code}
          onClick={() => onChange(status.code)}
          className={`p-3 rounded-lg border-2 transition-all ${
            value === status.code 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: status.color }}
            />
            <span className="font-medium">{status.name}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {status.description}
          </p>
        </button>
      ))}
    </div>
  );
};
```

### 2. **Gestionnaire de Changement de Statut**
```typescript
import { changeBookingStatus, getTransitionRequirements } from '../types/booking-status';

const handleStatusChange = async (
  bookingId: string, 
  newStatus: string, 
  notes?: string
) => {
  try {
    // Vérifier les prérequis
    const requirements = await getTransitionRequirements(currentStatus, newStatus);
    
    if (requirements?.requiresNotes && !notes) {
      setError('Des notes sont requises pour cette transition');
      return;
    }
    
    // Effectuer le changement
    const result = await changeBookingStatus(
      bookingId, 
      newStatus, 
      notes, 
      'admin@example.com'
    );
    
    if (result.success) {
      setSuccess('Statut changé avec succès');
      // Rafraîchir les données
      await refreshBookingData();
    } else {
      setError(result.error || 'Erreur lors du changement de statut');
    }
  } catch (error) {
    setError('Erreur inattendue');
    console.error(error);
  }
};
```

## 🔍 Dépannage

### 1. **Erreurs de Compilation Courantes**

**Erreur : "Type 'string' is not assignable to type 'BookingStatus'"**
```typescript
// ❌ Incorrect
const status: BookingStatus = 'nouvelle';

// ✅ Correct
const status: string = 'nouvelle';
// ou
const status: BookingStatusCode = 'nouvelle';
```

**Erreur : "Property 'color' does not exist on type 'string'"**
```typescript
// ❌ Incorrect
const color = status.color;

// ✅ Correct
const color = getBookingStatusColor(status);
```

### 2. **Vérification des Types**
```bash
# Vérifier que tout compile correctement
npx tsc --noEmit --project tsconfig.json

# Vérifier les types d'un fichier spécifique
npx tsc --noEmit src/components/MyComponent.tsx
```

## 📚 Ressources Supplémentaires

- **Fichier de types principal** : `src/types/booking-status.ts`
- **Fichier de types legacy** : `src/types/booking.ts`
- **Composant de test** : `src/components/StatusTestComponent.tsx`
- **Documentation BDD** : `ENHANCED_STATUS_SYSTEM.md`

---

**Note** : Cette migration maintient la compatibilité avec l'ancien système tout en ajoutant de nouvelles fonctionnalités. Les composants existants continueront de fonctionner avec des mises à jour minimales.
