import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';

interface ScaleFactorBadgeProps {
  factor: number;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Scale factor badge component according to STYLEGUIDE.md §6.8
 * - Background: colors.accentLight
 * - Text: typography.displayMedium, colors.accent
 * - Label below: typography.labelSmall, colors.textSecondary
 * - Border radius: radius.md
 */
export const ScaleFactorBadge: React.FC<ScaleFactorBadgeProps> = ({
  factor,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  const badgeStyle = [
    styles.badge,
    {
      backgroundColor: colors.accentLight,
    },
    style,
  ];

  return (
    <View style={badgeStyle} testID={testID}>
      <Text
        style={[
          typography.displayMedium,
          styles.factorText,
          {
            color: colors.accent,
          },
        ]}
      >
        × {factor.toFixed(2)}
      </Text>
      <Text
        style={[
          typography.labelSmall,
          styles.label,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        factor
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  factorText: {
    textAlign: 'center',
    lineHeight: 32,
  },
  label: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default ScaleFactorBadge;
