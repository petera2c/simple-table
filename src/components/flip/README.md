# FLIP Animation System

A clean, simple React component system for creating smooth list animations using the FLIP (First, Last, Invert, Play) technique with JavaScript-based animations.

## Features

- 🎬 **FLIP Animation**: Smooth position-based animations using JavaScript (not CSS)
- 🧩 **Animate Component**: Declarative wrapper that automatically animates position changes
- 🔄 **Sectioned Animation**: Advanced component for items with multiple sections
- 🔀 **Multiple Shuffle Modes**: Shuffle entire items or just sections within items
- 🎨 **Customizable**: Flexible styling and animation configurations
- 📱 **Responsive**: Works well on mobile and desktop
- ⚡ **Performance**: Optimized for smooth animations

## Quick Start

### Basic List Animation

```tsx
import { Animate } from "@/components/flip";

const items = [
  { id: 1, content: "Item 1" },
  { id: 2, content: "Item 2" },
  { id: 3, content: "Item 3" },
];

function App() {
  return (
    <div>
      {items.map((item) => (
        <Animate key={item.id} id={item.id} animationConfig={{ duration: 300 }}>
          <div>{item.content}</div>
        </Animate>
      ))}
    </div>
  );
}
```

### Sectioned List Animation

For complex layouts with multiple sections per item:

```tsx
import { SectionedSortList, SectionedListViewItem } from "@/components/flip";

const sectionedItems: SectionedListViewItem[] = [
  {
    id: 1,
    sections: [
      { id: "name", content: <strong>John Doe</strong> },
      { id: "role", content: <span>Senior Developer</span> },
      { id: "status", content: <span>Active</span> },
    ],
  },
  {
    id: 2,
    sections: [
      { id: "name", content: <strong>Jane Smith</strong> },
      { id: "role", content: <span>UX Designer</span> },
      { id: "status", content: <span>Away</span> },
    ],
  },
];

function App() {
  return (
    <SectionedSortList
      items={sectionedItems}
      animationConfig={{ duration: 350, easing: "easeOutQuad" }}
    />
  );
}
```

## Components

### Animate

The declarative component that automatically animates position changes.

```tsx
interface AnimateProps {
  id: string | number;
  children: React.ReactNode;
  animationConfig?: FlipAnimationOptions;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
```

#### Key Features

- **Automatic Detection**: Detects when wrapped element changes position
- **No Manual Triggers**: No need to call capture/animate functions
- **Configurable**: Customize duration, easing, and delay
- **Performance**: Only animates when position actually changes (>1px threshold)

### SectionedSortList

Advanced component for items with multiple sections that can be animated independently.

```tsx
interface SectionedSortListProps {
  items: SectionedListViewItem[];
  animationConfig?: {
    duration?: number;
    easing?: string;
    delay?: number;
  };
  className?: string;
  itemClassName?: string;
  sectionClassName?: string;
}
```

#### Built-in Controls

- **Shuffle Items 🔀**: Randomly reorders entire items
- **Shuffle Sections 🎯**: Randomly reorders sections within each item

#### Key Features

- **Section-level animations**: Each section animates independently using Animate component
- **Flexible layout**: Sections display horizontally (stacks on mobile)
- **Responsive design**: Automatic mobile-friendly layout

### BasicExample

A comprehensive example component showing both simple and sectioned usage.

```tsx
import { BasicExample } from "@/components/flip";

function App() {
  return <BasicExample />;
}
```

## Animation Configuration

### Animation Options

```tsx
interface FlipAnimationOptions {
  duration?: number; // Animation duration in milliseconds (default: 300)
  easing?: string; // CSS easing function (default: cubic-bezier(0.25, 0.46, 0.45, 0.94))
  delay?: number; // Animation delay in milliseconds (default: 0)
  onComplete?: () => void; // Callback when animation completes
}
```

### Example Configurations

```tsx
// Fast animation
<Animate animationConfig={{ duration: 200 }}>
  <div>Fast animating content</div>
</Animate>

// Custom easing
<Animate animationConfig={{
  duration: 400,
  easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
}}>
  <div>Bouncy animation</div>
</Animate>

// With callback
<Animate animationConfig={{
  duration: 300,
  onComplete: () => console.log('Animation done!')
}}>
  <div>Content with callback</div>
</Animate>
```

## Types

```tsx
interface SectionedListViewItem {
  id: string | number;
  sections: ListViewSection[];
  className?: string;
  data?: any;
}

interface ListViewSection {
  id: string | number;
  content: React.ReactNode;
  className?: string;
  data?: any;
}

interface AnimateProps {
  id: string | number;
  children: React.ReactNode;
  animationConfig?: FlipAnimationOptions;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface FlipAnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  onComplete?: () => void;
}
```

## Performance Tips

1. **Use stable IDs**: Ensure each animated element has a unique, stable ID
2. **Limit animations**: Best performance with < 100 animated elements
3. **Avoid complex content**: Keep animated content simple for better performance
4. **Use appropriate thresholds**: The component only animates changes > 1px

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Examples

Check out the example components:

### `BasicExample`

- Simple list with Animate component
- Sectioned list with dual shuffle modes
- Interactive animation controls
- Clean, minimal implementation

---

## API Reference

### Components

- `Animate` - Declarative component that automatically animates position changes
- `SectionedSortList` - Advanced component for sectioned items with dual shuffle modes
- `BasicExample` - Comprehensive example showing both simple and sectioned usage

### Utilities

- Animation utilities for manual control (`flipElement`, `calculateInvert`, etc.)

### Types

- `SectionedListViewItem` - Interface for items with multiple sections
- `ListViewSection` - Interface for individual sections within items
- `SectionedSortListProps` - Props for SectionedSortList component
- `FlipAnimationOptions` - Options for FLIP animations
- `AnimationConfig` - Animation configuration interface
