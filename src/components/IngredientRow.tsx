import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { Ingredient } from '@/types';

interface IngredientRowProps {
  ingredient: Ingredient;
  originalAmount?: number; // For scaled variant
  variant: 'original' | 'scaled';
  isAnchor?: boolean; // For scaled variant - highlight anchor ingredient
  style?: ViewStyle;
  testID?: string;
}

/**
 * Ingredient row component with two variants according to STYLEGUIDE.md §6.2 and §6.3
 * 
 * variant="original" (STYLEGUIDE.md §6.2):
 * - Ingredient name: typography.bodyLarge, colors.textPrimary, left-aligned
 * - Amount + unit: typography.monoMedium, colors.textPrimary, right-aligned
 * - Divider: 1pt line, colors.border
 * 
 * variant="scaled" (STYLEGUIDE.md §6.3):
 * - Original amount: typography.bodySmall, colors.textSecondary, with strikethrough style
 * - Arrow icon: colors.textDisabled
 * - Scaled amount: typography.monoLarge, colors.accent, on colors.accentLight pill background
 * - The anchor ingredient row has a pin icon and its scaled amount is colors.primary instead of accent
 */
export const IngredientRow: React.FC<IngredientRowProps> = ({
  ingredient,
  originalAmount,
  variant,
  isAnchor = false,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2).replace(/\.?0+$/, '')} ${ingredient.unit}`;
  };

  if (variant === 'original') {
    return (
      <View style={[styles.originalContainer, style]} testID={testID}>
        <Text
          style={[
            typography.bodyLarge,
            styles.name,
            { color: colors.textPrimary }
          ]}
        >
          {ingredient.name}
        </Text>
        <Text
          style={[
            typography.monoMedium,
            styles.amount,
            { color: colors.textPrimary }
          ]}
        >
          {formatAmount(ingredient.amount)}
        </Text>
      </View>
    );
  }

  // variant === 'scaled'
  const scaledColor = isAnchor ? colors.primary : colors.accent;
  const scaledBgColor = isAnchor ? colors.primaryLight : colors.accentLight;

  return (
    <View style={[styles.scaledContainer, style]} testID={testID}>
      <View style={styles.ingredientInfo}>
        <View style={styles.nameRow}>
          {isAnchor && (
            <MaterialCommunityIcons 
              name="pin-outline" 
              size={16} 
              color={scaledColor}
              style={styles.pinIcon}
            />
          )}
          <Text
            style={[
              typography.bodyLarge,
              styles.scaledName,
              { color: colors.textPrimary }
            ]}
          >
            {ingredient.name}
          </Text>
        </View>
        
        <View style={styles.amountRow}>
          <Text
            style={[
              typography.bodySmall,
              styles.originalAmount,
              { color: colors.textSecondary }
            ]}
          >
            {originalAmount ? formatAmount(originalAmount) : formatAmount(ingredient.amount)}
          </Text>
          
          <MaterialCommunityIcons 
            name="arrow-right" 
            size={16} 
            color={colors.textDisabled}
            style={styles.arrowIcon}
          />
          
          <View style={[styles.scaledAmountPill, { backgroundColor: scaledBgColor }]}>
            <Text
              style={[
                typography.monoLarge,
                styles.scaledAmount,
                { color: scaledColor }
              ]}
            >
              {formatAmount(ingredient.amount)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Original variant styles (STYLEGUIDE.md §6.2)
  originalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  name: {
    flex: 1,
    marginRight: spacing.md,
  },
  amount: {
    minWidth: 80,
    textAlign: 'right',
  },

  // Scaled variant styles (STYLEGUIDE.md §6.3)
  scaledContainer: {
    paddingVertical: spacing.sm,
  },
  ingredientInfo: {
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pinIcon: {
    marginLeft: -2, // Adjust alignment
  },
  scaledName: {
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.sm,
  },
  originalAmount: {
    textDecorationLine: 'line-through',
    minWidth: 80,
  },
  arrowIcon: {
    marginHorizontal: spacing.xs,
  },
  scaledAmountPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12, // Similar to radius.md
    alignSelf: 'flex-start',
  },
  scaledAmount: {
    fontSize: 22,
    lineHeight: 28,
  },
});

export default IngredientRow;
