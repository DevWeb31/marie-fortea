# 🎯 Restauration et Désarchivage avec Sélection de Statut

## ✅ **Nouvelles Fonctionnalités Implémentées !**

### **🔄 Désarchivage** → Sélection de statut parmi **"En attente"**, **"Contacté"** ou **"Confirmé"**
### **🗑️ Restauration de la corbeille** → Sélection de statut parmi **"En attente"**, **"Contacté"** ou **"Confirmé"**

## 🔧 **Logique Implémentée**

### **Processus de Désarchivage en 2 Étapes :**

1. **📦 Désarchivage** : `archived_at` → `NULL` (retour aux réservations actives)
2. **📊 Sélection de statut** : Dialogue pour choisir le nouveau statut

### **Processus de Restauration de la Corbeille en 2 Étapes :**

1. **🗑️ Restauration** : `deleted_at` → `NULL` (retour aux réservations actives)
2. **📊 Sélection de statut** : Dialogue pour choisir le nouveau statut

### **Code Modifié - Désarchivage :**

```typescript
// État pour le dialogue de sélection de statut après désarchivage
const [unarchiveStatusDialog, setUnarchiveStatusDialog] = useState<{
  isOpen: boolean;
  requestId: string | null;
  requestName: string | null;
}>({
  isOpen: false,
  requestId: null,
  requestName: null,
});

const handleUnarchiveBooking = async (id: string) => {
  try {
    console.log('🔄 Désarchivage avec sélection de nouveau statut...');
    
    // 1. D'abord, désarchiver la réservation
    const result = await BookingService.unarchiveBooking(id);
    
    if (result.data) {
      console.log('✅ Réservation désarchivée avec succès');
      
      // 2. Ouvrir le dialogue de sélection de statut
      const request = archivedRequests.find(r => r.id === id);
      setUnarchiveStatusDialog({
        isOpen: true,
        requestId: id,
        requestName: request?.parentName || 'Réservation'
      });
    }
  } catch (error) {
    // Gestion d'erreur...
  }
};

const handleUnarchiveStatusUpdate = async (newStatus: AllBookingStatus) => {
  if (!unarchiveStatusDialog.requestId) return;

  setIsUpdating(true);
  try {
    console.log('🔄 Mise à jour du statut après désarchivage...');
    
    // Mettre à jour le statut
    const { error: statusError } = await supabase
      .from('booking_requests')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', unarchiveStatusDialog.requestId);

    if (statusError) {
      // Gestion d'erreur...
      return;
    }

    console.log('✅ Statut mis à jour avec succès');
    toast({
      title: 'Réservation désarchivée',
      description: `La réservation a été désarchivée avec succès et le statut a été mis à jour vers "${formatBookingStatus(newStatus)}"`,
      variant: 'default',
    });

    // Fermer le dialogue et recharger les données
    setUnarchiveStatusDialog({
      isOpen: false,
      requestId: null,
      requestName: null,
    });

    // Recharger automatiquement tous les compteurs
    await reloadAllCounters();
  } catch (error) {
    // Gestion d'erreur...
  } finally {
    setIsUpdating(false);
  }
};
```

### **Code Modifié - Restauration de la Corbeille :**

