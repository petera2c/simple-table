import TableRow from "../types/TableRow";
import { RowId } from "../types/RowId";
import { Accessor } from "../types/HeaderObject";
import RowGrouping from "../types/RowGrouping";

/**
 * Check if an array contains Row objects (vs primitive arrays like string[] or number[])
 */
export const isRowArray = <T>(data: any): data is T[] => {
  return Array.isArray(data) && data.length > 0 && typeof data[0] === "object" && data[0] !== null;
};

/**
 * Get the row ID from a row using the specified accessor or fall back to index
 */
export const getRowId = <T>({
  row,
  rowIdAccessor,
}: {
  row: T;
  rowIdAccessor: Accessor<T>;
}): RowId => {
  return row[rowIdAccessor] as RowId;
};

/**
 * Get nested rows from a row based on the grouping path
 */
export const getNestedRows = <T>(row: T, groupingKey: keyof T) => {
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
export const hasNestedRows = <T>(row: T, groupingKey?: keyof T): boolean => {
  if (!groupingKey) return false;
  const nestedData = row[groupingKey];
  return isRowArray(nestedData);
};

/**
 * Flatten rows recursively based on row grouping configuration
 * Now calculates ALL properties including position and isLastGroupRow
 */
export const flattenRowsWithGrouping = <T>({
  depth = 0,
  expandAll = false,
  unexpandedRows,
  rowGrouping = [],
  rowIdAccessor,
  rows,
}: {
  depth?: number;
  expandAll?: boolean;
  unexpandedRows: Set<string>;
  rowGrouping?: RowGrouping;
  rowIdAccessor: Accessor<T>;
  rows: T[];
}): TableRow<T>[] => {
  const result: TableRow<T>[] = [];

  //'never[] | (T[keyof T] & unknown[])'
  const processRows = (currentRows: T[], currentDepth: number, parentPosition = 0): number => {
    let position = parentPosition;

    currentRows.forEach((row, index) => {
      const rowId = getRowId({ row, rowIdAccessor });
      const currentGroupingKey = rowGrouping[currentDepth];

      // Determine if this is the last row in a group
      const isLastGroupRow = currentDepth === 0 && index === currentRows.length - 1;

      // Add the main row with calculated position
      result.push({
        row,
        depth: currentDepth,
        groupingKey: currentGroupingKey as keyof T,
        position,
        isLastGroupRow,
      });

      position++;

      // Check if row should be expanded
      const rowIdStr = String(rowId);
      const isExpanded = expandAll
        ? !unexpandedRows.has(rowIdStr) // If expandAll=true, expand unless explicitly collapsed
        : unexpandedRows.has(rowIdStr); // If expandAll=false, only expand if explicitly expanded

      // If row is expanded and has nested data for the current grouping level
      if (isExpanded && currentDepth < rowGrouping.length) {
        const nestedRows = getNestedRows(row, currentGroupingKey as keyof T) as T[];

        if (nestedRows.length > 0) {
          // Recursively process nested rows and update position
          position = processRows(nestedRows, currentDepth + 1, position);
        }
      }
    });

    return position;
  };

  processRows(rows, depth);
  return result;
};
