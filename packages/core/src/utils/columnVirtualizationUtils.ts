import HeaderObject, { Accessor } from "../types/HeaderObject";
import { Pinned } from "../types/Pinned";
import { displayCell } from "./cellUtils";

/**
 * Precomputed cumulative width data structure for O(1) column position lookups
 * and O(log n) viewport calculations (analogous to CumulativeHeightMap for rows)
 */
export interface CumulativeWidthMap {
  /** Array where index i contains the left pixel position of leaf column i */
  columnLeftPositions: number[];
  /** Total width of all columns combined */
  totalWidth: number;
  /** Ordered array of leaf headers (actual columns that render) */
  leafHeaders: HeaderObject[];
}

/**
 * Get the pixel width of a header column
 * Assumes all widths are in px format (number or "150px")
 *
 * @param header - The header object
 * @returns Width in pixels
 */
const getColumnWidthInPixels = (header: HeaderObject): number => {
  const { width } = header;

  if (typeof width === "number") {
    return width;
  }

  if (typeof width === "string" && width.endsWith("px")) {
    return parseFloat(width);
  }

  // Default width if not specified or in unsupported format
  return 150;
};

/**
 * Get all leaf headers (actual columns that render) from a header tree
 * Handles nested headers, collapsed state, showWhen logic, and pinned sections
 *
 * Uses the existing displayCell utility to respect all visibility rules
 *
 * @param headers - Array of header objects (can be nested)
 * @param pinned - The pinned state for this section
 * @param allHeaders - All headers in the table (for displayCell context)
 * @param collapsedHeaders - Set of collapsed header accessors
 * @returns Flat array of leaf headers in order
 */
export const getLeafHeaders = (
  headers: HeaderObject[],
  pinned: Pinned | undefined,
  allHeaders: HeaderObject[],
  collapsedHeaders?: Set<Accessor>,
): HeaderObject[] => {
  const leaves: HeaderObject[] = [];

  const processHeader = (header: HeaderObject, rootPinned?: Pinned) => {
    if (!displayCell({ header, pinned, headers: allHeaders, collapsedHeaders, rootPinned })) {
      return;
    }

    if (!header.children || header.children.length === 0) {
      // This is a leaf header
      leaves.push(header);
      return;
    }

    // Recursively get leaf headers from children
    header.children.forEach((child) => processHeader(child, rootPinned));
  };

  // Process all top-level headers
  headers.forEach((header) => processHeader(header, header.pinned));

  return leaves;
};

/**
 * Build a cumulative width map for efficient viewport calculations
 * This precomputes the left position of every column, enabling:
 * - O(1) lookup of column left position
 * - O(log n) binary search to find columns in viewport
 *
 * Similar to buildCumulativeHeightMap for rows
 *
 * @param headers - Array of header objects for a section
 * @param pinned - The pinned state for this section
 * @param allHeaders - All headers in the table (for displayCell context)
 * @param collapsedHeaders - Set of collapsed header accessors
 * @returns Cumulative width map with column positions
 */
export const buildCumulativeWidthMap = (
  headers: HeaderObject[],
  pinned: Pinned | undefined,
  allHeaders: HeaderObject[],
  collapsedHeaders?: Set<Accessor>,
): CumulativeWidthMap => {
  // Get leaf headers (actual columns that render)
  const leafHeaders = getLeafHeaders(headers, pinned, allHeaders, collapsedHeaders);

  const columnLeftPositions: number[] = new Array(leafHeaders.length);
  let cumulativeWidth = 0;

  for (let i = 0; i < leafHeaders.length; i++) {
    columnLeftPositions[i] = cumulativeWidth;
    const columnWidth = getColumnWidthInPixels(leafHeaders[i]);
    cumulativeWidth += columnWidth;
  }

  return {
    columnLeftPositions,
    totalWidth: cumulativeWidth,
    leafHeaders,
  };
};

/**
 * Find the column index at a given scroll position using binary search
 * Returns the index of the column that contains or is closest to the scroll position
 *
 * Similar to findRowAtScrollPosition for rows
 *
 * @param scrollLeft - The horizontal scroll position in pixels
 * @param widthMap - Precomputed cumulative width map
 * @returns Column index at the scroll position
 */
