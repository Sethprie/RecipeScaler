# ARCHITECTURE.md — RecipeScaler

This document defines the technical architecture of RecipeScaler. All AI agents and developers must follow these decisions exactly. Do not deviate without updating this document first.

---

## 1. Data Models

All types live in `src/types/index.ts`.

### 1.1 Ingredient

```typescript
export interface Ingredient {
  id: string;          // UUID, generated on creation
  name: string;        // e.g. "Harina / Flour"
  amount: number;      // Base amount in the original recipe
  unit: string;        // e.g. "kg", "g", "ml", "cups", "units", "tbsp"
}
```

### 1.2 Recipe

```typescript
export interface Recipe {
  id: string;                   // UUID
  name: string;                 // Recipe display name
  description: string;          // Optional preparation notes / instructions
  tags: string[];               // e.g. ["pizza", "bread", "pastry"]
  ingredients: Ingredient[];    // Ordered list
  createdAt: string;            // ISO 8601 date string
  updatedAt: string;            // ISO 8601 date string

  // Future backend fields (do NOT use in v1, but keep in type for migration):
  authorId?: string;            // Will be populated when backend is added
  isPublic?: boolean;           // For social feed (v2)
  remoteId?: string;            // Server-side ID (v2)
}
```

### 1.3 ScaleSession (ephemeral, never persisted)

```typescript
export interface ScaleSession {
  recipeId: string;
  anchorIngredientId: string;   // The ingredient the user is anchoring to
  anchorAmount: number;         // The new amount the user wants
  scaleFactor: number;          // Computed: anchorAmount / original anchorIngredient.amount
}
```

The `ScaleSession` is computed in real time and never stored. When the user leaves the rescaling screen, it is discarded.

### 1.4 AppSettings

```typescript
export interface AppSettings {
  language: 'es' | 'en';
  isPremium: boolean;
  theme: 'light' | 'dark' | 'system';
}
```

---

## 2. State Management (Zustand)

All global state lives in `src/store/`. Each store is a separate file.

### 2.1 useRecipeStore

File: `src/store/useRecipeStore.ts`

```typescript
interface RecipeStore {
  recipes: Recipe[];
  
  // Actions
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecipe: (id: string, changes: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  getRecipeById: (id: string) => Recipe | undefined;
  
  // Persistence
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}
```

**Rules:**
- Every mutation (`addRecipe`, `updateRecipe`, `deleteRecipe`) must immediately call `saveToStorage()` after updating state.
- `loadFromStorage()` is called once on app start in the root layout.
- IDs are generated with a simple UUID utility (`src/utils/uuid.ts`).

### 2.2 useSettingsStore

File: `src/store/useSettingsStore.ts`

```typescript
interface SettingsStore {
  settings: AppSettings;
  setLanguage: (lang: 'es' | 'en') => void;
  setPremium: (isPremium: boolean) => void;
  setTheme: (theme: AppSettings['theme']) => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}
```

---

## 3. Local Storage Schema

Uses `@react-native-async-storage/async-storage`.

| Key | Value | Description |
|---|---|---|
| `@recipescaler/recipes` | `JSON.stringify(Recipe[])` | All user recipes |
| `@recipescaler/settings` | `JSON.stringify(AppSettings)` | User preferences |
| `@recipescaler/isPremium` | `'true'` or `'false'` | Premium flag (also inside settings, kept separate for quick access) |

**Migration strategy:** When the schema changes in future versions, the store's `loadFromStorage` must handle graceful fallback (e.g. missing fields default to safe values). Each store should have a `SCHEMA_VERSION` constant and log migrations.

---

## 4. Navigation (Expo Router)

File-based routing. All screen files live in `app/`.

```
app/
├── _layout.tsx              # Root layout: loads stores, sets up i18n, renders tabs
├── (tabs)/
│   ├── _layout.tsx          # Tab bar definition (3 tabs)
│   ├── index.tsx            # Tab 1: Recipe list (home)
│   ├── create.tsx           # Tab 2: Create new recipe
│   └── settings.tsx         # Tab 3: Settings (language, premium, about)
├── recipe/
│   ├── [id].tsx             # Recipe detail view (read-only)
│   └── [id]/
│       └── scale.tsx        # Rescaling screen for recipe [id]
```

### Navigation Rules

- The **tab bar** has 3 tabs: Home (list), Create, Settings.
- Tapping a recipe from the list pushes `recipe/[id]` onto the stack (not a tab).
- The rescaling screen `recipe/[id]/scale` is pushed from the recipe detail screen.
- Back navigation follows the native stack (swipe on iOS, back button on Android).
- **Never use modal navigation** for the rescaling screen — it must feel like a natural forward step.

---

## 5. Rescaling Logic

Pure utility function, lives in `src/utils/scaleRecipe.ts`. No side effects.

```typescript
/**
 * Rescales all ingredients of a recipe proportionally to a new anchor amount.
 * The original recipe object is never mutated.
 *
 * @param recipe - The original, unmodified recipe
 * @param anchorIngredientId - The ingredient the user is "anchoring" to
 * @param newAnchorAmount - The new amount the user wants for that ingredient
 * @returns A new array of ingredients with rescaled amounts (units unchanged)
 */
export function scaleRecipe(
  recipe: Recipe,
  anchorIngredientId: string,
  newAnchorAmount: number
): Ingredient[] {
  const anchor = recipe.ingredients.find(i => i.id === anchorIngredientId);
  if (!anchor || anchor.amount === 0) return recipe.ingredients;

  const factor = newAnchorAmount / anchor.amount;

  return recipe.ingredients.map(ingredient => ({
    ...ingredient,
    amount: parseFloat((ingredient.amount * factor).toFixed(4)),
  }));
}
```

