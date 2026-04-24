import { Recipe, Ingredient } from '@/types';

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
