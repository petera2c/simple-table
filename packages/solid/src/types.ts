import type { JSX } from "solid-js";
import type {
  SimpleTableProps,
  SimpleTableConfig,
  ColumnDef,
  TableAPI,
  CellValue,
  CellRendererProps,
  HeaderRendererProps,
  FooterRendererProps,
  LoadingStateRendererProps,
  ErrorStateRendererProps,
  EmptyStateRendererProps,
  HeaderDropdownProps,
  ColumnEditorRowRendererProps,
  ColumnEditorCustomRendererProps,
  ColumnEditorConfig,
  RowButtonProps,
} from "simple-table-core";

/**
 * Default `TData` for Solid props bags / helpers: open records so untyped
 * object arrays keep assigning to `rows` without `asRows`.
 *
 * Prefer letting `<SimpleTable rows={…} columns={…} />` infer `TData` from
 * those props — an explicit `SimpleTable<MyRow>` is only needed when inference
 * can't see a typed `rows`/`columns` (or for a typed `ref` callback).
 */
export type SolidDefaultRowData = Record<string, any>;

// ─── Internal instance contract ───────────────────────────────────────────────
export interface TableInstance {
  mount(): void;
  update(config: Partial<SimpleTableConfig>): void;
  destroy(): void;
  getAPI(): TableAPI;
}

// ─── Icon overrides ───────────────────────────────────────────────────────────
// Accept Solid JSX.Element in place of SVGSVGElement | HTMLElement | string
export type SolidIconElement = JSX.Element;

export interface SolidIconsConfig {
  drag?: SolidIconElement;
  expand?: SolidIconElement;
  filter?: SolidIconElement;
  headerCollapse?: SolidIconElement;
  headerExpand?: SolidIconElement;
  next?: SolidIconElement;
  prev?: SolidIconElement;
  sortDown?: SolidIconElement;
  sortUp?: SolidIconElement;
  pinnedLeftIcon?: SolidIconElement;
  pinnedRightIcon?: SolidIconElement;
}

// ─── Renderer overrides ───────────────────────────────────────────────────────
// Function types (not `Component<…>`) so inline renderers get contextual typing
// — e.g. `cellRenderer: (props) => …` infers props from TData. Solid components
// still assign to these call signatures.
export type SolidCellRenderer<
  TData extends SolidDefaultRowData = SolidDefaultRowData,
  TValue = CellValue,
> = (props: CellRendererProps<TData, TValue>) => JSX.Element;
export type SolidHeaderRenderer<TData extends SolidDefaultRowData = SolidDefaultRowData> = (
  props: HeaderRendererProps<TData>,
) => JSX.Element;
export type SolidFooterRenderer = (props: FooterRendererProps) => JSX.Element;
export type SolidHeaderDropdown = (props: HeaderDropdownProps) => JSX.Element;
export type SolidColumnEditorRowRenderer = (
  props: ColumnEditorRowRendererProps,
) => JSX.Element;
export type SolidColumnEditorCustomRenderer = (
  props: ColumnEditorCustomRendererProps,
) => JSX.Element;
export type SolidRowButton<TData extends SolidDefaultRowData = SolidDefaultRowData> = (
  props: RowButtonProps<TData>,
) => JSX.Element;

// State renderers can be a function (receives props) or a plain JSX.Element (static markup)
export type SolidLoadingStateRenderer<TData extends SolidDefaultRowData = SolidDefaultRowData> =
  | ((props: LoadingStateRendererProps<TData>) => JSX.Element)
  | JSX.Element;
export type SolidErrorStateRenderer<TData extends SolidDefaultRowData = SolidDefaultRowData> =
  | ((props: ErrorStateRendererProps<TData>) => JSX.Element)
  | JSX.Element;
export type SolidEmptyStateRenderer<TData extends SolidDefaultRowData = SolidDefaultRowData> =
  | ((props: EmptyStateRendererProps<TData>) => JSX.Element)
  | JSX.Element;

// ─── Column editor config override ───────────────────────────────────────────
export interface SolidColumnEditorConfig
  extends Omit<ColumnEditorConfig, "rowRenderer" | "customRenderer"> {
  rowRenderer?: SolidColumnEditorRowRenderer;
  customRenderer?: SolidColumnEditorCustomRenderer;
}

// ─── ColumnDef override ────────────────────────────────────────────────────
/**
 * Column definition for `columns`: same column metadata as core
 * columns, but `cellRenderer` / `headerRenderer` / `children` / `nestedTable` are Solid-only.
 */
export interface SolidColumnDef<
  TData extends SolidDefaultRowData = SolidDefaultRowData,
  TValue = CellValue,
> extends Omit<
  ColumnDef<TData, TValue>,
  "cellRenderer" | "headerRenderer" | "children" | "nestedTable"
