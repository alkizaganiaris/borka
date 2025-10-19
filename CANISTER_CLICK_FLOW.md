# What Happens When You Click a Canister

## Step-by-Step Breakdown

### 1. **Click Event** (`FilmRollGallery.tsx` line ~270-288)
```tsx
<motion.div
  onClick={() => {
    const next = !rolledOut;
    if (!next) {
      // Closing: reset scroll and clear preview stack
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      }
      setStack([]);
    }
    toggleRolledOut(next);
  }}
>
```

**What happens:**
- Gets the opposite of current state: `next = !rolledOut`
- **If CLOSING** (`next = false`):
  - Resets horizontal scroll back to start
  - Clears the preview stack (removes all photos)
- Calls `toggleRolledOut(next)` to change state

---

### 2. **State Update** (`FilmRollGallery.tsx` line 139-145)
```tsx
const toggleRolledOut = (newState: boolean) => {
  if (onToggle) {
    onToggle(newState);  // Call parent's handler
  } else {
    setInternalRolledOut(newState);  // Use local state
  }
};
```

**What happens:**
- If there's a parent handler (`onToggle` from App.tsx), call it
- This propagates up to `App.tsx` which updates `openGalleryId`
- **CRITICAL**: This state change triggers re-renders across the component tree

---

### 3. **App.tsx Updates** (`App.tsx` line 34-44)
```tsx
const handleGalleryToggle = (id: string, showBubbleVideo: boolean = true) => (isOpen: boolean) => {
  if (isOpen) {
    setOpenGalleryId(id);              // ← OPENS this gallery
    setShowBubbleVideoForGallery(showBubbleVideo);
  } else {
    setOpenGalleryId(null);            // ← CLOSES gallery
    setShowBubbleVideoForGallery(false);
  }
};
```

**What happens:**
- Updates global `openGalleryId` state
- All 5 gallery instances receive new `isOpen` props
- Only the clicked gallery gets `isOpen = true`, others get `false`

---

### 4. **Animation Initialization Check** (`FilmRollGallery.tsx` line 108-127)
```tsx
// Track if this specific gallery has ever been opened
const [hasEverOpened, setHasEverOpened] = useState(false);
const [isReady, setIsReady] = useState(false);

// Set ready state after initial mount (50ms delay)
useEffect(() => {
  const timer = setTimeout(() => {
    setIsReady(true);
  }, 50);
  return () => clearTimeout(timer);
}, []);

// Track when this gallery opens for the first time
useEffect(() => {
  if (rolledOut && !hasEverOpened) {
    setHasEverOpened(true);
  }
}, [rolledOut, hasEverOpened]);
```

**What happens:**
- `isReady` becomes `true` after 50ms (prevents initial render glitches)
- `hasEverOpened` tracks if gallery has been opened before
- **ISSUE**: This is where the glitchy first animation might occur

---

### 5. **Film Strip Animation** (`FilmRollGallery.tsx` line 330-347)
```tsx
<motion.div
  initial={{ clipPath: "inset(0 100% 0 0)" }}  // Hidden on right
  animate={{
    clipPath: rolledOut && isReady
      ? "inset(0 0% 0 0)"      // Fully visible
      : "inset(0 100% 0 0)",   // Hidden on right
  }}
  transition={{
    duration: REEL_DUR,  // 1 second
    ease: "easeInOut",
  }}
>
```

**What happens:**
- **OPENING**: `clipPath` animates from `inset(0 100% 0 0)` → `inset(0 0% 0 0)`
  - This reveals the film strip from left to right (1 second)
- **CLOSING**: Reverses the animation
- **PROBLEM**: If `isReady` is false during first click, animation might skip or jump

---

### 6. **Text Animations (Visual Notes & Description)** (`FilmRollGallery.tsx` line 376-430)
```tsx
<motion.div
  initial={{ x: 0, opacity: 1 }}
  animate={rolledOut && isReady ? "off" : "on"}
  variants={{
    on: { x: 0, opacity: 1 },        // Visible
    off: { x: "40vw", opacity: 0 },  // Hidden to the right
  }}
  transition={{
    duration: 0.25,
    ease: "easeInOut",
    delay: rolledOut && isReady ? 0.1 : REEL_DUR,  // Delay based on state
  }}
>
```

**What happens:**
- **OPENING** (`rolledOut && isReady = true`):
  - Animates to "off" (moves right and fades out)
  - Has a 0.1s delay
- **CLOSING** (`rolledOut && isReady = false`):
  - Animates to "on" (moves back and fades in)
  - Has a 1s delay (same as `REEL_DUR`)
- **PROBLEM**: The delay logic might cause timing issues on first open

---

