import { HeaderObject } from "..";
import { HandleResizeStartProps } from "../types/HandleResizeStartProps";
import { calculatePinnedWidth } from "./headerUtils";
import {
  findLeafHeaders,
  getHeaderWidthInPixels,
  removeAllFractionalWidths,
  getHeaderMinWidth,
} from "./headerWidthUtils";

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
}: HandleResizeStartProps): void => {
  event.preventDefault();
  const startX = "clientX" in event ? event.clientX : event.touches[0].clientX;
  const isTouchEvent = "touches" in event;

  if (!header || header.hide) return;

  // Set resizing state to true
  setIsResizing(true);

  // Get the minimum width for this header
  const minWidth = getHeaderMinWidth(header);

  // Get all leaf headers if this is a parent header
  const isParentHeader = gridColumnEnd - gridColumnStart > 1;
  const leafHeaders = isParentHeader ? findLeafHeaders(header) : [header];

  const handleMove = (clientX: number) => {
    // Calculate the width delta (how much the width has changed)
    // For right-pinned headers, delta is reversed
    const delta = header.pinned === "right" ? startX - clientX : clientX - startX;

    if (isParentHeader && leafHeaders.length > 1) {
      handleParentHeaderResize({
        delta,
        leafHeaders,
        minWidth,
        startWidth,
      });
    } else {
      // For leaf headers or parents with only one leaf, just adjust the width directly
      const newWidth = Math.max(startWidth + delta, minWidth);
      header.width = newWidth;
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
}: {
  delta: number;
  leafHeaders: HeaderObject[];
  minWidth: number;
  startWidth: number;
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

  // Calculate new total width with minimum constraints
  const newTotalWidth = Math.max(startWidth + delta, totalMinWidth);

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
 */
export const recalculateAllSectionWidths = ({
  headers,
}: {
  headers: HeaderObject[];
}): {
  leftWidth: number;
  rightWidth: number;
  mainWidth: number;
} => {
  let leftWidth = 0;
  let rightWidth = 0;
  let mainWidth = 0;

  headers.forEach((header) => {
    // Skip hidden headers
    if (header.hide) {
      return;
    }

    const leafHeaders = findLeafHeaders(header);
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

  // Calculate pinned widths with any additional styling
  const totalPinnedLeftWidth = calculatePinnedWidth(leftWidth);
  const totalPinnedRightWidth = calculatePinnedWidth(rightWidth);

  return {
    leftWidth: totalPinnedLeftWidth,
    rightWidth: totalPinnedRightWidth,
    mainWidth,
  };
};