export const findColumnAtScrollPosition = (
  scrollLeft: number,
  widthMap: CumulativeWidthMap,
): number => {
  const { columnLeftPositions } = widthMap;

  if (columnLeftPositions.length === 0) return 0;
  if (scrollLeft <= 0) return 0;
  if (scrollLeft >= widthMap.totalWidth) return columnLeftPositions.length - 1;

  // Binary search to find the column at this scroll position
  let left = 0;
  let right = columnLeftPositions.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);

    if (columnLeftPositions[mid] <= scrollLeft) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }

  return left;
};

/**
 * Calculate visible columns for viewport with overscan buffer
 * Returns column indices and the actual leaf header objects to render
 *
 * Similar to getViewportCalculations for rows
 *
 * @param scrollLeft - Current horizontal scroll position
 * @param viewportWidth - Width of the visible viewport
 * @param bufferColumnCount - Number of columns to render outside viewport (overscan)
 * @param scrollDirection - Direction of scroll for asymmetric overscan
 * @param widthMap - Precomputed cumulative width map
 * @returns Object with startIndex, endIndex, and columns array (leaf columns only)
 */
export const getVisibleColumns = ({
  scrollLeft,
  viewportWidth,
  bufferColumnCount,
  scrollDirection = "none",
  widthMap,
}: {
  scrollLeft: number;
  viewportWidth: number;
  bufferColumnCount: number;
  scrollDirection?: "left" | "right" | "none";
  widthMap: CumulativeWidthMap;
}): {
  startIndex: number;
  endIndex: number;
  columns: HeaderObject[];
} => {
  const { leafHeaders } = widthMap;

  // If no columns, return empty
  if (leafHeaders.length === 0) {
    return { startIndex: 0, endIndex: 0, columns: [] };
  }

  // Calculate overscan buffer in pixels
  // Use average column width for buffer calculation
  const averageColumnWidth =
    leafHeaders.length > 0 ? widthMap.totalWidth / leafHeaders.length : 150;
  const baseOverscanPixels = bufferColumnCount * averageColumnWidth;

  let leftOverscanPixels = baseOverscanPixels;
  let rightOverscanPixels = baseOverscanPixels;

  // Asymmetric overscan based on scroll direction (matches row virtualization pattern)
  if (scrollDirection === "right") {
    leftOverscanPixels = Math.max(averageColumnWidth, baseOverscanPixels * 0.1);
    rightOverscanPixels = baseOverscanPixels * 0.9;
  } else if (scrollDirection === "left") {
    leftOverscanPixels = baseOverscanPixels * 0.9;
    rightOverscanPixels = Math.max(averageColumnWidth, baseOverscanPixels * 0.1);
  }

  // Calculate viewport boundaries with overscan
  const startOffset = Math.max(0, scrollLeft - leftOverscanPixels);
  const endOffset = scrollLeft + viewportWidth + rightOverscanPixels;

  // Use binary search to find start/end indices
  const startIndex = findColumnAtScrollPosition(startOffset, widthMap);
  let endIndex = findColumnAtScrollPosition(endOffset, widthMap) + 1; // +1 to include the column
  endIndex = Math.min(leafHeaders.length, endIndex);

  // Return the visible columns
  return {
    startIndex,
    endIndex,
    columns: leafHeaders.slice(startIndex, endIndex),
  };
};

/**
 * Build parent-child relationship maps for the header hierarchy
 * This enables efficient lookup of ancestors for visible leaf columns
 *
 * @param headers - Array of top-level header objects
 * @param pinned - The pinned state for this section
 * @param allHeaders - All headers in the table (for displayCell context)
 * @param collapsedHeaders - Set of collapsed header accessors
 * @returns Maps for leaf-to-parents and parent-to-leaves relationships
 */
