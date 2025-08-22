# 🔧 Guide de Résolution des Problèmes Supabase

## Problème Identifié
Vous ne pouvez pas vous connecter au back-office à cause d'une erreur "Failed to fetch" et "Invalid API key".

## Cause Principale
La clé anonyme Supabase dans votre fichier `.env` est **tronquée** et n'est pas valide.

## Solution

### 1. Récupérer la Vraie Clé Anonyme
1. Connectez-vous à votre [dashboard Supabase](https://supabase.com/dashboard)
2. Sélectionnez votre projet `marie-fortea`
3. Allez dans **Settings** → **API**
4. Copiez la **anon public key** complète (elle commence par `eyJ...`)

### 2. Corriger le Fichier .env
Remplacez le contenu de votre fichier `.env` par :

```bash
# ===== ENVIRONNEMENT DE DÉVELOPPEMENT =====
VITE_SUPABASE_URL_DEV=https://hwtfbyknjwlmidxeazbe.supabase.co
VITE_SUPABASE_ANON_KEY_DEV=VOTRE_VRAIE_CLE_ANONYME_ICI

# ===== ENVIRONNEMENT DE PRODUCTION =====
VITE_SUPABASE_URL=https://hwtfbyknjwlmidxeazbe.supabase.co
VITE_SUPABASE_ANON_KEY=VOTRE_VRAIE_CLE_ANONYME_ICI
```

### 3. Vérifier la Configuration
Après avoir corrigé le fichier `.env`, redémarrez votre serveur de développement :

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

### 4. Tester la Connexion
Utilisez le composant de test intégré sur la page de connexion admin pour vérifier que tout fonctionne.

## Vérifications Supplémentaires

### Connexion Internet
Assurez-vous que votre connexion internet fonctionne correctement.

### URL Supabase
Vérifiez que l'URL `https://hwtfbyknjwlmidxeazbe.supabase.co` est correcte et accessible.

### Permissions de la Clé
La clé anonyme doit avoir les permissions nécessaires pour :
- L'authentification (`auth`)
- L'accès aux tables (`site_settings`, etc.)

## Structure de la Clé Anonyme
Une clé anonyme Supabase valide ressemble à ceci :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dGZieWtuandsbWlkeGVhemJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMTMyNDcsImV4cCI6MjA3MDg4OTI0N30.qlVUwwRYxxxx2pK0wwkVn-qiopFMATK3jeZsOo4FWSU
```

## Support
Si le problème persiste après ces corrections, vérifiez :
1. Les logs de la console du navigateur
2. Les logs du serveur de développement
3. La configuration de votre projet Supabase
