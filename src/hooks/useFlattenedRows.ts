import { useMemo } from "react";
import { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import RowState from "../types/RowState";
import TableRow from "../types/TableRow";
import { getRowId, getNestedRows, isRowExpanded } from "../utils/rowUtils";

interface UseFlattenedRowsProps {
  rows: Row[];
  rowGrouping?: Accessor[];
  rowIdAccessor: Accessor;
  unexpandedRows: Set<string>;
  expandAll: boolean;
  rowStateMap: Map<string | number, RowState>;
  hasLoadingRenderer: boolean;
  hasErrorRenderer: boolean;
  hasEmptyRenderer: boolean;
}

/**
 * Hook that flattens nested row data into a flat array of TableRow objects.
 * This is done early in the pipeline so that filtering, sorting, and pagination
 * can all operate on the flat structure, fixing issues where rowsPerPage
 * didn't account for nested children.
 */
const useFlattenedRows = ({
  rows,
  rowGrouping = [],
  rowIdAccessor,
  unexpandedRows,
  expandAll,
  rowStateMap,
  hasLoadingRenderer,
  hasErrorRenderer,
  hasEmptyRenderer,
}: UseFlattenedRowsProps): TableRow[] => {
  return useMemo(() => {
    // If no row grouping, just convert rows to TableRow format
    if (!rowGrouping || rowGrouping.length === 0) {
      return rows.map(
        (row, index) =>
          ({
            row,
            depth: 0,
            displayPosition: index,
            groupingKey: undefined,
            position: index,
            isLastGroupRow: index === rows.length - 1,
            rowPath: [index],
          } as TableRow)
      );
    }

    const result: TableRow[] = [];

    const processRows = (
      currentRows: Row[],
      currentDepth: number,
      parentPath: (string | number)[] = []
    ): void => {
      currentRows.forEach((row, index) => {
        const currentGroupingKey = rowGrouping[currentDepth];
        const position = result.length;

        // Build the path to this row
        const rowPath = [...parentPath, index];

        // Get unique row ID that accounts for nesting depth
        const rowId = getRowId({
          row,
          rowIdAccessor,
          rowPath,
        });

        // Determine if this is the last row at depth 0
        const isLastGroupRow = currentDepth === 0 && index === currentRows.length - 1;

        // Add the main row
        result.push({
          row,
          depth: currentDepth,
          displayPosition: position,
          groupingKey: currentGroupingKey,
          position,
          isLastGroupRow,
          rowPath,
        });

        // Check if row should be expanded using the unique ID
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
              const statePosition = result.length;
              result.push({
                row: {}, // Empty row object, content will be rendered by state indicator
                depth: currentDepth + 1,
                displayPosition: statePosition,
                groupingKey: currentGroupingKey,
                position: statePosition,
                isLastGroupRow: false,
                rowPath: [...rowPath, currentGroupingKey],
                stateIndicator: {
                  parentRowId: rowId,
                  state: rowState,
                },
              });
            } else if (rowState.loading && !hasLoadingRenderer) {
              // If loading but no custom renderer, add a dummy skeleton row
              const skeletonPosition = result.length;
              result.push({
                row: { [rowIdAccessor]: `${rowId}-loading-skeleton` },
                depth: currentDepth + 1,
                displayPosition: skeletonPosition,
                groupingKey: currentGroupingKey,
                position: skeletonPosition,
                isLastGroupRow: false,
                rowPath: [...rowPath, currentGroupingKey],
                isLoadingSkeleton: true,
              });
            }
          }
          // Process actual nested rows if they exist and no state is active
          else if (nestedRows.length > 0) {
            // Build path for nested rows (parent path + grouping key)
            const nestedPath = [...rowPath, currentGroupingKey];
            // Recursively process nested rows
            processRows(nestedRows, currentDepth + 1, nestedPath);
          }
        }
      });
    };

    processRows(rows, 0);
    return result;
  }, [
    rows,
    rowGrouping,
    rowIdAccessor,
    unexpandedRows,
    expandAll,
    rowStateMap,
    hasLoadingRenderer,
    hasErrorRenderer,
    hasEmptyRenderer,
  ]);
};

export default useFlattenedRows;
