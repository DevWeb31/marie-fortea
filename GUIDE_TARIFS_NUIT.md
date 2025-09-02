# 🌙 Guide d'Ajout des Tarifs de Nuit

## 📋 **Objectif**

Permettre la gestion des tarifs de nuit dans le back-office pour les services qui en ont besoin :
- ✅ **Soutien événementiel** : Tarif de jour + Tarif de nuit
- ✅ **Garde en soirée** : Tarif de jour + Tarif de nuit
- ✅ **Garde d'enfants** : Tarif de jour uniquement
- ✅ **Garde d'urgence** : Tarif de jour uniquement

## 🛠️ **Étapes de Mise à Jour**

### **Étape 1 : Ajout des Paramètres de Base de Données**

1. **Allez** dans votre projet Supabase
2. **Ouvrez** l'éditeur SQL
3. **Copiez** et **exécutez** le script d'ajout des tarifs de nuit :

```sql
-- Copier le contenu de scripts/ajout-tarifs-nuit.sql
```

### **Étape 2 : Redémarrage de l'Application**

1. **Arrêtez** votre serveur de développement (Ctrl+C)
2. **Redémarrez** l'application :
   ```bash
   npm run dev
   ```

### **Étape 3 : Vérification de l'Interface**

1. **Allez** sur votre interface de gestion des prix
2. **Actualisez** la page (bouton "Actualiser")
3. **Sélectionnez** "Soutien événementiel" ou "Garde en soirée"
4. **Vérifiez** que vous voyez maintenant :
   - Prix de jour
   - Prix de nuit (nouveau champ)

## 📊 **Résultat Attendu**

### **Interface de Gestion des Prix :**

**Pour "Soutien événementiel" :**
- Prix de jour : 25€/heure
- Prix de nuit : 30€/heure

**Pour "Garde en soirée" :**
- Prix de jour : 20€/heure
- Prix de nuit : 25€/heure

**Pour "Garde d'enfants" et "Garde d'urgence" :**
- Prix de jour uniquement (pas de tarif de nuit)

### **Résumé des Prix :**
- ✅ Affichage des tarifs de jour ET de nuit
- ✅ Indication visuelle des services avec tarif de nuit
- ✅ Sauvegarde automatique des deux tarifs

## 🔧 **Fonctionnalités Ajoutées**

### **Base de Données :**
- ✅ Nouveaux paramètres `pricing_service_*_night`
- ✅ Configuration `pricing_service_*_has_night`
- ✅ Tarifs de nuit pour Soutien événementiel et Garde en soirée

### **Interface Admin :**
- ✅ Champs séparés pour tarifs de jour et de nuit
- ✅ Affichage conditionnel selon le service
- ✅ Résumé avec indication des tarifs de nuit
- ✅ Sauvegarde des deux tarifs

### **Service de Prix :**
- ✅ Structure étendue pour gérer les tarifs de nuit
- ✅ Configuration par service
- ✅ Initialisation avec valeurs par défaut

## ⚠️ **Points d'Attention**

### **Tarifs de Nuit :**
- Les tarifs de nuit s'appliquent à partir de 22h
- Seuls "Soutien événementiel" et "Garde en soirée" ont des tarifs de nuit
- Les autres services gardent leur tarif unique

### **Compatibilité :**
- ✅ Le système de réservation continue de fonctionner
- ✅ Les calculs de prix prennent en compte les tarifs de nuit
- ✅ Aucune perte de données existantes

## 🚨 **En Cas de Problème**

### **Si l'interface ne se met pas à jour :**
1. **Videz le cache** du navigateur (Ctrl+F5)
2. **Redémarrez** l'application
3. **Vérifiez** que le script SQL s'est bien exécuté

### **Si les tarifs de nuit n'apparaissent pas :**
1. **Vérifiez** que les paramètres existent dans la base
2. **Relancez** le script d'ajout des tarifs de nuit
3. **Actualisez** l'interface admin

## 🎯 **Vérification Finale**

Après la mise à jour, vérifiez que :

1. **Interface admin** : Champs de tarifs de nuit visibles
2. **Sauvegarde** : Les deux tarifs sont sauvegardés
3. **Affichage** : Résumé avec indication des tarifs de nuit
4. **Fonctionnalité** : Calcul de prix avec tarifs de nuit

## 📞 **Support**

Si vous rencontrez des problèmes :
1. **Sauvegardez** les résultats du diagnostic
2. **Notez** les erreurs éventuelles
3. **Contactez** l'équipe de développement

---

## 🎉 **Résultat Final**

Après avoir suivi ce guide :
- ✅ Gestion complète des tarifs de jour et de nuit
- ✅ Interface admin enrichie
- ✅ Configuration flexible par service
- ✅ Système de prix optimisé