```typescript
// État pour le dialogue de sélection de statut après restauration de la corbeille
const [restoreStatusDialog, setRestoreStatusDialog] = useState<{
  isOpen: boolean;
  requestId: string | null;
  requestName: string | null;
}>({
  isOpen: false,
  requestId: null,
  requestName: null,
});

const handleRestoreFromTrash = async (id: string) => {
  try {
    console.log('🔄 Restauration avec sélection de nouveau statut...');
    
    // 1. D'abord, restaurer la réservation de la corbeille
    const result = await BookingService.restoreFromTrash(id);
    
    if (result.data) {
      console.log('✅ Réservation restaurée avec succès');
      
      // 2. Ouvrir le dialogue de sélection de statut
      const request = deletedRequests.find(r => r.id === id);
      setRestoreStatusDialog({
        isOpen: true,
        requestId: id,
        requestName: request?.parentName || 'Réservation'
      });
    }
  } catch (error) {
    // Gestion d'erreur...
  }
};

const handleRestoreStatusUpdate = async (newStatus: AllBookingStatus) => {
  if (!restoreStatusDialog.requestId) return;

  setIsUpdating(true);
  try {
    console.log('🔄 Mise à jour du statut après restauration...');
    
    // Mettre à jour le statut
    const { error: statusError } = await supabase
      .from('booking_requests')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', restoreStatusDialog.requestId);

    if (statusError) {
      // Gestion d'erreur...
      return;
    }

    console.log('✅ Statut mis à jour avec succès');
    toast({
      title: 'Réservation restaurée',
      description: `La réservation a été restaurée avec succès et le statut a été mis à jour vers "${formatBookingStatus(newStatus)}"`,
      variant: 'default',
    });

    // Fermer le dialogue et recharger les données
    setRestoreStatusDialog({
      isOpen: false,
      requestId: null,
      requestName: null,
    });

    // Recharger automatiquement tous les compteurs
    await reloadAllCounters();
  } catch (error) {
    // Gestion d'erreur...
  } finally {
    setIsUpdating(false);
  }
};
```

## 🧪 **Comment Tester**

### **Test du Désarchivage :**

#### **Étape 1 : Trouver une Réservation Archivée**
1. **Dashboard admin** : `/admin/dashboard`
2. **Onglet "Demandes de réservation"** (📋)
3. **Basculer** vers l'onglet "Archivées" (📦)
4. **Trouver** une réservation archivée

#### **Étape 2 : Désarchiver la Réservation**
1. **Cliquer** sur le bouton 🔄 (Désarchiver)
2. **Confirmer** la désarchivage dans la boîte de dialogue
3. **Observer** l'ouverture du dialogue de sélection de statut

#### **Étape 3 : Choisir le Nouveau Statut**
1. **Sélectionner** un des trois statuts disponibles :
   - 🟡 **"En attente"** (pending)
   - 🔵 **"Contacté"** (contacted)
   - 🟢 **"Confirmé"** (confirmed)
2. **Observer** les logs dans la console

#### **Étape 4 : Vérifier les Résultats**
1. **Statut mis à jour** : La réservation a le nouveau statut sélectionné
2. **Réservation désarchivée** : Elle apparaît dans l'onglet "Demandes de réservation"
3. **Compteurs mis à jour** : Tous les compteurs se mettent à jour automatiquement

### **Test de la Restauration de la Corbeille :**

#### **Étape 1 : Trouver une Réservation dans la Corbeille**
1. **Dashboard admin** : `/admin/dashboard`
2. **Onglet "Demandes de réservation"** (📋)
3. **Basculer** vers l'onglet "Corbeille" (🗑️)
4. **Trouver** une réservation dans la corbeille

#### **Étape 2 : Restaurer la Réservation**
1. **Cliquer** sur le bouton 🔄 (Restaurer)
2. **Confirmer** la restauration dans la boîte de dialogue
3. **Observer** l'ouverture du dialogue de sélection de statut

#### **Étape 3 : Choisir le Nouveau Statut**
1. **Sélectionner** un des trois statuts disponibles :
   - 🟡 **"En attente"** (pending)
   - 🔵 **"Contacté"** (contacted)
   - 🟢 **"Confirmé"** (confirmed)
2. **Observer** les logs dans la console

#### **Étape 4 : Vérifier les Résultats**
1. **Statut mis à jour** : La réservation a le nouveau statut sélectionné
2. **Réservation restaurée** : Elle apparaît dans l'onglet "Demandes de réservation"
3. **Compteurs mis à jour** : Tous les compteurs se mettent à jour automatiquement

## 📊 **Logs Attendus (Succès)**

### **Console du Navigateur - Désarchivage :**
```
🔄 Désarchivage avec sélection de nouveau statut...
Réservation: [ID]
✅ Réservation désarchivée avec succès

[Ouverture du dialogue de sélection de statut]

🔄 Mise à jour du statut après désarchivage...
Réservation: [ID]
Nouveau statut: pending
✅ Statut mis à jour avec succès

Toast: "Réservation désarchivée - La réservation a été désarchivée avec succès et le statut a été mis à jour vers 'En attente'"
```

