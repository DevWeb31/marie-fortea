# 🔄 Guide de Synchronisation des Types de Services

## 📋 **Problème Identifié**

Vous avez actuellement **3 systèmes différents** pour gérer les types de services de garde :

1. **Page Services** (affichage public) - 4 types principaux
2. **Table `service_types`** (base de données) - 5 types différents
3. **Table `site_settings`** (paramètres de prix) - 6 types différents

## 🎯 **Solution Proposée**

Synchroniser tous les systèmes pour utiliser les **mêmes types de services** que ceux affichés sur votre page Services.

---

## 📊 **Types de Services Standardisés**

### **Types Principaux (Page Services) :**

| Code | Nom | Prix Jour | Prix Nuit | Durée Min |
|------|-----|-----------|-----------|-----------|
| `babysitting` | Garde d'enfants | 20€/h | - | 3h |
| `event_support` | Soutien événementiel | 25€/h | 30€/h | 4h |
| `weekend_care` | Garde en soirée | 20€/h | 25€/h | 3h |
| `emergency_care` | Garde d'urgence | 40€/h | - | 2h |

### **Types Supplémentaires :**

| Code | Nom | Prix | Durée Min |
|------|-----|------|-----------|
| `overnight_care` | Garde de nuit | 22.50€/h | 4h |
| `holiday_care` | Garde pendant les vacances | 21€/h | 2h |

---

## 🛠️ **Étapes de Synchronisation**

### **Étape 1 : Diagnostic**
```bash
# Exécuter le script de diagnostic
# Copier le contenu de scripts/diagnostic-service-types.sql
# Dans l'éditeur SQL de Supabase
```

### **Étape 2 : Synchronisation**
```bash
# Exécuter le script de synchronisation
# Copier le contenu de scripts/sync-service-types.sql
# Dans l'éditeur SQL de Supabase
```

### **Étape 3 : Vérification**
```bash
# Relancer le diagnostic pour vérifier
# Que tout est bien synchronisé
```

---

## 📝 **Scripts Disponibles**

### **1. Diagnostic (`diagnostic-service-types.sql`)**
- ✅ Analyse l'état actuel
- ✅ Identifie les incohérences
- ✅ Montre les demandes existantes
- ✅ Compare avec la page Services

### **2. Synchronisation (`sync-service-types.sql`)**
- ✅ Met à jour la table `service_types`
- ✅ Met à jour les paramètres de prix
- ✅ Aligne les prix avec la page Services
- ✅ Génère un rapport de vérification

---

## ⚠️ **Points d'Attention**

### **Demandes Existantes**
- Les demandes existantes **ne seront pas modifiées**
- Seuls les nouveaux types seront standardisés
- Vous pouvez migrer les anciennes demandes si nécessaire

### **Prix Mise à Jour**
- Les prix seront alignés avec ceux de la page Services
- Les tarifs de nuit seront gérés par le code applicatif
- Le supplément par enfant reste à 5€

### **Compatibilité**
- Le système de réservation continuera de fonctionner
- Les formulaires s'adapteront automatiquement
- Aucune modification du code nécessaire

---

## 🚀 **Exécution**

### **Dans Supabase :**
1. **Allez** dans votre projet Supabase
2. **Ouvrez** l'éditeur SQL
3. **Copiez** le contenu du script de diagnostic
4. **Exécutez** pour voir l'état actuel
5. **Copiez** le contenu du script de synchronisation
6. **Exécutez** pour synchroniser
7. **Relancez** le diagnostic pour vérifier

### **Résultat Attendu :**
- ✅ Tous les types de services alignés
- ✅ Prix cohérents entre les systèmes
- ✅ Page Services et base de données synchronisées
- ✅ Système de réservation fonctionnel

---

## 📞 **Support**

Si vous rencontrez des problèmes :
1. **Vérifiez** les messages d'erreur
2. **Relancez** le diagnostic
3. **Contactez** l'équipe de développement

---

## 🎉 **Avantages de la Synchronisation**

- **Cohérence** : Mêmes types partout
- **Maintenance** : Plus facile à gérer
- **Clarté** : Prix transparents
- **Fiabilité** : Système unifié
