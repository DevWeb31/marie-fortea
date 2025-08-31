-- Migration pour ajouter les paramètres de prix par défaut
-- Date: 2025-01-17

-- Supplément par enfant supplémentaire (à partir du 3ème enfant)
INSERT INTO site_settings (key, value, updated_at) 
VALUES ('pricing_additional_child_rate', '5', NOW())
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- Prix directs par type de service
INSERT INTO site_settings (key, value, updated_at) 
VALUES 
  ('pricing_service_babysitting', '15', NOW()),
  ('pricing_service_event_support', '18', NOW()),
  ('pricing_service_overnight_care', '22.50', NOW()),
  ('pricing_service_weekend_care', '19.50', NOW()),
  ('pricing_service_holiday_care', '21', NOW()),
  ('pricing_service_emergency_care', '27', NOW())
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- Date de dernière mise à jour
INSERT INTO site_settings (key, value, updated_at) 
VALUES ('pricing_last_updated', NOW()::text, NOW())
ON CONFLICT (key) DO UPDATE SET 
  value = NOW()::text,
  updated_at = NOW();