### **Console du Navigateur - Restauration de la Corbeille :**
```
🔄 Restauration avec sélection de nouveau statut...
Réservation: [ID]
✅ Réservation restaurée avec succès

[Ouverture du dialogue de sélection de statut]

🔄 Mise à jour du statut après restauration...
Réservation: [ID]
Nouveau statut: contacted
✅ Statut mis à jour avec succès

Toast: "Réservation restaurée - La réservation a été restaurée avec succès et le statut a été mis à jour vers 'Contacté'"
```

## 🎯 **Avantages de ces Fonctionnalités**

### **✅ Logique Métier Cohérente**
- **Désarchivage = Nouveau cycle** : Une réservation désarchivée recommence son cycle
- **Restauration = Nouveau cycle** : Une réservation restaurée recommence son cycle
- **Statut approprié** : L'utilisateur choisit le statut le plus logique
- **Workflow flexible** : Pas de statut imposé, choix libre

### **✅ UX Améliorée**
- **Processus guidé** : L'utilisateur est guidé dans le choix du statut
- **Feedback clair** : Dialogue explicite avec les options disponibles
- **Interface intuitive** : Boutons colorés avec icônes pour chaque statut

### **✅ Gestion d'Erreurs Robuste**
- **Vérification en 2 étapes** : Désarchivage/Restauration puis mise à jour du statut
- **Messages d'erreur précis** : L'utilisateur sait quelle étape a échoué
- **Annulation possible** : Possibilité d'annuler la sélection de statut

## 🔄 **Workflow Complet**

### **Scénario Typique - Désarchivage :**
1. **Réservation archivée "Terminée"** → Utilisateur clique sur "Désarchiver"
2. **Confirmation** → Boîte de dialogue de confirmation
3. **Désarchivage** → `archived_at` = NULL
4. **Dialogue de statut** → Sélection parmi 3 options
5. **Mise à jour du statut** → Nouveau statut appliqué
6. **Compteurs mis à jour** → Tous les onglets se rafraîchissent
7. **Feedback utilisateur** → Toast de confirmation avec détails

### **Scénario Typique - Restauration de la Corbeille :**
1. **Réservation dans la corbeille "Annulée"** → Utilisateur clique sur "Restaurer"
2. **Confirmation** → Boîte de dialogue de confirmation
3. **Restauration** → `deleted_at` = NULL
4. **Dialogue de statut** → Sélection parmi 3 options
5. **Mise à jour du statut** → Nouveau statut appliqué
6. **Compteurs mis à jour** → Tous les onglets se rafraîchissent
7. **Feedback utilisateur** → Toast de confirmation avec détails

### **Options de Statut Disponibles :**
- 🟡 **"En attente"** (pending) - Pour les nouvelles demandes
- 🔵 **"Contacté"** (contacted) - Pour les clients contactés
- 🟢 **"Confirmé"** (confirmed) - Pour les réservations confirmées

## 🎉 **Résultat Final**

### **Avant (Problèmes)**
- ❌ Désarchivage sans statut défini
- ❌ Restauration sans statut défini
- ❌ Réservation désarchivée/restaurée avec statut inapproprié
- ❌ Workflow incomplet

### **Maintenant (Solution)**
- ✅ **Désarchivage guidé** : Dialogue de sélection de statut
- ✅ **Restauration guidée** : Dialogue de sélection de statut
- ✅ **Statut approprié** : Choix libre parmi les statuts actifs
- ✅ **Workflow complet** : Désarchivage/Restauration + sélection de statut

**Le désarchivage et la restauration sont maintenant guidés et logiques !** 🎯✨

---

**Statut** : ✅ Fonctionnalités implémentées - Désarchivage et restauration avec sélection de statut  
**Dernière mise à jour** : Janvier 2025  
**Prochaine étape** : Tester les fonctionnalités guidées
