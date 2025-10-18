# FilmRollGallery - Usage Examples

## Example 1: Single Gallery Instance

```tsx
import { FilmRollGallery } from './components/FilmRollGallery';

const myImages = [
  "https://example.com/photo1.jpg",
  "https://example.com/photo2.jpg",
  "https://example.com/photo3.jpg",
];

function MyGallery() {
  return (
    <div>
      <FilmRollGallery 
        images={myImages}
        title="My Photo Collection"
        showTitle={true}
      />
    </div>
  );
}
```

## Example 2: Multiple Gallery Instances

```tsx
import { FilmRollGallery } from './components/FilmRollGallery';

function MultiGalleryPage() {
  const vacationPhotos = [
    "https://example.com/vacation1.jpg",
    "https://example.com/vacation2.jpg",
  ];

  const familyPhotos = [
    "https://example.com/family1.jpg",
    "https://example.com/family2.jpg",
  ];

  const workPhotos = [
    "https://example.com/work1.jpg",
    "https://example.com/work2.jpg",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* First Gallery */}
      <FilmRollGallery 
        images={vacationPhotos}
        title="Vacation Memories"
        showTitle={true}
      />

      {/* Spacing between galleries */}
      <div className="mt-32">
        <FilmRollGallery 
          images={familyPhotos}
          title="Family Photos"
          showTitle={true}
        />
      </div>

      {/* Third gallery */}
      <div className="mt-32">
        <FilmRollGallery 
          images={workPhotos}
          title="Work Portfolio"
          showTitle={true}
        />
      </div>
    </div>
  );
}
```

## Example 3: Without Title

```tsx
import { FilmRollGallery } from './components/FilmRollGallery';

function SimpleGallery() {
  const images = ["image1.jpg", "image2.jpg"];

  return (
    <FilmRollGallery 
      images={images}
      showTitle={false}  // Hide the title
    />
  );
}
```

## Example 4: Custom Styling

```tsx
import { FilmRollGallery } from './components/FilmRollGallery';

function StyledGallery() {
  const images = ["image1.jpg", "image2.jpg"];

  return (
    <div className="bg-gray-100 py-20">
      <FilmRollGallery 
        images={images}
        title="Styled Gallery"
        showTitle={true}
        className="max-w-6xl mx-auto"  // Custom container classes
      />
    </div>
  );
}
```

## Example 5: Dynamic Images from API

```tsx
import { FilmRollGallery } from './components/FilmRollGallery';
import { useEffect, useState } from 'react';

function DynamicGallery() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // Fetch images from your API
    fetch('/api/gallery-images')
      .then(res => res.json())
      .then(data => setImages(data.imageUrls))
      .catch(err => console.error('Failed to load images:', err));
  }, []);

  if (images.length === 0) {
    return <div>Loading gallery...</div>;
  }

  return (
    <FilmRollGallery 
      images={images}
      title="Latest Gallery"
      showTitle={true}
    />
  );
}
```

## Props Reference

### FilmRollGallery Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `images` | `string[]` | ✅ Yes | - | Array of image URLs |
| `title` | `string` | ❌ No | `"Inspiration"` | Gallery title |
| `showTitle` | `boolean` | ❌ No | `true` | Whether to display the title |
| `className` | `string` | ❌ No | `""` | Additional CSS classes |

## Features & Interactions

### User Interactions

1. **Click the film canister** - Toggle the film roll in/out
2. **Click a film frame** - Select the image and add it to the preview stack
3. **Hover over a frame** - Lights up the frame
4. **Hover over the top preview** - Enlarges the top image
5. **Scroll horizontally** - Browse through all film frames
6. **Press ESC** - Close the film roll and clear the preview stack

### Animation Details

- **Roll-out animation**: 1 second duration
- **Preview stack**: Up to 6 photos with randomized rotation (-10° to +10°)
- **Hover effects**: Smooth spring animations
- **Film frame**: Vintage sepia filter with adjustable saturation

## Tips

1. **Image Optimization**: Use appropriately sized images (recommended: 1920x1080) for best performance
2. **Multiple Instances**: Add spacing between instances using `mt-32` or similar Tailwind classes
3. **Background**: The component works best on white or light backgrounds
4. **Accessibility**: The canister button includes `aria-label` for screen readers
5. **Mobile**: The component is responsive but works best on larger screens due to the horizontal scroll nature

## Customization

You can customize the component by:

1. Modifying the `FilmRollGallery.tsx` component directly
2. Passing custom `className` for container styling
3. Adjusting the `title` and `showTitle` props
4. Editing the film frame styling in `FilmFrame.tsx`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires JavaScript enabled
- Requires CSS Grid and Flexbox support

