# 🎯 Guide d'utilisation - Sélection Multiple des Réservations

## 📋 Vue d'ensemble

La fonctionnalité de sélection multiple permet de sélectionner plusieurs réservations simultanément dans le back office et d'appliquer des actions en lot sur toutes les réservations sélectionnées.

## ✨ Fonctionnalités disponibles

### 🔍 Sélection des réservations
- **Case à cocher individuelle** : Sélectionnez une réservation spécifique
- **Case à cocher "Tout sélectionner"** : Sélectionnez/désélectionnez toutes les réservations de la vue actuelle
- **Compteur de sélection** : Affiche le nombre de réservations sélectionnées

### 🎛️ Actions en lot disponibles

#### 📊 Vue "Demandes Actives"
- ✅ **Changer le statut** : Modifier le statut de toutes les réservations sélectionnées
- 📁 **Archiver** : Archiver les réservations (statut → "Terminée")
- 🗑️ **Mettre en corbeille** : Supprimer les réservations (statut → "Annulée")

#### 📦 Vue "Archivées"
- ✅ **Changer le statut** : Modifier le statut de toutes les réservations sélectionnées
- 🔄 **Désarchiver** : Restaurer les réservations dans les demandes actives
- 🗑️ **Supprimer définitivement** : Supprimer définitivement les réservations

#### 🗑️ Vue "Corbeille"
- ✅ **Changer le statut** : Modifier le statut de toutes les réservations sélectionnées
- 🔄 **Restaurer** : Restaurer les réservations dans les demandes actives
- 🗑️ **Supprimer définitivement** : Supprimer définitivement les réservations

## 🚀 Comment utiliser

### 1. Sélectionner des réservations
1. **Accédez** au back office → Gestion des Réservations
2. **Choisissez** une vue (Demandes Actives, Archivées, Corbeille)
3. **Sélectionnez** les réservations souhaitées :
   - Cochez les cases individuelles
   - Ou utilisez "Sélectionner tout" pour tout sélectionner

### 2. Appliquer une action en lot
1. **Une fois** des réservations sélectionnées, une barre d'actions apparaît
2. **Cliquez** sur l'action souhaitée :
   - **Changer le statut** : Sélectionnez le nouveau statut dans le dialogue
   - **Archiver/Désarchiver/Restaurer** : Confirmation directe
   - **Mettre en corbeille/Supprimer** : Confirmation avec avertissement

### 3. Confirmation et exécution
1. **Vérifiez** les détails de l'action dans le dialogue de confirmation
2. **Cliquez** sur "Exécuter l'action" pour appliquer
3. **Attendez** la confirmation de succès

## 🎨 Interface utilisateur

### Barre de sélection
- **Case à cocher principale** : Sélectionner/désélectionner tout
- **Compteur** : Nombre de réservations sélectionnées
- **Bouton "Désélectionner tout"** : Réinitialiser la sélection

### Barre d'actions en lot
- **Compteur** : "X réservation(s) sélectionnée(s)"
- **Boutons d'action** : Actions disponibles selon la vue
- **Couleurs** : 
  - 🔵 Bleu : Actions normales
  - 🟢 Vert : Actions de restauration
  - 🔴 Rouge : Actions de suppression

### Indicateurs visuels
- **Réservations sélectionnées** : Fond bleu clair
- **Réservations non sélectionnées** : Fond normal
- **Hover** : Effet de survol pour indiquer la sélection

## ⚠️ Points importants

### Sécurité
- **Actions irréversibles** : La suppression définitive ne peut pas être annulée
- **Confirmation obligatoire** : Toutes les actions importantes nécessitent une confirmation
- **Avertissements** : Les actions dangereuses affichent des avertissements

### Performance
- **Actions en parallèle** : Les actions sont exécutées simultanément pour de meilleures performances
- **Rechargement automatique** : Les données sont rechargées après chaque action
- **Indicateur de chargement** : Affichage pendant l'exécution des actions

### Limites
- **Vue par vue** : La sélection est réinitialisée lors du changement de vue
- **Actions contextuelles** : Les actions disponibles dépendent de la vue actuelle
- **Sélection unique** : Une sélection ne peut pas être partagée entre les vues

## 🔧 Actions spécifiques par vue

### Demandes Actives
- **Archiver** : Déplace vers les archives + statut "Terminée"
- **Mettre en corbeille** : Déplace vers la corbeille + statut "Annulée"

### Archivées
- **Désarchiver** : Restaure dans les demandes actives
- **Supprimer définitivement** : Supprime sans possibilité de récupération

### Corbeille
- **Restaurer** : Restaure dans les demandes actives
- **Supprimer définitivement** : Supprime sans possibilité de récupération

## 🎯 Conseils d'utilisation

1. **Vérifiez** toujours la sélection avant d'appliquer une action
2. **Utilisez** les filtres pour réduire le nombre de réservations affichées
3. **Testez** d'abord sur une petite sélection avant d'appliquer à un grand nombre
4. **Sauvegardez** régulièrement vos données importantes
5. **Utilisez** les actions individuelles pour des cas spécifiques

## 🐛 Dépannage

### Problèmes courants
- **Sélection perdue** : Normal lors du changement de vue
- **Action non disponible** : Vérifiez que vous êtes dans la bonne vue
- **Erreur d'exécution** : Vérifiez votre connexion et réessayez

### Support
En cas de problème, contactez l'administrateur système ou consultez les logs d'erreur.
