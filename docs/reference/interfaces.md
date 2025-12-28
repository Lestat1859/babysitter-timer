# Interfaces TypeScript

*Référence complète des types et interfaces utilisés dans BabySitter Timer*

Cette page documente tous les types TypeScript définis dans l'application, organisés par domaine fonctionnel.

## 📊 Interfaces de données principales

### `IBabySitting`

Interface principale représentant une session de babysitting.

```typescript
interface IBabySitting {
  id: string;                 // Identifiant unique de la session
  arrivalDate: Date;          // Date et heure d'arrivée 
  departureDate: Date;        // Date et heure de départ
  duration: Duration;         // Durée calculée automatiquement (date-fns)
}
```

**Fichier source** : [`src/interfaces/IBabySitting.ts`](../../src/interfaces/IBabySitting.ts)

**Utilisation principal** :
- Stockage des sessions dans Firestore
- Affichage dans les composants de liste
- Calculs de statistiques

**Notes importantes** :
- ⚠️ `duration` est calculé automatiquement lors de la sauvegarde
- 📊 Les dates utilisent le type natif JavaScript `Date`
- 🔒 `id` est généré par Firebase et ne doit pas être modifié

### `IBabysittingFilter`

Interface pour la configuration des filtres de sessions.

```typescript
interface IBabysittingFilter {
  id: string;         // Identifiant unique du filtre
  year: number;       // Année du filtre (ex: 2023)
  month: number;      // Mois du filtre (1-12)
}
```

**Fichier source** : [`src/interfaces/IBabysittingFilter.ts`](../../src/interfaces/IBabysittingFilter.ts)

**Utilisation principal** :
- État global dans Recoil pour le filtrage
- Configuration du composant `BabySittingFilters`
- Persistance des préférences de filtrage

**Valeurs possibles** :
- `month` : 1 (janvier) à 12 (décembre)
- `year` : Années disponibles dans les données

### `IPriceTimeInterval`

Interface pour définir les tranches tarifaires temporelles.

```typescript
interface IPriceTimeInterval {
  begin: Date;        // Date de début de la tranche
  end: Date;          // Date de fin de la tranche  
  price: number;      // Prix en euros pour cette tranche
}
```

**Fichier source** : [`src/interfaces/IPriceTimeInterval.ts`](../../src/interfaces/IPriceTimeInterval.ts)

**Utilisation principal** :
- Calcul automatique des paiements
- Gestion de tarifs variables selon la période
- Statistiques de revenus

**Exemple d'usage** :
```typescript
const tarif: IPriceTimeInterval = {
  begin: new Date(2023, 0, 1, 18, 0), // 18h00
  end: new Date(2023, 0, 1, 22, 0),   // 22h00
  price: 12                            // 12€/heure
};
```

## 👤 Interfaces d'authentification

### `IAuthUser`

Interface représentant un utilisateur authentifié.

```typescript
interface IAuthUser {
  uid: string;                    // Identifiant unique Firebase
  email: string;                  // Adresse email de l'utilisateur
  displayName?: string;           // Nom d'affichage (optionnel)
  photoURL?: string;              // URL de photo de profil (optionnel)
  emailVerified: boolean;         // Email vérifié ou non
}
```

**Fichier source** : [`src/interfaces/IAuthUser.ts`](../../src/interfaces/IAuthUser.ts)

**Utilisation principal** :
- Contexte d'authentification React
- Gestion des sessions utilisateur
- Contrôle d'accès aux données

**Relation Firebase** :
- Basé sur `firebase.User` mais simplifié
- `uid` correspond à l'identifiant Firebase Auth
- Utilisé avec les règles de sécurité Firestore

### `IAuth`

Interface pour les méthodes d'authentification.

```typescript
interface IAuth {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: IAuthUser | null;
  loading: boolean;
}
```

**Fichier source** : [`src/interfaces/IAuth.ts`](../../src/interfaces/IAuth.ts)

**Utilisation principal** :
- Interface du contexte d'authentification
- Contrat pour les services d'auth
- Typage des hooks d'authentification

## 🎨 Interfaces de thèmes et UI

### `IThemeMode`

