import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/typography';
import { useLocalSearchParams } from 'expo-router';

export default function RecipeDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <Text style={[typography.displayMedium, { color: colors.textPrimary }]}>
        Recipe Detail Screen
      </Text>
      <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: 8 }]}>
        Recipe ID: {id}
      </Text>
      <Text style={[typography.bodySmall, { color: colors.textDisabled, marginTop: 4 }]}>
        (Recipe detail placeholder)
      </Text>
    </View>
  );
}
