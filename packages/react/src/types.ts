import type React from "react";
import type {
  SimpleTableProps,
  SimpleTableConfig,
  HeaderObject,
  TableAPI,
  Row,
  CellRendererProps,
  HeaderRendererProps as VanillaHeaderRendererProps,
  FooterRendererProps as VanillaFooterRendererProps,
  LoadingStateRendererProps,
  ErrorStateRendererProps,
  EmptyStateRendererProps,
  HeaderDropdownProps as VanillaHeaderDropdownProps,
  ColumnEditorRowRendererProps as VanillaColumnEditorRowRendererProps,
  ColumnEditorCustomRendererProps,
  ColumnEditorConfig,
} from "simple-table-core";

// ─── Renderer prop overrides (React slots are nodes, not DOM IconElement) ─────
/** Passed to React `headerRenderer` / `headerDropdown`; slots are React nodes. */
export interface HeaderRendererComponents {
  sortIcon?: React.ReactNode;
  filterIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  labelContent?: React.ReactNode;
}

export type HeaderRendererProps = Omit<VanillaHeaderRendererProps, "components"> & {
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
// Allow class/function components or inline render props that return ReactNode (string, number, etc.).
export type ReactCellRenderer =
  | React.ComponentType<CellRendererProps>
  | ((props: CellRendererProps) => React.ReactNode);
export type ReactHeaderRenderer =
  | React.ComponentType<HeaderRendererProps>
  | ((props: HeaderRendererProps) => React.ReactNode);
export type ReactFooterRenderer =
  | React.ComponentType<FooterRendererProps>
  | ((props: FooterRendererProps) => React.ReactNode);
export type ReactHeaderDropdown =
  | React.ComponentType<HeaderDropdownProps>
  | ((props: HeaderDropdownProps) => React.ReactNode);
export type ReactColumnEditorRowRenderer =
  | React.ComponentType<ColumnEditorRowRendererProps>
  | ((props: ColumnEditorRowRendererProps) => React.ReactNode);
export type ReactColumnEditorCustomRenderer =
  | React.ComponentType<ColumnEditorCustomRendererProps>
  | ((props: ColumnEditorCustomRendererProps) => React.ReactNode);

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
export interface ReactColumnEditorConfig extends Omit<
  ColumnEditorConfig,
  "rowRenderer" | "customRenderer"
> {
  rowRenderer?: ReactColumnEditorRowRenderer;
  customRenderer?: ReactColumnEditorCustomRenderer;
}

// ─── HeaderObject override ────────────────────────────────────────────────────
/**
 * Column definition for `defaultHeaders`: same column metadata as core `HeaderObject`, but
 * `cellRenderer` / `headerRenderer` / `children` / `nestedTable` are React-only. For column
 * defs authored against core types, import `defaultHeadersFromCore`, `defaultHeaderFromCore`, or
 * `mapToReactHeaderObjects` (after spreading core columns and adding React renderers).
 */
export interface ReactHeaderObject extends Omit<
  HeaderObject,
  "cellRenderer" | "headerRenderer" | "children" | "nestedTable"
> {
  cellRenderer?: ReactCellRenderer;
  headerRenderer?: ReactHeaderRenderer;
  children?: ReadonlyArray<ReactHeaderObject>;
  /** Nested grid: React table props minus row data and inherited state renderers. */
  nestedTable?: Omit<
    SimpleTableReactProps,
    | "rows"
    | "loadingStateRenderer"
    | "errorStateRenderer"
    | "emptyStateRenderer"
    | "tableEmptyStateRenderer"
  >;
}

// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with React-specific renderer/icon types. Use `ref` +
// `forwardRef<TableAPI, …>` for the imperative API.
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
export interface SimpleTableReactProps extends Omit<
  SimpleTableProps,
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
  | "rows"
> {
  defaultHeaders: ReactHeaderObject[];
  /** Row data: any object rows (domain models) or core `Row[]`; cast to vanilla `Row[]` inside the adapter. */
  rows: ReadonlyArray<Row> | ReadonlyArray<object>;
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
  LoadingStateRendererProps,
  ErrorStateRendererProps,
  EmptyStateRendererProps,
  ColumnEditorCustomRendererProps,
};
