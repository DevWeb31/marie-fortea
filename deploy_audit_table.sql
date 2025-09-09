-- Script pour déployer la table data_access_audit en production
-- À exécuter directement sur la base de données de production

-- Créer la table d'audit des accès aux données
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

-- Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_audit_action ON data_access_audit(action);
CREATE INDEX IF NOT EXISTS idx_audit_date ON data_access_audit(accessed_at);
CREATE INDEX IF NOT EXISTS idx_audit_email ON data_access_audit(user_email);
CREATE INDEX IF NOT EXISTS idx_audit_table ON data_access_audit(table_name);

-- Créer la contrainte de clé étrangère pour accessed_by (optionnel)
-- ALTER TABLE data_access_audit ADD CONSTRAINT data_access_audit_accessed_by_fkey 
-- FOREIGN KEY (accessed_by) REFERENCES auth.users(id);

-- Activer RLS
ALTER TABLE data_access_audit ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
DROP POLICY IF EXISTS "Allow audit insert" ON data_access_audit;
CREATE POLICY "Allow audit insert" ON data_access_audit
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own audit records" ON data_access_audit;
CREATE POLICY "Users can view own audit records" ON data_access_audit
    FOR SELECT USING (true);

-- Ajouter les commentaires
COMMENT ON TABLE data_access_audit IS 'Table d''audit pour tracer les accès aux données personnelles';
COMMENT ON COLUMN data_access_audit.user_email IS 'Email de l''utilisateur concerné par l''action';
COMMENT ON COLUMN data_access_audit.action IS 'Type d''action effectuée (export, delete_request, etc.)';
COMMENT ON COLUMN data_access_audit.table_name IS 'Nom de la table concernée par l''action';
COMMENT ON COLUMN data_access_audit.record_id IS 'ID de l''enregistrement concerné';
COMMENT ON COLUMN data_access_audit.accessed_by IS 'ID de l''utilisateur qui a effectué l''action';
COMMENT ON COLUMN data_access_audit.ip_address IS 'Adresse IP de la requête';
COMMENT ON COLUMN data_access_audit.user_agent IS 'User agent du navigateur';
COMMENT ON COLUMN data_access_audit.accessed_at IS 'Date et heure de l''action';
COMMENT ON COLUMN data_access_audit.metadata IS 'Métadonnées supplémentaires au format JSON';
