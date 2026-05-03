import HeaderObject, { Accessor } from "../types/HeaderObject";
import { AggregationConfig } from "../types/AggregationTypes";
import Row from "../types/Row";
import RowState from "../types/RowState";
import TableRow from "../types/TableRow";
import { flattenAllHeaders } from "../utils/headerUtils";
import {
  generateRowId,
  generateStableRowKey,
  expandStateKey,
  nestedChromeRowKey,
  getNestedRows,
  isRowExpanded,
  calculateNestedGridHeight,
  calculateFinalNestedGridHeight,
  isRowArray,
  getNestedValue,
  setNestedValue,
} from "../utils/rowUtils";
import { HeightOffsets } from "../utils/infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";
import { GetRowId } from "../types/GetRowId";

export interface RowManagerConfig {
  rows: Row[];
  headers: HeaderObject[];
  rowGrouping?: Accessor[];
  getRowId?: GetRowId;
  rowHeight: number;
  headerHeight: number;
  customTheme: CustomTheme;
  hasLoadingRenderer: boolean;
  hasErrorRenderer: boolean;
  hasEmptyRenderer: boolean;
}

export interface RowManagerState {
  expandedRows: Map<string, number>;
  collapsedRows: Map<string, number>;
  expandedDepths: Set<number>;
  rowStateMap: Map<string | number, RowState>;
  aggregatedRows: Row[];
  flattenedRows: TableRow[];
  heightOffsets: HeightOffsets;
  paginatableRows: TableRow[];
  parentEndPositions: number[];
}

type StateChangeCallback = (state: RowManagerState) => void;

export class RowManager {
  private config: RowManagerConfig;
  private state: RowManagerState;
  private subscribers: Set<StateChangeCallback> = new Set();

  constructor(config: RowManagerConfig) {
    this.config = config;
    
    const aggregatedRows = this.computeAggregatedRows(config.rows);
    const flattenedResult = this.computeFlattenedRows(aggregatedRows);
    
    this.state = {
      expandedRows: new Map(),
      collapsedRows: new Map(),
      expandedDepths: new Set(),
      rowStateMap: new Map(),
      aggregatedRows,
      ...flattenedResult,
    };
  }

  private getAllAggregationHeaders(): HeaderObject[] {
    return flattenAllHeaders(this.config.headers).filter((header) => header.aggregation);
  }

  private calculateAggregation(
    childRows: Row[],
    accessor: Accessor,
    config: AggregationConfig,
    nextGroupKey?: string
  ): any {
    const allValues: any[] = [];

    const collectValues = (rows: Row[]) => {
      rows.forEach((row) => {
        const nextGroupValue = nextGroupKey ? row[nextGroupKey] : undefined;
        if (nextGroupKey && nextGroupValue && isRowArray(nextGroupValue)) {
          collectValues(nextGroupValue);
        } else {
          const value = getNestedValue(row, accessor);
          if (value !== undefined && value !== null) {
            allValues.push(value);
          }
        }
      });
    };

    collectValues(childRows);

    if (allValues.length === 0) {
      return undefined;
    }

    if (config.type === "custom" && config.customFn) {
      return config.customFn(allValues);
    }

    const numericValues = config.parseValue
      ? allValues.map(config.parseValue).filter((val) => !isNaN(val))
      : allValues
          .map((val) => {
            if (typeof val === "number") return val;
            if (typeof val === "string") return parseFloat(val);
            return NaN;
          })
          .filter((val) => !isNaN(val));

    if (numericValues.length === 0) {
      return config.type === "count" ? allValues.length : undefined;
    }

    let result: number;

    switch (config.type) {
      case "sum":
        result = numericValues.reduce((sum, val) => sum + val, 0);
        break;
      case "average":
        result = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
        break;
      case "count":
        result = allValues.length;
        break;
      case "min":
        result = Math.min(...numericValues);
        break;
      case "max":
        result = Math.max(...numericValues);
        break;
      default:
        return undefined;
    }

    return config.formatResult ? config.formatResult(result) : result;
  }

  private computeAggregatedRows(rows: Row[]): Row[] {
    const rowGrouping = this.config.rowGrouping;
    
    if (!rowGrouping || rowGrouping.length === 0) {
      return rows;
    }

    const aggregationHeaders = this.getAllAggregationHeaders();

    if (aggregationHeaders.length === 0) {
      return rows;
    }

    const aggregatedRows = JSON.parse(JSON.stringify(rows));

    const processRows = (rowsToProcess: Row[], groupingLevel: number = 0): Row[] => {
      return rowsToProcess.map((row) => {
        const currentGroupKey = rowGrouping[groupingLevel];
        const nextGroupKey = rowGrouping[groupingLevel + 1];

        const currentGroupValue = row[currentGroupKey];
        if (currentGroupValue && isRowArray(currentGroupValue)) {
          const processedChildren = processRows(currentGroupValue, groupingLevel + 1);

          const aggregatedRow = { ...row };
          aggregatedRow[currentGroupKey] = processedChildren;

          aggregationHeaders.forEach((header) => {
            const aggregatedValue = this.calculateAggregation(
              processedChildren,
              header.accessor,
              header.aggregation!,
              nextGroupKey
            );

            if (aggregatedValue !== undefined) {
              setNestedValue(aggregatedRow, header.accessor, aggregatedValue);
            }
          });

          return aggregatedRow;
        }

        return row;
      });
    };

    return processRows(aggregatedRows);
  }

