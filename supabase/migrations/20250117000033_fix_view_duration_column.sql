-- Migration pour corriger spécifiquement la vue booking_requests_with_status
-- Date: 2025-01-17
-- Objectif: S'assurer que la vue retourne bien la colonne duration_hours

-- 1. Vérifier la structure actuelle de la vue
SELECT 
    'Structure actuelle de la vue' as info,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'booking_requests_with_status' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Supprimer et recréer la vue avec une approche plus simple
DROP VIEW IF EXISTS booking_requests_with_status CASCADE;

-- Recréer la vue en s'assurant que duration_hours est bien inclus
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
    br.duration_hours,  -- S'assurer que cette colonne est bien incluse
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

-- 3. Tester la vue
SELECT 
    'Test de la vue recréée' as info,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours IS NULL THEN 1 END) as null_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests_with_status;

-- 4. Afficher quelques exemples de la vue
SELECT 
    'Exemples de la vue recréée' as examples,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    status_name
FROM booking_requests_with_status 
ORDER BY created_at DESC 
LIMIT 3;

-- 5. Vérifier que la colonne duration_hours est bien dans la vue
SELECT 
    'Vérification des colonnes de la vue' as verification,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'booking_requests_with_status' 
AND column_name = 'duration_hours'
AND table_schema = 'public';

-- Message de confirmation
SELECT 'Vue booking_requests_with_status recréée avec duration_hours' as final_status;
