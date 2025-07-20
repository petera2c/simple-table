import React, { useRef, useLayoutEffect, ReactNode, RefObject } from "react";
import usePrevious from "../../hooks/usePrevious";
import { flipElement, ANIMATION_CONFIGS } from "./animation-utils";
import TableRow from "../../types/TableRow";
import { useTableContext } from "../../context/TableContext";

interface AnimateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  children: ReactNode;
  id: string;
  parentRef?: RefObject<HTMLDivElement | null>;
  tableRow?: TableRow;
}
export const Animate = ({ children, id, parentRef, tableRow, ...props }: AnimateProps) => {
  const { allowAnimations, isResizing, isScrolling } = useTableContext();
  const elementRef = useRef<HTMLDivElement>(null);
  const fromBoundsRef = useRef<DOMRect | null>(null);
  const previousScrollingState = usePrevious(isScrolling);
  const previousResizingState = usePrevious(isResizing);

  useLayoutEffect(() => {
    // Early exit if animations are disabled - don't do any work at all
    if (!allowAnimations) {
      return;
    }

    // Don't animate while headers are being resized
    if (!elementRef.current || isResizing) {
      return;
    }

    const toBounds = elementRef.current.getBoundingClientRect();
    const fromBounds = fromBoundsRef.current;

    // If we're currently scrolling, don't animate and don't update bounds
    if (isScrolling) {
      return;
    }

    // If scrolling just ended, update the previous bounds without animating
    if (previousScrollingState && !isScrolling) {
      fromBoundsRef.current = toBounds;
      return;
    }

    // If resizing just ended, update the previous bounds without animating
    if (previousResizingState && !isResizing) {
      fromBoundsRef.current = toBounds;
      return;
    }

    // Store current bounds for next render
    fromBoundsRef.current = toBounds;

    // If there's no previous bound data, don't animate (prevents first render animations)
    if (!fromBounds) {
      return;
    }

    // Check if this is a significant position change
    const deltaX = toBounds.x - fromBounds.x;
    const deltaY = toBounds.y - fromBounds.y;
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
        ...ANIMATION_CONFIGS.ROW_REORDER,
        onComplete: () => {
          // Reset z-index after animation completes
          if (elementRef.current) {
            elementRef.current.style.zIndex = "";
            elementRef.current.style.position = "";
          }
        },
      };

      // Where is the user scrolled to
      const parentScrollTop = parentRef?.current?.scrollTop;
      const clientHeight = parentRef?.current?.clientHeight;
      const parentScrollHeight = parentRef?.current?.scrollHeight;

      if (
        parentScrollTop !== undefined &&
        clientHeight !== undefined &&
        parentScrollHeight !== undefined
      ) {
        const isCurrentlyInViewport =
          fromBounds.y > parentScrollTop && fromBounds.y < parentScrollTop + clientHeight;
        const isMovingIntoViewport =
          toBounds.y > parentScrollTop && toBounds.y < parentScrollTop + clientHeight;
        const isMovingAboveViewport = toBounds.y < parentScrollTop;
        const isMovingBelowViewport = toBounds.y > parentScrollTop + clientHeight;

        if (isCurrentlyInViewport && !isMovingIntoViewport && isMovingBelowViewport) {
          // toBounds.y = parentScrollTop + clientHeight + 100;
        }

        if (tableRow?.row.id === 1) {
          console.log("\n");
          console.log("tableRow", {
            id: tableRow?.row.id,
            position: tableRow?.position,
            name: tableRow?.row.repName,
            dealSize: tableRow?.row.dealSize,
          });
          console.log("fromBounds.y", fromBounds.y);
          console.log("toBounds.y", toBounds.y);
          console.log("deltaY", deltaY);
          console.log("isCurrentlyInViewport", isCurrentlyInViewport);
          console.log("isMovingIntoViewport", isMovingIntoViewport);
          console.log("parentScrollTop", parentScrollTop);
          console.log("clientHeight", clientHeight);
          console.log("parentScrollHeight", parentScrollHeight);
          console.log("isMovingAboveViewport", isMovingAboveViewport);
          console.log("isMovingBelowViewport", isMovingBelowViewport);
        }
      }

      flipElement({
        element: elementRef.current,
        fromBounds,
        toBounds,
        finalConfig,
        id: tableRow?.row.id,
      });
    } else {
    }
  }, [
    allowAnimations,
    isResizing,
    isScrolling,
    parentRef,
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
