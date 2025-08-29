-- Migration pour ajouter le système de corbeille aux réservations
-- Date: 2025-01-17
-- Objectif: Permettre de "supprimer" les réservations sans les perdre définitivement

-- Ajouter le champ deleted_at à la table booking_requests
ALTER TABLE booking_requests 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Ajouter le champ deleted_at à la table confirmed_bookings
ALTER TABLE confirmed_bookings 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Créer un index pour optimiser les requêtes sur les réservations non supprimées
CREATE INDEX IF NOT EXISTS idx_booking_requests_deleted_at 
ON booking_requests(deleted_at) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_confirmed_bookings_deleted_at 
ON confirmed_bookings(deleted_at) 
WHERE deleted_at IS NULL;

-- Créer une vue pour les réservations actives (non supprimées)
CREATE OR REPLACE VIEW active_booking_requests AS
SELECT * FROM booking_requests 
WHERE deleted_at IS NULL;

-- Créer une vue pour les réservations confirmées actives
CREATE OR REPLACE VIEW active_confirmed_bookings AS
SELECT * FROM confirmed_bookings 
WHERE deleted_at IS NULL;

-- Créer une vue pour les réservations supprimées (corbeille)
CREATE OR REPLACE VIEW deleted_booking_requests AS
SELECT * FROM booking_requests 
WHERE deleted_at IS NOT NULL;

-- Créer une vue pour les réservations confirmées supprimées
CREATE OR REPLACE VIEW deleted_confirmed_bookings AS
SELECT * FROM confirmed_bookings 
WHERE deleted_at IS NOT NULL;

-- Fonction pour "supprimer" une réservation (soft delete)
CREATE OR REPLACE FUNCTION soft_delete_booking_request(booking_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE booking_requests 
    SET deleted_at = NOW() 
    WHERE id = booking_id AND deleted_at IS NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour restaurer une réservation supprimée
CREATE OR REPLACE FUNCTION restore_booking_request(booking_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE booking_requests 
    SET deleted_at = NULL 
    WHERE id = booking_id AND deleted_at IS NOT NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour supprimer définitivement une réservation (hard delete)
CREATE OR REPLACE FUNCTION hard_delete_booking_request(booking_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM booking_requests 
    WHERE id = booking_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour nettoyer automatiquement les réservations supprimées après X mois
CREATE OR REPLACE FUNCTION cleanup_deleted_bookings(months_to_keep INTEGER DEFAULT 12)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM booking_requests 
    WHERE deleted_at < NOW() - INTERVAL '1 month' * months_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
