import { Platform } from 'react-native';

// Test ad unit IDs for development
export const AD_UNIT_IDS = {
  // Banner ads (320x50)
  banner: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
  }),
  
  // Interstitial ads (not used in v1 but kept for future)
  interstitial: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
  }),
} as const;

// Production ad unit IDs (to be added in production build)
export const PROD_AD_UNIT_IDS = {
  banner: Platform.select({
    ios: '', // TODO: Add iOS production banner ID
    android: '', // TODO: Add Android production banner ID
  }),
  interstitial: Platform.select({
    ios: '', // TODO: Add iOS production interstitial ID
    android: '', // TODO: Add Android production interstitial ID
  }),
} as const;
