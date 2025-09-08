-- Ajouter les champs pour le formulaire détaillé
ALTER TABLE booking_requests 
ADD COLUMN IF NOT EXISTS detailed_form_token TEXT,
ADD COLUMN IF NOT EXISTS detailed_form_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS detailed_form_completed_at TIMESTAMP WITH TIME ZONE;

-- Créer un index sur le token pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_booking_requests_detailed_form_token 
ON booking_requests(detailed_form_token);

-- Ajouter un commentaire pour expliquer l'utilisation
COMMENT ON COLUMN booking_requests.detailed_form_token IS 'Token unique pour accéder au formulaire détaillé';
COMMENT ON COLUMN booking_requests.detailed_form_sent_at IS 'Date et heure d''envoi du formulaire détaillé';
COMMENT ON COLUMN booking_requests.detailed_form_completed_at IS 'Date et heure de completion du formulaire détaillé';
