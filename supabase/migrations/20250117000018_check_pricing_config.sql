-- Migration pour vérifier la configuration des prix
-- Date: 2025-01-17
-- Objectif: Vérifier et créer la configuration des prix si nécessaire

-- Vérifier si la table pricing_config existe et contient des données
DO $$
BEGIN
    -- Vérifier si la table existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pricing_config') THEN
        RAISE NOTICE 'Table pricing_config existe';
        
        -- Vérifier le contenu
        IF EXISTS (SELECT 1 FROM pricing_config LIMIT 1) THEN
            RAISE NOTICE 'Configuration des prix trouvée';
            -- Afficher la configuration
            PERFORM * FROM pricing_config;
        ELSE
            RAISE NOTICE 'Aucune configuration des prix trouvée - création d''une configuration par défaut';
            
            -- Créer une configuration par défaut
            INSERT INTO pricing_config (
                service_prices,
                additional_child_rate,
                night_rate_multiplier,
                weekend_rate_multiplier,
                created_at,
                updated_at
            ) VALUES (
                '{
                    "babysitting": 20,
                    "event_support": 25,
                    "evening_care": 20,
                    "emergency_care": 40
                }'::jsonb,
                5.0,
                1.5,
                1.2,
                NOW(),
                NOW()
            );
            
            RAISE NOTICE 'Configuration par défaut créée';
        END IF;
    ELSE
        RAISE NOTICE 'Table pricing_config n''existe pas';
    END IF;
END $$;

-- Vérifier les paramètres de site
SELECT 'Paramètres de site:' as info;
SELECT key, value FROM site_settings WHERE key LIKE '%pricing%' OR key LIKE '%price%';

-- Vérifier les types de services
SELECT 'Types de services:' as info;
SELECT code, name, base_price FROM service_types;
