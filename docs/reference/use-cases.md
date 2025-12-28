# Use Cases Métier

*Référence complète des cas d'usage fonctionnels de BabySitter Timer*

Cette référence documente exhaustivement tous les cas d'usage métier de l'application, avec leurs flux, conditions et contraintes techniques.

## 📋 Catalogue des Use Cases

### UC001 - Gestion des sessions

#### UC001.1 - Créer une nouvelle session de babysitting

**Acteur principal** : Parent utilisateur  
**Objectif** : Enregistrer une nouvelle session avec heures d'arrivée et départ  
**Prérequis** : Utilisateur authentifié  

**Flux principal** :
1. L'utilisateur clique sur "Ajouter une session" depuis la liste
2. Le système affiche le formulaire de saisie vide
3. L'utilisateur saisit la date et heure d'arrivée
4. L'utilisateur saisit la date et heure de départ
5. Le système calcule automatiquement la durée
6. L'utilisateur clique sur "Enregistrer"
7. Le système valide les données
8. Le système sauvegarde en Firebase
9. Le système met à jour la liste locale
10. Le système affiche un message de succès
11. Le système retourne à la vue précédente

**Flux alternatifs** :

*A1 - Données invalides*
- 7a. La date de départ est antérieure à l'arrivée
- 7b. Le système affiche un message d'erreur
- 7c. L'utilisateur corrige les données
- 7d. Reprise au point 6

*A2 - Durée nulle*
- 7a. La durée calculée est de 0
- 7b. Le système bloque la sauvegarde  
- 7c. Le système affiche "La durée doit être supérieure à 0"
- 7d. Reprise au point 3

*A3 - Échec sauvegarde*
- 8a. Erreur de connexion ou Firebase
- 8b. Le système affiche "Erreur lors de l'ajout de la session"
- 8c. Les données restent dans le formulaire
- 8d. L'utilisateur peut réessayer

**Fonctions techniques impliquées** :
```typescript
// Validation
calculateDurationBetweenTwoDates(arrival: Date, departure: Date): Duration

// Sauvegarde  
addBabySittingToFireBase(babySitting: IBabySitting): Promise<void>

// État
setBabySittings(sessions: IBabySitting[]): void
```

**Contraintes** :
- Durée minimale : 1 minute
- Date maximale : date courante + 1 an
- Validation temps réel des saisies

---

#### UC001.2 - Modifier une session existante

**Acteur principal** : Parent utilisateur  
**Objectif** : Corriger les heures d'une session déjà enregistrée  
**Prérequis** : Session existante, utilisateur authentifié  

**Flux principal** :
1. L'utilisateur clique sur une session dans la liste
2. Le système charge les données dans le formulaire
3. L'utilisateur modifie les données souhaitées
4. Le système recalcule la durée en temps réel
5. L'utilisateur clique sur "Mettre à jour"
6. Le système applique la mise à jour optimiste
7. Le système sauvegarde en Firebase
8. Le système confirme la mise à jour
9. Le système retourne à la vue précédente

**Flux alternatifs** :

*A1 - Échec mise à jour*
- 7a. Erreur Firebase lors de la sauvegarde
- 7b. Le système effectue un rollback local
- 7c. Le système affiche "Erreur lors de la mise à jour"
- 7d. Les données originales sont restaurées

**Fonctions techniques impliquées** :
```typescript
// Chargement données
const babysitting = babySittings.find(b => b.id === idBabysitting)

// Mise à jour optimiste
babySitingsUpdated[position] = updatedBabySitting;
setBabySittings(babySitingsUpdated);

// Sauvegarde
updateBabySittingToFireBase(babySitting: IBabySitting): Promise<void>
```

**Particularités** :
- **Update optimiste** : L'interface se met à jour immédiatement
- **Rollback automatique** : En cas d'erreur, retour à l'état précédent
- Calcul temps réel de la durée pendant la saisie

---

#### UC001.3 - Supprimer une session

