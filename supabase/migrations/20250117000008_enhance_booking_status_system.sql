-- Migration pour améliorer le système de statuts des réservations
-- Date: 2025-01-17
-- Objectif: Implémenter un système d'états granulaire avec transitions autorisées

-- 1. Créer la table des statuts prédéfinis
CREATE TABLE IF NOT EXISTS booking_statuses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280', -- Couleur hexadécimale par défaut
    icon VARCHAR(50), -- Icône à utiliser dans l'interface
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table des transitions autorisées entre statuts
CREATE TABLE IF NOT EXISTS booking_status_transitions (
    id SERIAL PRIMARY KEY,
    from_status_id INTEGER REFERENCES booking_statuses(id) ON DELETE CASCADE,
    to_status_id INTEGER REFERENCES booking_statuses(id) ON DELETE CASCADE,
    requires_admin_approval BOOLEAN DEFAULT FALSE,
    requires_notes BOOLEAN DEFAULT FALSE,
    auto_actions TEXT[], -- Actions automatiques à exécuter lors de la transition
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(from_status_id, to_status_id)
);

-- 3. Insérer les statuts prédéfinis
INSERT INTO booking_statuses (code, name, description, color, icon, sort_order) VALUES
    ('nouvelle', 'Nouvelle réservation', 'Demande initiale reçue, en attente de traitement', '#F59E0B', 'clock', 1),
    ('acceptee', 'Réservation acceptée', 'Demande validée par l''administrateur, en attente de confirmation client', '#3B82F6', 'check-circle', 2),
    ('confirmee', 'Réservation confirmée', 'Réservation confirmée par le client, prête pour exécution', '#10B981', 'calendar-check', 3),
    ('en_cours', 'En cours', 'Réservation en cours d''exécution', '#8B5CF6', 'play-circle', 4),
    ('terminee', 'Terminée', 'Réservation terminée avec succès', '#6B7280', 'check-square', 5),
    ('annulee', 'Annulée', 'Réservation annulée par le client ou l''administrateur', '#EF4444', 'x-circle', 6),
    ('archivée', 'Archivée', 'Réservation archivée pour conservation', '#9CA3AF', 'archive', 7),
    ('supprimee', 'Supprimée', 'Réservation supprimée (soft delete)', '#374151', 'trash-2', 8)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    color = EXCLUDED.color,
    icon = EXCLUDED.icon,
    sort_order = EXCLUDED.sort_order;

-- 4. Insérer les transitions autorisées
INSERT INTO booking_status_transitions (from_status_id, to_status_id, requires_admin_approval, requires_notes) VALUES
    -- Transitions depuis "Nouvelle réservation"
    ((SELECT id FROM booking_statuses WHERE code = 'nouvelle'), (SELECT id FROM booking_statuses WHERE code = 'acceptee'), TRUE, TRUE),
    ((SELECT id FROM booking_statuses WHERE code = 'nouvelle'), (SELECT id FROM booking_statuses WHERE code = 'annulee'), TRUE, TRUE),
    
    -- Transitions depuis "Réservation acceptée"
    ((SELECT id FROM booking_statuses WHERE code = 'acceptee'), (SELECT id FROM booking_statuses WHERE code = 'confirmee'), FALSE, FALSE),
    ((SELECT id FROM booking_statuses WHERE code = 'acceptee'), (SELECT id FROM booking_statuses WHERE code = 'annulee'), TRUE, TRUE),
    ((SELECT id FROM booking_statuses WHERE code = 'acceptee'), (SELECT id FROM booking_statuses WHERE code = 'nouvelle'), TRUE, TRUE),
    
    -- Transitions depuis "Réservation confirmée"
    ((SELECT id FROM booking_statuses WHERE code = 'confirmee'), (SELECT id FROM booking_statuses WHERE code = 'en_cours'), FALSE, FALSE),
    ((SELECT id FROM booking_statuses WHERE code = 'confirmee'), (SELECT id FROM booking_statuses WHERE code = 'annulee'), TRUE, TRUE),
    ((SELECT id FROM booking_statuses WHERE code = 'confirmee'), (SELECT id FROM booking_statuses WHERE code = 'acceptee'), TRUE, TRUE),
    
    -- Transitions depuis "En cours"
    ((SELECT id FROM booking_statuses WHERE code = 'en_cours'), (SELECT id FROM booking_statuses WHERE code = 'terminee'), FALSE, FALSE),
    ((SELECT id FROM booking_statuses WHERE code = 'en_cours'), (SELECT id FROM booking_statuses WHERE code = 'annulee'), TRUE, TRUE),
    
    -- Transitions depuis "Terminée"
    ((SELECT id FROM booking_statuses WHERE code = 'terminee'), (SELECT id FROM booking_statuses WHERE code = 'archivée'), FALSE, FALSE),
    ((SELECT id FROM booking_statuses WHERE code = 'terminee'), (SELECT id FROM booking_statuses WHERE code = 'en_cours'), TRUE, TRUE),
    
    -- Transitions depuis "Annulée"
    ((SELECT id FROM booking_statuses WHERE code = 'annulee'), (SELECT id FROM booking_statuses WHERE code = 'nouvelle'), TRUE, TRUE),
    ((SELECT id FROM booking_statuses WHERE code = 'annulee'), (SELECT id FROM booking_statuses WHERE code = 'archivée'), FALSE, FALSE),
    
    -- Transitions depuis "Archivée"
    ((SELECT id FROM booking_statuses WHERE code = 'archivée'), (SELECT id FROM booking_statuses WHERE code = 'terminee'), TRUE, TRUE),
    ((SELECT id FROM booking_statuses WHERE code = 'archivée'), (SELECT id FROM booking_statuses WHERE code = 'supprimee'), TRUE, TRUE),
    
    -- Transitions depuis "Supprimée" (restauration possible)
    ((SELECT id FROM booking_statuses WHERE code = 'supprimee'), (SELECT id FROM booking_statuses WHERE code = 'archivée'), TRUE, TRUE)
