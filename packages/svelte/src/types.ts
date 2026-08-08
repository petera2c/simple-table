import type { Component } from "svelte";
import type {
  SimpleTableProps,
  SimpleTableConfig,
  ColumnDef,
  TableAPI,
  CellValue,
  CellRenderer,
  CellRendererProps,
  HeaderRenderer,
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
 * Default `TData` for Svelte props bags / helpers: open records so untyped
 * object arrays keep assigning to `rows` without `asRows`.
 *
 * Prefer typed `rows` / `columns` (`SvelteColumnDef<MyRow>`) so `TData` flows
 * into renderers and callbacks. Markup inference via `<SimpleTable>` may be
 * weaker than React/Solid JSX — typed column/renderer defs still give the demo win.
 */
export type SvelteDefaultRowData = Record<string, any>;

// ─── Internal instance contract ───────────────────────────────────────────────
export interface TableInstance {
  mount(): void;
  update(config: Partial<SimpleTableConfig>): void;
  destroy(): void;
  getAPI(): TableAPI;
  /** Re-measure `width: "auto"` columns after custom renderer DOM is present. */
  refitAutoSizeColumns?(): void;
}

// ─── Renderer overrides ───────────────────────────────────────────────────────
// Arity-1 functions are core CellRenderer/HeaderRenderer (pass through at runtime).
// Svelte components (arity ≥ 2) are wrapped. Keep the function arm first and use
// the core aliases so typed arrow functions assign without casts.
export type SvelteCellRenderer<
  TData extends SvelteDefaultRowData = SvelteDefaultRowData,
  TValue = CellValue,
> = CellRenderer<TData, TValue> | Component<CellRendererProps<TData, TValue>>;
export type SvelteHeaderRenderer<TData extends SvelteDefaultRowData = SvelteDefaultRowData> =
  | HeaderRenderer<TData>
  | Component<HeaderRendererProps<TData>>;
export type SvelteFooterRenderer = Component<FooterRendererProps>;
export type SvelteHeaderDropdown = Component<HeaderDropdownProps>;
export type SvelteColumnEditorRowRenderer = Component<ColumnEditorRowRendererProps>;
export type SvelteColumnEditorCustomRenderer = Component<ColumnEditorCustomRendererProps>;
// Per-row action buttons. Each entry is a Svelte component receiving RowButtonProps.
export type SvelteRowButton<TData extends SvelteDefaultRowData = SvelteDefaultRowData> =
  Component<RowButtonProps<TData>>;

// State renderers: Svelte components (static markup via a wrapper component or HTMLElement).
export type SvelteLoadingStateRenderer<TData extends SvelteDefaultRowData = SvelteDefaultRowData> =
  Component<LoadingStateRendererProps<TData>>;
export type SvelteErrorStateRenderer<TData extends SvelteDefaultRowData = SvelteDefaultRowData> =
  Component<ErrorStateRendererProps<TData>>;
export type SvelteEmptyStateRenderer<TData extends SvelteDefaultRowData = SvelteDefaultRowData> =
  Component<EmptyStateRendererProps<TData>>;

// ─── Icon overrides ───────────────────────────────────────────────────────────
export type SvelteIconElement = Component<Record<string, never>>;

export interface SvelteIconsConfig {
  drag?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  expand?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  filter?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  headerCollapse?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  headerExpand?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  next?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  prev?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  sortDown?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  sortUp?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  pinnedLeftIcon?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  pinnedRightIcon?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
}

// ─── Column editor config override ───────────────────────────────────────────
export interface SvelteColumnEditorConfig extends Omit<
  ColumnEditorConfig,
  "rowRenderer" | "customRenderer"
> {
  rowRenderer?: SvelteColumnEditorRowRenderer;
  customRenderer?: SvelteColumnEditorCustomRenderer;
}

// ─── ColumnDef override ────────────────────────────────────────────────────
/**
 * Column definition for `columns`: same column metadata as core
 * columns, but `cellRenderer` / `headerRenderer` / `children` / `nestedTable` are Svelte-only.
 */
export interface SvelteColumnDef<
  TData extends SvelteDefaultRowData = SvelteDefaultRowData,
  TValue = CellValue,
> extends Omit<
  ColumnDef<TData, TValue>,
  "cellRenderer" | "headerRenderer" | "children" | "nestedTable"
> {
  cellRenderer?: SvelteCellRenderer<TData, TValue>;
  headerRenderer?: SvelteHeaderRenderer<TData>;
  children?: ReadonlyArray<SvelteColumnDef<TData, any>>;
  /** Nested grid; child columns may use a different row type than `TData`. */
  nestedTable?: NestedTableSvelteConfig;
}

// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with Svelte-specific overrides. Use `bind:this` on the
// table component and `getAPI()` for the imperative TableAPI.
//
//   Overridden to Svelte equivalents:
//     - columns → ReadonlyArray<SvelteColumnDef<TData>>
//     - footerRenderer         → SvelteFooterRenderer
//     - loadingStateRenderer   → SvelteLoadingStateRenderer<TData>
//     - errorStateRenderer     → SvelteErrorStateRenderer<TData>
//     - emptyStateRenderer     → SvelteEmptyStateRenderer<TData>
//     - tableEmptyStateRenderer → Component | HTMLElement | string | null
//     - headerDropdown         → SvelteHeaderDropdown
//     - columnEditorConfig     → SvelteColumnEditorConfig
//     - icons                  → SvelteIconsConfig
//     - rowButtons             → SvelteRowButton<TData>[]
export interface SimpleTableSvelteProps<
  TData extends SvelteDefaultRowData = SvelteDefaultRowData,
> extends Omit<
  SimpleTableProps<TData>,
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
  columns?: ReadonlyArray<SvelteColumnDef<TData, any>>;
  onColumnOrderChange?: (newHeaders: SvelteColumnDef<TData, any>[]) => void;
  onColumnWidthChange?: (headers: SvelteColumnDef<TData, any>[]) => void;
  onHeaderEdit?: (header: SvelteColumnDef<TData, any>, newLabel: string) => void;
  onColumnSelect?: (header: SvelteColumnDef<TData, any>) => void;
  /** Row data; cast to vanilla `Row[]` inside the adapter. */
  rows: readonly TData[];
  footerRenderer?: SvelteFooterRenderer;
  loadingStateRenderer?: SvelteLoadingStateRenderer<TData>;
  errorStateRenderer?: SvelteErrorStateRenderer<TData>;
  emptyStateRenderer?: SvelteEmptyStateRenderer<TData>;
  /** Svelte component (no props) or plain markup — adapter mounts components for the vanilla table slot. */
  tableEmptyStateRenderer?: Component | HTMLElement | string | null;
  headerDropdown?: SvelteHeaderDropdown;
  columnEditorConfig?: SvelteColumnEditorConfig;
  icons?: SvelteIconsConfig;
  /** Per-row action buttons; each entry is a Svelte component rendered into the row's selection column. */
  rowButtons?: SvelteRowButton<TData>[];
}

// ─── Nested table config ─────────────────────────────────────────────────────
/**
 * TData-bound call signatures omitted at nest boundaries so
 * `SvelteColumnDef<Child>[]` assigns under a parent column without casts/`any`.
 * Child columns stay fully checked at their own declaration site.
 */
type SvelteColumnDefCallbacks =
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
export type NestedSvelteColumnDef = Omit<
  SvelteColumnDef<SvelteDefaultRowData>,
  SvelteColumnDefCallbacks
> & {
  children?: ReadonlyArray<NestedSvelteColumnDef>;
  nestedTable?: NestedTableSvelteConfig;
};

/**
 * Nested grid props (no `rows` / inherited state renderers).
 * Child row shape may differ from the parent column's `TData`.
 */
export type NestedTableSvelteConfig = Omit<
  SimpleTableSvelteProps,
  | "rows"
  | "columns"
  | "loadingStateRenderer"
  | "errorStateRenderer"
  | "emptyStateRenderer"
  | "tableEmptyStateRenderer"
> & {
  columns?: ReadonlyArray<NestedSvelteColumnDef>;
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
