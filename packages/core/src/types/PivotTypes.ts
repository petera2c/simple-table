import { Accessor } from "./ColumnDef";
import { AggregationConfig } from "./AggregationTypes";
import ColumnDef from "./ColumnDef";
import Row from "./Row";
import type { RowData } from "./Row";

export type PivotValueConfig<TData extends RowData = Row> = {
  accessor: Accessor<TData>;
  aggregation: AggregationConfig;
  label?: string;
};

export type PivotConfig<TData extends RowData = Row> = {
  /** Row dimension accessors (0+). Multi-level dims become an expandable tree. */
  rows: Accessor<TData>[];
  /** Column dimension accessors (0+). Distinct values become dynamic header groups. */
  columns: Accessor<TData>[];
  /** Value/measure configs (required, length >= 1). */
  values: PivotValueConfig<TData>[];
  /** Total column(s) aggregating across column dimensions. Default true. */
  showRowTotals?: boolean;
  /** Total row aggregating across row dimensions. Default true. */
  showColumnTotals?: boolean;
  /** Grand-total cell(s) on the totals row/column. Default true. */
  showGrandTotal?: boolean;
};

/** Synthetic child-array key used for multi-level pivot row trees. */
export const PIVOT_CHILDREN_KEY = "__pivotChildren";

/** Marker on total rows for styling / identification. */
export const PIVOT_IS_TOTAL_KEY = "__pivotIsTotal";

/** Prefix for generated pivot measure accessors. */
export const PIVOT_ACCESSOR_PREFIX = "__pivot:";

/** Label used when a dimension value is null/undefined. */
export const PIVOT_BLANK_LABEL = "(blank)";

export type PivotResult = {
  rows: Row[];
  headers: ColumnDef[];
  /**
   * Internal rowGrouping while pivot is active (undefined when flat).
   * Kept as open accessors — pivot injects synthetic keys.
   */
  rowGrouping?: Accessor[];
};
