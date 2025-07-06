import React, { useRef, useLayoutEffect, ReactNode } from "react";
import { FlipAnimationOptions } from "./types";
import { flipElement, DEFAULT_ANIMATION_CONFIG } from "./animation-utils";

interface AnimateProps {
  id: string | number;
  children: ReactNode;
  animationConfig?: FlipAnimationOptions;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Animate component that automatically detects position changes and performs FLIP animations
 *
 * This component wraps any element and automatically animates it when its position changes.
 * Perfect for list items, table cells, or any element that needs to smoothly animate
 * when reordering or repositioning.
 *
 * @param id - Unique identifier for the element
 * @param children - React node to wrap and animate
 * @param animationConfig - Animation configuration (duration, easing, delay, etc.)
 * @param disabled - Whether to disable animations
 * @param className - CSS class name to apply to the wrapper
 * @param style - Inline styles to apply to the wrapper
 */
export const Animate: React.FC<AnimateProps> = ({
  id,
  children,
  animationConfig = {},
  disabled = false,
  className,
  style,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const previousBoundsRef = useRef<DOMRect | null>(null);
  const isAnimatingRef = useRef(false);
  const mountedRef = useRef(false);

  useLayoutEffect(() => {
    if (!elementRef.current || disabled) return;

    const currentBounds = elementRef.current.getBoundingClientRect();
    const previousBounds = previousBoundsRef.current;

    // Don't animate on first mount
    if (!mountedRef.current) {
      mountedRef.current = true;
      previousBoundsRef.current = currentBounds;
      return;
    }

    // Check if position has changed significantly (more than 1px to avoid micro-movements)
    const hasPositionChanged =
      previousBounds &&
      (Math.abs(currentBounds.left - previousBounds.left) > 1 ||
        Math.abs(currentBounds.top - previousBounds.top) > 1);

    if (hasPositionChanged && !isAnimatingRef.current) {
      isAnimatingRef.current = true;

      // Merge animation config with defaults
      const finalConfig = {
        ...DEFAULT_ANIMATION_CONFIG,
        ...animationConfig,
        onComplete: () => {
          isAnimatingRef.current = false;
          animationConfig.onComplete?.();
        },
      };

      // Perform FLIP animation
      flipElement(elementRef.current, previousBounds, finalConfig).catch(() => {
        // Handle animation errors gracefully
        isAnimatingRef.current = false;
      });
    }

    // Store current bounds for next comparison
    previousBoundsRef.current = currentBounds;
  });

  return (
    <div ref={elementRef} data-animate-id={id} className={className} style={style}>
      {children}
    </div>
  );
};

export default Animate;
