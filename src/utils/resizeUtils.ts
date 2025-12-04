import { HeaderObject } from "..";
import { HandleResizeStartProps } from "../types/HandleResizeStartProps";
import {
  findLeafHeaders,
  getHeaderWidthInPixels,
  removeAllFractionalWidths,
  getHeaderMinWidth,
} from "./headerWidthUtils";
import { MAX_PINNED_WIDTH_PERCENT, getResponsiveMaxPinnedPercent } from "../consts/general-consts";
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

  const handleMove = (clientX: number) => {
    // Calculate the width delta (how much the width has changed)
    // For right-pinned headers, delta is reversed
    const delta = header.pinned === "right" ? startX - clientX : clientX - startX;

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
