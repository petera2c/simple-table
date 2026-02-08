import { useMemo } from "react";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import Row from "../types/Row";
import RowState from "../types/RowState";
import TableRow from "../types/TableRow";
import {
  generateRowId,
  rowIdToString,
  getNestedRows,
  isRowExpanded,
  calculateNestedGridHeight,
} from "../utils/rowUtils";
import { HeightOffsets } from "../utils/infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";
import { GetRowId } from "../types/GetRowId";

interface UseFlattenedRowsProps {
  rows: Row[];
  rowGrouping?: Accessor[];
  getRowId?: GetRowId;
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
  parentEndPositions: number[]; // Track the end position of each depth-0 parent row (including its children)
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
  getRowId,
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
      const flattenedRows = rows.map((row, index) => {
        const rowPath = [index];
        const rowIndexPath = [index];
        const rowId = generateRowId({
          row,
          getRowId,
          depth: 0,
          index,
          rowPath,
          rowIndexPath,
          groupingKey: undefined,
        });

        return {
          row,
          depth: 0,
          displayPosition: index,
          groupingKey: undefined,
          position: index,
          rowId,
          rowPath,
          rowIndexPath,
          absoluteRowIndex: index,
          isLastGroupRow: false,
        };
      });
      // For non-grouped rows, each row is its own "parent" with end position = index + 1
      const parentEndPositions = rows.map((_, index) => index + 1);

      return {
        flattenedRows,
        heightOffsets: [],
        paginatableRows: flattenedRows, // Same as flattenedRows when no grouping
        parentEndPositions,
      };
    }

    const result: TableRow[] = [];
    const paginatableRowsBuilder: TableRow[] = [];
    const heightOffsets: HeightOffsets = [];
    const parentEndPositions: number[] = [];

    // Track displayPosition separately from position
    // displayPosition is for UI row numbers (skips nested grid rows)
    // position is for actual array index and positioning calculations
    let displayPosition = 0;

    const processRows = (
      currentRows: Row[],
      currentDepth: number,
      parentIdPath: (string | number)[] = [],
      parentIndexPath: number[] = [],
      parentIndices: number[] = []
    ): void => {
      currentRows.forEach((row, index) => {
        const currentGroupingKey = rowGrouping[currentDepth];
        const position = result.length;

        // Build the ID path: always includes index and grouping keys for readability
        // The parent path already has the pattern: [index, groupKey, index, groupKey, ...]
        // We add: the current index
        // Example: parent=[1, "stores"], index=5 -> [1, "stores", 5]
        const rowPath = [...parentIdPath, index];

        // Build the index path (always using array indices only, no grouping keys)
        const rowIndexPath = [...parentIndexPath, index];

        // Get unique row ID array (includes path + optional custom ID)
        const rowId = generateRowId({
          row,
          getRowId,
          depth: currentDepth,
          index,
          rowPath,
          rowIndexPath,
          groupingKey: currentGroupingKey,
        });

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
          rowId,
          rowPath,
          rowIndexPath,
          absoluteRowIndex: position,
          parentIndices: parentIndices.length > 0 ? [...parentIndices] : undefined,
        };
        result.push(mainRow);

        // This is a paginatable data row (not a nested grid or state indicator)
        paginatableRowsBuilder.push(mainRow);

        // Increment displayPosition for this data row
        displayPosition++;

        // Convert row ID array to string for use as Map/Set key
        const rowIdKey = rowIdToString(rowId);

        // Check if row should be expanded using the unique ID
        const isExpanded = isRowExpanded(
          rowIdKey,
          currentDepth,
          expandedDepths,
          expandedRows,
          collapsedRows
        );

        // If row is expanded and has nested data for the current grouping level
        if (isExpanded && currentDepth < rowGrouping.length) {
          const rowState = rowStateMap?.get(rowIdKey);
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

            const nestedGridRowPath = [...rowPath, currentGroupingKey];
            result.push({
              row: {}, // Empty row object, content will be rendered by NestedGridRow
              depth: currentDepth + 1,
              displayPosition: displayPosition - 1, // Use same displayPosition as parent row
              groupingKey: currentGroupingKey,
              position: nestedGridPosition,
              isLastGroupRow: false,
              rowId: nestedGridRowPath,
              rowPath: nestedGridRowPath,
              rowIndexPath,
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
              const stateRowPath = [...rowPath, currentGroupingKey];
              result.push({
                row: {}, // Empty row object, content will be rendered by state indicator
                depth: currentDepth + 1,
                displayPosition: displayPosition - 1, // Use same displayPosition as parent row
                groupingKey: currentGroupingKey,
                position: statePosition,
                isLastGroupRow: false,
                rowId: stateRowPath,
                rowPath: stateRowPath,
                rowIndexPath,
                stateIndicator: {
                  parentRowId: rowIdKey,
                  parentRow: row,
                  state: rowState,
                },
                absoluteRowIndex: statePosition,
                parentIndices: [...parentIndices, currentRowIndex],
              });
              // Don't increment displayPosition for state indicator rows - they show custom content
            } else if (rowState.loading && !hasLoadingRenderer) {
              // If loading but no custom renderer, add a dummy skeleton row
              const skeletonPosition = result.length;
              const skeletonRowPath = [...rowPath, currentGroupingKey, "loading-skeleton"];
              result.push({
                row: {},
                depth: currentDepth + 1,
                displayPosition: displayPosition - 1, // Use same displayPosition as parent row
                groupingKey: currentGroupingKey,
                position: skeletonPosition,
                isLastGroupRow: false,
                rowId: skeletonRowPath,
                rowPath: skeletonRowPath,
                rowIndexPath,
                isLoadingSkeleton: true,
                absoluteRowIndex: skeletonPosition,
                parentIndices: [...parentIndices, currentRowIndex],
              });
            }
          }
          // Process actual nested rows if they exist and no state is active
          else if (nestedRows.length > 0) {
            // Build paths for nested rows (parent path + grouping key)
            const nestedIdPath = [...rowPath, currentGroupingKey];
            const nestedIndexPath = [...rowIndexPath];
            // Recursively process nested rows, passing current row's index as parent
            processRows(nestedRows, currentDepth + 1, nestedIdPath, nestedIndexPath, [
              ...parentIndices,
              currentRowIndex,
            ]);
          }
        }

        // After processing this depth-0 parent and all its children, record the end position
        if (currentDepth === 0) {
          parentEndPositions.push(result.length);
        }
      });
    };

    processRows(rows, 0, [], [], []);

    return {
      flattenedRows: result,
      heightOffsets,
      paginatableRows: paginatableRowsBuilder,
      parentEndPositions,
    };
  }, [
    rows,
    rowGrouping,
    getRowId,
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
