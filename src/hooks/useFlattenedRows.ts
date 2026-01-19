import { useMemo } from "react";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import RowState from "../types/RowState";
import TableRow from "../types/TableRow";
import { getRowId, getNestedRows, isRowExpanded, calculateNestedGridHeight } from "../utils/rowUtils";

interface UseFlattenedRowsProps {
  rows: Row[];
  rowGrouping?: Accessor[];
  expandedRows: Map<string, number>;
  collapsedRows: Map<string, number>;
  expandedDepths: Set<number>;
  rowStateMap: Map<string | number, RowState>;
  hasLoadingRenderer: boolean;
  hasErrorRenderer: boolean;
  hasEmptyRenderer: boolean;
  headers: HeaderObject[];
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
  expandedRows,
  collapsedRows,
  expandedDepths,
  rowStateMap,
  hasLoadingRenderer,
  hasErrorRenderer,
  hasEmptyRenderer,
  headers,
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
            rowPath: [index],
            absoluteRowIndex: index,
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
        const rowId = getRowId(rowPath);

        // Determine if this is the last row at depth 0
        const isLastGroupRow = currentDepth === 0;
        // Add the main row
        result.push({
          row,
          depth: currentDepth,
          displayPosition: position,
          groupingKey: currentGroupingKey,
          position,
          isLastGroupRow,
          rowPath,
          absoluteRowIndex: position,
        });

        // Check if row should be expanded using the unique ID
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
            const nestedGridPosition = result.length;
            
            // Calculate the height for this nested grid
            const nestedGridRowHeight = expandableHeader.nestedGrid.rowHeight || 32;
            const calculatedHeight = calculateNestedGridHeight({
              childRowCount: nestedRows.length,
              rowHeight: nestedGridRowHeight,
              headerHeight: 32, // Standard header height
            });
            
            result.push({
              row: {}, // Empty row object, content will be rendered by NestedGridRow
              depth: currentDepth + 1,
              displayPosition: nestedGridPosition,
              groupingKey: currentGroupingKey,
              position: nestedGridPosition,
              isLastGroupRow: false,
              rowPath: [...rowPath, currentGroupingKey],
              nestedGrid: {
                parentRow: row,
                expandableHeader,
                childAccessor: currentGroupingKey,
                calculatedHeight,
              },
              absoluteRowIndex: nestedGridPosition,
            });
          }
          // Show state indicator row if loading/error/empty state is active AND a corresponding renderer exists
          else if (rowState && (rowState.loading || rowState.error || rowState.isEmpty)) {
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
                absoluteRowIndex: statePosition,
              });
            } else if (rowState.loading && !hasLoadingRenderer) {
              // If loading but no custom renderer, add a dummy skeleton row
              const skeletonPosition = result.length;
              result.push({
                row: {},
                depth: currentDepth + 1,
                displayPosition: skeletonPosition,
                groupingKey: currentGroupingKey,
                position: skeletonPosition,
                isLastGroupRow: false,
                rowPath: [...rowPath, currentGroupingKey, "loading-skeleton"],
                isLoadingSkeleton: true,
                absoluteRowIndex: skeletonPosition,
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
    expandedRows,
    collapsedRows,
    expandedDepths,
    rowStateMap,
    hasLoadingRenderer,
    hasErrorRenderer,
    hasEmptyRenderer,
    headers,
  ]);
};

export default useFlattenedRows;
