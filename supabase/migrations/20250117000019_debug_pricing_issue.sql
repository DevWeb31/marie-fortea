-- Migration pour diagnostiquer le problème de prix
-- Date: 2025-01-17
-- Objectif: Vérifier les données de prix dans la base

-- Vérifier les paramètres de prix
SELECT '=== PARAMÈTRES DE PRIX ===' as info;
SELECT key, value FROM site_settings WHERE key LIKE 'pricing%' ORDER BY key;

-- Vérifier les réservations récentes
SELECT '=== RÉSERVATIONS RÉCENTES ===' as info;
SELECT 
    id,
    parent_name,
    service_type,
    start_time,
    end_time,
    duration_hours,
    children_count,
    estimated_total,
    created_at
FROM booking_requests 
ORDER BY created_at DESC 
LIMIT 5;

-- Vérifier la fonction de calcul de durée
SELECT '=== TEST FONCTION DURÉE ===' as info;
SELECT 
    '09:00' as start_time,
    '17:30' as end_time,
    calculate_duration_hours_corrected('09:00'::TIME, '17:30'::TIME) as calculated_duration;

-- Vérifier la vue booking_requests_with_status
SELECT '=== VUE AVEC STATUT ===' as info;
SELECT 
    id,
    parent_name,
    service_type,
    duration_hours,
    estimated_total,
    service_name,
    base_price
FROM booking_requests_with_status 
ORDER BY created_at DESC 
LIMIT 3;
