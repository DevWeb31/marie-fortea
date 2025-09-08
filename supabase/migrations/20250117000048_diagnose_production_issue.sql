-- Migration pour diagnostiquer le problème en production
-- Date: 2025-01-17
-- Objectif: Vérifier l'état actuel des colonnes et des vues

-- 1. Vérifier les colonnes existantes
SELECT 
    'Colonnes de durée existantes' as info,
    column_name,
    data_type,
    is_generated,
    generation_expression
FROM information_schema.columns 
WHERE table_name = 'booking_requests' 
AND column_name LIKE '%duration%'
AND table_schema = 'public'
ORDER BY column_name;

-- 2. Vérifier l'état des données dans la table principale
SELECT 
    'État des données dans booking_requests' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 3. Vérifier l'état des données dans la vue
SELECT 
    'État des données dans booking_requests_with_status' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests_with_status;

-- 4. Afficher quelques exemples de la table principale
SELECT 
    'Exemples de booking_requests' as examples,
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

-- 5. Afficher quelques exemples de la vue
SELECT 
    'Exemples de booking_requests_with_status' as examples,
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

-- 6. Vérifier si la colonne duration_hours_fixed existe
SELECT 
    'Test de la colonne duration_hours_fixed' as test,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours_fixed < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours_fixed > 0 THEN 1 END) as valid_durations
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 7. Afficher les exemples avec duration_hours_fixed
SELECT 
    'Exemples avec duration_hours_fixed' as examples,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours as old_duration,
    duration_hours_fixed as new_duration,
    CASE 
        WHEN duration_hours_fixed < 0 THEN '❌ NÉGATIF'
        WHEN duration_hours_fixed = 0 THEN '❌ ZERO'
        WHEN duration_hours_fixed > 0 THEN '✅ OK'
        ELSE '❌ PROBLÈME'
    END as status
FROM booking_requests 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 5;

-- Message final
SELECT 'Diagnostic terminé' as final_status;
