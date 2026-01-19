import TableRow from "../types/TableRow";
import Row from "../types/Row";
import { RowId } from "../types/RowId";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import CellValue from "../types/CellValue";
import RowState from "../types/RowState";
import { DEFAULT_ROW_HEIGHT, DEFAULT_HEADER_HEIGHT } from "../consts/general-consts";

// Maximum height for nested grids in pixels
export const NESTED_GRID_MAX_HEIGHT = 400;

// Padding for nested grids (top + bottom combined)
export const NESTED_GRID_PADDING = 16;

// Individual padding values for nested grids
export const NESTED_GRID_PADDING_TOP = 8;
export const NESTED_GRID_PADDING_BOTTOM = 8;

/**
 * Calculate the height of a nested grid based on the number of child rows
 * @param childRowCount - Number of rows in the nested grid
 * @param rowHeight - Height of each row (defaults to DEFAULT_ROW_HEIGHT)
 * @param headerHeight - Height of the header (defaults to DEFAULT_HEADER_HEIGHT)
 * @returns Calculated height in pixels (includes padding)
 */
export const calculateNestedGridHeight = ({
  childRowCount,
  rowHeight = DEFAULT_ROW_HEIGHT,
  headerHeight = DEFAULT_HEADER_HEIGHT,
}: {
  childRowCount: number;
  rowHeight?: number;
  headerHeight?: number;
}): number => {
  // Calculate content height: header + (rows * rowHeight) + top/bottom padding
  const contentHeight = headerHeight + childRowCount * rowHeight + NESTED_GRID_PADDING_TOP + NESTED_GRID_PADDING_BOTTOM;
  
  // Return the minimum of content height and max height (max height also includes padding)
  return Math.min(contentHeight, NESTED_GRID_MAX_HEIGHT + NESTED_GRID_PADDING_TOP + NESTED_GRID_PADDING_BOTTOM);
};

/**
 * Parse a path segment that may contain array notation
 * Example: "albums[0]" returns { key: "albums", index: 0 }
 *          "name" returns { key: "name", index: null }
 */
const parsePathSegment = (segment: string): { key: string; index: number | null } => {
  const arrayMatch = segment.match(/^(.+?)\[(\d+)\]$/);
  if (arrayMatch) {
    return {
      key: arrayMatch[1],
      index: parseInt(arrayMatch[2], 10),
    };
  }
  return { key: segment, index: null };
};

/**
 * Get a nested property value from an object using dot notation and array bracket notation
 * Examples:
 *   getNestedValue(row, "latest.rank") returns row.latest.rank
 *   getNestedValue(row, "albums[0].title") returns row.albums[0].title
 *   getNestedValue(row, "releaseDate[0]") returns row.releaseDate[0]
 */
export const getNestedValue = (obj: Row, path: Accessor): CellValue => {
  const pathStr = String(path);

  // If the accessor is a simple property (no dots or brackets), use direct access for performance
  if (!pathStr.includes(".") && !pathStr.includes("[")) {
    return obj[path] as CellValue;
  }

  // For nested paths, split by dots and traverse the object
  const segments = pathStr.split(".");

  return segments.reduce((current: any, segment: string) => {
    if (current === null || current === undefined) {
      return undefined;
    }

    const { key, index } = parsePathSegment(segment);

    // First access the key
    let value = current[key];

    // If an array index was specified, access that index
    if (index !== null && Array.isArray(value)) {
      value = value[index];
    }

    return value;
  }, obj) as CellValue;
};

/**
 * Set a nested property value in an object using dot notation and array bracket notation
 * Examples:
 *   setNestedValue(row, "latest.rank", 5) sets row.latest.rank = 5
 *   setNestedValue(row, "albums[0].title", "New Album") sets row.albums[0].title = "New Album"
 *   setNestedValue(row, "releaseDate[0]", "2024") sets row.releaseDate[0] = "2024"
 */