  private computeFlattenedRows(rows: Row[]): {
    flattenedRows: TableRow[];
    heightOffsets: HeightOffsets;
    paginatableRows: TableRow[];
    parentEndPositions: number[];
  } {
    const rowGrouping = this.config.rowGrouping;
    
    if (!rowGrouping || rowGrouping.length === 0) {
      const flattenedRows = rows.map((row, index) => {
        const rowPath = [index];
        const rowIndexPath = [index];
        const rowId = generateRowId({
          row,
          getRowId: this.config.getRowId,
          depth: 0,
          index,
          rowPath,
          rowIndexPath,
          groupingKey: undefined,
        });

        const stableRowKey = generateStableRowKey({
          getRowId: this.config.getRowId,
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
          getRowId: this.config.getRowId,
          depth: currentDepth,
          index,
          rowPath,
          rowIndexPath,
          groupingKey: currentGroupingKey,
        });

        const stableRowKey = generateStableRowKey({
          getRowId: this.config.getRowId,
          row,
          depth: currentDepth,
          index,
          rowPath,
          rowIndexPath,
          groupingKey: currentGroupingKey,
          parentStableKey,
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
          stableRowKey,
        };
        result.push(mainRow);
        paginatableRowsBuilder.push(mainRow);

        displayPosition++;

        const rowExpandKey = expandStateKey(mainRow);

        const isExpanded = isRowExpanded(
          rowExpandKey,
          currentDepth,
          this.state.expandedDepths,
          this.state.expandedRows,
          this.state.collapsedRows
        );

        if (isExpanded && currentDepth < rowGrouping.length) {
          const rowState = this.state.rowStateMap?.get(rowExpandKey);
          const nestedRows = getNestedRows(row, currentGroupingKey);

          const expandableHeader = this.config.headers.find((h) => h.expandable && h.nestedTable);

          if (expandableHeader?.nestedTable && nestedRows.length > 0) {
            const nestedGridPosition = result.length;

            const nestedGridRowHeight =
              expandableHeader.nestedTable.customTheme?.rowHeight || this.config.rowHeight;
            const nestedGridHeaderHeight =
              expandableHeader.nestedTable.customTheme?.headerHeight || this.config.headerHeight;
            
            const calculatedHeight = calculateNestedGridHeight({
              childRowCount: nestedRows.length,
              rowHeight: nestedGridRowHeight,
              headerHeight: nestedGridHeaderHeight,
              customTheme: this.config.customTheme,
            });

            const finalHeight = calculateFinalNestedGridHeight({
              calculatedHeight,
              customHeight: expandableHeader.nestedTable.height,
              customTheme: this.config.customTheme,
            });

            const extraHeight = finalHeight - this.config.rowHeight;

            heightOffsets.push([nestedGridPosition, extraHeight]);

            const nestedGridRowPath = [...rowPath, currentGroupingKey];
            const nestedDomKey = nestedChromeRowKey(rowExpandKey, currentGroupingKey);
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
              stableRowKey: nestedDomKey,
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
              (rowState.loading && this.config.hasLoadingRenderer) ||
              (rowState.error && this.config.hasErrorRenderer) ||
              (rowState.isEmpty && this.config.hasEmptyRenderer);

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
            } else if (rowState.loading && !this.config.hasLoadingRenderer) {
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
            ], stableRowKey);
          }
        }

        if (currentDepth === 0) {
          parentEndPositions.push(result.length);
        }
      });
    };

    processRows(rows, 0, [], [], [], null);

    return {
      flattenedRows: result,
      heightOffsets,
      paginatableRows: paginatableRowsBuilder,
      parentEndPositions,
    };
  }

  updateConfig(config: Partial<RowManagerConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (config.rows || config.headers || config.rowGrouping) {
      const aggregatedRows = this.computeAggregatedRows(this.config.rows);
      const flattenedResult = this.computeFlattenedRows(aggregatedRows);
      
      this.state = {
        ...this.state,
        aggregatedRows,
        ...flattenedResult,
      };
      
      this.notifySubscribers();
    }
  }

  subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((cb) => cb(this.state));
  }

  setExpandedRows(expandedRows: Map<string, number>): void {
    this.state.expandedRows = expandedRows;
    const flattenedResult = this.computeFlattenedRows(this.state.aggregatedRows);
    this.state = {
      ...this.state,
      ...flattenedResult,
    };
    this.notifySubscribers();
  }

  setCollapsedRows(collapsedRows: Map<string, number>): void {
    this.state.collapsedRows = collapsedRows;
    const flattenedResult = this.computeFlattenedRows(this.state.aggregatedRows);
    this.state = {
      ...this.state,
      ...flattenedResult,
    };
    this.notifySubscribers();
  }

  setExpandedDepths(expandedDepths: Set<number>): void {
    this.state.expandedDepths = expandedDepths;
    const flattenedResult = this.computeFlattenedRows(this.state.aggregatedRows);
    this.state = {
      ...this.state,
      ...flattenedResult,
    };
    this.notifySubscribers();
  }

  setRowStateMap(rowStateMap: Map<string | number, RowState>): void {
    this.state.rowStateMap = rowStateMap;
    const flattenedResult = this.computeFlattenedRows(this.state.aggregatedRows);
    this.state = {
      ...this.state,
      ...flattenedResult,
    };
    this.notifySubscribers();
  }

  getState(): RowManagerState {
    return this.state;
  }

  getAggregatedRows(): Row[] {
    return this.state.aggregatedRows;
  }

  getFlattenedRows(): TableRow[] {
    return this.state.flattenedRows;
  }

  getHeightOffsets(): HeightOffsets {
    return this.state.heightOffsets;
  }

  getPaginatableRows(): TableRow[] {
    return this.state.paginatableRows;
  }

  getParentEndPositions(): number[] {
    return this.state.parentEndPositions;
  }

  destroy(): void {
    this.subscribers.clear();
  }
}
