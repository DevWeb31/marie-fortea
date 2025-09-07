-- Migration de test pour vérifier que le problème de durée est résolu
-- Date: 2025-01-17
-- Objectif: Vérifier les résultats après correction

-- 1. Vérifier les durées existantes
SELECT 
    'Résultats après correction' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours IS NULL THEN 1 END) as null_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations,
    ROUND(AVG(duration_hours), 2) as avg_duration
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 2. Afficher quelques exemples de réservations avec leurs durées
SELECT 
    'Exemples de réservations corrigées' as examples,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    CASE 
        WHEN duration_hours IS NULL THEN 'NULL'
        WHEN duration_hours = 0 THEN 'ZERO'
        WHEN duration_hours > 0 THEN 'OK'
        ELSE 'PROBLEM'
    END as duration_status
FROM booking_requests 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Vérifier la vue booking_requests_with_status
SELECT 
    'Vue booking_requests_with_status' as view_info,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours IS NULL THEN 1 END) as null_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests_with_status;

-- 4. Message de confirmation
SELECT 'Test de correction des durées terminé - Vérifiez les résultats ci-dessus' as final_status;
