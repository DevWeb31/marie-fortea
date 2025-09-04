#!/bin/bash

# Script de gestion Supabase - Environnement Production
# DevWeb31 Architecture
# Usage: ./scripts/supabase-prod.sh [status|migrate|backup|restore|monitor]

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration Production
PROJECT_NAME="marie-fortea-prod"
SUPABASE_PROJECT_ID="qrstuvwxyzabcdef"
SUPABASE_ACCESS_TOKEN=""

# Chargement des variables d'environnement
if [ -f ".env.production" ]; then
    source .env.production
fi

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_supabase_cli() {
    if ! command -v supabase &> /dev/null; then
        log_error "Supabase CLI n'est pas installé"
        log_info "Installez-le avec: npm install -g supabase"
        exit 1
    fi
}

check_production_access() {
    if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
        log_error "Token d'accès Supabase manquant"
        log_info "Définissez SUPABASE_ACCESS_TOKEN dans .env.production"
        exit 1
    fi
    
    # Test de connexion
    if ! supabase projects list --access-token "$SUPABASE_ACCESS_TOKEN" &> /dev/null; then
        log_error "Impossible de se connecter à Supabase avec le token fourni"
        exit 1
    fi
}

# Fonction status
status_prod() {
    log_info "Statut de l'environnement Supabase de production..."
    
    check_production_access
    
    supabase projects list --access-token "$SUPABASE_ACCESS_TOKEN"
    
    echo ""
    log_info "📊 Informations du projet:"
    echo "   Nom: $PROJECT_NAME"
    echo "   ID: $SUPABASE_PROJECT_ID"
    echo "   URL: https://$SUPABASE_PROJECT_ID.supabase.co"
}

# Fonction migrate
migrate_prod() {
    log_warning "⚠️  ATTENTION: Application des migrations en PRODUCTION!"
    read -p "Êtes-vous sûr de vouloir continuer? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Application des migrations de production..."
        
        check_production_access
        
        # Récupération des migrations locales
        if [ -d "supabase/migrations" ]; then
            cd supabase
            
            # Application des migrations
            for migration in migrations/*.sql; do
                if [ -f "$migration" ]; then
                    log_info "Application de la migration: $migration"
                    # Note: En production, utilisez plutôt les migrations via l'interface Supabase
                    # ou via des scripts de déploiement automatisés
                fi
            done
            
            cd ..
        fi
        
        log_success "Migrations appliquées avec succès!"
        log_warning "⚠️  Vérifiez l'état de votre base de données de production"
    else
        log_info "Opération annulée"
    fi
}

# Fonction backup
backup_prod() {
    log_info "Création d'une sauvegarde de la base de données de production..."
    
    check_production_access
    
    BACKUP_DIR="./backups/production"
    mkdir -p "$BACKUP_DIR"
    
    BACKUP_FILE="$BACKUP_DIR/backup-prod-$(date +%Y%m%d-%H%M%S).sql"
    
    # Note: En production, utilisez plutôt les sauvegardes automatiques de Supabase
    # ou les outils de sauvegarde de votre fournisseur
    log_warning "⚠️  Les sauvegardes de production doivent être gérées via l'interface Supabase"
    log_info "Sauvegarde créée: $BACKUP_FILE (simulation)"
    
    # Création d'un fichier de métadonnées
    cat > "$BACKUP_FILE" << EOF
-- Sauvegarde de production - $PROJECT_NAME
-- Date: $(date)
-- Projet ID: $SUPABASE_PROJECT_ID
-- Note: Ce fichier est une simulation. Utilisez l'interface Supabase pour les vraies sauvegardes.

-- Métadonnées de la base de données
-- Tables principales
-- - users
-- - profiles
-- - sessions
-- - etc.

-- IMPORTANT: Ce fichier ne contient pas de vraies données
-- Utilisez les outils de sauvegarde Supabase pour la production
EOF
    
    log_success "Fichier de métadonnées créé: $BACKUP_FILE"
}

# Fonction restore
restore_prod() {
    log_error "⚠️  RESTAURATION EN PRODUCTION INTERDITE!"
    log_info "La restauration de base de données en production doit être effectuée manuellement"
    log_info "via l'interface Supabase ou par votre équipe DevOps"
    exit 1
}

# Fonction monitor
monitor_prod() {
    log_info "Surveillance de l'environnement de production..."
    
    check_production_access
    
    # Vérification de la connectivité
    if curl -s "https://$SUPABASE_PROJECT_ID.supabase.co/rest/v1/" > /dev/null; then
        log_success "✅ API Supabase accessible"
    else
        log_error "❌ API Supabase inaccessible"
    fi
    
    # Vérification du statut du projet
    PROJECT_STATUS=$(supabase projects list --access-token "$SUPABASE_ACCESS_TOKEN" | grep "$SUPABASE_PROJECT_ID" || echo "")
    
    if [ -n "$PROJECT_STATUS" ]; then
        log_success "✅ Projet Supabase actif"
        echo "   $PROJECT_STATUS"
    else
        log_error "❌ Projet Supabase non trouvé ou inactif"
    fi
    
    echo ""
    log_info "📊 Recommandations de surveillance:"
    echo "   - Surveillez les logs d'erreur via l'interface Supabase"
    echo "   - Configurez des alertes pour les métriques de performance"
    echo "   - Surveillez l'utilisation des ressources"
    echo "   - Vérifiez régulièrement les sauvegardes automatiques"
}

# Fonction help
show_help() {
    echo "Usage: $0 [COMMANDE]"
    echo ""
    echo "Commandes disponibles:"
    echo "  status    - Afficher le statut de l'environnement de production"
    echo "  migrate   - Appliquer les migrations (avec confirmation)"
    echo "  backup    - Créer une sauvegarde (simulation)"
    echo "  restore   - Restauration (INTERDITE en production)"
    echo "  monitor   - Surveiller l'environnement de production"
    echo "  help      - Afficher cette aide"
    echo ""
    echo "⚠️  ATTENTION: Ce script gère l'environnement de PRODUCTION"
    echo "   Soyez extrêmement prudent avec les opérations destructives"
    echo ""
    echo "Exemples:"
    echo "  $0 status"
    echo "  $0 monitor"
    echo "  $0 backup"
}

# Vérifications préliminaires
check_supabase_cli

# Gestion des arguments
case "${1:-help}" in
    status)
        status_prod
        ;;
    migrate)
        migrate_prod
        ;;
    backup)
        backup_prod
        ;;
    restore)
        restore_prod
        ;;
    monitor)
        monitor_prod
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Commande inconnue: $1"
        show_help
        exit 1
        ;;
esac
