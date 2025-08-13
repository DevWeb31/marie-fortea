#!/bin/bash

# Script de configuration initiale - DevWeb31 Architecture
# Usage: ./scripts/setup-dev-env.sh

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

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        log_info "Installez Node.js depuis https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    log_success "Node.js détecté: $NODE_VERSION"
    
    # npm
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    log_success "npm détecté: $NPM_VERSION"
    
    # Git
    if ! command -v git &> /dev/null; then
        log_error "Git n'est pas installé"
        exit 1
    fi
    
    GIT_VERSION=$(git --version)
    log_success "Git détecté: $GIT_VERSION"
    
    # Docker
    if ! command -v docker &> /dev/null; then
        log_warning "Docker n'est pas installé"
        log_info "Docker est requis pour Supabase local"
        log_info "Installez Docker depuis https://docker.com/"
    else
        DOCKER_VERSION=$(docker --version)
        log_success "Docker détecté: $DOCKER_VERSION"
    fi
}

# Installation des dépendances
install_dependencies() {
    log_info "Installation des dépendances..."
    
    cd "$PROJECT_ROOT"
    
    # Installation des dépendances npm
    log_info "Installation des dépendances npm..."
    npm install
    
    # Installation des dépendances de développement globales
    log_info "Installation des outils de développement..."
    
    # Supabase CLI
    if ! command -v supabase &> /dev/null; then
        log_info "Installation de Supabase CLI..."
        npm install -g supabase
    else
        log_success "Supabase CLI déjà installé"
    fi
    
    # Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_info "Installation de Vercel CLI..."
        npm install -g vercel
    else
        log_success "Vercel CLI déjà installé"
    fi
}

# Configuration de l'environnement
setup_environment() {
    log_info "Configuration de l'environnement..."
    
    cd "$PROJECT_ROOT"
    
    # Création des fichiers d'environnement
    if [ ! -f ".env.development" ]; then
        log_info "Création du fichier .env.development..."
        cat > .env.development << EOF
# Configuration de développement - DevWeb31 Architecture
# Ne pas commiter ce fichier dans Git

# Supabase - Développement
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Configuration de l'application
VITE_APP_NAME=Marie Fortea - Dev
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# API et services
VITE_API_BASE_URL=http://localhost:3000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_51H1234567890abcdefghijklmnopqrstuvwxyz

# Configuration de développement
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
VITE_ENABLE_ANALYTICS=false
EOF
        log_success "Fichier .env.development créé"
    else
        log_info "Fichier .env.development existe déjà"
    fi
    
    # Création du template de production
    if [ ! -f ".env.production.example" ]; then
        log_info "Création du template .env.production.example..."
        cat > .env.production.example << EOF
# Configuration de production - DevWeb31 Architecture
# Copiez ce fichier vers .env.production et remplissez les vraies valeurs

# Supabase - Production
VITE_SUPABASE_URL=https://qrstuvwxyzabcdef.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Configuration de l'application
VITE_APP_NAME=Marie Fortea
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# API et services
VITE_API_BASE_URL=https://mon-projet.com/api
VITE_STRIPE_PUBLIC_KEY=pk_live_51H1234567890abcdefghijklmnopqrstuvwxyz

# Configuration de production
VITE_DEBUG=false
VITE_LOG_LEVEL=error
VITE_ENABLE_ANALYTICS=true
EOF
        log_success "Template .env.production.example créé"
    else
        log_info "Template .env.production.example existe déjà"
    fi
}

