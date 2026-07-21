import type { Component, VNode } from "vue";
import type {
  SimpleTableProps,
  SimpleTableConfig,
  HeaderObject,
  Row,
  TableAPI,
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
// Vue components are typed as `Component` — covers both Options API objects
// and <script setup> / defineComponent / functional components.
export type VueCellRenderer = Component<CellRendererProps>;
export type VueHeaderRenderer = Component<HeaderRendererProps>;
export type VueFooterRenderer = Component<FooterRendererProps>;
export type VueHeaderDropdown = Component<HeaderDropdownProps>;
export type VueColumnEditorRowRenderer = Component<ColumnEditorRowRendererProps>;
export type VueColumnEditorCustomRenderer = Component<ColumnEditorCustomRendererProps>;
// Per-row action buttons. Each entry is a Vue component receiving RowButtonProps.
export type VueRowButton = Component<RowButtonProps>;

// State renderers can be a component (receives props) or a static VNode
export type VueLoadingStateRenderer = Component<LoadingStateRendererProps> | VNode;
export type VueErrorStateRenderer = Component<ErrorStateRendererProps> | VNode;
export type VueEmptyStateRenderer = Component<EmptyStateRendererProps> | VNode;

// ─── Column editor config override ───────────────────────────────────────────
export interface VueColumnEditorConfig
  extends Omit<ColumnEditorConfig, "rowRenderer" | "customRenderer"> {
  rowRenderer?: VueColumnEditorRowRenderer;
  customRenderer?: VueColumnEditorCustomRenderer;
}

// ─── HeaderObject override ────────────────────────────────────────────────────
/**
 * Column definition for `columns` / `defaultHeaders`: core column metadata with
 * Vue-only `cellRenderer` / `headerRenderer` / `children` / `nestedTable`.
 * `columns` / `defaultHeaders` also accept plain `HeaderObject[]` from shared configs.
 */
export interface VueHeaderObject
  extends Omit<HeaderObject, "cellRenderer" | "headerRenderer" | "children" | "nestedTable"> {
  cellRenderer?: VueCellRenderer;
  headerRenderer?: VueHeaderRenderer;
  children?: VueHeaderObject[];
  nestedTable?: Omit<
    SimpleTableVueProps,
    | "rows"
    | "loadingStateRenderer"
    | "errorStateRenderer"
    | "emptyStateRenderer"
    | "tableEmptyStateRenderer"
  >;
}

/** Preferred name for Vue column definitions. Alias of {@link VueHeaderObject}. */
export type VueColumnDef = VueHeaderObject;

// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with Vue-specific overrides. Use a template ref and
// `ref.value?.getAPI()` for the imperative TableAPI.
//
//   Overridden to Vue equivalents:
//     - columns / defaultHeaders → ReadonlyArray<HeaderObject | VueHeaderObject>
export interface SimpleTableVueProps
  extends Omit<
    SimpleTableProps,
    | "rows"
    | "defaultHeaders"
    | "columns"
    | "footerRenderer"
    | "emptyStateRenderer"
    | "errorStateRenderer"
    | "loadingStateRenderer"
    | "tableEmptyStateRenderer"
    | "headerDropdown"
    | "columnEditorConfig"
    | "icons"
    | "rowButtons"
  > {
  /**
   * Column definitions.
   * @deprecated Prefer {@link columns}
   */
  defaultHeaders?: ReadonlyArray<HeaderObject | VueHeaderObject>;
  /** Column definitions. Preferred over `defaultHeaders`. */
  columns?: ReadonlyArray<HeaderObject | VueHeaderObject>;
  /** Row data: domain objects or core `Row[]`; cast inside the adapter. */
  rows: ReadonlyArray<Row> | ReadonlyArray<object>;
  footerRenderer?: VueFooterRenderer;
  loadingStateRenderer?: VueLoadingStateRenderer;
  errorStateRenderer?: VueErrorStateRenderer;
  emptyStateRenderer?: VueEmptyStateRenderer;
  tableEmptyStateRenderer?: VNode | HTMLElement | string | null;
  headerDropdown?: VueHeaderDropdown;
  columnEditorConfig?: VueColumnEditorConfig;
  icons?: VueIconsConfig;
  /** Per-row action buttons; each entry is a Vue component rendered into the row's selection column. */
  rowButtons?: VueRowButton[];
}

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
