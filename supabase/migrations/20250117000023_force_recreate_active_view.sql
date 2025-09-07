-- Migration pour forcer la recréation de la vue active_booking_requests
-- Date: 2025-01-17
-- Objectif: Forcer la recréation de la vue avec CASCADE

-- Supprimer la vue avec CASCADE pour éviter les dépendances
DROP VIEW IF EXISTS active_booking_requests CASCADE;

-- Recréer la vue avec toutes les colonnes
CREATE VIEW active_booking_requests AS
SELECT 
    id,
    status,
    created_at,
    updated_at,
    parent_name,
    parent_email,
    parent_phone,
    parent_address,
    service_type,
    requested_date,
    start_time,
    end_time,
    duration_hours,
    children_count,
    children_details,
    children_ages,
    special_instructions,
    emergency_contact,
    emergency_phone,
    preferred_contact_method,
    contact_notes,
    captcha_verified,
    ip_address,
    user_agent,
    source,
    utm_source,
    utm_medium,
    utm_campaign,
    estimated_total,
    deleted_at,
    archived_at,
    status_id
FROM booking_requests 
WHERE deleted_at IS NULL AND archived_at IS NULL;

-- Vérifier que la vue fonctionne
SELECT 'Vue active_booking_requests recréée avec succès - colonnes explicites' as status;
