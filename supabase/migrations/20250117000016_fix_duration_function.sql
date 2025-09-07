-- Migration pour corriger définitivement la fonction de calcul de durée
-- Date: 2025-01-17
-- Objectif: Corriger le calcul de durée pour les services qui passent minuit

-- Remplacer la fonction de calcul de durée
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

-- Test de la nouvelle fonction
DO $$
DECLARE
    result DECIMAL(4,2);
BEGIN
    -- Test 1: 10h30 à 01h00 (devrait donner 14.5h)
    result := calculate_duration_hours_corrected('10:30'::TIME, '01:00'::TIME);
    RAISE NOTICE 'Test 1 - 10h30 à 01h00: % heures (attendu: 14.5)', result;
    
    -- Test 2: 09h00 à 17h00 (devrait donner 8h)
    result := calculate_duration_hours_corrected('09:00'::TIME, '17:00'::TIME);
    RAISE NOTICE 'Test 2 - 09h00 à 17h00: % heures (attendu: 8.0)', result;
    
    -- Test 3: 20h00 à 02h00 (devrait donner 6h)
    result := calculate_duration_hours_corrected('20:00'::TIME, '02:00'::TIME);
    RAISE NOTICE 'Test 3 - 20h00 à 02h00: % heures (attendu: 6.0)', result;
    
    -- Test 4: 10h30 à 15h30 (devrait donner 5h)
    result := calculate_duration_hours_corrected('10:30'::TIME, '15:30'::TIME);
    RAISE NOTICE 'Test 4 - 10h30 à 15h30: % heures (attendu: 5.0)', result;
END $$;

-- Commentaire sur la fonction corrigée
COMMENT ON FUNCTION calculate_duration_hours_corrected IS 'Calcule la durée en heures entre deux heures, en tenant compte du passage à minuit. Utilise une logique basée sur les minutes pour plus de précision.';
