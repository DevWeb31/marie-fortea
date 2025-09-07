-- Migration finale pour corriger définitivement le problème de durée
-- Date: 2025-01-17
-- Objectif: S'assurer que toutes les durées sont correctement calculées

-- 1. Vérifier que la fonction de calcul existe et fonctionne
DO $$
BEGIN
    -- Test de la fonction
    IF calculate_duration_hours_corrected('10:00'::TIME, '18:00'::TIME) != 8.0 THEN
        RAISE EXCEPTION 'La fonction calculate_duration_hours_corrected ne fonctionne pas correctement';
    END IF;
    
    RAISE NOTICE 'Fonction de calcul de durée validée';
END $$;

-- 2. Vérifier que la colonne duration_hours est bien GENERATED
DO $$
DECLARE
    is_generated BOOLEAN;
BEGIN
    SELECT is_generated 
    INTO is_generated
    FROM information_schema.columns 
    WHERE table_name = 'booking_requests' 
    AND column_name = 'duration_hours' 
    AND table_schema = 'public';
    
    IF NOT is_generated THEN
        RAISE EXCEPTION 'La colonne duration_hours n''est pas une colonne GENERATED';
    END IF;
    
    RAISE NOTICE 'Colonne duration_hours validée comme GENERATED';
END $$;

-- 3. Forcer la mise à jour de toutes les réservations existantes
-- En modifiant légèrement les heures, on force le recalcul de la colonne GENERATED
UPDATE booking_requests 
SET 
    start_time = start_time + INTERVAL '0 seconds',
    end_time = end_time + INTERVAL '0 seconds'
WHERE deleted_at IS NULL;

-- 4. Vérifier les résultats
SELECT 
    'Résultats finaux' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours IS NULL THEN 1 END) as null_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations,
    ROUND(AVG(duration_hours), 2) as avg_duration
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 5. Afficher quelques exemples pour vérification
SELECT 
    'Exemples de vérification' as verification,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    CASE 
        WHEN duration_hours IS NULL THEN '❌ NULL'
        WHEN duration_hours = 0 THEN '❌ ZERO'
        WHEN duration_hours > 0 THEN '✅ OK'
        ELSE '❌ PROBLEM'
    END as status
FROM booking_requests 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 3;

-- 6. Message de confirmation
SELECT 'Migration de correction des durées terminée avec succès' as final_status;
