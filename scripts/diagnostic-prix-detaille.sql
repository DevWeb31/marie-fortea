-- Script de diagnostic détaillé des prix - Marie Fortea
-- Date: 2025-01-17
-- Objectif: Vérifier l'état exact des prix dans la base de données

-- ===== VÉRIFICATION DÉTAILLÉE DES PRIX =====

-- 1. Vérifier tous les paramètres de prix dans site_settings
SELECT '=== PARAMÈTRES DE PRIX DANS SITE_SETTINGS ===' as section;
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
        ELSE '❌ INCORRECT'
    END as statut
FROM site_settings 
WHERE key LIKE 'pricing_service_%' 
ORDER BY key;

-- 2. Vérifier le supplément par enfant
SELECT '=== SUPPLÉMENT PAR ENFANT ===' as section;
SELECT 
    key,
    value,
    updated_at,
    CASE 
        WHEN key = 'pricing_additional_child_rate' AND value = '5' THEN '✅ CORRECT'
        ELSE '❌ INCORRECT'
    END as statut
FROM site_settings 
WHERE key = 'pricing_additional_child_rate';

-- 3. Vérifier la date de dernière mise à jour
SELECT '=== DATE DE DERNIÈRE MISE À JOUR ===' as section;
SELECT 
    key,
    value,
    updated_at
FROM site_settings 
WHERE key = 'pricing_last_updated';

-- 4. Comparaison avec les prix de la page Services
SELECT '=== COMPARAISON AVEC LA PAGE SERVICES ===' as section;
SELECT 
    'Page Services' as source,
    'babysitting' as service,
    'Garde d''enfants' as nom,
    20.00 as prix_attendu,
    (SELECT value FROM site_settings WHERE key = 'pricing_service_babysitting') as prix_actuel,
    CASE 
        WHEN (SELECT value FROM site_settings WHERE key = 'pricing_service_babysitting') = '20' THEN '✅'
        ELSE '❌'
    END as statut
UNION ALL
SELECT 
    'Page Services' as source,
    'event_support' as service,
    'Soutien événementiel' as nom,
    25.00 as prix_attendu,
    (SELECT value FROM site_settings WHERE key = 'pricing_service_event_support') as prix_actuel,
    CASE 
        WHEN (SELECT value FROM site_settings WHERE key = 'pricing_service_event_support') = '25' THEN '✅'
        ELSE '❌'
    END as statut
UNION ALL
SELECT 
    'Page Services' as source,
    'weekend_care' as service,
    'Garde en soirée' as nom,
    20.00 as prix_attendu,
    (SELECT value FROM site_settings WHERE key = 'pricing_service_weekend_care') as prix_actuel,
    CASE 
        WHEN (SELECT value FROM site_settings WHERE key = 'pricing_service_weekend_care') = '20' THEN '✅'
        ELSE '❌'
    END as statut
UNION ALL
SELECT 
    'Page Services' as source,
    'emergency_care' as service,
    'Garde d''urgence' as nom,
    40.00 as prix_attendu,
    (SELECT value FROM site_settings WHERE key = 'pricing_service_emergency_care') as prix_actuel,
    CASE 
        WHEN (SELECT value FROM site_settings WHERE key = 'pricing_service_emergency_care') = '40' THEN '✅'
        ELSE '❌'
    END as statut;

-- 5. Vérifier s'il y a des paramètres manquants
SELECT '=== PARAMÈTRES MANQUANTS ===' as section;
SELECT 
    'Paramètres manquants' as type,
    'pricing_service_babysitting' as parametre_requis,
    CASE 
        WHEN EXISTS(SELECT 1 FROM site_settings WHERE key = 'pricing_service_babysitting') THEN '✅ Présent'
        ELSE '❌ Manquant'
    END as statut
UNION ALL
SELECT 
    'Paramètres manquants' as type,
    'pricing_service_event_support' as parametre_requis,
    CASE 
        WHEN EXISTS(SELECT 1 FROM site_settings WHERE key = 'pricing_service_event_support') THEN '✅ Présent'
        ELSE '❌ Manquant'
    END as statut
UNION ALL
SELECT 
    'Paramètres manquants' as type,
    'pricing_service_weekend_care' as parametre_requis,
    CASE 
        WHEN EXISTS(SELECT 1 FROM site_settings WHERE key = 'pricing_service_weekend_care') THEN '✅ Présent'
        ELSE '❌ Manquant'
    END as statut
UNION ALL
SELECT 
    'Paramètres manquants' as type,
    'pricing_service_emergency_care' as parametre_requis,
    CASE 
        WHEN EXISTS(SELECT 1 FROM site_settings WHERE key = 'pricing_service_emergency_care') THEN '✅ Présent'
        ELSE '❌ Manquant'
    END as statut;

-- 6. Résumé global
SELECT '=== RÉSUMÉ GLOBAL ===' as section;
SELECT 
    COUNT(*) as total_parametres,
    COUNT(CASE WHEN key LIKE 'pricing_service_%' THEN 1 END) as parametres_prix,
    COUNT(CASE WHEN key = 'pricing_additional_child_rate' THEN 1 END) as parametre_supplement,
    COUNT(CASE WHEN key = 'pricing_last_updated' THEN 1 END) as parametre_date
FROM site_settings 
WHERE key LIKE 'pricing_%';

-- Message de fin
SELECT 'Diagnostic détaillé terminé !' as status;
