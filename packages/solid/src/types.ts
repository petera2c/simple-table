import type { Component, JSX } from "solid-js";
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
export type SolidCellRenderer = Component<CellRendererProps>;
export type SolidHeaderRenderer = Component<HeaderRendererProps>;
export type SolidFooterRenderer = Component<FooterRendererProps>;
export type SolidHeaderDropdown = Component<HeaderDropdownProps>;
export type SolidColumnEditorRowRenderer = Component<ColumnEditorRowRendererProps>;

// State renderers can be a component (receives props) or a plain JSX.Element (static markup)
export type SolidLoadingStateRenderer = Component<LoadingStateRendererProps> | JSX.Element;
export type SolidErrorStateRenderer = Component<ErrorStateRendererProps> | JSX.Element;
export type SolidEmptyStateRenderer = Component<EmptyStateRendererProps> | JSX.Element;

// ─── Column editor config override ───────────────────────────────────────────
export interface SolidColumnEditorConfig extends Omit<ColumnEditorConfig, "rowRenderer"> {
  rowRenderer?: SolidColumnEditorRowRenderer;
}

// ─── HeaderObject override ────────────────────────────────────────────────────
export interface SolidHeaderObject
  extends Omit<HeaderObject, "cellRenderer" | "headerRenderer" | "children" | "nestedTable"> {
  cellRenderer?: SolidCellRenderer;
  headerRenderer?: SolidHeaderRenderer;
  children?: SolidHeaderObject[];
  nestedTable?: Omit<SimpleTableSolidProps, "rows">;
}

// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with Solid-specific overrides.
// `tableRef` is omitted — consumers pass a `ref` prop directly to SimpleTable,
// which Solid treats as a plain callback/setter.
export interface SimpleTableSolidProps
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
  defaultHeaders: SolidHeaderObject[];
  footerRenderer?: SolidFooterRenderer;
  loadingStateRenderer?: SolidLoadingStateRenderer;
  errorStateRenderer?: SolidErrorStateRenderer;
  emptyStateRenderer?: SolidEmptyStateRenderer;
  tableEmptyStateRenderer?: JSX.Element;
  headerDropdown?: SolidHeaderDropdown;
  columnEditorConfig?: SolidColumnEditorConfig;
  icons?: SolidIconsConfig;
  /** Callback ref — receives the TableAPI once the table is mounted. */
  ref?: (api: TableAPI) => void;
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
};
