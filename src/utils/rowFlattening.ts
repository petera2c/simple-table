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
  calculateFinalNestedGridHeight,
} from "./rowUtils";
import { HeightOffsets } from "./infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";
import { GetRowId } from "../types/GetRowId";

export interface FlattenRowsConfig {
  rows: Row[];
  rowGrouping?: Accessor[];
  getRowId?: GetRowId;
  expandedRows?: Map<string, number>;
  collapsedRows?: Map<string, number>;
  expandedDepths?: Set<number>;
  rowStateMap?: Map<string | number, RowState>;
  hasLoadingRenderer?: boolean;
  hasErrorRenderer?: boolean;
  hasEmptyRenderer?: boolean;
  headers?: HeaderObject[];
  rowHeight?: number;
  headerHeight?: number;
  customTheme?: CustomTheme;
}

export interface FlattenRowsResult {
  flattenedRows: TableRow[];
  heightOffsets: HeightOffsets;
  paginatableRows: TableRow[];
  parentEndPositions: number[];
}

export function flattenRows(config: FlattenRowsConfig): FlattenRowsResult {
  const {
    rows = [],
    rowGrouping = [],
    getRowId,
    expandedRows = new Map(),
    collapsedRows = new Map(),
    expandedDepths = new Set(),
    rowStateMap = new Map(),
    hasLoadingRenderer = false,
    hasErrorRenderer = false,
    hasEmptyRenderer = false,
    headers = [],
    rowHeight = 40,
    headerHeight = 40,
    customTheme,
  } = config;

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

    const parentEndPositions = rows.map((_, index) => index + 1);

    return {
      flattenedRows,
      heightOffsets: [],
      paginatableRows: flattenedRows,
      parentEndPositions,
    };
  }

  const result: TableRow[] = [];
  const paginatableRowsBuilder: TableRow[] = [];
  const heightOffsets: HeightOffsets = [];
  const parentEndPositions: number[] = [];

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

      const rowPath = [...parentIdPath, index];
      const rowIndexPath = [...parentIndexPath, index];

      const rowId = generateRowId({
        row,
        getRowId,
        depth: currentDepth,
        index,
        rowPath,
        rowIndexPath,
        groupingKey: currentGroupingKey,
      });

      const isLastGroupRow = currentDepth === 0;
      const currentRowIndex = result.length;

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
      paginatableRowsBuilder.push(mainRow);

      displayPosition++;

      const rowIdKey = rowIdToString(rowId);

      const isExpanded = isRowExpanded(
        rowIdKey,
        currentDepth,
        expandedDepths,
        expandedRows,
        collapsedRows
      );

      if (isExpanded && currentDepth < rowGrouping.length) {
        const rowState = rowStateMap?.get(rowIdKey);
        const nestedRows = getNestedRows(row, currentGroupingKey);

        const expandableHeader = headers.find((h) => h.expandable && h.nestedTable);

        if (expandableHeader?.nestedTable && nestedRows.length > 0) {
          const nestedGridPosition = result.length;

          const nestedGridRowHeight =
            expandableHeader.nestedTable.customTheme?.rowHeight || rowHeight;
          const nestedGridHeaderHeight =
            expandableHeader.nestedTable.customTheme?.headerHeight || headerHeight;

          const calculatedHeight = calculateNestedGridHeight({
            childRowCount: nestedRows.length,
            rowHeight: nestedGridRowHeight,
            headerHeight: nestedGridHeaderHeight,
            customTheme: customTheme!,
          });

          const finalHeight = calculateFinalNestedGridHeight({
            calculatedHeight,
            customHeight: expandableHeader.nestedTable.height,
            customTheme: customTheme!,
          });

          const extraHeight = finalHeight - rowHeight;

          heightOffsets.push([nestedGridPosition, extraHeight]);

          const nestedGridRowPath = [...rowPath, currentGroupingKey];
          result.push({
            row: {},
            depth: currentDepth + 1,
            displayPosition: displayPosition - 1,
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
              calculatedHeight: finalHeight,
            },
            absoluteRowIndex: nestedGridPosition,
          });
        } else if (rowState && (rowState.loading || rowState.error || rowState.isEmpty)) {
          const shouldShowState =
            (rowState.loading && hasLoadingRenderer) ||
            (rowState.error && hasErrorRenderer) ||
            (rowState.isEmpty && hasEmptyRenderer);

          if (shouldShowState) {
            const statePosition = result.length;
            const stateRowPath = [...rowPath, currentGroupingKey];
            result.push({
              row: {},
              depth: currentDepth + 1,
              displayPosition: displayPosition - 1,
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
          } else if (rowState.loading && !hasLoadingRenderer) {
            const skeletonPosition = result.length;
            const skeletonRowPath = [...rowPath, currentGroupingKey, "loading-skeleton"];
            result.push({
              row: {},
              depth: currentDepth + 1,
              displayPosition: displayPosition - 1,
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
        } else if (nestedRows.length > 0) {
          const nestedIdPath = [...rowPath, currentGroupingKey];
          const nestedIndexPath = [...rowIndexPath];
          processRows(nestedRows, currentDepth + 1, nestedIdPath, nestedIndexPath, [
            ...parentIndices,
            currentRowIndex,
          ]);
        }
      }

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
}
