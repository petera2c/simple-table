import ColumnDef, { Accessor } from "../types/ColumnDef";
import Row from "../types/Row";
import RowState from "../types/RowState";
import TableRow from "../types/TableRow";
import {
  generateRowId,
  generateStableRowKey,
  getNestedRows,
  expandStateKey,
  nestedChromeRowKey,
  isRowExpanded,
  calculateNestedGridHeight,
  calculateFinalNestedGridHeight,
} from "./rowUtils";
import { HeightOffsets } from "./infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";
import { GetRowId } from "../types/GetRowId";
import { isLoadingPlaceholderRow } from "./loadingPlaceholderUtils";

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
  headers?: ColumnDef[];
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
      const stableRowKey = generateStableRowKey({
        getRowId,
        row,
        depth: 0,
        index,
        rowPath,
        rowIndexPath,
        groupingKey: undefined,
        parentStableKey: null,
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
        stableRowKey,
        ...(isLoadingPlaceholderRow(row) ? { isLoadingSkeleton: true } : {}),
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
    parentIndices: number[] = [],
    parentStableKey: string | null = null
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
      const stableRowKey = generateStableRowKey({
        getRowId,
        row,
        depth: currentDepth,
        index,
        rowPath,
        rowIndexPath,
        groupingKey: currentGroupingKey,
        parentStableKey,
      });

      const currentRowIndex = result.length;

      const mainRow = {
        row,
        depth: currentDepth,
        displayPosition,
        groupingKey: currentGroupingKey,
        position,
        isLastGroupRow: false,
        rowId,
        rowPath,
        rowIndexPath,
        absoluteRowIndex: position,
        parentIndices: parentIndices.length > 0 ? [...parentIndices] : undefined,
        stableRowKey,
        ...(isLoadingPlaceholderRow(row) ? { isLoadingSkeleton: true } : {}),
      };
      result.push(mainRow);
      paginatableRowsBuilder.push(mainRow);

      displayPosition++;

      /** Sort/filter-stable key — {@link expandedRows} uses this instead of positional rowId. */
      const rowExpandKey = expandStateKey({ stableRowKey, rowId });

      const isExpanded = isRowExpanded(
        rowExpandKey,
        currentDepth,
        expandedDepths,
        expandedRows,
        collapsedRows
      );

      if (isExpanded && currentDepth < rowGrouping.length) {
        const rowState = rowStateMap?.get(rowExpandKey);
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
            stableRowKey: nestedChromeRowKey(rowExpandKey, currentGroupingKey),
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
              stableRowKey: nestedChromeRowKey(rowExpandKey, currentGroupingKey),
              stateIndicator: {
                parentRowId: rowExpandKey,
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
          processRows(
            nestedRows,
            currentDepth + 1,
            nestedIdPath,
            nestedIndexPath,
            [...parentIndices, currentRowIndex],
            stableRowKey
          );
        }
      }

      if (currentDepth === 0) {
        parentEndPositions.push(result.length);
      }
    });
  };

  processRows(rows, 0, [], [], []);

  // Mark the last row of each depth 0 group with isLastGroupRow flag
  // This should be the last visible descendant, not the depth 0 row itself
  parentEndPositions.forEach((endPosition, groupIndex) => {
    // The row just before endPosition is the last row of this group
    const lastRowIndex = endPosition - 1;
    if (lastRowIndex >= 0 && lastRowIndex < result.length) {
      result[lastRowIndex].isLastGroupRow = true;
    }
  });

  return {
    flattenedRows: result,
    heightOffsets,
    paginatableRows: paginatableRowsBuilder,
    parentEndPositions,
  };
}

/** Exactly one expand/collapse key changed; otherwise a full flatten is required. */
export function findSingleExpansionToggle(
  prevCollapsedKeys: string[],
  prevExpandedKeys: string[],
  nextCollapsed: Map<string, number>,
  nextExpanded: Map<string, number>,
): string | null {
  const prevCollapsed = new Set(prevCollapsedKeys);
  const prevExpanded = new Set(prevExpandedKeys);
  const changed = new Set<string>();
  for (const key of nextCollapsed.keys()) {
    if (!prevCollapsed.has(key)) changed.add(key);
  }
  for (const key of prevCollapsedKeys) {
    if (!nextCollapsed.has(key)) changed.add(key);
  }
  for (const key of nextExpanded.keys()) {
    if (!prevExpanded.has(key)) changed.add(key);
  }
  for (const key of prevExpandedKeys) {
    if (!nextExpanded.has(key)) changed.add(key);
  }
  if (changed.size !== 1) return null;
  return changed.values().next().value ?? null;
}

