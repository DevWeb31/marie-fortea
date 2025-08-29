# 🚀 Guide de Test Rapide : Fonction "Mettre à la Corbeille"

## ✅ **Migrations Appliquées avec Succès !**

Toutes les migrations Supabase ont été appliquées et testées. La fonction "mettre à la corbeille" devrait maintenant fonctionner correctement.

## 🔍 **Test Immédiat**

### **Option 1 : Page de Test Dédiée**
1. Naviguez vers `/TrashTestPage` dans votre application
2. Utilisez le composant `TrashFunctionTest` pour diagnostiquer automatiquement
3. Lancez tous les tests pour vérifier que tout fonctionne

### **Option 2 : Test Direct dans l'Application**
1. Retournez à votre composant `BookingRequestsList`
2. Essayez de mettre une réservation à la corbeille
3. Vérifiez que la réservation disparaît de la liste principale
4. Vérifiez qu'elle apparaît dans l'onglet "Corbeille"

## 🧪 **Tests à Effectuer**

### **Test 1 : Mise à la Corbeille**
- [ ] Sélectionnez une réservation existante
- [ ] Cliquez sur "Mettre à la corbeille"
- [ ] Confirmez l'action
- [ ] Vérifiez que la réservation disparaît de la liste principale
- [ ] Vérifiez qu'elle apparaît dans l'onglet "Corbeille"

### **Test 2 : Restauration depuis la Corbeille**
- [ ] Allez dans l'onglet "Corbeille"
- [ ] Sélectionnez une réservation supprimée
- [ ] Cliquez sur "Restaurer"
- [ ] Vérifiez qu'elle réapparaît dans la liste principale
- [ ] Vérifiez qu'elle disparaît de la corbeille

### **Test 3 : Archivage**
- [ ] Sélectionnez une réservation active
- [ ] Cliquez sur "Archiver"
- [ ] Vérifiez qu'elle apparaît dans l'onglet "Archivées"
- [ ] Vérifiez qu'elle disparaît de la liste principale

### **Test 4 : Désarchivage**
- [ ] Allez dans l'onglet "Archivées"
- [ ] Sélectionnez une réservation archivée
- [ ] Cliquez sur "Désarchiver"
- [ ] Vérifiez qu'elle réapparaît dans la liste principale

## 🔧 **Si Ça Ne Fonctionne Toujours Pas**

### **Vérifications Immédiates**
1. **Console du navigateur** : Vérifiez s'il y a des erreurs JavaScript
2. **Réseau** : Vérifiez que les appels API vers Supabase fonctionnent
3. **Base de données** : Vérifiez que Supabase est en cours d'exécution

### **Diagnostic Automatique**
Utilisez le composant `TrashFunctionTest` qui :
- Teste la connexion Supabase
- Vérifie les vues de base de données
- Teste les fonctions RPC
- Vérifie le service BookingService
- Analyse la structure de la table

### **Logs Supabase**
```bash
# Vérifier les logs en temps réel
supabase logs

# Vérifier le statut
supabase status
```

## 📊 **Résultats Attendus**

Après l'application des migrations, vous devriez voir :

- ✅ **Connexion Supabase** : Fonctionnelle
- ✅ **Vues créées** : `trashed_booking_requests`, `archived_booking_requests`
- ✅ **Fonctions RPC** : `soft_delete_booking_request`, `restore_booking_request`, etc.
- ✅ **Champs de table** : `deleted_at`, `archived_at`, `status_id` présents
- ✅ **Service fonctionnel** : Méthodes de récupération opérationnelles

## 🎯 **Prochaines Étapes**

1. **Testez immédiatement** la fonction "mettre à la corbeille"
2. **Vérifiez tous les onglets** (Actives, Archivées, Corbeille)
3. **Testez les fonctions inverses** (restaurer, désarchiver)
4. **Intégrez le composant de test** dans votre application pour le diagnostic futur

## 🆘 **Support**

Si vous rencontrez encore des problèmes :
- Consultez `TRASH_FUNCTION_TROUBLESHOOTING.md`
- Utilisez le composant `TrashFunctionTest`
- Vérifiez que toutes les migrations sont appliquées
- Testez manuellement les fonctions SQL si nécessaire

---

**Statut** : ✅ Migrations appliquées, prêt pour les tests  
**Dernière mise à jour** : Janvier 2025