# Configuration de Supabase
setup_supabase() {
    log_info "Configuration de Supabase..."
    
    cd "$PROJECT_ROOT"
    
    if [ -d "supabase" ]; then
        log_info "Initialisation de Supabase..."
        
        cd supabase
        
        # Initialisation du projet Supabase
        if [ ! -f "config.toml" ]; then
            log_error "Fichier config.toml manquant dans le dossier supabase/"
            exit 1
        fi
        
        # Création du dossier migrations s'il n'existe pas
        mkdir -p migrations
        
        # Création d'une migration initiale
        if [ ! -f "migrations/00000000000000_initial_schema.sql" ]; then
            log_info "Création de la migration initiale..."
            cat > "migrations/00000000000000_initial_schema.sql" << EOF
-- Migration initiale - DevWeb31 Architecture
-- Date: $(date)
-- Description: Schéma initial de la base de données

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs (extension de auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des sessions
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_data JSONB,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    service_name TEXT NOT NULL,
    booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own sessions" ON public.sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = user_id);

-- Fonction de mise à jour automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS \$\$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
\$\$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EOF
            log_success "Migration initiale créée"
        fi
        
        cd ..
    else
        log_warning "Dossier supabase/ non trouvé"
    fi
}

# Configuration de Husky
setup_husky() {
    log_info "Configuration de Husky..."
    
    cd "$PROJECT_ROOT"
    
    # Initialisation de Husky
    if [ ! -d ".husky" ]; then
        log_info "Initialisation de Husky..."
        npx husky init
    fi
    
    # Configuration du hook pre-commit
    if [ ! -f ".husky/pre-commit" ]; then
        log_info "Création du hook pre-commit..."
        cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Vérification de la qualité du code..."

# Formatage automatique
npm run format

# Linting
npm run lint

# Vérification TypeScript
npm run type-check

echo "✅ Pre-commit checks terminés avec succès!"
EOF
        chmod +x .husky/pre-commit
        log_success "Hook pre-commit configuré"
    else
        log_info "Hook pre-commit existe déjà"
    fi
}

# Configuration de Git
setup_git() {
    log_info "Configuration de Git..."
    
    cd "$PROJECT_ROOT"
    
    # Vérification si c'est un dépôt Git
    if [ ! -d ".git" ]; then
        log_info "Initialisation du dépôt Git..."
        git init
        
        # Configuration des hooks Git
        git config core.hooksPath .husky
    fi
    
    # Ajout des fichiers au staging
    log_info "Ajout des fichiers au staging..."
    git add .
    
    # Premier commit si nécessaire
    if ! git log --oneline -1 &> /dev/null; then
        log_info "Création du premier commit..."
        git commit -m "🚀 Configuration initiale - Architecture DevWeb31"
        log_success "Premier commit créé"
    else
        log_info "Dépôt Git déjà configuré"
    fi
}

# Configuration finale
final_setup() {
    log_info "Configuration finale..."
    
    cd "$PROJECT_ROOT"
    
    # Rendre les scripts exécutables
    chmod +x scripts/*.sh
    
    # Vérification de la configuration
    log_info "Vérification de la configuration..."
    
    if [ -f "package.json" ] && [ -f "vite.config.ts" ] && [ -f "tailwind.config.js" ]; then
        log_success "✅ Configuration de base détectée"
    else
        log_warning "⚠️  Certains fichiers de configuration sont manquants"
    fi
    
    if [ -f ".env.development" ]; then
        log_success "✅ Variables d'environnement configurées"
    else
        log_warning "⚠️  Variables d'environnement manquantes"
    fi
    
    if [ -d ".husky" ]; then
        log_success "✅ Husky configuré"
    else
        log_warning "⚠️  Husky non configuré"
    fi
    
    echo ""
    log_success "🎉 Configuration initiale terminée avec succès!"
    echo ""
    log_info "📋 Prochaines étapes:"
    echo "   1. Vérifiez les variables d'environnement dans .env.development"
    echo "   2. Lancez l'environnement de développement: npm run dev"
    echo "   3. Démarrez Supabase local: ./scripts/supabase-dev.sh start"
    echo "   4. Testez votre application: npm run test"
    echo ""
    log_info "🔗 Documentation:"
    echo "   - Supabase: https://supabase.com/docs"
    echo "   - Vercel: https://vercel.com/docs"
    echo "   - Architecture DevWeb31: Documentation interne"
}

# Fonction principale
main() {
    echo "🚀 Configuration initiale - Architecture DevWeb31"
    echo "=================================================="
    echo ""
    
    check_prerequisites
    install_dependencies
    setup_environment
    setup_supabase
    setup_husky
    setup_git
    final_setup
}

# Exécution du script
main "$@"
