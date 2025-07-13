import React, { useRef, useLayoutEffect, ReactNode } from "react";
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
  animationConfig = {},
  children,
  id,
  tableRow,
  ...props
}: AnimateProps) => {
  const { allowAnimations, isResizing } = useTableContext();
  const elementRef = useRef<HTMLDivElement>(null);
  const previousBoundsRef = useRef<DOMRect | null>(null);

  useLayoutEffect(() => {
    // Don't animate while animations are disabled
    // Don't animate while headers are being resized
    if (!elementRef.current || !allowAnimations || isResizing) {
      return;
    }

    const currentBounds = elementRef.current.getBoundingClientRect();
    const previousBounds = previousBoundsRef.current;

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

    // Only animate if position change is significant (>30px indicates column reordering)
    // or if there's a vertical change (>1px indicates row reordering)
    if (positionDelta < 30 && Math.abs(deltaY) <= 1) {
      return;
    }

    let hasPositionChanged = false;

    // Check DOM position changes
    const hasDOMPositionChanged = Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1;

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
  });

  return (
    <div ref={elementRef} data-animate-id={id} id={String(id)} {...props}>
      {children}
    </div>
  );
};

Animate.displayName = "Animate";

export default Animate;
