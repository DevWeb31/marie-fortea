-- Création de la table site_settings - Marie Fortea
-- À exécuter dans l'éditeur SQL de Supabase

-- Table des paramètres du site
CREATE TABLE IF NOT EXISTS public.site_settings (
    id BIGSERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- RLS (Row Level Security)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
DROP POLICY IF EXISTS "Allow public read access" ON public.site_settings;
CREATE POLICY "Allow public read access" ON public.site_settings
    FOR SELECT TO public
    USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert" ON public.site_settings;
CREATE POLICY "Allow authenticated users to insert" ON public.site_settings
    FOR INSERT TO public
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to update" ON public.site_settings;
CREATE POLICY "Allow authenticated users to update" ON public.site_settings
    FOR UPDATE TO public
    USING (auth.role() = 'authenticated');

-- Insérer les paramètres par défaut
INSERT INTO public.site_settings (key, value) VALUES
    ('maintenance_mode', 'false'),
    ('site_title', 'Marie Fortea'),
    ('site_description', 'Site officiel de Marie Fortea'),
    ('contact_email', 'contact@marie-fortea.com'),
    ('contact_phone', '+33 1 23 45 67 89')
ON CONFLICT (key) DO NOTHING;

-- Message de confirmation
SELECT 'Table site_settings créée avec succès !' as status;
SELECT * FROM public.site_settings;
