-- Script pour vérifier et insérer les paramètres SMTP manquants
-- Exécutez ce script dans Supabase Studio ou via psql

-- Vérifier les paramètres SMTP existants
SELECT 'Paramètres SMTP existants :' as info;
SELECT key, value FROM site_settings WHERE key LIKE 'smtp%';

-- Insérer les paramètres SMTP s'ils n'existent pas
INSERT INTO site_settings (key, value) VALUES
    ('smtp_host', 'smtp.gmail.com')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

INSERT INTO site_settings (key, value) VALUES
    ('smtp_port', '587')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

INSERT INTO site_settings (key, value) VALUES
    ('smtp_username', '')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

INSERT INTO site_settings (key, value) VALUES
    ('smtp_password', '')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

INSERT INTO site_settings (key, value) VALUES
    ('smtp_from', 'noreply@marie-fortea.com')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

INSERT INTO site_settings (key, value) VALUES
    ('smtp_encryption', 'tls')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Vérifier que tous les paramètres sont présents
SELECT 'Paramètres SMTP après insertion :' as info;
SELECT key, value FROM site_settings WHERE key LIKE 'smtp%' ORDER BY key;

-- Vérifier le total des paramètres
SELECT 'Total des paramètres dans site_settings :' as info;
SELECT COUNT(*) as total_params FROM site_settings;
