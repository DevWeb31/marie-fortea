-- Migration de test pour vérifier la fonction de calcul de durée
-- Date: 2025-01-17

-- Test de la fonction avec différents cas
DO $$
DECLARE
    result DECIMAL(4,2);
BEGIN
    -- Test 1: 10h30 à 01h00 (devrait donner ~14.5h)
    result := calculate_duration_hours_corrected('10:30'::TIME, '01:00'::TIME);
    RAISE NOTICE 'Test 1 - 10h30 à 01h00: % heures', result;
    
    -- Test 2: 09h00 à 17h00 (devrait donner 8h)
    result := calculate_duration_hours_corrected('09:00'::TIME, '17:00'::TIME);
    RAISE NOTICE 'Test 2 - 09h00 à 17h00: % heures', result;
    
    -- Test 3: 20h00 à 02h00 (devrait donner 6h)
    result := calculate_duration_hours_corrected('20:00'::TIME, '02:00'::TIME);
    RAISE NOTICE 'Test 3 - 20h00 à 02h00: % heures', result;
    
    -- Test 4: 10h30 à 15h30 (devrait donner 5h)
    result := calculate_duration_hours_corrected('10:30'::TIME, '15:30'::TIME);
    RAISE NOTICE 'Test 4 - 10h30 à 15h30: % heures', result;
END $$;
