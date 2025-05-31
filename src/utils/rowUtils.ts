import FlattenedRowWithGrouping from "../types/FlattenedRowWithGrouping";
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
 */
export const flattenRowsWithGrouping = ({
  depth = 0,
  expandedRows,
  rowGrouping = [],
  rowIdAccessor,
  rows,
}: {
  depth?: number;
  expandedRows: Set<string>;
  rowGrouping?: string[];
  rowIdAccessor?: string;
  rows: Row[];
}): FlattenedRowWithGrouping[] => {
  const result: FlattenedRowWithGrouping[] = [];

  rows.forEach((row, index) => {
    const rowId = getRowId(row, index, rowIdAccessor);

    // Add the main row
    result.push({ row, depth, groupingKey: rowGrouping[depth] });

    // Check if row is expanded using either __isExpanded property or expandedRows set
    const isExpanded = expandedRows.has(String(rowId));

    // If row is expanded and has nested data for the current grouping level
    if (isExpanded && depth < rowGrouping.length) {
      const currentGroupingKey = rowGrouping[depth];
      const nestedRows = getNestedRows(row, currentGroupingKey);

      if (nestedRows.length > 0) {
        // Recursively flatten nested rows with the expandedRows set
        const flattenedNested = flattenRowsWithGrouping({
          depth: depth + 1,
          expandedRows,
          rowGrouping,
          rowIdAccessor,
          rows: nestedRows,
        });
        result.push(...flattenedNested);
      }
    }
  });

  return result;
};
