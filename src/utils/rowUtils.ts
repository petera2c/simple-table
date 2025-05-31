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
 * Set the expansion state for a row (we'll need to track this separately now)
 */
export const setRowExpansion = (
  rows: Row[],
  targetRowId: RowId,
  isExpanded: boolean,
  rowIdAccessor?: string
): Row[] => {
  return rows.map((row, index) => {
    const rowId = getRowId(row, index, rowIdAccessor);
    if (rowId === targetRowId) {
      return { ...row, __isExpanded: isExpanded };
    }
    return row;
  });
};

/**
 * Check if a row is expanded (check our internal expansion state)
 */
export const isRowExpanded = (row: Row): boolean => {
  return Boolean((row as any).__isExpanded);
};

/**
 * Flatten rows recursively based on row grouping configuration
 */
export const flattenRowsWithGrouping = (
  rows: Row[],
  rowGrouping: string[] = [],
  rowIdAccessor?: string,
  depth: number = 0,
  expandedRows?: Set<string>
): Array<{ row: Row; depth: number; groupingKey?: string }> => {
  const result: Array<{ row: Row; depth: number; groupingKey?: string }> = [];

  rows.forEach((row, index) => {
    const rowId = getRowId(row, index, rowIdAccessor);

    // Add the main row
    result.push({ row, depth, groupingKey: rowGrouping[depth] });

    // Check if row is expanded using either __isExpanded property or expandedRows set
    const isExpanded = expandedRows ? expandedRows.has(String(rowId)) : isRowExpanded(row);

    // If row is expanded and has nested data for the current grouping level
    if (isExpanded && depth < rowGrouping.length) {
      const currentGroupingKey = rowGrouping[depth];
      const nestedRows = getNestedRows(row, currentGroupingKey);

      if (nestedRows.length > 0) {
        // Recursively flatten nested rows with the expandedRows set
        const flattenedNested = flattenRowsWithGrouping(
          nestedRows,
          rowGrouping,
          rowIdAccessor,
          depth + 1,
          expandedRows
        );
        result.push(...flattenedNested);
      }
    }
  });

  return result;
};
