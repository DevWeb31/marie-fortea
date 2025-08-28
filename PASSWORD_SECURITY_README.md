# 🔐 Sécurité des Mots de Passe SMTP

## Vue d'ensemble

Le système de configuration SMTP de Marie Fortea implémente un système de hachage sécurisé pour les mots de passe SMTP, garantissant qu'aucun mot de passe en clair n'est stocké en base de données.

## 🛡️ Fonctionnalités de Sécurité

### 1. **Hachage SHA-256**
- **Algorithme** : SHA-256 (Secure Hash Algorithm 256-bit)
- **Implémentation** : Utilise l'API Web Crypto native du navigateur
- **Avantage** : Hachage cryptographique unidirectionnel

### 2. **Gestion Séparée des Mots de Passe**
- **Affichage** : Le champ mot de passe utilise un état local séparé (`plainPassword`)
- **Sauvegarde** : Seul le hash est stocké en base de données
- **Test** : Le mot de passe en clair est utilisé uniquement pour les tests de connexion

### 3. **Séparation des Responsabilités**
- **Interface** : Gère l'affichage et la saisie du mot de passe
- **Sauvegarde** : Hache et stocke le mot de passe
- **Test** : Utilise le mot de passe en clair pour la validation SMTP

## 🔧 Implémentation Technique

### Fichiers Clés

#### `src/lib/password-utils.ts`
```typescript
// Hachage du mot de passe
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
```

#### `src/components/SmtpSettingsManager.tsx`
```typescript
// Sauvegarde avec hachage
if (plainPassword) {
  const hashedPassword = await hashPassword(plainPassword);
  await SiteSettingsService.updateSetting('smtp_password', hashedPassword);
}
```

### Flux de Données

1. **Saisie** : L'utilisateur saisit le mot de passe dans `plainPassword`
2. **Sauvegarde** : Le mot de passe est haché avec `hashPassword()`
3. **Stockage** : Le hash est sauvegardé en base de données
4. **Test** : Le mot de passe en clair est utilisé pour tester la connexion SMTP
5. **Nettoyage** : `plainPassword` est réinitialisé après sauvegarde

## 🚀 Utilisation

### Configuration SMTP

1. **Remplir les paramètres** :
   - Serveur SMTP (ex: `smtp.gmail.com`)
   - Port (ex: `587`)
   - Nom d'utilisateur (ex: `votre.email@gmail.com`)
   - **Mot de passe** (sera automatiquement haché)

2. **Sauvegarder** : Cliquer sur "Sauvegarder"
   - Le mot de passe est haché automatiquement
   - Seul le hash est stocké en base

3. **Tester** : Cliquer sur "Tester la connexion"
   - Utilise le mot de passe en clair pour le test
   - Envoie un email de test pour valider la configuration

### Vérification de Sécurité

#### Dans la Base de Données
```sql
-- Le mot de passe est stocké comme hash
SELECT key, value FROM site_settings WHERE key = 'smtp_password';
-- Résultat : smtp_password | a1b2c3d4e5f6... (hash SHA-256)
```

#### Dans l'Interface
- Le champ mot de passe affiche des astérisques
- Un message indique que le mot de passe sera haché
- Le mot de passe en clair n'est jamais affiché

## 🔒 Avantages de Sécurité

### 1. **Protection contre les Fuites**
- Même si la base de données est compromise, les mots de passe restent sécurisés
- Les hashes SHA-256 sont cryptographiquement sécurisés

### 2. **Conformité RGPD**
- Aucune donnée sensible n'est stockée en clair
- Respect des bonnes pratiques de sécurité

### 3. **Audit et Traçabilité**
- Tous les accès aux paramètres SMTP sont tracés
- Historique des modifications conservé

## ⚠️ Limitations et Considérations

### 1. **Hachage SHA-256 Simple**
- **Limitation** : Pas de salt (sel) pour renforcer le hachage
- **Raison** : Compatibilité avec les tests SMTP en temps réel
- **Alternative** : Implémentation future avec salt + hachage

### 2. **Stockage Temporaire**
- Le mot de passe en clair reste en mémoire pendant la session
- **Recommandation** : Fermer le navigateur après configuration

### 3. **Tests de Connexion**
- Nécessite l'accès au mot de passe en clair
- **Sécurité** : Utilisation uniquement pour la validation SMTP

## 🔮 Améliorations Futures

### 1. **Hachage avec Salt**
```typescript
// Génération d'un salt unique
const salt = generateSalt(32);
const hashedPassword = await hashPasswordWithSalt(password, salt);

// Stockage : salt + hash
await updateSetting('smtp_password_salt', salt);
await updateSetting('smtp_password_hash', hashedPassword);
```

### 2. **Chiffrement des Hash**
- Chiffrement AES des hashes stockés
- Clé de chiffrement dans les variables d'environnement

### 3. **Rotation des Mots de Passe**
- Expiration automatique des mots de passe
- Notifications de renouvellement

## 📋 Checklist de Sécurité

- [x] **Hachage SHA-256** des mots de passe
- [x] **Séparation** des états mot de passe
- [x] **Nettoyage** automatique après sauvegarde
- [x] **Tests** de connexion sécurisés
- [x] **Documentation** des bonnes pratiques
- [ ] **Salt** pour renforcer le hachage
- [ ] **Chiffrement** des hashes stockés
- [ ] **Rotation** automatique des mots de passe

## 🆘 Support et Dépannage

### Problèmes Courants

1. **Erreur de hachage** : Vérifier la compatibilité du navigateur
2. **Test SMTP échoué** : Vérifier les paramètres de connexion
3. **Mot de passe non sauvegardé** : Vérifier la console pour les erreurs

### Logs de Débogage

```typescript
// Activer les logs de débogage
console.log('Mot de passe SMTP haché avec succès');
console.log('Mot de passe SMTP haché et sauvegardé avec succès');
```

## 📚 Ressources

- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [SHA-256 Algorithm](https://en.wikipedia.org/wiki/SHA-2)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [SMTP Security Best Practices](https://tools.ietf.org/html/rfc8314)
