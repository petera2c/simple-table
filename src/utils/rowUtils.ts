import TableRow from "../types/TableRow";
import Row from "../types/Row";
import { RowId } from "../types/RowId";
import { Accessor } from "../types/HeaderObject";

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
 * Flatten rows recursively based on row grouping configuration
 * Now calculates ALL properties including position and isLastGroupRow
 */
export const flattenRowsWithGrouping = ({
  depth = 0,
  expandAll = false,
  unexpandedRows,
  rowGrouping = [],
  rowIdAccessor,
  rows,
  displayPositionOffset = 0,
}: {
  depth?: number;
  expandAll?: boolean;
  unexpandedRows: Set<string>;
  rowGrouping?: Accessor[];
  rowIdAccessor: Accessor;
  rows: Row[];
  displayPositionOffset?: number;
}): TableRow[] => {
  const result: TableRow[] = [];

  const processRows = (
    currentRows: Row[],
    currentDepth: number,
    parentPosition = 0,
    parentDisplayPosition = displayPositionOffset
  ): number => {
    let position = parentPosition;
    let displayPosition = parentDisplayPosition;

    currentRows.forEach((row, index) => {
      const rowId = getRowId({ row, rowIdAccessor });
      const currentGroupingKey = rowGrouping[currentDepth];

      // Determine if this is the last row in a group
      const isLastGroupRow = currentDepth === 0 && index === currentRows.length - 1;

      // Add the main row with calculated position
      result.push({
        row,
        depth: currentDepth,
        displayPosition,
        groupingKey: currentGroupingKey,
        position,
        isLastGroupRow,
      });

      position++;
      displayPosition++;

      // Check if row should be expanded
      const rowIdStr = String(rowId);
      const isExpanded = expandAll
        ? !unexpandedRows.has(rowIdStr) // If expandAll=true, expand unless explicitly collapsed
        : unexpandedRows.has(rowIdStr); // If expandAll=false, only expand if explicitly expanded

      // If row is expanded and has nested data for the current grouping level
      if (isExpanded && currentDepth < rowGrouping.length) {
        const nestedRows = getNestedRows(row, currentGroupingKey);

        if (nestedRows.length > 0) {
          // Recursively process nested rows and update position
          position = processRows(nestedRows, currentDepth + 1, position, displayPosition);
        }
      }
    });

    return position;
  };

  processRows(rows, depth, 0, displayPositionOffset);
  return result;
};
