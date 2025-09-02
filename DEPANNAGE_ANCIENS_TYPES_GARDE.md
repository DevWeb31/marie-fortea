# 🔧 Guide de Dépannage - Problème des Anciens Types de Garde

## 🚨 **Problème Identifié**

Même après avoir exécuté les requêtes SQL, vous avez toujours les anciens types de garde dans votre interface de gestion des prix.

## 🔍 **Causes Possibles**

1. **Cache de l'application** - Les données sont mises en cache côté client
2. **Problème de synchronisation** - Les requêtes SQL n'ont pas été exécutées correctement
3. **Données corrompues** - Les anciennes données persistent dans la base
4. **Problème de permissions** - Les mises à jour n'ont pas été appliquées

## 🛠️ **Solution Étape par Étape**

### **Étape 1 : Diagnostic Détaillé**

1. **Allez** dans votre projet Supabase
2. **Ouvrez** l'éditeur SQL
3. **Copiez** et **exécutez** le script de diagnostic détaillé :

```sql
-- Copier le contenu de scripts/diagnostic-prix-detaille.sql
```

4. **Vérifiez** les résultats :
   - ✅ Tous les prix doivent être "CORRECT"
   - ❌ Si vous voyez "INCORRECT", passez à l'étape 2

### **Étape 2 : Correction Forcée**

Si le diagnostic montre des incohérences :

1. **Copiez** et **exécutez** le script de correction forcée :

```sql
-- Copier le contenu de scripts/correction-forcee-prix.sql
```

2. **Vérifiez** que tous les prix sont maintenant corrects

### **Étape 3 : Vider le Cache de l'Application**

Après la correction de la base de données :

1. **Actualisez** votre interface de gestion des prix (bouton "Actualiser")
2. **Fermez** et **rouvrez** votre navigateur
3. **Videz le cache** du navigateur (Ctrl+F5 ou Cmd+Shift+R)
4. **Reconnectez-vous** à l'interface admin

### **Étape 4 : Vérification Finale**

1. **Relancez** le diagnostic détaillé
2. **Vérifiez** que l'interface affiche les bons prix
3. **Testez** le calculateur de prix

## 📊 **Prix Attendus Après Correction**

| Service | Prix Page Services | Prix Interface Admin |
|---------|-------------------|---------------------|
| Garde d'enfants | 20€/h | 20€/h ✅ |
| Soutien événementiel | 25€/h | 25€/h ✅ |
| Garde en soirée | 20€/h | 20€/h ✅ |
| Garde d'urgence | 40€/h | 40€/h ✅ |
| Garde de nuit | 22.50€/h | 22.50€/h ✅ |
| Garde pendant les vacances | 21€/h | 21€/h ✅ |

## ⚠️ **Points d'Attention**

### **Si les prix restent incorrects :**

1. **Vérifiez** que vous êtes connecté au bon projet Supabase
2. **Vérifiez** que les requêtes SQL se sont bien exécutées (pas d'erreur)
3. **Vérifiez** les permissions de votre utilisateur dans Supabase

### **Si l'interface ne se met pas à jour :**

1. **Attendez** quelques minutes (cache de l'application)
2. **Redémarrez** votre application de développement
3. **Vérifiez** les variables d'environnement

## 🔄 **Scripts de Dépannage**

### **Script 1 : Diagnostic Détaillé**
```bash
# Fichier : scripts/diagnostic-prix-detaille.sql
# Utilisation : Vérifier l'état exact des prix
```

### **Script 2 : Correction Forcée**
```bash
# Fichier : scripts/correction-forcee-prix.sql
# Utilisation : Forcer la mise à jour de tous les prix
```

### **Script 3 : Vérification Rapide**
```sql
-- Vérification rapide des prix principaux
SELECT 
    key,
    value,
    CASE 
        WHEN key = 'pricing_service_babysitting' AND value = '20' THEN '✅'
        WHEN key = 'pricing_service_event_support' AND value = '25' THEN '✅'
        WHEN key = 'pricing_service_weekend_care' AND value = '20' THEN '✅'
        WHEN key = 'pricing_service_emergency_care' AND value = '40' THEN '✅'
        ELSE '❌'
    END as statut
FROM site_settings 
WHERE key LIKE 'pricing_service_%'
ORDER BY key;
```

## 📞 **Support**

Si le problème persiste après avoir suivi toutes les étapes :

1. **Sauvegardez** les résultats du diagnostic
2. **Notez** les erreurs éventuelles
3. **Contactez** l'équipe de développement avec :
   - Les résultats du diagnostic
   - Les erreurs rencontrées
   - Les étapes déjà tentées

## 🎯 **Résultat Attendu**

Après avoir suivi ce guide :
- ✅ Tous les prix alignés avec la page Services
- ✅ Interface de gestion des prix à jour
- ✅ Calculateur de prix fonctionnel
- ✅ Système de réservation cohérent
