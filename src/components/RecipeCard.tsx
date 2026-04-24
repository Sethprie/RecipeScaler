import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { Recipe } from '@/types';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: (recipe: Recipe) => void;
  onDelete: (recipeId: string) => void;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Recipe card component according to STYLEGUIDE.md §6.1
 * Displayed in the home screen's FlatList
 * - Background: colors.surface
 * - Recipe name: typography.headingLarge, colors.textPrimary
 * - Metadata line: typography.bodySmall, colors.textSecondary
 * - Tags: typography.labelSmall, colors.primary text on colors.primaryLight background
 * - Tap the whole card to go to recipe detail
 * - Swipe left on the card to reveal a Delete action (red, trash icon)
 */
export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onPress,
  onDelete,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  const handleDelete = () => {
    Alert.alert(
      'Eliminar receta',
      `¿Estás seguro de que querés eliminar "${recipe.name}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(recipe.id),
        },
      ]
    );
  };

  const formatMetadata = () => {
    const ingredientCount = recipe.ingredients.length;
    const lastUpdated = new Date(recipe.updatedAt);
    const now = new Date();
    const daysAgo = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
    
    let timeAgo = 'hoy';
    if (daysAgo === 1) timeAgo = 'ayer';
    else if (daysAgo > 1) timeAgo = `hace ${daysAgo} días`;
    
    return `${ingredientCount} ingredientes · Actualizado ${timeAgo}`;
  };

  const renderTags = () => {
    if (recipe.tags.length === 0) return null;

    const displayTags = recipe.tags.slice(0, 3);
    const remainingCount = recipe.tags.length - 3;

    return (
      <View style={styles.tagsContainer}>
        {displayTags.map((tag, index) => (
          <View key={index} style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.tagText, { color: colors.primary }]}>
              {tag}
            </Text>
          </View>
        ))}
        {remainingCount > 0 && (
          <View style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.tagText, { color: colors.primary }]}>
              +{remainingCount}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    style,
  ];

  return (
    <View style={cardStyle} testID={testID}>
      <TouchableOpacity 
        style={styles.cardContent}
        onPress={() => onPress(recipe)}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <Text
            style={[
              typography.headingLarge,
              styles.title,
              { color: colors.textPrimary }
            ]}
            numberOfLines={1}
          >
            {recipe.name}
          </Text>
          {renderTags()}
        </View>
        <Text
          style={[
            typography.bodySmall,
            styles.metadata,
            { color: colors.textSecondary }
          ]}
        >
          {formatMetadata()}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: '#D94040' }]}
        onPress={handleDelete}
        testID={`${testID}-delete`}
      >
        <MaterialCommunityIcons name="trash-can-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    marginVertical: spacing.xs,
    overflow: 'hidden',
  },
  cardContent: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  title: {
    flex: 1,
    marginRight: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    maxWidth: 180, // Limit tag container width
  },
  tag: {
    borderRadius: 9999, // radius.full
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  metadata: {
    marginTop: spacing.xs,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecipeCard;
