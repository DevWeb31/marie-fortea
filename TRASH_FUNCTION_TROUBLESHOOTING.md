# 🗑️ Dépannage : Fonction "Mettre à la Corbeille" Ne Fonctionne Plus

## 🚨 Problème Identifié

La fonction "mettre à la corbeille" ne fonctionne plus dans votre composant `BookingRequestsList.tsx` après les modifications apportées au système de statuts.

## 🔍 Diagnostic Automatique

### **Composant de Test Créé**
J'ai créé un composant `TrashFunctionTest.tsx` qui diagnostique automatiquement tous les problèmes possibles :

```typescript
// Utilisez ce composant pour diagnostiquer
import TrashFunctionTest from './TrashFunctionTest';

// Dans votre page de test
<TrashFunctionTest />
```

### **Tests Automatiques Inclus**
1. **Connexion Supabase** : Vérifie l'accessibilité de la base de données
2. **Vues de Base de Données** : Vérifie que les vues `trashed_booking_requests` et `archived_booking_requests` existent
3. **Fonctions RPC** : Vérifie que les fonctions `soft_delete_booking_request` et `restore_booking_request` sont disponibles
4. **Service BookingService** : Teste les méthodes de récupération des réservations supprimées/archivées
5. **Structure de Table** : Vérifie que les champs `deleted_at` et `archived_at` existent

## 🐛 Causes Possibles

### **1. Migrations Non Appliquées**
Les migrations Supabase ne sont pas appliquées à votre base de données.

**Solution :**
```bash
# Vérifier le statut des migrations
supabase db diff

# Appliquer les migrations
supabase db push

# Ou réinitialiser complètement
supabase db reset
```

### **2. Vues de Base de Données Manquantes**
Les vues `trashed_booking_requests` et `archived_booking_requests` n'existent pas.

**Vérification :**
```sql
-- Vérifier que les vues existent
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name IN ('trashed_booking_requests', 'archived_booking_requests');
```

**Création manuelle si nécessaire :**
```sql
-- Vue pour les réservations supprimées
CREATE OR REPLACE VIEW trashed_booking_requests AS
SELECT * FROM booking_requests 
WHERE deleted_at IS NOT NULL;

-- Vue pour les réservations archivées
CREATE OR REPLACE VIEW archived_booking_requests AS
SELECT * FROM booking_requests 
WHERE deleted_at IS NULL AND archived_at IS NOT NULL;
```

### **3. Fonctions RPC Manquantes**
Les fonctions `soft_delete_booking_request`, `restore_booking_request`, etc. ne sont pas disponibles.

**Vérification :**
```sql
-- Vérifier que les fonctions existent
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%booking_request%';
```

**Création manuelle si nécessaire :**
```sql
-- Fonction pour mettre à la corbeille
CREATE OR REPLACE FUNCTION soft_delete_booking_request(booking_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE booking_requests 
    SET deleted_at = NOW() 
    WHERE id = booking_id AND deleted_at IS NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour restaurer
CREATE OR REPLACE FUNCTION restore_booking_request(booking_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE booking_requests 
    SET deleted_at = NULL 
    WHERE id = booking_id AND deleted_at IS NOT NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
```

### **4. Champs de Table Manquants**
Les champs `deleted_at` et `archived_at` n'existent pas dans la table `booking_requests`.

**Vérification :**
```sql
-- Vérifier la structure de la table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'booking_requests' 
AND column_name IN ('deleted_at', 'archived_at');
```

**Ajout manuel si nécessaire :**
```sql
-- Ajouter le champ deleted_at
ALTER TABLE booking_requests 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Ajouter le champ archived_at
ALTER TABLE booking_requests 
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Créer les index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_booking_requests_deleted_at 
ON booking_requests(deleted_at) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_booking_requests_archived_at 
ON booking_requests(archived_at) 
WHERE archived_at IS NULL;
```

### **5. Problèmes de Permissions**
Les permissions RLS (Row Level Security) bloquent l'accès aux vues ou fonctions.

**Vérification :**
```sql
-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename LIKE '%booking%';
```

