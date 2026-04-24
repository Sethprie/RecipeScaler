import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

interface TagChipProps {
  label: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Tag chip component according to STYLEGUIDE.md §6.7
 * - Background: colors.primaryLight
 * - Text: colors.primary, typography.labelSmall
 * - Border radius: radius.full
 * - Padding: 4pt vertical, 10pt horizontal
 */
export const TagChip: React.FC<TagChipProps> = ({
  label,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  const chipStyle = [
    styles.chip,
    {
      backgroundColor: colors.primaryLight,
    },
    style,
  ];

  return (
    <View style={chipStyle} testID={testID}>
      <Text
        style={[
          typography.labelSmall,
          styles.text,
          {
            color: colors.primary,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999, // radius.full
    alignSelf: 'flex-start',
  },
  text: {
    textAlign: 'center',
  },
});

export default TagChip;
