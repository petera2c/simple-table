import React, { useRef, useLayoutEffect, ReactNode } from "react";
import usePrevious from "../../hooks/usePrevious";
import { FlipAnimationOptions } from "./types";
import { flipElement, DEFAULT_ANIMATION_CONFIG } from "./animation-utils";
import TableRow from "../../types/TableRow";
import { useTableContext } from "../../context/TableContext";

interface AnimateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  animationConfig?: FlipAnimationOptions;
  children: ReactNode;
  id: string;
  tableRow?: TableRow;
}
export const Animate = ({
  animationConfig = DEFAULT_ANIMATION_CONFIG,
  children,
  id,
  tableRow,
  ...props
}: AnimateProps) => {
  const { allowAnimations, isResizing, isScrolling } = useTableContext();
  const elementRef = useRef<HTMLDivElement>(null);
  const previousBoundsRef = useRef<DOMRect | null>(null);
  const previousScrollingState = usePrevious(isScrolling);
  const previousResizingState = usePrevious(isResizing);

  useLayoutEffect(() => {
    console.log("rerendering");
    // Don't animate while animations are disabled
    // Don't animate while headers are being resized
    if (!elementRef.current || !allowAnimations || isResizing) {
      return;
    }

    const currentBounds = elementRef.current.getBoundingClientRect();
    const previousBounds = previousBoundsRef.current;

    // If we're currently scrolling, don't animate and don't update bounds
    if (isScrolling) {
      return;
    }

    // If scrolling just ended, update the previous bounds without animating
    if (previousScrollingState && !isScrolling) {
      previousBoundsRef.current = currentBounds;
      return;
    }

    // If resizing just ended, update the previous bounds without animating
    if (previousResizingState && !isResizing) {
      previousBoundsRef.current = currentBounds;
      return;
    }

    // Store current bounds for next render
    previousBoundsRef.current = currentBounds;

    // If there's no previous bound data, don't animate (prevents first render animations)
    if (!previousBounds) {
      return;
    }

    // Check if this is a significant position change
    const deltaX = currentBounds.x - previousBounds.x;
    const deltaY = currentBounds.y - previousBounds.y;
    const positionDelta = Math.abs(deltaX);

    // Only animate if position change is significant (>50px indicates column reordering)
    // or if there's a vertical change (>5px indicates row reordering)
    if (positionDelta < 50 && Math.abs(deltaY) <= 5) {
      return;
    }

    let hasPositionChanged = false;

    // Check DOM position changes
    const hasDOMPositionChanged = Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5;

    hasPositionChanged = hasDOMPositionChanged;

    if (hasPositionChanged) {
      // Merge animation config with defaults
      const finalConfig = {
        ...DEFAULT_ANIMATION_CONFIG,
        ...animationConfig,
      };

      // Start new animation (this will interrupt any ongoing animation)
      flipElement(elementRef.current, previousBounds, finalConfig);
    }
  }, [
    allowAnimations,
    isResizing,
    isScrolling,
    previousScrollingState,
    previousResizingState,
    tableRow,
    animationConfig,
  ]);

  return (
    <div ref={elementRef} data-animate-id={id} id={String(id)} {...props}>
      {children}
    </div>
  );
};

Animate.displayName = "Animate";

export default Animate;
