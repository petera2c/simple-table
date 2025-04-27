import HeaderObject from "../../../types/HeaderObject";

// Find all parents for a given header to ensure they're visible
export const findAndMarkParentsVisible = (
  headers: HeaderObject[],
  childAccessor: string,
  updatedHiddenColumns: { [key: string]: boolean },
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
          findAndMarkParentsVisible([child], childAccessor, updatedHiddenColumns, visited);
          // If this child is now visible after recursion, it means it's in the path
          if (updatedHiddenColumns[child.accessor] === false) {
            hasNestedChild = true;
            break;
          }
        }
      }

      // If this header is a parent (direct or indirect) of the target child, make it visible
      if (hasDirectChild || hasNestedChild) {
        updatedHiddenColumns[header.accessor] = false;
      }
    }
  }
};

export const areAllChildrenHidden = (
  children: HeaderObject[],
  hiddenColumns: { [key: string]: boolean }
) => {
  return children.every((child) => hiddenColumns[child.accessor] === true);
};

// Update parent headers based on children's state
export const updateParentHeaders = (
  headers: HeaderObject[],
  updatedHiddenColumns: { [key: string]: boolean }
) => {
  // Process each header
  headers.forEach((header) => {
    // If it has children, check if all children are hidden
    if (header.children && header.children.length > 0) {
      // First update any nested children
      updateParentHeaders(header.children, updatedHiddenColumns);

      // Then check if all children are now hidden
      const allChildrenHidden = areAllChildrenHidden(header.children, updatedHiddenColumns);

      // Update this parent if all children are hidden
      if (allChildrenHidden) {
        updatedHiddenColumns[header.accessor] = true;
      }
    }
  });
};
