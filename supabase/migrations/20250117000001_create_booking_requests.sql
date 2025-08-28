-- Migration pour créer la table des demandes de réservation
-- Date: 2025-01-17

-- Table principale des demandes de réservation
CREATE TABLE IF NOT EXISTS booking_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Informations de base
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Informations des parents
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255),
    parent_phone VARCHAR(20) NOT NULL,
    parent_address TEXT NOT NULL,
    
    -- Détails de la demande
    service_type VARCHAR(50) NOT NULL,
    requested_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours DECIMAL(4,2) GENERATED ALWAYS AS (
        EXTRACT(EPOCH FROM (end_time - start_time)) / 3600
    ) STORED,
    
    -- Informations sur les enfants
    children_count INTEGER NOT NULL CHECK (children_count > 0 AND children_count <= 10),
    children_details TEXT NOT NULL,
    children_ages TEXT,
    
    -- Informations supplémentaires
    special_instructions TEXT,
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    
    -- Informations de contact
    preferred_contact_method VARCHAR(20) DEFAULT 'phone' CHECK (preferred_contact_method IN ('phone', 'email', 'sms')),
    contact_notes TEXT,
    
    -- Validation et sécurité
    captcha_verified BOOLEAN DEFAULT FALSE,
    ip_address INET,
    user_agent TEXT,
    
    -- Métadonnées
    source VARCHAR(50) DEFAULT 'website',
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_date ON booking_requests(requested_date);
CREATE INDEX IF NOT EXISTS idx_booking_requests_created_at ON booking_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_booking_requests_parent_phone ON booking_requests(parent_phone);
CREATE INDEX IF NOT EXISTS idx_booking_requests_service_type ON booking_requests(service_type);

-- Table pour les types de services (pour normaliser les données)
CREATE TABLE IF NOT EXISTS service_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(8,2),
    min_duration_hours INTEGER DEFAULT 3,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des types de services par défaut
INSERT INTO service_types (code, name, description, base_price, min_duration_hours) VALUES
    ('mariage', 'Mariage', 'Garde d''enfants pour cérémonies de mariage', 25.00, 4),
    ('urgence', 'Garde d''urgence', 'Garde d''enfants en urgence', 30.00, 2),
    ('soiree', 'Soirée parents', 'Garde d''enfants pour soirées entre parents', 20.00, 3),
    ('weekend', 'Week-end/Vacances', 'Garde d''enfants prolongée', 18.00, 6),
    ('autre', 'Autre événement', 'Autres types de garde d''enfants', 22.00, 3)
ON CONFLICT (code) DO NOTHING;

-- Table pour les statuts de suivi
CREATE TABLE IF NOT EXISTS booking_status_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_request_id UUID REFERENCES booking_requests(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    changed_by VARCHAR(100) DEFAULT 'system',
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les notes et commentaires administratifs
CREATE TABLE IF NOT EXISTS admin_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_request_id UUID REFERENCES booking_requests(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    admin_user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_internal BOOLEAN DEFAULT FALSE
);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_booking_requests_updated_at 
    BEFORE UPDATE ON booking_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour insérer automatiquement dans l'historique des statuts
CREATE OR REPLACE FUNCTION insert_status_history()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO booking_status_history (booking_request_id, status, notes, changed_by)
        VALUES (NEW.id, NEW.status, 'Changement de statut automatique', 'system');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour l'historique des statuts
CREATE TRIGGER booking_status_history_trigger
    AFTER UPDATE ON booking_requests
    FOR EACH ROW EXECUTE FUNCTION insert_status_history();

-- Vues utiles pour l'administration
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

-- Politique RLS (Row Level Security) pour la sécurité
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion de nouvelles demandes (public)
CREATE POLICY "Allow public insert" ON booking_requests
    FOR INSERT WITH CHECK (true);

-- Politique pour permettre la lecture des demandes publiques (statut public)
CREATE POLICY "Allow public read own requests" ON booking_requests
    FOR SELECT USING (true);

-- Politique pour les types de services (lecture publique)
CREATE POLICY "Allow public read service types" ON service_types
    FOR SELECT USING (is_active = true);

-- Commentaires sur les tables
COMMENT ON TABLE booking_requests IS 'Table principale des demandes de réservation de garde d''enfants';
COMMENT ON TABLE service_types IS 'Types de services disponibles avec leurs tarifs';
COMMENT ON TABLE booking_status_history IS 'Historique des changements de statut des demandes';
COMMENT ON TABLE admin_notes IS 'Notes administratives sur les demandes de réservation';
