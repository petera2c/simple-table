import React, { useRef, useLayoutEffect, ReactNode, MutableRefObject } from "react";
import usePrevious from "../../hooks/usePrevious";
import { flipElement, ANIMATION_CONFIGS, animateWithCustomCoordinates } from "./animation-utils";
import TableRow from "../../types/TableRow";
import { useTableContext } from "../../context/TableContext";
import { BUFFER_ROW_COUNT } from "../../consts/general-consts";

// Animation thresholds
const COLUMN_REORDER_THRESHOLD = 50; // px - minimum horizontal movement to trigger column reorder animation
const ROW_REORDER_THRESHOLD = 5; // px - minimum vertical movement to trigger row reorder animation
const DOM_POSITION_CHANGE_THRESHOLD = 5; // px - minimum position change to detect DOM movement

// Stagger configuration
const BASE_STAGGER_MULTIPLIER = 0.6; // Percentage of row height for base stagger spacing
const LEAVING_STAGGER_MULTIPLIER = 2.5; // Multiplier for leaving elements to spread them out dramatically
const ENTERING_STAGGER_MULTIPLIER = 1.0; // Multiplier for entering elements to keep them coordinated
const LEAVING_STAGGER_CYCLE = 15; // Number of elements before stagger pattern repeats for leaving elements
const ENTERING_STAGGER_CYCLE = 10; // Number of elements before stagger pattern repeats for entering elements
const POSITION_VARIANCE_CYCLE = 7; // Number of elements before position variance pattern repeats
const POSITION_VARIANCE_MULTIPLIER = 0.4; // Percentage of row height for additional position variance

// Dynamic distance configuration
const MIN_DYNAMIC_DISTANCE = 100; // px - minimum distance from viewport edge for animations
const MAX_DYNAMIC_DISTANCE = 900; // px - maximum distance from viewport edge for animations
const DISTANCE_SCALING_FACTOR = 80; // Factor for logarithmic scaling of dynamic distance

