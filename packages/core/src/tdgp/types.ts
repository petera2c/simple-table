import type { Accessor } from "../types/ColumnDef";
import type ColumnDef from "../types/ColumnDef";
import type { TableFilterState } from "../types/FilterTypes";
import type { GetRowId } from "../types/GetRowId";
import type OnRowGroupExpandProps from "../types/OnRowGroupExpandProps";
import type Row from "../types/Row";
import type { RowData } from "../types/Row";
import type SortColumn from "../types/SortColumn";

/** Nested-children field used when the server returns grouped rows. */
export const TDGP_CHILDREN_ACCESSOR = "__tdgpChildren";

/** Group key path stored on a grouped row (`["France", "backend"]`). */
export const TDGP_GROUP_KEYS = "__tdgpKeys";

export type TdgpFilterOperator =
  | "EQ"
  | "NEQ"
  | "GT"
  | "GTE"
  | "LT"
  | "LTE"
  | "BETWEEN"
  | "IN"
  | "CONTAINS"
  | "STARTS_WITH"
  | "ENDS_WITH"
  | "IS_BLANK"
  | "IS_NOT_BLANK";

export type TdgpFilterPredicate = {
  kind: "predicate";
  field: string;
  operator: TdgpFilterOperator;
  args?: Array<string | number | boolean | null>;
};

export type TdgpFilterGroup = {
  kind: "group";
  combinator: "AND" | "OR";
  children: TdgpFilterModel[];
};

export type TdgpFilterNot = {
  kind: "not";
  child: TdgpFilterModel;
};

export type TdgpFilterModel = TdgpFilterGroup | TdgpFilterNot | TdgpFilterPredicate;

export type TdgpSortModel = {
  field: string;
  dir: "asc" | "desc";
};

export type TdgpAggregationFn = "sum" | "avg" | "min" | "max" | "count";

export type TdgpAggregation = {
  id: string;
  field: string;
  fn: TdgpAggregationFn;
};

export type TdgpQueryRequest = {
  start?: number;
  limit?: number;
  filter?: TdgpFilterModel;
  sort?: TdgpSortModel[];
  groupBy?: { field: string }[];
  groupKeys?: string[];
  aggregations?: TdgpAggregation[];
  process?: {
    group?: "server" | "client";
    pivot?: "server" | "client";
    aggregation?: "server" | "client";
    pagination?: "server" | "client";
  };
};

export type TdgpGroupNode<TData extends RowData = Row> = {
  keys: string[];
  data: TData;
  aggregations?: Record<string, number | null>;
};

export type TdgpQueryResponse<TData extends RowData = unknown> = {
  protocol?: string;
  data: Array<TData | TdgpGroupNode<TData>>;
  totalCount: number;
  totalCountUnfiltered?: number;
};

/** Minimal client shape. `createTdgpClient()` from `@thedatagrid/client` matches this. */
export interface TdgpQueryClient {
  query(dataset: string, request?: TdgpQueryRequest): Promise<TdgpQueryResponse<unknown>>;
}

export type TdgpTableProps<TData extends RowData = Row> = {
  enablePagination: true;
  serverSidePagination: true;
  rowsPerPage: number;
  totalRowCount: number;
  isLoading: boolean;
  externalSortHandling: true;
  externalFilterHandling: true;
  onPageChange: (page: number) => void | Promise<void>;
  onSortChange: (sort: SortColumn | null) => void;
  onFilterChange: (filters: TableFilterState<TData>) => void;
  getRowId: GetRowId<TData>;
  rowGrouping?: Accessor<TData>[];
  onRowGroupExpand?: (props: OnRowGroupExpandProps<TData>) => void | Promise<void>;
  /** Groups start collapsed. Children load when the user expands a row. */
  expandAll?: false;
};

export type TdgpTableSnapshot<TData extends RowData = Row> = {
  rows: TData[];
  columns: ColumnDef<TData, any>[];
  isLoading: boolean;
  error: string | null;
  totalRowCount: number;
  tableProps: TdgpTableProps<TData>;
};

export type TdgpTableSourceOptions<TData extends RowData = Row> = {
  client: TdgpQueryClient;
  dataset: string;
  columns: ColumnDef<TData, any>[];
  /** Rows per page. Default 50. */
  pageSize?: number;
  /** Field used as the row id for leaf rows. Default `"id"`. */
  primaryKey?: string;
  /** Group on the server by these fields, loading children when a group expands. */
  groupBy?: string[];
  /** Aggregations computed on the server for grouped rows. */
  aggregations?: TdgpAggregation[];
};

export type TdgpTableSource<TData extends RowData = Row> = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => TdgpTableSnapshot<TData>;
  /** Load the current page. Called once from the React hook on mount. */
  start: () => void;
  /** Ignore in-flight responses and stop later loads. */
  stop: () => void;
  reload: () => void;
  /**
   * Replace client, columns, and query options. Reloads when dataset, page
   * size, primary key, group fields, or aggregations change.
   */
  applyOptions: (next: TdgpTableSourceOptions<TData>) => void;
};
