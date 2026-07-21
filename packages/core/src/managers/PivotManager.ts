import type HeaderObject from "../types/HeaderObject";
import type { Accessor } from "../types/HeaderObject";
import type Row from "../types/Row";
import type { PivotConfig, PivotResult } from "../types/PivotTypes";
import { pivotRows } from "../utils/pivot/pivotRows";

export interface PivotManagerConfig {
  sourceRows: Row[];
  fieldHeaders: HeaderObject[];
  pivot: PivotConfig | null;
}

export interface PivotManagerState {
  active: boolean;
  pivotedRows: Row[];
  headers: HeaderObject[];
  rowGrouping?: Accessor[];
  pivot: PivotConfig | null;
}

type StateChangeCallback = (state: PivotManagerState) => void;

const serializePivot = (pivot: PivotConfig | null): string => {
  if (!pivot) return "";
  // Exclude function refs from AggregationConfig for cache key; identity of
  // parseValue/customFn is checked separately via pivot reference when needed.
  return JSON.stringify({
    rows: pivot.rows,
    columns: pivot.columns,
    values: pivot.values.map((v) => ({
      accessor: v.accessor,
      label: v.label,
      type: v.aggregation.type,
    })),
    showRowTotals: pivot.showRowTotals !== false,
    showColumnTotals: pivot.showColumnTotals !== false,
    showGrandTotal: pivot.showGrandTotal !== false,
  });
};

export class PivotManager {
  private config: PivotManagerConfig;
  private state: PivotManagerState;
  private subscribers: Set<StateChangeCallback> = new Set();
  private cacheKey = "";

  constructor(config: PivotManagerConfig) {
    this.config = config;
    this.state = this.computeState(config);
    this.cacheKey = this.buildCacheKey(config);
  }

  private buildCacheKey(config: PivotManagerConfig): string {
    return `${serializePivot(config.pivot)}|rows:${config.sourceRows.length}|hdr:${config.fieldHeaders.length}`;
  }

  private computeState(config: PivotManagerConfig): PivotManagerState {
    const pivot = config.pivot ?? null;
    if (!pivot || !pivot.values || pivot.values.length === 0) {
      return {
        active: false,
        pivotedRows: config.sourceRows,
        headers: config.fieldHeaders,
        rowGrouping: undefined,
        pivot: null,
      };
    }

    let result: PivotResult;
    try {
      result = pivotRows({
        rows: config.sourceRows,
        pivot,
        fieldHeaders: config.fieldHeaders,
      });
    } catch {
      return {
        active: false,
        pivotedRows: config.sourceRows,
        headers: config.fieldHeaders,
        rowGrouping: undefined,
        pivot: null,
      };
    }

    return {
      active: true,
      pivotedRows: result.rows,
      headers: result.headers,
      rowGrouping: result.rowGrouping,
      pivot,
    };
  }

  getState(): PivotManagerState {
    return this.state;
  }

  isActive(): boolean {
    return this.state.active;
  }

  getPivot(): PivotConfig | null {
    return this.state.pivot;
  }

  updateConfig(partial: Partial<PivotManagerConfig>): void {
    const next: PivotManagerConfig = { ...this.config, ...partial };
    const nextKey = this.buildCacheKey(next);

    // Always recompute when sourceRows or fieldHeaders reference changes, or
    // pivot identity/serialized shape changes.
    const rowsChanged = partial.sourceRows !== undefined && partial.sourceRows !== this.config.sourceRows;
    const headersChanged =
      partial.fieldHeaders !== undefined && partial.fieldHeaders !== this.config.fieldHeaders;
    const pivotChanged = partial.pivot !== undefined && partial.pivot !== this.config.pivot;

    this.config = next;

    if (!rowsChanged && !headersChanged && !pivotChanged && nextKey === this.cacheKey) {
      return;
    }

    this.cacheKey = nextKey;
    this.state = this.computeState(this.config);
    this.notifySubscribers();
  }

  setPivot(pivot: PivotConfig | null): void {
    this.updateConfig({ pivot });
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

  destroy(): void {
    this.subscribers.clear();
  }
}