interface AnimateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  children: ReactNode;
  id: string;
  parentRef?: MutableRefObject<HTMLDivElement | null>;
  tableRow?: TableRow;
}
export const Animate = ({ children, id, parentRef, tableRow, ...props }: AnimateProps) => {
  const { allowAnimations, isResizing, isScrolling, rowHeight } = useTableContext();
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

    if (id === "1-name") {
      console.log(elementRef.current.getBoundingClientRect());
      console.log(fromBoundsRef.current);
    }

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

    // Only animate if position change is significant (indicates column/row reordering)
    if (positionDelta < COLUMN_REORDER_THRESHOLD && Math.abs(deltaY) <= ROW_REORDER_THRESHOLD) {
      return;
    }

    let hasPositionChanged = false;

    // Check DOM position changes
    const hasDOMPositionChanged =
      Math.abs(deltaX) > DOM_POSITION_CHANGE_THRESHOLD ||
      Math.abs(deltaY) > DOM_POSITION_CHANGE_THRESHOLD;

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
            elementRef.current.style.top = "";
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
        // Calculate buffered viewport to include rows slightly outside the actual viewport
        const bufferHeight = BUFFER_ROW_COUNT * rowHeight;
        const calculatedViewportTop = parentScrollTop - bufferHeight;
        const calculatedViewportBottom = parentScrollTop + clientHeight + bufferHeight;

        const isCurrentlyInViewport =
          fromBounds.y > calculatedViewportTop && fromBounds.y < calculatedViewportBottom;
        const isMovingIntoViewport =
          toBounds.y > calculatedViewportTop && toBounds.y < calculatedViewportBottom;
        const isMovingAboveViewport = toBounds.y < parentScrollTop;
        const isMovingBelowViewport = toBounds.y > parentScrollTop + clientHeight;

        // Calculate position-based stagger proportional to row height
        // Use position from tableRow if available, otherwise fall back to element position
        const elementPosition = tableRow?.position ?? 0;

        // Different stagger patterns for entering vs leaving elements
        const baseStagger = rowHeight * BASE_STAGGER_MULTIPLIER;

        // Calculate dynamic distance based on how far the element is from viewport
        const calculateDynamicDistance = (
          elementY: number,
          viewportTop: number,
          viewportBottom: number
        ) => {
          const distanceFromViewport = Math.min(
            Math.abs(elementY - viewportTop),
            Math.abs(elementY - viewportBottom)
          );

          // Map distance to animation offset: closer elements = smaller offset, farther = larger offset
          // Logarithmic scaling for smoother transitions
          const baseDistance = Math.min(
            MAX_DYNAMIC_DISTANCE,
            Math.max(
              MIN_DYNAMIC_DISTANCE,
              MIN_DYNAMIC_DISTANCE +
                Math.log10(Math.max(1, distanceFromViewport)) * DISTANCE_SCALING_FACTOR
            )
          );
          return baseDistance;
        };

        // Case 1: Element moving from viewport to far below viewport
        if (isCurrentlyInViewport && !isMovingIntoViewport && isMovingBelowViewport) {
          const dynamicDistance = calculateDynamicDistance(
            toBounds.y,
            parentScrollTop,
            parentScrollTop + clientHeight
          );
          // Use larger stagger for leaving elements and add position-based variance
          const leavingStagger =
            (elementPosition % LEAVING_STAGGER_CYCLE) * baseStagger * LEAVING_STAGGER_MULTIPLIER;
          // Add some additional spacing based on element position to prevent clustering
          const positionVariance =
            (elementPosition % POSITION_VARIANCE_CYCLE) *
            (rowHeight * POSITION_VARIANCE_MULTIPLIER);
          const animationEndY =
            parentScrollTop + clientHeight + dynamicDistance + leavingStagger + positionVariance;

          animateWithCustomCoordinates({
            element: elementRef.current,
            options: {
              startY: fromBounds.y,
              endY: animationEndY,
              finalY: toBounds.y, // Where element actually belongs
              duration: finalConfig.duration,
              easing: finalConfig.easing,
              onComplete: finalConfig.onComplete,
            },
          });

          return;
        }

        // Case 2: Element moving from viewport to far above viewport
        if (isCurrentlyInViewport && !isMovingIntoViewport && isMovingAboveViewport) {
          const dynamicDistance = calculateDynamicDistance(
            toBounds.y,
            parentScrollTop,
            parentScrollTop + clientHeight
          );
          // Use larger stagger for leaving elements and add position-based variance
          const leavingStagger =
            (elementPosition % LEAVING_STAGGER_CYCLE) * baseStagger * LEAVING_STAGGER_MULTIPLIER;
          // Add some additional spacing based on element position to prevent clustering
          const positionVariance =
            (elementPosition % POSITION_VARIANCE_CYCLE) *
            (rowHeight * POSITION_VARIANCE_MULTIPLIER);
          const animationEndY =
            parentScrollTop - dynamicDistance - leavingStagger - positionVariance;

          animateWithCustomCoordinates({
            element: elementRef.current,
            options: {
              startY: fromBounds.y,
              endY: animationEndY,
              finalY: toBounds.y, // Where element actually belongs
              duration: finalConfig.duration,
              easing: finalConfig.easing,
              onComplete: finalConfig.onComplete,
            },
          });

          return;
        }

        // Case 3: Element moving from below viewport into viewport
        if (
          !isCurrentlyInViewport &&
          isMovingIntoViewport &&
          fromBounds.y > parentScrollTop + clientHeight
        ) {
          const dynamicDistance = calculateDynamicDistance(
            fromBounds.y,
            parentScrollTop,
            parentScrollTop + clientHeight
          );
          // Use smaller stagger for entering elements
          const enteringStagger =
            (elementPosition % ENTERING_STAGGER_CYCLE) * baseStagger * ENTERING_STAGGER_MULTIPLIER;
          const animationStartY =
            parentScrollTop + clientHeight + dynamicDistance + enteringStagger;

          animateWithCustomCoordinates({
            element: elementRef.current,
            options: {
              startY: animationStartY,
              endY: toBounds.y,
              duration: finalConfig.duration,
              easing: finalConfig.easing,
              onComplete: finalConfig.onComplete,
            },
          });

          return;
        }

        // Case 4: Element moving from above viewport into viewport
        if (!isCurrentlyInViewport && isMovingIntoViewport && fromBounds.y < parentScrollTop) {
          const dynamicDistance = calculateDynamicDistance(
            fromBounds.y,
            parentScrollTop,
            parentScrollTop + clientHeight
          );
          // Use smaller stagger for entering elements
          const enteringStagger =
            (elementPosition % ENTERING_STAGGER_CYCLE) * baseStagger * ENTERING_STAGGER_MULTIPLIER;
          const animationStartY = parentScrollTop - dynamicDistance - enteringStagger;

          animateWithCustomCoordinates({
            element: elementRef.current,
            options: {
              startY: animationStartY,
              endY: toBounds.y,
              duration: finalConfig.duration,
              easing: finalConfig.easing,
              onComplete: finalConfig.onComplete,
            },
          });

          return;
        }
      }

      flipElement({
        element: elementRef.current,
        fromBounds,
        toBounds,
        finalConfig,
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
    rowHeight, // Include rowHeight in dependencies
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
