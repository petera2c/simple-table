export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  maxX?: number;
  maxY?: number;
}

export interface FlipAnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  maxX?: number;
  maxY?: number;
  onComplete?: () => void;
}
