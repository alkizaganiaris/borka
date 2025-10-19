# Custom Fonts

Drop your custom font files here (`.ttf`, `.woff`, `.woff2`, `.otf`).

## How to Use Your Custom Font:

### 1. Add Your Font File
Drop your font file (e.g., `MyFont.ttf`) into this folder.

### 2. Define the Font Face
Edit `/styles/fonts.css` and add:

```css
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/MyFont.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### 3. Import the CSS
In your component or `App.tsx`, add:

```typescript
import '../styles/fonts.css';
```

### 4. Use the Font
In your component:

```typescript
<div style={{ fontFamily: 'MyFont' }}>
  Your text here
</div>
```

Or in Tailwind (add to `tailwind.config.js` first):

```javascript
extend: {
  fontFamily: {
    'custom': ['MyFont', 'sans-serif'],
  }
}
```

Then use: `className="font-custom"`

## Supported Formats:
- `.ttf` (TrueType Font) - `format('truetype')`
- `.otf` (OpenType Font) - `format('opentype')`
- `.woff` (Web Open Font Format) - `format('woff')`
- `.woff2` (Web Open Font Format 2) - `format('woff2')` - **Most efficient**

## Note:
`.woff2` is the most modern and efficient format. If you have a `.ttf`, consider converting it to `.woff2` for better performance.

