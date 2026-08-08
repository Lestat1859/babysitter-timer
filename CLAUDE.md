# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

BabySitter Timer — a React SPA for tracking babysitting session times and computing payments, backed by Firebase (Auth, Realtime Database, Firestore, Analytics, Hosting).

## Commands

```bash
npm start           # dev server at http://localhost:3000 (react-scripts)
npm test            # jest in interactive watch mode (react-scripts test)
npm run build       # production build to /build
```

Run a single test file: `npm test -- src/utils/dates.test.ts` (or any substring match, e.g. `npm test -- dates`).

There is no lint script configured beyond the CRA-bundled ESLint (`eslintConfig` in `package.json` extends `react-app`), which runs automatically during `npm start`/`npm run build`.

Firebase config comes from `REACT_APP_FIREBASE_*` env vars (see `src/utils/firebase.ts`) and `REACT_APP_ACCESS_WHITELIST` (legacy whitelist, see Auth section below) — set these in `.env.local` for local dev. Deploys go through `firebase deploy` using `firebase.json`/`.firebaserc` (project `babysitting-timer`), which configures Realtime Database rules (`database.rules.json`), Firestore rules (`firestore.rules`), and Hosting (serves `/build`).

## Architecture

**Data flow**: UI components (React + MUI) → Recoil atoms/selectors → service modules (`src/services/*`) → Firebase.

### State (`src/recoil/recoil_states.tsx`)

All app state lives in this one file:
- `babysittingState` (atom): raw list of `IBabySitting` sessions, loaded once from Firebase after auth resolves (see `AppRouter.tsx`).
- `babysittingFilterState` (atom): current year/month filter.
- `priceTimeIntervalState` (atom): admin-configured hourly rate tiers (`IPriceTimeInterval`).
- `authState` (atom): the current `IAuth` (uid, email, role, isAdmin).
- `filteredBabySittingState` (selector): sessions filtered by year/month, sorted newest-first.
- `babysittingStatsState` (selector): derives totals/earnings from `filteredBabySittingState`, grouping sessions by `(userId, applicable price)` before summing durations and multiplying by rate — this grouping preserves "sum durations then round" semantics per price tier rather than rounding per-session.

Never compute stats/filtering in components — add a selector instead so every consumer stays in sync.

### Auth & authorization (dual system, mid-migration)

Two authorization mechanisms coexist; Firestore is the current source of truth and the whitelist is a fallback for accounts not yet migrated:

1. **Firestore `authorizedUsers` collection** (current): each doc (keyed by Firebase UID) is an `IAuthorizedUser` with `role: 'admin' | 'user'` and `isActive`. Managed via `src/services/AuthorizedUsersService.ts`, which keeps a 5-minute in-memory cache — call `invalidateCache()` (or let the mutating functions do it automatically) after writes. If a user document exists but `isActive` is false, the user sees the "pending approval" screen rather than being denied outright.
2. **Env whitelist** (`REACT_APP_ACCESS_WHITELIST`, semicolon-separated emails) via `isUserInAuthWhiteList` in `src/utils/auth.ts` — only consulted when no Firestore doc exists for the UID, marked `@deprecated`. Do not extend this path; add users to Firestore instead.

The full resolution flow lives in `AppRouter.tsx`'s `AuthProvider`: on `onAuthStateChanged`, it checks Firestore first, falls back to the whitelist (with custom-claims role parsing), and otherwise shows `AccessDenied`. `AuthProvider` also renders `PendingApproval` for deactivated-but-registered users, and triggers the one-time Firebase session fetch into `babysittingState`.

Role gating for UI/business logic: `IUserRole.ts`'s `getPermissionsForRole()` is the single source of permission booleans (`canViewAdminPanel`, `canEditAllUsersSessions`, etc.) — prefer it over ad hoc `isAdmin` checks when adding new gated behavior. `roleUtils.ts` builds on top of it (`userHasPermission`, `canAccessResource`, `filterByPermissions`).

### Sessions storage (`src/services/BabySittingService.ts`)

Realtime Database, not Firestore, holds babysitting sessions — two paths coexist for legacy reasons:
- `/sessions/{id}` — current structure, includes `userId`/`userEmail`, used whenever an `IAuth` is available.
- `/Iloukia/{id}` — legacy single-user structure (no owner fields), kept for backward compatibility when no `userAuth` is passed.

`fetchBabySittingsFromFireBase` branches on `userAuth.isAdmin`: admins read all of `/sessions`, non-admins query by `orderByChild('userId')`. There's also a parallel `localStorage`-backed CRUD set (`*ToLocalStorage`) that predates Firebase integration — check which path a component actually uses before assuming Firebase is the source of truth.

`IBabySitting.userId`/`userEmail` are optional specifically to support old records that predate the multi-user migration; missing `userEmail` falls back to `'Iloukia'` in the UI.

### Routing (`src/component/Router/AppRouter.tsx`)

Two separate `createBrowserRouter` instances (`privateRouter` / `publicRouter`), selected based on whether `AuthContext` has a resolved user — there's no route-level guard component, the whole router swaps. Private routes: `/` (View: list + stats), `/admin` (AdminPanel), `/babysitting/add`, `/babysitting/edit/:idBabysitting`.

### Directory layout

- `src/component/` — feature folders (`Admin`, `Auth`, `Babysitting`, `Router`, `View`, `Buttons`, `Error`, `common`).
- `src/services/` — Firebase/Firestore CRUD (`BabySittingService`, `AuthorizedUsersService`).
- `src/utils/` — pure functions: `dates.ts` (duration math via `date-fns`), `price.ts` (rate lookup/rounding), `auth.ts`, `roleUtils.ts`, `firebase.ts` (SDK init).
- `src/interfaces/` — all `I*` type definitions; `IUserRole.ts` also hosts the permissions logic, not just types.
- `src/recoil/` — single file with all atoms/selectors.
- `docs/` — Diataxis-structured docs (tutoriels/guides-pratiques/reference/explications). Note `docs/explications/architecture.md` describes the whitelist-only auth model and predates the Firestore `authorizedUsers` migration — treat the source in `AppRouter.tsx`/`AuthorizedUsersService.ts` as authoritative over that doc where they disagree.

## Testing notes

Tests exist for `src/utils/dates.ts` and `src/utils/auth.ts` only (`*.test.ts` next to the module, CRA/Jest via `react-scripts test`). `auth.test.ts` asserts against `REACT_APP_ACCESS_WHITELIST` from the environment — it will fail if that env var isn't set to include the mocked test email.
