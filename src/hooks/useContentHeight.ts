import { useMemo } from "react";
import { VIRTUALIZATION_THRESHOLD } from "../consts/general-consts";

interface UseContentHeightProps {
  height?: string | number;
  maxHeight?: string | number;
  rowHeight: number;
  shouldPaginate?: boolean;
  rowsPerPage?: number;
  totalRowCount: number;
  headerHeight?: number;
  footerHeight?: number;
}

/**
 * Converts a height value (string or number) to pixels
 */
const convertHeightToPixels = (heightValue: string | number): number => {
  // Get the container element for measurement
  const container = document.querySelector(".simple-table-root");

  if (typeof heightValue === "string") {
    if (heightValue.endsWith("px")) {
      return parseInt(heightValue, 10);
    } else if (heightValue.endsWith("vh")) {
      const vh = parseInt(heightValue, 10);
      return (window.innerHeight * vh) / 100;
    } else if (heightValue.endsWith("%")) {
      const percentage = parseInt(heightValue, 10);
      const parentHeight = container?.parentElement?.clientHeight;
      if (!parentHeight || parentHeight < 50) {
        return 0; // Invalid parent height
      }
      return (parentHeight * percentage) / 100;
    } else {
      // Fall back to inner height if format is unknown
      return window.innerHeight;
    }
  } else {
    return heightValue as number;
  }
};

export const useContentHeight = ({
  height,
  maxHeight,
  rowHeight,
  shouldPaginate,
  rowsPerPage,
  totalRowCount,
  headerHeight,
  footerHeight,
}: UseContentHeightProps): number | undefined => {
  return useMemo(() => {
    // If maxHeight is provided, it takes precedence over height
    if (maxHeight) {
      const maxHeightPx = convertHeightToPixels(maxHeight);

      // If conversion failed (e.g., invalid parent height for %), disable virtualization
      if (maxHeightPx === 0) {
        return undefined;
      }

      // Calculate actual content height needed
      const actualHeaderHeight = headerHeight || rowHeight;
      const actualFooterHeight = footerHeight || 0;
      const actualContentHeight =
        actualHeaderHeight + totalRowCount * rowHeight + actualFooterHeight;

      // If content fits within maxHeight OR row count is below threshold, disable virtualization
      if (actualContentHeight <= maxHeightPx || totalRowCount < VIRTUALIZATION_THRESHOLD) {
        return undefined;
      }

      // Content exceeds maxHeight and we have enough rows - enable virtualization
      // Subtract header height to get the scrollable content area height
      return Math.max(0, maxHeightPx - actualHeaderHeight);
    }

    // When pagination is enabled and no height is specified, use content-based height
    if (!height && shouldPaginate && rowsPerPage) {
      // Calculate height based on rows per page (plus header row)
      return rowHeight * (rowsPerPage + 1);
    }

    // When no height is specified and not paginating, return undefined to disable virtualization
    if (!height) return undefined;

    // Convert height to pixels
    const totalHeightPx = convertHeightToPixels(height);

    // If conversion failed, disable virtualization
    if (totalHeightPx === 0) {
      return undefined;
    }

    // Subtract header height
    return Math.max(0, totalHeightPx - rowHeight);
  }, [
    height,
    maxHeight,
    rowHeight,
    shouldPaginate,
    rowsPerPage,
    totalRowCount,
    headerHeight,
    footerHeight,
  ]);
};
