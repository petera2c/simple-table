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
