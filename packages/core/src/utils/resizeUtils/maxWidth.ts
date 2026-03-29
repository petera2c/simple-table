import type HeaderObject from "../../types/HeaderObject";
import { findLeafHeaders, getHeaderWidthInPixels, getHeaderMinWidth } from "../headerWidthUtils";
import { getMaxPinnedSectionPercent } from "../../consts/column-constraints";

/**
 * Calculate the maximum allowable width for a header based on container constraints
 */
export const calculateMaxHeaderWidth = ({
  header,
  headers,
  collapsedHeaders,
}: {
  header: HeaderObject;
  headers: HeaderObject[];
  collapsedHeaders?: Set<string>;
}): number => {
  // Get the table container element
  const tableContainer = document.querySelector(
    ".st-body-container",
  ) as HTMLElement;
  if (!tableContainer || tableContainer.clientWidth === 0) {
    // If no container found or invalid width, return a reasonable default value
    return 1000;
  }

  const containerWidth = tableContainer.clientWidth;

  // If this is not a pinned header, don't impose a maximum width constraint
  // Main section columns can grow as needed since they have horizontal scroll
  if (!header.pinned) {
    return Infinity; // No max width limit for main section columns
  }

  // Check if we have both pinned sections to apply appropriate constraints
  const hasPinnedLeft = headers.some((h) => h.pinned === "left" && !h.hide);
  const hasPinnedRight = headers.some((h) => h.pinned === "right" && !h.hide);

  // Get the appropriate max percent based on number of pinned sections
  // Use containerWidth (st-body-container width) for responsive breakpoints
  const maxPinnedPercent = getMaxPinnedSectionPercent(
    containerWidth,
    hasPinnedLeft,
    hasPinnedRight,
  );
  const maxPinnedSectionWidth = containerWidth * maxPinnedPercent;

  // For pinned headers, calculate the current width of the pinned section (excluding the header being resized)
  const pinnedHeaders = headers.filter(
    (h) => h.pinned === header.pinned && h.accessor !== header.accessor,
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
    console.warn(
      `Header ${header.accessor} exceeds pinned section width limit`,
    );
    return minWidth;
  }

  return availableWidth;
};
