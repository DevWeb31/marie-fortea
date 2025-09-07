-- Migration pour corriger définitivement le problème de prix
-- Date: 2025-01-17
-- Objectif: Calculer et mettre à jour tous les prix manquants

-- Mettre à jour toutes les réservations qui ont un prix à 0
UPDATE booking_requests 
SET estimated_total = (
    CASE 
        WHEN service_type = 'babysitting' THEN duration_hours * 15
        WHEN service_type = 'event_support' THEN duration_hours * 18
        WHEN service_type = 'evening_care' THEN duration_hours * 20
        WHEN service_type = 'emergency_care' THEN duration_hours * 27
        ELSE duration_hours * 15
    END
) + (
    -- Supplément pour enfants supplémentaires (à partir du 3ème enfant)
    CASE 
        WHEN children_count > 2 THEN (children_count - 2) * 5 * duration_hours
        ELSE 0
    END
)
WHERE estimated_total = 0 OR estimated_total IS NULL;

-- Vérifier les résultats
SELECT '=== RÉSERVATIONS MISE À JOUR ===' as info;
SELECT 
    id,
    parent_name,
    service_type,
    duration_hours,
    children_count,
    estimated_total,
    created_at
FROM booking_requests 
ORDER BY created_at DESC 
LIMIT 10;

-- Créer une fonction pour calculer le prix automatiquement
CREATE OR REPLACE FUNCTION calculate_estimated_total()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculer le prix basé sur le type de service et la durée
    NEW.estimated_total := (
        CASE 
            WHEN NEW.service_type = 'babysitting' THEN NEW.duration_hours * 15
            WHEN NEW.service_type = 'event_support' THEN NEW.duration_hours * 18
            WHEN NEW.service_type = 'evening_care' THEN NEW.duration_hours * 20
            WHEN NEW.service_type = 'emergency_care' THEN NEW.duration_hours * 27
            ELSE NEW.duration_hours * 15
        END
    ) + (
        -- Supplément pour enfants supplémentaires (à partir du 3ème enfant)
        CASE 
            WHEN NEW.children_count > 2 THEN (NEW.children_count - 2) * 5 * NEW.duration_hours
            ELSE 0
        END
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour calculer automatiquement le prix
DROP TRIGGER IF EXISTS trigger_calculate_estimated_total ON booking_requests;
CREATE TRIGGER trigger_calculate_estimated_total
    BEFORE INSERT OR UPDATE ON booking_requests
    FOR EACH ROW
    EXECUTE FUNCTION calculate_estimated_total();

-- Tester le trigger avec une mise à jour (forcer le recalcul)
UPDATE booking_requests 
SET estimated_total = estimated_total 
WHERE id IN (SELECT id FROM booking_requests LIMIT 1);

-- Vérifier que le trigger fonctionne
SELECT '=== TEST DU TRIGGER ===' as info;
SELECT 
    id,
    service_type,
    duration_hours,
    children_count,
    estimated_total
FROM booking_requests 
ORDER BY created_at DESC 
LIMIT 3;
