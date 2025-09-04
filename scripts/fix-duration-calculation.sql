-- Script de correction du calcul de durée et montant
-- Date: 2025-01-17
-- Description: Corrige le calcul de la durée pour les gardes de nuit

-- 1. Créer la fonction de calcul corrigée
CREATE OR REPLACE FUNCTION calculate_duration_hours_corrected(start_time TIME, end_time TIME)
RETURNS DECIMAL(4,2) AS $$
BEGIN
    -- Si l'heure de fin est avant l'heure de début, c'est le lendemain
    IF end_time <= start_time THEN
        -- Ajouter 24 heures pour le passage à minuit
        RETURN EXTRACT(EPOCH FROM (end_time + INTERVAL '24 hours' - start_time)) / 3600;
    ELSE
        -- Même jour
        RETURN EXTRACT(EPOCH FROM (end_time - start_time)) / 3600;
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Mettre à jour la vue booking_requests_with_status pour inclure le montant
CREATE OR REPLACE VIEW booking_requests_with_status AS
SELECT 
    br.*,
    bs.code as status_code,
    bs.name as status_name,
    bs.color as status_color,
    bs.icon as status_icon,
    bs.description as status_description,
    st.name as service_name,
    st.base_price,
    (st.base_price * br.duration_hours) as estimated_total
FROM booking_requests br
JOIN booking_statuses bs ON br.status_id = bs.id
LEFT JOIN service_types st ON br.service_type = st.code
WHERE br.deleted_at IS NULL
ORDER BY br.created_at DESC;

-- 3. Mettre à jour la vue booking_requests_summary
CREATE OR REPLACE VIEW booking_requests_summary AS
SELECT 
    br.id,
    br.status,
    br.created_at,
    br.parent_name,
    br.parent_phone,
    br.service_type,
    br.requested_date,
    br.start_time,
    br.end_time,
    br.duration_hours,
    br.children_count,
    st.name as service_name,
    st.base_price,
    (st.base_price * br.duration_hours) as estimated_total
FROM booking_requests br
LEFT JOIN service_types st ON br.service_type = st.code
ORDER BY br.created_at DESC;

-- 4. Vérifier les données existantes
SELECT 
    id,
    start_time,
    end_time,
    duration_hours,
    service_type,
    (SELECT base_price FROM service_types WHERE code = br.service_type) as base_price,
    ((SELECT base_price FROM service_types WHERE code = br.service_type) * duration_hours) as calculated_total
FROM booking_requests br
WHERE end_time < start_time
ORDER BY created_at DESC
LIMIT 10;

-- Message de confirmation
SELECT 'Correction du calcul de durée appliquée avec succès !' as status;
