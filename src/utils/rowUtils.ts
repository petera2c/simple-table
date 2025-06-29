import TableRow from "../types/TableRow";
import Row from "../types/Row";
import { RowId } from "../types/RowId";

/**
 * Get the row ID from a row using the specified accessor or fall back to index
 */
export const getRowId = (row: Row, index: number, rowIdAccessor?: string): RowId => {
  if (rowIdAccessor && row[rowIdAccessor] !== undefined) {
    return row[rowIdAccessor] as RowId;
  }
  return index;
};

/**
 * Get nested rows from a row based on the grouping path
 */
export const getNestedRows = (row: Row, groupingKey: string): Row[] => {
  const nestedData = row[groupingKey];
  return Array.isArray(nestedData) ? nestedData : [];
};

/**
 * Check if a row has nested rows for a given grouping key
 */
export const hasNestedRows = (row: Row, groupingKey?: string): boolean => {
  if (!groupingKey) return false;
  const nestedData = row[groupingKey];
  return Array.isArray(nestedData) && nestedData.length > 0;
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
}: {
  depth?: number;
  expandAll?: boolean;
  unexpandedRows: Set<string>;
  rowGrouping?: string[];
  rowIdAccessor?: string;
  rows: Row[];
}): TableRow[] => {
  const result: TableRow[] = [];

  const processRows = (currentRows: Row[], currentDepth: number, parentPosition = 0): number => {
    let position = parentPosition;

    currentRows.forEach((row, index) => {
      const rowId = getRowId(row, index, rowIdAccessor);
      const currentGroupingKey = rowGrouping[currentDepth];

      // Determine if this is the last row in a group
      const isLastGroupRow = currentDepth === 0 && index === currentRows.length - 1;

      // Add the main row with calculated position
      result.push({
        row,
        depth: currentDepth,
        groupingKey: currentGroupingKey,
        position,
        isLastGroupRow,
      });

      position++;

      // Check if row should be expanded
      const rowIdStr = String(rowId);
      const isExpanded = expandAll
        ? !unexpandedRows.has(rowIdStr) // If expandAll=true, expand unless explicitly collapsed
        : unexpandedRows.has(rowIdStr); // If expandAll=false, only expand if explicitly expanded
      console.log("\n\n");
      console.log("expandAll", expandAll);
      console.log("unexpandedRows", unexpandedRows);
      console.log("rowIdStr", rowIdStr);
      console.log("isExpanded", isExpanded);

      // If row is expanded and has nested data for the current grouping level
      if (isExpanded && currentDepth < rowGrouping.length) {
        const nestedRows = getNestedRows(row, currentGroupingKey);

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
