import React, { useRef, useLayoutEffect, ReactNode, forwardRef, RefObject } from "react";
import { FlipAnimationOptions } from "./types";
import { flipElement, DEFAULT_ANIMATION_CONFIG } from "./animation-utils";
import TableRow from "../../types/TableRow";
import { getCellId } from "../../utils/cellUtils";
import HeaderObject from "../../types/HeaderObject";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";
import { useTableContext } from "../../context/TableContext";

// Utility function to flatten nested headers to get all leaf columns
const flattenHeaders = (headers: HeaderObject[]): HeaderObject[] => {
  const flattened: HeaderObject[] = [];

  for (const header of headers) {
    if (header.children && header.children.length > 0) {
      // If header has children, recursively flatten them
      flattened.push(...flattenHeaders(header.children));
    } else {
      // If no children, this is a leaf node (actual column)
      flattened.push(header);
    }
  }

  return flattened;
};

interface AnimateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  animationConfig?: FlipAnimationOptions;
  children: ReactNode;
  containerRef: RefObject<HTMLDivElement | null>;
  disabled?: boolean;
  header: HeaderObject;
  id: string | number;
  rowHeight: number;
  tableRow: TableRow;
}
export const Animate = forwardRef<HTMLDivElement, AnimateProps>(
  (
    {
      id,
      animationConfig = {},
      disabled = false,
      children,
      tableRow,
      header,
      rowHeight,
      containerRef,
      ...props
    },
    forwardedRef
  ) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const { headers, previousHeaders } = useTableContext();

    useLayoutEffect(() => {
      if (!elementRef.current || disabled) {
        return;
      }

      const headerBounds = document
        .getElementById(getCellId({ accessor: header.accessor, rowId: "header" }))
        ?.getBoundingClientRect();
      const containerBounds = containerRef.current?.getBoundingClientRect();

      // Calculate current position
      const calculatedTopPosition =
        calculateRowTopPosition({
          position: tableRow.position,
          rowHeight,
        }) +
        (containerBounds?.y ?? 0) -
        (containerRef.current?.scrollTop ?? 0);

      // Calculate previous position, but clamp to viewport edges for off-screen rows
      let calculatedPreviousTopPosition =
        calculateRowTopPosition({
          position: tableRow.previousPosition,
          rowHeight,
        }) +
        (containerBounds?.y ?? 0) -
        (containerRef.current?.scrollTop ?? 0);

      // For virtualized table animations: clamp previous position to viewport edges
      const containerHeight = containerRef.current?.clientHeight ?? 0;
      const viewportTop = containerBounds?.y ?? 0;
      const viewportBottom = viewportTop + containerHeight;

      // Store original position for logging
      const originalPreviousTopPosition = calculatedPreviousTopPosition;

      // If previous position was way above viewport, start animation from just above
      if (calculatedPreviousTopPosition < viewportTop - rowHeight * 2) {
        calculatedPreviousTopPosition = viewportTop - rowHeight;
      }
      // If previous position was way below viewport, start animation from just below
      else if (calculatedPreviousTopPosition > viewportBottom + rowHeight * 2) {
        calculatedPreviousTopPosition = viewportBottom;
      }

      const calculatedBounds: DOMRect = {
        y: calculatedTopPosition,
        x: headerBounds?.x ?? 0,
        width: headerBounds?.width ?? 0,
        height: headerBounds?.height ?? 0,
        bottom: headerBounds?.bottom ?? 0,
        left: headerBounds?.left ?? 0,
        right: headerBounds?.right ?? 0,
        top: calculatedTopPosition,
        toJSON: () => calculatedBounds,
      };
      // Calculate previous X position using flattened previousHeaders
      let previousX = headerBounds?.x ?? 0; // Default to current X if no previous headers

      if (previousHeaders && previousHeaders.length > 0) {
        // Flatten both current and previous headers to get all leaf columns
        const flattenedPreviousHeaders = flattenHeaders(previousHeaders);
        const flattenedCurrentHeaders = flattenHeaders(headers);

        const previousHeaderIndex = flattenedPreviousHeaders.findIndex(
          (h) => h.accessor === header.accessor
        );
        const currentHeaderIndex = flattenedCurrentHeaders.findIndex(
          (h) => h.accessor === header.accessor
        );

        // Only log if column position actually changed
        const columnOrderChanged = previousHeaderIndex !== currentHeaderIndex;

        if (previousHeaderIndex !== -1) {
          // Calculate X position based on previous headers order and their actual DOM widths
          const headerPadding = 16; // Assuming standard padding
          let calculatedPreviousX = headerPadding;

          // Get the actual computed widths from the DOM for all previous headers
          for (let i = 0; i < previousHeaderIndex; i++) {
            const prevHeader = flattenedPreviousHeaders[i];
            const headerElement = document.getElementById(
              getCellId({ accessor: prevHeader.accessor, rowId: "header" })
            );

            if (headerElement) {
              const computedWidth = headerElement.getBoundingClientRect().width;
              calculatedPreviousX += computedWidth;
            } else {
              // Fallback: try to parse width as number, or use a default
              const numericWidth =
                typeof prevHeader.width === "number"
                  ? prevHeader.width
                  : parseFloat(String(prevHeader.width)) || 150; // Default fallback width
              calculatedPreviousX += numericWidth;
            }
          }

          // Only log for columns that actually changed order
          if (columnOrderChanged) {
            console.log(
              `🎬 Column Reorder: ${header.accessor} moved from position ${previousHeaderIndex} to ${currentHeaderIndex}`,
              JSON.stringify({
                previousX: calculatedPreviousX,
                currentX: headerBounds?.x,
                deltaX: (headerBounds?.x ?? 0) - calculatedPreviousX,
              })
            );
          }

          previousX = calculatedPreviousX;
        }
      }

      let previousCalculatedBounds = {
        y: calculatedPreviousTopPosition,
        x: previousX,
        width: headerBounds?.width ?? 0,
        height: headerBounds?.height ?? 0,
        bottom: headerBounds?.bottom ?? 0,
        left: headerBounds?.left ?? 0,
        right: headerBounds?.right ?? 0,
        top: calculatedPreviousTopPosition,
        toJSON: () => calculatedBounds,
      };

      let hasPositionChanged = false;

      // Check DOM position changes
      const deltaY = calculatedBounds.y - previousCalculatedBounds.y;
      const deltaX = calculatedBounds.x - previousCalculatedBounds.x;
      const hasDOMPositionChanged = Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1;

      hasPositionChanged = hasDOMPositionChanged;

      if (hasPositionChanged) {
        // Log animation trigger with focus on horizontal movement
        const hasHorizontalMovement = Math.abs(deltaX) > 1;

        if (hasHorizontalMovement) {
          console.log(
            `🎬 HORIZONTAL ANIMATION: ${header.accessor}`,
            JSON.stringify({
              deltaX: deltaX,
              deltaY: deltaY,
              previousX: previousCalculatedBounds.x,
              currentX: calculatedBounds.x,
            })
          );
        }

        // Merge animation config with defaults
        const finalConfig = {
          ...DEFAULT_ANIMATION_CONFIG,
          ...animationConfig,
        };

        // Debug the flipElement call for horizontal animations
        if (hasHorizontalMovement) {
          console.log(
            `🎬 CALLING FLIP ELEMENT: ${header.accessor}`,
            JSON.stringify({
              elementId: String(id),
              firstRect: {
                x: previousCalculatedBounds.x,
                y: previousCalculatedBounds.y,
                width: previousCalculatedBounds.width,
                height: previousCalculatedBounds.height,
              },
              elementExists: !!elementRef.current,
            })
          );
        }

        // Start new animation (this will interrupt any ongoing animation)
        flipElement(elementRef.current, previousCalculatedBounds, finalConfig).catch(() => {
          // Handle animation errors gracefully
        });
      }
    });

    // Combine internal ref with forwarded ref
    const combinedRef = (node: HTMLDivElement | null) => {
      // Set internal ref
      elementRef.current = node;

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
