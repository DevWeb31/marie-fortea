-- Script d'initialisation des paramètres de tarification - Marie Fortea
-- À exécuter dans l'éditeur SQL de Supabase

-- Insérer les paramètres de tarification par défaut
INSERT INTO public.site_settings (key, value) VALUES
    -- Prix de base par type de service
    ('pricing_service_babysitting', '20'),
    ('pricing_service_event_support', '25'),
    ('pricing_service_evening_care', '20'),
    ('pricing_service_emergency_care', '40'),
    
    -- Tarifs de nuit par type de service
    ('pricing_service_event_support_night', '30'),
    ('pricing_service_evening_care_night', '25'),
    
    -- Configuration des tarifs de nuit (true/false)
    ('pricing_service_event_support_has_night', 'true'),
    ('pricing_service_evening_care_has_night', 'true'),
    ('pricing_service_babysitting_has_night', 'false'),
    ('pricing_service_emergency_care_has_night', 'false'),
    
    -- Supplément par enfant
    ('pricing_additional_child_rate', '5'),
    
    -- Date de dernière mise à jour
    ('pricing_last_updated', NOW()::text)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Message de confirmation
SELECT 'Paramètres de tarification initialisés avec succès !' as status;

-- Vérifier les paramètres insérés
SELECT key, value, updated_at 
FROM public.site_settings 
WHERE key LIKE 'pricing_%' 
ORDER BY key;
