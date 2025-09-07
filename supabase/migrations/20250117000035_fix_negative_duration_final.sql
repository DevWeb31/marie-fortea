-- Migration finale pour corriger les durées négatives
-- Date: 2025-01-17
-- Objectif: Corriger définitivement le calcul de durée qui retourne des valeurs négatives

-- 1. Vérifier l'état actuel
SELECT 
    'État avant correction finale' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 2. Afficher les exemples de durées négatives
SELECT 
    'Exemples de durées négatives' as examples,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours
FROM booking_requests 
WHERE deleted_at IS NULL 
AND duration_hours < 0
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Recréer la fonction de calcul de durée avec une approche plus robuste
CREATE OR REPLACE FUNCTION calculate_duration_hours_corrected(start_time TIME, end_time TIME)
RETURNS DECIMAL(4,2) AS $$
DECLARE
    duration_hours DECIMAL(4,2);
    start_minutes INTEGER;
    end_minutes INTEGER;
    total_minutes INTEGER;
BEGIN
    -- Convertir les heures en minutes depuis minuit
    start_minutes := EXTRACT(HOUR FROM start_time) * 60 + EXTRACT(MINUTE FROM start_time);
    end_minutes := EXTRACT(HOUR FROM end_time) * 60 + EXTRACT(MINUTE FROM end_time);
    
    -- Si l'heure de fin est avant l'heure de début, c'est le lendemain
    IF end_minutes <= start_minutes THEN
        -- Ajouter 24 heures (1440 minutes) pour le passage à minuit
        total_minutes := (1440 - start_minutes) + end_minutes;
    ELSE
        -- Même jour
        total_minutes := end_minutes - start_minutes;
    END IF;
    
    -- Convertir en heures décimales
    duration_hours := total_minutes / 60.0;
    
    -- S'assurer que la durée est positive et au minimum 0.5 heures
    IF duration_hours < 0.5 THEN
        duration_hours := 0.5;
    END IF;
    
    -- S'assurer que la durée n'est jamais négative
    IF duration_hours < 0 THEN
        duration_hours := 0.5;
    END IF;
    
    RETURN duration_hours;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Tester la fonction corrigée
DO $$
DECLARE
    result DECIMAL(4,2);
BEGIN
    -- Test avec les cas problématiques
    result := calculate_duration_hours_corrected('08:30'::TIME, '01:00'::TIME);
    RAISE NOTICE 'Test 1 - 08:30 à 01:00: % heures (attendu: 16.5)', result;
    
    result := calculate_duration_hours_corrected('11:00'::TIME, '00:30'::TIME);
    RAISE NOTICE 'Test 2 - 11:00 à 00:30: % heures (attendu: 13.5)', result;
    
    result := calculate_duration_hours_corrected('09:00'::TIME, '17:00'::TIME);
    RAISE NOTICE 'Test 3 - 09:00 à 17:00: % heures (attendu: 8.0)', result;
    
    -- Test avec un cas qui donnait -7
    result := calculate_duration_hours_corrected('08:30'::TIME, '01:30'::TIME);
    RAISE NOTICE 'Test 4 - 08:30 à 01:30: % heures (attendu: 17.0)', result;
END $$;

-- 5. Forcer la mise à jour de toutes les réservations
-- En modifiant légèrement les heures, on force le recalcul de la colonne GENERATED
UPDATE booking_requests 
SET 
    start_time = start_time + INTERVAL '0 milliseconds',
    end_time = end_time + INTERVAL '0 milliseconds',
    updated_at = NOW()
WHERE deleted_at IS NULL;

-- 6. Vérifier l'état après correction
SELECT 
    'État après correction finale' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 7. Afficher les exemples après correction
SELECT 
    'Exemples après correction' as examples,
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

-- 8. Message de confirmation
SELECT 'Correction finale des durées négatives terminée' as final_status;
