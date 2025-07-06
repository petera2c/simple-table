# FLIP Animation System

A clean, simple React component system for creating smooth list animations using the FLIP (First, Last, Invert, Play) technique with JavaScript-based animations.

## Features

- 🎬 **FLIP Animation**: Smooth position-based animations using JavaScript (not CSS)
- 📋 **SortList Component**: Clean list component with a simple sort button
- 🧩 **Sectioned Animation**: Advanced component for items with multiple sections
- 🔀 **Multiple Shuffle Modes**: Shuffle entire items or just sections within items
- 🎨 **Customizable**: Flexible styling and animation configurations
- 🪝 **React Hooks**: Custom hooks for advanced use cases
- 📱 **Responsive**: Works well on mobile and desktop
- ⚡ **Performance**: Optimized for smooth animations

## Quick Start

### Basic List Animation

```tsx
import { SortList, ListViewItem } from "@/components/flip";

const items: ListViewItem[] = [
  { id: 1, content: <div>Item 1</div> },
  { id: 2, content: <div>Item 2</div> },
  { id: 3, content: <div>Item 3</div> },
];

function App() {
  return <SortList items={items} animationConfig={{ duration: 300, easing: "easeOutQuad" }} />;
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

### SortList

The main component that provides a list with a sort button and FLIP animations.

```tsx
interface SortListProps {
  items: ListViewItem[];
  animationConfig?: {
    duration?: number;
    easing?: string;
    delay?: number;
  };
  className?: string;
  itemClassName?: string;
}
```

#### Built-in Controls

- **Shuffle Button**: Randomly reorders items with smooth animations

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

- **Section-level animations**: Each section animates independently
- **Flexible layout**: Sections display horizontally (stacks on mobile)
- **Section interaction**: Click handlers for individual sections
- **Responsive design**: Automatic mobile-friendly layout

### BasicExample

A simple example component showing basic usage.

```tsx
import { BasicExample } from "@/components/flip";

function App() {
  return <BasicExample />;
}
```

## Hooks

### useFlipAnimation

Custom hook for implementing FLIP animations in your own components.

```tsx
import { useFlipAnimation } from "@/components/flip";

function MyAnimatedList({ items }) {
  const { containerRef, captureFirst, isAnimating } = useFlipAnimation(items, {
    animationOptions: { duration: 300 },
  });

  const handleSort = () => {
    captureFirst();
    setItems(sortBy(items, "id", "asc"));
  };

  return (
    <div ref={containerRef}>
      {items.map((item) => (
        <div key={item.id} data-flip-id={item.id}>
          {item.content}
        </div>
      ))}
    </div>
  );
}
```

## Utility Functions

### Sort Operations

```tsx
import { sortBy } from "@/components/flip";

// Sort by property
const sorted = sortBy(items, "id", "asc");
```

### Animation Utilities

```tsx
import {
  flipElement,
  flipElements,
  easingFunctions,
  calculateStaggerDelay,
} from "@/components/flip";

// Animate single element
await flipElement(element, firstBounds, {
  duration: 300,
  easing: easingFunctions.easeOutQuad,
});

// Animate multiple elements
await flipElements(elements, firstBoundsMap, {
  duration: 300,
  easing: easingFunctions.easeOutCubic,
});
```

## Animation Configuration

### Easing Functions

```tsx
import { easingFunctions } from "@/components/flip";

// Available easing functions
const easings = {
  easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
  easeOutCubic: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  easeOutQuart: "cubic-bezier(0.165, 0.84, 0.44, 1)",
  easeInOutQuart: "cubic-bezier(0.77, 0, 0.175, 1)",
};
```

### Animation Config

```tsx
interface AnimationConfig {
  duration: number; // Animation duration in milliseconds
  easing: string; // CSS easing function
  delay?: number; // Animation delay in milliseconds
}
```

## Advanced Usage

### Custom Components with FLIP

```tsx
import { useFlipAnimation } from "@/components/flip";

function CustomFlipList({ items }) {
  const { containerRef, captureFirst } = useFlipAnimation(items);

  const handleCustomAction = async () => {
    // Capture current positions
    captureFirst();

    // Perform your data manipulation
    const newItems = customDataTransform(items);
    setItems(newItems);

    // Animation will be handled automatically by the hook
  };

  return (
    <div ref={containerRef}>
      {items.map((item) => (
        <div key={item.id} data-flip-id={item.id}>
          {item.content}
        </div>
      ))}
    </div>
  );
}
```

## Types

```tsx
interface ListViewItem {
  id: string | number;
  content: React.ReactNode;
  data?: any;
}

interface ListViewSection {
  id: string | number;
  content: React.ReactNode;
  className?: string;
  data?: any;
}

interface SectionedListViewItem {
  id: string | number;
  sections: ListViewSection[];
  className?: string;
  data?: any;
}

interface FlipAnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  onComplete?: () => void;
}
```

## Styling

The components come with default CSS that can be customized:

```css
/* Override default styles */
.sort-list {
  /* Your custom styles */
}

.sort-list-item {
  /* Your custom item styles */
}

.sort-list-item.card-style {
  /* Custom card styling */
}

.sort-list-item.minimal-style {
  /* Minimal styling */
}
```

## Performance Tips

1. **Use stable IDs**: Ensure each item has a unique, stable ID
2. **Limit item count**: Best performance with < 100 items
3. **Avoid complex content**: Keep item content simple for better performance
4. **Use data-flip-id**: Always include this attribute for proper animation tracking

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Examples

Check out the example components:

### `BasicExample`

- Basic list with shuffle functionality
- Sectioned list with dual shuffle modes
- Interactive animation controls
- Clean, minimal implementation

### `SectionedExample`

- Advanced employee directory example
- Complex sectioned layout
- Demonstrates both item and section shuffling
- Responsive design patterns

---

## API Reference

### Components

- `SortList` - Main animated list component with shuffle button
- `SectionedSortList` - Advanced component for sectioned items with dual shuffle modes
- `BasicExample` - Simple example component showing both basic and sectioned usage
- `SectionedExample` - Advanced example with employee directory layout

### Hooks

- `useFlipAnimation` - Custom hook for FLIP animations

### Utilities

- `sortBy` - Function for sorting arrays by property
- `easingFunctions` - Predefined easing functions
- Animation utilities for manual control

### Types

- `ListViewItem` - Interface for basic list items
- `ListViewSection` - Interface for individual sections within items
- `SectionedListViewItem` - Interface for items with multiple sections
- `SortListProps` - Props for SortList component
- `SectionedSortListProps` - Props for SectionedSortList component
- `AnimationConfig` - Animation configuration interface
- `FlipAnimationOptions` - Options for FLIP animations
