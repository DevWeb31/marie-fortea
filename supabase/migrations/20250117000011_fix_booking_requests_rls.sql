-- Migration pour corriger les politiques RLS de booking_requests
-- Date: 2025-01-17
-- Objectif: Permettre les mises à jour (UPDATE) sur la table booking_requests

-- Ajouter une politique pour permettre les mises à jour par les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to update booking requests" ON booking_requests
    FOR UPDATE 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Ajouter une politique pour permettre les suppressions par les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to delete booking requests" ON booking_requests
    FOR DELETE 
    USING (auth.role() = 'authenticated');

-- Commentaire sur les nouvelles politiques
COMMENT ON POLICY "Allow authenticated users to update booking requests" ON booking_requests IS 'Permet aux utilisateurs authentifiés de mettre à jour les réservations';
COMMENT ON POLICY "Allow authenticated users to delete booking requests" ON booking_requests IS 'Permet aux utilisateurs authentifiés de supprimer les réservations';
