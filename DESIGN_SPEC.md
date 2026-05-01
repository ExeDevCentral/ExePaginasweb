# Premium Landing Page UX/UI Design Specifications

## Wireframes (ASCII Format)

### 1. Hero Section
```
+-----------------------------+
| [Sticky Header]             |
| Logo | Menu | CTA Button    |
+-----------------------------+
|                             |
|   [Video Background Loop]   |
|                             |
|   [Overlay Gradient]        |
|                             |
|   [Animated Text]           |
|   "Welcome to Premium"      |
|   "Landing Experience"      |
|                             |
|   [CTA Button]              |
|   "Get Started"             |
|                             |
+-----------------------------+
```

### 2. Features Section
```
+-----------------------------+
| [Feature Card 1]           |
| Icon | Title | Description  |
| [Scroll Animation Trigger] |
+-----------------------------+
| [Feature Card 2]           |
| Icon | Title | Description  |
| [Parallax Effect]          |
+-----------------------------+
| [Feature Card 3]           |
| Icon | Title | Description  |
| [Smart Animate Transition] |
+-----------------------------+
```

### 3. Demo Section
```
+-----------------------------+
| [Upload Area]              |
| Drag & Drop Zone           |
| [File Preview]             |
|                             |
| [Filter Controls]          |
| Brightness | Contrast      |
| Saturation | Blur          |
|                             |
| [Generate Code Button]     |
| [Bot Integration]          |
+-----------------------------+
```

### 4. Bot Widget
```
+-----------------------------+
|                             |
|   [Floating Chat Widget]    |
|   [Bot Avatar 3D]           |
|                             |
|   [Chat Bubble]             |
|   "How can I help?"         |
|                             |
|   [Command Menu]            |
|   /setup /add-deps          |
|   /gen-component /deploy    |
|                             |
+-----------------------------+
```

## Color Palette

### Primary Colors
- Background: #0a0a0a (Dark Charcoal)
- Text Primary: #ffffff (White)
- Text Secondary: #cccccc (Light Gray)

### Secondary Colors
- Accent 1: #00ffff (Cyan)
- Accent 2: #ff00ff (Magenta)
- Accent 3: #ffff00 (Yellow)

### Gradients
- Hero Overlay: linear-gradient(135deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1))
- CTA Button: linear-gradient(45deg, #00ffff, #ff00ff)

## Animation Specifications

### Durations
- Page Transitions: 0.5s
- Hover Effects: 0.3s
- Scroll Animations: 0.8s
- Typewriter Effect: 2s per word

### Easing Curves
- Default: cubic-bezier(0.4, 0.0, 0.2, 1)
- Bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
- Elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275)

### Framer Motion Variants
```typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

## Assets Requirements

### Videos
- Hero Background: 4K resolution (3840x2160), 10-15s loop, MP4 format
- Theme: Abstract tech/data flow with particles and fluid gradients

### Lottie Animations
- Loading Spinner: Abstract geometric shapes, JSON format
- Feature Icons: Animated SVG icons, 64x64px
- Bot Avatar: 3D-style animated character, 128x128px

### Three.js Models
- Floating Logo: Simple 3D geometry with rotation
- Background Particles: Interactive particle system
- Bot 3D Model: Low-poly character model

### Images
- Placeholder Images: 1920x1080px, WebP format
- Icons: SVG format, scalable
- Screenshots: 1280x720px for demo previews
