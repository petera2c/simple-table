import type { Component, VNode } from "vue";
import type {
  SimpleTableProps,
  SimpleTableConfig,
  HeaderObject,
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
export interface VueHeaderObject
  extends Omit<HeaderObject, "cellRenderer" | "headerRenderer" | "children" | "nestedTable"> {
  cellRenderer?: VueCellRenderer;
  headerRenderer?: VueHeaderRenderer;
  children?: VueHeaderObject[];
  nestedTable?: Omit<SimpleTableVueProps, "rows">;
}

// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with Vue-specific overrides.
// `tableRef` is omitted — consumers use Vue's template ref mechanism instead:
//   <SimpleTable ref="tableRef" ... />
//   then: tableRef.value.sort(...)
export interface SimpleTableVueProps
  extends Omit<
    SimpleTableProps,
    | "tableRef"
    | "allowAnimations"
    | "expandIcon"
    | "filterIcon"
    | "headerCollapseIcon"
    | "headerExpandIcon"
    | "nextIcon"
    | "prevIcon"
    | "sortDownIcon"
    | "sortUpIcon"
    | "columnEditorText"
    | "defaultHeaders"
    | "footerRenderer"
    | "emptyStateRenderer"
    | "errorStateRenderer"
    | "loadingStateRenderer"
    | "tableEmptyStateRenderer"
    | "headerDropdown"
    | "columnEditorConfig"
    | "icons"
  > {
  defaultHeaders: VueHeaderObject[];
  footerRenderer?: VueFooterRenderer;
  loadingStateRenderer?: VueLoadingStateRenderer;
  errorStateRenderer?: VueErrorStateRenderer;
  emptyStateRenderer?: VueEmptyStateRenderer;
  tableEmptyStateRenderer?: VNode | HTMLElement | string | null;
  headerDropdown?: VueHeaderDropdown;
  columnEditorConfig?: VueColumnEditorConfig;
  icons?: VueIconsConfig;
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
