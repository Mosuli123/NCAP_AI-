# NCAP Challenge — Requirement Alignment

How the app satisfies each mandatory and advantageous requirement of the DHET Khetha NCAP
challenge, with where to find it in the codebase.

## Mandatory requirements

| # | Requirement | Where / How |
| --- | --- | --- |
| 1 | **NCAP Reference Alignment** — carry over core content areas & IA | Bottom tabs and directories mirror NCAP: Subject Chooser, Career Choice & Job Fit, Careers, What to Study, Where to Study, Careers Advice. `app/(tabs)/*`, `src/data/*` |
| 2 | **Subject Chooser** — improved | `app/(tabs)/assess.tsx`. Career-first flow: pick a career → see unlocking subjects → save to journey. Improves on the desktop tool with a guided, reverse-lookup UX. |
| 3 | **Career Choice & Job Fit questionnaires** — simplified, app-native, personalised | `app/quiz/[type].tsx` + `src/services/scoring.ts`. One question at a time, RIASEC scoring, personalised interest profile and matching careers. |
| 4 | **Careers / Qualifications / Providers directories** — search & filter for mobile | `app/(tabs)/explore.tsx` with segmented control, search and per-directory filters (demand, NQF level, province) + detail screens. |
| 5 | **Personalised Career Journey** — remember results & interactions | `src/store/ProfileContext.tsx`. Persisted profile: results, favourites, chosen subjects, milestones; visualised in `app/(tabs)/journey.tsx`. |
| 6 | **Inclusivity** — offline/low-bandwidth, multilingual, accessible, PWD support | Offline-first `src/services/api.ts` + bundled `src/data`; `OfflineBanner`; i18n en/zu/af/xh (`src/i18n`); accessibility roles/labels, large targets, high contrast (`src/components/ui.tsx`, `src/theme`). |
| 7 | **Engagement & Notifications** — push/reminders, favourites | `src/services/notifications.ts` (local reminders scheduled at onboarding & toggleable in settings); `FavouriteButton` + favourites in the journey. |
| 8 | **Careers Advice Directory & Contact Access** — reach a human, events | `app/(tabs)/help.tsx` + `src/data/advice.ts`: Khetha helpline, provincial practitioner desks, walk-in centres, WhatsApp/call/email, and career events. |

## Advantageous functionality

| Requirement | Where / How |
| --- | --- |
| **Secure Digital Identity & Integration** | `src/services/auth.ts` — tokens in `expo-secure-store`, OIDC sign-in seam for DHET/Khetha SSO. `src/services/api.ts` — single API abstraction for NCAP interoperability (attempts live → cache → seed), avoiding duplicate/conflicting data. |
| **Data Security & Privacy** | Explicit POPIA-aligned consent capture at onboarding (`app/onboarding.tsx`), reversible in `app/settings.tsx`; on-device storage; secure enclave for credentials; one-tap "delete my data" (right to erasure). |

## Accessibility notes

- All buttons, cards and toggles expose `accessibilityRole`, `accessibilityLabel` and, where
  relevant, `accessibilityState`/`accessibilityHint`.
- The offline banner uses `accessibilityLiveRegion`/`role="alert"` so screen-reader users are
  notified of connectivity changes.
- Colour palette chosen for WCAG-AA contrast; type sizes are large and scale with OS settings.
- Questionnaires present one item at a time with three plain-language choices, lowering the
  literacy and cognitive load.

## Multilingual coverage

English, isiZulu, Afrikaans and isiXhosa are fully translated across every screen (verified —
all locale files share an identical key set). Device language is auto-detected on first run,
and users can switch language at onboarding or any time in Settings.
