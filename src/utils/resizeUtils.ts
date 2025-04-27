import { RefObject } from "react";
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
 * Calculate total width for a specific section (left, right, or main)
 */
const calculateTotalSectionWidth = ({
  header,
  headers,
  newWidth,
}: {
  header: HeaderObject;
  headers: HeaderObject[];
  newWidth: number;
}): number => {
  const targetPinned = header.pinned;
  let totalWidth = 0;

  // Process headers that match the target pinned value
  headers.forEach((h) => {
    // Skip this header if it's hidden
    if (h.hide || h.pinned !== targetPinned) return;

    // If this is the header being resized, use the new width
    if (h.accessor === header.accessor) {
      totalWidth += newWidth;
    } else {
      // Get all leaf headers if this is a parent header
      const leafHeaders = findLeafHeaders(h);

      // Sum up the widths of all leaf headers
      leafHeaders.forEach((leafHeader) => {
        // Skip this leaf header if it's hidden
        if (leafHeader.hide) return;

        // If this specific leaf is the one being resized, use new width
        if (leafHeader.accessor === header.accessor) {
          totalWidth += newWidth;
        } else {
          totalWidth += getHeaderWidthInPixels(leafHeader);
        }
      });
    }
  });

  const totalWidthWithPinned = header.pinned ? calculatePinnedWidth(totalWidth) : totalWidth;
  return totalWidthWithPinned;
};

/**
 * Update the width of a section (left, right, or main)
 */
export const updateSectionWidth = ({
  header,
  headers,
  newWidth,
  setMainBodyWidth,
  setPinnedLeftWidth,
  setPinnedRightWidth,
}: {
  header: HeaderObject;
  headers: HeaderObject[];
  newWidth: number;
  setMainBodyWidth: (width: number) => void;
  setPinnedLeftWidth: (width: number) => void;
  setPinnedRightWidth: (width: number) => void;
}): void => {
  const totalSectionWidth = calculateTotalSectionWidth({
    header,
    headers,
    newWidth,
  });

  if (header.pinned === "left") {
    setPinnedLeftWidth(totalSectionWidth);
  } else if (header.pinned === "right") {
    setPinnedRightWidth(totalSectionWidth);
  } else if (!header.pinned) {
    setMainBodyWidth(totalSectionWidth);
  }
};

/**
 * Handler for when resize dragging starts
 */
export const handleResizeStart = ({
  event,
  forceUpdate,
  gridColumnEnd,
  gridColumnStart,
  header,
  headersRef,
  setIsWidthDragging,
  setMainBodyWidth,
  setPinnedLeftWidth,
  setPinnedRightWidth,
  startWidth,
}: HandleResizeStartProps): void => {
  setIsWidthDragging(true);
  event.preventDefault();
  const startX = event.clientX;
  if (!header || header.hide) return;

  // Get the minimum width for this header
  const minWidth = getHeaderMinWidth(header);

  // Get all leaf headers if this is a parent header
  const isParentHeader = gridColumnEnd - gridColumnStart > 1;
  const leafHeaders = isParentHeader ? findLeafHeaders(header) : [header];

  const handleMouseMove = (event: MouseEvent) => {
    // Calculate the width delta (how much the width has changed)
    // For right-pinned headers, delta is reversed
    const delta = header.pinned === "right" ? startX - event.clientX : event.clientX - startX;

    if (isParentHeader && leafHeaders.length > 1) {
      handleParentHeaderResize({
        delta,
        header,
        headersRef,
        leafHeaders,
        minWidth,
        setMainBodyWidth,
        setPinnedLeftWidth,
        setPinnedRightWidth,
        startWidth,
      });
    } else {
      // For leaf headers or parents with only one leaf, just adjust the width directly
      const newWidth = Math.max(startWidth + delta, minWidth);
      header.width = newWidth;

      updateSectionWidth({
        header,
        headers: headersRef.current,
        newWidth,
        setMainBodyWidth,
        setPinnedLeftWidth,
        setPinnedRightWidth,
      });
    }

    // After a header is resized, update any headers that use fractional widths
    headersRef.current.forEach((header) => {
      removeAllFractionalWidths(header);
    });

    forceUpdate();
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    setIsWidthDragging(false);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

/**
 * Handle resizing of parent headers with multiple children
 */
const handleParentHeaderResize = ({
  delta,
  header,
  headersRef,
  leafHeaders,
  minWidth,
  setMainBodyWidth,
  setPinnedLeftWidth,
  setPinnedRightWidth,
  startWidth,
}: {
  delta: number;
  header: HeaderObject;
  headersRef: RefObject<HeaderObject[]>;
  leafHeaders: HeaderObject[];
  minWidth: number;
  setMainBodyWidth: (width: number) => void;
  setPinnedLeftWidth: (width: number) => void;
  setPinnedRightWidth: (width: number) => void;
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

  // Update the section width
  updateSectionWidth({
    header,
    headers: headersRef.current,
    newWidth: newTotalWidth,
    setMainBodyWidth,
    setPinnedLeftWidth,
    setPinnedRightWidth,
  });

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
  setMainBodyWidth,
  setPinnedLeftWidth,
  setPinnedRightWidth,
}: {
  headers: HeaderObject[];
  setMainBodyWidth: (width: number) => void;
  setPinnedLeftWidth: (width: number) => void;
  setPinnedRightWidth: (width: number) => void;
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

  // Update section widths
  setPinnedLeftWidth(totalPinnedLeftWidth);
  setPinnedRightWidth(totalPinnedRightWidth);
  setMainBodyWidth(mainWidth);

  return {
    leftWidth: totalPinnedLeftWidth,
    rightWidth: totalPinnedRightWidth,
    mainWidth,
  };
};