**Rules:**
- The result of `scaleRecipe` is displayed in the UI but never saved back to the recipe.
- Floating point results are rounded to 4 decimal places in the utility, then formatted for display (see `src/utils/formatAmount.ts`).
- `formatAmount(n: number): string` should output clean numbers: no trailing zeros, a maximum of 2 decimal places for display, and commas as thousands separators for large numbers.

---

## 6. i18n (Internationalization)

Library: `i18next` + `react-i18next` + `expo-localization`

```
src/i18n/
├── index.ts          # i18next initialization
├── es.json           # Spanish translations (default)
└── en.json           # English translations
```

**Rules:**
- The default language is detected from the device locale via `expo-localization`. If the device locale is Spanish (any variant), default to `es`. Otherwise default to `en`.
- The user can override the language in Settings, which saves to `AppSettings.language`.
- **Every user-visible string** must use a translation key. No hardcoded Spanish or English strings in component files.
- Translation keys follow the pattern `screen.element.description`, e.g. `home.emptyState.title`, `scale.anchorLabel`, `settings.languageToggle`.

### Translation file structure example (`es.json`):

```json
{
  "common": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar",
    "edit": "Editar",
    "back": "Volver",
    "units": {
      "kg": "kg", "g": "g", "ml": "ml", "l": "l",
      "cups": "tazas", "tbsp": "cdas", "tsp": "cditas", "units": "unid."
    }
  },
  "home": {
    "title": "Mis Recetas",
    "searchPlaceholder": "Buscar recetas...",
    "emptyState": {
      "title": "Todavía no tenés recetas",
      "subtitle": "Tocá el botón + para crear tu primera fórmula"
    }
  },
  "recipeDetail": {
    "scaleButton": "Reescalar",
    "ingredientsTitle": "Ingredientes",
    "preparationTitle": "Preparación"
  },
  "scale": {
    "title": "Reescalar",
    "anchorLabel": "¿Cuánto {{ingredient}} vas a usar?",
    "originalLabel": "Original",
    "scaledLabel": "Reescalado",
    "resetButton": "Resetear"
  },
  "create": {
    "title": "Nueva Receta",
    "namePlaceholder": "Nombre de la receta",
    "addIngredient": "Agregar ingrediente",
    "ingredientName": "Ingrediente",
    "ingredientAmount": "Cantidad",
    "ingredientUnit": "Unidad",
    "preparationPlaceholder": "Pasos de preparación (opcional)...",
    "tagsPlaceholder": "Tags (ej: pizza, pan)"
  },
  "settings": {
    "title": "Configuración",
    "language": "Idioma",
    "theme": "Tema",
    "premium": {
      "title": "RecipeScaler Premium",
      "subtitle": "Sin anuncios, para siempre",
      "button": "Obtener Premium"
    },
    "about": "Acerca de"
  }
}
```

---

## 7. Ads Integration

Library: `react-native-google-mobile-ads`

**Free tier:** A persistent banner ad appears at the bottom of all screens except the rescaling screen during active use (it can appear on the rescaling screen's header area, never over the ingredient list).

**Premium tier:** `isPremium === true` causes the `AdBanner` component to return `null` unconditionally.

```
src/components/ads/
├── AdBanner.tsx      # Renders banner or null depending on isPremium
└── adConfig.ts       # Ad unit IDs (test IDs in dev, real IDs in prod)
```

**Rules:**
- Use test ad unit IDs during development. The real IDs go in a `.env` file (not committed).
- The `AdBanner` component is the ONLY place in the codebase that touches the ads library.
- Never render ads on the onboarding or empty-state screens.

---

## 8. Future Backend Integration Points

The following integration points must be left clean in v1. They should be no-ops or stubs, never implemented:

| Point | Where | What to stub |
|---|---|---|
| `Recipe.authorId` | Type definition | Optional field, always `undefined` in v1 |
| `Recipe.isPublic` | Type definition | Optional field, always `undefined` in v1 |
| `Recipe.remoteId` | Type definition | Optional field, always `undefined` in v1 |
| Auth service | `src/services/authService.ts` | Export empty stubs: `login`, `logout`, `register` |
| Sync service | `src/services/syncService.ts` | Export empty stub: `syncRecipes` |
| Social feed | — | Not present in v1; navigation slot reserved in tab bar as hidden item |

When the backend is built, developers will:
1. Implement `authService.ts` and `syncService.ts`.
2. Add a "Discover" tab (the 4th tab, hidden in v1).
3. Extend the recipe store to merge local + remote data.
4. Add `remoteId` tracking for conflict resolution.

---

## 9. Error Handling

- All `AsyncStorage` operations are wrapped in `try/catch`. Failures are logged to console in dev and silently ignored in prod (the app always falls back to empty state).
- Form validation uses React Hook Form's built-in validation. No recipe can be saved with: empty name, no ingredients, or any ingredient with amount ≤ 0.
- Division by zero in `scaleRecipe` is explicitly guarded (see the utility function above).

---

## 10. Performance Rules

- The rescaling screen re-renders on every keystroke. Use `useMemo` to memoize the result of `scaleRecipe` when neither the recipe nor the anchor changes.
- The recipe list should use `FlatList` (not `ScrollView`) to handle large collections.
- Images are not used in v1 (no recipe photos). This keeps storage and complexity low.
