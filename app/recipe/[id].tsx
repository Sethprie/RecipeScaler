import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Alert,
  Text 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useRecipeStore } from '@/store/useRecipeStore';
import { useTranslation } from 'react-i18next';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { IngredientRow } from '@/components/IngredientRow';
import { TagChip } from '@/components/TagChip';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AdBanner } from '@/components/ads/AdBanner';

export default function RecipeDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const getRecipeById = useRecipeStore((state) => state.getRecipeById);
  const insets = useSafeAreaInsets();
  
  const recipe = getRecipeById(id);

  const handleScale = () => {
    router.push(`/recipe/${id}/scale`);
  };

  const handleEdit = () => {
    // TODO: Navigate to edit screen (reuse Create logic)
    Alert.alert('Editar', 'Función de edición próximamente');
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
        {/* Recipe Name */}
        <Text style={[typography.displayLarge, { color: colors.textPrimary }]}>
          {recipe.name}
        </Text>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {recipe.tags.map((tag, index) => (
              <TagChip
                key={index}
                label={tag}
                style={styles.tag}
              />
            ))}
          </View>
        )}

        {/* Ad Banner */}
        <AdBanner testID="recipe-detail-ad-banner" />

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={[typography.headingLarge, { color: colors.textPrimary }]}>
            {t('recipe.ingredients')}
          </Text>
          <View style={styles.ingredientsList}>
            {recipe.ingredients.map((ingredient) => (
              <IngredientRow
                key={ingredient.id}
                ingredient={ingredient}
                variant="original"
                style={styles.ingredientRow}
              />
            ))}
          </View>
        </View>

        {/* Preparation Section */}
        <View style={styles.section}>
          <Text style={[typography.headingLarge, { color: colors.textPrimary }]}>
            {t('recipe.preparation')}
          </Text>
          <Text style={[typography.bodyLarge, { color: colors.textSecondary }]}>
            {recipe.description}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <PrimaryButton
            label={t('recipe.scale')}
            onPress={handleScale}
            style={styles.actionButton}
            testID="scale-button"
          />
          <PrimaryButton
            label={t('recipe.edit')}
            onPress={handleEdit}
            style={styles.actionButton}
            testID="edit-button"
          />
        </View>
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  tag: {
    marginBottom: 0,
  },
  section: {
    marginTop: spacing.xl,
  },
  ingredientsList: {
    marginTop: spacing.md,
  },
  ingredientRow: {
    marginBottom: spacing.sm,
  },
  actionButtons: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  actionButton: {
    marginBottom: 0,
  },
});
