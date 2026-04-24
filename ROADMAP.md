# ROADMAP.md — RecipeScaler

Este documento define el orden exacto en que debe construirse la app. Cada tarea es un prompt independiente para la IA. No avances a la siguiente tarea hasta verificar que la anterior funciona correctamente en el dispositivo o simulador.

**Antes de empezar cualquier tarea**, la IA debe leer:
- `ARCHITECTURE.md` — modelos de datos, navegación, stores
- `STYLEGUIDE.md` — colores, tipografía, componentes
- `ROLES.md` — qué rol activar y qué reglas seguir

---

## Fase 1 — Fundación del proyecto

> Objetivo: tener un proyecto Expo corriendo con toda la infraestructura base instalada y configurada. Sin pantallas reales todavía, solo el esqueleto.

---

**Tarea 1.1 — Inicializar el proyecto**

Crear el proyecto Expo con TypeScript y instalar todas las dependencias necesarias según `README.md` (stack tecnológico). Configurar `tsconfig.json` con paths alias (`@/` apuntando a `src/`). Verificar que `npx expo start` corra sin errores.

---

**Tarea 1.2 — Constantes y tema**

Crear los archivos:
- `src/constants/colors.ts` — con `lightColors` y `darkColors` exactamente como están en `STYLEGUIDE.md §2`
- `src/constants/typography.ts` — con todos los tokens de `STYLEGUIDE.md §3`
- `src/constants/spacing.ts` — con el sistema de 8pt de `STYLEGUIDE.md §4`
- `src/constants/radius.ts` — con los radios de `STYLEGUIDE.md §5`
- `src/hooks/useTheme.ts` — hook que devuelve el set de colores correcto según el tema del sistema (light/dark)

No crear pantallas todavía. Verificar que los tipos compilan sin errores.

---

**Tarea 1.3 — Tipos globales**

Crear `src/types/index.ts` con las interfaces `Ingredient`, `Recipe`, `ScaleSession` y `AppSettings` exactamente como están definidas en `ARCHITECTURE.md §1`.

---

**Tarea 1.4 — Utilidades de lógica pura**

Crear:
- `src/utils/uuid.ts` — función `generateId(): string` (puede usar `Math.random` + timestamp, no necesita librería externa)
- `src/utils/scaleRecipe.ts` — función `scaleRecipe()` exactamente como está en `ARCHITECTURE.md §5`
- `src/utils/formatAmount.ts` — función `formatAmount(n: number): string` (sin trailing zeros, máximo 2 decimales en display, ver reglas en `ARCHITECTURE.md §5`)

Cada función debe tener JSDoc. No hay UI todavía.

---

**Tarea 1.5 — i18n**

Configurar `i18next` + `react-i18next` + `expo-localization`:
- Crear `src/i18n/index.ts` con la inicialización
- Crear `src/i18n/es.json` con TODAS las claves definidas en `ARCHITECTURE.md §6`
- Crear `src/i18n/en.json` con la traducción al inglés de todas las mismas claves

Verificar que `useTranslation()` funcione desde un componente de prueba.

---

**Tarea 1.6 — Stores de Zustand**

Crear:
- `src/store/useRecipeStore.ts` — store completo con acciones y persistencia en AsyncStorage, según `ARCHITECTURE.md §2.1`
- `src/store/useSettingsStore.ts` — store completo con acciones y persistencia, según `ARCHITECTURE.md §2.2`

Las claves de AsyncStorage deben coincidir exactamente con las de `ARCHITECTURE.md §3`. Ambos stores deben manejar errores de storage con try/catch.

---

**Tarea 1.7 — Stubs de servicios futuros**

Crear los archivos vacíos con funciones stub (que no hacen nada y no lanzan errores):
- `src/services/authService.ts` — exporta `login`, `logout`, `register`
- `src/services/syncService.ts` — exporta `syncRecipes`

Esto cumple con `ARCHITECTURE.md §8`. No implementar nada dentro de estas funciones.

