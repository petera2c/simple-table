import type { VNode, VNodeChild } from "vue";
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
 * Default `TData` for Vue props bags / helpers: open records so untyped
 * object arrays keep assigning to `rows` without `asRows`.
 *
 * Prefer typed `rows` / `columns` (`VueColumnDef<MyRow>`) so `TData` flows
 * into renderers and callbacks. Template inference via attrs may be weaker
 * than React/Solid JSX — typed column/renderer defs still give the demo win.
 */
export type VueDefaultRowData = Record<string, any>;

// ─── Internal instance contract ───────────────────────────────────────────────
export interface TableInstance {
  mount(): void;
  update(config: Partial<SimpleTableConfig>): void;
  destroy(): void;
  getAPI(): TableAPI;
}

// ─── Icon overrides ───────────────────────────────────────────────────────────
// Accept VNode in place of SVGSVGElement | HTMLElement | string
export type VueIconElement = VNode;

export interface VueIconsConfig {
  drag?: VueIconElement;
  expand?: VueIconElement;
  filter?: VueIconElement;
  headerCollapse?: VueIconElement;
  headerExpand?: VueIconElement;
  next?: VueIconElement;
  prev?: VueIconElement;
  sortDown?: VueIconElement;
  sortUp?: VueIconElement;
  pinnedLeftIcon?: VueIconElement;
  pinnedRightIcon?: VueIconElement;
}

// ─── Renderer overrides ───────────────────────────────────────────────────────
// Function types (not `Component<…>` alone) so `h()`-style / functional
// renderers get contextual typing from TData. Vue SFC / Options components
// that match this call signature still assign.
export type VueCellRenderer<
  TData extends VueDefaultRowData = VueDefaultRowData,
  TValue = CellValue,
> = (props: CellRendererProps<TData, TValue>) => VNodeChild;
export type VueHeaderRenderer<TData extends VueDefaultRowData = VueDefaultRowData> = (
  props: HeaderRendererProps<TData>,
) => VNodeChild;
export type VueFooterRenderer = (props: FooterRendererProps) => VNodeChild;
export type VueHeaderDropdown = (props: HeaderDropdownProps) => VNodeChild;
export type VueColumnEditorRowRenderer = (
  props: ColumnEditorRowRendererProps,
) => VNodeChild;
export type VueColumnEditorCustomRenderer = (
  props: ColumnEditorCustomRendererProps,
) => VNodeChild;
export type VueRowButton<TData extends VueDefaultRowData = VueDefaultRowData> = (
  props: RowButtonProps<TData>,
) => VNodeChild;

// State renderers can be a function (receives props) or a static VNode
export type VueLoadingStateRenderer<TData extends VueDefaultRowData = VueDefaultRowData> =
  | ((props: LoadingStateRendererProps<TData>) => VNodeChild)
  | VNode;
export type VueErrorStateRenderer<TData extends VueDefaultRowData = VueDefaultRowData> =
  | ((props: ErrorStateRendererProps<TData>) => VNodeChild)
  | VNode;
export type VueEmptyStateRenderer<TData extends VueDefaultRowData = VueDefaultRowData> =
  | ((props: EmptyStateRendererProps<TData>) => VNodeChild)
  | VNode;

// ─── Column editor config override ───────────────────────────────────────────
export interface VueColumnEditorConfig
  extends Omit<ColumnEditorConfig, "rowRenderer" | "customRenderer"> {
  rowRenderer?: VueColumnEditorRowRenderer;
  customRenderer?: VueColumnEditorCustomRenderer;
}

// ─── ColumnDef override ────────────────────────────────────────────────────
/**
 * Column definition for `columns`: same column metadata as core
 * columns, but `cellRenderer` / `headerRenderer` / `children` / `nestedTable` are Vue-only.
 */
export interface VueColumnDef<
  TData extends VueDefaultRowData = VueDefaultRowData,
  TValue = CellValue,
> extends Omit<
  ColumnDef<TData, TValue>,
  "cellRenderer" | "headerRenderer" | "children" | "nestedTable"
> {
  cellRenderer?: VueCellRenderer<TData, TValue>;
  headerRenderer?: VueHeaderRenderer<TData>;
  children?: ReadonlyArray<VueColumnDef<TData, any>>;
  /** Nested grid; child columns may use a different row type than `TData`. */
  nestedTable?: NestedTableVueConfig;
}

// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with Vue-specific renderer/icon types.
// Use a template ref and `ref.value?.getAPI()` for the imperative TableAPI.
//
//   Overridden to Vue equivalents:
//     - columns → ReadonlyArray<VueColumnDef<TData>>
//     - footerRenderer         → VueFooterRenderer
//     - loadingStateRenderer   → VueLoadingStateRenderer<TData> | VNode
//     - errorStateRenderer     → VueErrorStateRenderer<TData> | VNode
//     - emptyStateRenderer     → VueEmptyStateRenderer<TData> | VNode
//     - tableEmptyStateRenderer → VNode | HTMLElement | string | null
//     - headerDropdown         → VueHeaderDropdown
//     - columnEditorConfig     → VueColumnEditorConfig
//     - icons                  → VueIconsConfig
//     - rowButtons             → VueRowButton<TData>[]
export interface SimpleTableVueProps<
  TData extends VueDefaultRowData = VueDefaultRowData,
> extends Omit<
  SimpleTableProps<TData>,
  // Overridden below with Vue types
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
  columns?: ReadonlyArray<VueColumnDef<TData, any>>;
  onColumnOrderChange?: (newHeaders: VueColumnDef<TData, any>[]) => void;
  onColumnWidthChange?: (headers: VueColumnDef<TData, any>[]) => void;
  onHeaderEdit?: (header: VueColumnDef<TData, any>, newLabel: string) => void;
  onColumnSelect?: (header: VueColumnDef<TData, any>) => void;
  /** Row data; cast to vanilla `Row[]` inside the adapter. */
  rows: readonly TData[];
  footerRenderer?: VueFooterRenderer;
  loadingStateRenderer?: VueLoadingStateRenderer<TData>;
  errorStateRenderer?: VueErrorStateRenderer<TData>;
  emptyStateRenderer?: VueEmptyStateRenderer<TData>;
  tableEmptyStateRenderer?: VNode | HTMLElement | string | null;
  headerDropdown?: VueHeaderDropdown;
  columnEditorConfig?: VueColumnEditorConfig;
  icons?: VueIconsConfig;
  /** Per-row action buttons; each entry returns a VNode rendered into the row's selection column. */
  rowButtons?: VueRowButton<TData>[];
}

// ─── Nested table config ─────────────────────────────────────────────────────
/**
 * TData-bound call signatures omitted at nest boundaries so
 * `VueColumnDef<Child>[]` assigns under a parent column without casts/`any`.
 * Child columns stay fully checked at their own declaration site.
 */
type VueColumnDefCallbacks =
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
export type NestedVueColumnDef = Omit<
  VueColumnDef<VueDefaultRowData>,
  VueColumnDefCallbacks
> & {
  children?: ReadonlyArray<NestedVueColumnDef>;
  nestedTable?: NestedTableVueConfig;
};

/**
 * Nested grid props (no `rows` / inherited state renderers).
 * Child row shape may differ from the parent column's `TData`.
 */
export type NestedTableVueConfig = Omit<
  SimpleTableVueProps,
  | "rows"
  | "columns"
  | "loadingStateRenderer"
  | "errorStateRenderer"
  | "emptyStateRenderer"
  | "tableEmptyStateRenderer"
> & {
  columns?: ReadonlyArray<NestedVueColumnDef>;
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
