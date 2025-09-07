-- Migration pour corriger la vue pour utiliser la colonne duration_hours_fixed
-- Date: 2025-01-17
-- Objectif: Mettre à jour la vue booking_requests_with_status pour utiliser duration_hours_fixed

-- 1. Vérifier l'état actuel de la vue
SELECT 
    'État actuel de la vue' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests_with_status;

-- 2. Afficher quelques exemples de la vue actuelle
SELECT 
    'Exemples de la vue actuelle' as examples,
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

-- 3. Recréer la vue pour utiliser duration_hours_fixed
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
    br.duration_hours_fixed as duration_hours,  -- Utiliser la colonne corrigée
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

-- 4. Vérifier l'état après correction de la vue
SELECT 
    'État après correction de la vue' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests_with_status;

-- 5. Afficher les exemples après correction
SELECT 
    'Exemples après correction de la vue' as examples,
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
SELECT 'Vue booking_requests_with_status corrigée pour utiliser duration_hours_fixed' as final_status;
