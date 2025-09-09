-- Migration pour ajouter les champs RGPD
-- Date: 2025-01-17
-- Description: Ajout des champs nécessaires à la conformité RGPD

-- Ajouter les champs RGPD à la table booking_requests
ALTER TABLE public.booking_requests 
ADD COLUMN IF NOT EXISTS consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS consent_version VARCHAR(10) DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS data_retention_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deletion_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deletion_reason TEXT,
ADD COLUMN IF NOT EXISTS data_exported BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS data_exported_at TIMESTAMP WITH TIME ZONE;

-- Ajouter les champs RGPD à la table children_details
ALTER TABLE public.children_details 
ADD COLUMN IF NOT EXISTS consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS data_retention_until TIMESTAMP WITH TIME ZONE;

-- Créer une table pour les consentements RGPD
CREATE TABLE IF NOT EXISTS public.gdpr_consents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    consent_type VARCHAR(50) NOT NULL, -- 'necessary', 'functional', 'analytics', 'marketing'
    consent_given BOOLEAN NOT NULL,
    consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    consent_version VARCHAR(10) DEFAULT '1.0',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contraintes
    UNIQUE(user_email, consent_type, consent_date)
);

-- Créer une table pour les demandes de suppression
CREATE TABLE IF NOT EXISTS public.data_deletion_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20),
    deletion_reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer une table pour les exports de données
