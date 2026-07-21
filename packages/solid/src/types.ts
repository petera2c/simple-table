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
// Per-row action buttons. Each entry is a Solid component receiving RowButtonProps.
export type SolidRowButton = Component<RowButtonProps>;

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
 * Column definition for `columns` / `defaultHeaders`: core column metadata with
 * Solid-only renderer fields. `columns` / `defaultHeaders` also accept plain
 * `HeaderObject[]` from shared configs.
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

/** Preferred name for Solid column definitions. Alias of {@link SolidHeaderObject}. */
export type SolidColumnDef = SolidHeaderObject;

// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with Solid-specific overrides. Pass `ref` to receive
// the TableAPI once mounted (callback ref).
//
//   Overridden to Solid equivalents:
//     - columns / defaultHeaders → ReadonlyArray<HeaderObject | SolidHeaderObject>
export interface SimpleTableSolidProps
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
    | "onColumnOrderChange"
    | "onColumnWidthChange"
    | "onHeaderEdit"
    | "onColumnSelect"
  > {
  /**
   * Column definitions.
   * @deprecated Prefer {@link columns}
   */
  defaultHeaders?: ReadonlyArray<HeaderObject | SolidHeaderObject>;
  /** Column definitions. Preferred over `defaultHeaders`. */
  columns?: ReadonlyArray<HeaderObject | SolidHeaderObject>;
  /** Row data: domain objects or core `Row[]`; cast inside the adapter. */
  rows: ReadonlyArray<Row> | ReadonlyArray<object>;
  onColumnOrderChange?: (newHeaders: SolidHeaderObject[]) => void;
  onColumnWidthChange?: (headers: SolidHeaderObject[]) => void;
  onHeaderEdit?: (header: SolidHeaderObject, newLabel: string) => void;
  onColumnSelect?: (header: SolidHeaderObject) => void;
  footerRenderer?: SolidFooterRenderer;
  loadingStateRenderer?: SolidLoadingStateRenderer;
  errorStateRenderer?: SolidErrorStateRenderer;
  emptyStateRenderer?: SolidEmptyStateRenderer;
  tableEmptyStateRenderer?: JSX.Element;
  headerDropdown?: SolidHeaderDropdown;
  columnEditorConfig?: SolidColumnEditorConfig;
  icons?: SolidIconsConfig;
  /** Per-row action buttons; each entry is a Solid component rendered into the row's selection column. */
  rowButtons?: SolidRowButton[];
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
