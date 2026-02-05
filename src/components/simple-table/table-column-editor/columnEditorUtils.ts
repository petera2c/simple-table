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

/**
 * Finds the closest valid separator index for dropping a dragged row.
 * A row can only be reordered with rows that have the same depth and same parent.
 *
 * @param flattenedHeaders - Array of all visible headers with metadata
 * @param draggingRow - The HeaderObject being dragged
 * @param hoveredRowIndex - The visual index of the row being hovered over
 * @param isTopHalf - Whether the mouse is in the top half of the hovered row
 * @returns The closest valid separator index, or null if no valid position exists
 *
 * @example
 * // Given a tree:
 * // Row 0 (depth 0, parent: null) - "Parent A"
 * //   Row 1 (depth 1, parent: "Parent A")
 * //   Row 2 (depth 1, parent: "Parent A")
 * //   Row 3 (depth 1, parent: "Parent A")
 * //   Row 4 (depth 1, parent: "Parent A")
 * // Row 5 (depth 0, parent: null) - "Parent B"
 * //   Row 6 (depth 1, parent: "Parent B")
 * //   Row 7 (depth 1, parent: "Parent B")
 * //   Row 8 (depth 1, parent: "Parent B")
 * //   Row 9 (depth 1, parent: "Parent B")
 *
 * // If dragging row 2 over row 7 (bottom half):
 * // Target separator = 7, but row 2 can only be with siblings (rows 1-4)
 * // Closest valid sibling to position 7 is row 4
 * // Returns 4 (separator after row 4)
 *
 * // If dragging row 5 over row 2 (bottom half):
 * // Target separator = 2, but row 5 can only be with row 0 (same depth 0)
 * // Closest valid sibling to position 2 is row 0
 * // Returns 4 (separator after row 4, which is after row 0's section)
 *
 * // If dragging row 5 over row 1 (top half):
 * // Target separator = 0, but row 5 can only be with row 0
 * // Closest valid sibling to position 0 is row 0
 * // Returns -1 (separator before row 0)
 */
export const findClosestValidSeparatorIndex = (
  flattenedHeaders: FlattenedHeader[],
  draggingRow: HeaderObject,
  hoveredRowIndex: number,
  isTopHalf: boolean
): number | null => {
  // Find the dragged row in the flattened list
  const draggedRowFlat = flattenedHeaders.find(
    (item) => item.header.accessor === draggingRow.accessor
  );

  if (!draggedRowFlat) {
    return null;
  }

  // Find all valid siblings (same depth and same parent)
  const validSiblings = flattenedHeaders.filter((item) => {
    // Must have same depth
    if (item.depth !== draggedRowFlat.depth) {
      return false;
    }

    // Must have same parent (compare by accessor, or both null)
    const sameParent =
      (item.parent === null && draggedRowFlat.parent === null) ||
      (item.parent !== null &&
        draggedRowFlat.parent !== null &&
        item.parent.accessor === draggedRowFlat.parent.accessor);

    if (!sameParent) {
      return false;
    }

    // Exclude the dragged row itself
    if (item.header.accessor === draggingRow.accessor) {
      return false;
    }

    return true;
  });

  if (validSiblings.length === 0) {
    // No valid siblings, cannot reorder
    return null;
  }

  // Determine the initial target separator based on hover position
  const targetSeparatorIndex = isTopHalf ? hoveredRowIndex - 1 : hoveredRowIndex;

  // Find the closest valid sibling to the target position
  let closestSibling = validSiblings[0];
  let minDistance = Math.abs(closestSibling.visualIndex - targetSeparatorIndex);

  for (const sibling of validSiblings) {
    const distance = Math.abs(sibling.visualIndex - targetSeparatorIndex);
    if (distance < minDistance) {
      minDistance = distance;
      closestSibling = sibling;
    }
  }

  // Helper function to find the last descendant of a parent row
  const findLastDescendantIndex = (parentIndex: number): number => {
    let lastIndex = parentIndex;

    // Look ahead to find all descendants
    for (let i = parentIndex + 1; i < flattenedHeaders.length; i++) {
      const item = flattenedHeaders[i];

      // Check if this item is a descendant of the parent
      // It's a descendant if its depth is greater than parent's depth
      if (item.depth <= flattenedHeaders[parentIndex].depth) {
        // We've reached a sibling or uncle, stop here
        break;
      }

      lastIndex = i;
    }

    return lastIndex;
  };

  // Determine if we should place before or after the closest sibling
  let separatorIndex: number;
  let placingAfterSibling = false;

  if (targetSeparatorIndex <= closestSibling.visualIndex) {
    // Place before the closest sibling (separator = visualIndex - 1)
    separatorIndex = closestSibling.visualIndex - 1;
    placingAfterSibling = false;
  } else {
    // Place after the closest sibling
    // If the sibling has children, place after all its children
    placingAfterSibling = true;

    if (closestSibling.header.children && closestSibling.header.children.length > 0) {
      // Sibling has children - separator goes after all descendants
      separatorIndex = findLastDescendantIndex(closestSibling.visualIndex);
    } else {
      // Sibling has no children - separator goes right after it
      separatorIndex = closestSibling.visualIndex;
    }
  }

  // If placing before a sibling, check if the item before the separator has children
  // In that case, we might be placing between a parent and its first child, which we want to avoid
  if (!placingAfterSibling) {
    const itemAtSeparator = flattenedHeaders[separatorIndex];
    if (
      itemAtSeparator &&
      itemAtSeparator.header.children &&
      itemAtSeparator.header.children.length > 0
    ) {
      // The separator would be between a parent and its first child
      // Move it to after all the parent's children instead
      separatorIndex = findLastDescendantIndex(separatorIndex);
    }
  }

  return separatorIndex;
};
