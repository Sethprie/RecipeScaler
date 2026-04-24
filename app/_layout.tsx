import React, { useState, useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  DMSerifDisplay_400Regular,
} from '@expo-google-fonts/dm-serif-display';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from '@expo-google-fonts/dm-sans';
import { View, Text } from 'react-native';
import { useRecipeStore } from '@/store/useRecipeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import '@/i18n';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  
  const loadRecipes = useRecipeStore((state) => state.loadFromStorage);
  const loadSettings = useSettingsStore((state) => state.loadFromStorage);
  const language = useSettingsStore((state) => state.settings.language);

  // Load fonts
  const [fontsLoaded] = useFonts({
    'DMSerifDisplay-Regular': DMSerifDisplay_400Regular,
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-SemiBold': DMSans_600SemiBold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Load data from storage
        await Promise.all([
          loadSettings(),
          loadRecipes(),
        ]);
      } catch (error) {
        console.error('Failed to load app data:', error);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, [loadRecipes, loadSettings]);

  useEffect(() => {
    // Update i18n language when settings change
    if (appIsReady && language) {
      const i18n = require('@/i18n').default;
      i18n.changeLanguage(language);
    }
  }, [language, appIsReady]);

  const onLayoutRootView = async () => {
    if (appIsReady && fontsLoaded) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  };

  if (!appIsReady || !fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FAF8F5', // lightColors.background
        }}
        onLayout={onLayoutRootView}
      >
        <Text
          style={{
            fontFamily: 'DMSerifDisplay-Regular',
            fontSize: 32,
            color: '#C84B2F', // lightColors.primary
            marginBottom: 16,
          }}
        >
          RecipeScaler
        </Text>
        <Text
          style={{
            fontFamily: 'DMSans-Regular',
            fontSize: 16,
            color: '#6B6560', // lightColors.textSecondary
          }}
        >
          Cargando...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
