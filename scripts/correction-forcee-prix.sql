-- Script de correction forcée des prix - Marie Fortea
-- Date: 2025-01-17
-- Objectif: Forcer la mise à jour de tous les prix pour correspondre à la page Services

-- ===== CORRECTION FORCÉE DES PRIX =====

-- 1. Supprimer tous les anciens paramètres de prix
DELETE FROM site_settings WHERE key LIKE 'pricing_service_%';

-- 2. Insérer les nouveaux prix avec les bonnes valeurs
INSERT INTO site_settings (key, value, updated_at) VALUES
    ('pricing_service_babysitting', '20', NOW()),
    ('pricing_service_event_support', '25', NOW()),
    ('pricing_service_weekend_care', '20', NOW()),
    ('pricing_service_emergency_care', '40', NOW()),
    ('pricing_service_overnight_care', '22.50', NOW()),
    ('pricing_service_holiday_care', '21', NOW())
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- 3. Mettre à jour le supplément par enfant
INSERT INTO site_settings (key, value, updated_at) VALUES
    ('pricing_additional_child_rate', '5', NOW())
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- 4. Mettre à jour la date de dernière modification
INSERT INTO site_settings (key, value, updated_at) VALUES
    ('pricing_last_updated', NOW()::text, NOW())
ON CONFLICT (key) DO UPDATE SET 
    value = NOW()::text,
    updated_at = NOW();

-- 5. Vérification immédiate
SELECT '=== VÉRIFICATION APRÈS CORRECTION ===' as section;
SELECT 
    key,
    value,
    updated_at,
    CASE 
        WHEN key = 'pricing_service_babysitting' AND value = '20' THEN '✅ CORRECT'
        WHEN key = 'pricing_service_event_support' AND value = '25' THEN '✅ CORRECT'
        WHEN key = 'pricing_service_weekend_care' AND value = '20' THEN '✅ CORRECT'
        WHEN key = 'pricing_service_emergency_care' AND value = '40' THEN '✅ CORRECT'
        WHEN key = 'pricing_service_overnight_care' AND value = '22.50' THEN '✅ CORRECT'
        WHEN key = 'pricing_service_holiday_care' AND value = '21' THEN '✅ CORRECT'
        WHEN key = 'pricing_additional_child_rate' AND value = '5' THEN '✅ CORRECT'
        ELSE '❌ INCORRECT'
    END as statut
FROM site_settings 
WHERE key LIKE 'pricing_%' 
ORDER BY key;

-- 6. Résumé des prix mis à jour
SELECT '=== RÉSUMÉ DES PRIX MIS À JOUR ===' as section;
SELECT 
    'Garde d''enfants' as service,
    'babysitting' as code,
    '20€/heure' as prix
UNION ALL
SELECT 
    'Soutien événementiel' as service,
    'event_support' as code,
    '25€/heure' as prix
UNION ALL
SELECT 
    'Garde en soirée' as service,
    'weekend_care' as code,
    '20€/heure' as prix
UNION ALL
SELECT 
    'Garde d''urgence' as service,
    'emergency_care' as code,
    '40€/heure' as prix
UNION ALL
SELECT 
    'Garde de nuit' as service,
    'overnight_care' as code,
    '22.50€/heure' as prix
UNION ALL
SELECT 
    'Garde pendant les vacances' as service,
    'holiday_care' as code,
    '21€/heure' as prix
ORDER BY service;

-- Message de confirmation
SELECT 'Correction forcée terminée avec succès !' as status;
SELECT 'Tous les prix ont été alignés avec la page Services.' as message;
