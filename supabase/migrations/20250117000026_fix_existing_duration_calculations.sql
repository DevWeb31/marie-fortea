-- Migration pour corriger les calculs de durée existants
-- Date: 2025-01-17
-- Objectif: Forcer la mise à jour des durées existantes avec la fonction corrigée

-- Mettre à jour toutes les réservations existantes pour recalculer la durée
-- On fait un UPDATE avec les mêmes valeurs pour déclencher le recalcul de la colonne GENERATED
UPDATE booking_requests 
SET 
    start_time = start_time,
    end_time = end_time
WHERE duration_hours IS NULL OR duration_hours = 0;

-- Vérifier les résultats
SELECT 
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    CASE 
        WHEN duration_hours IS NULL THEN 'NULL'
        WHEN duration_hours = 0 THEN 'ZERO'
        ELSE 'OK'
    END as duration_status
FROM booking_requests 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 10;

-- Afficher un message de confirmation
SELECT 'Mise à jour des durées terminée' as status;
