import type React from "react";
import type {
  SimpleTableProps,
  SimpleTableConfig,
  ColumnDef,
  TableAPI,
  CellValue,
  CellRendererProps,
  HeaderRendererProps as VanillaHeaderRendererProps,
  FooterRendererProps as VanillaFooterRendererProps,
  LoadingStateRendererProps,
  ErrorStateRendererProps,
  EmptyStateRendererProps,
  HeaderDropdownProps as VanillaHeaderDropdownProps,
  ColumnEditorRowRendererProps as VanillaColumnEditorRowRendererProps,
  ColumnEditorCustomRendererProps as VanillaColumnEditorCustomRendererProps,
  ColumnEditorConfig,
  RowButtonProps,
} from "simple-table-core";

/**
 * Default `TData` for React props bags / helpers: open records so untyped
 * object arrays keep assigning to `rows` without `asRows`.
 *
 * Prefer letting `<SimpleTable rows={…} columns={…} />` infer `TData` from
 * those props — an explicit `SimpleTable<MyRow>` is only needed when inference
 * can't see a typed `rows`/`columns` (or for `useRef<TableAPI<MyRow>>`).
 */
export type ReactDefaultRowData = Record<string, any>;

// ─── Renderer prop overrides (React slots are nodes, not DOM IconElement) ─────
/** Passed to React `headerRenderer` / `headerDropdown`; slots are React nodes. */
export interface HeaderRendererComponents {
  sortIcon?: React.ReactNode;
  filterIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  labelContent?: React.ReactNode;
}

export type HeaderRendererProps<TData extends ReactDefaultRowData = ReactDefaultRowData> = Omit<
  VanillaHeaderRendererProps<TData>,
  "components"
> & {
  components?: HeaderRendererComponents;
};

/** Column editor row slots as React nodes (core uses `IconElement` / `HTMLElement`). */
export interface ColumnEditorRowRendererComponents {
  expandIcon?: React.ReactNode;
  checkbox?: React.ReactNode;
  dragIcon?: React.ReactNode;
  labelContent?: React.ReactNode;
  pinIcon?: React.ReactNode;
}

export type ColumnEditorRowRendererProps = Omit<
  VanillaColumnEditorRowRendererProps,
  "components"
> & {
  components: ColumnEditorRowRendererComponents;
};

/** Column editor custom-renderer slots as React nodes (core uses `HTMLElement`). */
export type ColumnEditorCustomRendererProps = Omit<
  VanillaColumnEditorCustomRendererProps,
  "searchSection" | "listSection" | "resetSection"
> & {
  searchSection?: React.ReactNode;
  listSection?: React.ReactNode;
  resetSection?: React.ReactNode;
};

export type FooterRendererProps = Omit<
  VanillaFooterRendererProps,
  "nextIcon" | "prevIcon"
> & {
  nextIcon?: React.ReactNode;
  prevIcon?: React.ReactNode;
};

export type HeaderDropdownProps = Omit<VanillaHeaderDropdownProps, "components"> & {
  components?: HeaderRendererComponents;
};

// ─── Internal instance contract ───────────────────────────────────────────────
// Used to type the internal ref inside SimpleTable without coupling to the
// concrete SimpleTableVanilla class.
export interface TableInstance {
  mount(): void;
  update(config: Partial<SimpleTableConfig>): void;
  destroy(): void;
  getAPI(): TableAPI;
  /** Re-measure auto-size columns (used after async React renderers mount). */
  refitAutoSizeColumns?(): void;
}

// ─── Icon overrides ──────────────────────────────────────────────────────────
// Accept ReactNode in place of SVGSVGElement | HTMLElement | string
export type ReactIconElement = React.ReactNode;

export interface ReactIconsConfig {
  drag?: ReactIconElement;
  expand?: ReactIconElement;
  filter?: ReactIconElement;
  headerCollapse?: ReactIconElement;
  headerExpand?: ReactIconElement;
  next?: ReactIconElement;
  prev?: ReactIconElement;
  sortDown?: ReactIconElement;
  sortUp?: ReactIconElement;
  pinnedLeftIcon?: ReactIconElement;
  pinnedRightIcon?: ReactIconElement;
}

// ─── Renderer overrides ───────────────────────────────────────────────────────
// Function types (not `ComponentType | fn` unions) so inline renderers get
// contextual typing — e.g. `headerRenderer: (props) => …` infers props from TData.
// Function components and render props both assign to these call signatures.
export type ReactCellRenderer<
  TData extends ReactDefaultRowData = ReactDefaultRowData,
  TValue = CellValue,
> = (props: CellRendererProps<TData, TValue>) => React.ReactNode;
export type ReactHeaderRenderer<TData extends ReactDefaultRowData = ReactDefaultRowData> = (
  props: HeaderRendererProps<TData>,
) => React.ReactNode;
export type ReactFooterRenderer = (props: FooterRendererProps) => React.ReactNode;
export type ReactHeaderDropdown = (props: HeaderDropdownProps) => React.ReactNode;
export type ReactColumnEditorRowRenderer = (
  props: ColumnEditorRowRendererProps,
) => React.ReactNode;
export type ReactColumnEditorCustomRenderer = (
  props: ColumnEditorCustomRendererProps,
) => React.ReactNode;