> {
  cellRenderer?: SolidCellRenderer<TData, TValue>;
  headerRenderer?: SolidHeaderRenderer<TData>;
  children?: ReadonlyArray<SolidColumnDef<TData, any>>;
  /** Nested grid; child columns may use a different row type than `TData`. */
  nestedTable?: NestedTableSolidConfig;
}

// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with Solid-specific renderer/icon types.
// `SimpleTable` infers `TData` from `rows`/`columns`; use a typed `ref` callback
// when you need a typed imperative handle.
//
//   Overridden to Solid equivalents:
//     - columns → ReadonlyArray<SolidColumnDef<TData>>
//     - footerRenderer         → SolidFooterRenderer
//     - loadingStateRenderer   → SolidLoadingStateRenderer<TData> | JSX.Element
//     - errorStateRenderer     → SolidErrorStateRenderer<TData> | JSX.Element
//     - emptyStateRenderer     → SolidEmptyStateRenderer<TData> | JSX.Element
//     - tableEmptyStateRenderer → JSX.Element
//     - headerDropdown         → SolidHeaderDropdown
//     - columnEditorConfig     → SolidColumnEditorConfig
//     - icons                  → SolidIconsConfig
//     - rowButtons             → SolidRowButton<TData>[]
export interface SimpleTableSolidProps<
  TData extends SolidDefaultRowData = SolidDefaultRowData,
> extends Omit<
  SimpleTableProps<TData>,
  // Overridden below with Solid types
  | "columns"
  | "footerRenderer"
  | "emptyStateRenderer"
  | "errorStateRenderer"
  | "loadingStateRenderer"
  | "tableEmptyStateRenderer"
  | "headerDropdown"
  | "columnEditorConfig"
  | "icons"
  | "rows"
  | "rowButtons"
  | "onColumnOrderChange"
  | "onColumnWidthChange"
  | "onHeaderEdit"
  | "onColumnSelect"
> {
  /** Column definitions. */
  columns?: ReadonlyArray<SolidColumnDef<TData, any>>;
  onColumnOrderChange?: (newHeaders: SolidColumnDef<TData, any>[]) => void;
  onColumnWidthChange?: (headers: SolidColumnDef<TData, any>[]) => void;
  onHeaderEdit?: (header: SolidColumnDef<TData, any>, newLabel: string) => void;
  onColumnSelect?: (header: SolidColumnDef<TData, any>) => void;
  /** Row data; cast to vanilla `Row[]` inside the adapter. */
  rows: readonly TData[];
  footerRenderer?: SolidFooterRenderer;
  loadingStateRenderer?: SolidLoadingStateRenderer<TData>;
  errorStateRenderer?: SolidErrorStateRenderer<TData>;
  emptyStateRenderer?: SolidEmptyStateRenderer<TData>;
  tableEmptyStateRenderer?: JSX.Element;
  headerDropdown?: SolidHeaderDropdown;
  columnEditorConfig?: SolidColumnEditorConfig;
  icons?: SolidIconsConfig;
  /** Per-row action buttons; each entry returns JSX rendered into the row's selection column. */
  rowButtons?: SolidRowButton<TData>[];
  /** Callback ref — receives the TableAPI once the table is mounted. */
  ref?: (api: TableAPI<TData>) => void;
}

// ─── Nested table config ─────────────────────────────────────────────────────
/**
 * TData-bound call signatures omitted at nest boundaries so
 * `SolidColumnDef<Child>[]` assigns under a parent column without casts/`any`.
 * Child columns stay fully checked at their own declaration site.
 */
type SolidColumnDefCallbacks =
  | "cellRenderer"
  | "headerRenderer"
  | "children"
  | "nestedTable"
  | "comparator"
  | "exportValueGetter"
  | "valueFormatter"
  | "valueGetter"
  | "quickFilterGetter";

/** Column shape accepted on nested grids — metadata only, no TData-bound callbacks. */
export type NestedSolidColumnDef = Omit<
  SolidColumnDef<SolidDefaultRowData>,
  SolidColumnDefCallbacks
> & {
  children?: ReadonlyArray<NestedSolidColumnDef>;
  nestedTable?: NestedTableSolidConfig;
};

/**
 * Nested grid props (no `rows` / inherited state renderers).
 * Child row shape may differ from the parent column's `TData`.
 */
export type NestedTableSolidConfig = Omit<
  SimpleTableSolidProps,
  | "rows"
  | "columns"
  | "loadingStateRenderer"
  | "errorStateRenderer"
  | "emptyStateRenderer"
  | "tableEmptyStateRenderer"
> & {
  columns?: ReadonlyArray<NestedSolidColumnDef>;
};

// Re-export vanilla prop types that consumers still need directly
export type {
  CellRendererProps,
  HeaderRendererProps,
  FooterRendererProps,
  LoadingStateRendererProps,
  ErrorStateRendererProps,
  EmptyStateRendererProps,
  HeaderDropdownProps,
  ColumnEditorRowRendererProps,
  ColumnEditorCustomRendererProps,
};
