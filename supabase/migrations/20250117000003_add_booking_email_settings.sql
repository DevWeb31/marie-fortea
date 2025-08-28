-- Migration pour ajouter les paramètres d'email des réservations
-- Date: 2025-01-17
-- Objectif: Ajouter le paramètre d'email de réception des réservations

-- Ajouter le paramètre d'email de réception des réservations
INSERT INTO public.site_settings (key, value) VALUES
    ('booking_notification_email', 'admin@marie-fortea.com')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Ajouter un paramètre pour activer/désactiver les notifications par email
INSERT INTO public.site_settings (key, value) VALUES
    ('enable_booking_email_notifications', 'true')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Ajouter un paramètre pour le template d'email
INSERT INTO public.site_settings (key, value) VALUES
    ('booking_email_template', 'default')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Vérifier l'insertion
SELECT 'Paramètres d''email des réservations ajoutés avec succès !' as status;
SELECT * FROM public.site_settings WHERE key LIKE '%booking%' OR key LIKE '%email%';