**Acteur principal** : Parent utilisateur  
**Objectif** : Retirer définitivement une session erronée  
**Prérequis** : Session existante en mode édition  

**Flux principal** :
1. L'utilisateur est en mode édition d'une session
2. L'utilisateur clique sur "Supprimer"
3. Le système affiche une confirmation avec détails de la session
4. L'utilisateur confirme la suppression
5. Le système bloque l'interface (loading)
6. Le système supprime de Firebase
7. Le système met à jour la liste locale
8. Le système affiche "Session supprimée avec succès"
9. Le système retourne à la vue principale

**Flux alternatifs** :

*A1 - Annulation*
- 4a. L'utilisateur clique "Annuler"
- 4b. Le système ferme la confirmation
- 4c. Aucune action effectuée

*A2 - Échec suppression*
- 6a. Erreur Firebase
- 6b. Le système affiche "Erreur lors de la suppression"
- 6c. La session reste présente
- 6d. L'utilisateur reste en mode édition

**Fonctions techniques impliquées** :
```typescript
// Suppression Firebase
deleteBabySittingToFireBase(idBabySitting: string): Promise<void>

// Mise à jour locale
setBabySittings(sessions.filter(s => s.id !== idToDelete))
```

**Contraintes** :
- Suppression définitive (pas de corbeille)
- Confirmation obligatoire avec détails
- Blocage interface pendant l'opération

---

### UC002 - Filtrage et consultation

#### UC002.1 - Filtrer par période

**Acteur principal** : Parent utilisateur  
**Objectif** : Consulter les sessions d'une période spécifique  
**Prérequis** : Utilisateur authentifié  

**Flux principal** :
1. L'utilisateur accède à la vue principale
2. Le système affiche les filtres (année courante, mois courant)
3. L'utilisateur sélectionne une année dans le dropdown
4. Le système met à jour la liste des sessions filtrées
5. L'utilisateur clique sur un mois
6. Le système centre le mois sélectionné si nécessaire
7. Le système met à jour sessions et statistiques
8. Le système persiste le filtre pendant la session

**Fonctions techniques impliquées** :
```typescript
// Sélecteur de filtrage
const filteredBabySittingState = selector({
  get: ({get}) => {
    const sessions = get(babysittingState);
    const filter = get(babysittingFilterState);
    
    return sessions
      .filter(s => s.arrivalDate.getFullYear() === filter.year)
      .filter(s => s.arrivalDate.getMonth() + 1 === filter.month)
      .sort((a, b) => b.arrivalDate - a.arrivalDate);
  }
});

// Mise à jour filtre
setFilter({ year: selectedYear, month: selectedMonth });
```

**Automatismes** :
- Navigation cross-year : décembre → janvier change l'année
- Scroll automatique vers le mois sélectionné
- Mise à jour temps réel des statistiques
- Analytics tracking des changements de filtre

---

#### UC002.2 - Consulter les statistiques

**Acteur principal** : Parent utilisateur  
**Objectif** : Visualiser les métriques de la période filtrée  
**Prérequis** : Sessions existantes pour la période  

**Indicateurs calculés** :

1. **Nombre de gardes**
   ```typescript
   totalBabySittings = filteredSessions.length
   ```

2. **Durée totale**
   ```typescript
   totalDuration = sumDurations(sessions.map(s => s.duration))
   totalHours = formatDurationsInHours(totalDuration)
   ```

3. **Durée moyenne**
   ```typescript
   averageHours = totalHours / totalBabySittings
   ```

4. **Montant à déclarer**
   ```typescript
   pricePerHour = getPriceFromPriceIntervalsAndDate(priceIntervals, periodDate)
   totalAmount = roundTwoDecimals(totalHours * pricePerHour)
   ```

**Mise à jour** : Automatique via les sélecteurs Recoil dès changement des données source

---

### UC003 - Validation et cohérence

#### UC003.1 - Validation temps réel des saisies

**Objectif** : Prévenir les erreurs de saisie avant la sauvegarde

**Règles de validation** :

