-- Script de diagnostic des types de services - Marie Fortea
-- Date: 2025-01-17
-- Objectif: Analyser l'état actuel des types de services dans la base de données

-- ===== DIAGNOSTIC DES TYPES DE SERVICES =====

-- 1. Types de services dans la table service_types
SELECT '=== TYPES DE SERVICES (table service_types) ===' as section;
SELECT 
    code,
    name,
    description,
    base_price,
    min_duration_hours,
    is_active,
    created_at
FROM service_types 
ORDER BY code;

-- 2. Paramètres de prix dans site_settings
SELECT '=== PARAMÈTRES DE PRIX (table site_settings) ===' as section;
SELECT 
    key,
    value,
    updated_at
FROM site_settings 
WHERE key LIKE 'pricing_service_%' 
ORDER BY key;

-- 3. Demandes de réservation existantes
SELECT '=== DEMANDES DE RÉSERVATION EXISTANTES ===' as section;
SELECT 
    service_type,
    COUNT(*) as nombre_demandes,
    MIN(created_at) as premiere_demande,
    MAX(created_at) as derniere_demande,
    MIN(status) as statut_min,
    MAX(status) as statut_max
FROM booking_requests 
GROUP BY service_type 
ORDER BY nombre_demandes DESC;

-- 4. Types de services utilisés dans les demandes
SELECT '=== TYPES DE SERVICES UTILISÉS DANS LES DEMANDES ===' as section;
SELECT DISTINCT 
    br.service_type,
    st.name as nom_service,
    st.base_price as prix_base,
    COUNT(br.id) as nombre_utilisations
FROM booking_requests br
LEFT JOIN service_types st ON br.service_type = st.code
GROUP BY br.service_type, st.name, st.base_price
ORDER BY nombre_utilisations DESC;

-- 5. Comparaison avec les types de la page Services
SELECT '=== COMPARAISON AVEC LA PAGE SERVICES ===' as section;
SELECT 
    'Page Services' as source,
    'babysitting' as code,
    'Garde d''enfants' as nom,
    20.00 as prix
UNION ALL
SELECT 
    'Page Services' as source,
    'event_support' as code,
    'Soutien événementiel' as nom,
    25.00 as prix
UNION ALL
SELECT 
    'Page Services' as source,
    'weekend_care' as code,
    'Garde en soirée' as nom,
    20.00 as prix
UNION ALL
SELECT 
    'Page Services' as source,
    'emergency_care' as code,
    'Garde d''urgence' as nom,
    40.00 as prix
ORDER BY source, code;

-- 6. Résumé des incohérences
SELECT '=== RÉSUMÉ DES INCOHÉRENCES ===' as section;
SELECT 
    'Types dans service_types mais pas dans site_settings' as type_incoherence,
    st.code,
    st.name
FROM service_types st
WHERE NOT EXISTS (
    SELECT 1 FROM site_settings ss 
    WHERE ss.key = 'pricing_service_' || st.code
)
UNION ALL
SELECT 
    'Types dans site_settings mais pas dans service_types' as type_incoherence,
    REPLACE(ss.key, 'pricing_service_', '') as code,
    'Non défini' as name
FROM site_settings ss
WHERE ss.key LIKE 'pricing_service_%'
AND NOT EXISTS (
    SELECT 1 FROM service_types st 
    WHERE 'pricing_service_' || st.code = ss.key
);

-- Message de fin
SELECT 'Diagnostic terminé !' as status;
