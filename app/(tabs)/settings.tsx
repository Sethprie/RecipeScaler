import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/typography';

export default function SettingsScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <Text style={[typography.displayMedium, { color: colors.textPrimary }]}>
        Settings Screen
      </Text>
      <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: 8 }]}>
        (Settings placeholder)
      </Text>
    </View>
  );
}
