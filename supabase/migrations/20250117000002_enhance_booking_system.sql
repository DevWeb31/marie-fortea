-- Migration pour améliorer le système de réservation
-- Date: 2025-01-17
-- Objectif: Ajouter des tables pour gérer les informations détaillées des enfants
-- et les réservations confirmées après validation de la demande initiale

-- Table pour les informations détaillées des enfants
CREATE TABLE IF NOT EXISTS children_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_request_id UUID REFERENCES booking_requests(id) ON DELETE CASCADE,
    
    -- Informations de base de l'enfant
    child_order INTEGER NOT NULL CHECK (child_order > 0), -- Ordre dans la liste des enfants
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    birth_date DATE,
    
    -- Informations médicales et de sécurité
    allergies TEXT,
    medical_conditions TEXT,
    medications TEXT,
    emergency_instructions TEXT,
    
    -- Préférences et comportement
    dietary_restrictions TEXT,
    special_needs TEXT,
    favorite_activities TEXT,
    comfort_items TEXT, -- Doudou, tétine, etc.
    
    -- Informations de contact d'urgence spécifiques
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contraintes
    UNIQUE(booking_request_id, child_order)
);

-- Table pour les réservations confirmées (après validation de la demande)
CREATE TABLE IF NOT EXISTS confirmed_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_request_id UUID REFERENCES booking_requests(id) ON DELETE CASCADE,
    
    -- Informations de la réservation confirmée
    confirmation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_by VARCHAR(100) DEFAULT 'admin',
    
    -- Détails de l'événement
    event_location TEXT NOT NULL,
    event_address TEXT NOT NULL,
    event_postal_code VARCHAR(10),
    event_city VARCHAR(100),
    event_notes TEXT,
    
    -- Horaires confirmés
    confirmed_start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    confirmed_end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Tarification finale
    final_hourly_rate DECIMAL(8,2) NOT NULL,
    deposit_amount DECIMAL(8,2) DEFAULT 0,
    deposit_paid BOOLEAN DEFAULT FALSE,
    deposit_payment_method VARCHAR(50),
    
    -- Statut de paiement
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue')),
    payment_method VARCHAR(50),
    payment_notes TEXT,
    
    -- Instructions spéciales pour la garde
    special_instructions TEXT,
    arrival_instructions TEXT,
    departure_instructions TEXT,
    emergency_procedures TEXT,
    
    -- Contacts sur place
    on_site_contact_name VARCHAR(255),
    on_site_contact_phone VARCHAR(20),
    on_site_contact_role VARCHAR(100),
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les sessions de garde individuelles (pour les réservations multi-jours)
CREATE TABLE IF NOT EXISTS booking_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    confirmed_booking_id UUID REFERENCES confirmed_bookings(id) ON DELETE CASCADE,
    
    -- Informations de la session
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- Statut de la session
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    
    -- Notes de la session
    notes TEXT,
    issues_encountered TEXT,
    activities_done TEXT,
    
    -- Horaires réels (pour ajuster la facturation)
    actual_start_time TIME,
    actual_end_time TIME,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les documents et contrats
CREATE TABLE IF NOT EXISTS booking_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    confirmed_booking_id UUID REFERENCES confirmed_bookings(id) ON DELETE CASCADE,
    
    -- Informations du document
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('contract', 'terms', 'medical_form', 'photo_release', 'other')),
    document_name VARCHAR(255) NOT NULL,
    document_description TEXT,
    
    -- Fichier
    file_path TEXT,
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- Statut
    is_required BOOLEAN DEFAULT FALSE,
    is_signed BOOLEAN DEFAULT FALSE,
    signed_at TIMESTAMP WITH TIME ZONE,
    signed_by VARCHAR(255),
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les rappels et notifications
CREATE TABLE IF NOT EXISTS booking_reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    confirmed_booking_id UUID REFERENCES confirmed_bookings(id) ON DELETE CASCADE,
    
    -- Informations du rappel
    reminder_type VARCHAR(50) NOT NULL CHECK (reminder_type IN ('confirmation', 'reminder_24h', 'reminder_1h', 'follow_up')),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Contenu
    subject VARCHAR(255),
    message TEXT,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    
    -- Statut
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
    error_message TEXT,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_children_details_booking_id ON children_details(booking_request_id);
