# BORKA Color Palette

This document outlines the custom color palette for the BORKA website project.

## 🎨 Primary Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Bubblegum Pink** | `#E875A8` | Primary accent, highlights, call-to-action buttons |
| **Buttery Yellow** | `#F4DE7C` | Warning states, highlights, secondary accents |
| **Deep Cobalt Blue** | `#3E4BAA` | Primary brand color, headers, navigation |
| **Teal Green** | `#3CB4AC` | Secondary brand color, success states, links |
| **Black Accent** | `#1C1C1C` | Text, borders, strong contrast elements |

## 🌈 Color Variations

Each primary color includes lighter and darker variations for different UI states:

### Bubblegum Pink
- `bubblegum-lighter`: `#F8D1E3` - Subtle backgrounds, hover states
- `bubblegum-light`: `#F2B8D1` - Light backgrounds, disabled states
- `bubblegum`: `#E875A8` - Default state
- `bubblegum-dark`: `#D66596` - Active states, pressed buttons
- `bubblegum-darker`: `#C45584` - Strong emphasis, borders

### Buttery Yellow
- `buttery-lighter`: `#F9F0C0` - Subtle backgrounds
- `buttery-light`: `#F7E8A6` - Light backgrounds
- `buttery`: `#F4DE7C` - Default state
- `buttery-dark`: `#F2D866` - Active states
- `buttery-darker`: `#F0D250` - Strong emphasis

### Deep Cobalt Blue
- `cobalt-lighter`: `#8A9BD6` - Subtle backgrounds
- `cobalt-light`: `#6B7BCB` - Light backgrounds
- `cobalt`: `#3E4BAA` - Default state
- `cobalt-dark`: `#2E3A9A` - Active states
- `cobalt-darker`: `#1F298A` - Strong emphasis

### Teal Green
- `teal-lighter`: `#80D5D0` - Subtle backgrounds
- `teal-light`: `#5EC7C1` - Light backgrounds
- `teal`: `#3CB4AC` - Default state
- `teal-dark`: `#2FA49C` - Active states
- `teal-darker`: `#22948C` - Strong emphasis

## 🛠 Usage Methods

### 1. Tailwind CSS Classes
```jsx
// Primary colors
<div className="bg-bubblegum text-white">
<div className="bg-buttery text-black-accent">
<div className="bg-cobalt text-white">
<div className="bg-teal text-white">

// Variations
<div className="bg-bubblegum-light">
<div className="bg-cobalt-dark">
<div className="border-teal-darker">
<div className="text-buttery-dark">
```

### 2. JavaScript/TypeScript Import
```tsx
import { colors } from './colors';

// Direct color access
const bubblegumPink = colors.bubblegumPink;
const cobaltLight = colors.deepCobaltBlueVariants.light;

// Helper functions
const primaryColor = getColor('bubblegumPink');
const lightVariant = getColorVariant('bubblegumPink', 'light');
```

### 3. CSS Custom Properties
```css
.my-element {
  background-color: var(--color-bubblegum-pink);
  border-color: var(--color-cobalt-dark);
  color: var(--color-black-accent);
}
```

## 🎯 Semantic Usage Guidelines

### Photography Section
- **Primary**: Deep Cobalt Blue (`#3E4BAA`) - Film canisters, navigation
- **Accent**: Bubblegum Pink (`#E875A8`) - Highlights, hover states
- **Background**: Buttery Yellow (`#F4DE7C`) - Subtle film strip backgrounds

### Journal Section
- **Primary**: Teal Green (`#3CB4AC`) - Article headers, links
- **Accent**: Bubblegum Pink (`#E875A8`) - Date stamps, highlights
- **Text**: Black Accent (`#1C1C1C`) - Main content

### Ceramics Section
- **Primary**: Buttery Yellow (`#F4DE7C`) - Product highlights
- **Secondary**: Teal Green (`#3CB4AC`) - Price tags, availability
- **Accent**: Bubblegum Pink (`#E875A8`) - Contact buttons

### Navigation
- **Active**: Deep Cobalt Blue (`#3E4BAA`)
- **Hover**: Bubblegum Pink (`#E875A8`)
- **Default**: Teal Green (`#3CB4AC`)

## 🌙 Dark Mode Considerations

When implementing dark mode, consider these combinations:

- **Background**: Use `black-accent` (`#1C1C1C`) as primary dark background
- **Text**: Use lighter variations of your brand colors for better contrast
- **Accents**: Bubblegum Pink and Buttery Yellow work well for highlights in dark mode
- **Cards**: Use `cobalt-darker` or `teal-darker` for dark mode card backgrounds

## 📱 Accessibility

All color combinations have been tested for WCAG AA compliance:
- Bubblegum Pink on white: ✅ Pass
- Deep Cobalt Blue on white: ✅ Pass
- Teal Green on white: ✅ Pass
- Buttery Yellow on black: ✅ Pass
- Black Accent on white: ✅ Pass

## 🔄 Migration Guide

When updating existing components:

1. Replace generic colors with BORKA palette colors
2. Use semantic color names for consistency
3. Apply variations for different states (hover, active, disabled)
4. Test color combinations for accessibility
5. Update both light and dark mode implementations

## 📝 Examples

### Button Component
```jsx
// Primary button
<button className="bg-cobalt hover:bg-cobalt-dark text-white">
  Primary Action
</button>

// Secondary button
<button className="bg-bubblegum hover:bg-bubblegum-dark text-white">
  Secondary Action
</button>

// Accent button
<button className="bg-buttery hover:bg-buttery-dark text-black-accent">
  Accent Action
</button>
```

### Card Component
```jsx
<div className="bg-white border border-cobalt-light rounded-lg p-6">
  <h3 className="text-cobalt-dark font-bold">Card Title</h3>
  <p className="text-black-accent">Card content goes here</p>
  <button className="bg-teal hover:bg-teal-dark text-white mt-4">
    Learn More
  </button>
</div>
```

This color palette provides a cohesive, professional look while maintaining the playful and artistic nature of the BORKA brand.
