# STYLEGUIDE.md — RecipeScaler

This document defines the visual identity and UI component patterns for RecipeScaler. All screens, components, and layouts must follow these rules. Consistency is non-negotiable.

---

## 1. Design Philosophy

RecipeScaler lives in the kitchen — a hot, busy, often chaotic environment. The UI must be:

- **Readable at a glance** — Information hierarchy is crystal clear. The most important number on screen is always the largest.
- **Large tap targets** — Minimum 48x48pt for any interactive element. Cooks have wet hands.
- **Calm and warm** — Not sterile. Not clinical. It should feel like a well-organized recipe notebook, not a spreadsheet app.
- **Fast** — No skeleton loaders for local data. Results appear instantly.

The aesthetic direction is **warm utilitarian** — the visual language of a professional kitchen: clean organization, warm tones, tactile surfaces, no decorative noise.

---

## 2. Color System

All colors are defined as constants in `src/constants/colors.ts` and consumed via a theme hook. The app supports light and dark modes.

### Light Mode

```typescript
export const lightColors = {
  // Backgrounds
  background:       '#FAF8F5',   // Warm off-white (like parchment)
  surface:          '#FFFFFF',   // Card / input background
  surfaceAlt:       '#F0EDE8',   // Subtle secondary surface (tag backgrounds, dividers)

  // Brand
  primary:          '#C84B2F',   // Warm brick red — the "fire" of cooking
  primaryLight:     '#F2D5CF',   // Tint for backgrounds behind primary elements
  primaryDark:      '#9E3520',   // Pressed / active state

  // Text
  textPrimary:      '#1C1916',   // Near-black, warm undertone
  textSecondary:    '#6B6560',   // Subdued labels
  textDisabled:     '#B8B3AE',   // Placeholder text

  // Utility
  border:           '#E2DDD8',   // Subtle dividers
  error:            '#D94040',   // Validation errors
  success:          '#3D8C5E',   // Confirmation states
  
  // Accent (for scaled values — visually distinguished from originals)
  accent:           '#2C6E8A',   // Steel blue — cold contrast to the warm primary
  accentLight:      '#D0E8F0',   // Tint behind scaled amounts
};
```

### Dark Mode

```typescript
export const darkColors = {
  background:       '#1A1714',
  surface:          '#252220',
  surfaceAlt:       '#302C2A',

  primary:          '#E05C3E',
  primaryLight:     '#4A1F16',
  primaryDark:      '#C84B2F',

  textPrimary:      '#F0EDE8',
  textSecondary:    '#A09891',
  textDisabled:     '#5A5450',

  border:           '#3A3530',
  error:            '#E05555',
  success:          '#52AD7A',

  accent:           '#4A9AB8',
  accentLight:      '#1A3A48',
};
```

### Usage Rules

- **Never use hex values directly in component files.** Always reference via the theme: `const { colors } = useTheme()`.
- Primary (brick red) is used ONLY for: primary action buttons, FAB, active tab indicator, and the app logo.
- Accent (steel blue) is used ONLY for: scaled ingredient amounts and the scale factor badge.
- Do not mix warm and cool colors decoratively — the contrast between them is reserved for the original vs. rescaled distinction.

---

## 3. Typography

Font family: **DM Serif Display** (display/headings) + **DM Sans** (body/UI).

Load via `expo-font` or `@expo-google-fonts/dm-serif-display` and `@expo-google-fonts/dm-sans`.

```typescript
export const typography = {
  // Display — recipe names, screen titles
  displayLarge:  { fontFamily: 'DMSerifDisplay-Regular', fontSize: 32, lineHeight: 40 },
  displayMedium: { fontFamily: 'DMSerifDisplay-Regular', fontSize: 24, lineHeight: 32 },

  // Headings — section titles
  headingLarge:  { fontFamily: 'DMSans-SemiBold', fontSize: 20, lineHeight: 28 },
  headingMedium: { fontFamily: 'DMSans-SemiBold', fontSize: 16, lineHeight: 24 },

  // Body — preparation text, descriptions
  bodyLarge:     { fontFamily: 'DMSans-Regular',  fontSize: 16, lineHeight: 26 },
  bodyMedium:    { fontFamily: 'DMSans-Regular',  fontSize: 14, lineHeight: 22 },
  bodySmall:     { fontFamily: 'DMSans-Regular',  fontSize: 12, lineHeight: 18 },

  // Mono — ingredient amounts (scaled values)
  monoLarge:     { fontFamily: 'DMSans-Medium',   fontSize: 22, lineHeight: 28 },
  monoMedium:    { fontFamily: 'DMSans-Medium',   fontSize: 16, lineHeight: 22 },
  
  // Label — tags, units, badges
  labelMedium:   { fontFamily: 'DMSans-Medium',   fontSize: 13, lineHeight: 18, letterSpacing: 0.3 },
  labelSmall:    { fontFamily: 'DMSans-Medium',   fontSize: 11, lineHeight: 16, letterSpacing: 0.5, textTransform: 'uppercase' as const },
};
```

