import { Accessor } from "./HeaderObject";
import { AggregationConfig } from "./AggregationTypes";
import HeaderObject from "./HeaderObject";
import Row from "./Row";

export type PivotValueConfig = {
  accessor: Accessor;
  aggregation: AggregationConfig;
  label?: string;
};

export type PivotConfig = {
  /** Row dimension accessors (0+). Multi-level dims become an expandable tree. */
  rows: Accessor[];
  /** Column dimension accessors (0+). Distinct values become dynamic header groups. */
  columns: Accessor[];
  /** Value/measure configs (required, length >= 1). */
  values: PivotValueConfig[];
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
  headers: HeaderObject[];
  /** Internal rowGrouping to use while pivot is active (undefined when flat). */
  rowGrouping?: Accessor[];
};
