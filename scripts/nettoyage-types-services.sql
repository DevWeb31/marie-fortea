-- Script de nettoyage des types de services - Marie Fortea
-- Date: 2025-01-17
-- Objectif: Garder seulement les 4 types principaux de la page Services

-- ===== NETTOYAGE DES TYPES DE SERVICES =====

-- 1. Supprimer les types de services non désirés de la table service_types
DELETE FROM service_types WHERE code IN (
    'holiday_care',    -- Garde pendant les vacances
    'overnight_care',  -- Garde de nuit
    'weekend_care'     -- Garde de weekend (ancien)
);

-- 2. Insérer le bon type "Garde en soirée" avec le bon code
INSERT INTO service_types (code, name, description, base_price, min_duration_hours) VALUES
    ('evening_care', 'Garde en soirée', 'Garde d''enfants en soirée - à partir de 18h, tarif nuit à partir de 22h', 20.00, 3)
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    base_price = EXCLUDED.base_price,
    min_duration_hours = EXCLUDED.min_duration_hours;

-- 3. Supprimer les paramètres de prix des services non désirés
DELETE FROM site_settings WHERE key IN (
    'pricing_service_holiday_care',    -- Garde pendant les vacances
    'pricing_service_overnight_care', -- Garde de nuit
    'pricing_service_weekend_care'    -- Garde de weekend (ancien)
);

-- 4. Ajouter le paramètre de prix pour "Garde en soirée"
INSERT INTO site_settings (key, value, updated_at) VALUES
    ('pricing_service_evening_care', '20', NOW())
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- 5. Mettre à jour la date de dernière modification
UPDATE site_settings 
SET value = NOW()::text, updated_at = NOW()
WHERE key = 'pricing_last_updated';

-- 6. Vérification des types de services finaux
SELECT '=== TYPES DE SERVICES FINAUX ===' as section;
SELECT 
    code,
    name,
    description,
    base_price,
    min_duration_hours
FROM service_types 
ORDER BY code;

-- 7. Vérification des paramètres de prix finaux
SELECT '=== PARAMÈTRES DE PRIX FINAUX ===' as section;
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
WHERE key LIKE 'pricing_service_%' 
ORDER BY key;

-- 8. Résumé des services conservés
SELECT '=== RÉSUMÉ DES SERVICES CONSERVÉS ===' as section;
SELECT 
    'Garde d''enfants' as service,
    'babysitting' as code,
    '20€/heure' as prix,
    'Journée entière ou demi-journée' as description
UNION ALL
SELECT 
    'Soutien événementiel' as service,
    'event_support' as code,
    '25€/heure' as prix,
    'Tarif de nuit à partir de 22h' as description
UNION ALL
SELECT 
    'Garde en soirée' as service,
    'evening_care' as code,
    '20€/heure' as prix,
    'À partir de 18h, tarif nuit à partir de 22h' as description
UNION ALL
SELECT 
    'Garde d''urgence' as service,
    'emergency_care' as code,
    '40€/heure' as prix,
    'Disponibilité rapide' as description
ORDER BY service;

-- Message de confirmation
SELECT 'Nettoyage terminé avec succès !' as status;
SELECT 'Seuls les 4 types principaux de la page Services sont conservés.' as message;
