-- Migration pour corriger la vue active_booking_requests
-- Date: 2025-01-17
-- Objectif: Inclure la colonne estimated_total dans la vue active_booking_requests

-- Supprimer la vue existante
DROP VIEW IF EXISTS active_booking_requests;

-- Recréer la vue avec toutes les colonnes, y compris estimated_total
CREATE VIEW active_booking_requests AS
SELECT * FROM booking_requests 
WHERE deleted_at IS NULL AND archived_at IS NULL;

-- Vérifier que la vue fonctionne
SELECT 'Vue active_booking_requests recréée avec succès' as status;
