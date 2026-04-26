import React, { useState, useMemo } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Alert,
  Text,
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useRecipeStore } from '@/store/useRecipeStore';
import { useTranslation } from 'react-i18next';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { Ingredient } from '@/types';
import { IngredientRow } from '@/components/IngredientRow';
import { InputField } from '@/components/InputField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScaleFactorBadge } from '@/components/ScaleFactorBadge';
import { AdBanner } from '@/components/ads/AdBanner';
import { scaleRecipe } from '@/utils/scaleRecipe';

export default function ScaleScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const getRecipeById = useRecipeStore((state) => state.getRecipeById);
  const insets = useSafeAreaInsets();
  
  const [selectedAnchorId, setSelectedAnchorId] = useState<string>('');
  const [anchorAmount, setAnchorAmount] = useState<string>('');
  
  const recipe = getRecipeById(id);

  // Calculate scale factor and scaled ingredients
  const { scaleFactor, scaledIngredients } = useMemo(() => {
    if (!recipe || !selectedAnchorId || !anchorAmount) {
      return { scaleFactor: 1, scaledIngredients: recipe?.ingredients || [] };
    }

    const anchorIngredient = recipe.ingredients.find(ing => ing.id === selectedAnchorId);
    if (!anchorIngredient) {
      return { scaleFactor: 1, scaledIngredients: recipe.ingredients };
    }

    const newAmount = parseFloat(anchorAmount);
    if (isNaN(newAmount) || newAmount <= 0) {
      return { scaleFactor: 1, scaledIngredients: recipe.ingredients };
    }

    const factor = newAmount / anchorIngredient.amount;
    const scaled = scaleRecipe(recipe, selectedAnchorId, newAmount);

    return { scaleFactor: factor, scaledIngredients: scaled };
  }, [recipe, selectedAnchorId, anchorAmount]);

  const handleAnchorSelect = (ingredientId: string) => {
    setSelectedAnchorId(ingredientId);
    // Reset anchor amount when changing anchor
    setAnchorAmount('');
  };

  const handleReset = () => {
    setSelectedAnchorId('');
    setAnchorAmount('');
  };

  const handleAnchorAmountChange = (value: string) => {
    // Only allow numeric input with decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAnchorAmount(value);
    }
  };

  if (!recipe) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Text style={[typography.displayMedium, { color: colors.textPrimary }]}>
            {t('recipe.notFound')}
          </Text>
          <PrimaryButton
            label={t('recipe.goBack')}
            onPress={() => router.back()}
            style={styles.goBackButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.md }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Recipe Name and Ad Banner */}
        <View style={styles.header}>
          <Text style={[typography.headingLarge, { color: colors.textPrimary }]}>
            {t('scale.title', { recipeName: recipe.name })}
          </Text>
          <AdBanner testID="scale-ad-banner" />
        </View>

        {/* Anchor Selection */}
        <View style={styles.section}>
          <Text style={[typography.headingMedium, { color: colors.textPrimary }]}>
            {t('scale.selectAnchor')}
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
            {t('scale.selectAnchorDescription')}
          </Text>
          
          <View style={styles.anchorList}>
            {recipe.ingredients.map((ingredient) => (
              <TouchableOpacity
                key={ingredient.id}
                style={[
                  styles.anchorOption,
                  {
                    backgroundColor: selectedAnchorId === ingredient.id 
                      ? colors.primaryLight 
                      : colors.surface,
                    borderColor: selectedAnchorId === ingredient.id 
                      ? colors.primary 
                      : colors.border,
                  }
                ]}
                onPress={() => handleAnchorSelect(ingredient.id)}
                testID={`anchor-${ingredient.id}`}
              >
                <Text style={[
                  typography.bodyLarge,
                  {
                    color: selectedAnchorId === ingredient.id 
                      ? colors.primary 
                      : colors.textPrimary
                  }
                ]}>
                  {ingredient.name}
                </Text>
                <Text style={[
                  typography.bodySmall,
                  {
                    color: selectedAnchorId === ingredient.id 
                      ? colors.primary 
                      : colors.textSecondary
                  }
                ]}>
                  {ingredient.amount.toFixed(2).replace(/\.?0+$/, '')} {ingredient.unit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Anchor Amount Input */}
        {selectedAnchorId && (
          <View style={styles.section}>
            <Text style={[typography.headingMedium, { color: colors.textPrimary }]}>
              {t('scale.newAmount')}
            </Text>
            <InputField
              value={anchorAmount}
              onChangeText={handleAnchorAmountChange}
              placeholder={t('scale.amountPlaceholder')}
              keyboardType="numeric"
              style={styles.amountInput}
              testID="anchor-amount-input"
            />
          </View>
        )}

        {/* Scale Factor Badge */}
        {scaleFactor !== 1 && (
          <View style={styles.section}>
            <Text style={[typography.headingMedium, { color: colors.textPrimary }]}>
              {t('scale.scaleFactor')}
            </Text>
            <ScaleFactorBadge factor={scaleFactor} />
          </View>
        )}

        {/* Scaled Ingredients */}
        {scaleFactor !== 1 && (
          <View style={styles.section}>
            <Text style={[typography.headingMedium, { color: colors.textPrimary }]}>
              {t('scale.scaledIngredients')}
            </Text>
            <View style={styles.scaledList}>
              {scaledIngredients.map((ingredient, index) => {
                const originalIngredient = recipe.ingredients[index];
                return (
                  <IngredientRow
                    key={ingredient.id}
                    ingredient={ingredient}
                    originalAmount={originalIngredient.amount}
                    variant="scaled"
                    isAnchor={ingredient.id === selectedAnchorId}
                    style={styles.scaledIngredient}
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* Reset Button */}
        {scaleFactor !== 1 && (
          <View style={styles.section}>
            <PrimaryButton
              label={t('scale.reset')}
              onPress={handleReset}
              style={styles.resetButton}
              testID="reset-button"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  goBackButton: {
    marginTop: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  anchorList: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  anchorOption: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
  },
  amountInput: {
    marginTop: spacing.sm,
  },
  scaledList: {
    marginTop: spacing.md,
  },
  scaledIngredient: {
    marginBottom: spacing.sm,
  },
  resetButton: {
    marginTop: spacing.md,
  },
});
