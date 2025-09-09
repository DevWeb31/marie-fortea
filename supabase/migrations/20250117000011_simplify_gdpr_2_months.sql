-- Migration pour simplifier le RGPD - Conservation 2 mois
-- Date: 2025-01-17
-- Description: Simplification de la politique de conservation à 2 mois

-- Mettre à jour la fonction de calcul de rétention pour 2 mois
CREATE OR REPLACE FUNCTION calculate_data_retention_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculer la date de rétention (2 mois après la dernière prestation)
    NEW.data_retention_until = NEW.updated_at + INTERVAL '2 months';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Mettre à jour la fonction de nettoyage pour 2 mois
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
    -- Marquer les réservations expirées pour suppression (2 mois)
    UPDATE public.booking_requests 
    SET deletion_requested = true,
        deletion_reason = 'Automatic cleanup - 2 months retention period expired',
        deletion_requested_at = NOW()
    WHERE data_retention_until < NOW() 
    AND deletion_requested = false;
    
    -- Supprimer les détails des enfants des réservations expirées
    DELETE FROM public.children_details 
    WHERE booking_request_id IN (
        SELECT id FROM public.booking_requests 
        WHERE data_retention_until < NOW()
    );
    
    -- Supprimer les exports expirés (30 jours)
    DELETE FROM public.data_exports 
    WHERE expires_at < NOW();
    
    -- Nettoyer les anciens audits (garder 1 an au lieu de 7 ans)
    DELETE FROM public.data_access_audit 
    WHERE accessed_at < NOW() - INTERVAL '1 year';
    
    -- Nettoyer les anciens consentements (garder 1 an)
    DELETE FROM public.gdpr_consents 
    WHERE consent_date < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Mettre à jour les commentaires
COMMENT ON FUNCTION calculate_data_retention_date() IS 'Calcule la date de rétention à 2 mois après la dernière prestation';
COMMENT ON FUNCTION cleanup_expired_data() IS 'Nettoie les données expirées selon la politique de 2 mois';

-- Mettre à jour les commentaires des tables
COMMENT ON TABLE public.gdpr_consents IS 'Stockage des consentements RGPD - Conservation 1 an';
COMMENT ON TABLE public.data_deletion_requests IS 'Demandes de suppression - Traitement immédiat';
COMMENT ON TABLE public.data_exports IS 'Exports de données - Conservation 30 jours';
COMMENT ON TABLE public.data_access_audit IS 'Audit des accès - Conservation 1 an';

-- Ajouter un index pour optimiser les requêtes de nettoyage
CREATE INDEX IF NOT EXISTS idx_booking_requests_retention_cleanup 
ON public.booking_requests(data_retention_until) 
WHERE deletion_requested = false;

-- Créer une vue pour les données à nettoyer
CREATE OR REPLACE VIEW data_to_cleanup AS
SELECT 
    br.id,
    br.parent_email,
    br.parent_name,
    br.service_type,
    br.requested_date,
    br.data_retention_until,
    br.deletion_requested,
    CASE 
        WHEN br.data_retention_until < NOW() THEN 'Expired'
        WHEN br.data_retention_until < NOW() + INTERVAL '7 days' THEN 'Expires soon'
        ELSE 'Active'
    END as retention_status
FROM public.booking_requests br
WHERE br.deletion_requested = false
ORDER BY br.data_retention_until ASC;

-- Commentaire sur la vue
COMMENT ON VIEW data_to_cleanup IS 'Vue des données en cours de conservation avec statut de rétention';

-- Créer une fonction pour obtenir le résumé de conservation
CREATE OR REPLACE FUNCTION get_retention_summary()
RETURNS TABLE (
    total_active_records BIGINT,
    expired_records BIGINT,
    expiring_soon_records BIGINT,
    next_cleanup_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_active_records,
        COUNT(*) FILTER (WHERE data_retention_until < NOW()) as expired_records,
        COUNT(*) FILTER (WHERE data_retention_until < NOW() + INTERVAL '7 days' AND data_retention_until >= NOW()) as expiring_soon_records,
        MIN(data_retention_until) as next_cleanup_date
    FROM public.booking_requests 
    WHERE deletion_requested = false;
END;
$$ LANGUAGE plpgsql;

-- Commentaire sur la fonction
COMMENT ON FUNCTION get_retention_summary() IS 'Retourne un résumé de la conservation des données';

-- Mettre à jour les politiques de rétention dans les commentaires
COMMENT ON COLUMN public.booking_requests.data_retention_until IS 'Date limite de conservation - 2 mois après la dernière prestation';
COMMENT ON COLUMN public.booking_requests.deletion_reason IS 'Raison de la suppression - automatique après 2 mois ou demande utilisateur';
