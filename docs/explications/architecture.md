# Architecture de l'application

*Comprendre l'organisation technique et fonctionnelle de BabySitter Timer*

Cette explication détaille l'architecture de BabySitter Timer, depuis la structure des données jusqu'aux patterns de design utilisés, en expliquant les choix techniques et leur cohérence avec les objectifs métier.

## 🏗️ Vue d'ensemble architecturale

### Paradigme général

BabySitter Timer suit une architecture **React moderne** avec les paradigmes suivants :

- **Single Page Application (SPA)** avec routing côté client
- **State management centralisé** via Recoil
- **Approche composant** avec séparation des responsabilités
- **Backend-as-a-Service** avec Firebase
- **Material Design** pour la cohérence visuelle

### Flux de données principal

```
Interface Utilisateur (React/MUI)
           ↓ ↑
    Gestion d'état (Recoil)
           ↓ ↑
    Services métier (TypeScript)
           ↓ ↑
    Persistance (Firebase)
```

## 📊 Architecture des données

### Modèle métier principal

L'application se structure autour de l'entité centrale **`IBabySitting`** :

```typescript
interface IBabySitting {
  id: string;                 // Identifiant unique UUID
  arrivalDate: Date;          // Date/heure d'arrivée de la babysitter
  departureDate: Date;        // Date/heure de départ
  duration: Duration;         // Durée calculée (date-fns)
}
```

**Justification** : Cette structure simple reflète fidèlement le besoin métier - enregistrer une session définie par son début, sa fin, et sa durée.

### Données dérivées et calculs

L'architecture privilégie les **données dérivées** calculées dynamiquement :

#### Filtre temporel (`IBabysittingFilter`)
```typescript
interface IBabysittingFilter {
  id: string;
  year: number;       // Année de filtrage
  month: number;      // Mois de filtrage (1-12)
}
```

#### Statistiques calculées
Les statistiques sont dérivées en temps réel via les **sélecteurs Recoil** :

- **Nombre total de sessions** : `listBabySittings.length`
- **Durée totale** : Somme des durées via `sumDurations()`
- **Montant à déclarer** : Heures × tarif via `formatDurationsInHours()`
- **Durée moyenne** : Totaldes heures / nombre de sessions

**Avantage** : Garantit la cohérence des données - toute modification d'une session met automatiquement à jour toutes les statistiques.

## 🔄 Gestion d'état avec Recoil

### Architecture des atomes

BabySitter Timer utilise une approche **normalisée** avec Recoil :

#### Atomes de base (sources de vérité)

```typescript
// État principal des sessions
const babysittingState = atom<IBabySitting[]>({
  key: "babysittingState",
  default: []
});

// Filtre utilisateur
const babysittingFilterState = atom<IBabysittingFilter>({
  key: "babysittingFilterState", 
  default: { year: currentYear, month: currentMonth }
});
```

#### Sélecteurs dérivés (vues calculées)

```typescript
// Sessions filtrées
const filteredBabySittingState = selector({
  key: "filteredBabySittingState",
  get: ({get}) => {
    const sessions = get(babysittingState);
    const filter = get(babysittingFilterState);
    return sessions
      .filter(session => matchesFilter(session, filter))
      .sort((a, b) => b.arrivalDate - a.arrivalDate); // Plus récent en premier
  }
});

// Statistiques dynamiques
const babysittingStatsState = selector({
  key: "babysittingStatsState",
  get: ({get}) => {
    const filteredSessions = get(filteredBabySittingState);
    return calculateStats(filteredSessions); // Calcul en temps réel
  }
});
```

### Avantages de cette approche

1. **Réactivité** : Tout changement dans les sessions met automatiquement à jour les vues
2. **Performance** : Recoil optimise les recalculs (memoization)
3. **Cohérence** : Impossible d'avoir des statistiques obsolètes
4. **Simplicité** : Les composants ne gèrent que l'affichage

## 🎯 Use Cases métier

### 1. Gestion des sessions de babysitting

#### UC1 : Créer une nouvelle session

