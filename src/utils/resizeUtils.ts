import { HeaderObject } from "..";
import { HandleResizeStartProps } from "../types/HandleResizeStartProps";
import {
  findLeafHeaders,
  getHeaderWidthInPixels,
  removeAllFractionalWidths,
  getHeaderMinWidth,
  getAllVisibleLeafHeaders,
} from "./headerWidthUtils";
import {
  MAX_PINNED_WIDTH_PERCENT,
  getResponsiveMaxPinnedPercent,
  ABSOLUTE_MIN_COLUMN_WIDTH,
} from "../consts/general-consts";
import { calculatePinnedWidth } from "./headerUtils";

/**
 * Calculate the maximum allowable width for a header based on container constraints
 */
const calculateMaxHeaderWidth = ({
  header,
  headers,
  collapsedHeaders,
}: {
  header: HeaderObject;
  headers: HeaderObject[];
  collapsedHeaders?: Set<string>;
}): number => {
  // Get the table container element
  const tableContainer = document.querySelector(".st-body-container") as HTMLElement;
  if (!tableContainer || tableContainer.clientWidth === 0) {
    // If no container found or invalid width, return a reasonable default value
    return 1000;
  }

  const containerWidth = tableContainer.clientWidth;
  // Use responsive max pinned percent based on viewport width for better mobile compatibility
  const maxPinnedPercent = getResponsiveMaxPinnedPercent(window.innerWidth);
  const maxPinnedSectionWidth = containerWidth * maxPinnedPercent;

  // If this is not a pinned header, don't impose a maximum width constraint
  // Main section columns can grow as needed since they have horizontal scroll
  if (!header.pinned) {
    return Infinity; // No max width limit for main section columns
  }

  // For pinned headers, calculate the current width of the pinned section (excluding the header being resized)
  const pinnedHeaders = headers.filter(
    (h) => h.pinned === header.pinned && h.accessor !== header.accessor
  );
  const currentPinnedSectionWidth = pinnedHeaders.reduce((sum, h) => {
    if (h.hide) return sum;
    const leafHeaders = findLeafHeaders(h, collapsedHeaders);
    return (
      sum +
      leafHeaders.reduce((leafSum, leafHeader) => {
        return leafSum + getHeaderWidthInPixels(leafHeader);
      }, 0)
    );
  }, 0);

  // Calculate the maximum width this header can have without exceeding the section limit
  const availableWidth = maxPinnedSectionWidth - currentPinnedSectionWidth;

  // Ensure we return at least the minimum width
  const minWidth = getHeaderMinWidth(header);

  // If available width is less than minimum, allow the minimum but log the constraint violation
  if (availableWidth < minWidth) {
    console.warn(`Header ${header.accessor} exceeds pinned section width limit`);
    return minWidth;
  }

  return availableWidth;
};

/**
 * Handler for when resize dragging starts
 */
