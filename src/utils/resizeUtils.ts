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
  header,
  headers,
  setHeaders,
  setIsResizing,
  tableBodyContainerRef,
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
  let sectionWidth = 0;

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

    // Get the appropriate width for the section being resized
    if (tableBodyContainerRef.current) {
      const fullContainerWidth = tableBodyContainerRef.current.clientWidth;

      // Calculate widths of pinned sections
      const { leftWidth, rightWidth } = recalculateAllSectionWidths({
        headers,
        containerWidth: fullContainerWidth,
        collapsedHeaders,
      });

      // Use the appropriate width based on which section is being resized
      if (header.pinned === "left") {
        sectionWidth = leftWidth;
      } else if (header.pinned === "right") {
        sectionWidth = rightWidth;
      } else {
        // Main section: full width minus pinned sections
        sectionWidth = Math.max(0, fullContainerWidth - leftWidth - rightWidth);
      }
    }
  }

  const handleMove = (clientX: number) => {
    // Calculate the width delta (how much the width has changed)
    // For right-pinned headers, delta is reversed
    const delta = header.pinned === "right" ? startX - clientX : clientX - startX;

    if (autoExpandColumns) {
      // AutoExpandColumns mode: use proportional shrinking logic
      // Get headers in the same section (left/main/right)
      const sectionHeaders = headers.filter((h) => h.pinned === header.pinned);

      // If this is a parent header with children, we need to resize the children, not the parent
      const headerToResize = childrenToResize.length > 0 ? childrenToResize[0] : header;

      handleResizeWithAutoExpand({
        delta,
        startWidth,
        resizedHeader: headerToResize,
        sectionHeaders,
        reverse,
        collapsedHeaders,
        initialWidthsMap,
        sectionWidth,
        isParentResize: childrenToResize.length > 1,
        childrenToResize,
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
 * Positive compensation = shrink columns, Negative compensation = grow columns
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
  // Handle growing columns (negative compensation)
  if (totalCompensation < 0) {
    const totalGrowth = Math.abs(totalCompensation);

    // Distribute growth proportionally based on initial widths
    const totalInitialWidth = columnsToShrink.reduce((sum, col) => {
      const initialWidth = initialWidthsMap.get(col.accessor as string) || 100;
      return sum + initialWidth;
    }, 0);

    if (totalInitialWidth === 0) return;

    columnsToShrink.forEach((col, index) => {
      const initialWidth = initialWidthsMap.get(col.accessor as string) || 100;
      const proportion = initialWidth / totalInitialWidth;
      let growth = totalGrowth * proportion;

      // Last column takes any remaining to avoid rounding errors
      if (index === columnsToShrink.length - 1) {
        const alreadyDistributed = columnsToShrink.slice(0, index).reduce((sum, c) => {
          const initW = initialWidthsMap.get(c.accessor as string) || 100;
          const currentW = typeof c.width === "number" ? c.width : 100;
          return sum + (currentW - initW);
        }, 0);
        growth = totalGrowth - alreadyDistributed;
      }

      col.width = initialWidth + growth;
    });

    return;
  }

  let remainingCompensation = totalCompensation;

  // Keep iterating until all compensation is distributed (shrinking columns)
  while (remainingCompensation > 0.5) {
    // 0.5px threshold to avoid floating point issues
    // Calculate headroom for each column (initial width - minWidth)
    // In autoExpandColumns mode, we use ABSOLUTE_MIN_COLUMN_WIDTH instead of header minWidth
    const headrooms = columnsToShrink.map((col) => {
      // Use initial width from the map (captured at drag start)
      const initialWidth = initialWidthsMap.get(col.accessor as string) || 100;
      const minWidth = ABSOLUTE_MIN_COLUMN_WIDTH;
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
      // Store remainingCompensation in a const to avoid no-loop-func warning
      const compensationToDistribute = remainingCompensation;
      columnsWithHeadroom.forEach((item, index) => {
        const proportion = item.headroom / totalHeadroom;
        let compensation = compensationToDistribute * proportion;

        // Don't shrink below minWidth
        compensation = Math.min(compensation, item.headroom);

        // Last column takes any remaining to avoid rounding errors
        if (index === columnsWithHeadroom.length - 1) {
          compensation = Math.min(
            compensationToDistribute - compensationDistributed,
            item.headroom
          );
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
        // Store remainingCompensation in a const to avoid no-loop-func warning
        const compensationToDistribute = remainingCompensation;
        const compensationPerColumn = compensationToDistribute / columnsAboveAbsoluteMin.length;

        let compensationDistributed = 0;
        columnsAboveAbsoluteMin.forEach((item, index) => {
          const maxShrink = item.minWidth - ABSOLUTE_MIN_COLUMN_WIDTH;
          let compensation = Math.min(compensationPerColumn, maxShrink);

          // Last column takes remaining
          if (index === columnsAboveAbsoluteMin.length - 1) {
            compensation = Math.min(compensationToDistribute - compensationDistributed, maxShrink);
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
  sectionHeaders,
  reverse,
  collapsedHeaders,
  initialWidthsMap,
  sectionWidth,
  isParentResize = false,
  childrenToResize = [],
}: {
  delta: number;
  startWidth: number;
  resizedHeader: HeaderObject;
  sectionHeaders: HeaderObject[];
  reverse: boolean;
  collapsedHeaders?: Set<string>;
  initialWidthsMap: Map<string, number>;
  sectionWidth: number;
  isParentResize?: boolean;
  childrenToResize?: HeaderObject[];
}): void => {
  // Special handling for parent header resize (multiple children)
  if (isParentResize && childrenToResize.length > 1) {
    const leafHeaders = getAllVisibleLeafHeaders(sectionHeaders, collapsedHeaders);

    // Find the index range of the children being resized
    const firstChildIndex = leafHeaders.findIndex(
      (h) => h.accessor === childrenToResize[0].accessor
    );
    const lastChildIndex = leafHeaders.findIndex(
      (h) => h.accessor === childrenToResize[childrenToResize.length - 1].accessor
    );

    if (firstChildIndex === -1 || lastChildIndex === -1) return;

    // Determine which columns to shrink based on position
    const isLeftmost = firstChildIndex === 0;
    const isRightmost = lastChildIndex === leafHeaders.length - 1;

    let columnsToShrink: HeaderObject[];

    if (isLeftmost) {
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

    if (delta > 0) {
      // GROWING parent: Check if we need to shrink other columns
      const newTotalWidthIfNoCompensation = currentTotalWidth + delta;

      let actualDelta = delta;
      let needsCompensation = false;

      if (newTotalWidthIfNoCompensation > sectionWidth) {
        // We would exceed section width
        needsCompensation = true;

        // Calculate max possible shrinkage
        const maxPossibleShrinkage = columnsToShrink.reduce((total, col) => {
          const initialWidth = initialWidthsMap.get(col.accessor as string) || 100;
          const canShrink = Math.max(0, initialWidth - ABSOLUTE_MIN_COLUMN_WIDTH);
          return total + canShrink;
        }, 0);

        actualDelta = Math.min(delta, maxPossibleShrinkage);
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
        const minWidth = ABSOLUTE_MIN_COLUMN_WIDTH;
        child.width = Math.max(originalWidth * scaleFactor, minWidth);
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
        ABSOLUTE_MIN_COLUMN_WIDTH * childrenToResize.length
      );
      const scaleFactor = newTotalWidth / totalOriginalWidth;

      childrenToResize.forEach((child) => {
        const originalWidth = initialWidthsMap.get(child.accessor as string) || 100;
        // In autoExpandColumns mode, ignore header minWidth to prevent horizontal overflow
        const minWidth = ABSOLUTE_MIN_COLUMN_WIDTH;
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
    // In autoExpandColumns mode, ignore header minWidth to prevent horizontal overflow
    const minWidth = ABSOLUTE_MIN_COLUMN_WIDTH;
    resizedHeader.width = Math.max(startWidth + delta, minWidth);
    return;
  }

  // In autoExpandColumns mode, ignore header minWidth to prevent horizontal overflow
  const minWidth = ABSOLUTE_MIN_COLUMN_WIDTH;

  // Calculate current total width and what it would be after resize
  const currentTotalWidth = Array.from(initialWidthsMap.values()).reduce((a, b) => a + b, 0);

  if (delta > 0) {
    // GROWING: Check if we need to shrink other columns
    const newTotalWidthIfNoCompensation = currentTotalWidth + delta;

    if (newTotalWidthIfNoCompensation <= sectionWidth) {
      // We have room to grow without shrinking others
      resizedHeader.width = startWidth + delta;
      return;
    }

    // We would exceed section width, so we need to shrink others
    // Calculate how much others can shrink
    const maxPossibleShrinkage = columnsToShrink.reduce((total, col) => {
      const initialWidth = initialWidthsMap.get(col.accessor as string) || 100;
      const canShrink = Math.max(0, initialWidth - ABSOLUTE_MIN_COLUMN_WIDTH);
      return total + canShrink;
    }, 0);

    // Limit growth to what can be compensated
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
