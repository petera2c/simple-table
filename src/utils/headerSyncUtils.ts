import HeaderObject from "../types/HeaderObject";
import { getHeaderWidthInPixels } from "./headerWidthUtils";

/**
 * Synchronize all header widths in the hierarchy to ensure consistency
 * This function handles multi-level hierarchies and ensures that:
 * 1. Parent headers are at least as wide as the sum of their children
 * 2. Child headers take up at least their proportional share of parent width
 * 3. Changes propagate both up and down the hierarchy
 * 4. During resize operations, allows manual width decreases
 */
export const synchronizeHeaderWidths = (
  allHeaders: HeaderObject[],
  isResizing: boolean = false
): void => {
  // First pass: Update parent widths based on children (bottom-up)
  const updateParentsBottomUp = (headers: HeaderObject[]): void => {
    headers.forEach((header) => {
      if (header.children && header.children.length > 0) {
        // Recursively update children first
        updateParentsBottomUp(header.children);

        // Calculate total width of visible children
        const totalChildrenWidth = header.children
          .filter((child) => !child.hide)
          .reduce((sum, child) => sum + getHeaderWidthInPixels(child), 0);

        // Update parent width if children exceed it
        const currentParentWidth = getHeaderWidthInPixels(header);
        if (totalChildrenWidth > currentParentWidth) {
          header.width = totalChildrenWidth;
        }
      }
    });
  };

  // Second pass: Update children widths based on parents (top-down)
  // Only distribute extra space during initial rendering, not during resize
  const updateChildrenTopDown = (headers: HeaderObject[]): void => {
    if (isResizing) {
      // During resize, skip the top-down redistribution to allow manual decreases
      return;
    }

    headers.forEach((header) => {
      if (header.children && header.children.length > 0) {
        const parentWidth = getHeaderWidthInPixels(header);
        const visibleChildren = header.children.filter((child) => !child.hide);

        if (visibleChildren.length > 0) {
          // Calculate current total children width
          const currentChildrenTotal = visibleChildren.reduce(
            (sum, child) => sum + getHeaderWidthInPixels(child),
            0
          );

          // If parent is wider than children, distribute the extra space
          if (parentWidth > currentChildrenTotal) {
            const extraSpace = parentWidth - currentChildrenTotal;
            const spacePerChild = extraSpace / visibleChildren.length;

            visibleChildren.forEach((child) => {
              const currentChildWidth = getHeaderWidthInPixels(child);
              child.width = currentChildWidth + spacePerChild;
            });
          }

          // Recursively update grandchildren
          updateChildrenTopDown(header.children);
        }
      }
    });
  };

  // Execute both passes
  updateParentsBottomUp(allHeaders);
  updateChildrenTopDown(allHeaders);
};
