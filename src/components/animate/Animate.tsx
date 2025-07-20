import React, { useRef, useLayoutEffect, ReactNode } from "react";
import usePrevious from "../../hooks/usePrevious";
import { flipElement, ANIMATION_CONFIGS } from "./animation-utils";
import TableRow from "../../types/TableRow";
import { useTableContext } from "../../context/TableContext";

interface AnimateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  children: ReactNode;
  id: string;
  tableRow?: TableRow;
}
export const Animate = ({ children, id, tableRow, ...props }: AnimateProps) => {
  const { allowAnimations, isResizing, isScrolling } = useTableContext();
  const elementRef = useRef<HTMLDivElement>(null);
  const previousBoundsRef = useRef<DOMRect | null>(null);
  const previousScrollingState = usePrevious(isScrolling);
  const previousResizingState = usePrevious(isResizing);

  // Debug John Doe specifically
  const isJohnDoe = tableRow?.row?.name === "John Doe";

  useLayoutEffect(() => {
    // Early exit if animations are disabled - don't do any work at all
    if (!allowAnimations) {
      return;
    }

    // Don't animate while headers are being resized
    if (!elementRef.current || isResizing) {
      return;
    }

    const currentBounds = elementRef.current.getBoundingClientRect();
    const previousBounds = previousBoundsRef.current;

    if (isJohnDoe) {
      console.log("🔍 John Doe bounds debug:", {
        position: tableRow?.position,
        currentBounds: {
          x: currentBounds.x,
          y: currentBounds.y,
          width: currentBounds.width,
          height: currentBounds.height,
        },
        previousBounds: previousBounds
          ? {
              x: previousBounds.x,
              y: previousBounds.y,
              width: previousBounds.width,
              height: previousBounds.height,
            }
          : null,
        isScrolling,
        isResizing,
      });
    }

    // If we're currently scrolling, don't animate and don't update bounds
    if (isScrolling) {
      if (isJohnDoe) console.log("🔍 John Doe: Skipping due to scrolling");
      return;
    }

    // If scrolling just ended, update the previous bounds without animating
    if (previousScrollingState && !isScrolling) {
      if (isJohnDoe) console.log("🔍 John Doe: Scrolling ended, updating bounds");
      previousBoundsRef.current = currentBounds;
      return;
    }

    // If resizing just ended, update the previous bounds without animating
    if (previousResizingState && !isResizing) {
      if (isJohnDoe) console.log("🔍 John Doe: Resizing ended, updating bounds");
      previousBoundsRef.current = currentBounds;
      return;
    }

    // Store current bounds for next render
    previousBoundsRef.current = currentBounds;

    // If there's no previous bound data, don't animate (prevents first render animations)
    if (!previousBounds) {
      if (isJohnDoe) console.log("🔍 John Doe: No previous bounds, skipping animation");
      return;
    }

    // Check if this is a significant position change
    const deltaX = currentBounds.x - previousBounds.x;
    const deltaY = currentBounds.y - previousBounds.y;
    const positionDelta = Math.abs(deltaX);

    if (isJohnDoe) {
      console.log("🔍 John Doe delta calculation:", {
        deltaX,
        deltaY,
        positionDelta,
        threshold: "positionDelta >= 50 || Math.abs(deltaY) > 5",
      });
    }

    // Only animate if position change is significant (>50px indicates column reordering)
    // or if there's a vertical change (>5px indicates row reordering)
    if (positionDelta < 50 && Math.abs(deltaY) <= 5) {
      if (isJohnDoe) console.log("🔍 John Doe: Position change too small, skipping animation");
      return;
    }

    let hasPositionChanged = false;

    // Check DOM position changes
    const hasDOMPositionChanged = Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5;

    hasPositionChanged = hasDOMPositionChanged;

    if (isJohnDoe) {
      console.log("🔍 John Doe animation decision:", {
        hasDOMPositionChanged,
        hasPositionChanged,
        willAnimate: hasPositionChanged,
      });
    }

    if (hasPositionChanged) {
      if (isJohnDoe) console.log("🔍 John Doe: 🎬 STARTING ANIMATION!");

      // For leaving elements (moving far off-screen), boost z-index to keep them visible
      const isLeavingElement = Math.abs(deltaY) > 200; // Large movement indicates leaving
      if (isLeavingElement) {
        elementRef.current.style.zIndex = "1000";
        elementRef.current.style.position = "relative";
        if (isJohnDoe)
          console.log(
            `🔍 John Doe: Leaving element detected! deltaY: ${deltaY}px, removing maxY constraint`
          );
      }

      // Merge animation config with defaults
      const finalConfig = {
        ...ANIMATION_CONFIGS.ROW_REORDER,
        // Remove maxY constraint for leaving elements so they can animate their full distance
        maxY: isLeavingElement ? undefined : ANIMATION_CONFIGS.ROW_REORDER.maxY,
        onComplete: () => {
          // Reset z-index after animation completes
          if (isLeavingElement && elementRef.current) {
            elementRef.current.style.zIndex = "";
            elementRef.current.style.position = "";
            if (isJohnDoe) console.log("🔍 John Doe: Animation complete, resetting z-index");
          }
        },
      };

      // Start new animation (this will interrupt any ongoing animation)
      flipElement(elementRef.current, previousBounds, finalConfig);
    } else {
      if (isJohnDoe) console.log("🔍 John Doe: ❌ NOT animating - hasPositionChanged is false");
    }
  }, [
    allowAnimations,
    isResizing,
    isScrolling,
    previousScrollingState,
    previousResizingState,
    tableRow?.position, // Include position so animation triggers when it changes
    tableRow,
  ]);

  return (
    <div ref={elementRef} data-animate-id={id} id={String(id)} {...props}>
      {children}
    </div>
  );
};

Animate.displayName = "Animate";

export default Animate;