export const setNestedValue = (obj: Row, path: Accessor, value: CellValue): void => {
  const pathStr = String(path);

  // If the accessor is a simple property (no dots or brackets), use direct access for performance
  if (!pathStr.includes(".") && !pathStr.includes("[")) {
    obj[path] = value;
    return;
  }

  // For nested paths, split by dots and traverse/create the object structure
  const segments = pathStr.split(".");
  let current: any = obj;

  for (let i = 0; i < segments.length - 1; i++) {
    const { key, index } = parsePathSegment(segments[i]);

    // Create intermediate objects/arrays if they don't exist
    if (current[key] === null || current[key] === undefined) {
      // Determine if next segment expects an array
      const nextSegment = segments[i + 1];
      const nextParsed = parsePathSegment(nextSegment);
      current[key] = nextParsed.index !== null ? [] : {};
    }

    // Navigate to the key
    current = current[key];

    // If an array index was specified, navigate to that index
    if (index !== null) {
      if (!Array.isArray(current)) {
        throw new Error(
          `Expected array at ${segments.slice(0, i + 1).join(".")}, but found ${typeof current}`
        );
      }

      // Ensure the array has enough elements
      while (current.length <= index) {
        current.push(null);
      }

      // Create object at index if needed
      if (current[index] === null || current[index] === undefined) {
        current[index] = {};
      }

      current = current[index];
    }
  }

  // Handle the final segment
  const { key: lastKey, index: lastIndex } = parsePathSegment(segments[segments.length - 1]);

  if (lastIndex !== null) {
    // Setting a value in an array
    if (!Array.isArray(current[lastKey])) {
      current[lastKey] = [];
    }

    // Ensure the array has enough elements
    while (current[lastKey].length <= lastIndex) {
      current[lastKey].push(null);
    }

    current[lastKey][lastIndex] = value;
  } else {
    // Setting a simple property
    current[lastKey] = value;
  }
};

/**
 * Check if an array contains Row objects (vs primitive arrays like string[] or number[])
 */
export const isRowArray = (data: any): data is Row[] => {
  return Array.isArray(data) && data.length > 0 && typeof data[0] === "object" && data[0] !== null;
};

/**
 * Get the row ID from its position path in the data structure.
 * Uses the row's index-based path to create a unique, stable identifier.
 *
 * Examples:
 * - Root row at index 0: "0"
 * - Root row at index 1: "1"
 * - Nested row under parent 0, divisions array, index 2: "0-divisions-2"
 * - Deeply nested: "0-divisions-1-teams-3"
 *
 * @param rowPath - Path to this row in nested structure (e.g., [0], [1, 'divisions', 2])
 * @returns A unique row ID based on position
 */
export const getRowId = (rowPath: (string | number)[]): RowId => {
  return rowPath.join("-");
};

/**
 * Get nested rows from a row based on the grouping path
 */
export const getNestedRows = (row: Row, groupingKey: string): Row[] => {
  const nestedData = row[groupingKey];
  // Only return as Row[] if it's an array of objects (potential rows)
  if (isRowArray(nestedData)) {
    return nestedData;
  }
  return [];
};

/**
 * Check if a row has nested rows for a given grouping key
 */
export const hasNestedRows = (row: Row, groupingKey?: string): boolean => {
  if (!groupingKey) return false;
  const nestedData = row[groupingKey];
  return isRowArray(nestedData);
};

/**
 * Determine if a row is expanded based on expandedDepths and manual row overrides
 * @param rowId - The ID of the row to check
 * @param depth - The depth level of the row (0-indexed)
 * @param expandedDepths - Set of depth levels that are expanded
 * @param expandedRows - Map of row IDs to their depths for rows that user wants expanded
 * @param collapsedRows - Map of row IDs to their depths for rows that user wants collapsed
 * @returns true if the row is expanded, false otherwise
 */
export const isRowExpanded = (
  rowId: string | number,
  depth: number,
  expandedDepths: Set<number>,
  expandedRows: Map<string, number>,
  collapsedRows: Map<string, number>
): boolean => {
  const rowIdStr = String(rowId);
  const isManuallyExpanded = expandedRows.has(rowIdStr) && expandedRows.get(rowIdStr) === depth;
  const isManuallyCollapsed = collapsedRows.has(rowIdStr) && collapsedRows.get(rowIdStr) === depth;

  if (expandedDepths.has(depth)) {
    // Depth is expanded - row is expanded unless manually collapsed
    return !isManuallyCollapsed;
  } else {
    // Depth is collapsed - row is collapsed unless manually expanded (pending)
    return isManuallyExpanded;
  }
};

/**
 * Flatten rows recursively based on row grouping configuration
 * Now calculates ALL properties including position and isLastGroupRow
 * Also injects special state rows for loading/error/empty states (only if renderers are available)
 * Also injects nested grid rows when a header has nestedGrid configuration
 */