**Solution :**
```sql
-- Désactiver temporairement RLS pour les tests
ALTER TABLE booking_requests DISABLE ROW LEVEL SECURITY;

-- Ou créer des politiques appropriées
CREATE POLICY "Enable read access for all users" ON booking_requests
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON booking_requests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## 🛠️ Solutions Pas à Pas

### **Étape 1 : Diagnostic Automatique**
1. Intégrez le composant `TrashFunctionTest` dans votre application
2. Lancez tous les tests automatiquement
3. Notez les erreurs spécifiques qui apparaissent

### **Étape 2 : Appliquer les Migrations**
```bash
# Dans votre terminal
cd supabase
supabase db push
```

### **Étape 3 : Vérifier la Base de Données**
```bash
# Vérifier que les migrations sont appliquées
supabase db diff

# Vérifier le statut
supabase status
```

### **Étape 4 : Test Manuel des Fonctions**
```sql
-- Tester la fonction de mise à la corbeille
SELECT soft_delete_booking_request('00000000-0000-0000-0000-000000000000');

-- Tester la fonction de restauration
SELECT restore_booking_request('00000000-0000-0000-0000-000000000000');

-- Vérifier les vues
SELECT * FROM trashed_booking_requests LIMIT 1;
SELECT * FROM archived_booking_requests LIMIT 1;
```

### **Étape 5 : Vérifier les Logs**
```bash
# Vérifier les logs Supabase
supabase logs

# Ou dans le dashboard Supabase
# Database > Logs
```

## 🔧 Corrections de Code

### **Si les Migrations Ne Peuvent Pas Être Appliquées**

Vous pouvez créer une version simplifiée qui fonctionne sans les vues :

```typescript
// Version simplifiée de moveToTrash
const handleMoveToTrash = async (id: string) => {
  try {
    // Mise à jour directe de la table
    const { error } = await supabase
      .from('booking_requests')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Réservation supprimée',
      description: 'La réservation a été mise dans la corbeille',
      variant: 'default',
    });

    await loadRequests();
  } catch (error) {
    toast({
      title: 'Erreur',
      description: 'Erreur lors de la mise en corbeille',
      variant: 'destructive',
    });
  }
};

// Version simplifiée de loadDeletedRequests
const loadDeletedRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('booking_requests')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setDeletedRequests(data || []);
  } catch (error) {
    toast({
      title: 'Erreur',
      description: 'Erreur lors du chargement des réservations supprimées',
      variant: 'destructive',
    });
  }
};
```

## 📋 Checklist de Vérification

- [ ] **Composant de test** : `TrashFunctionTest` s'affiche et fonctionne
- [ ] **Connexion Supabase** : Accessible et fonctionnelle
- [ ] **Migrations appliquées** : `supabase db diff` ne montre pas d'erreurs
- [ ] **Vues existent** : `trashed_booking_requests` et `archived_booking_requests` sont créées
- [ ] **Fonctions RPC** : `soft_delete_booking_request` et `restore_booking_request` sont disponibles
- [ ] **Champs de table** : `deleted_at` et `archived_at` existent dans `booking_requests`
- [ ] **Permissions** : RLS n'empêche pas l'accès aux fonctions
- [ ] **Tests automatiques** : Tous les tests passent sans erreur

## 🆘 Support et Aide

### **Si le Problème Persiste**
1. Exécutez le composant `TrashFunctionTest`
2. Copiez les résultats d'erreur
3. Vérifiez que toutes les migrations sont appliquées
4. Testez manuellement les fonctions SQL

### **Ressources Utiles**
- **Composant de test** : `src/components/TrashFunctionTest.tsx`
- **Migrations Supabase** : `supabase/migrations/`
- **Service de réservation** : `src/lib/booking-service.ts`
- **Documentation Supabase** : [supabase.com/docs](https://supabase.com/docs)

---

**Dernière mise à jour** : Janvier 2025  
**Statut** : 🔍 Problème identifié, diagnostic créé  
**Prochaine étape** : Utiliser le composant de test pour identifier la cause exacte
