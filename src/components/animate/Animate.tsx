import React, { useRef, useLayoutEffect, ReactNode, forwardRef, RefObject } from "react";
import { FlipAnimationOptions } from "./types";
import { flipElement, DEFAULT_ANIMATION_CONFIG } from "./animation-utils";
import TableRow from "../../types/TableRow";
import { getCellId } from "../../utils/cellUtils";
import HeaderObject from "../../types/HeaderObject";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";
import { useTableContext } from "../../context/TableContext";

interface AnimateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  animationConfig?: FlipAnimationOptions;
  children: ReactNode;
  containerRef: RefObject<HTMLDivElement | null>;
  disabled?: boolean;
  header: HeaderObject;
  id: string | number;
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
      containerRef,
      ...props
    },
    forwardedRef
  ) => {
    const { previousHeadersRectBounds, rowHeight, isResizing } = useTableContext();
    const elementRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      // Don't animate while animations are disabled
      // Don't animate while headers are being resized
      if (!elementRef.current || disabled || isResizing) {
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
      const previousHeadersBounds = previousHeadersRectBounds.current;

      // If there's no previous bound data, don't animate (prevents first render animations)
      const previousBound = previousHeadersBounds.get(header.accessor);
      if (!previousBound) {
        return;
      }

      let previousX = previousBound.x;

      // Check if this is likely a structural change vs scroll noise
      // If row position hasn't changed but there's a horizontal delta, it's likely scroll noise
      const isRowPositionChange = tableRow.position !== tableRow.previousPosition;
      const headerPositionDelta = Math.abs((headerBounds?.x ?? 0) - previousX);

      // Only animate if:
      // 1. Row position has changed (indicates structural change), OR
      // 2. Header position change is significant (>30px indicates column reordering)
      if (!isRowPositionChange && headerPositionDelta < 30) {
        return;
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
        toJSON: () => ({
          y: calculatedPreviousTopPosition,
          x: previousX,
          width: headerBounds?.width ?? 0,
          height: headerBounds?.height ?? 0,
          bottom: headerBounds?.bottom ?? 0,
          left: headerBounds?.left ?? 0,
          right: headerBounds?.right ?? 0,
          top: calculatedPreviousTopPosition,
        }),
      };

      let hasPositionChanged = false;

      // Check DOM position changes
      const deltaY = calculatedBounds.y - previousCalculatedBounds.y;
      const deltaX = calculatedBounds.x - previousCalculatedBounds.x;
      const hasDOMPositionChanged = Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1;

      hasPositionChanged = hasDOMPositionChanged;

      if (hasPositionChanged) {
        if (tableRow.row.id === 1) {
          console.log("\n\n");
          console.log("timestamp", new Date().toISOString());
          console.log("tableRow", JSON.stringify(tableRow, null, 2));
          console.log("calculatedBounds", JSON.stringify(calculatedBounds, null, 2));
          console.log(
            "previousCalculatedBounds",
            JSON.stringify(previousCalculatedBounds, null, 2)
          );
          console.log("RAW VALUES:");
          console.log("  calculatedBounds.x:", calculatedBounds.x);
          console.log("  previousCalculatedBounds.x:", previousCalculatedBounds.x);
          console.log("  headerBounds?.x:", headerBounds?.x);
          console.log("  previousX:", previousX);
          console.log("  isRowPositionChange:", isRowPositionChange);
          console.log("  headerPositionDelta:", headerPositionDelta);
          console.log("deltaX", deltaX);
          console.log("deltaY", deltaY);
          console.log("hasDOMPositionChanged", hasDOMPositionChanged);
          console.log("hasPositionChanged", hasPositionChanged);
        }
        // Merge animation config with defaults
        const finalConfig = {
          ...DEFAULT_ANIMATION_CONFIG,
          ...animationConfig,
        };

        // Start new animation (this will interrupt any ongoing animation)
        flipElement(elementRef.current, previousCalculatedBounds, finalConfig);
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
