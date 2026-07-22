import type HeaderObject from "../../types/HeaderObject";
import type { Pinned } from "../../types/Pinned";
import { getAllVisibleLeafHeaders } from "../headerWidthUtils";
import { MIN_COLUMN_WIDTH, getMaxPinnedSectionWidth } from "../../consts/column-constraints";
import { distributeCompensationProportionally } from "./compensation";
import { isHeaderExcludedFromLayout } from "../cellUtils";

/**
 * Handle resize with autoExpandColumns enabled.
 *
 * Neighbors compensate a growing column only down to their shrink floor (their
 * natural width — declared, content-measured, or user-set). Once all
 * neighbors are at their floor, the main section keeps growing past the
 * container width and overflows into horizontal scroll instead of blocking
 * the drag. Pinned sections cannot scroll their own content, so their growth
 * stays capped by the neighbors' available surplus (plus the pinned-width
 * policy cap).
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
  sectionViewportWidth = 0,
  shrinkFloors,
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
  /** Visible viewport width of the section (main: container minus pinned). 0 when unknown. */
  sectionViewportWidth?: number;
  /** Accessor -> natural width; the shrink floor for compensating neighbors. */
  shrinkFloors?: Map<string, number>;
  startWidth: number;
}): void => {
  /** Sum of leaf widths in this section at drag start (initialWidthsMap is section-scoped). */
  const pinnedSectionWidthSum = (): number =>
    Array.from(initialWidthsMap.values()).reduce((a, b) => a + b, 0);

  /**
   * A compensating neighbor's shrink floor: its natural width (never squeezed
   * below content/declared width), clamped to its current width so a floor
   * above the painted width simply means "no surplus to give".
   */
  const floorFor = (col: HeaderObject): number => {
    const initialWidth = initialWidthsMap.get(col.accessor as string) || 100;
    const floor = Math.max(
      shrinkFloors?.get(col.accessor as string) ?? MIN_COLUMN_WIDTH,
      MIN_COLUMN_WIDTH,
    );
    return Math.min(floor, initialWidth);
  };

  const maxShrinkageOf = (cols: HeaderObject[]): number =>
    cols.reduce((total, col) => {
      const initialWidth = initialWidthsMap.get(col.accessor as string) || 100;
      return total + Math.max(0, initialWidth - floorFor(col));
    }, 0);

  /**
   * Cap positive delta only when it would grow the pinned section's *total* width past policy max.
   * Do not apply before redistributive resizes (neighbors shrink): total stays the same, so clamping
   * here would wrongly block growth when the section already sits at max width (e.g. after DOM sync).
   */
  const clampPinnedPositiveDeltaIfNetSectionGrows = (positiveDelta: number): number => {
    if (!rootPinned || containerWidth <= 0 || positiveDelta <= 0) {
      return positiveDelta;
    }
    const hasPinnedLeft = headers.some(
      (h) => h.pinned === "left" && !isHeaderExcludedFromLayout(h),
    );
    const hasPinnedRight = headers.some(
      (h) => h.pinned === "right" && !isHeaderExcludedFromLayout(h),
    );
    // The policy max (a % of the container) is the correct, sufficient constraint
    // on how wide a pinned section may grow.
    const maxSectionWidth = getMaxPinnedSectionWidth(
      containerWidth,
      hasPinnedLeft,
      hasPinnedRight,
    );
    const headroom = Math.max(0, maxSectionWidth - pinnedSectionWidthSum());
    return Math.min(positiveDelta, headroom);
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

    // The width at which the section is exactly "full". For the main section
    // prefer the real viewport so overflow (scroll) is detected; pinned
    // sections fall back to their display width.
    const fillWidth =
      !rootPinned && sectionViewportWidth > 0
        ? sectionViewportWidth
        : sectionWidth > 0
          ? Math.max(sectionWidth, currentTotalWidth)
          : currentTotalWidth + Math.abs(delta) + 1;

    if (delta > 0) {
      // GROWING parent: grow into free room first, then reclaim neighbors'
      // surplus above their natural floors. Main section may then overflow
      // into scroll; pinned sections stay capped.
      const roomToGrow = Math.max(0, fillWidth - currentTotalWidth);
      const beyondRoom = Math.max(0, delta - roomToGrow);
      const maxPossibleShrinkage =
        columnsToShrink.length > 0 ? maxShrinkageOf(columnsToShrink) : 0;
      const compensation = Math.min(beyondRoom, maxPossibleShrinkage);

      let actualDelta: number;
      if (!rootPinned) {
        // Main section: full delta always applies; growth beyond room +
        // compensation overflows into horizontal scroll.
        actualDelta = delta;
      } else if (columnsToShrink.length === 0) {
        // Pinned boundary: grow the section itself, policy-clamped.
        actualDelta = clampPinnedPositiveDeltaIfNetSectionGrows(delta);
      } else {
        // Pinned non-boundary: cannot overflow the pinned strip.
        actualDelta = Math.min(
          delta,
          clampPinnedPositiveDeltaIfNetSectionGrows(roomToGrow) + compensation,
        );
      }

      // Resize all children proportionally
      const totalOriginalWidth = childrenToResize.reduce((sum, child) => {
        return sum + (initialWidthsMap.get(child.accessor as string) || 100);
      }, 0);

      const newTotalWidth = startWidth + actualDelta;
      const scaleFactor = newTotalWidth / totalOriginalWidth;

      childrenToResize.forEach((child) => {
        const originalWidth = initialWidthsMap.get(child.accessor as string) || 100;
        const newWidth = Math.max(originalWidth * scaleFactor, MIN_COLUMN_WIDTH);
        child.width = newWidth;
      });

      if (compensation > 0 && columnsToShrink.length > 0) {
        distributeCompensationProportionally({
          columnsToShrink,
          totalCompensation: compensation,
          initialWidthsMap,
          shrinkFloors,
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
        child.width = Math.max(originalWidth * scaleFactor, MIN_COLUMN_WIDTH);
      });

      // Distribute freed space to neighbors — but only the portion that isn't
      // simply reducing an existing overflow (the section must shrink back to
      // its fill width before neighbors start growing again).
      const actualShrinkage = startWidth - newTotalWidth;
      const overflowAmount = Math.max(0, currentTotalWidth - fillWidth);
      const growCompensation = Math.max(0, actualShrinkage - overflowAmount);
      if (growCompensation > 0 && columnsToShrink.length > 0) {
        distributeCompensationProportionally({
          columnsToShrink,
          totalCompensation: -growCompensation, // Negative to grow others
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
    const appliedBoundaryDelta =
      delta > 0 ? clampPinnedPositiveDeltaIfNetSectionGrows(delta) : delta;
    resizedHeader.width = Math.max(startWidth + appliedBoundaryDelta, MIN_COLUMN_WIDTH);
    return;
  }

  // Calculate current total width and what it would be after resize
  const currentTotalWidth = Array.from(initialWidthsMap.values()).reduce((a, b) => a + b, 0);

  // The width at which the section is exactly "full". For the main section
  // prefer the real viewport so free room (e.g. after maxWidth caps) and
  // overflow are both measured against what the user actually sees.
  const fillWidth =
    !rootPinned && sectionViewportWidth > 0
      ? sectionViewportWidth
      : sectionWidth > 0
        ? Math.max(sectionWidth, currentTotalWidth)
        : currentTotalWidth + Math.abs(delta) + 1;

  if (delta > 0) {
    // GROWING: grow into free room first (no compensation needed there).
    const roomToGrow = Math.max(0, fillWidth - currentTotalWidth);

    if (delta <= roomToGrow) {
      const appliedRoomDelta = clampPinnedPositiveDeltaIfNetSectionGrows(delta);
      resizedHeader.width = startWidth + appliedRoomDelta;
      return;
    }

    // Beyond free room: reclaim neighbors' surplus above their natural floors.
    const beyondRoom = delta - roomToGrow;
    const maxPossibleShrinkage = maxShrinkageOf(columnsToShrink);
    const compensation = Math.min(beyondRoom, maxPossibleShrinkage);

    if (!rootPinned) {
      // Main section: the full delta always applies. Whatever the neighbors
      // can't absorb becomes horizontal overflow (scrollbar) instead of
      // blocking the drag.
      resizedHeader.width = startWidth + delta;
    } else {
      // Pinned sections can't scroll their own content: growth is capped at
      // free room + what neighbors can give up.
      const actualGrowth =
        clampPinnedPositiveDeltaIfNetSectionGrows(roomToGrow) + compensation;
      resizedHeader.width = startWidth + actualGrowth;
    }

    if (compensation > 0) {
      distributeCompensationProportionally({
        columnsToShrink,
        totalCompensation: compensation,
        initialWidthsMap,
        shrinkFloors,
      });
    }
  } else {
    // SHRINKING: the dragged column may go down to the hard minimum (the user
    // is explicitly overriding its width).
    const newWidth = Math.max(startWidth + delta, MIN_COLUMN_WIDTH);

    const actualShrinkage = startWidth - newWidth;

    resizedHeader.width = newWidth;

    // Freed space first reduces any existing overflow (scroll shrinks back);
    // only the remainder grows the neighbors to keep the section filled.
    const overflowAmount = Math.max(0, currentTotalWidth - fillWidth);
    const growCompensation = Math.max(0, actualShrinkage - overflowAmount);
    if (growCompensation > 0) {
      distributeCompensationProportionally({
        columnsToShrink,
        totalCompensation: -growCompensation, // Negative to grow others
        initialWidthsMap,
      });
    }
  }
};