### 7. **Preview Expansion** (`PhotoStackPreview.tsx` line 66-81)
```tsx
<motion.div
  initial={{ height: 0 }}
  animate={{ 
    height: rolledOut ? "auto" : 0 
  }}
  transition={{ 
    duration: 0.6, 
    ease: [0.4, 0, 0.2, 1] 
  }}
>
```

**What happens:**
- Preview container animates from `height: 0` → `height: auto`
- Takes 0.6 seconds with a custom easing curve
- This happens **simultaneously** with the film strip reveal

---

### 8. **Auto-Scroll to Preview** (if enabled)
```tsx
// Auto-scroll functionality would be here
// Scrolls viewport to preview position with offset
```

**What happens:**
- After preview expands, page scrolls to show the preview
- Uses custom offset based on screen size

---

### 9. **Position Reporting** (`FilmRollGallery.tsx` line 170-189)
```tsx
useEffect(() => {
  if (!previewRef.current || !onPreviewPositionChange || !rolledOut || !isOpen) return;

  const updatePosition = () => {
    if (previewRef.current) {
      const rect = previewRef.current.getBoundingClientRect();
      onPreviewPositionChange(rect.top + window.scrollY, rect.height);
    }
  };

  updatePosition();  // Immediate call
  
  window.addEventListener('scroll', updatePosition, { passive: true });
  window.addEventListener('resize', updatePosition, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', updatePosition);
    window.removeEventListener('resize', updatePosition);
  };
}, [rolledOut, isOpen, onPreviewPositionChange]);
```

**What happens:**
- Reports preview position to parent (App.tsx)
- App.tsx uses this to position the bubble video
- **Runs immediately** when `rolledOut` and `isOpen` are both true
- Updates on scroll/resize

---

### 10. **Bubble Video Appears** (`BubbleVideo.tsx`)
```tsx
<motion.video
  style={{
    left: 'calc(33vw - 400px)',
    top: previewPosition.top + (previewPosition.height / 2) - 96,
  }}
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  autoPlay
/>
```

**What happens:**
- Video fades in and scales up over 0.5 seconds
- Positioned to the left of the preview box
- Vertically centered with preview

---

## Timeline Summary

```
0.00s: Click canister
0.00s: State updates (toggleRolledOut → App.tsx → isOpen prop change)
0.00s: Film strip starts revealing (clip-path animation, 1s duration)
0.00s: Preview container starts expanding (height animation, 0.6s duration)
0.10s: Visual notes/description start sliding out (0.25s duration)
0.35s: Visual notes/description finish sliding out
0.50s: Bubble video finishes fading in
0.60s: Preview container finishes expanding
1.00s: Film strip finishes revealing
```

---

## Potential Issues Causing Glitchy First Animation

### Issue #1: `isReady` Timing
```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    setIsReady(true);
  }, 50);
  return () => clearTimeout(timer);
}, []);
```
- This only runs ONCE on component mount
- When you first click, `isReady` is **already true**
- So the condition `rolledOut && isReady` might evaluate differently than expected

### Issue #2: Multiple State Updates
- Clicking canister triggers:
  1. `toggleRolledOut(next)` → parent `onToggle` → `setOpenGalleryId`
  2. This causes ALL 5 galleries to re-render
  3. Each gallery checks `isOpen = (openGalleryId === "id")`
  4. Multiple animations might start simultaneously

### Issue #3: Animation Initial Values
```tsx
initial={{ clipPath: "inset(0 100% 0 0)" }}
```
- If the animation hasn't properly initialized, this might snap to a different value
- The first render might not have the correct initial state

### Issue #4: Delay Logic Inconsistency
```tsx
delay: rolledOut && isReady ? 0.1 : REEL_DUR
```
- On first open: `rolledOut = true`, `isReady = true` → delay = 0.1s
- On close: `rolledOut = false`, `isReady = true` → delay = 1s (REEL_DUR)
- This asymmetry might cause timing issues

---

## Recommended Fixes

### Fix #1: Use Layout Effect for Initialization
```tsx
useLayoutEffect(() => {
  setIsReady(true);
}, []);
```
This ensures `isReady` is set synchronously before paint.

### Fix #2: Add Animation Key to Force Re-mount
```tsx
<motion.div
  key={`film-strip-${rolledOut}`}  // Forces new animation on each toggle
  initial={{ clipPath: "inset(0 100% 0 0)" }}
  ...
>
```

### Fix #3: Use `AnimatePresence` for Better Control
```tsx
<AnimatePresence>
  {rolledOut && (
    <motion.div
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      exit={{ clipPath: "inset(0 100% 0 0)" }}
    />
  )}
</AnimatePresence>
```

### Fix #4: Remove Conditional Delay
```tsx
transition={{
  duration: 0.25,
  ease: "easeInOut",
  delay: 0.1,  // Fixed delay
}}
```