// Row buttons render per-row action controls. React consumers return JSX
// (a ReactNode) rather than the DOM `HTMLElement` the vanilla core expects.
export type ReactRowButton<TData extends ReactDefaultRowData = ReactDefaultRowData> = (
  props: RowButtonProps<TData>,
) => React.ReactNode;

// State renderers can be a component (receives props) or a plain ReactNode (static markup)
export type ReactLoadingStateRenderer<TData extends ReactDefaultRowData = ReactDefaultRowData> =
  | React.ComponentType<LoadingStateRendererProps<TData>>
  | React.ReactNode;
export type ReactErrorStateRenderer<TData extends ReactDefaultRowData = ReactDefaultRowData> =
  | React.ComponentType<ErrorStateRendererProps<TData>>
  | React.ReactNode;
export type ReactEmptyStateRenderer<TData extends ReactDefaultRowData = ReactDefaultRowData> =
  | React.ComponentType<EmptyStateRendererProps<TData>>
  | React.ReactNode;

// ─── Column editor config override ───────────────────────────────────────────
export interface ReactColumnEditorConfig extends Omit<
  ColumnEditorConfig,
  "rowRenderer" | "customRenderer"
> {
  rowRenderer?: ReactColumnEditorRowRenderer;
  customRenderer?: ReactColumnEditorCustomRenderer;
}

// ─── Nested table config ─────────────────────────────────────────────────────
/**
 * Nested grid props (no `rows` / inherited state renderers).
 *
 * Child row shape may differ from the parent column's `TData` (e.g. company →
 * division). `columns` is intentionally open so `ReactColumnDef<Child>[]`
 * assigns without casts; each column array is still checked at its own
 * declaration site.
 */
export type NestedTableReactConfig = Omit<
  SimpleTableReactProps,
  | "rows"
  | "columns"
  | "loadingStateRenderer"
  | "errorStateRenderer"
  | "emptyStateRenderer"
  | "tableEmptyStateRenderer"
> & {
  columns?: ReadonlyArray<ReactColumnDef<any, any>>;
};

// ─── ColumnDef override ────────────────────────────────────────────────────
/**
 * Column definition for `columns`: same column metadata as core
 * columns, but `cellRenderer` / `headerRenderer` / `children` / `nestedTable` are React-only.
 */
export interface ReactColumnDef<
  TData extends ReactDefaultRowData = ReactDefaultRowData,
  TValue = CellValue,
> extends Omit<
  ColumnDef<TData, TValue>,
  "cellRenderer" | "headerRenderer" | "children" | "nestedTable"
> {
  cellRenderer?: ReactCellRenderer<TData, TValue>;
  headerRenderer?: ReactHeaderRenderer<TData>;
  children?: ReadonlyArray<ReactColumnDef<TData, any>>;
  /** Nested grid; child columns may use a different row type than `TData`. */
  nestedTable?: NestedTableReactConfig;
}


// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with React-specific renderer/icon types.
// `SimpleTable` infers `TData` from `rows`/`columns`; use `useRef<TableAPI<TData>>`
// when you need a typed imperative handle.
//
//   Overridden to React equivalents:
//     - columns → ReadonlyArray<ReactColumnDef<TData>>
//     - footerRenderer         → React.ComponentType<FooterRendererProps>
//     - loadingStateRenderer   → React.ComponentType<…> | React.ReactNode
//     - errorStateRenderer     → React.ComponentType<…> | React.ReactNode
//     - emptyStateRenderer     → React.ComponentType<…> | React.ReactNode
//     - tableEmptyStateRenderer → React.ReactNode
//     - headerDropdown         → React.ComponentType<HeaderDropdownProps>
//     - columnEditorConfig     → ReactColumnEditorConfig
//     - icons                  → ReactIconsConfig
//     - rowButtons             → ReactRowButton<TData>[]
export interface SimpleTableReactProps<
  TData extends ReactDefaultRowData = ReactDefaultRowData,
> extends Omit<
  SimpleTableProps<TData>,
  // Overridden below with React types
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
  columns?: ReadonlyArray<ReactColumnDef<TData, any>>;
  onColumnOrderChange?: (newHeaders: ReactColumnDef<TData, any>[]) => void;
  onColumnWidthChange?: (headers: ReactColumnDef<TData, any>[]) => void;
  onHeaderEdit?: (header: ReactColumnDef<TData, any>, newLabel: string) => void;
  onColumnSelect?: (header: ReactColumnDef<TData, any>) => void;
  /** Row data; cast to vanilla `Row[]` inside the adapter. */
  rows: readonly TData[];
  footerRenderer?: ReactFooterRenderer;
  loadingStateRenderer?: ReactLoadingStateRenderer<TData>;
  errorStateRenderer?: ReactErrorStateRenderer<TData>;
  emptyStateRenderer?: ReactEmptyStateRenderer<TData>;
  tableEmptyStateRenderer?: React.ReactNode;
  headerDropdown?: ReactHeaderDropdown;
  columnEditorConfig?: ReactColumnEditorConfig;
  icons?: ReactIconsConfig;
  /** Per-row action buttons; each entry returns JSX rendered into the row's selection column. */
  rowButtons?: ReactRowButton<TData>[];
}

// Re-export vanilla prop types that consumers still need directly
export type {
  CellRendererProps,
  LoadingStateRendererProps,
  ErrorStateRendererProps,
  EmptyStateRendererProps,
};
