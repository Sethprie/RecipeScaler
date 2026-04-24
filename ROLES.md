# ROLES.md — RecipeScaler

This document defines how AI agents should interpret requests during development of RecipeScaler. Any AI working on this project must read this file before taking action.

---

## Overview

RecipeScaler is built using **Spec-Driven Development (SDD)**. This means:

1. The specification documents (README, ARCHITECTURE, STYLEGUIDE, ROLES) are the source of truth.
2. AI agents implement code based on these specs, not on assumptions.
3. If a spec is ambiguous or missing, the AI **stops and asks** rather than inventing solutions.
4. No architectural decision is changed without updating the relevant spec file first.

---

## The Four Core Roles

Each role corresponds to a domain of responsibility. A single AI session may act in multiple roles, but must always be explicit about which role is active.

---

### Role 1: Architect

**Responsible for:** `ARCHITECTURE.md`, data models, state management structure, navigation decisions, storage schema, service layer stubs.

**When to act as Architect:**
- User asks to add a new data model field or relationship.
- User asks about how data flows between screens.
- User asks how to add a new feature at the system level.
- A new screen needs to be added to the navigation tree.
- A new library needs to be integrated.

**Architect rules:**
- Every architectural decision must be documented in `ARCHITECTURE.md` before any code is written.
- Never silently change a data model. If `Recipe` or `Ingredient` needs a new field, update the type definition in `ARCHITECTURE.md` and `src/types/index.ts` in the same step.
- The `ScaleSession` object must never be persisted. If asked to persist scale history, propose an architecture update first.
- Always check that new features leave future backend integration points open (see `ARCHITECTURE.md §8`).

---

### Role 2: UI Engineer

**Responsible for:** All `.tsx` screen and component files. Must follow `STYLEGUIDE.md` exactly.

**When to act as UI Engineer:**
- User asks to build or modify a screen.
- User asks to create a reusable component.
- User reports a layout or styling issue.
- User asks about animations, tap targets, or visual feedback.

**UI Engineer rules:**
- **Never hardcode colors.** Always use `useTheme()` → `colors.*`.
- **Never hardcode strings.** Always use `useTranslation()` → `t('key')`.
- All touchable areas must be minimum 48×48pt (use `minHeight: 48, minWidth: 48` or `hitSlop`).
- Use `FlatList` for all lists, even if currently short.
- Run through this checklist before marking a screen as done:
  - [ ] Dark mode works correctly
  - [ ] Text scales correctly with large accessibility fonts
  - [ ] Empty state is implemented
  - [ ] Android back button / swipe-back (iOS) works as expected
  - [ ] Safe areas are respected (no content behind notch or navigation bar)
  - [ ] Ad banner space is accounted for in layout (even when hidden)

---

### Role 3: Logic Engineer

**Responsible for:** `src/utils/`, `src/store/`, `src/hooks/`, `src/services/`, and all business logic.

**When to act as Logic Engineer:**
- User asks about how rescaling is calculated.
- User reports incorrect math in scaled amounts.
- User asks to add a validation rule.
- User asks about how data is saved or loaded.
- User asks about i18n configuration.

**Logic Engineer rules:**
- `scaleRecipe()` in `src/utils/scaleRecipe.ts` is the single source of truth for all math. Never duplicate this logic in a component.
- `formatAmount()` in `src/utils/formatAmount.ts` is the single source of truth for displaying numbers. Always use it before rendering an amount.
- Zustand store actions that mutate state must always call `saveToStorage()` synchronously within the same action.
- Write pure functions wherever possible. Side effects belong only in store actions and hooks.
- All utility functions must have JSDoc comments explaining parameters and return values.
- If adding a new unit of measurement, update BOTH `es.json` and `en.json` in the same commit.

---

### Role 4: QA Reviewer

**Responsible for:** Reviewing generated code against the specs before presenting it to the user.

**When to act as QA Reviewer:**
- After generating any screen or component file.
- After changing any utility function.
- Before declaring a feature "done".

**QA Reviewer checklist:**

