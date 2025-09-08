-- Migration pour corriger la durée sans supprimer la colonne
-- Date: 2025-01-17
-- Objectif: Corriger le calcul de durée sans supprimer la colonne GENERATED

-- 1. Vérifier l'état actuel
SELECT 
    'État avant correction' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 2. Afficher les exemples problématiques
SELECT 
    'Exemples problématiques' as examples,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours
FROM booking_requests 
WHERE deleted_at IS NULL 
AND duration_hours < 0
ORDER BY created_at DESC 
LIMIT 5;

-- 3. SOLUTION ALTERNATIVE : Créer une nouvelle colonne temporaire
-- Ajouter une colonne temporaire pour calculer la durée correcte
ALTER TABLE booking_requests 
ADD COLUMN IF NOT EXISTS duration_hours_fixed DECIMAL(4,2) 
GENERATED ALWAYS AS (calculate_duration_hours_corrected(start_time, end_time)) STORED;

-- 4. Vérifier que la nouvelle colonne fonctionne
SELECT 
    'Test de la nouvelle colonne' as test,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours_fixed < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours_fixed = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours_fixed > 0 THEN 1 END) as valid_durations
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 5. Afficher les exemples avec la nouvelle colonne
SELECT 
    'Exemples avec la nouvelle colonne' as examples,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours as old_duration,
    duration_hours_fixed as new_duration,
    CASE 
        WHEN duration_hours_fixed < 0 THEN '❌ NÉGATIF'
        WHEN duration_hours_fixed = 0 THEN '❌ ZERO'
        WHEN duration_hours_fixed > 0 THEN '✅ OK'
        ELSE '❌ PROBLÈME'
    END as status
FROM booking_requests 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 5;

-- 6. Recréer la vue booking_requests_with_status avec la nouvelle colonne
DROP VIEW IF EXISTS booking_requests_with_status CASCADE;

CREATE VIEW booking_requests_with_status AS
SELECT 
    br.id,
    br.status,
    br.created_at,
    br.updated_at,
    br.parent_name,
    br.parent_email,
    br.parent_phone,
    br.parent_address,
    br.service_type,
    br.requested_date,
    br.start_time,
    br.end_time,
    br.duration_hours_fixed as duration_hours,  -- Utiliser la nouvelle colonne
    br.children_count,
    br.children_details,
    br.children_ages,
    br.special_instructions,
    br.emergency_contact,
    br.emergency_phone,
    br.preferred_contact_method,
    br.contact_notes,
    br.captcha_verified,
    br.ip_address,
    br.user_agent,
    br.source,
    br.utm_source,
    br.utm_medium,
    br.utm_campaign,
    br.estimated_total,
    br.deleted_at,
    br.archived_at,
    br.status_id,
    -- Informations de statut
    COALESCE(bs.code, 'pending') as status_code,
    COALESCE(bs.name, 'En attente') as status_name,
    COALESCE(bs.color, '#6b7280') as status_color,
    COALESCE(bs.icon, 'clock') as status_icon,
    COALESCE(bs.description, 'Demande en attente de traitement') as status_description,
    -- Informations de service
    COALESCE(st.name, 'Service personnalisé') as service_name,
    COALESCE(st.base_price, 20.00) as base_price
FROM booking_requests br
LEFT JOIN booking_statuses bs ON br.status_id = bs.id
LEFT JOIN service_types st ON br.service_type = st.code
WHERE br.deleted_at IS NULL
ORDER BY br.created_at DESC;

-- 7. Tester la vue avec la nouvelle colonne
SELECT 
    'Test de la vue avec la nouvelle colonne' as test,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests_with_status;

-- 8. Afficher les exemples de la vue
SELECT 
    'Exemples de la vue' as examples,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    CASE 
        WHEN duration_hours < 0 THEN '❌ NÉGATIF'
        WHEN duration_hours = 0 THEN '❌ ZERO'
        WHEN duration_hours > 0 THEN '✅ OK'
        ELSE '❌ PROBLÈME'
    END as status
FROM booking_requests_with_status 
ORDER BY created_at DESC 
LIMIT 5;

-- Message final
SELECT 'Correction de la durée avec nouvelle colonne terminée' as final_status;
