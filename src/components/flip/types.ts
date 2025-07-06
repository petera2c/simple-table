export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
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