**Flux principal** :
```typescript
// Composant Babysitting.tsx
function addBabysitting() {
  const babySitting: IBabySitting = {
    id: uuidv4(),
    arrivalDate: arrivalDate,
    departureDate: departureDate,
    duration: calculateDurationBetweenTwoDates(arrivalDate, departureDate)
  };
  
  // 1. Sauvegarde Firebase
  await addBabySittingToFireBase(babySitting);
  
  // 2. Mise à jour état local
  setBabySittings([...babySittings, babySitting]);
  
  // 3. Feedback utilisateur
  toast.success("Session ajoutée avec succès !");
  
  // 4. Navigation retour
  navigate(-1);
}
```

**Validations métier** :
- Durée > 0 (empêche les sessions vides)
- Date départ ≥ date arrivée
- Calcul automatique de la durée

#### UC2 : Modifier une session existante

**Particularité** : Mise à jour optimiste avec rollback en cas d'erreur :

```typescript
async function updateBabysitting() {
  // 1. Optimistic update (UI instantané)
  const updatedSessions = babySittings.map(session => 
    session.id === idBabysitting ? newBabySitting : session
  );
  setBabySittings(updatedSessions);
  
  try {
    // 2. Sauvegarde Firebase
    await updateBabySittingToFireBase(newBabySitting);
    toast.success("Session mise à jour avec succès !");
  } catch (error) {
    // 3. Rollback en cas d'erreur
    setBabySittings(originalSessions);
    toast.error("Erreur lors de la mise à jour.");
  }
}
```

### 2. Filtrage et consultation

#### UC3 : Filtrer par période

Le filtrage suit un pattern **réactif** :

```typescript
// Composant BabySittingFilters.tsx
function handleMonthButtonClick(month: number) {
  // 1. Mise à jour du filtre
  setFilter({ ...currentFilter, month });
  
  // 2. Auto-update des composants qui utilisent filteredBabySittingState
  //    - BabySittingList (affichage sessions)
  //    - BabySittingStats (statistiques)
  
  // 3. Analytics tracking
  logEvent(fireBaseAnalytics, "babysitting_filter_month_change", { month });
}
```