CREATE TABLE IF NOT EXISTS public.data_exports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    export_type VARCHAR(50) DEFAULT 'full' CHECK (export_type IN ('full', 'partial')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    file_path TEXT,
    file_size BIGINT,
    download_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer une table pour l'audit des accès aux données
CREATE TABLE IF NOT EXISTS public.data_access_audit (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email VARCHAR(255),
    action VARCHAR(50) NOT NULL, -- 'view', 'export', 'delete', 'modify'
    table_name VARCHAR(100),
    record_id UUID,
    accessed_by UUID REFERENCES auth.users(id),
    ip_address INET,
    user_agent TEXT,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_booking_requests_consent ON public.booking_requests(consent_given);
CREATE INDEX IF NOT EXISTS idx_booking_requests_deletion ON public.booking_requests(deletion_requested);
CREATE INDEX IF NOT EXISTS idx_booking_requests_retention ON public.booking_requests(data_retention_until);
CREATE INDEX IF NOT EXISTS idx_gdpr_consents_email ON public.gdpr_consents(user_email);
CREATE INDEX IF NOT EXISTS idx_gdpr_consents_type ON public.gdpr_consents(consent_type);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_email ON public.data_deletion_requests(user_email);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON public.data_deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_data_exports_email ON public.data_exports(user_email);
CREATE INDEX IF NOT EXISTS idx_data_exports_status ON public.data_exports(status);
CREATE INDEX IF NOT EXISTS idx_audit_email ON public.data_access_audit(user_email);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.data_access_audit(action);
CREATE INDEX IF NOT EXISTS idx_audit_date ON public.data_access_audit(accessed_at);

-- RLS (Row Level Security)
ALTER TABLE public.gdpr_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_audit ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour gdpr_consents
CREATE POLICY "Users can view own consents" ON public.gdpr_consents
    FOR SELECT USING (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert own consents" ON public.gdpr_consents
    FOR INSERT WITH CHECK (user_email = auth.jwt() ->> 'email');

-- Politiques RLS pour data_deletion_requests
CREATE POLICY "Users can view own deletion requests" ON public.data_deletion_requests
    FOR SELECT USING (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert own deletion requests" ON public.data_deletion_requests
    FOR INSERT WITH CHECK (user_email = auth.jwt() ->> 'email');

-- Politiques RLS pour data_exports
CREATE POLICY "Users can view own exports" ON public.data_exports
    FOR SELECT USING (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert own export requests" ON public.data_exports
    FOR INSERT WITH CHECK (user_email = auth.jwt() ->> 'email');

-- Politiques RLS pour data_access_audit (lecture seule pour les utilisateurs)
CREATE POLICY "Users can view own audit records" ON public.data_access_audit
    FOR SELECT USING (user_email = auth.jwt() ->> 'email');

-- Fonction pour calculer automatiquement la date de rétention
CREATE OR REPLACE FUNCTION calculate_data_retention_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculer la date de rétention (3 ans après la dernière prestation)
    NEW.data_retention_until = NEW.updated_at + INTERVAL '3 years';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour calculer automatiquement la date de rétention
CREATE TRIGGER trigger_calculate_retention_date
    BEFORE UPDATE ON public.booking_requests
    FOR EACH ROW
    EXECUTE FUNCTION calculate_data_retention_date();

-- Fonction pour nettoyer automatiquement les données expirées
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
    -- Marquer les réservations expirées pour suppression
    UPDATE public.booking_requests 
    SET deletion_requested = true,
        deletion_reason = 'Automatic cleanup - data retention period expired',
        deletion_requested_at = NOW()
    WHERE data_retention_until < NOW() 
    AND deletion_requested = false;
    
    -- Supprimer les détails des enfants des réservations expirées
    DELETE FROM public.children_details 
    WHERE booking_request_id IN (
        SELECT id FROM public.booking_requests 
        WHERE data_retention_until < NOW()
    );
    
    -- Supprimer les exports expirés
    DELETE FROM public.data_exports 
    WHERE expires_at < NOW();
    
    -- Nettoyer les anciens audits (garder 7 ans)
    DELETE FROM public.data_access_audit 
    WHERE accessed_at < NOW() - INTERVAL '7 years';
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer un export de données
CREATE OR REPLACE FUNCTION create_data_export(user_email_param VARCHAR(255))
RETURNS UUID AS $$
DECLARE
    export_id UUID;
    booking_count INTEGER;
BEGIN
    -- Créer l'enregistrement d'export
    INSERT INTO public.data_exports (user_email, status, expires_at)
    VALUES (user_email_param, 'pending', NOW() + INTERVAL '30 days')
    RETURNING id INTO export_id;
    
    -- Compter les réservations
    SELECT COUNT(*) INTO booking_count
    FROM public.booking_requests 
    WHERE parent_email = user_email_param;
    
    -- Mettre à jour le statut
    UPDATE public.data_exports 
    SET status = 'completed',
        completed_at = NOW(),
        file_size = booking_count * 1024 -- Estimation
    WHERE id = export_id;
    
    -- Enregistrer l'audit
    INSERT INTO public.data_access_audit (user_email, action, table_name, accessed_by)
    VALUES (user_email_param, 'export', 'booking_requests', auth.uid());
    
    RETURN export_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour traiter une demande de suppression
CREATE OR REPLACE FUNCTION process_deletion_request(request_id UUID, admin_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    request_record RECORD;
BEGIN
    -- Récupérer la demande
    SELECT * INTO request_record 
    FROM public.data_deletion_requests 
    WHERE id = request_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Marquer les réservations pour suppression
    UPDATE public.booking_requests 
    SET deletion_requested = true,
        deletion_requested_at = NOW(),
        deletion_reason = request_record.deletion_reason
    WHERE parent_email = request_record.user_email;
    
    -- Supprimer les détails des enfants
    DELETE FROM public.children_details 
    WHERE booking_request_id IN (
        SELECT id FROM public.booking_requests 
        WHERE parent_email = request_record.user_email
    );
    
    -- Mettre à jour le statut de la demande
    UPDATE public.data_deletion_requests 
    SET status = 'completed',
        processed_at = NOW(),
        processed_by = admin_user_id
    WHERE id = request_id;
    
    -- Enregistrer l'audit
    INSERT INTO public.data_access_audit (user_email, action, table_name, accessed_by)
    VALUES (request_record.user_email, 'delete', 'booking_requests', admin_user_id);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Commentaires sur les tables
COMMENT ON TABLE public.gdpr_consents IS 'Stockage des consentements RGPD par utilisateur et type';
COMMENT ON TABLE public.data_deletion_requests IS 'Demandes de suppression de données personnelles';
COMMENT ON TABLE public.data_exports IS 'Historique des exports de données personnelles';
COMMENT ON TABLE public.data_access_audit IS 'Audit des accès aux données personnelles';

-- Commentaires sur les colonnes importantes
COMMENT ON COLUMN public.booking_requests.consent_given IS 'Indique si le consentement RGPD a été donné';
COMMENT ON COLUMN public.booking_requests.consent_date IS 'Date du consentement RGPD';
COMMENT ON COLUMN public.booking_requests.data_retention_until IS 'Date limite de conservation des données';
COMMENT ON COLUMN public.booking_requests.deletion_requested IS 'Indique si une suppression a été demandée';
COMMENT ON COLUMN public.booking_requests.deletion_reason IS 'Raison de la demande de suppression';