1. **Date d'arrivée vs départ**
   ```typescript
   if (departureDate < arrivalDate) {
     setDateError("La date/heure de départ ne peut pas être antérieure à l'arrivée");
   }
   ```

2. **Ajustement automatique même jour**
   ```typescript
   if (newDepartureTime < arrivalTime && isSameDay) {
     // Ajuste l'heure de départ à celle d'arrivée
     setDepartureDate(adjustToArrivalTime(departureDate, arrivalDate));
   }
   ```

3. **Durée positive**
   ```typescript
   const isDurationPositive = duration.hours > 0 || duration.minutes > 0;
   ```

#### UC003.2 - Synchronisation données locales/Firebase

**Pattern de synchronisation** :

1. **Chargement initial**
   ```typescript
   useEffect(() => {
     loadBabySittingsFromFirebase().then(sessions => {
       setBabySittings(sessions);
     });
   }, []);
   ```

2. **Sauvegarde optimiste**
   ```typescript
   // 1. Mise à jour UI immédiate
   setBabySittings([...sessions, newSession]);
   
   // 2. Sauvegarde Firebase asynchrone
   await savToFirebase(newSession);
   ```

3. **Gestion des conflits**
   ```typescript
   try {
     await saveToFirebase(session);
   } catch (error) {
     // Rollback en cas d'échec
     setBabySittings(originalSessions);
     showError("Erreur de synchronisation");
   }
   ```

---

## 🔄 Matrices de traçabilité

### Use Cases → Composants

| Use Case | Composant Principal | Composants Liés |
|----------|-------------------|-----------------|
| UC001.1 Créer | `Babysitting.tsx` | `BabySittingService` |
| UC001.2 Modifier | `Babysitting.tsx` | `BabySittingService` |
| UC001.3 Supprimer | `Babysitting.tsx` | `BabySittingService` |
| UC002.1 Filtrer | `BabySittingFilters.tsx` | `recoil_states.tsx` |
| UC002.2 Statistiques | `BabySittingStats.tsx` | `recoil_states.tsx` |

### Use Cases → Services

| Use Case | Service Firebase | Utilitaires |
|----------|-----------------|-------------|
| UC001.1 | `addBabySittingToFireBase` | `calculateDurationBetweenTwoDates` |
| UC001.2 | `updateBabySittingToFireBase` | `calculateDurationBetweenTwoDates` |
| UC001.3 | `deleteBabySittingToFireBase` | - |
| UC002.2 | - | `sumDurations`, `formatDurationsInHours` |

### États Recoil → Use Cases

| État Recoil | Use Cases Impliqués |
|-------------|-------------------|
| `babysittingState` | UC001.1, UC001.2, UC001.3 |
| `babysittingFilterState` | UC002.1 |
| `filteredBabySittingState` | UC002.1, UC002.2 |
| `babysittingStatsState` | UC002.2 |

## 📊 Métriques et contraintes

### Performance attendue

- **Temps de réponse UI** : < 100ms pour les interactions locales
- **Temps de sauvegarde** : < 2s pour Firebase
- **Taille maximale** : 1000 sessions par utilisateur
- **Calculs statistiques** : < 50ms pour 100 sessions

### Contraintes business

- **Durée minimale session** : 1 minute
- **Durée maximale session** : 24 heures
- **Antériorité maximale** : 2 ans
- **Futur maximum** : 1 an

### Règles de calcul

```typescript
// Arrondi minutes : toujours à la minute supérieure
function roundToNextMinute(minutes: number): number {
  return Math.ceil(minutes);
}

// Arrondi montant : au centime supérieur  
function roundTwoDecimals(amount: number): number {
  return Math.ceil(amount * 100) / 100;
}
```

---

## 🔗 Liens connexes

- [Architecture de l'application](../explications/architecture.md) - Vue d'ensemble des patterns
- [Interfaces TypeScript](./interfaces.md) - Structures de données
- [Services](./services.md) - Implémentation technique des opérations

---

*Cette référence respecte les principes Diataxis : information factuelle, organisation claire, et consultabilité technique.*