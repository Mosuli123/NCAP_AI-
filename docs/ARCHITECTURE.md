# Architecture

## Overview

Khetha NCAP is a single-codebase Expo (React Native) app using **file-based routing**
(Expo Router). It is deliberately **offline-first**: every feature works with no network,
and connectivity is treated as an enhancement rather than a requirement — critical for rural
and low-bandwidth users.

```
┌───────────────────────────────────────────────────────────┐
│                         UI (app/)                           │
│  Tabs: Home · Explore · Assess · Journey · Help             │
│  Stack: onboarding · settings · quiz · career/qual/provider │
└───────────────┬───────────────────────────┬────────────────┘
                │                            │
        ProfileContext (store)        i18n (react-i18next)
        - profile, results,           - en / zu / af / xh
          favourites, journey
                │
     ┌──────────┴───────────┬─────────────┬──────────────┐
     │                      │             │              │
 storage.ts             api.ts       scoring.ts     notifications.ts
 (AsyncStorage)     (offline-first   (RIASEC match)  (local reminders)
                     + NCAP seam)
                          │
                     data/ (bundled seed: careers, qualifications,
                            providers, subjects, questionnaires, advice)
```

## Layers

### 1. Presentation (`app/`, `src/components/`)
- **Expo Router** maps files to routes. `app/(tabs)/` is the bottom-tab group; dynamic
  routes (`career/[id]`, `quiz/[type]`) render detail and questionnaire screens.
- `src/components/ui.tsx` holds accessible primitives (`Button`, `Card`, `Chip`, `SearchBar`,
  …). Every interactive element declares `accessibilityRole`/`accessibilityLabel` and has a
  ≥44–52px touch target.
- `OfflineBanner` subscribes to NetInfo and warns when offline.

### 2. State (`src/store/ProfileContext.tsx`)
- A `useReducer`-based context is the single source of truth for the **personalised journey**:
  basics, consent, questionnaire results, favourites (careers/qualifications/providers),
  chosen subjects, and milestone completion.
- Every change is persisted to AsyncStorage; on launch the profile is rehydrated. This is
  what makes the journey "remembered" across sessions and available offline.

### 3. Services (`src/services/`)
- **storage.ts** — typed AsyncStorage wrapper with namespaced keys and `clearAll` for erasure.
- **api.ts** — offline-first data access. `fetchRemote` attempts the NCAP API; on any failure
  it falls back to cache, then to bundled seed data. `primeCache` warms the cache on first run.
- **scoring.ts** — pure RIASEC scoring and career-matching. Unit-tested; no I/O.
- **notifications.ts** — permission handling and scheduling of on-device reminders.
- **auth.ts** — secure-store-backed token storage and an OIDC sign-in seam (optional; the app
  is fully usable anonymously).

### 4. Data (`src/data/`)
- Static, strongly-typed seed datasets aligned to NCAP's IA and SA frameworks (NQF, OFO).
- Referential integrity across datasets is validated (careers ↔ subjects ↔ qualifications ↔
  providers).

## Key design decisions

- **Offline-first over online-first.** Bundling content guarantees usefulness without data,
  directly serving the inclusivity mandate.
- **Local-only personalisation by default.** No account required; POPIA consent is explicit
  and reversible. Cloud sync is an opt-in future step behind the auth seam.
- **RIASEC model** for questionnaires — a well-understood, explainable interest framework that
  maps cleanly to occupations and is easy to present at low literacy levels.
- **Emoji glyph icons** for tabs/tiles avoid shipping an icon font and render consistently
  across Android and iOS, keeping the bundle small.
- **Single data seam.** Screens never call the network directly; swapping seed data for live
  NCAP responses touches only `api.ts`.

## Testing

`src/services/__tests__/scoring.test.ts` covers the scoring engine (tallying, ranking,
edge cases) with `jest-expo`. Because scoring is pure, it is fast and deterministic.

## Extending

- **Live NCAP integration:** set `expo.extra.ncapApiBaseUrl` and implement the request/response
  mapping in `api.ts`; add auth via `auth.ts`.
- **More languages:** add a locale JSON under `src/i18n/locales/` and register it in
  `src/i18n/index.ts`.
- **Richer content:** expand `src/data/*` or replace with API-sourced data — types in
  `src/types` define the contract.
