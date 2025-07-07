import React, { useRef, useLayoutEffect, ReactNode, forwardRef } from "react";
import { FlipAnimationOptions } from "./types";
import { flipElement, DEFAULT_ANIMATION_CONFIG } from "./animation-utils";

interface AnimateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  id: string | number;
  animationConfig?: FlipAnimationOptions;
  disabled?: boolean;
  logicalPosition?: number | string; // For virtualized tables - track logical position instead of DOM position
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
 * @param logicalPosition - For virtualized tables, track logical position instead of DOM position
 * @param children - Content to render inside the animated div
 * @param ...props - All other standard div props (className, onClick, style, etc.)
 */
export const Animate = forwardRef<HTMLDivElement, AnimateProps>(
  (
    { id, animationConfig = {}, disabled = false, logicalPosition, children, ...props },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const previousBoundsRef = useRef<DOMRect | null>(null);
    const previousLogicalPositionRef = useRef<number | string | undefined>(logicalPosition);
    const mountedRef = useRef(false);

    // Use internal ref for animation tracking
    const elementRef = internalRef;

    useLayoutEffect(() => {
      console.log(`[Animate ${id}] useLayoutEffect triggered`);

      if (!elementRef.current || disabled) {
        console.log(
          `[Animate ${id}] Skipping - element: ${!!elementRef.current}, disabled: ${disabled}`
        );
        return;
      }

      const currentBounds = elementRef.current.getBoundingClientRect();
      const previousBounds = previousBoundsRef.current;
      const previousLogicalPosition = previousLogicalPositionRef.current;

      console.log(`[Animate ${id}] Position check:`, {
        logicalPosition: logicalPosition,
        previousLogicalPosition: previousLogicalPosition,
        currentBounds: { left: Math.round(currentBounds.left), top: Math.round(currentBounds.top) },
        previousBounds: previousBounds
          ? { left: Math.round(previousBounds.left), top: Math.round(previousBounds.top) }
          : null,
        mounted: mountedRef.current,
      });

      // Don't animate on first mount
      if (!mountedRef.current) {
        console.log(`[Animate ${id}] First mount - storing initial state`);
        mountedRef.current = true;
        previousBoundsRef.current = currentBounds;
        previousLogicalPositionRef.current = logicalPosition;
        return;
      }

      let hasPositionChanged = false;

      // Check DOM position changes
      const hasDOMPositionChanged = !!(
        previousBounds &&
        (Math.abs(currentBounds.left - previousBounds.left) > 1 ||
          Math.abs(currentBounds.top - previousBounds.top) > 1)
      );

      console.log(`[Animate ${id}] DOM position changed: ${hasDOMPositionChanged}`, {
        deltaX: previousBounds ? Math.round(currentBounds.left - previousBounds.left) : 0,
        deltaY: previousBounds ? Math.round(currentBounds.top - previousBounds.top) : 0,
      });

      // For virtualized tables, only animate if logical position changed (prevents scroll animations)
      if (logicalPosition !== undefined && previousLogicalPosition !== undefined) {
        const hasLogicalPositionChanged = logicalPosition !== previousLogicalPosition;

        if (hasLogicalPositionChanged) {
          console.log(
            `[Animate ${id}] Logical position changed: ${previousLogicalPosition} → ${logicalPosition}`
          );
        }

        // Only animate if BOTH logical position changed AND DOM position changed significantly
        hasPositionChanged = hasLogicalPositionChanged && hasDOMPositionChanged;
      }
      // For non-virtualized content, track DOM position changes only
      else {
        hasPositionChanged = hasDOMPositionChanged;
      }

      if (hasPositionChanged && previousBounds) {
        console.log(
          `[Animate ${id}] 🎬 Starting animation! Delta: ${Math.round(
            currentBounds.left - previousBounds.left
          )}px, ${Math.round(currentBounds.top - previousBounds.top)}px`
        );

        // Merge animation config with defaults
        const finalConfig = {
          ...DEFAULT_ANIMATION_CONFIG,
          ...animationConfig,
        };

        // Start new animation (this will interrupt any ongoing animation)
        flipElement(elementRef.current, previousBounds, finalConfig).catch(() => {
          // Handle animation errors gracefully
          console.log(`[Animate ${id}] ❌ Animation error`);
        });
      } else {
        console.log(
          `[Animate ${id}] 🚫 No animation - hasPositionChanged: ${hasPositionChanged}, previousBounds: ${!!previousBounds}`
        );
      }

      // Store current bounds and logical position for next comparison
      previousBoundsRef.current = currentBounds;
      previousLogicalPositionRef.current = logicalPosition;
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
