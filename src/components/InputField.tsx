import React from 'react';
import { 
  TextInput, 
  View, 
  Text, 
  StyleSheet, 
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  testID?: string;
}

/**
 * Input field component according to STYLEGUIDE.md §6.6
 * - Background: colors.surface
 * - Border: 1pt, colors.border (changes to colors.primary on focus)
 * - Border radius: radius.sm
 * - Padding: spacing.md
 * - Typography: typography.bodyLarge, colors.textPrimary
 * - Error state: borderColor: colors.error + error message below
 */
export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  containerStyle,
  testID,
  style,
  ...textInputProps
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.surface,
      borderColor: error 
        ? colors.error 
        : isFocused 
          ? colors.primary 
          : colors.border,
      color: colors.textPrimary,
    },
    style,
  ];

  const containerStyles = [
    styles.container,
    containerStyle,
  ];

  return (
    <View style={containerStyles} testID={testID}>
      {label && (
        <Text
          style={[
            typography.labelSmall,
            styles.label,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={inputStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={colors.textDisabled}
        {...textInputProps}
      />
      {error && (
        <Text
          style={[
            typography.bodySmall,
            styles.errorText,
            {
              color: colors.error,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: 16,
    minHeight: 44, // Minimum touch target size
  },
  errorText: {
    marginTop: spacing.xs,
  },
});

export default InputField;
