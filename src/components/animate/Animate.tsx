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

    useLayoutEffect(() => {
      if (!elementRef.current || disabled) {
        return;
      }

      const headerBounds = document
        .getElementById(getCellId({ accessor: header.accessor, rowId: "header" }))
        ?.getBoundingClientRect();
      const containerBounds = containerRef.current?.getBoundingClientRect();

      const calculatedTopPosition =
        // Calculate the top position of the row
        calculateRowTopPosition({
          position: tableRow.position,
          rowHeight,
        }) +
        // Subtract the container's y position to get the correct position relative to the container
        (containerBounds?.y ?? 0) -
        // Subtract the container's scrollTop to get the correct position relative to the container
        (containerRef.current?.scrollTop ?? 0);

      const calculatedPreviousTopPosition =
        // Calculate the top position of the row
        calculateRowTopPosition({
          position: tableRow.previousPosition,
          rowHeight,
        }) +
        // Subtract the container's y position to get the correct position relative to the container
        (containerBounds?.y ?? 0) -
        // Subtract the container's scrollTop to get the correct position relative to the container
        (containerRef.current?.scrollTop ?? 0);

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
      let previousCalculatedBounds = {
        y: calculatedPreviousTopPosition,
        x: headerBounds?.x ?? 0,
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
      const hasDOMPositionChanged = !!(
        Math.abs(calculatedBounds.x - previousCalculatedBounds.x) > 1 ||
        Math.abs(calculatedBounds.y - previousCalculatedBounds.y) > 1
      );

      hasPositionChanged = hasDOMPositionChanged;

      if (hasPositionChanged) {
        // Merge animation config with defaults
        const finalConfig = {
          ...DEFAULT_ANIMATION_CONFIG,
          ...animationConfig,
        };

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
