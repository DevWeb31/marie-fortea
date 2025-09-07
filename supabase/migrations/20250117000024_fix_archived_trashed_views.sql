-- Migration pour corriger les vues archived_booking_requests et trashed_booking_requests
-- Date: 2025-01-17
-- Objectif: Inclure la colonne estimated_total dans les vues archivées et corbeille

-- Supprimer les vues existantes
DROP VIEW IF EXISTS archived_booking_requests CASCADE;
DROP VIEW IF EXISTS trashed_booking_requests CASCADE;

-- Recréer la vue pour les réservations archivées avec toutes les colonnes
CREATE VIEW archived_booking_requests AS
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
WHERE deleted_at IS NULL AND archived_at IS NOT NULL;

-- Recréer la vue pour les réservations dans la corbeille avec toutes les colonnes
CREATE VIEW trashed_booking_requests AS
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
WHERE deleted_at IS NOT NULL;

-- Vérifier que les vues fonctionnent
SELECT 'Vues archived_booking_requests et trashed_booking_requests recréées avec succès' as status;
