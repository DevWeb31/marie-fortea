#!/bin/bash

# Script de restauration rapide de la base de données - DevWeb31 Architecture
# Usage: ./scripts/restore-database.sh [dev|prod]

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="marie-fortea"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

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

# Vérification des arguments
ENVIRONMENT=${1:-dev}

if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    log_error "Environnement invalide. Utilisez 'dev' ou 'prod'"
    exit 1
fi

log_info "Restauration de la base de données pour l'environnement: $ENVIRONMENT"

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # Supabase CLI
    if ! command -v supabase &> /dev/null; then
        log_error "Supabase CLI n'est pas installé"
        log_info "Installez-le avec: npm install -g supabase"
        exit 1
    fi
    
    SUPABASE_VERSION=$(supabase --version)
    log_success "Supabase CLI détecté: $SUPABASE_VERSION"
}

# Restauration de la base de données
restore_database() {
    log_info "Restauration de la base de données..."
    
    cd "$PROJECT_ROOT"
    
    if [[ "$ENVIRONMENT" == "dev" ]]; then
        log_info "Restauration de l'environnement de développement..."
        
        # Vérifier si Supabase local est en cours
        if ! supabase status &> /dev/null; then
            log_warning "Supabase local n'est pas démarré"
            log_info "Démarrage de Supabase local..."
            supabase start
        fi
        
        # Appliquer la migration
        log_info "Application de la migration initiale..."
        supabase db reset
        
    else
        log_info "Restauration de l'environnement de production..."
        
        # Vérifier la configuration de production
        if [[ -z "$SUPABASE_ACCESS_TOKEN" ]]; then
            log_error "SUPABASE_ACCESS_TOKEN non défini"
            log_info "Connectez-vous avec: supabase login"
            exit 1
        fi
        
        # Appliquer la migration en production
        log_info "Application de la migration en production..."
        supabase db push --project-ref $(grep -o 'https://[^.]*\.supabase\.co' .env | cut -d'/' -f3)
    fi
    
    log_success "Base de données restaurée avec succès !"
}

# Vérification de la restauration
verify_restoration() {
    log_info "Vérification de la restauration..."
    
    if [[ "$ENVIRONMENT" == "dev" ]]; then
        # Vérifier les tables en local
        log_info "Vérification des tables créées..."
        supabase db diff --schema public
    else
        log_info "Vérification des tables en production..."
        # Ici vous pouvez ajouter une vérification via l'API Supabase
    fi
}

# Main
main() {
    log_info "🚀 Début de la restauration de la base de données..."
    
    check_prerequisites
    restore_database
    verify_restoration
    
    log_success "🎉 Restauration terminée avec succès !"
    log_info "Vos tables sont maintenant disponibles :"
    log_info "  - profiles (utilisateurs)"
    log_info "  - sessions (sessions utilisateurs)"
    log_info "  - bookings (réservations)"
}

# Exécution
main "$@"
