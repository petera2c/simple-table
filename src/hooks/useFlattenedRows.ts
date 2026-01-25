import { useMemo } from "react";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import RowState from "../types/RowState";
import TableRow from "../types/TableRow";
import {
  getRowId,
  getNestedRows,
  isRowExpanded,
  calculateNestedGridHeight,
} from "../utils/rowUtils";
import { HeightOffsets } from "../utils/infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";

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
  rowHeight: number;
  headerHeight: number;
  customTheme: CustomTheme;
}

interface UseFlattenedRowsResult {
  flattenedRows: TableRow[];
  heightOffsets: HeightOffsets;
  paginatableRows: TableRow[]; // Rows excluding nested grids and state indicators (for pagination)
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
  rowHeight,
  headerHeight,
  customTheme,
}: UseFlattenedRowsProps): UseFlattenedRowsResult => {
  return useMemo(() => {
    // If no row grouping, just convert rows to TableRow format
    if (!rowGrouping || rowGrouping.length === 0) {
      const flattenedRows = rows.map(
        (row, index) =>
          ({
            row,
            depth: 0,
            displayPosition: index,
            groupingKey: undefined,
            position: index,
            rowPath: [index],
            absoluteRowIndex: index,
          }) as TableRow,
      );
      return {
        flattenedRows,
        heightOffsets: [],
        paginatableRows: flattenedRows, // Same as flattenedRows when no grouping
      };
    }

    const result: TableRow[] = [];
    const paginatableRowsBuilder: TableRow[] = [];
    const heightOffsets: HeightOffsets = [];

    // Track displayPosition separately from position
    // displayPosition is for UI row numbers (skips nested grid rows)
    // position is for actual array index and positioning calculations
    let displayPosition = 0;

    const processRows = (
      currentRows: Row[],
      currentDepth: number,
      parentPath: (string | number)[] = [],
      parentIndices: number[] = [],
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

        // Store the index where this row will be added (for children to reference)
        const currentRowIndex = result.length;

        // Add the main row
        const mainRow = {
          row,
          depth: currentDepth,
          displayPosition,
          groupingKey: currentGroupingKey,
          position,
          isLastGroupRow,
          rowPath,
          absoluteRowIndex: position,
          parentIndices: parentIndices.length > 0 ? [...parentIndices] : undefined,
        };
        result.push(mainRow);

        // This is a paginatable data row (not a nested grid or state indicator)
        paginatableRowsBuilder.push(mainRow);

        // Increment displayPosition for this data row
        displayPosition++;

        // Check if row should be expanded using the unique ID
        const isExpanded = isRowExpanded(
          rowId,
          currentDepth,
          expandedDepths,
          expandedRows,
          collapsedRows,
        );

        // If row is expanded and has nested data for the current grouping level
        if (isExpanded && currentDepth < rowGrouping.length) {
          const rowState = rowStateMap?.get(rowId);
          const nestedRows = getNestedRows(row, currentGroupingKey);

          // Check if any header with expandable=true has a nestedTable configuration
          // The expandable header is the one that shows the expand icon, not necessarily matching the grouping key
          const expandableHeader = headers.find((h) => h.expandable && h.nestedTable);

          // If there's a nested grid configuration, inject a nested grid row instead of regular child rows
          if (expandableHeader?.nestedTable && nestedRows.length > 0) {
            const nestedGridPosition = result.length;

            // Calculate the height for this nested grid
            // Use customTheme from nested grid if provided, otherwise use parent's customTheme
            const nestedGridRowHeight =
              expandableHeader.nestedTable.customTheme?.rowHeight || rowHeight;
            const nestedGridHeaderHeight =
              expandableHeader.nestedTable.customTheme?.headerHeight || headerHeight;
            const calculatedHeight = calculateNestedGridHeight({
              childRowCount: nestedRows.length,
              rowHeight: nestedGridRowHeight,
              headerHeight: nestedGridHeaderHeight,
              customTheme,
            });

            // Calculate extra height (beyond standard row height)
            const extraHeight = calculatedHeight - rowHeight;

            // Add to height offsets array (kept sorted by position)
            heightOffsets.push([nestedGridPosition, extraHeight]);

            result.push({
              row: {}, // Empty row object, content will be rendered by NestedGridRow
              depth: currentDepth + 1,
              displayPosition: displayPosition - 1, // Use same displayPosition as parent row
              groupingKey: currentGroupingKey,
              position: nestedGridPosition,
              isLastGroupRow: false,
              rowPath: [...rowPath, currentGroupingKey],
              nestedTable: {
                parentRow: row,
                expandableHeader,
                childAccessor: currentGroupingKey,
                calculatedHeight,
              },
              absoluteRowIndex: nestedGridPosition,
            });
            // Don't increment displayPosition for nested grid rows - they don't show row numbers
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
                displayPosition: displayPosition - 1, // Use same displayPosition as parent row
                groupingKey: currentGroupingKey,
                position: statePosition,
                isLastGroupRow: false,
                rowPath: [...rowPath, currentGroupingKey],
                stateIndicator: {
                  parentRowId: rowId,
                  state: rowState,
                },
                absoluteRowIndex: statePosition,
                parentIndices: [...parentIndices, currentRowIndex],
              });
              // Don't increment displayPosition for state indicator rows - they show custom content
            } else if (rowState.loading && !hasLoadingRenderer) {
              // If loading but no custom renderer, add a dummy skeleton row
              const skeletonPosition = result.length;
              result.push({
                row: {},
                depth: currentDepth + 1,
                displayPosition: displayPosition - 1, // Use same displayPosition as parent row
                groupingKey: currentGroupingKey,
                position: skeletonPosition,
                isLastGroupRow: false,
                rowPath: [...rowPath, currentGroupingKey, "loading-skeleton"],
                isLoadingSkeleton: true,
                absoluteRowIndex: skeletonPosition,
                parentIndices: [...parentIndices, currentRowIndex],
              });
            }
          }
          // Process actual nested rows if they exist and no state is active
          else if (nestedRows.length > 0) {
            // Build path for nested rows (parent path + grouping key)
            const nestedPath = [...rowPath, currentGroupingKey];
            // Recursively process nested rows, passing current row's index as parent
            processRows(nestedRows, currentDepth + 1, nestedPath, [
              ...parentIndices,
              currentRowIndex,
            ]);
          }
        }
      });
    };

    processRows(rows, 0, [], []);

    return {
      flattenedRows: result,
      heightOffsets,
      paginatableRows: paginatableRowsBuilder,
    };
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
    rowHeight,
    headerHeight,
    customTheme,
  ]);
};

export default useFlattenedRows;
