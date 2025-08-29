-- Migration sûre pour ajouter le système de corbeille aux réservations
-- Date: 2025-01-17
-- Objectif: Permettre de "supprimer" les réservations sans les perdre définitivement
-- Cette migration est sûre et n'efface pas les données existantes

-- Ajouter le champ deleted_at à la table booking_requests (sans effacer les données)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'booking_requests' 
        AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE booking_requests ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
    END IF;
END $$;

-- Ajouter le champ deleted_at à la table confirmed_bookings (sans effacer les données)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'confirmed_bookings' 
        AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE confirmed_bookings ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
    END IF;
END $$;

-- Créer un index pour optimiser les requêtes sur les réservations non supprimées
CREATE INDEX IF NOT EXISTS idx_booking_requests_deleted_at 
ON booking_requests(deleted_at) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_confirmed_bookings_deleted_at 
ON confirmed_bookings(deleted_at) 
WHERE deleted_at IS NULL;

-- Créer une vue pour les réservations actives (non supprimées)
DROP VIEW IF EXISTS active_booking_requests;
CREATE VIEW active_booking_requests AS
SELECT * FROM booking_requests 
WHERE deleted_at IS NULL;

-- Créer une vue pour les réservations confirmées actives
DROP VIEW IF EXISTS active_confirmed_bookings;
CREATE VIEW active_confirmed_bookings AS
SELECT * FROM confirmed_bookings 
WHERE deleted_at IS NULL;

-- Créer une vue pour les réservations supprimées (corbeille)
DROP VIEW IF EXISTS deleted_booking_requests;
CREATE VIEW deleted_booking_requests AS
SELECT * FROM booking_requests 
WHERE deleted_at IS NOT NULL;

-- Créer une vue pour les réservations confirmées supprimées
DROP VIEW IF EXISTS deleted_confirmed_bookings;
CREATE VIEW deleted_confirmed_bookings AS
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
