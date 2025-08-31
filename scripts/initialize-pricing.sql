-- Script d'initialisation des prix par défaut
-- Ce script insère les prix de base dans la table site_settings

-- Prix de base par heure
INSERT INTO site_settings (key, value, updated_at) 
VALUES ('pricing_base_hourly_rate', '15', NOW())
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- Supplément par enfant supplémentaire
INSERT INTO site_settings (key, value, updated_at) 
VALUES ('pricing_additional_child_rate', '5', NOW())
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- Montant minimum de réservation
INSERT INTO site_settings (key, value, updated_at) 
VALUES ('pricing_minimum_amount', '20', NOW())
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- Montant maximum quotidien
INSERT INTO site_settings (key, value, updated_at) 
VALUES ('pricing_maximum_daily_amount', '200', NOW())
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- Multiplicateurs par type de service
INSERT INTO site_settings (key, value, updated_at) 
VALUES 
  ('pricing_service_babysitting', '1.0', NOW()),
  ('pricing_service_event_support', '1.2', NOW()),
  ('pricing_service_overnight_care', '1.5', NOW()),
  ('pricing_service_weekend_care', '1.3', NOW()),
  ('pricing_service_holiday_care', '1.4', NOW()),
  ('pricing_service_emergency_care', '1.8', NOW())
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- Date de dernière mise à jour
INSERT INTO site_settings (key, value, updated_at) 
VALUES ('pricing_last_updated', NOW()::text, NOW())
ON CONFLICT (key) DO UPDATE SET 
  value = NOW()::text,
  updated_at = NOW();

-- Afficher les prix configurés
SELECT 
  key,
  value,
  updated_at
FROM site_settings 
WHERE key LIKE 'pricing_%'
ORDER BY key;
