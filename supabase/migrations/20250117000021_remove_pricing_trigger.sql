-- Migration pour supprimer le trigger de calcul de prix
-- Date: 2025-01-17
-- Objectif: Laisser le calcul de prix côté client

-- Supprimer le trigger
DROP TRIGGER IF EXISTS trigger_calculate_estimated_total ON booking_requests;

-- Supprimer la fonction
DROP FUNCTION IF EXISTS calculate_estimated_total();

-- Vérifier que le trigger a été supprimé
SELECT 'Trigger supprimé - calcul de prix maintenant côté client' as status;
