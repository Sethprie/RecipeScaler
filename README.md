# RecipeScaler 🧑‍🍳

> Scale any recipe or formula instantly — just pick an ingredient and set the amount you have.

RecipeScaler is a mobile app built with **Expo (React Native)** for Android and iOS. It solves a real kitchen problem: when you need to prepare a batch of something but the original recipe is written for a different quantity, you have to recalculate every single ingredient by hand. RecipeScaler does that for you in seconds.

The app is designed for professional cooks, home bakers, pizza makers, pastry chefs, and anyone who works with formulas — whether in the kitchen or not (bakers' percentages, industrial formulas, cosmetic recipes, etc.).

---

## The Problem

Imagine you have a pizza dough formula written for 5 kg of flour. Your chef tells you to make a batch with 4 kg today, then 8 kg tomorrow, then 1 kg for a test. Every time, you have to manually recalculate each ingredient. This is slow, error-prone, and annoying.

RecipeScaler fixes this: you keep your original formula intact as a reference, choose an ingredient (e.g., flour), type the amount you have, and the app instantly shows you every other ingredient, rescaled proportionally.

---

## Core Features

- **Recipe/Formula storage** — Create, edit, and delete recipes with a list of ingredients (name + amount + unit) and an optional preparation text.
- **Rescaling** — Select any ingredient as the "anchor", type a new amount, and see all others recalculated in real time. The original recipe is never modified.
- **Recipe book** — Browse all saved recipes, search by name or tag.
- **Tags/Categories** — Organize recipes by type (bread, pizza, pastry, sauces, custom, etc.).
- **Multi-language** — Full UI in Spanish and English; user can switch in settings.
- **Freemium model** — Free tier with banner ads; premium (paid) tier removes all ads.
- **Offline-first** — All data stored locally using AsyncStorage. No account required.
- **Future-ready** — Architecture is designed to plug in a backend (user accounts, social features, shared recipes, video tutorials) without rewriting the app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 51+ (managed workflow) |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| State management | Zustand |
| Local storage | AsyncStorage |
| Ads | Google Mobile Ads (expo-ads-admob or react-native-google-mobile-ads) |
| i18n | i18next + react-i18next |
| UI components | Custom (see STYLEGUIDE.md) |
| Icons | Expo Vector Icons (MaterialCommunityIcons) |
| Forms | React Hook Form |

---

## Project Structure

```
RecipeScaler/
├── app/                        # Expo Router screens
│   ├── (tabs)/
│   │   ├── index.tsx           # Home / recipe list
│   │   ├── create.tsx          # Create new recipe
│   │   └── settings.tsx        # Language, premium, about
│   ├── recipe/
│   │   ├── [id].tsx            # View recipe detail
│   │   └── [id]/scale.tsx      # Rescaling screen
│   └── _layout.tsx             # Root layout
├── src/
│   ├── components/             # Reusable UI components
│   ├── store/                  # Zustand stores
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Pure utility functions (math, formatting)
│   ├── i18n/                   # Translation files (es.json, en.json)
│   ├── types/                  # TypeScript type definitions
│   └── constants/              # Colors, spacing, config
├── assets/                     # Images, fonts, icons
├── README.md
├── ROLES.md
├── STYLEGUIDE.md
├── ARCHITECTURE.md
└── package.json
```

---

## Getting Started (for AI developers)

Before writing any code, read the full SDD documentation in this order:

1. **README.md** (this file) — What the app is and why it exists.
2. **ARCHITECTURE.md** — Data models, state management, navigation, storage layer, and future backend integration points.
3. **STYLEGUIDE.md** — Visual design system: colors, typography, spacing, component patterns.
4. **ROLES.md** — How to interpret AI development requests and what each role is responsible for.

Then initialize the project:

```bash
npx create-expo-app RecipeScaler --template blank-typescript
cd RecipeScaler
npx expo install zustand @react-native-async-storage/async-storage i18next react-i18next expo-localization react-hook-form
```

---

## Freemium Model

| Feature | Free | Premium |
|---|---|---|
| Recipes stored | Unlimited | Unlimited |
| Rescaling | Unlimited | Unlimited |
| Banner ads | ✅ Shown | ❌ Hidden |
| Interstitial ads | ❌ | ❌ |
| Price | Free | One-time purchase (TBD) |

Premium is unlocked via an in-app purchase (expo-in-app-purchases or react-native-purchases/RevenueCat). The `isPremium` flag is stored locally and validated on app start.

---

## Future Roadmap (v2+)

These features are NOT in scope for v1, but the architecture must leave clean integration points for them:

- User accounts (JWT auth)
- Cloud sync of recipes
- Public recipe feed / social discovery
- Comments and ratings
- Video tutorial embedding (YouTube/native)
- Baker's percentage mode
- Nutritional info per serving

---

## Guiding Principles

- **Speed over complexity** — The rescaling screen must feel instant. No loading spinners for local operations.
- **Kitchen-friendly UI** — Large tap targets, high contrast, legible at a glance. Cooks have wet/greasy hands.
- **Non-destructive** — Rescaling never modifies the original recipe. Ever.
- **Simple data model** — Keep it easy enough that the codebase can be handed off to a junior developer.
