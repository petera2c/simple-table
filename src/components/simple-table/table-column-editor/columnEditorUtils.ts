import HeaderObject, { Accessor } from "../../../types/HeaderObject";
import { ColumnVisibilityState } from "../../../types/ColumnVisibilityTypes";

// Find all parents for a given header to ensure they're visible
export const findAndMarkParentsVisible = (
  headers: HeaderObject[],
  childAccessor: Accessor,
  visited: Set<string> = new Set()
) => {
  for (const header of headers) {
    // Skip if already processed this header
    if (visited.has(header.accessor)) continue;
    visited.add(header.accessor);

    // Check if this header has the child we're looking for
    if (header.children && header.children.length > 0) {
      // Check direct children
      const hasDirectChild = header.children.some((child) => child.accessor === childAccessor);

      // Or recurse deeper to find in nested children
      let hasNestedChild = false;
      if (!hasDirectChild) {
        for (const child of header.children) {
          findAndMarkParentsVisible([child], childAccessor, visited);
          // If this child is now visible after recursion, it means it's in the path
          if (child.hide === false) {
            hasNestedChild = true;
            break;
          }
        }
      }

      // If this header is a parent (direct or indirect) of the target child, make it visible
      if (hasDirectChild || hasNestedChild) {
        header.hide = false;
      }
    }
  }
};

export const areAllChildrenHidden = (children: HeaderObject[]) => {
  return children.every((child) => child.hide);
};

// Update parent headers based on children's state
export const updateParentHeaders = (headers: HeaderObject[]) => {
  // Process each header
  headers.forEach((header) => {
    // If it has children, check if all children are hidden
    if (header.children && header.children.length > 0) {
      // First update any nested children
      updateParentHeaders(header.children);

      // Then check if all children are now hidden
      const allChildrenHidden = areAllChildrenHidden(header.children);

      // Update this parent if all children are hidden
      if (allChildrenHidden) {
        header.hide = true;
      }
    }
  });
};

// Build column visibility state from headers (recursively processes children)
export const buildColumnVisibilityState = (headers: HeaderObject[]): ColumnVisibilityState => {
  const visibilityState: ColumnVisibilityState = {};

  const processHeader = (header: HeaderObject) => {
    // Set visibility for this header (true = visible, false = hidden)
    visibilityState[header.accessor] = !header.hide;

    // Process children recursively
    if (header.children && header.children.length > 0) {
      header.children.forEach(processHeader);
    }
  };

  headers.forEach(processHeader);
  return visibilityState;
};

// Type for flattened header with metadata
export type FlattenedHeader = {
  header: HeaderObject;
  visualIndex: number;
  depth: number;
  parent: HeaderObject | null;
};

export const findClosestValidSeparatorIndex = ({
  flattenedHeaders,
  draggingRow,
  hoveredRowIndex,
  isTopHalfOfRow,
}: {
  flattenedHeaders: FlattenedHeader[];
  draggingRow: FlattenedHeader;
  hoveredRowIndex: number;
  isTopHalfOfRow: boolean;
}): number | null => {
  const hoveredRow = flattenedHeaders[hoveredRowIndex];

  if (hoveredRow.depth === draggingRow.depth) {
    if (hoveredRow.parent?.accessor !== draggingRow.parent?.accessor) {
      return null;
    }

    if (isTopHalfOfRow || hoveredRow.header.children) {
      return hoveredRowIndex - 1;
    } else {
      return hoveredRowIndex;
    }
  } else if (draggingRow.depth < hoveredRow.depth) {
    // We need to go up the tree to find a depth match
    // Start with the current hovered row and walk up the parent chain
    let currentRow = hoveredRow;
    let currentIndex = hoveredRowIndex;

    // Recursively find the ancestor at the same depth as draggingRow
    while (currentRow.parent && currentRow.depth > draggingRow.depth) {
      // Capture the parent accessor before the findIndex callback
      const parentAccessor = currentRow.parent.accessor;

      // Find the parent in the flattened headers
      const parentIndex = flattenedHeaders.findIndex((fh) => fh.header.accessor === parentAccessor);

      if (parentIndex === -1) break;

      currentRow = flattenedHeaders[parentIndex];
      currentIndex = parentIndex;
    }

    // Now currentRow should be at the same depth as draggingRow
    // We need to figure out which part of this subtree we're hovering over

    // Find all rows in this subtree (currentRow and its descendants)
    const subtreeStartIndex = currentIndex;
    let subtreeEndIndex = currentIndex;

    // Find the end of the subtree by looking for the next row at the same or shallower depth
    for (let i = currentIndex + 1; i < flattenedHeaders.length; i++) {
      if (flattenedHeaders[i].depth <= currentRow.depth) {
        break;
      }
      subtreeEndIndex = i;
    }

    const subtreeSize = subtreeEndIndex - subtreeStartIndex + 1;
    const hoveredPositionInSubtree = hoveredRowIndex - subtreeStartIndex;

    // Determine if we're in the top half or bottom half of the subtree
    let isInTopHalfOfSubtree = hoveredPositionInSubtree < subtreeSize / 2;

    // If odd number of rows in subtree and we're on the middle row, use isTopHalfOfRow to decide
    if (subtreeSize % 2 === 1) {
      const middleIndex = Math.floor(subtreeSize / 2);
      if (hoveredPositionInSubtree === middleIndex) {
        isInTopHalfOfSubtree = isTopHalfOfRow;
      }
    }

    // For top half of subtree, insert before the parent
    if (isInTopHalfOfSubtree) {
      return currentIndex - 1;
    } else {
      // For bottom half, insert after the parent (and its entire subtree)
      return subtreeEndIndex;
    }
  } else {
    return null;
  }
};
