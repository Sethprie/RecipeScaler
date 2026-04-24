import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '@/types';
import { generateId } from '@/utils/uuid';

const SCHEMA_VERSION = '1.0.0';
const STORAGE_KEY = '@recipescaler/recipes';

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

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
      recipes: [],
      
      addRecipe: (recipeData) => {
        const now = new Date().toISOString();
        const newRecipe: Recipe = {
          ...recipeData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          recipes: [...state.recipes, newRecipe],
        }));
        
        // Immediately save to storage
        get().saveToStorage().catch(console.error);
      },
      
      updateRecipe: (id, changes) => {
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === id
              ? { ...recipe, ...changes, updatedAt: new Date().toISOString() }
              : recipe
          ),
        }));
        
        // Immediately save to storage
        get().saveToStorage().catch(console.error);
      },
      
      deleteRecipe: (id) => {
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== id),
        }));
        
        // Immediately save to storage
        get().saveToStorage().catch(console.error);
      },
      
      getRecipeById: (id) => {
        return get().recipes.find((recipe) => recipe.id === id);
      },
      
      loadFromStorage: async () => {
        try {
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (stored) {
            const data = JSON.parse(stored);
            // Handle schema migration if needed
            if (data.state && data.state.recipes) {
              set({ recipes: data.state.recipes });
            }
          }
        } catch (error) {
          console.error('Failed to load recipes from storage:', error);
          // Fall back to empty state
          set({ recipes: [] });
        }
      },
      
      saveToStorage: async () => {
        try {
          const state = get();
          const dataToStore = {
            version: SCHEMA_VERSION,
            state: {
              recipes: state.recipes,
            },
          };
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
        } catch (error) {
          console.error('Failed to save recipes to storage:', error);
        }
      },
    }),
    {
      name: 'recipe-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
