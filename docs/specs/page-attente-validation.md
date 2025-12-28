# Spécification : Page "En attente de validation"

## 1. Contexte et Objectif

Actuellement, lorsqu'un utilisateur s'inscrit, son compte est créé avec le statut `isActive: false`. L'application détecte ce statut et redirige l'utilisateur vers une page générique "Access Denied" (Accès Refusé).

Ce comportement est techniquement correct mais offre une mauvaise expérience utilisateur (UX). L'utilisateur peut penser qu'il a fait une erreur ou qu'il est banni, alors qu'il est simplement en attente de validation.

**Objectif :** Créer une page dédiée "En attente de validation" qui explique clairement la situation et rassure l'utilisateur.

## 2. Spécifications Fonctionnelles

### 2.1. Nouvelle Page : `PendingApproval`

Cette page doit s'afficher pour les utilisateurs authentifiés qui ont un document dans `authorizedUsers` mais dont le champ `isActive` est `false`.

**Contenu de la page :**
*   **Titre :** "Compte en attente de validation" (ou similaire).
*   **Message principal :** "Votre inscription a bien été prise en compte. Pour des raisons de sécurité, l'accès à l'application nécessite une validation manuelle par un administrateur."
*   **Message secondaire :** "Vous recevrez une notification (ou pourrez vous connecter) une fois votre compte activé."
*   **Actions :**
    *   Bouton "Se déconnecter" (pour permettre de revenir à l'écran de login).
    *   (Optionnel) Bouton "Contacter l'administrateur" (lien mailto).

### 2.2. Distinction des Cas

Le système doit distinguer deux cas qui mènent actuellement à "Access Denied" :

1.  **Cas "En attente" (Nouveau flux) :**
    *   L'utilisateur est authentifié (Auth).
    *   Le document Firestore existe dans `authorizedUsers`.
    *   `isActive` est `false`.
    *   -> **Redirection vers `PendingApproval`**.

2.  **Cas "Non Autorisé" (Ancien flux / Sécurité) :**
    *   L'utilisateur est authentifié (Auth).
    *   Le document Firestore **n'existe pas** dans `authorizedUsers`.
    *   L'utilisateur n'est pas dans la whitelist (variable d'env).
    *   -> **Reste sur `AccessDenied`** (ou message "Vous n'êtes pas autorisé à accéder à cette application").

## 3. Spécifications Techniques

### 3.1. Composant `PendingApproval.tsx`

Créer un nouveau composant dans `src/component/Auth/PendingApproval.tsx`.

**Design System & Cohérence Graphique :**
*   **Framework :** Utiliser strictement Material UI (MUI) comme le reste de l'application.
*   **Thème :** Utiliser le hook `useTheme()` pour accéder aux couleurs définies dans le thème global (`primary.main`, `background.default`, etc.).
*   **Structure :** Reprendre la structure de carte centrée utilisée dans `AuthContainer` et `AccessDenied` pour une expérience fluide.
*   **Iconographie :** Utiliser les icônes MUI (`@mui/icons-material`) cohérentes avec le style (ex: `HourglassEmpty` ou `Schedule` pour l'attente).
*   **Typographie :** Respecter la hiérarchie des titres (`h4`, `h5`) et corps de texte (`body1`, `body2`) définie dans le thème.

```typescript
// Structure suggérée (pseudo-code)
<Container maxWidth="sm">
  <Card sx={{ mt: 8, p: 4, textAlign: 'center', borderRadius: 3, boxShadow: 3 }}>
    <Avatar sx={{ m: 'auto', bgcolor: 'warning.light', mb: 2 }}>
      <HourglassEmptyIcon />
    </Avatar>
    <Typography variant="h5" gutterBottom>
      Validation en cours
    </Typography>
    <Typography variant="body1" color="text.secondary" paragraph>
      Votre compte est créé...
    </Typography>
    <Button variant="contained" onClick={signOut}>
      Se déconnecter
    </Button>
  </Card>
</Container>
```

### 3.2. Modification de `AppRouter.tsx`

Dans le composant `AuthProvider` (ou la logique de routage), modifier la gestion de l'état `accessDenied`.

Actuellement :
```typescript
if (authorizedUser && authorizedUser.isActive) {
    // ... Login success
} else {
    // ... Access Denied
    setAccessDenied(true);
}
```

Nouvelle logique :
```typescript
// Ajouter un nouvel état
const [pendingApproval, setPendingApproval] = useState(false);

// ...

if (authorizedUser) {
    if (authorizedUser.isActive) {
        // ... Login success
        setPendingApproval(false);
        setAccessDenied(false);
    } else {
        // Utilisateur connu mais inactif -> En attente
        setPendingApproval(true);
        setAccessDenied(false);
    }
} else {
    // Utilisateur inconnu -> Accès refusé
    setAccessDenied(true);
    setPendingApproval(false);
}
```

### 3.3. Affichage conditionnel

Dans le rendu de `AuthProvider` :

```typescript
if (pendingApproval) {
    return <PendingApproval />;
}

if (accessDenied) {
    return <AccessDenied />;
}
```

## 4. Plan d'implémentation

1.  Créer le composant `src/component/Auth/PendingApproval.tsx`.
2.  Modifier `src/component/Router/AppRouter.tsx` pour intégrer la logique de distinction (état `pendingApproval`).
3.  Tester avec le compte utilisateur actuellement en attente.