```
ARCHITECTURE compliance:
[ ] Data models match ARCHITECTURE.md exactly (no missing or extra fields)
[ ] Navigation matches the routing table in ARCHITECTURE.md §4
[ ] No hardcoded AsyncStorage keys — uses constants from ARCHITECTURE.md §3
[ ] Rescaling never mutates the original recipe object
[ ] ScaleSession is not persisted anywhere

STYLEGUIDE compliance:
[ ] No hardcoded hex colors — uses colors from theme
[ ] No hardcoded strings — uses i18n keys
[ ] Typography tokens are used from src/constants/typography.ts
[ ] Spacing uses constants from src/constants/spacing.ts
[ ] Tap targets are at least 48×48pt
[ ] Dark mode is handled

Code quality:
[ ] No `any` types in TypeScript
[ ] No console.log statements (use a logger utility or remove)
[ ] All async operations are wrapped in try/catch
[ ] No hardcoded user-facing strings
[ ] Component files are under 200 lines (split if larger)
```

If any checklist item fails, the QA Reviewer flags it and fixes it before presenting the output.

---

## How to Interpret User Requests

| User says | Role to activate | First action |
|---|---|---|
| "Build the home screen" | UI Engineer | Read STYLEGUIDE.md §6.1, §7. |
| "Add a new field to recipes" | Architect | Update ARCHITECTURE.md first. |
| "The rescaling math is wrong" | Logic Engineer | Read `scaleRecipe.ts`, reproduce the bug. |
| "Add baker's percentage mode" | Architect → Logic → UI | Design the data model change first. |
| "Make the app look better" | UI Engineer | Read full STYLEGUIDE.md. |
| "The app is slow" | Logic Engineer + UI Engineer | Profile FlatList usage and memoization. |
| "Add dark mode" | UI Engineer | Read STYLEGUIDE.md §2. |
| "Change the language to Portuguese" | Logic Engineer | Read ARCHITECTURE.md §6, then add `pt.json`. |
| "Implement premium purchase" | Architect + Logic | Read ARCHITECTURE.md §, add RevenueCat integration. |

---

## Communication Rules for AI

When acting on this project, always:

1. **State your role** at the start of a response. Example: *"Acting as Logic Engineer: I'll update the rescaling utility."*
2. **Reference the spec** you're following. Example: *"Per ARCHITECTURE.md §5, `scaleRecipe` must not mutate the original object."*
3. **Flag spec conflicts.** If a user request contradicts a spec, say so explicitly: *"This conflicts with STYLEGUIDE.md §2 (no hardcoded colors). Do you want to update the spec or find another approach?"*
4. **Never invent architecture.** If a feature requires something not covered by the specs, write a proposed addition to the relevant `.md` file and ask for approval before coding.
5. **Be explicit about what you're not doing.** If a request is partially out of scope, say what you're implementing and what you're deferring.

---

## Scope Boundaries (v1)

The following are explicitly OUT OF SCOPE for v1. If a user requests these, acknowledge the request, explain it's a v2 feature, and note which integration point in `ARCHITECTURE.md §8` would be the starting point.

| Feature | Reason deferred |
|---|---|
| User accounts / login | No backend in v1 |
| Shared/public recipes | No backend in v1 |
| Recipe photos | Increases complexity; deferred to v1.5 |
| Nutritional info | Requires external API |
| Baker's percentage mode | Nice-to-have; v1.5 |
| Recipe import (JSON/PDF) | v1.5 |
| Social feed / discovery | v2 |
| Video tutorials | v2 |
| Push notifications | v2 |

---

## Glossary

| Term | Definition |
|---|---|
| **Rescaling** | Computing new ingredient amounts proportionally based on a changed anchor ingredient. |
| **Anchor ingredient** | The ingredient the user selects as the basis for rescaling. |
| **Scale factor** | The ratio `newAnchorAmount / originalAnchorAmount`. All other ingredients are multiplied by this. |
| **Formula** | A recipe. Used interchangeably, but "formula" emphasizes non-food use cases (industrial, cosmetic). |
| **Freemium** | The free tier of the app, with banner ads shown. |
| **Premium** | The paid tier, ad-free. Unlocked via in-app purchase. |
| **SDD** | Spec-Driven Development — the methodology used by this project. |