---

## Fase 2 — Navegación y layout base

> Objetivo: tener la estructura de navegación funcionando con pantallas placeholder. Poder navegar entre tabs y ver que el router funciona.

---

**Tarea 2.1 — Root layout y carga inicial**

Crear `app/_layout.tsx`:
- Cargar fuentes (DM Serif Display, DM Sans) con `expo-font`
- Llamar a `loadFromStorage()` de ambos stores al iniciar
- Configurar i18next con el idioma guardado en settings (o el del dispositivo por defecto)
- Mostrar una pantalla de splash simple mientras las fuentes y datos cargan

---

**Tarea 2.2 — Tab layout**

Crear `app/(tabs)/_layout.tsx` con las 3 tabs definidas en `ARCHITECTURE.md §4`:
- Home (índice)
- Create
- Settings

Usar los iconos definidos en `STYLEGUIDE.md §11`. El tab bar debe seguir el estilo de `STYLEGUIDE.md §7` (flotante, redondeado, con colores del tema).

---

**Tarea 2.3 — Pantallas placeholder**

Crear pantallas mínimas (solo un texto centrado con el nombre de la pantalla) para:
- `app/(tabs)/index.tsx`
- `app/(tabs)/create.tsx`
- `app/(tabs)/settings.tsx`
- `app/recipe/[id].tsx`
- `app/recipe/[id]/scale.tsx`

Verificar que la navegación entre tabs funciona y que `router.push('/recipe/test-id')` navega correctamente.

---

## Fase 3 — Componentes base reutilizables

> Objetivo: construir los componentes de UI antes de las pantallas, para que las pantallas solo ensamblen piezas ya probadas.

---

**Tarea 3.1 — AdBanner**

Crear `src/components/ads/AdBanner.tsx` y `src/components/ads/adConfig.ts` según `ARCHITECTURE.md §7`. En este punto usar IDs de prueba. El componente debe retornar `null` si `isPremium === true`.

---

**Tarea 3.2 — Componentes atómicos**

Crear en `src/components/`:
- `PrimaryButton.tsx` — según `STYLEGUIDE.md §6.4`
- `TagChip.tsx` — según `STYLEGUIDE.md §6.7`
- `InputField.tsx` — según `STYLEGUIDE.md §6.6`, con soporte para estado de error
- `ScaleFactorBadge.tsx` — según `STYLEGUIDE.md §6.8`

Cada componente debe aceptar el tema via `useTheme()` y textos via props (no hardcodeados).

---

**Tarea 3.3 — RecipeCard**

Crear `src/components/RecipeCard.tsx` según `STYLEGUIDE.md §6.1`. Debe aceptar un objeto `Recipe` como prop. Incluir swipe-to-delete con confirmación. Mostrar máximo 3 tags (truncar con "+N más").

---

**Tarea 3.4 — IngredientRow (dos variantes)**

Crear `src/components/IngredientRow.tsx` con dos variantes según `STYLEGUIDE.md §6.2 y §6.3`:
- `variant="original"` — nombre a la izquierda, cantidad a la derecha
- `variant="scaled"` — muestra original tachado con flecha y resultado en azul

---

**Tarea 3.5 — EmptyState**

Crear `src/components/EmptyState.tsx` con emoji, título y subtítulo, según `STYLEGUIDE.md §8`. Debe aceptar `emoji`, `title` y `subtitle` como props con claves de traducción.

---

## Fase 4 — Pantallas principales

> Objetivo: implementar las pantallas reales usando los componentes de la Fase 3.

---

**Tarea 4.1 — Pantalla Home (lista de recetas)**

Implementar `app/(tabs)/index.tsx`:
- `FlatList` de `RecipeCard`
- Buscador por nombre en tiempo real
- `EmptyState` cuando no hay recetas
- FAB para navegar a Create (según `STYLEGUIDE.md §6.5`)
- `AdBanner` en la posición correcta (ver `STYLEGUIDE.md §10`)

