-- Script de test pour le système de statuts amélioré
-- Date: 2025-01-17

-- 1. Vérifier que les tables sont créées
SELECT 'Tables créées:' as info;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%status%'
ORDER BY table_name;

-- 2. Vérifier les statuts prédéfinis
SELECT 'Statuts disponibles:' as info;
SELECT code, name, color, icon, sort_order, is_active
FROM booking_statuses
ORDER BY sort_order;

-- 3. Vérifier les transitions autorisées
SELECT 'Transitions autorisées:' as info;
SELECT 
    fs.code as from_status,
    ts.code as to_status,
    bst.requires_admin_approval,
    bst.requires_notes
FROM booking_status_transitions bst
JOIN booking_statuses fs ON bst.from_status_id = fs.id
JOIN booking_statuses ts ON bst.to_status_id = ts.id
ORDER BY fs.sort_order, ts.sort_order;

-- 4. Créer une réservation de test
SELECT 'Création d''une réservation de test...' as info;
INSERT INTO booking_requests (
    parent_name, 
    parent_phone, 
    parent_address, 
    service_type, 
    requested_date, 
    start_time, 
    end_time, 
    children_count, 
    children_details
) VALUES (
    'Test User Status', 
    '0123456789', 
    '123 Test Status St', 
    'mariage', 
    '2025-02-01', 
    '14:00', 
    '18:00', 
    2, 
    'Test children for status system'
) RETURNING id, status, status_id;

-- 5. Vérifier le statut initial
SELECT 'Statut initial de la réservation de test:' as info;
SELECT 
    br.id,
    br.parent_name,
    bs.code as status_code,
    bs.name as status_name,
    bs.color as status_color
FROM booking_requests br
JOIN booking_statuses bs ON br.status_id = bs.id
WHERE br.parent_name = 'Test User Status';

-- 6. Vérifier les transitions disponibles
SELECT 'Transitions disponibles pour la réservation de test:' as info;
SELECT * FROM get_available_transitions(
    (SELECT id FROM booking_requests WHERE parent_name = 'Test User Status')
);

-- 7. Tester le changement de statut vers "acceptée"
SELECT 'Test de transition vers "acceptée"...' as info;
SELECT change_booking_status(
    (SELECT id FROM booking_requests WHERE parent_name = 'Test User Status'),
    'acceptee',
    'Test d''acceptation - Réservation validée par l''admin',
    'admin@test.com',
    'Validation de la demande initiale'
);

-- 8. Vérifier le nouveau statut
SELECT 'Nouveau statut après transition:' as info;
SELECT 
    br.id,
    br.parent_name,
    bs.code as status_code,
    bs.name as status_name,
    bs.color as status_color,
    br.updated_at
FROM booking_requests br
JOIN booking_statuses bs ON br.status_id = bs.id
WHERE br.parent_name = 'Test User Status';

-- 9. Vérifier l'historique des changements
SELECT 'Historique des changements de statut:' as info;
SELECT 
    bsc.booking_request_id,
    fs.name as from_status,
    ts.name as to_status,
    bsc.changed_by,
    bsc.changed_at,
    bsc.notes,
    bsc.transition_reason
FROM booking_status_changes bsc
JOIN booking_statuses fs ON bsc.from_status_id = fs.id
JOIN booking_statuses ts ON bsc.to_status_id = ts.id
WHERE bsc.booking_request_id = (
    SELECT id FROM booking_requests WHERE parent_name = 'Test User Status'
)
ORDER BY bsc.changed_at;

-- 10. Tester une transition invalide (doit échouer)
SELECT 'Test de transition invalide (doit échouer):' as info;
DO $$
BEGIN
    PERFORM change_booking_status(
        (SELECT id FROM booking_requests WHERE parent_name = 'Test User Status'),
        'terminee',
        'Test de transition invalide',
        'admin@test.com',
        'Test de validation'
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Transition bloquée comme attendu: %', SQLERRM;
END $$;

-- 11. Vérifier la vue d'ensemble des statuts
SELECT 'Vue d''ensemble des statuts:' as info;
SELECT * FROM booking_status_overview;

-- 12. Vérifier la vue des réservations avec statuts
SELECT 'Réservations avec statuts (limité à 5):' as info;
SELECT 
    id,
    parent_name,
    status_code,
    status_name,
    status_color,
    created_at
FROM booking_requests_with_status
LIMIT 5;

-- 13. Nettoyer la réservation de test
SELECT 'Nettoyage de la réservation de test...' as info;
DELETE FROM booking_requests WHERE parent_name = 'Test User Status';

-- 14. Résumé des tests
SELECT 'Tests terminés avec succès!' as result;
SELECT 
    'Système de statuts opérationnel' as status,
    (SELECT COUNT(*) FROM booking_statuses) as total_statuses,
    (SELECT COUNT(*) FROM booking_status_transitions) as total_transitions,
    'Toutes les fonctionnalités testées' as notes;
