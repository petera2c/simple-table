import type HeaderObject from "../../types/HeaderObject";
import type { Pinned } from "../../types/Pinned";
import { getAllVisibleLeafHeaders } from "../headerWidthUtils";
import { MIN_COLUMN_WIDTH, getMaxPinnedSectionWidth } from "../../consts/column-constraints";
import { distributeCompensationProportionally } from "./compensation";

/**
 * Handle resize with autoExpandColumns enabled
 * Columns to the right (or left for right-pinned) shrink proportionally
 */
export const handleResizeWithAutoExpand = ({
  childrenToResize = [],
  collapsedHeaders,
  containerWidth,
  delta,
  headers,
  initialWidthsMap,
  isParentResize = false,
  resizedHeader,
  reverse,
  rootPinned,
  sectionHeaders,
  sectionWidth,
  startWidth,
}: {
  childrenToResize?: HeaderObject[];
  collapsedHeaders?: Set<string>;
  containerWidth: number;
  delta: number;
  headers: HeaderObject[];
  initialWidthsMap: Map<string, number>;
  isParentResize?: boolean;
  resizedHeader: HeaderObject;
  reverse: boolean;
  rootPinned: Pinned | undefined;
  sectionHeaders: HeaderObject[];
  sectionWidth: number;
  startWidth: number;
}): void => {
  /** Sum of leaf widths in this section at drag start (initialWidthsMap is section-scoped). */
  const pinnedSectionWidthSum = (): number =>
    Array.from(initialWidthsMap.values()).reduce((a, b) => a + b, 0);

  /**
   * Cap positive deltas only when they would grow the pinned section's total width.
   * Do not apply before redistributive resizes (neighbors shrink), where the net total stays the same.
   */
  const clampPinnedDeltaIfNetSectionGrows = (positiveGrowDelta: number): number => {
    if (!rootPinned || containerWidth <= 0 || positiveGrowDelta <= 0) {
      return positiveGrowDelta;
    }
    const hasPinnedLeft = headers.some((h) => h.pinned === "left" && !h.hide);
    const hasPinnedRight = headers.some((h) => h.pinned === "right" && !h.hide);
    const maxSectionWidth = getMaxPinnedSectionWidth(
      containerWidth,
      hasPinnedLeft,
      hasPinnedRight,
    );
    const headroom = Math.max(0, maxSectionWidth - pinnedSectionWidthSum());
    return Math.min(positiveGrowDelta, headroom);
  };

  // Special handling for parent header resize (multiple children)
  if (isParentResize && childrenToResize.length > 1) {
    const leafHeaders = getAllVisibleLeafHeaders(sectionHeaders, collapsedHeaders);

    // Find the index range of the children being resized
    const firstChildIndex = leafHeaders.findIndex(
      (h) => h.accessor === childrenToResize[0].accessor,
    );
    const lastChildIndex = leafHeaders.findIndex(
      (h) => h.accessor === childrenToResize[childrenToResize.length - 1].accessor,
    );

    if (firstChildIndex === -1 || lastChildIndex === -1) return;

    // Determine which columns to shrink based on position
    const isLeftmost = firstChildIndex === 0;
    const isRightmost = lastChildIndex === leafHeaders.length - 1;

    // For pinned sections, when resizing the boundary column (facing the main section),
    // we should grow/shrink the pinned section itself, not compensate from siblings
    const isLeftPinnedBoundary = rootPinned === "left" && isRightmost;
    const isRightPinnedBoundary = rootPinned === "right" && isLeftmost;
    const isSectionBoundary = isLeftPinnedBoundary || isRightPinnedBoundary;

    let columnsToShrink: HeaderObject[];

    if (isSectionBoundary) {
      // At section boundary: don't compensate, just grow/shrink the pinned section
      columnsToShrink = [];
    } else if (isLeftmost) {
      // Leftmost: shrink columns to the right
      columnsToShrink = leafHeaders.slice(lastChildIndex + 1);
    } else if (isRightmost) {
      // Rightmost: shrink columns to the left
      columnsToShrink = leafHeaders.slice(0, firstChildIndex);
    } else {
      // Middle: shrink based on reverse flag
      columnsToShrink = reverse
        ? leafHeaders.slice(0, firstChildIndex)
        : leafHeaders.slice(lastChildIndex + 1);
    }

    const currentTotalWidth = Array.from(initialWidthsMap.values()).reduce((a, b) => a + b, 0);

    const effectiveSectionWidth =
      sectionWidth > 0
        ? Math.max(sectionWidth, currentTotalWidth)
        : currentTotalWidth + Math.abs(delta) + 1;

    if (delta > 0) {
      // GROWING parent: Check if we need to shrink other columns
      let actualDelta = delta;
      let needsCompensation = false;

      // If at section boundary (columnsToShrink is empty), allow unlimited growth
      if (columnsToShrink.length > 0) {
        const newTotalWidthIfNoCompensation = currentTotalWidth + delta;

        if (newTotalWidthIfNoCompensation > effectiveSectionWidth) {
          // We would exceed effective section width
          needsCompensation = true;

          // Calculate max possible shrinkage
          const maxPossibleShrinkage = columnsToShrink.reduce((total, col) => {
            const initialWidth = initialWidthsMap.get(col.accessor as string) || 100;
            const canShrink = Math.max(0, initialWidth - MIN_COLUMN_WIDTH);
            return total + canShrink;
          }, 0);

          actualDelta = Math.min(delta, maxPossibleShrinkage);
        }
      }

      if (delta > 0 && !needsCompensation) {
        actualDelta = clampPinnedDeltaIfNetSectionGrows(actualDelta);
      }

      // Resize all children proportionally
      const totalOriginalWidth = childrenToResize.reduce((sum, child) => {
        return sum + (initialWidthsMap.get(child.accessor as string) || 100);
      }, 0);

      const newTotalWidth = startWidth + actualDelta;
      const scaleFactor = newTotalWidth / totalOriginalWidth;

      childrenToResize.forEach((child) => {
        const originalWidth = initialWidthsMap.get(child.accessor as string) || 100;
        // In autoExpandColumns mode, ignore header minWidth to prevent horizontal overflow
        const minWidth = MIN_COLUMN_WIDTH;
        const newWidth = Math.max(originalWidth * scaleFactor, minWidth);
        child.width = newWidth;
      });

      // Compensate other columns only if needed
      if (needsCompensation && actualDelta > 0 && columnsToShrink.length > 0) {
        distributeCompensationProportionally({
          columnsToShrink,
          totalCompensation: actualDelta,
          initialWidthsMap,
        });
      }
    } else {
      // SHRINKING parent: Distribute freed space
      const totalOriginalWidth = childrenToResize.reduce((sum, child) => {
        return sum + (initialWidthsMap.get(child.accessor as string) || 100);
      }, 0);

      const newTotalWidth = Math.max(
        startWidth + delta,
        MIN_COLUMN_WIDTH * childrenToResize.length,
      );
      const scaleFactor = newTotalWidth / totalOriginalWidth;

      childrenToResize.forEach((child) => {
        const originalWidth = initialWidthsMap.get(child.accessor as string) || 100;
        // In autoExpandColumns mode, ignore header minWidth to prevent horizontal overflow
        const minWidth = MIN_COLUMN_WIDTH;
        child.width = Math.max(originalWidth * scaleFactor, minWidth);
      });

      // Distribute freed space
      const actualShrinkage = startWidth - newTotalWidth;
      if (actualShrinkage > 0 && columnsToShrink.length > 0) {
        distributeCompensationProportionally({
          columnsToShrink,
          totalCompensation: -actualShrinkage, // Negative to grow others
          initialWidthsMap,
        });
      }
    }

    return;
  }

  const leafHeaders = getAllVisibleLeafHeaders(sectionHeaders, collapsedHeaders);
  const resizedIndex = leafHeaders.findIndex((h) => h.accessor === resizedHeader.accessor);

  if (resizedIndex === -1) return;

  // Determine which columns to shrink based on position
  const isLeftmost = resizedIndex === 0;
  const isRightmost = resizedIndex === leafHeaders.length - 1;

  // For pinned sections, when resizing the boundary column (facing the main section),
  // we should grow/shrink the pinned section itself, not compensate from siblings
  const isLeftPinnedBoundary = rootPinned === "left" && isRightmost;
  const isRightPinnedBoundary = rootPinned === "right" && isLeftmost;
  const isSectionBoundary = isLeftPinnedBoundary || isRightPinnedBoundary;

  let columnsToShrink: HeaderObject[];

  if (isSectionBoundary) {
    // At section boundary: don't compensate, just grow/shrink the pinned section
    columnsToShrink = [];
  } else if (isLeftmost) {
    // Leftmost: always shrink to the right
    columnsToShrink = leafHeaders.slice(resizedIndex + 1);
  } else if (isRightmost) {
    // Rightmost: always shrink to the left
    columnsToShrink = leafHeaders.slice(0, resizedIndex);
  } else {
    // Middle columns:
    // - If reverse (right-pinned): shrink left
    // - Otherwise: shrink right
    columnsToShrink = reverse
      ? leafHeaders.slice(0, resizedIndex)
      : leafHeaders.slice(resizedIndex + 1);
  }

  if (columnsToShrink.length === 0) {
    // No columns to compensate - this happens when resizing a boundary column of a pinned section
    // In this case, just resize normally to grow/shrink the pinned section itself
    // In autoExpandColumns mode, ignore header minWidth to prevent horizontal overflow
    const minWidth = MIN_COLUMN_WIDTH;
    const appliedBoundaryDelta = delta > 0 ? clampPinnedDeltaIfNetSectionGrows(delta) : delta;
    resizedHeader.width = Math.max(startWidth + appliedBoundaryDelta, minWidth);
    return;
  }

  // In autoExpandColumns mode, ignore header minWidth to prevent horizontal overflow
  const minWidth = MIN_COLUMN_WIDTH;

  // Calculate current total width and what it would be after resize
  const currentTotalWidth = Array.from(initialWidthsMap.values()).reduce((a, b) => a + b, 0);

  // Use effective section width: never compress below current total; when unknown (0) allow growth without shrinking others
  const effectiveSectionWidth =
    sectionWidth > 0
      ? Math.max(sectionWidth, currentTotalWidth)
      : currentTotalWidth + Math.abs(delta) + 1;

  if (delta > 0) {
    // GROWING: Check if we need to shrink other columns
    const newTotalWidthIfNoCompensation = currentTotalWidth + delta;

    if (newTotalWidthIfNoCompensation <= effectiveSectionWidth) {
      // We have room to grow without shrinking others
      const appliedRoomDelta = clampPinnedDeltaIfNetSectionGrows(delta);
      resizedHeader.width = startWidth + appliedRoomDelta;
      return;
    }

    // We would exceed effective section width, so we need to shrink others
    // Limit growth to what keeps total at or below effectiveSectionWidth
    // Calculate how much others can shrink
    const maxPossibleShrinkage = columnsToShrink.reduce((total, col) => {
      const initialWidth = initialWidthsMap.get(col.accessor as string) || 100;
      const canShrink = Math.max(0, initialWidth - MIN_COLUMN_WIDTH);
      return total + canShrink;
    }, 0);

    const actualGrowth = Math.min(delta, maxPossibleShrinkage);
    resizedHeader.width = startWidth + actualGrowth;
    // Shrink other columns by the amount needed
    if (actualGrowth > 0) {
      distributeCompensationProportionally({
        columnsToShrink,
        totalCompensation: actualGrowth,
        initialWidthsMap,
      });
    }
  } else {
    // SHRINKING: Distribute the freed space to other columns
    const newWidth = Math.max(startWidth + delta, minWidth);

    const actualShrinkage = startWidth - newWidth;

    resizedHeader.width = newWidth;
    // Distribute the freed space (negative compensation = grow others)
    if (actualShrinkage > 0) {
      distributeCompensationProportionally({
        columnsToShrink,
        totalCompensation: -actualShrinkage, // Negative to grow others
        initialWidthsMap,
      });
    }
  }
};
