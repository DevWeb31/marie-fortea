-- Migration pour forcer la mise à jour de la colonne duration_hours
-- Date: 2025-01-17
-- Objectif: Forcer la mise à jour de duration_hours avec les bonnes valeurs

-- 1. Vérifier l'état avant mise à jour
SELECT 
    'État avant mise à jour' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 2. Afficher les exemples problématiques
SELECT 
    'Exemples problématiques avant mise à jour' as examples,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    calculate_duration_hours_corrected(start_time, end_time) as calculated_duration
FROM booking_requests 
WHERE deleted_at IS NULL 
AND duration_hours < 0
ORDER BY created_at DESC 
LIMIT 5;

-- 3. SOLUTION: Forcer la mise à jour en modifiant start_time et end_time
-- Cela va déclencher le recalcul de la colonne GENERATED
UPDATE booking_requests 
SET 
    start_time = start_time + INTERVAL '0 milliseconds',
    end_time = end_time + INTERVAL '0 milliseconds'
WHERE deleted_at IS NULL 
AND duration_hours < 0;

-- 4. Vérifier l'état après mise à jour
SELECT 
    'État après mise à jour' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 5. Afficher les exemples après mise à jour
SELECT 
    'Exemples après mise à jour' as examples,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    CASE 
        WHEN duration_hours < 0 THEN '❌ NÉGATIF'
        WHEN duration_hours = 0 THEN '❌ ZERO'
        WHEN duration_hours > 0 THEN '✅ OK'
        ELSE '❌ PROBLÈME'
    END as status
FROM booking_requests 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 5;

-- 6. Vérifier la vue booking_requests_with_status
SELECT 
    'État de la vue booking_requests_with_status' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests_with_status;

-- 7. Afficher les exemples de la vue
SELECT 
    'Exemples de la vue après mise à jour' as examples,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    CASE 
        WHEN duration_hours < 0 THEN '❌ NÉGATIF'
        WHEN duration_hours = 0 THEN '❌ ZERO'
        WHEN duration_hours > 0 THEN '✅ OK'
        ELSE '❌ PROBLÈME'
    END as status
FROM booking_requests_with_status 
ORDER BY created_at DESC 
LIMIT 5;

-- Message final
SELECT 'Mise à jour forcée de duration_hours terminée' as final_status;
