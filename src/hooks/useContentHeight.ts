import { useMemo } from "react";

interface UseContentHeightProps {
  height?: string | number;
  rowHeight: number;
  shouldPaginate?: boolean;
  rowsPerPage?: number;
}

export const useContentHeight = ({
  height,
  rowHeight,
  shouldPaginate,
  rowsPerPage,
}: UseContentHeightProps): number => {
  return useMemo(() => {
    // When pagination is enabled and no height is specified, use content-based height
    if (!height && shouldPaginate && rowsPerPage) {
      // Calculate height based on rows per page (plus header row)
      return rowHeight * (rowsPerPage + 1);
    }

    // Default height if none provided
    if (!height) return window.innerHeight - rowHeight;

    // Get the container element for measurement
    const container = document.querySelector(".simple-table-root");

    // Convert height string to pixels
    let totalHeightPx = 0;
    if (typeof height === "string") {
      if (height.endsWith("px")) {
        // Direct pixel value
        totalHeightPx = parseInt(height, 10);
      } else if (height.endsWith("vh")) {
        // Viewport height percentage
        const vh = parseInt(height, 10);
        totalHeightPx = (window.innerHeight * vh) / 100;
      } else if (height.endsWith("%")) {
        // Percentage of parent
        const percentage = parseInt(height, 10);
        const parentHeight = container?.parentElement?.clientHeight || window.innerHeight;
        totalHeightPx = (parentHeight * percentage) / 100;
      } else {
        // Fall back to inner height if format is unknown
        totalHeightPx = window.innerHeight;
      }
    } else {
      totalHeightPx = height as number;
    }

    // Subtract header height
    return Math.max(0, totalHeightPx - rowHeight);
  }, [height, rowHeight, shouldPaginate, rowsPerPage]);
};
