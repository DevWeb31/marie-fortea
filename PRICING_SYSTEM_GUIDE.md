# Guide du Système de Prix Dynamiques

## 🎯 Vue d'Ensemble

Le système de prix dynamiques permet de gérer et modifier les tarifs de vos services de garde d'enfants directement depuis le back office, avec synchronisation automatique sur le front-end.

## 🏗️ Architecture

### Composants Principaux

1. **`PricingService`** (`src/lib/pricing-service.ts`)
   - Service central pour la gestion des prix
   - Calculs automatiques et validation
   - Interface avec la base de données

2. **`PricingManagement`** (`src/pages/PricingManagement.tsx`)
   - Interface d'administration des prix
   - Calculateur en temps réel
   - Validation et sauvegarde

3. **`DynamicPricing`** (`src/components/DynamicPricing.tsx`)
   - Affichage public des prix
   - Synchronisation automatique
   - Fallback en cas d'erreur

4. **`usePricing`** (`src/hooks/use-pricing.ts`)
   - Hook React pour l'intégration
   - Cache intelligent
   - Actualisation automatique

## 📊 Structure des Prix

### Prix de Base
- **Prix horaire de base** : 15€/heure
- **Supplément par enfant** : +5€/heure (au-delà du premier)
- **Montant minimum** : 20€
- **Montant maximum** : 200€/jour

### Multiplicateurs par Service
- **Garde d'enfants** : ×1.0 (15€/heure)
- **Soutien événementiel** : ×1.2 (18€/heure)
- **Garde de nuit** : ×1.5 (22.50€/heure)
- **Garde de weekend** : ×1.3 (19.50€/heure)
- **Garde pendant les vacances** : ×1.4 (21€/heure)
- **Garde d'urgence** : ×1.8 (27€/heure)

## 🚀 Installation et Configuration

### 1. Initialisation des Prix
```bash
# Exécuter le script d'initialisation
./scripts/init-pricing.sh
```

### 2. Accès au Back Office
- Naviguez vers `/admin/pricing` dans votre application
- Ou ajoutez le lien dans votre menu d'administration

### 3. Configuration Initiale
1. Cliquez sur "Initialiser les prix par défaut"
2. Vérifiez les valeurs dans le calculateur
3. Sauvegardez la configuration

## 💻 Utilisation du Back Office

### Interface de Gestion

#### Prix de Base
- **Prix de base par heure** : Tarif horaire standard
- **Supplément par enfant** : Coût additionnel par enfant supplémentaire
- **Montant minimum** : Seuil minimum de réservation
- **Montant maximum** : Plafond quotidien

#### Multiplicateurs par Service
- Modifiez les multiplicateurs pour chaque type de service
- Les prix se calculent automatiquement (prix de base × multiplicateur)
- Validation en temps réel

#### Calculateur de Prix
- Testez vos tarifs avec différents paramètres
- Voir le détail du calcul
- Validation avant sauvegarde

### Fonctionnalités
- ✅ **Sauvegarde automatique** : Changements appliqués immédiatement
- ✅ **Validation en temps réel** : Vérification des montants
- ✅ **Calculateur intégré** : Test des tarifs
- ✅ **Historique** : Traçabilité des modifications

## 🎨 Intégration Front-End

### Utilisation du Composant DynamicPricing

```tsx
import DynamicPricing from '@/components/DynamicPricing';

// Affichage complet
<DynamicPricing showDetails={true} />

// Affichage simplifié
<DynamicPricing showDetails={false} />
```

### Utilisation du Hook usePricing

```tsx
import { usePricing } from '@/hooks/use-pricing';

const MyComponent = () => {
  const { pricing, loading, error, calculatePrice, refresh } = usePricing();

  const handlePriceCalculation = async () => {
    const price = await calculatePrice('babysitting', 2, 1);
    console.log('Prix calculé:', price);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <p>Prix de base: {pricing.baseRate}€/heure</p>
      <button onClick={handlePriceCalculation}>Calculer</button>
    </div>
  );
};
```

## 🔄 Synchronisation

### Mécanisme de Synchronisation
- **Actualisation automatique** : Toutes les 5 minutes
- **Cache intelligent** : Évite les requêtes inutiles
- **Fallback robuste** : Prix par défaut en cas d'erreur
- **Propagation instantanée** : Changements appliqués immédiatement

### Gestion des Erreurs
- **Erreur de chargement** : Affichage des prix par défaut
- **Erreur de calcul** : Fallback vers calcul simple
- **Erreur de sauvegarde** : Notification utilisateur
- **Validation** : Vérification des montants avant sauvegarde

## 📈 Formules de Calcul

### Prix de Base
```
Prix de base = Prix horaire de base × Durée
```

### Supplément Enfants
```
Supplément = Nombre d'enfants supplémentaires × Supplément par enfant × Durée
```

### Multiplicateur Service
```
Prix service = Prix de base × Multiplicateur du service
```

### Prix Total
```
Prix total = Prix de base + Supplément enfants + (Prix de base × (Multiplicateur - 1))
Prix final = MAX(Montant minimum, MIN(Prix total, Montant maximum))
```

## 🛠️ Maintenance

### Sauvegarde des Données
- Les prix sont stockés dans `site_settings`
- Clés préfixées par `pricing_`
- Sauvegarde automatique avec Supabase

### Monitoring
- Logs de calcul dans la console
- Traçabilité des modifications
- Alertes en cas d'erreur

### Mise à Jour
- Modifications via l'interface d'administration
- Pas de redéploiement nécessaire
- Changements appliqués immédiatement

## 🎯 Avantages

### Pour l'Administrateur
- ✅ **Flexibilité totale** : Modification des prix sans code
- ✅ **Calculs automatiques** : Pas d'erreur de calcul
- ✅ **Test en temps réel** : Vérification avant application
- ✅ **Historique** : Traçabilité des changements

### Pour l'Utilisateur
- ✅ **Transparence** : Prix clairs et détaillés
- ✅ **Calculs précis** : Estimation exacte du coût
- ✅ **Mise à jour automatique** : Prix toujours à jour
- ✅ **Interface intuitive** : Compréhension facile

## 🔧 Dépannage

### Problèmes Courants

#### Prix ne se mettent pas à jour
1. Vérifiez la connexion à la base de données
2. Actualisez la page d'administration
3. Vérifiez les logs de la console

#### Erreur de calcul
1. Vérifiez les valeurs dans la configuration
2. Utilisez le calculateur intégré
3. Vérifiez les logs d'erreur

#### Synchronisation lente
1. Vérifiez la connexion internet
2. Actualisez manuellement avec le bouton "Actualiser"
3. Vérifiez les paramètres de cache

### Logs Utiles
```javascript
// Vérifier la configuration
console.log('Configuration des prix:', await PricingService.getPricingConfig());

// Tester un calcul
console.log('Calcul de prix:', await PricingService.calculatePrice('babysitting', 2, 1));

// Vérifier les prix publics
console.log('Prix publics:', await PricingService.getPublicPricing());
```

## 📚 Ressources

- **Documentation API** : `src/lib/pricing-service.ts`
- **Interface d'administration** : `src/pages/PricingManagement.tsx`
- **Composant public** : `src/components/DynamicPricing.tsx`
- **Hook React** : `src/hooks/use-pricing.ts`
- **Scripts** : `scripts/init-pricing.sh`

---

**Note** : Ce système est conçu pour être robuste et fiable. En cas de problème, les prix par défaut sont toujours utilisés pour assurer le fonctionnement du site.
