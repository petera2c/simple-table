import type { Type } from "@angular/core";
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

// ─── Renderer overrides ───────────────────────────────────────────────────────
// Angular components are typed as `Type<T>` (the class constructor).
export type AngularCellRenderer = Type<CellRendererProps>;
export type AngularHeaderRenderer = Type<HeaderRendererProps>;
export type AngularFooterRenderer = Type<FooterRendererProps>;
export type AngularHeaderDropdown = Type<HeaderDropdownProps>;
export type AngularColumnEditorRowRenderer = Type<ColumnEditorRowRendererProps>;
export type AngularColumnEditorCustomRenderer = Type<ColumnEditorCustomRendererProps>;
export type AngularLoadingStateRenderer = Type<LoadingStateRendererProps>;
export type AngularErrorStateRenderer = Type<ErrorStateRendererProps>;
export type AngularEmptyStateRenderer = Type<EmptyStateRendererProps>;

/** Per-slot icon: Angular component or vanilla element/string (pass-through). */
export type AngularIconSlot = Type<unknown> | SVGSVGElement | HTMLElement | string;

export interface AngularIconsConfig {
  drag?: AngularIconSlot;
  expand?: AngularIconSlot;
  filter?: AngularIconSlot;
  headerCollapse?: AngularIconSlot;
  headerExpand?: AngularIconSlot;
  next?: AngularIconSlot;
  prev?: AngularIconSlot;
  sortDown?: AngularIconSlot;
  sortUp?: AngularIconSlot;
  pinnedLeftIcon?: AngularIconSlot;
  pinnedRightIcon?: AngularIconSlot;
}

// ─── Column editor config override ───────────────────────────────────────────
export interface AngularColumnEditorConfig
  extends Omit<ColumnEditorConfig, "rowRenderer" | "customRenderer"> {
  rowRenderer?: AngularColumnEditorRowRenderer;
  customRenderer?: AngularColumnEditorCustomRenderer;
}

// ─── HeaderObject override ────────────────────────────────────────────────────
/**
 * Column definition for `defaultHeaders`: core column metadata with Angular-only
 * renderer fields. `defaultHeaders` also accepts plain `HeaderObject[]` from shared configs.
 */
export interface AngularHeaderObject
  extends Omit<HeaderObject, "cellRenderer" | "headerRenderer" | "children" | "nestedTable"> {
  cellRenderer?: AngularCellRenderer;
  headerRenderer?: AngularHeaderRenderer;
  children?: AngularHeaderObject[];
  nestedTable?: Omit<
    SimpleTableAngularProps,
    | "rows"
    | "loadingStateRenderer"
    | "errorStateRenderer"
    | "emptyStateRenderer"
    | "tableEmptyStateRenderer"
  >;
}

// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with Angular-specific overrides. Use @ViewChild on the
// table component and `getAPI()` for the imperative TableAPI.
export interface SimpleTableAngularProps
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
  defaultHeaders: ReadonlyArray<HeaderObject | AngularHeaderObject>;
  /** Row data: domain objects or core `Row[]`; cast inside the adapter. */
  rows: ReadonlyArray<Row> | ReadonlyArray<object>;
  footerRenderer?: AngularFooterRenderer;
  loadingStateRenderer?: AngularLoadingStateRenderer;
  errorStateRenderer?: AngularErrorStateRenderer;
  emptyStateRenderer?: AngularEmptyStateRenderer;
  tableEmptyStateRenderer?: HTMLElement | string | null;
  headerDropdown?: AngularHeaderDropdown;
  columnEditorConfig?: AngularColumnEditorConfig;
  icons?: AngularIconsConfig;
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
