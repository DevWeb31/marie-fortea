-- Migration pour forcer la mise à jour de TOUTES les durées
-- Date: 2025-01-17
-- Objectif: Forcer la mise à jour de toutes les réservations, même celles qui n'ont pas été mises à jour

-- 1. Vérifier l'état actuel
SELECT 
    'État avant mise à jour forcée' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 2. Afficher TOUTES les réservations avec des durées négatives
SELECT 
    'TOUTES les durées négatives' as examples,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    created_at
FROM booking_requests 
WHERE deleted_at IS NULL 
AND duration_hours < 0
ORDER BY created_at DESC;

-- 3. Forcer la mise à jour de TOUTES les réservations
-- Cette méthode force PostgreSQL à recalculer la colonne GENERATED pour TOUTES les lignes
UPDATE booking_requests 
SET 
    start_time = start_time + INTERVAL '0 seconds',
    end_time = end_time + INTERVAL '0 seconds',
    updated_at = NOW()
WHERE deleted_at IS NULL;

-- 4. Vérifier l'état après mise à jour forcée
SELECT 
    'État après mise à jour forcée' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 5. Afficher les exemples après mise à jour
SELECT 
    'Exemples après mise à jour forcée' as examples,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    CASE 
        WHEN duration_hours < 0 THEN '❌ NÉGATIF'
        WHEN duration_hours = 0 THEN '❌ ZERO'
        WHEN duration_hours > 0 THEN '✅ OK'
        ELSE '❌ PROBLÈME'
    END as status
FROM booking_requests 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 10;

-- 6. Si il y a encore des durées négatives, les corriger en modifiant les heures
-- On ne peut pas modifier directement une colonne GENERATED, donc on modifie les heures
UPDATE booking_requests 
SET 
    start_time = start_time + INTERVAL '0 milliseconds',
    end_time = end_time + INTERVAL '0 milliseconds',
    updated_at = NOW()
WHERE deleted_at IS NULL 
AND duration_hours < 0;

-- 7. Vérification finale
SELECT 
    'Vérification finale' as status,
    COUNT(*) as total_records,
    COUNT(CASE WHEN duration_hours < 0 THEN 1 END) as negative_durations,
    COUNT(CASE WHEN duration_hours = 0 THEN 1 END) as zero_durations,
    COUNT(CASE WHEN duration_hours > 0 THEN 1 END) as valid_durations
FROM booking_requests 
WHERE deleted_at IS NULL;

-- 8. Afficher les 5 dernières réservations pour vérification
SELECT 
    'Dernières réservations - Vérification finale' as examples,
    id,
    parent_name,
    start_time,
    end_time,
    duration_hours,
    CASE 
        WHEN duration_hours < 0 THEN '❌ NÉGATIF'
        WHEN duration_hours = 0 THEN '❌ ZERO'
        WHEN duration_hours > 0 THEN '✅ OK'
        ELSE '❌ PROBLÈME'
    END as status
FROM booking_requests 
WHERE deleted_at IS NULL 
ORDER BY created_at DESC 
LIMIT 5;

-- Message final
SELECT 'Mise à jour forcée de toutes les durées terminée' as final_status;