---

**Tarea 4.2 — Pantalla Create (crear receta)**

Implementar `app/(tabs)/create.tsx`:
- Formulario con React Hook Form
- Campos: nombre, lista de ingredientes (agregar/quitar dinámicamente), texto de preparación, tags
- Validaciones según `ARCHITECTURE.md §9`
- Al guardar: llama a `addRecipe()` del store y navega a Home

---

**Tarea 4.3 — Pantalla Recipe Detail**

Implementar `app/recipe/[id].tsx`:
- Muestra nombre, tags, lista de ingredientes originales con `IngredientRow variant="original"`
- Muestra texto de preparación
- Botón "Reescalar" que navega a `recipe/[id]/scale`
- Botón de editar (navega a un formulario de edición — reusar la lógica de Create)
- `AdBanner` en posición correcta

---

**Tarea 4.4 — Pantalla Scale (reescalado)**

Implementar `app/recipe/[id]/scale.tsx`:
- Selector del ingrediente ancla (lista con radio buttons o highlight)
- Input numérico para la nueva cantidad del ancla
- Lista de `IngredientRow variant="scaled"` actualizada en tiempo real (usar `useMemo`)
- `ScaleFactorBadge` mostrando el factor calculado
- Botón "Resetear" que vuelve al factor 1
- El ingrediente ancla se muestra con color primario (rojo) en vez de azul
- `AdBanner` en el header, NO al fondo (ver `STYLEGUIDE.md §10`)

---

**Tarea 4.5 — Pantalla Settings**

Implementar `app/(tabs)/settings.tsx`:
- Toggle de idioma (Español / English)
- Toggle de tema (Claro / Oscuro / Sistema)
- Sección Premium con botón "Obtener Premium" (stub por ahora, no implementar la compra todavía)
- Versión de la app y créditos

---

## Fase 5 — Pulido y funcionalidades complementarias

> Objetivo: completar la experiencia, agregar animaciones y preparar para distribución.

---

**Tarea 5.1 — Animaciones**

Agregar todas las animaciones definidas en `STYLEGUIDE.md §9`:
- Entrada de items en FlatList (fade + stagger)
- Pop de valores escalados al cambiar el input
- Feedback de press en botones (scale 0.97)

---

**Tarea 5.2 — Edición de recetas**

Implementar la pantalla de edición (puede ser `app/recipe/[id]/edit.tsx`) que precarga el formulario de Create con los datos de la receta existente y llama a `updateRecipe()` al guardar.

---

**Tarea 5.3 — Dark mode completo**

Verificar cada pantalla y componente en dark mode. Corregir cualquier color que no use el tema correctamente.

---

**Tarea 5.4 — Accesibilidad**

- Verificar todas las pantallas con tamaño de fuente "Extra Grande" en settings del dispositivo
- Agregar `accessibilityLabel` a todos los elementos interactivos sin texto visible (íconos, FAB)
- Verificar contraste de colores en ambos modos

---

**Tarea 5.5 — In-app purchase (Premium)**

Integrar RevenueCat o `expo-in-app-purchases` para la compra premium. Cuando se completa la compra, actualizar `isPremium` en el settings store. Esto hace que `AdBanner` retorne `null` en toda la app automáticamente.

---

## Verificación final antes de publicar

Antes de subir a las tiendas, confirmar:

- [ ] La app corre en un dispositivo Android real (no solo simulador)
- [ ] La app corre en un dispositivo iOS real
- [ ] Las fuentes cargan correctamente en ambas plataformas
- [ ] Los anuncios muestran anuncios reales (cambiar de test IDs a IDs de producción)
- [ ] La compra premium funciona en modo sandbox
- [ ] Todos los textos están traducidos (no hay claves sin traducir en ningún idioma)
- [ ] No hay `console.log` en el código
- [ ] La app funciona sin conexión a internet
- [ ] El rescalado nunca modifica la receta original (probar con varias recetas)
