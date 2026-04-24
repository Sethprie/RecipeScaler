import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text 
} from 'react-native';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useRecipeStore } from '@/store/useRecipeStore';
import { useTranslation } from 'react-i18next';
import { generateId } from '@/utils/uuid';
import { InputField } from '@/components/InputField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TagChip } from '@/components/TagChip';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { Ingredient } from '@/types';

interface CreateRecipeFormData {
  name: string;
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
  }>;
  preparation: string;
  tags: string;
}

const DEFAULT_UNITS = ['g', 'kg', 'ml', 'l', 'cdta', 'cucharada', 'taza', 'unidad', 'pieza'];

export default function CreateScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const addRecipe = useRecipeStore((state) => state.addRecipe);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateRecipeFormData>({
    defaultValues: {
      name: '',
      ingredients: [{ name: '', amount: '', unit: 'g' }],
      preparation: '',
      tags: '',
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const onSubmit = async (data: CreateRecipeFormData) => {
    try {
      setIsSubmitting(true);

      // Parse and validate ingredients
      const ingredients: Ingredient[] = data.ingredients
        .filter(ing => ing.name.trim() && ing.amount.trim())
        .map(ing => ({
          id: generateId(),
          name: ing.name.trim(),
          amount: parseFloat(ing.amount),
          unit: ing.unit.trim() || 'unidad',
        }));

      if (ingredients.length === 0) {
        Alert.alert(t('create.error'), t('create.atLeastOneIngredient'));
        return;
      }

      // Parse tags
      const tags = data.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Create recipe object
      const recipe = {
        id: generateId(),
        name: data.name.trim(),
        description: data.preparation.trim(),
        ingredients,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to store
      addRecipe(recipe);

      // Navigate back to home
      router.replace('/(tabs)/');
      
      // Reset form
      reset();
      
    } catch (error) {
      console.error('Failed to create recipe:', error);
      Alert.alert(t('create.error'), t('create.saveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const addIngredient = () => {
    append({ name: '', amount: '', unit: 'g' });
  };

  const removeIngredient = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Recipe Name */}
        <Controller
          control={control}
          name="name"
          rules={{
            required: t('create.nameRequired'),
            minLength: {
              value: 3,
              message: t('create.nameMinLength'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label={t('create.recipeName')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              placeholder={t('create.recipeNamePlaceholder')}
              style={styles.field}
              testID="recipe-name-input"
            />
          )}
        />

        {/* Ingredients Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[typography.headingMedium, { color: colors.textPrimary }]}>
              {t('create.ingredients')}
            </Text>
            <PrimaryButton
              label={t('create.addIngredient')}
              onPress={addIngredient}
              style={styles.addButton}
              testID="add-ingredient-button"
            />
          </View>

          {fields.map((field, index) => (
            <View key={field.id} style={styles.ingredientRow}>
              <View style={styles.ingredientFields}>
                <Controller
                  control={control}
                  name={`ingredients.${index}.name`}
                  rules={{
                    required: t('create.ingredientNameRequired'),
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      placeholder={t('create.ingredientNamePlaceholder')}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.ingredients?.[index]?.name?.message}
                      style={styles.ingredientName}
                      testID={`ingredient-name-${index}`}
                    />
                  )}
                />

                <View style={styles.amountRow}>
                  <Controller
                    control={control}
                    name={`ingredients.${index}.amount`}
                    rules={{
                      required: t('create.amountRequired'),
                      pattern: {
                        value: /^\d*\.?\d*$/,
                        message: t('create.validAmount'),
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputField
                        placeholder={t('create.amountPlaceholder')}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.ingredients?.[index]?.amount?.message}
                        style={styles.amountField}
                        keyboardType="numeric"
                        testID={`ingredient-amount-${index}`}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name={`ingredients.${index}.unit`}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        value={value}
                        onChangeText={onChange}
                        style={styles.unitField}
                        testID={`ingredient-unit-${index}`}
                      />
                    )}
                  />
                </View>
              </View>

              {fields.length > 1 && (
                <PrimaryButton
                  label={t('create.remove')}
                  onPress={() => removeIngredient(index)}
                  style={styles.removeButton}
                  testID={`remove-ingredient-${index}`}
                />
              )}
            </View>
          ))}
        </View>

        {/* Preparation */}
        <Controller
          control={control}
          name="preparation"
          rules={{
            required: t('create.preparationRequired'),
            minLength: {
              value: 10,
              message: t('create.preparationMinLength'),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label={t('create.preparation')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.preparation?.message}
              placeholder={t('create.preparationPlaceholder')}
              multiline
              numberOfLines={4}
              style={styles.field}
              testID="preparation-input"
            />
          )}
        />

        {/* Tags */}
        <Controller
          control={control}
          name="tags"
          render={({ field: { onChange, value } }) => (
            <InputField
              label={t('create.tags')}
              value={value}
              onChangeText={onChange}
              placeholder={t('create.tagsPlaceholder')}
              style={styles.field}
              testID="tags-input"
            />
          )}
        />

        {/* Save Button */}
        <PrimaryButton
          label={isSubmitting ? t('create.saving') : t('create.saveRecipe')}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || isSubmitting}
          style={styles.saveButton}
          testID="save-recipe-button"
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  field: {
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addButton: {
    width: 120,
  },
  ingredientRow: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderRadius: 8,
  },
  ingredientFields: {
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ingredientName: {
    marginBottom: spacing.sm,
  },
  amountField: {
    flex: 2,
  },
  unitField: {
    flex: 1,
  },
  removeButton: {
    marginTop: spacing.sm,
    width: 80,
  },
  saveButton: {
    marginTop: spacing.xl,
  },
});