### Typography Rules

- Recipe names use `displayMedium` on the list card, `displayLarge` on the detail screen.
- Ingredient amounts always use `monoLarge` (scaled) or `monoMedium` (original reference).
- Preparation text uses `bodyLarge` with a line height of 26 for readability.
- Tags and unit labels use `labelSmall` (uppercase).
- Never use italic. Never use font weight below Medium for interactive elements.

---

## 4. Spacing System

Based on an 8pt grid.

```typescript
export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};
```

- Screen horizontal padding: `spacing.md` (16pt) on both sides.
- Card internal padding: `spacing.md` top/bottom, `spacing.md` left/right.
- Gap between list items: `spacing.sm` (8pt).
- Section titles have `spacing.lg` (24pt) margin-top and `spacing.sm` margin-bottom.

---

## 5. Border Radius

```typescript
export const radius = {
  sm:   6,
  md:  12,
  lg:  20,
  full: 9999,  // Pills / badges
};
```

- Cards: `radius.md` (12)
- Buttons: `radius.md` (12) for primary, `radius.sm` (6) for small secondary
- Tags/badges: `radius.full`
- Input fields: `radius.sm` (6)

---

## 6. Component Patterns

### 6.1 RecipeCard

Displayed in the home screen's FlatList.

```
┌─────────────────────────────────────┐
│  Pizza Dough               [tag][tag]│
│  5 ingredients · Updated 2 days ago │
└─────────────────────────────────────┘
```

- Background: `colors.surface`
- Recipe name: `typography.headingLarge`, `colors.textPrimary`
- Metadata line: `typography.bodySmall`, `colors.textSecondary`
- Tags: `typography.labelSmall`, `colors.primary` text on `colors.primaryLight` background, `radius.full`
- Tap the whole card to go to recipe detail.
- Swipe left on the card to reveal a Delete action (red, trash icon).

### 6.2 IngredientRow (in Recipe Detail — original view)

```
Harina                    5 kg
────────────────────────────────
Agua                      3.25 kg
```

- Ingredient name: `typography.bodyLarge`, `colors.textPrimary`, left-aligned
- Amount + unit: `typography.monoMedium`, `colors.textPrimary`, right-aligned
- Divider: 1pt line, `colors.border`

### 6.3 IngredientRow (in Scale Screen — rescaled view)

Visually different to make the scaled result unmissable.

```
┌─────────────────────────────────────────┐
│  Harina              [5 kg] →  [4 kg]   │
│  Agua                [3.25 kg] → [2.6 kg]│
└─────────────────────────────────────────┘
```

- Original amount: `typography.bodySmall`, `colors.textSecondary`, with strikethrough style
- Arrow icon: `colors.textDisabled`
- Scaled amount: `typography.monoLarge`, `colors.accent`, on `colors.accentLight` pill background
- The anchor ingredient row has a small pin icon (📌) and its scaled amount is `colors.primary` instead of accent.

### 6.4 Primary Button

```typescript
// Full-width call to action
<PrimaryButton label="Reescalar" onPress={handleScale} />
```

- Background: `colors.primary`
- Text: `typography.headingMedium`, white
- Height: 52pt
- Border radius: `radius.md`
- Pressed state: `colors.primaryDark` background + scale(0.97) animation

### 6.5 FAB (Floating Action Button)

Used on the home screen to create a new recipe.

- Position: bottom-right, 16pt from edge and bottom safe area.
- Size: 56pt diameter circle
- Background: `colors.primary`
- Icon: `+` (MaterialCommunityIcons `plus`, white, size 28)
- Shadow: `elevation: 6` (Android), `shadowColor: colors.primary` with `shadowOpacity: 0.4` (iOS)

### 6.6 Input Field

```typescript
<TextInput
  style={{
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    ...typography.bodyLarge,
    color: colors.textPrimary,
  }}
  placeholderTextColor={colors.textDisabled}
/>
```

- On focus: `borderColor` changes to `colors.primary`
- Error state: `borderColor: colors.error` + small error message below in `typography.bodySmall`, `colors.error`

### 6.7 Tag Chip

```typescript
<TagChip label="pizza" />
```

