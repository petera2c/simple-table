import TableRow from "../types/TableRow";
import Row from "../types/Row";
import { RowId } from "../types/RowId";
import { Accessor } from "../types/HeaderObject";
import CellValue from "../types/CellValue";
import RowState from "../types/RowState";

/**
 * Get a nested property value from an object using dot notation
 * Example: getNestedValue(row, "latest.rank") returns row.latest.rank
 */
export const getNestedValue = (obj: Row, path: Accessor): CellValue => {
  // If the accessor is a simple property (no dots), use direct access for performance
  if (!path.includes(".")) {
    return obj[path] as CellValue;
  }

  // For nested paths, split by dots and traverse the object using reduce
  const keys = String(path).split(".");
  return keys.reduce((current: any, key: string) => {
    return current?.[key];
  }, obj) as CellValue;
};

/**
 * Set a nested property value in an object using dot notation
 * Example: setNestedValue(row, "latest.rank", 5) sets row.latest.rank = 5
 */
export const setNestedValue = (obj: Row, path: Accessor, value: CellValue): void => {
  // If the accessor is a simple property (no dots), use direct access for performance
  if (typeof path === "string" && !path.includes(".")) {
    obj[path] = value;
    return;
  }

  // For nested paths, split by dots and traverse/create the object structure
  const keys = String(path).split(".");
  let current: any = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    // Create intermediate objects if they don't exist
    if (current[key] === null || current[key] === undefined || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  // Set the final value
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
};

/**
 * Check if an array contains Row objects (vs primitive arrays like string[] or number[])
 */
export const isRowArray = (data: any): data is Row[] => {
  return Array.isArray(data) && data.length > 0 && typeof data[0] === "object" && data[0] !== null;
};

/**
 * Get the row ID from a row using the specified accessor or fall back to index
 */
export const getRowId = ({ row, rowIdAccessor }: { row: Row; rowIdAccessor: Accessor }): RowId => {
  return row[rowIdAccessor] as RowId;
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
 * Also injects special state rows for loading/error/empty states
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
}: {
  depth?: number;
  expandAll?: boolean;
  unexpandedRows: Set<string>;
  rowGrouping?: Accessor[];
  rowIdAccessor: Accessor;
  rows: Row[];
  displayPositionOffset?: number;
  rowStateMap?: Map<string | number, RowState>;
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
      const rowId = getRowId({ row, rowIdAccessor });
      const currentGroupingKey = rowGrouping[currentDepth];

      // Build the path to this row (e.g., [0, 'teams', 2])
      const rowPath = [...parentPath, index];

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
      });

      position++;
      displayPosition++;

      // Check if row should be expanded
      const isExpanded = isRowExpanded(rowId, expandAll, unexpandedRows);

      // If row is expanded and has nested data for the current grouping level
      if (isExpanded && currentDepth < rowGrouping.length) {
        const rowState = rowStateMap?.get(rowId);
        const nestedRows = getNestedRows(row, currentGroupingKey);

        // Show state indicator row if loading/error/empty state is active
        if (rowState && (rowState.loading || rowState.error || rowState.isEmpty)) {
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
          });
          position++;
          displayPosition++;
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
