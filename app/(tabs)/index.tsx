import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/typography';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <Text style={[typography.displayMedium, { color: colors.textPrimary }]}>
        Home Screen
      </Text>
      <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: 8 }]}>
        (Recipe list placeholder)
      </Text>
    </View>
  );
}