- Background: `colors.primaryLight`
- Text: `colors.primary`, `typography.labelSmall`
- Border radius: `radius.full`
- Padding: 4pt vertical, 10pt horizontal

### 6.8 Scale Factor Badge

Displayed prominently on the scaling screen to show the computed multiplier.

```
╔═══════════════╗
║   × 0.8       ║
║  factor       ║
╚═══════════════╝
```

- Background: `colors.accentLight`
- Text: `typography.displayMedium`, `colors.accent`
- Label below: `typography.labelSmall`, `colors.textSecondary`
- Border radius: `radius.md`

---

## 7. Navigation & Layout

### Tab Bar

- Style: floating tab bar with rounded container, shadow, `colors.surface` background.
- 3 tabs: Home (home icon), Create (plus-circle icon), Settings (cog icon).
- Active tab: `colors.primary` icon + label. Inactive: `colors.textDisabled`.
- Tab bar font: `typography.labelSmall`.

### Screen Headers

- Title: `typography.displayMedium` (DM Serif Display), `colors.textPrimary`.
- Back button: chevron-left icon, `colors.primary`, label-less on iOS standard.
- No shadow on headers. Use a subtle bottom border (`colors.border`).

### Safe Areas

Always use `useSafeAreaInsets()` or `<SafeAreaView>` from `react-native-safe-area-context`. Never hardcode status bar heights.

---

## 8. Empty States

Every list that can be empty needs an empty state. It must be:
- Centered vertically and horizontally
- A relevant emoji or simple illustration (SVG, not raster)
- A short `displayMedium` title
- A `bodyMedium` subtitle with a clear next-action hint
- No buttons in empty state — direct users to the FAB or existing UI

Example for empty recipe list:
```
        🍕
  Todavía no tenés recetas
  Tocá el + para crear tu primera fórmula
```

---

## 9. Animations & Feedback

- **List item entrance**: Items in FlatList fade in with a 150ms opacity transition, staggered by 30ms per item. Use `react-native`'s `Animated` API or `react-native-reanimated`.
- **Scale result update**: When the scaled amounts change (user typing), the new values "pop" with a brief scale(1.0 → 1.05 → 1.0) animation over 200ms.
- **Button press**: All buttons use `scale(0.97)` on `pressIn`, back to `scale(1)` on `pressOut`, 100ms.
- **Delete confirmation**: Swipe-to-delete on recipe cards uses a smooth reveal. Confirm with a native alert before executing.
- **No loading spinners** for any local storage operation. If data isn't ready, show the empty state.

---

## 10. Ad Banner Placement

- The `AdBanner` component is rendered at the very bottom of the screen, above the system navigation bar (safe area), and below the tab bar.
- It renders a standard 320×50 banner.
- It must never overlap content. Use `paddingBottom` on the scroll container equal to the banner height.
- On the rescaling screen, the banner appears in the header area (below the screen title, above the anchor input). It does NOT appear at the bottom during active rescaling, to keep the ingredient list unobstructed.
- When `isPremium === true`, `AdBanner` returns `null` and the padding it occupied collapses.

---

## 11. Iconography

Library: `@expo/vector-icons` — use `MaterialCommunityIcons` throughout for consistency.

| Usage | Icon name |
|---|---|
| Home tab | `home-outline` / `home` (active) |
| Create tab | `plus-circle-outline` / `plus-circle` (active) |
| Settings tab | `cog-outline` / `cog` (active) |
| Add ingredient | `plus` |
| Delete | `trash-can-outline` |
| Edit | `pencil-outline` |
| Scale/rescale | `arrow-expand-horizontal` |
| Anchor ingredient | `pin-outline` |
| Tag | `tag-outline` |
| Search | `magnify` |
| Premium | `crown-outline` |
| Back | `chevron-left` |

Icon size: 24pt in tab bar, 22pt in list items, 20pt inline.

---

## 12. Do's and Don'ts

### ✅ Do
- Use `DM Serif Display` for all recipe names and screen titles.
- Keep the brick-red primary color rare and intentional — it draws the eye.
- Use the blue accent exclusively for rescaled values.
- Maintain generous whitespace — the kitchen is messy enough.
- Test all screens with font scaling set to "Larger" in device accessibility settings.

### ❌ Don't
- Don't use shadows as decoration — only for elevation (FAB, modals).
- Don't add borders to cards that already have a contrasting background.
- Don't use more than 2 font families.
- Don't put more than 3 tags on a recipe card (truncate with "+N more").
- Don't use red for anything other than errors and destructive actions.
- Don't use `flex: 1` as a lazy fix — understand the layout hierarchy.
