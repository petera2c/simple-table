import React, { useRef, useLayoutEffect, ReactNode, forwardRef } from "react";
import { FlipAnimationOptions } from "./types";
import { flipElement, DEFAULT_ANIMATION_CONFIG } from "./animation-utils";

interface AnimateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  id: string | number;
  animationConfig?: FlipAnimationOptions;
  disabled?: boolean;
  children: ReactNode;
}

/**
 * Animate component that renders as a div and automatically detects position changes
 * and performs FLIP animations.
 *
 * This component renders as a div element and automatically animates when its position changes.
 * Animations can be interrupted and new ones can start at any time.
 *
 * @param id - Unique identifier for the element
 * @param animationConfig - Animation configuration (duration, easing, delay, etc.)
 * @param disabled - Whether to disable animations
 * @param children - Content to render inside the animated div
 * @param ...props - All other standard div props (className, onClick, style, etc.)
 */
export const Animate = forwardRef<HTMLDivElement, AnimateProps>(
  ({ id, animationConfig = {}, disabled = false, children, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const previousBoundsRef = useRef<DOMRect | null>(null);
    const mountedRef = useRef(false);

    // Use internal ref for animation tracking
    const elementRef = internalRef;

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

      if (hasPositionChanged) {
        // Merge animation config with defaults
        const finalConfig = {
          ...DEFAULT_ANIMATION_CONFIG,
          ...animationConfig,
        };

        // Start new animation (this will interrupt any ongoing animation)
        flipElement(elementRef.current, previousBounds, finalConfig).catch(() => {
          // Handle animation errors gracefully
        });
      }

      // Store current bounds for next comparison
      previousBoundsRef.current = currentBounds;
    });

    // Combine internal ref with forwarded ref
    const combinedRef = (node: HTMLDivElement | null) => {
      // Set internal ref
      internalRef.current = node;

      // Forward ref to parent if provided
      if (forwardedRef) {
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else {
          forwardedRef.current = node;
        }
      }
    };

    return (
      <div ref={combinedRef} data-animate-id={id} {...props}>
        {children}
      </div>
    );
  }
);

Animate.displayName = "Animate";

export default Animate;
