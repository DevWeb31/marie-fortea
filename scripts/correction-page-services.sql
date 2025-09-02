-- Script de correction pour la page Services - Marie Fortea
-- Date: 2025-01-17
-- Objectif: S'assurer que le paramètre evening_care existe pour la page Services

-- ===== CORRECTION POUR LA PAGE SERVICES =====

-- 1. Vérifier si le paramètre evening_care existe
SELECT '=== VÉRIFICATION PARAMÈTRE EVENING_CARE ===' as section;
SELECT 
    key,
    value,
    updated_at,
    CASE 
        WHEN key = 'pricing_service_evening_care' THEN '✅ PRÉSENT'
        ELSE '❌ MANQUANT'
    END as statut
FROM site_settings 
WHERE key = 'pricing_service_evening_care';

-- 2. Si le paramètre n'existe pas, l'ajouter
INSERT INTO site_settings (key, value, updated_at) VALUES
    ('pricing_service_evening_care', '20', NOW())
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- 3. Vérifier que tous les paramètres nécessaires pour la page Services existent
SELECT '=== PARAMÈTRES POUR LA PAGE SERVICES ===' as section;
SELECT 
    key,
    value,
    updated_at,
    CASE 
        WHEN key = 'pricing_service_babysitting' AND value = '20' THEN '✅ CORRECT'
        WHEN key = 'pricing_service_event_support' AND value = '25' THEN '✅ CORRECT'
        WHEN key = 'pricing_service_evening_care' AND value = '20' THEN '✅ CORRECT'
        WHEN key = 'pricing_service_emergency_care' AND value = '40' THEN '✅ CORRECT'
        ELSE '❌ INCORRECT'
    END as statut
FROM site_settings 
WHERE key IN (
    'pricing_service_babysitting',
    'pricing_service_event_support',
    'pricing_service_evening_care',
    'pricing_service_emergency_care'
)
ORDER BY key;

-- 4. Mettre à jour la date de dernière modification
UPDATE site_settings 
SET value = NOW()::text, updated_at = NOW()
WHERE key = 'pricing_last_updated';

-- 5. Résumé des services pour la page Services
SELECT '=== RÉSUMÉ POUR LA PAGE SERVICES ===' as section;
SELECT 
    'Garde d''enfants' as service,
    'babysitting' as code,
    '20€/heure' as prix_jour,
    '-' as prix_nuit
UNION ALL
SELECT 
    'Soutien événementiel' as service,
    'event_support' as code,
    '25€/heure' as prix_jour,
    '30€/heure' as prix_nuit
UNION ALL
SELECT 
    'Garde en soirée' as service,
    'evening_care' as code,
    '20€/heure' as prix_jour,
    '25€/heure' as prix_nuit
UNION ALL
SELECT 
    'Garde d''urgence' as service,
    'emergency_care' as code,
    '40€/heure' as prix_jour,
    '-' as prix_nuit
ORDER BY service;

-- Message de confirmation
SELECT 'Correction pour la page Services terminée !' as status;
