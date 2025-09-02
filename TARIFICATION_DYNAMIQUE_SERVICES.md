# 🎯 Système de Tarification Dynamique - Page Services

## 📋 Vue d'ensemble

La page Services utilise maintenant un système de tarification **100% dynamique** qui récupère tous les prix depuis la base de données Supabase via la table `site_settings`.

## 🔧 Fonctionnement

### 1. **Chargement des données**
- La page appelle `PricingService.getPublicPricing()` au chargement
- Les données sont récupérées depuis `site_settings` avec les clés `pricing_*`
- En cas d'erreur, fallback vers les prix par défaut

### 2. **Structure des données**
```typescript
{
  additionalChildRate: 5,
  services: [
    {
      type: 'babysitting',
      name: 'Garde d\'enfants',
      price: 20,
      nightPrice: null,
      hasNightPrice: false
    },
    // ... autres services
  ],
  lastUpdated: Date
}
```

### 3. **Affichage dynamique**
- **Tarifs de jour** : `${service.price}€/heure`
- **Tarifs de nuit** : `${service.nightPrice}€/heure` (si disponible)
- **Majoration enfants** : `${additionalChildRate}€` par enfant
- **Notes** : Affichage conditionnel selon la configuration

## 🗄️ Paramètres de base de données

### **Prix de base**
- `pricing_service_babysitting` : 20€/h
- `pricing_service_event_support` : 25€/h
- `pricing_service_evening_care` : 20€/h
- `pricing_service_emergency_care` : 40€/h

### **Tarifs de nuit**
- `pricing_service_event_support_night` : 30€/h
- `pricing_service_evening_care_night` : 25€/h

### **Configuration nuit**
- `pricing_service_event_support_has_night` : true
- `pricing_service_evening_care_has_night` : true
- `pricing_service_babysitting_has_night` : false
- `pricing_service_emergency_care_has_night` : false

### **Supplément enfants**
- `pricing_additional_child_rate` : 5€

## 🚀 Initialisation

### **Étape 1 : Exécuter le script**
1. Allez dans **Supabase Dashboard** → **SQL Editor**
2. Créez une nouvelle requête
3. Copiez le contenu de `scripts/init-pricing-settings.sql`
4. Exécutez le script

### **Étape 2 : Vérification**
```sql
SELECT key, value, updated_at 
FROM public.site_settings 
WHERE key LIKE 'pricing_%' 
ORDER BY key;
```

## 🎨 Interface d'administration

### **Modification des prix**
1. Accédez à l'interface d'administration
2. Section "Tarification"
3. Modifiez les prix souhaités
4. Sauvegardez → Mise à jour automatique de la page Services

### **Exemple de modification**
```sql
-- Changer le prix de garde d'enfants
UPDATE public.site_settings 
SET value = '22', updated_at = NOW() 
WHERE key = 'pricing_service_babysitting';

-- Changer le supplément par enfant
UPDATE public.site_settings 
SET value = '7', updated_at = NOW() 
WHERE key = 'pricing_additional_child_rate';
```

## 🔄 Mise à jour en temps réel

### **Comportement**
- ✅ Chargement automatique au refresh de la page
- ✅ Fallback vers les prix par défaut en cas d'erreur
- ✅ Affichage de l'état de chargement
- ✅ Gestion des erreurs avec console.log

### **Optimisations**
- ✅ Cache des données côté client
- ✅ Requête unique pour tous les prix
- ✅ Structure de données optimisée

## 📱 Responsive Design

### **Affichage des tarifs**
- **Desktop** : Tarifs côte à côte avec icônes
- **Mobile** : Tarifs empilés avec espacement adapté
- **Dark mode** : Couleurs adaptées automatiquement

### **Composants dynamiques**
- `PricingDisplay` : Affichage conditionnel jour/nuit
- `AnimatedCard` : Animations fluides
- `HarmoniousButton` : Style cohérent

## 🛠️ Dépannage

### **Problème : Prix non mis à jour**
```bash
# Vérifier les paramètres
SELECT * FROM site_settings WHERE key LIKE 'pricing_%';

# Réinitialiser si nécessaire
DELETE FROM site_settings WHERE key LIKE 'pricing_%';
# Puis exécuter init-pricing-settings.sql
```

### **Problème : Erreur de chargement**
```javascript
// Vérifier dans la console
console.log('Pricing data:', pricingData);
console.log('Services:', services);
```

### **Problème : Affichage incorrect**
- Vérifier la structure des données retournées
- Contrôler les clés de mapping dans `serviceMapping`
- Vérifier les valeurs null/undefined

## 🎯 Avantages du système

### **Flexibilité**
- ✅ Modification des prix sans redéploiement
- ✅ Configuration fine par type de service
- ✅ Gestion des tarifs de nuit
- ✅ Supplément enfants personnalisable

### **Maintenance**
- ✅ Interface d'administration intégrée
- ✅ Historique des modifications
- ✅ Validation des données
- ✅ Fallback sécurisé

### **Performance**
- ✅ Chargement optimisé
- ✅ Cache intelligent
- ✅ Requêtes minimales
- ✅ Affichage progressif

---

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs de la console
2. Contrôlez les paramètres en base
3. Testez avec les prix par défaut
4. Consultez la documentation technique
