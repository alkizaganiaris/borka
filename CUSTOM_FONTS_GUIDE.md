# How to Add Your Custom Font (.ttf file)

Follow these 3 simple steps:

## Step 1: Drop Your Font File
📁 Copy your `.ttf` file into the `public/fonts/` folder

Example:
```
public/fonts/MyAwesomeFont.ttf
```

## Step 2: Register the Font
✏️ Open `styles/fonts.css` and add your font:

```css
@font-face {
  font-family: 'MyAwesomeFont';
  src: url('/fonts/MyAwesomeFont.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

**Important:** 
- `font-family` should be a name you choose (can be anything)
- `src` should point to your file in `/fonts/YourFileName.ttf`
- If you have multiple weights, add multiple `@font-face` declarations

## Step 3: Add to Typography Page
📝 Open `pages/Typography.tsx` and uncomment the custom font section (around line 15):

```typescript
{
  name: "My Custom Font",
  family: "MyAwesomeFont",  // Must match the font-family from Step 2
  fallback: "monospace",
  description: "Your custom TTF font",
  webFont: null,
  isCustom: true
},
```

**Note:** Change `"MyAwesomeFont"` to match the `font-family` name you used in Step 2.

## That's it! 🎉

Your custom font will now appear in the Typography page alongside all the Google Fonts.

## Using Your Font Elsewhere

To use your custom font in other components:

```typescript
<div style={{ fontFamily: 'MyAwesomeFont, monospace' }}>
  Your text here
</div>
```

Or add it to Tailwind config:

```javascript
// tailwind.config.js
extend: {
  fontFamily: {
    'custom': ['MyAwesomeFont', 'monospace'],
  }
}
```

Then use: `className="font-custom"`

## Troubleshooting

**Font not showing up?**
1. Check the browser console (F12) for 404 errors on the font file
2. Make sure the path is `/fonts/YourFileName.ttf` (not `public/fonts/...`)
3. Clear your browser cache and refresh
4. Check that the font-family name in CSS matches the one in Typography.tsx

