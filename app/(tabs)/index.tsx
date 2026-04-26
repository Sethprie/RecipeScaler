import React, { useState, useMemo } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useRecipeStore } from '@/store/useRecipeStore';
import { useTranslation } from 'react-i18next';
import { Recipe } from '@/types';
import { RecipeCard } from '@/components/RecipeCard';
import { InputField } from '@/components/InputField';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { AdBanner } from '@/components/ads/AdBanner';
import { spacing } from '@/constants/spacing';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const recipes = useRecipeStore((state) => state.recipes);
  const deleteRecipe = useRecipeStore((state) => state.deleteRecipe);
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  // Filter recipes by name in real-time
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;
    
    const query = searchQuery.toLowerCase();
    return recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(query)
    );
  }, [recipes, searchQuery]);

  const handleRecipePress = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.id}`);
  };

  const handleRecipeDelete = (recipeId: string) => {
    deleteRecipe(recipeId);
  };

  const handleCreateRecipe = () => {
    router.push('/(tabs)/create');
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <RecipeCard
      recipe={item}
      onPress={handleRecipePress}
      onDelete={handleRecipeDelete}
      style={styles.recipeCard}
      testID={`recipe-${item.id}`}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      emoji="🍕"
      title={searchQuery ? t('home.noResults') : t('home.noRecipes')}
      subtitle={searchQuery ? t('home.tryDifferentSearch') : t('home.createFirstRecipe')}
      testID="empty-state"
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <InputField
        placeholder={t('home.searchPlaceholder')}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        testID="search-input"
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={filteredRecipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.listContent,
            { paddingTop: insets.top + spacing.md }
          ]}
          showsVerticalScrollIndicator={false}
          testID="recipe-list"
        />
      
      {/* Ad Banner - positioned above FAB but below content */}
      {filteredRecipes.length > 0 && (
        <View style={styles.adBannerContainer}>
          <AdBanner testID="home-ad-banner" />
        </View>
      )}
      
      {/* FAB */}
      <FAB
        onPress={handleCreateRecipe}
        icon="plus"
        testID="create-recipe-fab"
      />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchInput: {
    marginBottom: 0,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100, // Extra space for FAB and AdBanner
  },
  recipeCard: {
    marginBottom: spacing.sm,
  },
  adBannerContainer: {
    position: 'absolute',
    bottom: 80, // Above FAB
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
