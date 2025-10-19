/**
 * BORKA Color Palette
 * A carefully curated set of colors for the BORKA website
 */

export const colors = {
  // Primary brand colors
  bubblegumPink: '#E875A8',
  butteryYellow: '#F4DE7C', 
  deepCobaltBlue: '#3E4BAA',
  tealGreen: '#3CB4AC',
  blackAccent: '#1C1C1C',
  
  // Color variations for different states
  bubblegumPinkVariants: {
    light: '#F2B8D1',
    lighter: '#F8D1E3',
    dark: '#D66596',
    darker: '#C45584'
  },
  
  butteryYellowVariants: {
    light: '#F7E8A6',
    lighter: '#F9F0C0',
    dark: '#F2D866',
    darker: '#F0D250'
  },
  
  deepCobaltBlueVariants: {
    light: '#6B7BCB',
    lighter: '#8A9BD6',
    dark: '#2E3A9A',
    darker: '#1F298A'
  },
  
  tealGreenVariants: {
    light: '#5EC7C1',
    lighter: '#80D5D0',
    dark: '#2FA49C',
    darker: '#22948C'
  },
  
  // Neutral colors that complement the palette
  neutrals: {
    white: '#FFFFFF',
    lightGray: '#F8F9FA',
    gray: '#E9ECEF',
    mediumGray: '#ADB5BD',
    darkGray: '#6C757D',
    charcoal: '#495057',
    nearBlack: '#212529',
    trueBlack: '#000000'
  },
  
  // Semantic colors using the palette
  semantic: {
    primary: '#3E4BAA', // deepCobaltBlue
    secondary: '#3CB4AC', // tealGreen
    accent: '#E875A8', // bubblegumPink
    warning: '#F4DE7C', // butteryYellow
    error: '#E875A8', // bubblegumPink (can be customized)
    success: '#3CB4AC', // tealGreen
    info: '#3E4BAA', // deepCobaltBlue
  }
} as const;

// Type definitions for TypeScript
export type ColorKey = keyof typeof colors;
export type BubblegumPinkVariant = keyof typeof colors.bubblegumPinkVariants;
export type ButteryYellowVariant = keyof typeof colors.butteryYellowVariants;
export type DeepCobaltBlueVariant = keyof typeof colors.deepCobaltBlueVariants;
export type TealGreenVariant = keyof typeof colors.tealGreenVariants;
export type NeutralColor = keyof typeof colors.neutrals;
export type SemanticColor = keyof typeof colors.semantic;

// Helper functions
export const getColor = (colorKey: ColorKey): string => colors[colorKey];
export const getColorVariant = (colorKey: ColorKey, variant?: string): string => {
  if (typeof colors[colorKey] === 'object' && variant) {
    return (colors[colorKey] as any)[variant] || colors[colorKey];
  }
  return colors[colorKey] as string;
};

// CSS custom properties for easy integration
export const cssCustomProperties = {
  '--color-bubblegum-pink': colors.bubblegumPink,
  '--color-buttery-yellow': colors.butteryYellow,
  '--color-deep-cobalt-blue': colors.deepCobaltBlue,
  '--color-teal-green': colors.tealGreen,
  '--color-black-accent': colors.blackAccent,
  
  '--color-bubblegum-pink-light': colors.bubblegumPinkVariants.light,
  '--color-bubblegum-pink-dark': colors.bubblegumPinkVariants.dark,
  
  '--color-buttery-yellow-light': colors.butteryYellowVariants.light,
  '--color-buttery-yellow-dark': colors.butteryYellowVariants.dark,
  
  '--color-deep-cobalt-blue-light': colors.deepCobaltBlueVariants.light,
  '--color-deep-cobalt-blue-dark': colors.deepCobaltBlueVariants.dark,
  
  '--color-teal-green-light': colors.tealGreenVariants.light,
  '--color-teal-green-dark': colors.tealGreenVariants.dark,
  
  '--color-primary': colors.semantic.primary,
  '--color-secondary': colors.semantic.secondary,
  '--color-accent': colors.semantic.accent,
  '--color-warning': colors.semantic.warning,
} as const;

// Tailwind CSS color extensions (for when you want to use them in Tailwind)
export const tailwindColors = {
  'bubblegum-pink': colors.bubblegumPink,
  'buttery-yellow': colors.butteryYellow,
  'deep-cobalt-blue': colors.deepCobaltBlue,
  'teal-green': colors.tealGreen,
  'black-accent': colors.blackAccent,
  
  'bubblegum-pink-light': colors.bubblegumPinkVariants.light,
  'bubblegum-pink-dark': colors.bubblegumPinkVariants.dark,
  
  'buttery-yellow-light': colors.butteryYellowVariants.light,
  'buttery-yellow-dark': colors.butteryYellowVariants.dark,
  
  'deep-cobalt-blue-light': colors.deepCobaltBlueVariants.light,
  'deep-cobalt-blue-dark': colors.deepCobaltBlueVariants.dark,
  
  'teal-green-light': colors.tealGreenVariants.light,
  'teal-green-dark': colors.tealGreenVariants.dark,
} as const;

export default colors;
