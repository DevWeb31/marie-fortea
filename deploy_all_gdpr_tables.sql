-- Script complet pour déployer toutes les tables GDPR manquantes en production
-- À exécuter directement sur la base de données de production

-- 1. Table d'audit des accès aux données
CREATE TABLE IF NOT EXISTS data_access_audit (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email VARCHAR(255),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    accessed_by UUID,
    ip_address INET,
    user_agent TEXT,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Index pour data_access_audit
CREATE INDEX IF NOT EXISTS idx_audit_action ON data_access_audit(action);
CREATE INDEX IF NOT EXISTS idx_audit_date ON data_access_audit(accessed_at);
CREATE INDEX IF NOT EXISTS idx_audit_email ON data_access_audit(user_email);
CREATE INDEX IF NOT EXISTS idx_audit_table ON data_access_audit(table_name);

-- RLS pour data_access_audit
ALTER TABLE data_access_audit ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow audit insert" ON data_access_audit;
CREATE POLICY "Allow audit insert" ON data_access_audit FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view own audit records" ON data_access_audit;
CREATE POLICY "Users can view own audit records" ON data_access_audit FOR SELECT USING (true);

-- 2. Table des exports de données
CREATE TABLE IF NOT EXISTS data_exports (
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

-- Index pour data_exports
CREATE INDEX IF NOT EXISTS idx_data_exports_email ON data_exports(user_email);
CREATE INDEX IF NOT EXISTS idx_data_exports_status ON data_exports(status);

-- RLS pour data_exports
ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow export insert" ON data_exports;
CREATE POLICY "Allow export insert" ON data_exports FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow export select" ON data_exports;
CREATE POLICY "Allow export select" ON data_exports FOR SELECT USING (true);

-- 3. Table des demandes de suppression
CREATE TABLE IF NOT EXISTS data_deletion_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20),
    deletion_reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour data_deletion_requests
CREATE INDEX IF NOT EXISTS idx_deletion_requests_email ON data_deletion_requests(user_email);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON data_deletion_requests(status);

-- RLS pour data_deletion_requests
ALTER TABLE data_deletion_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow deletion insert" ON data_deletion_requests;
CREATE POLICY "Allow deletion insert" ON data_deletion_requests FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow deletion select" ON data_deletion_requests;
CREATE POLICY "Allow deletion select" ON data_deletion_requests FOR SELECT USING (true);

-- 4. Table des consentements GDPR
CREATE TABLE IF NOT EXISTS gdpr_consents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    consent_type VARCHAR(50) NOT NULL,
    consent_given BOOLEAN NOT NULL,
    consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    consent_version VARCHAR(10) DEFAULT '1.0',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour gdpr_consents
CREATE INDEX IF NOT EXISTS idx_gdpr_consents_email ON gdpr_consents(user_email);
CREATE INDEX IF NOT EXISTS idx_gdpr_consents_type ON gdpr_consents(consent_type);
CREATE INDEX IF NOT EXISTS idx_gdpr_consents_date ON gdpr_consents(consent_date);

-- RLS pour gdpr_consents
ALTER TABLE gdpr_consents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow consent insert" ON gdpr_consents;
CREATE POLICY "Allow consent insert" ON gdpr_consents FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow consent select" ON gdpr_consents;
CREATE POLICY "Allow consent select" ON gdpr_consents FOR SELECT USING (true);

-- 5. Table des tokens de téléchargement sécurisés (déjà créée, mais on s'assure qu'elle existe)
CREATE TABLE IF NOT EXISTS secure_download_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    token VARCHAR(128) NOT NULL UNIQUE,
    user_email VARCHAR(255) NOT NULL,
    export_type VARCHAR(20) DEFAULT 'full' CHECK (export_type IN ('full', 'partial')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour secure_download_tokens
CREATE INDEX IF NOT EXISTS idx_secure_download_tokens_token ON secure_download_tokens(token);
CREATE INDEX IF NOT EXISTS idx_secure_download_tokens_user_email ON secure_download_tokens(user_email);
CREATE INDEX IF NOT EXISTS idx_secure_download_tokens_expires_at ON secure_download_tokens(expires_at);

-- RLS pour secure_download_tokens
ALTER TABLE secure_download_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow token validation" ON secure_download_tokens;
CREATE POLICY "Allow token validation" ON secure_download_tokens FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow token creation" ON secure_download_tokens;
CREATE POLICY "Allow token creation" ON secure_download_tokens FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow token updates" ON secure_download_tokens;
CREATE POLICY "Allow token updates" ON secure_download_tokens FOR UPDATE USING (true);

-- Ajouter les commentaires
COMMENT ON TABLE data_access_audit IS 'Table d''audit pour tracer les accès aux données personnelles';
COMMENT ON TABLE data_exports IS 'Table pour gérer les exports de données personnelles';
COMMENT ON TABLE data_deletion_requests IS 'Table pour gérer les demandes de suppression de données';
COMMENT ON TABLE gdpr_consents IS 'Table pour gérer les consentements GDPR';
COMMENT ON TABLE secure_download_tokens IS 'Table pour gérer les tokens de téléchargement sécurisés';
