import React, { useRef, useLayoutEffect, ReactNode, isValidElement, cloneElement } from "react";
import { FlipAnimationOptions } from "./types";
import { flipElement, DEFAULT_ANIMATION_CONFIG } from "./animation-utils";

interface AnimateProps {
  id: string | number;
  children: ReactNode;
  animationConfig?: FlipAnimationOptions;
  disabled?: boolean;
}

/**
 * Animate component that automatically detects position changes and performs FLIP animations
 *
 * This component directly enhances the child element with animation capabilities without
 * adding wrapper elements. The child element will automatically animate when its position changes.
 *
 * @param id - Unique identifier for the element
 * @param children - Single React element to animate (must be a valid React element)
 * @param animationConfig - Animation configuration (duration, easing, delay, etc.)
 * @param disabled - Whether to disable animations
 */
export const Animate: React.FC<AnimateProps> = ({
  id,
  children,
  animationConfig = {},
  disabled = false,
}) => {
  const elementRef = useRef<HTMLElement>(null);
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

  // Ensure we have a valid React element as a child
  if (!isValidElement(children)) {
    console.warn("Animate component requires a valid React element as a child");
    return <>{children}</>;
  }

  // Clone the child element and add our ref and data attribute
  return cloneElement(
    children as React.ReactElement<any>,
    {
      ref: elementRef,
      "data-animate-id": id,
    } as any
  );
};

export default Animate;
