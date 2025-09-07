-- Script de test pour vérifier le calcul de durée
-- À exécuter en production pour diagnostiquer le problème

-- 1. Tester la fonction de calcul de durée
SELECT 
    'Test de la fonction calculate_duration_hours_corrected' as test_name,
    calculate_duration_hours_corrected('10:00'::TIME, '18:00'::TIME) as test_1_10h_18h,
    calculate_duration_hours_corrected('20:00'::TIME, '02:00'::TIME) as test_2_20h_2h,
    calculate_duration_hours_corrected('10:30'::TIME, '15:30'::TIME) as test_3_10h30_15h30,
    calculate_duration_hours_corrected('22:00'::TIME, '06:00'::TIME) as test_4_22h_6h;

-- 2. Vérifier la structure de la table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    is_generated
FROM information_schema.columns 
WHERE table_name = 'booking_requests' 
AND column_name = 'duration_hours'
AND table_schema = 'public';

-- 3. Vérifier les données existantes
SELECT 
    'Analyse des durées existantes' as analysis,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours IS NULL THEN 1 END) as null_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations,
    MIN(duration_hours) as min_duration,
    MAX(duration_hours) as max_duration,
    ROUND(AVG(duration_hours), 2) as avg_duration
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 4. Afficher les 10 dernières réservations avec leurs durées
SELECT 
    'Dernières réservations' as info,
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
    END as duration_status,
    created_at
FROM booking_requests 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 10;

-- 5. Vérifier la vue booking_requests_with_status
SELECT 
    'Vue booking_requests_with_status' as view_info,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours IS NULL THEN 1 END) as null_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests_with_status;

-- 6. Test de la vue avec quelques exemples
SELECT 
    'Exemples de la vue' as examples,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    status_name
FROM booking_requests_with_status 
ORDER BY created_at DESC 
LIMIT 5;
