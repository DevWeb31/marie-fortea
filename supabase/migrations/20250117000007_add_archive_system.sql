-- Migration pour ajouter le système d'archivage
-- Date: 2025-01-17

-- Ajouter le champ archived_at à la table booking_requests
ALTER TABLE booking_requests 
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;

-- Créer une vue pour les réservations actives (ni supprimées, ni archivées)
CREATE OR REPLACE VIEW active_booking_requests AS
SELECT * FROM booking_requests 
WHERE deleted_at IS NULL AND archived_at IS NULL;

-- Créer une vue pour les réservations archivées
CREATE OR REPLACE VIEW archived_booking_requests AS
SELECT * FROM booking_requests 
WHERE deleted_at IS NULL AND archived_at IS NOT NULL;

-- Créer une vue pour les réservations dans la corbeille
CREATE OR REPLACE VIEW trashed_booking_requests AS
SELECT * FROM booking_requests 
WHERE deleted_at IS NOT NULL;

-- Fonction pour archiver une réservation
CREATE OR REPLACE FUNCTION archive_booking_request(booking_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    affected_rows INTEGER;
    booking_exists BOOLEAN;
BEGIN
    -- Vérifier d'abord si la réservation existe et n'est pas déjà archivée
    SELECT EXISTS(
        SELECT 1 FROM booking_requests 
        WHERE id = booking_id AND deleted_at IS NULL AND archived_at IS NULL
    ) INTO booking_exists;
    
    IF NOT booking_exists THEN
        RAISE NOTICE 'Réservation % non trouvée ou déjà archivée', booking_id;
        RETURN FALSE;
    END IF;
    
    -- Archiver la réservation
    UPDATE booking_requests 
    SET 
        archived_at = NOW(),
        updated_at = NOW()
    WHERE id = booking_id AND deleted_at IS NULL AND archived_at IS NULL;
    
    -- Récupérer le nombre de lignes affectées
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    
    RAISE NOTICE 'Réservation % archivée, lignes affectées: %', booking_id, affected_rows;
    
    -- Retourner true si au moins une ligne a été mise à jour
    RETURN affected_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour désarchiver une réservation
CREATE OR REPLACE FUNCTION unarchive_booking_request(booking_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    affected_rows INTEGER;
    booking_exists BOOLEAN;
BEGIN
    -- Vérifier d'abord si la réservation existe et est archivée
    SELECT EXISTS(
        SELECT 1 FROM booking_requests 
        WHERE id = booking_id AND deleted_at IS NULL AND archived_at IS NOT NULL
    ) INTO booking_exists;
    
    IF NOT booking_exists THEN
        RAISE NOTICE 'Réservation % non trouvée ou pas archivée', booking_id;
        RETURN FALSE;
    END IF;
    
    -- Désarchiver la réservation
    UPDATE booking_requests 
    SET 
        archived_at = NULL,
        updated_at = NOW()
    WHERE id = booking_id AND deleted_at IS NULL AND archived_at IS NOT NULL;
    
    -- Récupérer le nombre de lignes affectées
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    
    RAISE NOTICE 'Réservation % désarchivée, lignes affectées: %', booking_id, affected_rows;
    
    -- Retourner true si au moins une ligne a été mise à jour
    RETURN affected_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mettre à jour la fonction de suppression définitive pour gérer les réservations archivées
CREATE OR REPLACE FUNCTION hard_delete_booking_request(booking_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    affected_rows INTEGER;
    booking_exists BOOLEAN;
BEGIN
    -- Vérifier d'abord si la réservation existe
    SELECT EXISTS(
        SELECT 1 FROM booking_requests 
        WHERE id = booking_id
    ) INTO booking_exists;
    
    IF NOT booking_exists THEN
        RAISE NOTICE 'Réservation % non trouvée', booking_id;
        RETURN FALSE;
    END IF;
    
    -- Supprimer définitivement la réservation (peu importe son statut)
    DELETE FROM booking_requests 
    WHERE id = booking_id;
    
    -- Récupérer le nombre de lignes affectées
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    
    RAISE NOTICE 'Réservation % supprimée définitivement, lignes affectées: %', booking_id, affected_rows;
    
    -- Retourner true si au moins une ligne a été supprimée
    RETURN affected_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
