-- Script de synchronisation des types de services - Marie Fortea
-- Date: 2025-01-17
-- Objectif: Aligner les types de services entre les différentes tables et la page Services

-- ===== ÉTAPE 1: Mise à jour de la table service_types =====

-- Supprimer les anciens types de services
DELETE FROM service_types;

-- Insérer les nouveaux types alignés avec la page Services
INSERT INTO service_types (code, name, description, base_price, min_duration_hours) VALUES
    ('babysitting', 'Garde d''enfants', 'Garde d''enfants professionnelle - journée entière ou demi-journée', 20.00, 3),
    ('event_support', 'Soutien événementiel', 'Garde d''enfants pour événements - tarif de nuit à partir de 22h', 25.00, 4),
    ('weekend_care', 'Garde en soirée', 'Garde d''enfants en soirée - à partir de 18h, tarif nuit à partir de 22h', 20.00, 3),
    ('emergency_care', 'Garde d''urgence', 'Garde d''enfants en urgence - disponibilité rapide', 40.00, 2),
    ('overnight_care', 'Garde de nuit', 'Garde d''enfants nocturne', 22.50, 4),
    ('holiday_care', 'Garde pendant les vacances', 'Garde d''enfants pendant les vacances', 21.00, 2)
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    base_price = EXCLUDED.base_price,
    min_duration_hours = EXCLUDED.min_duration_hours;

-- ===== ÉTAPE 2: Mise à jour des paramètres de prix dans site_settings =====

-- Mettre à jour les prix pour correspondre à la page Services
UPDATE site_settings 
SET value = '20', updated_at = NOW()
WHERE key = 'pricing_service_babysitting';

UPDATE site_settings 
SET value = '25', updated_at = NOW()
WHERE key = 'pricing_service_event_support';

UPDATE site_settings 
SET value = '20', updated_at = NOW()
WHERE key = 'pricing_service_weekend_care';

UPDATE site_settings 
SET value = '40', updated_at = NOW()
WHERE key = 'pricing_service_emergency_care';

UPDATE site_settings 
SET value = '22.50', updated_at = NOW()
WHERE key = 'pricing_service_overnight_care';

UPDATE site_settings 
SET value = '21', updated_at = NOW()
WHERE key = 'pricing_service_holiday_care';

-- Mettre à jour la date de dernière modification
UPDATE site_settings 
SET value = NOW()::text, updated_at = NOW()
WHERE key = 'pricing_last_updated';

-- ===== ÉTAPE 3: Vérification et rapport =====

-- Afficher les types de services mis à jour
SELECT 'Types de services mis à jour:' as info;
SELECT code, name, base_price, min_duration_hours FROM service_types ORDER BY code;

-- Afficher les paramètres de prix mis à jour
SELECT 'Paramètres de prix mis à jour:' as info;
SELECT key, value FROM site_settings WHERE key LIKE 'pricing_service_%' ORDER BY key;

-- Afficher les demandes de réservation existantes avec leurs types de services
SELECT 'Demandes de réservation existantes:' as info;
SELECT 
    service_type,
    COUNT(*) as nombre_demandes,
    MIN(created_at) as premiere_demande,
    MAX(created_at) as derniere_demande
FROM booking_requests 
GROUP BY service_type 
ORDER BY nombre_demandes DESC;

-- Message de confirmation
SELECT 'Synchronisation terminée avec succès !' as status;
