import React from 'react';
import { 
  Pressable, 
  Animated, 
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/constants/spacing';

interface FABProps {
  onPress: () => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Floating Action Button component according to STYLEGUIDE.md §6.5
 * - Position: bottom-right, 16pt from edges
 * - Size: 56pt × 56pt
 * - Shape: circle (radius.full)
 * - Background: colors.primary
 * - Icon: white, 24pt
 * - Shadow: elevation 8, colors.border shadow
 * - Pressed state: scale(0.95) animation
 */
export const FAB: React.FC<FABProps> = ({
  onPress,
  icon = 'plus',
  style,
  testID,
}) => {
  const { colors } = useTheme();
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const fabStyle = [
    styles.fab,
    {
      backgroundColor: colors.primary,
      shadowColor: colors.border,
    },
    style,
  ];

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <Pressable
        style={fabStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        testID={testID}
      >
        <MaterialCommunityIcons 
          name={icon} 
          size={24} 
          color="white" 
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    elevation: 8,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28, // Perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default FAB;
