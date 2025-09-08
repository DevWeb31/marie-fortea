-- Migration pour forcer le recalcul de toutes les durées
-- Date: 2025-01-17
-- Objectif: Forcer le recalcul de toutes les durées et vérifier les résultats

-- 1. Vérifier l'état actuel
SELECT 
    'État avant recalcul' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours IS NULL THEN 1 END) as null_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 2. Forcer le recalcul en modifiant légèrement les données
-- Cette méthode force PostgreSQL à recalculer la colonne GENERATED
UPDATE booking_requests 
SET 
    start_time = start_time + INTERVAL '0 milliseconds',
    end_time = end_time + INTERVAL '0 milliseconds',
    updated_at = NOW()
WHERE deleted_at IS NULL;

-- 3. Vérifier l'état après recalcul
SELECT 
    'État après recalcul' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours IS NULL THEN 1 END) as null_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 4. Afficher les 5 dernières réservations avec leurs durées
SELECT 
    'Dernières réservations avec durées' as info,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    CASE 
        WHEN duration_hours IS NULL THEN 'NULL'
        WHEN duration_hours = 0 THEN 'ZERO'
        WHEN duration_hours < 0 THEN 'NÉGATIF'
        WHEN duration_hours > 0 THEN 'OK'
        ELSE 'PROBLÈME'
    END as duration_status,
    created_at
FROM booking_requests 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 5;

-- 5. Tester la vue booking_requests_with_status
SELECT 
    'Test de la vue avec durées' as test,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    status_name
FROM booking_requests_with_status 
ORDER BY created_at DESC 
LIMIT 3;

-- 6. Vérifier que la fonction de calcul fonctionne toujours
SELECT 
    'Test de la fonction de calcul' as test,
    calculate_duration_hours_corrected('08:30'::TIME, '01:00'::TIME) as test_1,
    calculate_duration_hours_corrected('11:00'::TIME, '00:30'::TIME) as test_2,
    calculate_duration_hours_corrected('09:00'::TIME, '17:00'::TIME) as test_3;

-- Message final
SELECT 'Recalcul forcé des durées terminé - Vérifiez maintenant le frontend' as final_status;
