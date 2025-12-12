import TableRow from "../types/TableRow";
import Row from "../types/Row";
import { RowId } from "../types/RowId";
import { Accessor } from "../types/HeaderObject";
import CellValue from "../types/CellValue";
import RowState from "../types/RowState";

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
 * Get the row ID from a row using the specified accessor.
 * For nested/grouped rows, uses the full row path to ensure uniqueness.
 * This prevents ID collisions when the same ID appears at different nesting levels.
 *
 * Examples:
 * - Company at index 0 (depth 0): "0"
 * - Division with id=1 under company 0 (depth 1): "0-divisions-0"
 * - Division with id=1 under company 1 (depth 1): "1-divisions-0"
 * - Team with id=1 under company 0, division 0 (depth 2): "0-divisions-0-teams-0"
 *
 * @param row - The row object
 * @param rowIdAccessor - The accessor to get the base row ID (used as fallback for root level)
 * @param rowPath - Optional path to this row in nested structure (e.g., [1, 'divisions', 0])
 * @returns A unique row ID that accounts for nesting
 */
export const getRowId = ({
  row,
  rowIdAccessor,
  rowPath,
}: {
  row: Row;
  rowIdAccessor: Accessor;
  rowPath?: (string | number)[];
}): RowId => {
  const baseId = row[rowIdAccessor] as RowId;

  // If no rowPath or at root level (length 1 = just the index), return the base ID
  if (!rowPath || rowPath.length <= 1) {
    return baseId;
  }

  // For nested rows, create a composite ID using the FULL path
  // This ensures uniqueness by incorporating all parent indices
  // Format: "parentIndex-groupKey1-index1-groupKey2-index2-..."
  // Example: [1, 'divisions', 0] becomes "1-divisions-0"
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
 * Determine if a row is expanded based on expandAll setting and unexpandedRows set
 * @param rowId - The ID of the row to check
 * @param expandAll - Whether all rows are expanded by default
 * @param unexpandedRows - Set of row IDs that are in the opposite state of expandAll
 * @returns true if the row is expanded, false otherwise
 */
export const isRowExpanded = (
  rowId: string | number,
  expandAll: boolean,
  unexpandedRows: Set<string>
): boolean => {
  const rowIdStr = String(rowId);
  return expandAll
    ? !unexpandedRows.has(rowIdStr) // If expandAll=true, expanded unless explicitly collapsed
    : unexpandedRows.has(rowIdStr); // If expandAll=false, only expanded if explicitly expanded
};

/**
 * Flatten rows recursively based on row grouping configuration
 * Now calculates ALL properties including position and isLastGroupRow
 * Also injects special state rows for loading/error/empty states (only if renderers are available)
 */
export const flattenRowsWithGrouping = ({
  depth = 0,
  expandAll = false,
  unexpandedRows,
  rowGrouping = [],
  rowIdAccessor,
  rows,
  displayPositionOffset = 0,
  rowStateMap,
  hasLoadingRenderer = false,
  hasErrorRenderer = false,
  hasEmptyRenderer = false,
}: {
  depth?: number;
  expandAll?: boolean;
  unexpandedRows: Set<string>;
  rowGrouping?: Accessor[];
  rowIdAccessor: Accessor;
  rows: Row[];
  displayPositionOffset?: number;
  rowStateMap?: Map<string | number, RowState>;
  hasLoadingRenderer?: boolean;
  hasErrorRenderer?: boolean;
  hasEmptyRenderer?: boolean;
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
      const rowId = getRowId({
        row,
        rowIdAccessor,
        rowPath,
      });

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
      const isExpanded = isRowExpanded(rowId, expandAll, unexpandedRows);

      // If row is expanded and has nested data for the current grouping level
      if (isExpanded && currentDepth < rowGrouping.length) {
        const rowState = rowStateMap?.get(rowId);
        const nestedRows = getNestedRows(row, currentGroupingKey);

        // Show state indicator row if loading/error/empty state is active AND a corresponding renderer exists
        if (rowState && (rowState.loading || rowState.error || rowState.isEmpty)) {
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
              row: { [rowIdAccessor]: `${rowId}-loading-skeleton` },
              depth: currentDepth + 1,
              displayPosition,
              groupingKey: currentGroupingKey,
              position,
              isLastGroupRow: false,
              rowPath: [...rowPath, currentGroupingKey],
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
