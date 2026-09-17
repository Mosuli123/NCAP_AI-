# Khetha NCAP — Your Career Guidance Companion, On the Go

A mobile-first, offline-capable **React Native (Expo + TypeScript)** app that reimagines the
Department of Higher Education and Training's **National Career Advice Portal
([NCAP](https://ncap.careerhelp.org.za/))** as a native mobile experience for South Africa's
mobile-first youth.

> Built for the DHET **Khetha NCAP** challenge. It carries NCAP's proven content and tools —
> Subject Chooser, Career Choice & Job Fit questionnaires, and the Careers / What to Study /
> Where to Study directories — onto mobile, and adds personalisation, offline access,
> multilingual support and accessibility that a desktop website cannot offer.

---

## ✨ What's inside

| NCAP area | In the app |
| --- | --- |
| **Subject Chooser** | Career-first, interactive picker (`Assess` tab). Choose a career and instantly see the school subjects that unlock it, then save them to your journey. |
| **Career Choice & Job Fit** | Two app-native, one-question-at-a-time questionnaires using a RIASEC (Holland Code) interest model. Results surface your top interests and matching careers. |
| **Careers directory** | Searchable, filterable occupations with salary bands, demand outlook, subjects and linked qualifications. |
| **What to Study** | Qualifications directory with NQF level, type and provider links. |
| **Where to Study** | Learning-provider directory (universities, universities of technology, TVET colleges) with province filtering and one-tap call / email / website. |
| **Careers Advice & Contact** | `Get Help` tab: Khetha helpline, provincial practitioner desks, walk-in centres and career events, with tap-to-call / WhatsApp / email. |

### Beyond the website

- **Personalised Career Journey** — an on-device profile tracks questionnaire results,
  favourites, chosen subjects and milestone progress, guiding the user from exploration to
  study and employment options.
- **Offline-first** — all core content is bundled and cached, so the app works with no or
  low bandwidth. An offline banner keeps users informed.
- **Multilingual** — English, isiZulu, Afrikaans and isiXhosa, selectable at onboarding and
  in settings; the device language is auto-detected.
- **Accessible** — semantic accessibility roles/labels, large touch targets, high-contrast
  palette and readable type for users with disabilities or low digital literacy.
- **Engagement** — local reminders/notifications and saved favourites keep users returning.
- **Privacy & consent (POPIA-aligned)** — explicit consent capture, on-device storage and a
  one-tap "delete my data" control.
- **Secure identity & API interoperability (scaffold)** — a secure-store auth seam
  (`src/services/auth.ts`) and an API abstraction (`src/services/api.ts`) are ready to plug
  into NCAP / DHET systems without touching the UI.

---

## 🏗 Tech stack

- **Expo SDK 51** + **Expo Router** (file-based navigation)
- **React Native 0.74** / **React 18** / **TypeScript** (strict)
- **i18next / react-i18next** + **expo-localization** for multilingual support
- **AsyncStorage** (profile & cache) and **expo-secure-store** (auth tokens)
- **expo-notifications** for reminders
- **@react-native-community/netinfo** for offline detection

---

## 🚀 Getting started

> **Note:** dependencies are **not** vendored. Install them on a machine with npm registry
> access. This repository contains all application source and configuration.

```bash
# 1. Install dependencies
npm install

# 2. Start the Expo dev server
npm start

# 3. Run on a device/emulator
npm run android   # Android
npm run ios       # iOS (macOS + Xcode)
npm run web       # Web preview
```

Scan the QR code with **Expo Go** on a physical phone for the fastest preview.

### Quality checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm test            # jest (scoring engine unit tests)
```

---

## 📁 Project structure

```
khetha-ncap/
├── app/                        # Expo Router routes (screens)
│   ├── _layout.tsx             # Root: providers, offline banner, stack
│   ├── index.tsx               # Onboarding vs tabs redirect
│   ├── onboarding.tsx          # Language + basics + POPIA consent
│   ├── settings.tsx            # Language, notifications, delete data
│   ├── (tabs)/                 # Bottom tabs (Home/Explore/Assess/Journey/Help)
│   ├── quiz/[type].tsx         # Job Fit & Career Choice questionnaires
│   ├── career/[id].tsx         # Career detail
│   ├── qualification/[id].tsx  # Qualification detail
│   └── provider/[id].tsx       # Provider detail
├── src/
│   ├── components/             # Reusable, accessible UI primitives
│   ├── data/                   # Bundled seed datasets (offline-first)
│   ├── i18n/                   # i18next config + en/zu/af/xh locales
│   ├── services/               # storage, api, scoring, notifications, auth
│   ├── store/                  # ProfileContext (personalised journey)
│   ├── theme/                  # Design tokens
│   └── types/                  # Domain models
├── assets/                     # App icon / splash
├── app.json                    # Expo config
└── ...                         # tsconfig, babel, metro, eslint, jest
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for a deeper walk-through, and
[`docs/NCAP_ALIGNMENT.md`](docs/NCAP_ALIGNMENT.md) for a requirement-by-requirement mapping.

---

## 🔌 Connecting to live NCAP data

The app is offline-first but integration-ready. `src/services/api.ts` tries a live NCAP
endpoint first (configurable via `expo.extra.ncapApiBaseUrl` in `app.json`) and transparently
falls back to cached, then bundled, data. Wire real authenticated requests through
`fetchRemote` and the auth token from `src/services/auth.ts` — no screen changes required.

## 🔒 Privacy

Data is stored **on the device**. Consent is captured explicitly during onboarding and can be
changed in Settings, where users can also permanently delete all their data (POPIA right to
erasure). Auth tokens (when a backend is connected) are held in the OS secure enclave via
`expo-secure-store`.

## 📝 Data note

Seed content (careers, qualifications, providers, contacts) is representative sample data for
demonstration, aligned to NCAP's structure and South Africa's NQF/OFO frameworks. In
production it is replaced by live NCAP API data through the same interface.

## License

Prepared for the DHET Khetha NCAP challenge.
