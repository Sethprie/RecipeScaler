import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '@/types';

const SCHEMA_VERSION = '1.0.0';
const STORAGE_KEY = '@recipescaler/settings';
const PREMIUM_KEY = '@recipescaler/isPremium';

interface SettingsStore {
  settings: AppSettings;
  
  // Actions
  setLanguage: (lang: 'es' | 'en') => void;
  setPremium: (isPremium: boolean) => void;
  setTheme: (theme: AppSettings['theme']) => void;
  
  // Persistence
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  language: 'es',
  isPremium: false,
  theme: 'system',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      
      setLanguage: (language) => {
        set((state) => ({
          settings: { ...state.settings, language },
        }));
        
        // Immediately save to storage
        get().saveToStorage().catch(console.error);
      },
      
      setPremium: (isPremium) => {
        set((state) => ({
          settings: { ...state.settings, isPremium },
        }));
        
        // Also save to separate premium key for quick access
        AsyncStorage.setItem(PREMIUM_KEY, JSON.stringify(isPremium))
          .catch(console.error);
        
        // Immediately save to storage
        get().saveToStorage().catch(console.error);
      },
      
      setTheme: (theme) => {
        set((state) => ({
          settings: { ...state.settings, theme },
        }));
        
        // Immediately save to storage
        get().saveToStorage().catch(console.error);
      },
      
      loadFromStorage: async () => {
        try {
          // Load main settings
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (stored) {
            const data = JSON.parse(stored);
            // Handle schema migration if needed
            if (data.state && data.state.settings) {
              set({ settings: { ...defaultSettings, ...data.state.settings } });
            }
          }
          
          // Load premium flag from separate key (for backward compatibility)
          const premiumStored = await AsyncStorage.getItem(PREMIUM_KEY);
          if (premiumStored) {
            const isPremium = JSON.parse(premiumStored);
            set((state) => ({
              settings: { ...state.settings, isPremium },
            }));
          }
        } catch (error) {
          console.error('Failed to load settings from storage:', error);
          // Fall back to default settings
          set({ settings: defaultSettings });
        }
      },
      
      saveToStorage: async () => {
        try {
          const state = get();
          const dataToStore = {
            version: SCHEMA_VERSION,
            state: {
              settings: state.settings,
            },
          };
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
        } catch (error) {
          console.error('Failed to save settings to storage:', error);
        }
      },
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
