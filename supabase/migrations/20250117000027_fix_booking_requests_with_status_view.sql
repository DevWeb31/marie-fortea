-- Migration pour corriger la vue booking_requests_with_status
-- Date: 2025-01-17
-- Objectif: S'assurer que la vue booking_requests_with_status inclut correctement la durée

-- Supprimer la vue existante
DROP VIEW IF EXISTS booking_requests_with_status CASCADE;

-- Recréer la vue avec toutes les colonnes nécessaires
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
    br.duration_hours,
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
    bs.code as status_code,
    bs.name as status_name,
    bs.color as status_color,
    bs.icon as status_icon,
    bs.description as status_description,
    -- Informations de service
    st.name as service_name,
    st.base_price
FROM booking_requests br
LEFT JOIN booking_statuses bs ON br.status_id = bs.id
LEFT JOIN service_types st ON br.service_type = st.code
WHERE br.deleted_at IS NULL
ORDER BY br.created_at DESC;

-- Vérifier que la vue fonctionne
SELECT 
    'Vue booking_requests_with_status recréée avec succès' as status,
    COUNT(*) as total_records
FROM booking_requests_with_status;
