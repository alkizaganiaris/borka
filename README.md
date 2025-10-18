# Film Roll Gallery - React Component

A beautiful, animated film roll gallery component for React with a vintage aesthetic. Features horizontal scrolling film frames, a preview stack, and smooth animations powered by Framer Motion.

## Features

- 🎞️ **Film Roll Animation**: Smooth roll-out/roll-in animation triggered by clicking the canister
- 📸 **Photo Preview Stack**: Selected images stack with randomized rotation and position
- 🖱️ **Interactive Frames**: Hover to "light up" frames, click to add to preview
- ⌨️ **Keyboard Support**: Press ESC to close the reel
- 📱 **Responsive Design**: Works across different screen sizes
- ♻️ **Reusable Component**: Easy to create multiple gallery instances

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```tsx
import { FilmRollGallery } from './components/FilmRollGallery';

const images = [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg",
  // ... more images
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
```

### Multiple Instances

```tsx
function App() {
  const gallery1Images = [...];
  const gallery2Images = [...];

  return (
    <div>
      <FilmRollGallery 
        images={gallery1Images}
        title="Collection 1"
        showTitle={true}
      />
      
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

## Component Props

### FilmRollGallery

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `string[]` | **Required** | Array of image URLs to display in the gallery |
| `title` | `string` | `"Inspiration"` | Gallery title displayed at the top |
| `showTitle` | `boolean` | `true` | Whether to show the title |
| `className` | `string` | `""` | Additional CSS classes for the container |

## Project Structure

```
camera_roll_figma/
├── components/
│   ├── FilmRollGallery.tsx    # Main reusable component
│   ├── FilmFrame.tsx           # Individual film frame component
│   └── figma/
│       └── ImageWithFallback.tsx
├── styles/
│   └── globals.css             # Global styles and Tailwind config
├── src/
│   └── main.tsx                # React entry point
├── App.tsx                     # Demo/Example usage
├── index.html
└── package.json
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Interactions

- **Click Canister**: Toggle film roll in/out
- **Click Frame**: Select image and add to preview stack
- **Hover Frame**: Highlight/light up the frame
- **Hover Top Preview**: Enlarge the top image in the stack
- **Scroll Reel**: Browse through all images horizontally
- **Press ESC**: Close the reel and clear the stack

## License

MIT

## Credits

Images from [Unsplash](https://unsplash.com)

