-- Migration pour ajouter la configuration des tarifs de nuit
-- Date: 2025-01-17
-- Objectif: Activer les tarifs de nuit pour "Soutien événementiel" et "Garde en soirée"

-- Ajouter la configuration pour activer les tarifs de nuit
INSERT INTO site_settings (key, value, updated_at)
VALUES 
  ('pricing_service_event_support_has_night', 'true', NOW()),
  ('pricing_service_evening_care_has_night', 'true', NOW())
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Ajouter les prix de nuit par défaut si ils n'existent pas
INSERT INTO site_settings (key, value, updated_at)
VALUES 
  ('pricing_service_event_support_night', '30', NOW()),
  ('pricing_service_evening_care_night', '25', NOW())
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Vérifier que les paramètres ont été ajoutés
SELECT 'Configuration des tarifs de nuit ajoutée avec succès' as status;
