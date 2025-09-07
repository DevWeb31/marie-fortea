-- Migration pour diagnostiquer et corriger le problème de durée en production
-- Date: 2025-01-17
-- Objectif: Diagnostiquer pourquoi la durée affiche 0h en production

-- 1. Vérifier la fonction de calcul de durée
SELECT 
    'Test de la fonction calculate_duration_hours_corrected' as test_name,
    calculate_duration_hours_corrected('10:00'::TIME, '18:00'::TIME) as test_1_10h_18h,
    calculate_duration_hours_corrected('20:00'::TIME, '02:00'::TIME) as test_2_20h_2h,
    calculate_duration_hours_corrected('10:30'::TIME, '15:30'::TIME) as test_3_10h30_15h30;

-- 2. Vérifier les données existantes
SELECT 
    'Analyse des durées existantes' as analysis,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours IS NULL THEN 1 END) as null_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations,
    MIN(duration_hours) as min_duration,
    MAX(duration_hours) as max_duration,
    AVG(duration_hours) as avg_duration
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 3. Afficher quelques exemples de réservations avec leurs durées
SELECT 
    'Exemples de réservations' as examples,
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

-- 4. Forcer la mise à jour des durées pour toutes les réservations
-- Cette requête va déclencher le recalcul de la colonne GENERATED
UPDATE booking_requests 
SET 
    start_time = start_time,
    end_time = end_time,
    updated_at = NOW()
WHERE deleted_at IS NULL;

-- 5. Vérifier les résultats après mise à jour
SELECT 
    'Résultats après mise à jour' as results,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours IS NULL THEN 1 END) as null_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests 
WHERE deleted_at IS NULL;
