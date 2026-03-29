import type HeaderObject from "../../types/HeaderObject";
import { getHeaderMinWidth } from "../headerWidthUtils";

/**
 * Handle resizing of parent headers with multiple children
 */
export const handleParentHeaderResize = ({
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
  const newTotalWidth = Math.max(
    Math.min(startWidth + delta, maxWidth),
    totalMinWidth,
  );

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
