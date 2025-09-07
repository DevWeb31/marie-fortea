-- Migration pour ajouter la colonne estimated_total à la table booking_requests
-- Date: 2025-01-17
-- Objectif: Stocker le prix estimé calculé lors de la soumission du formulaire

-- Ajouter la colonne estimated_total
ALTER TABLE booking_requests 
ADD COLUMN estimated_total DECIMAL(10,2) DEFAULT 0.00;

-- Commentaire sur la colonne
COMMENT ON COLUMN booking_requests.estimated_total IS 'Prix estimé calculé lors de la soumission de la demande de réservation';

-- Supprimer la vue existante et la recréer avec la nouvelle colonne
DROP VIEW IF EXISTS booking_requests_with_status;

-- Recréer la vue booking_requests_with_status pour utiliser la colonne stockée
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
    bs.id as status_id,
    bs.code as status_code,
    bs.name as status_name,
    bs.color as status_color,
    bs.icon as status_icon,
    bs.description as status_description,
    bs.sort_order as status_sort_order,
    st.name as service_name,
    st.base_price
FROM booking_requests br
LEFT JOIN booking_statuses bs ON br.status_id = bs.id
LEFT JOIN service_types st ON br.service_type = st.code
WHERE br.deleted_at IS NULL;