ON CONFLICT (from_status_id, to_status_id) DO UPDATE SET
    requires_admin_approval = EXCLUDED.requires_admin_approval,
    requires_notes = EXCLUDED.requires_notes;

-- 5. Modifier la table booking_requests pour utiliser le nouveau système de statuts
ALTER TABLE booking_requests 
ADD COLUMN IF NOT EXISTS status_id INTEGER REFERENCES booking_statuses(id);

-- 6. Mettre à jour les statuts existants pour correspondre aux nouveaux
UPDATE booking_requests 
SET status_id = (SELECT id FROM booking_statuses WHERE code = 'nouvelle')
WHERE status = 'pending' AND status_id IS NULL;

UPDATE booking_requests 
SET status_id = (SELECT id FROM booking_statuses WHERE code = 'acceptee')
WHERE status = 'contacted' AND status_id IS NULL;

UPDATE booking_requests 
SET status_id = (SELECT id FROM booking_statuses WHERE code = 'confirmee')
WHERE status = 'confirmed' AND status_id IS NULL;

UPDATE booking_requests 
SET status_id = (SELECT id FROM booking_statuses WHERE code = 'annulee')
WHERE status = 'cancelled' AND status_id IS NULL;

UPDATE booking_requests 
SET status_id = (SELECT id FROM booking_statuses WHERE code = 'terminee')
WHERE status = 'completed' AND status_id IS NULL;

-- 7. Créer une table pour l'historique des changements de statut avec plus de détails
CREATE TABLE IF NOT EXISTS booking_status_changes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_request_id UUID REFERENCES booking_requests(id) ON DELETE CASCADE,
    from_status_id INTEGER REFERENCES booking_statuses(id),
    to_status_id INTEGER REFERENCES booking_statuses(id) NOT NULL,
    changed_by VARCHAR(100) DEFAULT 'system',
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    transition_reason VARCHAR(255), -- Raison du changement (optionnel)
    metadata JSONB -- Données supplémentaires (IP, user agent, etc.)
);

-- 8. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_booking_requests_status_id ON booking_requests(status_id);
CREATE INDEX IF NOT EXISTS idx_booking_status_changes_booking_id ON booking_status_changes(booking_request_id);
CREATE INDEX IF NOT EXISTS idx_booking_status_changes_changed_at ON booking_status_changes(changed_at);
CREATE INDEX IF NOT EXISTS idx_booking_status_transitions_from ON booking_status_transitions(from_status_id);
CREATE INDEX IF NOT EXISTS idx_booking_status_transitions_to ON booking_status_transitions(to_status_id);