const replacePathPrefix = (
  path: (string | number)[] | undefined,
  fromPrefix: (string | number)[],
  toPrefix: (string | number)[],
): (string | number)[] | undefined => {
  if (!path || fromPrefix.length > path.length) return path;
  for (let i = 0; i < fromPrefix.length; i++) {
    if (path[i] !== fromPrefix[i]) return path;
  }
  return [...toPrefix, ...path.slice(fromPrefix.length)];
};

const relayoutFlattenedRows = (rows: TableRow[]): void => {
  const indexAtDepth: number[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    row.position = i;
    row.absoluteRowIndex = i;
    row.displayPosition = i;
    row.isLastGroupRow = false;
    indexAtDepth.length = row.depth;
    row.parentIndices = indexAtDepth.length > 0 ? indexAtDepth.slice() : undefined;
    indexAtDepth[row.depth] = i;
  }
};

const rebuildGroupBookkeeping = (rows: TableRow[]): number[] => {
  const parentEndPositions: number[] = [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].depth !== 0) continue;
    let end = i + 1;
    while (end < rows.length && rows[end].depth > 0) end++;
    parentEndPositions.push(end);
    if (end - 1 >= 0) rows[end - 1].isLastGroupRow = true;
  }
  return parentEndPositions;
};

/**
 * Splice one group's children in or out of a cached flatten result instead of
 * walking every still-open child. Used when a single chevron toggle is the
 * only expand-state change.
 */
export function patchFlattenRowsForSingleToggle(
  previous: FlattenRowsResult,
  toggleKey: string,
  config: FlattenRowsConfig,
): FlattenRowsResult | null {
  if (previous.heightOffsets.length > 0) return null;

  const rows = previous.flattenedRows.slice();
  const parentIndex = rows.findIndex((row) => expandStateKey(row) === toggleKey);
  if (parentIndex < 0) return null;

  const parent = rows[parentIndex];
  if (parent.nestedTable || parent.stateIndicator) return null;

  const parentDepth = parent.depth;
  let descendantCount = 0;
  for (let i = parentIndex + 1; i < rows.length && rows[i].depth > parentDepth; i++) {
    if (rows[i].nestedTable || rows[i].stateIndicator) return null;
    descendantCount++;
  }

  const nowExpanded = isRowExpanded(
    toggleKey,
    parentDepth,
    config.expandedDepths ?? new Set(),
    config.expandedRows ?? new Map(),
    config.collapsedRows ?? new Map(),
  );

  if (!nowExpanded) {
    if (descendantCount > 0) {
      rows.splice(parentIndex + 1, descendantCount);
    }
  } else {
    if (descendantCount > 0) return null;
    // Opening a nested group needs a full rebuild; this path only handles top-level groups.
    if (parentDepth !== 0) return null;
    const mini = flattenRows({ ...config, rows: [parent.row] });
    if (mini.heightOffsets.length > 0) return null;
    const descendants = mini.flattenedRows.slice(1);
    if (descendants.length === 0) {
      return previous;
    }
    const miniParent = mini.flattenedRows[0];
    const fromIndexPath = miniParent.rowIndexPath ?? [];
    const toIndexPath = parent.rowIndexPath ?? [];
    const fromRowPath = miniParent.rowPath ?? [];
    const toRowPath = parent.rowPath ?? [];
    for (const child of descendants) {
      const nextIndexPath = replacePathPrefix(child.rowIndexPath, fromIndexPath, toIndexPath);
      child.rowIndexPath = nextIndexPath as number[] | undefined;
      child.rowPath = replacePathPrefix(child.rowPath, fromRowPath, toRowPath);
      child.rowId = replacePathPrefix(child.rowId, fromRowPath, toRowPath) ?? child.rowId;
    }
    rows.splice(parentIndex + 1, 0, ...descendants);
  }

  relayoutFlattenedRows(rows);
  const parentEndPositions = rebuildGroupBookkeeping(rows);
  const paginatableRows = rows.filter((row) => !row.nestedTable && !row.stateIndicator);

  return {
    flattenedRows: rows,
    heightOffsets: previous.heightOffsets,
    paginatableRows,
    parentEndPositions,
  };
}
