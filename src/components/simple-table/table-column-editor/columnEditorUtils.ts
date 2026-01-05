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