export const buildColumnHierarchy = (
  headers: HeaderObject[],
  pinned: Pinned | undefined,
  allHeaders: HeaderObject[],
  collapsedHeaders?: Set<Accessor>,
): {
  leafToParents: Map<Accessor, Accessor[]>;
  parentToLeaves: Map<Accessor, Accessor[]>;
} => {
  const leafToParents = new Map<Accessor, Accessor[]>();
  const parentToLeaves = new Map<Accessor, Accessor[]>();

  const processHeader = (header: HeaderObject, parentChain: Accessor[], rootPinned?: Pinned) => {
    if (!displayCell({ header, pinned, headers: allHeaders, collapsedHeaders, rootPinned })) {
      return;
    }

    // If this header has children, it's a parent
    if (header.children && header.children.length > 0) {
      const newParentChain = [...parentChain, header.accessor];

      // Initialize parent-to-leaves map entry
      if (!parentToLeaves.has(header.accessor)) {
        parentToLeaves.set(header.accessor, []);
      }

      // Process children
      header.children.forEach((child) => processHeader(child, newParentChain, rootPinned));
    } else {
      // This is a leaf - record its parent chain
      leafToParents.set(header.accessor, parentChain);

      // Add this leaf to all its parents' leaf lists
      parentChain.forEach((parentAccessor) => {
        const leaves = parentToLeaves.get(parentAccessor) || [];
        leaves.push(header.accessor);
        parentToLeaves.set(parentAccessor, leaves);
      });
    }
  };

  // Process all top-level headers
  headers.forEach((header) => processHeader(header, [], header.pinned));

  return { leafToParents, parentToLeaves };
};

/**
 * Get all headers to render (visible leaves + their ancestors)
 *
 * Strategy: Include a parent header if ANY of its children are visible
 *
 * @param visibleLeafColumns - Array of visible leaf header objects
 * @param leafToParents - Map from leaf accessor to parent accessor chain
 * @returns Set of all header accessors to render (leaves + ancestors)
 */
export const getHeadersToRender = (
  visibleLeafColumns: HeaderObject[],
  leafToParents: Map<Accessor, Accessor[]>,
): Set<Accessor> => {
  const headersToRender = new Set<Accessor>();

  // Add all visible leaf columns
  visibleLeafColumns.forEach((leaf) => {
    headersToRender.add(leaf.accessor);

    // Add all parent headers in the chain
    const parents = leafToParents.get(leaf.accessor) || [];
    parents.forEach((parentAccessor) => {
      headersToRender.add(parentAccessor);
    });
  });

  return headersToRender;
};

/**
 * GridCell type (matches TableHeaderSection.tsx)
 * Represents a single header cell in the grid with its positioning
 */
export type GridCell = {
  header: HeaderObject;
  gridColumnStart: number;
  gridColumnEnd: number;
  gridRowStart: number;
  gridRowEnd: number;
  colIndex: number;
  parentHeader?: HeaderObject;
};

/**
 * Recalculate grid column positions for visible headers
 * Adjusts gridColumnStart/End to account for hidden columns before the viewport
 *
 * This is the key function that makes virtualization work - it offsets the grid
 * positions so that the visible subset appears correctly positioned
 *
 * @param originalGridCells - All grid cells from the full header tree
 * @param headersToRender - Set of header accessors that should be rendered
 * @param visibleLeafColumns - Array of visible leaf columns (for determining offset)
 * @param startColumnIndex - Index of first visible leaf column in the full leaf array
 * @returns Filtered and repositioned grid cells
 */
export const recalculateGridPositions = (
  originalGridCells: GridCell[],
  headersToRender: Set<Accessor>,
  visibleLeafColumns: HeaderObject[],
  startColumnIndex: number,
): GridCell[] => {
  // Filter to only headers that should be rendered
  const visibleCells = originalGridCells.filter((cell) =>
    headersToRender.has(cell.header.accessor),
  );

  if (visibleCells.length === 0) {
    return [];
  }

  // Find the minimum gridColumnStart among visible cells
  // This is the offset we need to subtract to shift everything left
  const minGridColumnStart = Math.min(...visibleCells.map((cell) => cell.gridColumnStart));

  // Calculate the offset to apply
  // We want the first visible column to start at position 1 (CSS grid is 1-indexed)
  const columnOffset = minGridColumnStart - 1;

  // Recalculate positions for all visible cells
  const recalculatedCells = visibleCells.map((cell) => ({
    ...cell,
    gridColumnStart: cell.gridColumnStart - columnOffset,
    gridColumnEnd: cell.gridColumnEnd - columnOffset,
  }));

  return recalculatedCells;
};
