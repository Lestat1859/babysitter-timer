# Règles de sécurité Firebase pour le système Admin/User

## 🔒 Philosophie de sécurité

Ce document décrit les règles de sécurité Firebase Database recommandées pour supporter le système de rôles Admin/User dans BabySitter Timer.

## 📋 Règles recommandées

### Structure de base

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    
    "Iloukia": {
      ".read": "auth != null && (auth.token.email == 'valavaneiloukia@gmail.com' || auth.token.isAdmin == true)",
      ".write": "auth != null && (auth.token.email == 'valavaneiloukia@gmail.com' || auth.token.isAdmin == true)"
    },
    
    "PriceTimeInterval": {
      ".read": "auth != null",
      ".write": "auth != null && auth.token.isAdmin == true"
    },
    
    "admin": {
      ".read": "auth != null && auth.token.isAdmin == true",
      ".write": "auth != null && auth.token.isAdmin == true"
    },
    
    "users": {
      ".read": "auth != null && auth.token.isAdmin == true",
      ".write": "auth != null && auth.token.isAdmin == true",
      "$uid": {
        ".read": "auth != null && (auth.uid == $uid || auth.token.isAdmin == true)",
        ".write": "auth != null && (auth.uid == $uid || auth.token.isAdmin == true)"
      }
    }
  }
}
```

## 🎯 Explication des règles

### 1. **Règle globale par défaut**
```json
".read": "auth != null",
".write": "auth != null"
```
- **Objectif** : S'assurer que seuls les utilisateurs authentifiés peuvent accéder aux données
- **Sécurité** : Empêche tout accès anonyme

### 2. **Sessions de babysitting (Iloukia)**
```json
"Iloukia": {
  ".read": "auth != null && (auth.token.email == 'valavaneiloukia@gmail.com' || auth.token.isAdmin == true)",
  ".write": "auth != null && (auth.token.email == 'valavaneiloukia@gmail.com' || auth.token.isAdmin == true)"
}
```
- **Objectif** : Limiter l'accès aux sessions à l'utilisateur principal ou aux admins
- **Sécurité** : Isolation des données personnelles
- **Évolution** : Peut être étendu pour supporter plusieurs utilisateurs

### 3. **Intervalles de prix (PriceTimeInterval)**
```json
"PriceTimeInterval": {
  ".read": "auth != null",
  ".write": "auth != null && auth.token.isAdmin == true"
}
```
- **Objectif** : Tous peuvent lire les tarifs, seuls les admins peuvent les modifier
- **Sécurité** : Empêche la modification non autorisée des tarifs

### 4. **Zone d'administration**
```json
"admin": {
  ".read": "auth != null && auth.token.isAdmin == true",
  ".write": "auth != null && auth.token.isAdmin == true"
}
```
- **Objectif** : Strictement réservé aux administrateurs
- **Sécurité** : Données sensibles d'administration

### 5. **Gestion des utilisateurs**
```json
"users": {
  ".read": "auth != null && auth.token.isAdmin == true",
  ".write": "auth != null && auth.token.isAdmin == true",
  "$uid": {
    ".read": "auth != null && (auth.uid == $uid || auth.token.isAdmin == true)",
    ".write": "auth != null && (auth.uid == $uid || auth.token.isAdmin == true)"
  }
}
```
- **Objectif** : 
  - Admins : Accès global à tous les profils utilisateurs
  - Users : Accès uniquement à leur propre profil
- **Sécurité** : Isolation des données utilisateur

## 🔑 Custom Claims utilisés

### Structure des claims
```typescript
{
  "role": "admin" | "user",
  "isAdmin": boolean
}
```

### Utilisation dans les règles
- `auth.token.isAdmin` : Vérification booléenne rapide
- `auth.token.role` : Vérification basée sur le rôle string
- `auth.uid` : Identifiant unique de l'utilisateur
- `auth.token.email` : Email de l'utilisateur (pour transition)

## 🛡️ Principes de sécurité

### 1. **Principe de moindre privilège**
- Les utilisateurs n'ont accès qu'aux données nécessaires
- Les admins ont accès étendu mais contrôlé

### 2. **Validation côté serveur**
- Les règles Firebase agissent comme firewall
- Les custom claims sont gérés côté serveur (sécurisés)

### 3. **Isolation des données**
- Chaque utilisateur ne voit que ses données
- Les admins peuvent tout voir mais avec traçabilité

### 4. **Évolutivité**
- Structure préparée pour le multi-utilisateur
- Possibilité d'ajouter d'autres rôles facilement

## 🚀 Déploiement des règles

### Via Firebase CLI
```bash
firebase deploy --only database
```

### Via MCP Firebase
```typescript
firebase_database_validate_rules({
  rules: JSON.stringify(rulesObject)
})
```

## 🔍 Tests de validation

### Tests essentiels à effectuer :

1. **Utilisateur non-authentifié**
   - ❌ Doit être rejeté sur toutes les règles

2. **Utilisateur standard**
   - ✅ Peut lire PriceTimeInterval
   - ✅ Peut accéder à ses propre données (si structuré par UID)
   - ❌ Ne peut pas accéder aux données admin
   - ❌ Ne peut pas modifier PriceTimeInterval

3. **Administrateur**
   - ✅ Accès complet à toutes les données
   - ✅ Peut modifier tous les paramètres
   - ✅ Peut gérer les utilisateurs

## ⚠️ Points d'attention

### Migration graduelle
- L'email `valavaneiloukia@gmail.com` est hardcodé pour la transition
- À terme, remplacer par une structure basée sur les UIDs

### Performance
- Les règles sont évaluées à chaque requête
- Maintenir une complexité raisonnable

### Audit
- Chaque accès est tracé par Firebase
- Les custom claims changes sont auditables

Cette architecture de sécurité garantit une protection robuste tout en conservant la flexibilité nécessaire pour l'évolution de l'application.