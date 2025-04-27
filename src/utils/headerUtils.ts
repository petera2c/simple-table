import { PINNED_BORDER_WIDTH } from "../consts/general-consts";
import HeaderObject from "../types/HeaderObject";

/**
 * Gets all leaf column indices (bottom-level columns) for a given header and its descendants
 * @param header The header to get indices for
 * @param colIndex The column index of the header in the current context
 * @returns Array of column indices that belong to this header branch
 */
export const getHeaderLeafIndices = (header: HeaderObject, colIndex: number): number[] => {
  // For a leaf node (no children), just return the current index
  if (!header.children || header.children.length === 0) {
    return [colIndex];
  }

  // For parent nodes, collect indices by recursively tracking the column indices
  const columnsToSelect: number[] = [];

  // Recursive function to collect column indices
  const collectChildIndices = (childHeader: HeaderObject, startIndex: number): number => {
    // If this is a leaf node, add its index and increment
    if (!childHeader.children || childHeader.children.length === 0) {
      columnsToSelect.push(startIndex);
      return startIndex + 1;
    }

    // Process each child, incrementing the index as we go
    let currentIndex = startIndex;
    for (const child of childHeader.children) {
      currentIndex = collectChildIndices(child, currentIndex);
    }

    return currentIndex;
  };

  // Start the collection with the header itself
  collectChildIndices(header, colIndex);

  return columnsToSelect;
};

/**
 * Flattens a nested header structure to get all leaf headers
 * @param headers The headers array to flatten
 * @returns Flattened array of all leaf headers
 */
export const flattenHeaders = (headers: HeaderObject[]): HeaderObject[] => {
  return headers.flatMap((header) => {
    if (!header.children || header.children.length === 0) {
      return [header];
    }
    return flattenHeaders(header.children);
  });
};

/**
 * Gets the range of column indices between two column indices
 * @param startColIndex Starting column index
 * @param endColIndex Ending column index
 * @returns Array of column indices in the range (inclusive)
 */
export const getColumnRange = (startColIndex: number, endColIndex: number): number[] => {
  const start = Math.min(startColIndex, endColIndex);
  const end = Math.max(startColIndex, endColIndex);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const calculatePinnedWidth = (width = 0): number => {
  return width + PINNED_BORDER_WIDTH;
};