Type union pour les modes de thème disponibles.

```typescript
type IThemeMode = 'light' | 'dark';

interface IThemeContext {
  mode: IThemeMode;
  toggleMode: () => void;
}
```

**Fichier source** : [`src/interfaces/ITheme.ts`](../../src/interfaces/ITheme.ts)

**Utilisation principal** :
- Configuration du contexte de thème
- Persistance des préférences utilisateur
- Basculement entre thèmes clair/sombre

### `IComponentProps`

Interfaces pour les props des composants principaux.

```typescript
// Props pour BabySittingElement
interface IBabySittingElementProps {
  babysitting: IBabySitting;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// Props pour BabySittingFilters  
interface IBabySittingFiltersProps {
  onFilterChange?: (filter: IBabysittingFilter) => void;
}

// Props pour ThemeToggle
interface IThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'default';
}
```

**Fichiers sources** : Répartis dans les dossiers des composants

**Utilisation principal** :
- Typage des propriétés des composants
- Documentation des APIs des composants
- IntelliSense et vérification de types

## 🔧 Types utilitaires

### Types de calculs

```typescript
// Type pour les statistiques calculées
interface IBabysittingStats {
  totalSessions: number;          // Nombre total de sessions
  totalHours: number;             // Nombre total d'heures
  totalEarnings: number;          // Gains totaux en euros
  averageDuration: number;        // Durée moyenne en heures
  declarableAmount: number;       // Montant à déclarer
}

// Type pour les calculs de prix
interface IPriceCalculation {
  baseAmount: number;             // Montant de base
  bonusAmount: number;            // Montants bonus/malus
  totalAmount: number;            // Montant total calculé
}
```

### Types d'API

```typescript
// Type pour les réponses Firestore
interface IFirestoreResponse<T> {
  data: T[];
  error?: string;
  loading: boolean;
}

// Type pour les mutations Firestore  
interface IFirestoreMutation {
  mutate: (data: any) => Promise<void>;
  loading: boolean;
  error?: string;
}
```

## 🔗 Modules de types externes

### Date-fns

```typescript
import { Duration } from 'date-fns';

// Utilisé dans IBabySitting.duration
// Fournit un objet avec years, months, days, hours, minutes, seconds
```

### Firebase

```typescript
import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

// IAuthUser basé sur User
// Les dates Firestore utilisent Timestamp puis converties en Date
```

### Material-UI

```typescript
import { Theme } from '@mui/material/styles';

// Utilisé pour étendre le thème personnalisé
// Ajout de propriétés custom au thème MUI
```

## 🚀 Exemples d'usage

### Création d'une session

```typescript
const nouvelleSession: IBabySitting = {
  id: '', // Généré par Firebase
  arrivalDate: new Date(2023, 11, 15, 18, 0), // 15 déc 2023 18h00
  departureDate: new Date(2023, 11, 15, 22, 30), // 15 déc 2023 22h30
  duration: intervalToDuration({
    start: new Date(2023, 11, 15, 18, 0),
    end: new Date(2023, 11, 15, 22, 30)
  })
};
```

### Configuration d'un filtre

```typescript
const filtreActuel: IBabysittingFilter = {
  id: 'filter-2023-12',
  year: 2023,
  month: 12
};
```

### Utilisation dans un composant

```typescript
interface MonComposantProps {
  sessions: IBabySitting[];
  filtre: IBabysittingFilter;
  utilisateur: IAuthUser;
}

const MonComposant: React.FC<MonComposantProps> = ({ 
  sessions, 
  filtre, 
  utilisateur 
}) => {
  // Logique du composant avec types garantis
};
```

## 📋 Conventions de nommage

- **Interfaces** : Préfixe `I` + nom en PascalCase (ex: `IBabySitting`)
- **Types** : Nom en PascalCase sans préfixe (ex: `ThemeMode`)
- **Propriétés** : camelCase (ex: `arrivalDate`)
- **Constantes** : UPPER_SNAKE_CASE (ex: `DEFAULT_FILTER`)

---

*Cette référence respecte les principes Diataxis : information précise, organisation claire, et consultabilité technique.*