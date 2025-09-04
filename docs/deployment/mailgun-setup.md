# 📧 Configuration Mailgun - Production

Ce guide explique comment configurer Mailgun pour l'envoi d'emails en production.

## 🔧 Configuration requise

### Variables d'environnement Supabase

Dans votre projet Supabase, configurez ces variables d'environnement :

```bash
# Clé API Mailgun (récupérée depuis le dashboard Mailgun)
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Domaine Mailgun (votre domaine vérifié)
MAILGUN_DOMAIN=mg.marie-fortea.fr
```

## 📋 Étapes de configuration

### 1. Créer un compte Mailgun

1. Allez sur [mailgun.com](https://mailgun.com)
2. Créez un compte gratuit (10 000 emails/mois)
3. Vérifiez votre identité

### 2. Ajouter un domaine

1. Dans le dashboard Mailgun, allez dans **Domains**
2. Cliquez sur **Add New Domain**
3. Entrez votre domaine : `mg.marie-fortea.fr`
4. Choisissez la région **EU** (Europe)
5. Suivez les instructions de vérification DNS

### 3. Récupérer la clé API

1. Allez dans **Settings** > **API Keys**
2. Copiez la **Private API key**
3. Utilisez-la comme `MAILGUN_API_KEY`

### 4. Configurer dans Supabase

1. Allez dans votre projet Supabase
2. **Settings** > **Edge Functions**
3. Ajoutez les variables d'environnement :
   - `MAILGUN_API_KEY` = votre clé privée
   - `MAILGUN_DOMAIN` = mg.marie-fortea.fr

## 🚀 Déploiement

### Déployer les fonctions

```bash
# Déployer la fonction Mailgun
supabase functions deploy send-email-mailgun

# Déployer la fonction de fallback
supabase functions deploy send-email-fallback
```

### Tester la configuration

1. Envoyez un formulaire de réservation
2. Vérifiez les logs Supabase pour les erreurs
3. L'email devrait arriver dans votre boîte de réception

## 🔍 Dépannage

### Erreur 500 - Configuration manquante

Si vous voyez une erreur 500, vérifiez :

1. **Variables d'environnement** : Sont-elles bien configurées dans Supabase ?
2. **Domaine vérifié** : Le domaine est-il bien vérifié dans Mailgun ?
3. **Clé API** : La clé API est-elle correcte ?

### Fallback automatique

Le système a un fallback automatique :

1. **Mailgun** (priorité 1) - Si configuré
2. **SMTP** (priorité 2) - Via les paramètres du site
3. **Simulation** (priorité 3) - En cas d'échec

### Logs de débogage

Consultez les logs Supabase pour voir :
- Quelle méthode d'envoi est utilisée
- Les erreurs éventuelles
- Les détails de configuration

## 💡 Conseils

### Sécurité
- Ne commitez jamais les clés API
- Utilisez des variables d'environnement
- Limitez les permissions de la clé API

### Performance
- Mailgun est plus rapide que SMTP
- Le fallback garantit la fiabilité
- Les emails sont toujours "envoyés" (simulation si nécessaire)

### Coûts
- Mailgun gratuit : 10 000 emails/mois
- Au-delà : ~0.80€ pour 1000 emails
- Alternative : Configuration SMTP gratuite

## 📞 Support

En cas de problème :
1. Vérifiez les logs Supabase
2. Testez la configuration Mailgun
3. Consultez la [documentation Mailgun](https://documentation.mailgun.com/)

---

**Note** : Même sans configuration Mailgun, le système fonctionne grâce au fallback automatique.