export const handleResizeStart = ({
  event,
  gridColumnEnd,
  gridColumnStart,
  header,
  headers,
  setHeaders,
  setIsResizing,
  startWidth,
  collapsedHeaders,
  autoExpandColumns = false,
  reverse = false,
}: HandleResizeStartProps): void => {
  event.preventDefault();
  const startX = "clientX" in event ? event.clientX : event.touches[0].clientX;
  const isTouchEvent = "touches" in event;

  if (!header || header.hide) return;

  // Set resizing state to true
  setIsResizing(true);

  // Get the minimum width for this header
  const minWidth = getHeaderMinWidth(header);

  // Always work with leaf children - they are the single source of truth for widths
  const isParentHeader = header.children && header.children.length > 0;

  // Get the children that should be resized:
  // - For parents: resize only currently visible leaf children, or parent itself if no visible children
  // - For leaf headers: resize the header itself
  let childrenToResize: HeaderObject[];
  if (isParentHeader) {
    const visibleChildren = findLeafHeaders(header, collapsedHeaders);
    childrenToResize = visibleChildren.length > 0 ? visibleChildren : [header];
  } else {
    childrenToResize = [header];
  }

  // For autoExpandColumns, store the initial widths of all columns at drag start
  const initialWidthsMap = new Map<string, number>();
  if (autoExpandColumns) {
    const sectionHeaders = headers.filter((h) => h.pinned === header.pinned);
    const leafHeaders = getAllVisibleLeafHeaders(sectionHeaders, collapsedHeaders);
    leafHeaders.forEach((h) => {
      const width =
        typeof h.width === "number"
          ? h.width
          : typeof h.width === "string" && h.width.endsWith("px")
          ? parseFloat(h.width)
          : 100;
      initialWidthsMap.set(h.accessor as string, width);
    });
  }

  const handleMove = (clientX: number) => {
    // Calculate the width delta (how much the width has changed)
    // For right-pinned headers, delta is reversed
    const delta = header.pinned === "right" ? startX - clientX : clientX - startX;

    if (autoExpandColumns) {
      // AutoExpandColumns mode: use proportional shrinking logic
      // Get headers in the same section (left/main/right)
      const sectionHeaders = headers.filter((h) => h.pinned === header.pinned);

      handleResizeWithAutoExpand({
        delta,
        startWidth,
        resizedHeader: header,
        allHeaders: headers,
        sectionHeaders,
        reverse,
        collapsedHeaders,
        initialWidthsMap,
      });
    } else {
      // Normal resize mode
      // Calculate maximum allowable width based on container constraints
      const maxWidth = calculateMaxHeaderWidth({ header, headers, collapsedHeaders });

      // Simplified logic: always resize the leaf children (single source of truth)
      if (childrenToResize.length > 1) {
        // Multiple children: distribute width proportionally
        handleParentHeaderResize({
          delta,
          leafHeaders: childrenToResize,
          minWidth,
          startWidth,
          maxWidth,
        });
      } else {
        // Single child (or leaf header): direct resize
        const newWidth = Math.max(Math.min(startWidth + delta, maxWidth), minWidth);
        childrenToResize[0].width = newWidth;
      }

      // After a header is resized, update any headers that use fractional widths
      headers.forEach((header) => {
        removeAllFractionalWidths(header);
      });
    }

    const newHeaders = [...headers];
    setHeaders(newHeaders);
  };

  if (isTouchEvent) {
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      handleMove(touch.clientX);
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      setIsResizing(false);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  } else {
    const handleMouseMove = (event: MouseEvent) => {
      handleMove(event.clientX);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
};

/**
 * Handle resizing of parent headers with multiple children
 */
const handleParentHeaderResize = ({
  delta,
  leafHeaders,
  minWidth,
  startWidth,
  maxWidth,
}: {
  delta: number;
  leafHeaders: HeaderObject[];
  minWidth: number;
  startWidth: number;
  maxWidth: number;
}): void => {
  // Find the minimum width across all leaf headers
  const totalMinWidth = leafHeaders.reduce((min, header) => {
    return Math.min(min, getHeaderMinWidth(header));
  }, 40);

  // Calculate the total original width
  const totalOriginalWidth = leafHeaders.reduce((sum, header) => {
    const width = typeof header.width === "number" ? header.width : 150;
    return sum + width;
  }, 0);

  // Calculate new total width with minimum and maximum constraints
  const newTotalWidth = Math.max(Math.min(startWidth + delta, maxWidth), totalMinWidth);

  // Calculate the total width to distribute
  const totalWidthToDistribute = newTotalWidth - totalOriginalWidth;

  // Distribute the width proportionally based on original widths
  leafHeaders.forEach((header) => {
    const originalWidth = typeof header.width === "number" ? header.width : 150;
    const proportion = originalWidth / totalOriginalWidth;
    const widthIncrease = totalWidthToDistribute * proportion;
    const newWidth = Math.max(originalWidth + widthIncrease, minWidth);
    header.width = newWidth;
  });
};

/**
 * Recalculate widths for all sections (left, right, main)
 * Returns both constrained widths (for display) and raw content widths (for scrolling)
 */
export const recalculateAllSectionWidths = ({
  headers,
  containerWidth,
  maxPinnedWidthPercent = MAX_PINNED_WIDTH_PERCENT,
  collapsedHeaders,
}: {
  headers: HeaderObject[];
  containerWidth?: number;
  maxPinnedWidthPercent?: number;
  collapsedHeaders?: Set<string>;
}) => {
  let leftWidth = 0;
  let rightWidth = 0;
  let mainWidth = 0;

  headers.forEach((header) => {
    // Skip hidden headers
    if (header.hide) {
      return;
    }

    const leafHeaders = findLeafHeaders(header, collapsedHeaders);
    const totalHeaderWidth = leafHeaders.reduce((sum, leafHeader) => {
      return sum + getHeaderWidthInPixels(leafHeader);
    }, 0);

    if (header.pinned === "left") {
      leftWidth += totalHeaderWidth;
    } else if (header.pinned === "right") {
      rightWidth += totalHeaderWidth;
    } else {
      mainWidth += totalHeaderWidth;
    }
  });

  // Store the raw content widths before applying constraints (needed for scrolling)
  const leftContentWidth = leftWidth;
  const rightContentWidth = rightWidth;

  // Apply width limits if container width is provided
  if (containerWidth && containerWidth > 0) {
    const maxPinnedWidth = containerWidth * maxPinnedWidthPercent;

    // Limit each pinned section to the specified percentage of container width
    if (leftWidth > maxPinnedWidth) {
      leftWidth = maxPinnedWidth;
    }
    if (rightWidth > maxPinnedWidth) {
      rightWidth = maxPinnedWidth;
    }
  }

  return {
    leftWidth: calculatePinnedWidth(leftWidth),
    rightWidth: calculatePinnedWidth(rightWidth),
    mainWidth,
    leftContentWidth,
    rightContentWidth,
  };
};

/**
 * Distribute compensation among columns proportionally based on available headroom
 * Used in autoExpandColumns mode
 */
const distributeCompensationProportionally = ({
  columnsToShrink,
  totalCompensation,
  initialWidthsMap,
}: {
  columnsToShrink: HeaderObject[];
  totalCompensation: number;
  initialWidthsMap: Map<string, number>;
}): void => {
  let remainingCompensation = totalCompensation;

  // Keep iterating until all compensation is distributed
  while (remainingCompensation > 0.5) {
    // 0.5px threshold to avoid floating point issues
    // Calculate headroom for each column (initial width - minWidth)
    const headrooms = columnsToShrink.map((col) => {
      // Use initial width from the map (captured at drag start)
      const initialWidth = initialWidthsMap.get(col.accessor as string) || 100;
      const minWidth = (col.minWidth as number) || ABSOLUTE_MIN_COLUMN_WIDTH;
      return {
        column: col,
        headroom: Math.max(0, initialWidth - minWidth),
        initialWidth,
        minWidth,
      };
    });

    // Filter to columns with headroom > 0
    const columnsWithHeadroom = headrooms.filter((h) => h.headroom > 0);

    if (columnsWithHeadroom.length > 0) {
      // CASE 1: Some columns still have headroom above their minWidth
      // Distribute proportionally based on available headroom
      const totalHeadroom = columnsWithHeadroom.reduce((sum, h) => sum + h.headroom, 0);

      let compensationDistributed = 0;
      columnsWithHeadroom.forEach((item, index) => {
        const proportion = item.headroom / totalHeadroom;
        let compensation = remainingCompensation * proportion;

        // Don't shrink below minWidth
        compensation = Math.min(compensation, item.headroom);

        // Last column takes any remaining to avoid rounding errors
        if (index === columnsWithHeadroom.length - 1) {
          compensation = Math.min(remainingCompensation - compensationDistributed, item.headroom);
        }

        // Calculate new width from initial width minus compensation
        item.column.width = item.initialWidth - compensation;
        compensationDistributed += compensation;
      });

      remainingCompensation -= compensationDistributed;
    } else {
      // CASE 2: All columns at minWidth
      // Start shrinking minWidths equally, but not below ABSOLUTE_MIN_COLUMN_WIDTH
      const columnsAboveAbsoluteMin = headrooms.filter(
        (h) => h.minWidth > ABSOLUTE_MIN_COLUMN_WIDTH
      );

      if (columnsAboveAbsoluteMin.length > 0) {
        // Distribute equally among columns that can still shrink
        const compensationPerColumn = remainingCompensation / columnsAboveAbsoluteMin.length;

        let compensationDistributed = 0;
        columnsAboveAbsoluteMin.forEach((item, index) => {
          const maxShrink = item.minWidth - ABSOLUTE_MIN_COLUMN_WIDTH;
          let compensation = Math.min(compensationPerColumn, maxShrink);

          // Last column takes remaining
          if (index === columnsAboveAbsoluteMin.length - 1) {
            compensation = Math.min(remainingCompensation - compensationDistributed, maxShrink);
          }

          const newWidth = item.initialWidth - compensation;
          item.column.width = newWidth;
          item.column.minWidth = Math.max(newWidth, ABSOLUTE_MIN_COLUMN_WIDTH);
          compensationDistributed += compensation;
        });

        remainingCompensation -= compensationDistributed;
      } else {
        // All columns at absolute minimum - can't shrink further
        break;
      }
    }
  }
};

/**
 * Handle resize with autoExpandColumns enabled
 * Columns to the right (or left for right-pinned) shrink proportionally
 */
export const handleResizeWithAutoExpand = ({
  delta,
  startWidth,
  resizedHeader,
  allHeaders,
  sectionHeaders,
  reverse,
  collapsedHeaders,
  initialWidthsMap,
}: {
  delta: number;
  startWidth: number;
  resizedHeader: HeaderObject;
  allHeaders: HeaderObject[];
  sectionHeaders: HeaderObject[];
  reverse: boolean;
  collapsedHeaders?: Set<string>;
  initialWidthsMap: Map<string, number>;
}): void => {
  const leafHeaders = getAllVisibleLeafHeaders(sectionHeaders, collapsedHeaders);
  const resizedIndex = leafHeaders.findIndex((h) => h.accessor === resizedHeader.accessor);

  if (resizedIndex === -1) return;

  // Determine which columns to shrink based on position
  const isLeftmost = resizedIndex === 0;
  const isRightmost = resizedIndex === leafHeaders.length - 1;

  let columnsToShrink: HeaderObject[];

  if (isLeftmost) {
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
    // No columns to compensate - shouldn't happen in autoExpand mode
    // But if it does, just resize normally
    const minWidth = resizedHeader.minWidth || ABSOLUTE_MIN_COLUMN_WIDTH;
    resizedHeader.width = Math.max(startWidth + delta, minWidth as number);
    return;
  }

  // Step 1: Calculate how much the other columns can actually shrink
  const maxPossibleShrinkage = columnsToShrink.reduce((total, col) => {
    const initialWidth = initialWidthsMap.get(col.accessor as string) || 100;
    const minWidth = (col.minWidth as number) || ABSOLUTE_MIN_COLUMN_WIDTH;
    const canShrink = Math.max(0, initialWidth - ABSOLUTE_MIN_COLUMN_WIDTH);
    return total + canShrink;
  }, 0);

  // Limit delta to what can actually be compensated
  const actualDelta =
    delta > 0
      ? Math.min(delta, maxPossibleShrinkage) // Growing: limited by how much others can shrink
      : delta; // Shrinking: no limit needed

  // Step 2: Set the new width based on startWidth + actualDelta
  const newWidth = startWidth + actualDelta;
  const minWidth = (resizedHeader.minWidth as number) || ABSOLUTE_MIN_COLUMN_WIDTH;

  // Don't allow shrinking below minimum
  if (newWidth < minWidth) {
    resizedHeader.width = minWidth;
    return;
  }

  resizedHeader.width = newWidth;

  // Step 3: Distribute compensation among columns to shrink
  if (actualDelta !== 0) {
    distributeCompensationProportionally({
      columnsToShrink,
      totalCompensation: actualDelta,
      initialWidthsMap,
    });
  }

  // Step 4: Verify total width is maintained
  // Calculate the total width after resize
  const totalWidthAfterResize = leafHeaders.reduce((sum, h) => {
    const width =
      typeof h.width === "number"
        ? h.width
        : typeof h.width === "string" && h.width.endsWith("px")
        ? parseFloat(h.width)
        : 100;
    return sum + width;
  }, 0);

  // Calculate what the total should be (sum of all initial widths)
  const expectedTotal = Array.from(initialWidthsMap.values()).reduce((a, b) => a + b, 0);

  // If there's a discrepancy (due to hitting mins), redistribute to maintain total
  const discrepancy = expectedTotal - totalWidthAfterResize;
  if (Math.abs(discrepancy) > 1) {
    // Find columns that aren't at their minimum and can absorb the difference
    const flexibleColumns = leafHeaders.filter((h) => {
      if (h.accessor === resizedHeader.accessor) return false; // Don't adjust the resized column
      const currentWidth = typeof h.width === "number" ? h.width : 100;
      const minWidth = (h.minWidth as number) || ABSOLUTE_MIN_COLUMN_WIDTH;
      return currentWidth > minWidth + Math.abs(discrepancy) / leafHeaders.length;
    });

    if (flexibleColumns.length > 0) {
      const adjustmentPerColumn = discrepancy / flexibleColumns.length;
      flexibleColumns.forEach((col) => {
        const currentWidth = typeof col.width === "number" ? col.width : 100;
        col.width = currentWidth + adjustmentPerColumn;
      });
    }
  }
};
