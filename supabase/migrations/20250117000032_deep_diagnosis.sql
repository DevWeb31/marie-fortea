-- Migration pour diagnostiquer en profondeur le problème de durée en production
-- Date: 2025-01-17
-- Objectif: Comprendre pourquoi la durée ne s'affiche pas côté frontend

-- 1. Vérifier la structure exacte de la table
SELECT 
    'Structure de la table booking_requests' as info,
    column_name,
    data_type,
    is_nullable,
    column_default,
    is_generated
FROM information_schema.columns 
WHERE table_name = 'booking_requests' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Vérifier les données brutes
SELECT 
    'Données brutes de booking_requests' as info,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    created_at
FROM booking_requests 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Vérifier la vue booking_requests_with_status
SELECT 
    'Données de la vue booking_requests_with_status' as info,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    status_name
FROM booking_requests_with_status 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Vérifier la vue active_booking_requests
SELECT 
    'Données de la vue active_booking_requests' as info,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours
FROM active_booking_requests 
ORDER BY created_at DESC 
LIMIT 5;

-- 5. Tester manuellement le calcul de durée
SELECT 
    'Test manuel du calcul' as info,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours as db_duration,
    calculate_duration_hours_corrected(start_time, end_time) as calculated_duration
FROM booking_requests 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 3;

-- 6. Vérifier si la colonne est vraiment GENERATED
SELECT 
    'Vérification de la colonne GENERATED' as info,
    column_name,
    is_generated,
    generation_expression
FROM information_schema.columns 
WHERE table_name = 'booking_requests' 
AND column_name = 'duration_hours'
AND table_schema = 'public';

-- 7. Forcer un recalcul complet
UPDATE booking_requests 
SET 
    start_time = start_time,
    end_time = end_time,
    updated_at = NOW()
WHERE deleted_at IS NULL;

-- 8. Vérifier les résultats après recalcul
SELECT 
    'Résultats après recalcul forcé' as info,
    COUNT(*) as total,
    COUNT(CASE WHEN duration_hours IS NULL THEN 1 END) as null_count,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_count,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as positive_count,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_count
FROM booking_requests 
WHERE deleted_at IS NULL;
