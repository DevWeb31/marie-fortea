-- Migration pour ajouter les paramètres SMTP configurables
-- Date: 2025-01-17
-- Objectif: Permettre la configuration SMTP depuis le back-office

-- Ajouter les paramètres SMTP configurables
INSERT INTO public.site_settings (key, value) VALUES
    ('smtp_host', 'smtp.gmail.com')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

INSERT INTO public.site_settings (key, value) VALUES
    ('smtp_port', '587')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

INSERT INTO public.site_settings (key, value) VALUES
    ('smtp_username', '')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

INSERT INTO public.site_settings (key, value) VALUES
    ('smtp_password', '')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

INSERT INTO public.site_settings (key, value) VALUES
    ('smtp_from', 'noreply@marie-fortea.com')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

INSERT INTO public.site_settings (key, value) VALUES
    ('smtp_encryption', 'tls')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Vérifier l'insertion
SELECT 'Paramètres SMTP ajoutés avec succès !' as status;
SELECT * FROM public.site_settings WHERE key LIKE 'smtp%';
