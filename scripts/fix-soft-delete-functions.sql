-- Script pour vérifier et créer les fonctions de soft delete manquantes
-- Date: 2025-01-17

-- Vérifier si la fonction soft_delete_booking_request existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'soft_delete_booking_request'
    ) THEN
        -- Créer la fonction pour "supprimer" une réservation (soft delete)
        CREATE OR REPLACE FUNCTION soft_delete_booking_request(booking_id UUID)
        RETURNS BOOLEAN AS $$
        BEGIN
            UPDATE booking_requests 
            SET deleted_at = NOW() 
            WHERE id = booking_id AND deleted_at IS NULL;
            
            RETURN FOUND;
        END;
        $$ LANGUAGE plpgsql;
        
        RAISE NOTICE 'Fonction soft_delete_booking_request créée';
    ELSE
        RAISE NOTICE 'Fonction soft_delete_booking_request existe déjà';
    END IF;
END $$;

-- Vérifier si la fonction restore_booking_request existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'restore_booking_request'
    ) THEN
        -- Créer la fonction pour restaurer une réservation supprimée
        CREATE OR REPLACE FUNCTION restore_booking_request(booking_id UUID)
        RETURNS BOOLEAN AS $$
        BEGIN
            UPDATE booking_requests 
            SET deleted_at = NULL 
            WHERE id = booking_id AND deleted_at IS NOT NULL;
            
            RETURN FOUND;
        END;
        $$ LANGUAGE plpgsql;
        
        RAISE NOTICE 'Fonction restore_booking_request créée';
    ELSE
        RAISE NOTICE 'Fonction restore_booking_request existe déjà';
    END IF;
END $$;

-- Vérifier si la fonction hard_delete_booking_request existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'hard_delete_booking_request'
    ) THEN
        -- Créer la fonction pour supprimer définitivement une réservation (hard delete)
        CREATE OR REPLACE FUNCTION hard_delete_booking_request(booking_id UUID)
        RETURNS BOOLEAN AS $$
        BEGIN
            DELETE FROM booking_requests 
            WHERE id = booking_id;
            
            RETURN FOUND;
        END;
        $$ LANGUAGE plpgsql;
        
        RAISE NOTICE 'Fonction hard_delete_booking_request créée';
    ELSE
        RAISE NOTICE 'Fonction hard_delete_booking_request existe déjà';
    END IF;
END $$;

-- Vérifier si la fonction cleanup_deleted_bookings existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'cleanup_deleted_bookings'
    ) THEN
        -- Créer la fonction pour nettoyer automatiquement les réservations supprimées après X mois
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
        
        RAISE NOTICE 'Fonction cleanup_deleted_bookings créée';
    ELSE
        RAISE NOTICE 'Fonction cleanup_deleted_bookings existe déjà';
    END IF;
END $$;

-- Vérifier que toutes les fonctions existent maintenant
SELECT 
    proname as function_name,
    CASE 
        WHEN proname = 'soft_delete_booking_request' THEN '✅ Existe'
        WHEN proname = 'restore_booking_request' THEN '✅ Existe'
        WHEN proname = 'hard_delete_booking_request' THEN '✅ Existe'
        WHEN proname = 'cleanup_deleted_bookings' THEN '✅ Existe'
        ELSE '❌ Manquante'
    END as status
FROM pg_proc 
WHERE proname IN (
    'soft_delete_booking_request',
    'restore_booking_request', 
    'hard_delete_booking_request',
    'cleanup_deleted_bookings'
);

-- Tester la fonction soft_delete_booking_request avec une réservation existante
DO $$
DECLARE
    test_booking_id UUID;
    result BOOLEAN;
BEGIN
    -- Récupérer l'ID d'une réservation existante
    SELECT id INTO test_booking_id 
    FROM booking_requests 
    WHERE deleted_at IS NULL 
    LIMIT 1;
    
    IF test_booking_id IS NOT NULL THEN
        RAISE NOTICE 'Test de la fonction soft_delete_booking_request avec l''ID: %', test_booking_id;
        
        -- Tester la fonction
        SELECT soft_delete_booking_request(test_booking_id) INTO result;
        
        IF result THEN
            RAISE NOTICE '✅ Test réussi: Réservation mise en corbeille';
            
            -- Restaurer la réservation pour le test
            SELECT restore_booking_request(test_booking_id) INTO result;
            IF result THEN
                RAISE NOTICE '✅ Test de restauration réussi';
            ELSE
                RAISE NOTICE '❌ Test de restauration échoué';
            END IF;
        ELSE
            RAISE NOTICE '❌ Test échoué: Impossible de mettre en corbeille';
        END IF;
    ELSE
        RAISE NOTICE 'Aucune réservation trouvée pour le test';
    END IF;
END $$;