CREATE INDEX IF NOT EXISTS idx_children_details_child_order ON children_details(child_order);
CREATE INDEX IF NOT EXISTS idx_confirmed_bookings_request_id ON confirmed_bookings(booking_request_id);
CREATE INDEX IF NOT EXISTS idx_confirmed_bookings_date ON confirmed_bookings(confirmed_start_datetime);
CREATE INDEX IF NOT EXISTS idx_confirmed_bookings_status ON confirmed_bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_booking_sessions_booking_id ON booking_sessions(confirmed_booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_sessions_date ON booking_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_booking_documents_booking_id ON booking_documents(confirmed_booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_reminders_booking_id ON booking_reminders(confirmed_booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_reminders_scheduled ON booking_reminders(scheduled_at);

-- Fonctions pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_children_details_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_confirmed_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_booking_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_booking_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_children_details_updated_at 
    BEFORE UPDATE ON children_details 
    FOR EACH ROW EXECUTE FUNCTION update_children_details_updated_at();

CREATE TRIGGER update_confirmed_bookings_updated_at 
    BEFORE UPDATE ON confirmed_bookings 
    FOR EACH ROW EXECUTE FUNCTION update_confirmed_bookings_updated_at();

CREATE TRIGGER update_booking_sessions_updated_at 
    BEFORE UPDATE ON booking_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_booking_sessions_updated_at();

CREATE TRIGGER update_booking_documents_updated_at 
    BEFORE UPDATE ON booking_documents 
    FOR EACH ROW EXECUTE FUNCTION update_booking_documents_updated_at();

-- Fonction pour calculer l'âge des enfants
CREATE OR REPLACE FUNCTION calculate_child_age(birth_date DATE)
RETURNS TABLE(years INTEGER, months INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXTRACT(YEAR FROM AGE(birth_date))::INTEGER as years,
        EXTRACT(MONTH FROM AGE(birth_date))::INTEGER as months;
END;
$$ language 'plpgsql';

-- Fonction pour calculer la durée en heures
CREATE OR REPLACE FUNCTION calculate_duration_hours(start_time TIME, end_time TIME)
RETURNS DECIMAL(4,2) AS $$
BEGIN
    RETURN EXTRACT(EPOCH FROM (end_time - start_time)) / 3600;
END;
$$ language 'plpgsql';

-- Fonction pour calculer la durée en heures entre deux timestamps
CREATE OR REPLACE FUNCTION calculate_datetime_duration_hours(start_datetime TIMESTAMP WITH TIME ZONE, end_datetime TIMESTAMP WITH TIME ZONE)
RETURNS DECIMAL(4,2) AS $$
BEGIN
    RETURN EXTRACT(EPOCH FROM (end_datetime - start_datetime)) / 3600;
END;
$$ language 'plpgsql';

-- Vues utiles pour l'administration
CREATE OR REPLACE VIEW confirmed_bookings_summary AS
SELECT 
    cb.id,
    cb.booking_request_id,
    br.parent_name,
    br.parent_phone,
    br.parent_email,
    cb.event_location,
    cb.confirmed_start_datetime,
    cb.confirmed_end_datetime,
    calculate_datetime_duration_hours(cb.confirmed_start_datetime, cb.confirmed_end_datetime) as confirmed_duration_hours,
    (cb.final_hourly_rate * calculate_datetime_duration_hours(cb.confirmed_start_datetime, cb.confirmed_end_datetime)) as final_total_amount,
    cb.payment_status,
    cb.deposit_paid,
    COUNT(cd.id) as children_count,
    string_agg(cd.first_name, ', ' ORDER BY cd.child_order) as children_names
FROM confirmed_bookings cb
JOIN booking_requests br ON cb.booking_request_id = br.id
LEFT JOIN children_details cd ON br.id = cd.booking_request_id
GROUP BY cb.id, br.parent_name, br.parent_phone, br.parent_email, cb.event_location, 
         cb.confirmed_start_datetime, cb.confirmed_end_datetime, cb.final_hourly_rate, 
         cb.payment_status, cb.deposit_paid
ORDER BY cb.confirmed_start_datetime DESC;

-- Vue pour les sessions de garde avec informations complètes
CREATE OR REPLACE VIEW booking_sessions_summary AS
SELECT 
    bs.id,
    bs.session_date,
    bs.start_time,
    bs.end_time,
    calculate_duration_hours(bs.start_time, bs.end_time) as duration_hours,
    bs.status,
    cb.event_location,
    br.parent_name,
    br.parent_phone,
    COUNT(cd.id) as children_count,
    string_agg(cd.first_name, ', ' ORDER BY cd.child_order) as children_names
FROM booking_sessions bs
JOIN confirmed_bookings cb ON bs.confirmed_booking_id = cb.id
JOIN booking_requests br ON cb.booking_request_id = br.id
LEFT JOIN children_details cd ON br.id = cd.booking_request_id
GROUP BY bs.id, bs.session_date, bs.start_time, bs.end_time, 
         bs.status, cb.event_location, br.parent_name, br.parent_phone
ORDER BY bs.session_date DESC, bs.start_time DESC;

-- Politique RLS pour la sécurité
ALTER TABLE children_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmed_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_reminders ENABLE ROW LEVEL SECURITY;

-- Politiques pour permettre l'insertion et la lecture des nouvelles tables
CREATE POLICY "Allow public insert children details" ON children_details
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read children details" ON children_details
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert confirmed bookings" ON confirmed_bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read confirmed bookings" ON confirmed_bookings
    FOR SELECT USING (true);

-- Commentaires sur les nouvelles tables
COMMENT ON TABLE children_details IS 'Informations détaillées sur chaque enfant pour une demande de réservation';
COMMENT ON TABLE confirmed_bookings IS 'Réservations confirmées après validation de la demande initiale';
COMMENT ON TABLE booking_sessions IS 'Sessions individuelles de garde pour les réservations multi-jours';
COMMENT ON TABLE booking_documents IS 'Documents et contrats associés aux réservations confirmées';
COMMENT ON TABLE booking_reminders IS 'Rappels et notifications automatiques pour les réservations';

-- Ajout de contraintes de validation supplémentaires
ALTER TABLE children_details 
ADD CONSTRAINT check_child_age 
CHECK (birth_date <= CURRENT_DATE);

ALTER TABLE confirmed_bookings 
ADD CONSTRAINT check_confirmed_datetime 
CHECK (confirmed_end_datetime > confirmed_start_datetime);

ALTER TABLE booking_sessions 
ADD CONSTRAINT check_session_datetime 
CHECK (end_time > start_time);
