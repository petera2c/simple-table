import type React from "react";
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
// Used to type the internal ref inside SimpleTable without coupling to the
// concrete SimpleTableVanilla class.
export interface TableInstance {
  mount(): void;
  update(config: Partial<SimpleTableConfig>): void;
  destroy(): void;
  getAPI(): TableAPI;
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
export type ReactCellRenderer = React.ComponentType<CellRendererProps>;
export type ReactHeaderRenderer = React.ComponentType<HeaderRendererProps>;
export type ReactFooterRenderer = React.ComponentType<FooterRendererProps>;
export type ReactHeaderDropdown = React.ComponentType<HeaderDropdownProps>;
export type ReactColumnEditorRowRenderer = React.ComponentType<ColumnEditorRowRendererProps>;

// State renderers can be a component (receives props) or a plain ReactNode (static markup)
export type ReactLoadingStateRenderer =
  | React.ComponentType<LoadingStateRendererProps>
  | React.ReactNode;
export type ReactErrorStateRenderer =
  | React.ComponentType<ErrorStateRendererProps>
  | React.ReactNode;
export type ReactEmptyStateRenderer =
  | React.ComponentType<EmptyStateRendererProps>
  | React.ReactNode;

// ─── Column editor config override ───────────────────────────────────────────
export interface ReactColumnEditorConfig extends Omit<ColumnEditorConfig, "rowRenderer"> {
  rowRenderer?: ReactColumnEditorRowRenderer;
}

// ─── HeaderObject override ────────────────────────────────────────────────────
export interface ReactHeaderObject
  extends Omit<HeaderObject, "cellRenderer" | "headerRenderer" | "children" | "nestedTable"> {
  cellRenderer?: ReactCellRenderer;
  headerRenderer?: ReactHeaderRenderer;
  children?: ReactHeaderObject[];
  nestedTable?: Omit<SimpleTableReactProps, "rows">;
}

// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps exactly, with the following intentional differences:
//
//   Removed:
//     - tableRef          → consumers use React.forwardRef / useRef<TableAPI> instead
//     - allowAnimations   → feature is no longer available
//     - expandIcon        → @deprecated in vanilla; use `icons.expand`
//     - filterIcon        → @deprecated in vanilla; use `icons.filter`
//     - headerCollapseIcon → @deprecated in vanilla; use `icons.headerCollapse`
//     - headerExpandIcon  → @deprecated in vanilla; use `icons.headerExpand`
//     - nextIcon          → @deprecated in vanilla; use `icons.next`
//     - prevIcon          → @deprecated in vanilla; use `icons.prev`
//     - sortDownIcon      → @deprecated in vanilla; use `icons.sortDown`
//     - sortUpIcon        → @deprecated in vanilla; use `icons.sortUp`
//     - columnEditorText  → @deprecated in vanilla; use `columnEditorConfig.text`
//
//   Overridden to React equivalents:
//     - defaultHeaders         → ReactHeaderObject[]
//     - footerRenderer         → React.ComponentType<FooterRendererProps>
//     - loadingStateRenderer   → React.ComponentType<…> | React.ReactNode
//     - errorStateRenderer     → React.ComponentType<…> | React.ReactNode
//     - emptyStateRenderer     → React.ComponentType<…> | React.ReactNode
//     - tableEmptyStateRenderer → React.ReactNode
//     - headerDropdown         → React.ComponentType<HeaderDropdownProps>
//     - columnEditorConfig     → ReactColumnEditorConfig
//     - icons                  → ReactIconsConfig
export interface SimpleTableReactProps
  extends Omit<
    SimpleTableProps,
    // Replaced by forwardRef
    | "tableRef"
    // No longer available
    | "allowAnimations"
    // Deprecated vanilla-only props — use icons.* and columnEditorConfig.text instead
    | "expandIcon"
    | "filterIcon"
    | "headerCollapseIcon"
    | "headerExpandIcon"
    | "nextIcon"
    | "prevIcon"
    | "sortDownIcon"
    | "sortUpIcon"
    | "columnEditorText"
    // Overridden below with React types
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
  defaultHeaders: ReactHeaderObject[];
  footerRenderer?: ReactFooterRenderer;
  loadingStateRenderer?: ReactLoadingStateRenderer;
  errorStateRenderer?: ReactErrorStateRenderer;
  emptyStateRenderer?: ReactEmptyStateRenderer;
  tableEmptyStateRenderer?: React.ReactNode;
  headerDropdown?: ReactHeaderDropdown;
  columnEditorConfig?: ReactColumnEditorConfig;
  icons?: ReactIconsConfig;
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
