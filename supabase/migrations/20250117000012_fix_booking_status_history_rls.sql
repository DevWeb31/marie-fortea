-- Migration pour corriger les politiques RLS de booking_status_history
-- Date: 2025-01-17
-- Objectif: Permettre l'insertion dans booking_status_history par les triggers

-- Ajouter une politique pour permettre l'insertion par les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to insert status history" ON booking_status_history
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Ajouter une politique pour permettre la lecture par les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to read status history" ON booking_status_history
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Ajouter une politique pour permettre les mises à jour par les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to update status history" ON booking_status_history
    FOR UPDATE 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Commentaire sur les nouvelles politiques
COMMENT ON POLICY "Allow authenticated users to insert status history" ON booking_status_history IS 'Permet aux utilisateurs authentifiés d''insérer dans l''historique des statuts';
COMMENT ON POLICY "Allow authenticated users to read status history" ON booking_status_history IS 'Permet aux utilisateurs authentifiés de lire l''historique des statuts';
COMMENT ON POLICY "Allow authenticated users to update status history" ON booking_status_history IS 'Permet aux utilisateurs authentifiés de mettre à jour l''historique des statuts';
