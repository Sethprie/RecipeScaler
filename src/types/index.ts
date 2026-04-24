export interface Ingredient {
  id: string;          // UUID, generated on creation
  name: string;        // e.g. "Harina / Flour"
  amount: number;      // Base amount in the original recipe
  unit: string;        // e.g. "kg", "g", "ml", "cups", "units", "tbsp"
}

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

export interface ScaleSession {
  recipeId: string;
  anchorIngredientId: string;   // The ingredient the user is anchoring to
  anchorAmount: number;         // The new amount the user wants
  scaleFactor: number;          // Computed: anchorAmount / original anchorIngredient.amount
}

export interface AppSettings {
  language: 'es' | 'en';
  isPremium: boolean;
  theme: 'light' | 'dark' | 'system';
}
