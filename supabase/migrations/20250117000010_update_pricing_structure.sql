-- Migration pour mettre à jour la structure des prix
-- Date: 2025-01-17

-- Supprimer les anciens paramètres de prix de base et limites
DELETE FROM site_settings WHERE key IN (
  'pricing_base_hourly_rate',
  'pricing_minimum_amount',
  'pricing_maximum_daily_amount'
);

-- Mettre à jour les prix des services (remplacer les multiplicateurs par des prix directs)
UPDATE site_settings 
SET value = '15' 
WHERE key = 'pricing_service_babysitting';

UPDATE site_settings 
SET value = '18' 
WHERE key = 'pricing_service_event_support';

UPDATE site_settings 
SET value = '22.50' 
WHERE key = 'pricing_service_overnight_care';

UPDATE site_settings 
SET value = '19.50' 
WHERE key = 'pricing_service_weekend_care';

UPDATE site_settings 
SET value = '21' 
WHERE key = 'pricing_service_holiday_care';

UPDATE site_settings 
SET value = '27' 
WHERE key = 'pricing_service_emergency_care';

-- Mettre à jour la date de dernière modification
UPDATE site_settings 
SET value = NOW()::text, updated_at = NOW()
WHERE key = 'pricing_last_updated';
