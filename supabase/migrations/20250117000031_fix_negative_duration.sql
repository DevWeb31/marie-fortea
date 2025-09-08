-- Migration pour corriger les durées négatives
-- Date: 2025-01-17
-- Objectif: Corriger la fonction de calcul de durée pour éviter les valeurs négatives

-- Fonction corrigée pour calculer la durée en tenant compte du passage à minuit
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
    
    RETURN duration_hours;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Test de la fonction corrigée
DO $$
DECLARE
    result DECIMAL(4,2);
BEGIN
    -- Test 1: 08:30 à 01:00 (devrait donner 16.5h)
    result := calculate_duration_hours_corrected('08:30'::TIME, '01:00'::TIME);
    RAISE NOTICE 'Test 1 - 08:30 à 01:00: % heures (attendu: 16.5)', result;
    
    -- Test 2: 11:00 à 00:30 (devrait donner 13.5h)
    result := calculate_duration_hours_corrected('11:00'::TIME, '00:30'::TIME);
    RAISE NOTICE 'Test 2 - 11:00 à 00:30: % heures (attendu: 13.5)', result;
    
    -- Test 3: 09:00 à 17:00 (devrait donner 8h)
    result := calculate_duration_hours_corrected('09:00'::TIME, '17:00'::TIME);
    RAISE NOTICE 'Test 3 - 09:00 à 17:00: % heures (attendu: 8.0)', result;
END $$;

-- Forcer la mise à jour de toutes les réservations pour recalculer les durées
UPDATE booking_requests 
SET 
    start_time = start_time + INTERVAL '0 seconds',
    end_time = end_time + INTERVAL '0 seconds'
WHERE deleted_at IS NULL;

-- Vérifier les résultats
SELECT 
    'Résultats après correction des durées négatives' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations,
    ROUND(AVG(duration_hours), 2) as avg_duration
FROM booking_requests 
WHERE deleted_at IS NULL;

-- Afficher quelques exemples pour vérification
SELECT 
    'Exemples de vérification' as verification,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    CASE 
        WHEN duration_hours < 0 THEN '❌ NÉGATIF'
        WHEN duration_hours = 0 THEN '❌ ZERO'
        WHEN duration_hours > 0 THEN '✅ OK'
        ELSE '❌ PROBLEM'
    END as status
FROM booking_requests 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 5;

-- Message de confirmation
SELECT 'Correction des durées négatives terminée' as final_status;
