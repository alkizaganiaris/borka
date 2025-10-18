# Quick Start Guide

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React 18
- Framer Motion
- Tailwind CSS
- TypeScript
- Vite

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Using the Component

### Basic Example

```tsx
import { FilmRollGallery } from './components/FilmRollGallery';

const images = [
  "https://your-image-url-1.jpg",
  "https://your-image-url-2.jpg",
  "https://your-image-url-3.jpg",
];

function App() {
  return (
    <FilmRollGallery 
      images={images}
      title="My Gallery"
      showTitle={true}
    />
  );
}

export default App;
```

### Create Multiple Galleries

Edit `App.tsx`:

```tsx
import { FilmRollGallery } from "./components/FilmRollGallery";

const gallery1Images = ["url1.jpg", "url2.jpg"];
const gallery2Images = ["url3.jpg", "url4.jpg"];

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* First Gallery */}
      <FilmRollGallery 
        images={gallery1Images} 
        title="Collection 1"
        showTitle={true}
      />

      {/* Second Gallery - with spacing */}
      <div className="mt-32">
        <FilmRollGallery 
          images={gallery2Images} 
          title="Collection 2"
          showTitle={true}
        />
      </div>
    </div>
  );
}
```

## Project Structure

```
camera_roll_figma/
├── components/
│   ├── FilmRollGallery.tsx    ← Main reusable component
│   ├── FilmFrame.tsx           ← Film frame component
│   └── index.ts                ← Exports for easy imports
├── App.tsx                     ← Your app/demo
├── src/
│   └── main.tsx                ← Entry point
├── styles/
│   └── globals.css             ← Global styles
└── index.html                  ← HTML template
```

## Customizing Images

Replace the `galleryImages` array in `App.tsx` with your own image URLs:

```tsx
const galleryImages = [
  "https://your-cdn.com/image1.jpg",
  "https://your-cdn.com/image2.jpg",
  // ... add more
];
```

**Image Recommendations:**
- Format: JPG or PNG
- Recommended size: 1920x1080px or similar aspect ratio
- Use a CDN for better performance
- Optimize images before adding (compress, resize)

## How It Works

1. **Click the film canister** on the left to roll out the film
2. **Click any film frame** to add it to the preview stack above
3. **Hover over frames** to "light them up"
4. **Hover over the top preview image** to enlarge it
5. **Press ESC** to close the film roll
6. **Scroll horizontally** to browse all frames

## Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `images` | `string[]` | Yes | - | Array of image URLs |
| `title` | `string` | No | `"Inspiration"` | Gallery title |
| `showTitle` | `boolean` | No | `true` | Show/hide title |
| `className` | `string` | No | `""` | Custom CSS classes |

## Troubleshooting

### Images not loading?
- Check that URLs are accessible
- Verify CORS settings if using external URLs
- Check browser console for errors

### Film roll not animating?
- Ensure Framer Motion is installed: `npm install motion`
- Check browser console for errors

### TypeScript errors?
- Run `npm install` to ensure all types are installed
- Restart your TypeScript server

### Build errors?
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

## Next Steps

1. ✅ Replace demo images with your own
2. ✅ Customize the title and styling
3. ✅ Add more gallery instances if needed
4. ✅ Deploy to your hosting platform (Vercel, Netlify, etc.)

## Deployment

### Deploy to Vercel

```bash
npm run build
npx vercel --prod
```

### Deploy to Netlify

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

## Resources

- [Full Documentation](./README.md)
- [Usage Examples](./USAGE_EXAMPLES.md)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

## Need Help?

- Check the `USAGE_EXAMPLES.md` for more examples
- Read the full `README.md` for detailed documentation
- Review the source code in `components/FilmRollGallery.tsx`

