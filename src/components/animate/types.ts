export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface FlipAnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  maxX?: number;
  maxY?: number;
  maxYLeavingRatio?: number;
  maxYEnteringRatio?: number;
  onComplete?: () => void;
  respectReducedMotion?: boolean; // Whether to respect user's reduced motion preference (default: true)
}

export interface CustomAnimationOptions {
  startY: number; // Absolute Y coordinate where animation starts
  endY: number; // Absolute Y coordinate where animation ends
  finalY?: number; // Where element actually belongs (for invisible jump after animation)
  duration?: number;
  easing?: string;
  delay?: number;
  onComplete?: () => void;
  respectReducedMotion?: boolean;
}
