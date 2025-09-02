# 🔄 Guide de Mise à Jour - Nettoyage des Types de Services

## 📋 **Objectif**

Supprimer les types de services non désirés et garder seulement les 4 types principaux de la page Services :
- ✅ Garde d'enfants (`babysitting`)
- ✅ Soutien événementiel (`event_support`)
- ✅ Garde en soirée (`evening_care`) - **NOUVEAU**
- ✅ Garde d'urgence (`emergency_care`)

**Types à supprimer :**
- ❌ Garde pendant les vacances (`holiday_care`)
- ❌ Garde de nuit (`overnight_care`)
- ❌ Garde de weekend (`weekend_care`) - **remplacé par Garde en soirée**

## 🛠️ **Étapes de Mise à Jour**

### **Étape 1 : Nettoyage de la Base de Données**

1. **Allez** dans votre projet Supabase
2. **Ouvrez** l'éditeur SQL
3. **Copiez** et **exécutez** le script de nettoyage :

```sql
-- Copier le contenu de scripts/nettoyage-types-services.sql
```

### **Étape 2 : Vérification de la Base de Données**

Après l'exécution du script, vous devriez voir :

**Types de services finaux :**
- `babysitting` - Garde d'enfants (20€/h)
- `event_support` - Soutien événementiel (25€/h)
- `evening_care` - Garde en soirée (20€/h)
- `emergency_care` - Garde d'urgence (40€/h)

**Paramètres de prix finaux :**
- `pricing_service_babysitting` = 20
- `pricing_service_event_support` = 25
- `pricing_service_evening_care` = 20
- `pricing_service_emergency_care` = 40

### **Étape 3 : Redémarrage de l'Application**

1. **Arrêtez** votre serveur de développement (Ctrl+C)
2. **Redémarrez** l'application :
   ```bash
   npm run dev
   ```

### **Étape 4 : Vérification de l'Interface**

1. **Allez** sur votre interface de gestion des prix
2. **Actualisez** la page (bouton "Actualiser")
3. **Vérifiez** que seuls les 4 types principaux sont affichés

## 📊 **Résultat Attendu**

### **Interface de Gestion des Prix :**
- ✅ 4 types de services seulement
- ✅ Prix alignés avec la page Services
- ✅ Calculateur de prix fonctionnel

### **Page Services :**
- ✅ Mêmes types que l'interface admin
- ✅ Prix cohérents
- ✅ Système de réservation fonctionnel

### **Formulaire de Réservation :**
- ✅ 4 types de services disponibles
- ✅ Calcul de prix correct
- ✅ Validation des durées minimales

## 🔧 **Fichiers Modifiés**

### **Base de Données :**
- ✅ Table `service_types` nettoyée
- ✅ Table `site_settings` mise à jour
- ✅ Nouveau type `evening_care` ajouté

### **Code Application :**
- ✅ `src/lib/pricing-service.ts` - Types et prix mis à jour
- ✅ `src/pages/PricingManagement.tsx` - Interface nettoyée
- ✅ `src/components/BookingForm.tsx` - Services mis à jour

## ⚠️ **Points d'Attention**

### **Demandes Existantes :**
- Les demandes existantes **ne seront pas supprimées**
- Les anciens types dans les demandes resteront visibles
- Seules les nouvelles demandes utiliseront les nouveaux types

### **Compatibilité :**
- ✅ Le système de réservation continue de fonctionner
- ✅ Les formulaires s'adaptent automatiquement
- ✅ Aucune perte de données

## 🚨 **En Cas de Problème**

### **Si l'interface ne se met pas à jour :**
1. **Videz le cache** du navigateur (Ctrl+F5)
2. **Redémarrez** l'application
3. **Vérifiez** les variables d'environnement

### **Si des erreurs apparaissent :**
1. **Vérifiez** que le script SQL s'est bien exécuté
2. **Relancez** le diagnostic détaillé
3. **Contactez** l'équipe de développement

## 🎯 **Vérification Finale**

Après la mise à jour, vérifiez que :

1. **Interface admin** : 4 types de services seulement
2. **Page Services** : Prix cohérents
3. **Formulaire de réservation** : Types corrects
4. **Calculateur de prix** : Fonctionnel

## 📞 **Support**

Si vous rencontrez des problèmes :
1. **Sauvegardez** les résultats du diagnostic
2. **Notez** les erreurs éventuelles
3. **Contactez** l'équipe de développement

---

## 🎉 **Résultat Final**

Après avoir suivi ce guide :
- ✅ Types de services nettoyés et cohérents
- ✅ Prix alignés avec la page Services
- ✅ Interface admin simplifiée
- ✅ Système de réservation optimisé
