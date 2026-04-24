import React from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  ViewStyle,
  Animated,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/typography';
import { radius } from '@/constants/radius';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Primary button component according to STYLEGUIDE.md §6.4
 * - Full-width call to action
 * - Background: colors.primary
 * - Text: typography.headingMedium, white
 * - Height: 52pt
 * - Border radius: radius.md
 * - Pressed state: colors.primaryDark background + scale(0.97) animation
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled = false,
  style,
  testID,
}) => {
  const { colors } = useTheme();
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
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

  const buttonStyle = [
    styles.button,
    {
      backgroundColor: disabled ? colors.textDisabled : colors.primary,
    },
    style,
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Pressable
        style={buttonStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        testID={testID}
      >
        <Text
          style={[
            typography.headingMedium,
            styles.text,
            {
              color: disabled ? colors.textPrimary : 'white',
            },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    textAlign: 'center',
  },
});

export default PrimaryButton;
