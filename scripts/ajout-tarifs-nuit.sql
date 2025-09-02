-- Script d'ajout des tarifs de nuit - Marie Fortea
-- Date: 2025-01-17
-- Objectif: Ajouter les paramètres de tarifs de nuit pour les services concernés

-- ===== AJOUT DES TARIFS DE NUIT =====

-- 1. Ajouter les paramètres de tarifs de nuit
INSERT INTO site_settings (key, value, updated_at) VALUES
    ('pricing_service_event_support_night', '30', NOW()),
    ('pricing_service_evening_care_night', '25', NOW())
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- 2. Ajouter des paramètres pour indiquer quels services ont des tarifs de nuit
INSERT INTO site_settings (key, value, updated_at) VALUES
    ('pricing_service_event_support_has_night', 'true', NOW()),
    ('pricing_service_evening_care_has_night', 'true', NOW()),
    ('pricing_service_babysitting_has_night', 'false', NOW()),
    ('pricing_service_emergency_care_has_night', 'false', NOW())
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- 3. Mettre à jour la date de dernière modification
UPDATE site_settings 
SET value = NOW()::text, updated_at = NOW()
WHERE key = 'pricing_last_updated';

-- 4. Vérification des nouveaux paramètres
SELECT '=== TARIFS DE NUIT AJOUTÉS ===' as section;
SELECT 
    key,
    value,
    updated_at,
    CASE 
        WHEN key LIKE '%_night' AND key NOT LIKE '%_has_night' THEN 'Tarif de nuit'
        WHEN key LIKE '%_has_night' THEN 'Configuration tarif de nuit'
        ELSE 'Tarif de jour'
    END as type_parametre
FROM site_settings 
WHERE key LIKE '%night%' OR key LIKE '%_has_night'
ORDER BY key;

-- 5. Résumé des tarifs complets
SELECT '=== RÉSUMÉ DES TARIFS COMPLETS ===' as section;
SELECT 
    'Garde d''enfants' as service,
    'babysitting' as code,
    (SELECT value FROM site_settings WHERE key = 'pricing_service_babysitting') as prix_jour,
    '-' as prix_nuit,
    'Non' as tarif_nuit
UNION ALL
SELECT 
    'Soutien événementiel' as service,
    'event_support' as code,
    (SELECT value FROM site_settings WHERE key = 'pricing_service_event_support') as prix_jour,
    (SELECT value FROM site_settings WHERE key = 'pricing_service_event_support_night') as prix_nuit,
    'Oui' as tarif_nuit
UNION ALL
SELECT 
    'Garde en soirée' as service,
    'evening_care' as code,
    (SELECT value FROM site_settings WHERE key = 'pricing_service_evening_care') as prix_jour,
    (SELECT value FROM site_settings WHERE key = 'pricing_service_evening_care_night') as prix_nuit,
    'Oui' as tarif_nuit
UNION ALL
SELECT 
    'Garde d''urgence' as service,
    'emergency_care' as code,
    (SELECT value FROM site_settings WHERE key = 'pricing_service_emergency_care') as prix_jour,
    '-' as prix_nuit,
    'Non' as tarif_nuit
ORDER BY service;

-- Message de confirmation
SELECT 'Tarifs de nuit ajoutés avec succès !' as status;
