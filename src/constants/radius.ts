export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 9999,  // Pills / badges
} as const;

export type RadiusTokens = typeof radius;
