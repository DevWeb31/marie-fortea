-- Migration pour corriger les politiques RLS de site_settings
-- Date: 2025-01-17
-- Objectif: Permettre l'accès public en lecture aux paramètres de site

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Allow public read access" ON public.site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON public.site_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON public.site_settings;

-- Créer de nouvelles politiques RLS
-- Politique pour la lecture publique (accès anonyme)
CREATE POLICY "Allow anonymous read access to site settings" ON public.site_settings
    FOR SELECT 
    TO anon, authenticated
    USING (true);

-- Politique pour l'insertion (utilisateurs authentifiés seulement)
CREATE POLICY "Allow authenticated users to insert site settings" ON public.site_settings
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.role() = 'authenticated');

-- Politique pour la mise à jour (utilisateurs authentifiés seulement)
CREATE POLICY "Allow authenticated users to update site settings" ON public.site_settings
    FOR UPDATE 
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Politique pour la suppression (utilisateurs authentifiés seulement)
CREATE POLICY "Allow authenticated users to delete site settings" ON public.site_settings
    FOR DELETE 
    TO authenticated
    USING (auth.role() = 'authenticated');

-- Vérifier que les politiques sont bien créées
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'site_settings'
ORDER BY policyname;
