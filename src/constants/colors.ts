export const lightColors = {
  // Backgrounds
  background: '#FAF8F5',   // Warm off-white (like parchment)
  surface: '#FFFFFF',      // Card / input background
  surfaceAlt: '#F0EDE8',  // Subtle secondary surface (tag backgrounds, dividers)

  // Brand
  primary: '#C84B2F',      // Warm brick red — the "fire" of cooking
  primaryLight: '#F2D5CF', // Tint for backgrounds behind primary elements
  primaryDark: '#9E3520',  // Pressed / active state

  // Text
  textPrimary: '#1C1916',  // Near-black, warm undertone
  textSecondary: '#6B6560', // Subdued labels
  textDisabled: '#B8B3AE', // Placeholder text

  // Utility
  border: '#E2DDD8',       // Subtle dividers
  error: '#D94040',        // Validation errors
  success: '#3D8C5E',      // Confirmation states
  
  // Accent (for scaled values — visually distinguished from originals)
  accent: '#2C6E8A',       // Steel blue — cold contrast to the warm primary
  accentLight: '#D0E8F0',  // Tint behind scaled amounts
} as const;

export const darkColors = {
  background: '#1A1714',
  surface: '#252220',
  surfaceAlt: '#302C2A',

  primary: '#E05C3E',
  primaryLight: '#4A1F16',
  primaryDark: '#C84B2F',

  textPrimary: '#F0EDE8',
  textSecondary: '#A09891',
  textDisabled: '#5A5450',

  border: '#3A3530',
  error: '#E05555',
  success: '#52AD7A',

  accent: '#4A9AB8',
  accentLight: '#1A3A48',
} as const;

export type ColorScheme = typeof lightColors;
export type Colors = typeof lightColors | typeof darkColors;
