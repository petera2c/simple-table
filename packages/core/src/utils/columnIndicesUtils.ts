import HeaderObject, { Accessor } from "../types/HeaderObject";
import { Pinned } from "../types/Pinned";
import { displayCell } from "./cellUtils";

export type ColumnIndices = Record<string, number>;

/**
 * Calculates column indices for all headers to ensure consistent colIndex values
 * This function is used in both TableBody and TableHeader components
 *
 * Note: In hierarchical headers, a parent header and its first child can share
 * the same column index, which is needed for proper alignment in the grid.
 */
export function calculateColumnIndices({
  headers,
  pinnedLeftColumns,
  pinnedRightColumns,
  collapsedHeaders,
}: {
  headers: HeaderObject[];
  pinnedLeftColumns: HeaderObject[];
  pinnedRightColumns: HeaderObject[];
  collapsedHeaders?: Set<Accessor>;
}): ColumnIndices {
  const indices: ColumnIndices = {};
  let columnCounter = 0;

  // Combine all headers for context in displayCell checks
  const allHeaders = [...pinnedLeftColumns, ...headers, ...pinnedRightColumns];

  const processHeader = (
    header: HeaderObject,
    isFirst: boolean = false,
    rootPinned?: Pinned,
  ): void => {
    // Only increment for non-first children or top-level headers
    if (!isFirst) {
      columnCounter++;
    }

    // Store the column index for this header
    indices[header.accessor] = columnCounter;

    // Process children recursively, if any
    if (header.children && header.children.length > 0) {
      header.children
        .filter((child) =>
          displayCell({
            header: child,
            pinned: rootPinned,
            headers: allHeaders,
            collapsedHeaders,
            rootPinned,
          }),
        )
        .forEach((child, index) => {
          // With singleRowChildren, children are siblings (each gets their own column)
          // In normal tree mode, the first child shares the column index with its parent
          const childIsFirst = header.singleRowChildren ? false : index === 0;
          processHeader(child, childIsFirst, rootPinned);
        });
    }
  };

  // Process all headers in order: first left-pinned, then main, then right-pinned
  // This ensures unique column indices across all sections

  // Process left-pinned headers
  pinnedLeftColumns.forEach((header, index) => {
    // For the very first header, we don't increment counter
    processHeader(header, index === 0, header.pinned);
  });

  // Process main headers
  headers
    .filter(
      (header) =>
        !header.pinned &&
        displayCell({
          header,
          pinned: undefined,
          headers: allHeaders,
          collapsedHeaders,
          rootPinned: header.pinned,
        }),
    )
    .forEach((header, index) => {
      // If this is the first header and there are no pinned left columns,
      // don't increment counter
      const isFirst = index === 0 && pinnedLeftColumns.length === 0;
      processHeader(header, isFirst, header.pinned);
    });

  // Process right-pinned headers
  pinnedRightColumns.forEach((header) => {
    // Right pinned columns always create new column indices
    processHeader(header, false, header.pinned);
  });

  return indices;
}
