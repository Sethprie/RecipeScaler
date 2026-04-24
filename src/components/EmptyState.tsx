import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

interface EmptyStateProps {
  emoji: string;
  title: string;
  subtitle: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Empty state component according to STYLEGUIDE.md §8
 * Every list that can be empty needs an empty state. It must be:
 * - Centered vertically and horizontally
 * - A relevant emoji or simple illustration (SVG, not raster)
 * - A short displayMedium title
 * - A bodyMedium subtitle with a clear next-action hint
 * - No buttons in empty state — direct users to the FAB or existing UI
 * 
 * Example for empty recipe list:
 * 🍕
 * Todavía no tenés recetas
 * Tocá el + para crear tu primera fórmula
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  emoji,
  title,
  subtitle,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  const containerStyle = [
    styles.container,
    {
      backgroundColor: colors.background,
    },
    style,
  ];

  return (
    <View style={containerStyle} testID={testID}>
      <Text style={[styles.emoji, { color: colors.textPrimary }]}>
        {emoji}
      </Text>
      <Text
        style={[
          typography.displayMedium,
          styles.title,
          { color: colors.textPrimary }
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          typography.bodyMedium,
          styles.subtitle,
          { color: colors.textSecondary }
        ]}
      >
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    minHeight: 300, // Minimum height to ensure visibility
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: 32,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280, // Limit width for better readability
  },
});

export default EmptyState;
