import type { Component, JSX } from "solid-js";
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
export type SolidColumnEditorCustomRenderer = Component<ColumnEditorCustomRendererProps>;

// State renderers can be a component (receives props) or a plain JSX.Element (static markup)
export type SolidLoadingStateRenderer = Component<LoadingStateRendererProps> | JSX.Element;
export type SolidErrorStateRenderer = Component<ErrorStateRendererProps> | JSX.Element;
export type SolidEmptyStateRenderer = Component<EmptyStateRendererProps> | JSX.Element;

// ─── Column editor config override ───────────────────────────────────────────
export interface SolidColumnEditorConfig
  extends Omit<ColumnEditorConfig, "rowRenderer" | "customRenderer"> {
  rowRenderer?: SolidColumnEditorRowRenderer;
  customRenderer?: SolidColumnEditorCustomRenderer;
}

// ─── HeaderObject override ────────────────────────────────────────────────────
/**
 * Column definition for `defaultHeaders`: core column metadata with Solid-only
 * renderer fields. `defaultHeaders` also accepts plain `HeaderObject[]` from shared configs.
 */
export interface SolidHeaderObject
  extends Omit<HeaderObject, "cellRenderer" | "headerRenderer" | "children" | "nestedTable"> {
  cellRenderer?: SolidCellRenderer;
  headerRenderer?: SolidHeaderRenderer;
  children?: SolidHeaderObject[];
  nestedTable?: Omit<
    SimpleTableSolidProps,
    | "rows"
    | "loadingStateRenderer"
    | "errorStateRenderer"
    | "emptyStateRenderer"
    | "tableEmptyStateRenderer"
  >;
}

// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with Solid-specific overrides. Pass `ref` to receive
// the TableAPI once mounted (callback ref).
export interface SimpleTableSolidProps
  extends Omit<
    SimpleTableProps,
    | "rows"
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
  defaultHeaders: ReadonlyArray<HeaderObject | SolidHeaderObject>;
  /** Row data: domain objects or core `Row[]`; cast inside the adapter. */
  rows: ReadonlyArray<Row> | ReadonlyArray<object>;
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
  ColumnEditorCustomRendererProps,
};