-- 9. Créer une fonction pour changer le statut d'une réservation avec validation
CREATE OR REPLACE FUNCTION change_booking_status(
    p_booking_id UUID,
    p_new_status_code VARCHAR(50),
    p_notes TEXT DEFAULT NULL,
    p_changed_by VARCHAR(100) DEFAULT 'system',
    p_transition_reason VARCHAR(255) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_status_id INTEGER;
    v_new_status_id INTEGER;
    v_transition_exists BOOLEAN;
    v_requires_notes BOOLEAN;
    v_requires_admin BOOLEAN;
BEGIN
    -- Récupérer le statut actuel
    SELECT status_id INTO v_current_status_id
    FROM booking_requests 
    WHERE id = p_booking_id AND deleted_at IS NULL;
    
    IF v_current_status_id IS NULL THEN
        RAISE EXCEPTION 'Réservation non trouvée ou supprimée';
    END IF;
    
    -- Récupérer le nouveau statut
    SELECT id INTO v_new_status_id
    FROM booking_statuses 
    WHERE code = p_new_status_code AND is_active = TRUE;
    
    IF v_new_status_id IS NULL THEN
        RAISE EXCEPTION 'Statut invalide: %', p_new_status_code;
    END IF;
    
    -- Vérifier si la transition est autorisée
    SELECT EXISTS(
        SELECT 1 FROM booking_status_transitions 
        WHERE from_status_id = v_current_status_id AND to_status_id = v_new_status_id
    ) INTO v_transition_exists;
    
    IF NOT v_transition_exists THEN
        RAISE EXCEPTION 'Transition non autorisée du statut % vers %', 
            (SELECT name FROM booking_statuses WHERE id = v_current_status_id),
            (SELECT name FROM booking_statuses WHERE id = v_new_status_id);
    END IF;
    
    -- Vérifier les prérequis de la transition
    SELECT requires_notes, requires_admin_approval 
    INTO v_requires_notes, v_requires_admin
    FROM booking_status_transitions 
    WHERE from_status_id = v_current_status_id AND to_status_id = v_new_status_id;
    
    -- Vérifier si des notes sont requises
    IF v_requires_notes AND (p_notes IS NULL OR trim(p_notes) = '') THEN
        RAISE EXCEPTION 'Des notes sont requises pour cette transition';
    END IF;
    
    -- Vérifier si une approbation admin est requise (simulation)
    IF v_requires_admin AND p_changed_by = 'system' THEN
        RAISE EXCEPTION 'Approval administrateur requis pour cette transition';
    END IF;
    
    -- Effectuer le changement de statut
    UPDATE booking_requests 
    SET 
        status_id = v_new_status_id,
        updated_at = NOW()
    WHERE id = p_booking_id;
    
    -- Enregistrer le changement dans l'historique
    INSERT INTO booking_status_changes (
        booking_request_id, 
        from_status_id, 
        to_status_id, 
        changed_by, 
        notes, 
        transition_reason
    ) VALUES (
        p_booking_id, 
        v_current_status_id, 
        v_new_status_id, 
        p_changed_by, 
        p_notes, 
        p_transition_reason
    );
    
    -- Mettre à jour le champ status legacy pour la compatibilité
    UPDATE booking_requests 
    SET status = p_new_status_code
    WHERE id = p_booking_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Créer des vues utiles pour l'administration
CREATE OR REPLACE VIEW booking_status_overview AS
SELECT 
    bs.code,
    bs.name,
    bs.color,
    bs.icon,
    COUNT(br.id) as count,
    bs.sort_order
FROM booking_statuses bs
LEFT JOIN booking_requests br ON bs.id = br.status_id AND br.deleted_at IS NULL
WHERE bs.is_active = TRUE
GROUP BY bs.id, bs.code, bs.name, bs.color, bs.icon, bs.sort_order
ORDER BY bs.sort_order;

CREATE OR REPLACE VIEW booking_requests_with_status AS
SELECT 
    br.*,
    bs.code as status_code,
    bs.name as status_name,
    bs.color as status_color,
    bs.icon as status_icon,
    bs.description as status_description
FROM booking_requests br
JOIN booking_statuses bs ON br.status_id = bs.id
WHERE br.deleted_at IS NULL
ORDER BY br.created_at DESC;

-- 11. Créer des fonctions utilitaires
CREATE OR REPLACE FUNCTION get_available_transitions(p_booking_id UUID)
RETURNS TABLE(
    to_status_code VARCHAR(50),
    to_status_name VARCHAR(100),
    to_status_color VARCHAR(7),
    to_status_icon VARCHAR(50),
    requires_admin_approval BOOLEAN,
    requires_notes BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bs.code,
        bs.name,
        bs.color,
        bs.icon,
        bst.requires_admin_approval,
        bst.requires_notes
    FROM booking_status_transitions bst
    JOIN booking_statuses bs ON bst.to_status_id = bs.id
    WHERE bst.from_status_id = (
        SELECT status_id FROM booking_requests WHERE id = p_booking_id
    )
    AND bs.is_active = TRUE
    ORDER BY bs.sort_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Mettre à jour les politiques RLS
ALTER TABLE booking_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_changes ENABLE ROW LEVEL SECURITY;

-- Politiques pour les statuts (lecture publique)
CREATE POLICY "Allow public read statuses" ON booking_statuses
    FOR SELECT USING (is_active = TRUE);

-- Politiques pour les transitions (lecture publique)
CREATE POLICY "Allow public read transitions" ON booking_status_transitions
    FOR SELECT USING (true);

-- Politiques pour l'historique des changements (lecture publique)
CREATE POLICY "Allow public read status changes" ON booking_status_changes
    FOR SELECT USING (true);

-- 13. Commentaires sur les nouvelles tables
COMMENT ON TABLE booking_statuses IS 'Statuts prédéfinis pour les réservations avec métadonnées visuelles';
COMMENT ON TABLE booking_status_transitions IS 'Transitions autorisées entre les différents statuts';
COMMENT ON TABLE booking_status_changes IS 'Historique détaillé des changements de statut des réservations';
COMMENT ON FUNCTION change_booking_status IS 'Fonction pour changer le statut d''une réservation avec validation des transitions';
COMMENT ON FUNCTION get_available_transitions IS 'Fonction pour obtenir les transitions disponibles pour une réservation donnée';
