import type HeaderObject from "../../types/HeaderObject";
import { findLeafHeaders, getHeaderWidthInPixels } from "../headerWidthUtils";
import { getMaxPinnedSectionPercent } from "../../consts/column-constraints";
import { calculatePinnedWidth } from "../headerUtils";

/**
 * Recalculate widths for all sections (left, right, main)
 * Returns both constrained widths (for display) and raw content widths (for scrolling)
 */
export const recalculateAllSectionWidths = ({
  headers,
  containerWidth,
  collapsedHeaders,
}: {
  headers: HeaderObject[];
  containerWidth?: number;
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
    // Check if we have both pinned sections
    const hasPinnedLeft = leftWidth > 0;
    const hasPinnedRight = rightWidth > 0;

    // Get the appropriate max percent based on number of pinned sections
    // Use containerWidth (st-body-container width) for responsive breakpoints
    const maxPercent = getMaxPinnedSectionPercent(
      containerWidth,
      hasPinnedLeft,
      hasPinnedRight,
    );
    const maxPinnedWidth = containerWidth * maxPercent;

    // Limit each pinned section to the calculated percentage of container width
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
