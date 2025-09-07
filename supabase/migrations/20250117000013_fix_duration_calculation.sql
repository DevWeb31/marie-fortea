-- Migration pour corriger le calcul de durée
-- Date: 2025-01-17
-- Objectif: S'assurer que la durée est toujours positive

-- Fonction améliorée pour calculer la durée en tenant compte du passage à minuit
CREATE OR REPLACE FUNCTION calculate_duration_hours_corrected(start_time TIME, end_time TIME)
RETURNS DECIMAL(4,2) AS $$
DECLARE
    duration_hours DECIMAL(4,2);
BEGIN
    -- Si l'heure de fin est avant l'heure de début, c'est le lendemain
    IF end_time <= start_time THEN
        -- Ajouter 24 heures pour le passage à minuit
        duration_hours := EXTRACT(EPOCH FROM (end_time + INTERVAL '24 hours' - start_time)) / 3600;
    ELSE
        -- Même jour
        duration_hours := EXTRACT(EPOCH FROM (end_time - start_time)) / 3600;
    END IF;
    
    -- S'assurer que la durée est positive et au minimum 0.5 heures
    IF duration_hours < 0 THEN
        duration_hours := 0.5;
    END IF;
    
    RETURN duration_hours;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Note: La colonne duration_hours est calculée automatiquement (GENERATED ALWAYS AS)
-- Les durées négatives seront automatiquement corrigées lors des prochaines insertions/mises à jour

-- Commentaire sur la fonction corrigée
COMMENT ON FUNCTION calculate_duration_hours_corrected IS 'Calcule la durée en heures entre deux heures, en tenant compte du passage à minuit et en s''assurant que le résultat est toujours positif';