**Automatismes** :
- Navigation cross-year (décembre → janvier change l'année)
- Scroll automatique pour garder le mois sélectionné visible
- Persistence du filtre pendant la session

### 3. Calcul et suivi financier

#### UC4 : Calcul automatique des montants

```typescript
// Sélecteur babysittingStatsState
function calculateStats(sessions: IBabySitting[]): BabysittingStats {
  // 1. Agrégation des durées
  const totalDuration = sumDurations(
    sessions.map(session => session.duration)
  );
  
  // 2. Conversion en heures (business logic)
  const totalHours = formatDurationsInHours(totalDuration);
  
  // 3. Application du tarif (si configuré)
  const pricePerHour = getPriceFromPriceIntervalsAndDate(priceIntervals, date);
  const totalAmount = roundTwoDecimals(totalHours * pricePerHour);
  
  return {
    totalBabySittings: sessions.length,
    totalBabySittingHours: totalHours,
    totalAmount,
    averageDuration: totalHours / sessions.length
  };
}
```

## 🔧 Patterns architecturaux

### 1. Separation of Concerns

L'application respecte une séparation claire des responsabilités :

#### Composants (Vue)
- **Responsabilité** : Affichage et interactions utilisateur
- **Principe** : Un composant = une responsabilité visuelle
- **Exemples** : `BabySittingList` (affichage liste), `BabySittingStats` (statistiques)

#### Services (Logique métier)
- **Responsabilité** : Opérations CRUD et logique applicative  
- **Principe** : Abstraction des détails d'implémentation
- **Exemples** : `BabySittingService.ts` (CRUD Firebase)

#### Utilitaires (Fonctions pures)
- **Responsabilité** : Calculs et transformations de données
- **Principe** : Fonctions pures, testables unitairement
- **Exemples** : `dates.ts` (calculs temps), `price.ts` (calculs financiers)

### 2. Optimistic UI

L'application privilégie l'**Optimistic UI** pour la réactivité :

```typescript
// Ajout immédiat à l'interface
setBabySittings([...babySittings, newSession]);

// Sauvegarde asynchrone
try {
  await addBabySittingToFireBase(newSession);
} catch (error) {
  // Rollback si échec
  setBabySittings(originalSessions);
  showError("Échec de la sauvegarde");
}
```

**Avantages** :
- Interface réactive (pas d'attente)
- Expérience utilisateur fluide
- Feedback d'erreur approprié

### 3. Defensive Programming

L'application intègre des mécanismes de protection :

#### Validation des saisies
```typescript
function handleSave() {
  // Validation métier
  if (dateError) {
    toast.error(`Erreur : ${dateError}`);
    return;
  }
  
  // Validation durée positive
  if (isDurationEmpty(duration)) {
    toast.error("La durée doit être supérieure à 0.");
    return;
  }
  
  // Poursuite du traitement...
}
```

#### Gestion d'états de chargement
```typescript
const [isSaving, setIsSaving] = useState(false);

// Disabled pendant les opérations
<Button disabled={isSaving} onClick={handleSave}>
  {isSaving ? <CircularProgress /> : "Enregistrer"}
</Button>
```

## 🔄 Flux de navigation

### Router hiérarchique

```
AppRouter (Auth + RecoilRoot)
├── PublicRouter (non-authentifié)
│   ├── / → AuthContainer
│   ├── /login → AuthContainer  
│   └── /* → ErrorPage
└── PrivateRouter (authentifié)
    ├── / → View (liste + stats)
    ├── /babysitting/add → Babysitting (mode création)
    ├── /babysitting/edit/:id → Babysitting (mode édition)
    └── /* → ErrorPage
```

**Pattern de protection** : L'authentification détermine quel router utiliser.

### Navigation contextuelle

L'application utilise une navigation **contextuelle** :

```typescript
// Retour intelligent
function handleReturn() {
  navigate(-1); // Retour à l'écran précédent
}

// Navigation après action
function handleSave() {
  await saveSession();
  navigate(-1); // Retour automatique après sauvegarde
}
```

## 📈 Patterns de performance

### 1. Lazy Loading des calculs

Les statistiques sont calculées **à la demande** :

```typescript
// Recalcul uniquement si les sessions filtrées changent
const stats = useRecoilValue(babysittingStatsState);

// Condition d'affichage pour éviter les rendus inutiles
if (totalBabySittings === 0) return null;
```

### 2. Memoization native

Recoil fournit une memoization native :
- Les sélecteurs ne recalculent que si leurs dépendances changent
- Les composants ne re-rendent que si leurs données Recoil changent

### 3. Optimisation des rendus

```typescript
// Évite les re-rendus inutiles
const handleMonthClick = useCallback((month: number) => {
  setFilter(prev => ({ ...prev, month }));
}, []);
```

## 🔒 Architecture de sécurité

### Authentification par white-list

```typescript
// Contrôle d'accès restrictif
if (authUser.email && isUserInAuthWhiteList(authUser.email)) {
  setCurrentUser(authUser);
} else {
  setAccessDenied(true);
}
```

### Isolation des données

- Chaque utilisateur accède uniquement à ses propres données
- Structure Firebase : `/Iloukia/{sessionId}` (namespace par utilisateur)

## 🎯 Conclusions architecturales

Cette architecture reflète plusieurs choix stratégiques :

### 1. **Simplicité avant tout**
- Modèle de données minimal mais expressif
- Logique métier concentrée dans les sélecteurs
- Interface utilisateur déclarative

### 2. **Réactivité native**  
- État centralisé avec propagation automatique
- Interface optimiste pour la performance
- Synchronisation transparente avec Firebase

### 3. **Maintenabilité**
- Séparation claire des responsabilités
- Code TypeScript pour la sûreté de types
- Patterns cohérents dans toute l'application

### 4. **Évolutivité**
- Architecture modulaire permettant l'ajout de fonctionnalités
- Abstraction des services pour faciliter les changements
- Gestion d'état scalable avec Recoil

Cette architecture permet à BabySitter Timer d'être à la fois simple d'utilisation et robuste techniquement, tout en restant facilement extensible pour de nouvelles fonctionnalités métier.

---

## 🔗 Liens connexes

- [Gestion d'état avec Recoil](./gestion-etat.md) - Approfondissement des patterns Recoil
- [Choix technologiques](./choix-technologiques.md) - Justifications des technologies
- [Sécurité et authentification](./securite-auth.md) - Détails de l'approche sécuritaire

---

*Cette explication illustre l'approche Diataxis : contextualisation de l'architecture, explication des choix, et vision d'ensemble plutôt que détails techniques.*