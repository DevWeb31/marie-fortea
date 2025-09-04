#!/bin/bash

# Script de gestion Supabase - Environnement Développement
# DevWeb31 Architecture
# Usage: ./scripts/supabase-dev.sh [start|stop|reset|status|migrate|backup]

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="marie-fortea-dev"
SUPABASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../supabase" && pwd)"

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

check_docker() {
    if ! docker info &> /dev/null; then
        log_error "Docker n'est pas démarré"
        exit 1
    fi
}

# Fonction start
start_dev() {
    log_info "Démarrage de l'environnement Supabase de développement..."
    
    cd "$SUPABASE_DIR"
    
    if supabase status | grep -q "Running"; then
        log_warning "Supabase est déjà démarré"
        return
    fi
    
    supabase start
    log_success "Environnement Supabase démarré avec succès!"
    
    # Affichage des informations de connexion
    echo ""
    log_info "📊 Informations de connexion:"
    echo "   API: http://localhost:54321"
    echo "   Studio: http://localhost:54323"
    echo "   Database: postgresql://postgres:postgres@localhost:54322/postgres"
    echo "   Storage: http://localhost:54321/storage/v1"
    echo ""
}

# Fonction stop
stop_dev() {
    log_info "Arrêt de l'environnement Supabase de développement..."
    
    cd "$SUPABASE_DIR"
    
    if ! supabase status | grep -q "Running"; then
        log_warning "Supabase n'est pas démarré"
        return
    fi
    
    supabase stop
    log_success "Environnement Supabase arrêté avec succès!"
}

# Fonction reset
reset_dev() {
    log_warning "⚠️  ATTENTION: Cette action va supprimer toutes les données locales!"
    read -p "Êtes-vous sûr de vouloir continuer? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Réinitialisation de l'environnement Supabase..."
        
        cd "$SUPABASE_DIR"
        supabase stop
        supabase reset
        supabase start
        
        log_success "Environnement Supabase réinitialisé avec succès!"
    else
        log_info "Opération annulée"
    fi
}

# Fonction status
status_dev() {
    log_info "Statut de l'environnement Supabase..."
    
    cd "$SUPABASE_DIR"
    supabase status
}

# Fonction migrate
migrate_dev() {
    log_info "Application des migrations de base de données..."
    
    cd "$SUPABASE_DIR"
    
    if ! supabase status | grep -q "Running"; then
        log_error "Supabase doit être démarré pour appliquer les migrations"
        exit 1
    fi
    
    supabase db reset
    log_success "Migrations appliquées avec succès!"
}

# Fonction backup
backup_dev() {
    log_info "Création d'une sauvegarde de la base de données..."
    
    cd "$SUPABASE_DIR"
    
    if ! supabase status | grep -q "Running"; then
        log_error "Supabase doit être démarré pour créer une sauvegarde"
        exit 1
    fi
    
    BACKUP_DIR="./backups"
    mkdir -p "$BACKUP_DIR"
    
    BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql"
    
    supabase db dump --file "$BACKUP_FILE"
    log_success "Sauvegarde créée: $BACKUP_FILE"
}

# Fonction help
show_help() {
    echo "Usage: $0 [COMMANDE]"
    echo ""
    echo "Commandes disponibles:"
    echo "  start     - Démarrer l'environnement Supabase"
    echo "  stop      - Arrêter l'environnement Supabase"
    echo "  reset     - Réinitialiser complètement l'environnement"
    echo "  status    - Afficher le statut de Supabase"
    echo "  migrate   - Appliquer les migrations de base de données"
    echo "  backup    - Créer une sauvegarde de la base de données"
    echo "  help      - Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 start"
    echo "  $0 status"
    echo "  $0 migrate"
}

# Vérifications préliminaires
check_supabase_cli
check_docker

# Gestion des arguments
case "${1:-help}" in
    start)
        start_dev
        ;;
    stop)
        stop_dev
        ;;
    reset)
        reset_dev
        ;;
    status)
        status_dev
        ;;
    migrate)
        migrate_dev
        ;;
    backup)
        backup_dev
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
