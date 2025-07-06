export interface FlipItem {
  id: string | number;
  element: HTMLElement;
  bounds: DOMRect;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface FlipAnimationState {
  first: DOMRect;
  last: DOMRect;
  invert: {
    x: number;
    y: number;
  };
}

export interface ListViewItem {
  id: string | number;
  content: React.ReactNode;
  data?: any;
}

export interface SortListProps {
  items: ListViewItem[];
  onItemClick?: (item: ListViewItem) => void;
  animationConfig?: Partial<AnimationConfig>;
  className?: string;
  itemClassName?: string;
}

export interface FlipAnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  onComplete?: () => void;
}