export const flattenRowsWithGrouping = ({
  depth = 0,
  expandedDepths,
  expandedRows,
  collapsedRows,
  rowGrouping = [],
  rows,
  displayPositionOffset = 0,
  rowStateMap,
  hasLoadingRenderer = false,
  hasErrorRenderer = false,
  hasEmptyRenderer = false,
  headers = [],
  rowHeight = DEFAULT_ROW_HEIGHT,
  headerHeight = DEFAULT_HEADER_HEIGHT,
}: {
  depth?: number;
  expandedDepths: Set<number>;
  expandedRows: Map<string, number>;
  collapsedRows: Map<string, number>;
  rowGrouping?: Accessor[];
  rows: Row[];
  displayPositionOffset?: number;
  rowStateMap?: Map<string | number, RowState>;
  hasLoadingRenderer?: boolean;
  hasErrorRenderer?: boolean;
  hasEmptyRenderer?: boolean;
  headers?: HeaderObject[];
  rowHeight?: number;
  headerHeight?: number;
}): TableRow[] => {
  const result: TableRow[] = [];

  const processRows = (
    currentRows: Row[],
    currentDepth: number,
    parentPosition = 0,
    parentDisplayPosition = displayPositionOffset,
    parentPath: (string | number)[] = []
  ): number => {
    let position = parentPosition;
    let displayPosition = parentDisplayPosition;

    currentRows.forEach((row, index) => {
      const currentGroupingKey = rowGrouping[currentDepth];

      // Build the path to this row (e.g., [0, 'teams', 2])
      const rowPath = [...parentPath, index];

      // Get unique row ID that accounts for nesting depth
      const rowId = getRowId(rowPath);

      // Determine if this is the last row in a group
      const isLastGroupRow = currentDepth === 0 && index === currentRows.length - 1;

      // Add the main row with calculated position and path
      result.push({
        row,
        depth: currentDepth,
        displayPosition,
        groupingKey: currentGroupingKey,
        position,
        isLastGroupRow,
        rowPath,
        absoluteRowIndex: position,
      });

      position++;
      displayPosition++;

      // Check if row should be expanded
      const isExpanded = isRowExpanded(
        rowId,
        currentDepth,
        expandedDepths,
        expandedRows,
        collapsedRows
      );

      // If row is expanded and has nested data for the current grouping level
      if (isExpanded && currentDepth < rowGrouping.length) {
        const rowState = rowStateMap?.get(rowId);
        const nestedRows = getNestedRows(row, currentGroupingKey);

        // Check if any header with expandable=true has a nestedGrid configuration
        // The expandable header is the one that shows the expand icon, not necessarily matching the grouping key
        const expandableHeader = headers.find((h) => h.expandable && h.nestedGrid);

        // If there's a nested grid configuration, inject a nested grid row instead of regular child rows
        if (expandableHeader?.nestedGrid && nestedRows.length > 0) {
          // Calculate the height for this nested grid
          const nestedGridRowHeight = expandableHeader.nestedGrid.rowHeight || rowHeight;
          const nestedGridHeaderHeight = expandableHeader.nestedGrid.headerHeight || headerHeight;
          const calculatedHeight = calculateNestedGridHeight({
            childRowCount: nestedRows.length,
            rowHeight: nestedGridRowHeight,
            headerHeight: nestedGridHeaderHeight,
          });
          
          result.push({
            row: {}, // Empty row object, content will be rendered by NestedGridRow
            depth: currentDepth + 1,
            displayPosition,
            groupingKey: currentGroupingKey,
            position,
            isLastGroupRow: false,
            rowPath: [...rowPath, currentGroupingKey],
            nestedGrid: {
              parentRow: row,
              expandableHeader,
              childAccessor: currentGroupingKey,
              calculatedHeight,
            },
            absoluteRowIndex: position,
          });
          position++;
          displayPosition++;
        }
        // Show state indicator row if loading/error/empty state is active AND a corresponding renderer exists
        else if (rowState && (rowState.loading || rowState.error || rowState.isEmpty)) {
          const shouldShowState =
            (rowState.loading && hasLoadingRenderer) ||
            (rowState.error && hasErrorRenderer) ||
            (rowState.isEmpty && hasEmptyRenderer);

          if (shouldShowState) {
            result.push({
              row: {}, // Empty row object, content will be rendered by state indicator
              depth: currentDepth + 1,
              displayPosition,
              groupingKey: currentGroupingKey,
              position,
              isLastGroupRow: false,
              rowPath: [...rowPath, currentGroupingKey],
              stateIndicator: {
                parentRowId: rowId,
                state: rowState,
              },
              absoluteRowIndex: position,
            });
            position++;
            displayPosition++;
          } else if (rowState.loading && !hasLoadingRenderer) {
            // If loading but no custom renderer, add a dummy skeleton row
            result.push({
              row: {},
              depth: currentDepth + 1,
              displayPosition,
              groupingKey: currentGroupingKey,
              position,
              isLastGroupRow: false,
              rowPath: [...rowPath, currentGroupingKey, "loading-skeleton"],
              isLoadingSkeleton: true,
              absoluteRowIndex: position,
            });
            position++;
            displayPosition++;
          }
        }
        // Process actual nested rows if they exist and no state is active
        else if (nestedRows.length > 0) {
          // Build path for nested rows (parent path + grouping key)
          const nestedPath = [...rowPath, currentGroupingKey];
          // Recursively process nested rows and update position
          position = processRows(
            nestedRows,
            currentDepth + 1,
            position,
            displayPosition,
            nestedPath
          );
        }
      }
    });

    return position;
  };

  processRows(rows, depth, 0, displayPositionOffset);
  return result;
};
