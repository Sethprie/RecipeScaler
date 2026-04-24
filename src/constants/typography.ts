import { TextStyle } from 'react-native';

export const typography = {
  // Display — recipe names, screen titles
  displayLarge: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 32,
    lineHeight: 40,
  } as TextStyle,
  displayMedium: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 24,
    lineHeight: 32,
  } as TextStyle,

  // Headings — section titles
  headingLarge: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 20,
    lineHeight: 28,
  } as TextStyle,
  headingMedium: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,

  // Body — preparation text, descriptions
  bodyLarge: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    lineHeight: 26,
  } as TextStyle,
  bodyMedium: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 22,
  } as TextStyle,
  bodySmall: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    lineHeight: 18,
  } as TextStyle,

  // Mono — ingredient amounts (scaled values)
  monoLarge: {
    fontFamily: 'DMSans-Medium',
    fontSize: 22,
    lineHeight: 28,
  } as TextStyle,
  monoMedium: {
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
    lineHeight: 22,
  } as TextStyle,
  
  // Label — tags, units, badges
  labelMedium: {
    fontFamily: 'DMSans-Medium',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.3,
  } as TextStyle,
  labelSmall: {
    fontFamily: 'DMSans-Medium',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  } as TextStyle,
} as const;

export type TypographyTokens = typeof typography;
