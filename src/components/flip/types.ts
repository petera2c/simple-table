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

// New section-based interfaces
export interface ListViewSection {
  id: string | number;
  content: React.ReactNode;
  className?: string;
  data?: any;
}

export interface SectionedListViewItem {
  id: string | number;
  sections: ListViewSection[];
  className?: string;
  data?: any;
}

export interface ListViewItem {
  id: string | number;
  content: React.ReactNode;
  data?: any;
}

export interface SortListProps {
  items: ListViewItem[];
  animationConfig?: Partial<AnimationConfig>;
  className?: string;
  itemClassName?: string;
}

export interface SectionedSortListProps {
  items: SectionedListViewItem[];
  animationConfig?: Partial<AnimationConfig>;
  className?: string;
  itemClassName?: string;
  sectionClassName?: string;
}

export interface FlipAnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  onComplete?: () => void;
}
