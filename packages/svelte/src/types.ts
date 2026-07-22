import type { Component } from "svelte";
import type {
  SimpleTableProps,
  SimpleTableConfig,
  ColumnDef,
  Row,
  TableAPI,
  CellRenderer,
  CellRendererProps,
  HeaderRenderer,
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

// ─── Renderer overrides ───────────────────────────────────────────────────────
// Svelte components or core vanilla renderers (arity-1 functions pass through at runtime).
export type SvelteCellRenderer = Component<CellRendererProps> | CellRenderer;
export type SvelteHeaderRenderer = Component<HeaderRendererProps> | HeaderRenderer;
export type SvelteFooterRenderer = Component<FooterRendererProps>;
export type SvelteHeaderDropdown = Component<HeaderDropdownProps>;
export type SvelteColumnEditorRowRenderer = Component<ColumnEditorRowRendererProps>;
export type SvelteColumnEditorCustomRenderer = Component<ColumnEditorCustomRendererProps>;
// Per-row action buttons. Each entry is a Svelte component receiving RowButtonProps.
export type SvelteRowButton = Component<RowButtonProps>;

// State renderers: Svelte components (static markup via a wrapper component or HTMLElement).
export type SvelteLoadingStateRenderer = Component<LoadingStateRendererProps>;
export type SvelteErrorStateRenderer = Component<ErrorStateRendererProps>;
export type SvelteEmptyStateRenderer = Component<EmptyStateRendererProps>;

// ─── Icon overrides ───────────────────────────────────────────────────────────
export type SvelteIconElement = Component<any>;

export interface SvelteIconsConfig {
  drag?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  expand?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  filter?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  headerCollapse?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  headerExpand?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  next?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  prev?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  sortDown?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  sortUp?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  pinnedLeftIcon?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
  pinnedRightIcon?: SvelteIconElement | HTMLElement | SVGSVGElement | string;
}

// ─── Column editor config override ───────────────────────────────────────────
export interface SvelteColumnEditorConfig extends Omit<
  ColumnEditorConfig,
  "rowRenderer" | "customRenderer"
> {
  rowRenderer?: SvelteColumnEditorRowRenderer;
  customRenderer?: SvelteColumnEditorCustomRenderer;
}

// ─── ColumnDef override ────────────────────────────────────────────────────
/**
 * Column definition for `columns`: core column metadata with
 * Svelte-only renderer fields. `columns` also accept plain
 * `ColumnDef[]` from shared configs.
 */
export interface SvelteColumnDef extends Omit<
  ColumnDef,
  "cellRenderer" | "headerRenderer" | "children" | "nestedTable"
> {
  cellRenderer?: SvelteCellRenderer;
  headerRenderer?: SvelteHeaderRenderer;
  children?: SvelteColumnDef[];
  nestedTable?: Omit<
    SimpleTableSvelteProps,
    | "rows"
    | "loadingStateRenderer"
    | "errorStateRenderer"
    | "emptyStateRenderer"
    | "tableEmptyStateRenderer"
  >;
}


// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with Svelte-specific overrides. Use `bind:this` on the
// table component and `getAPI()` for the imperative TableAPI.
//
//   Overridden to Svelte equivalents:
//     - columns → ReadonlyArray<ColumnDef | SvelteColumnDef>
export interface SimpleTableSvelteProps extends Omit<
  SimpleTableProps,
  | "rows"
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
  /** Column definitions. */
  columns?: ReadonlyArray<ColumnDef | SvelteColumnDef>;
  /** Row data: domain objects or core `Row[]`; cast inside the adapter. */
  rows: ReadonlyArray<Row> | ReadonlyArray<object>;
  onColumnOrderChange?: (newHeaders: SvelteColumnDef[]) => void;
  onColumnWidthChange?: (headers: SvelteColumnDef[]) => void;
  onHeaderEdit?: (header: SvelteColumnDef, newLabel: string) => void;
  onColumnSelect?: (header: SvelteColumnDef) => void;
  footerRenderer?: SvelteFooterRenderer;
  loadingStateRenderer?: SvelteLoadingStateRenderer;
  errorStateRenderer?: SvelteErrorStateRenderer;
  emptyStateRenderer?: SvelteEmptyStateRenderer;
  /** Svelte component (no props) or plain markup — adapter mounts components for the vanilla table slot. */
  tableEmptyStateRenderer?: Component | HTMLElement | string | null;
  headerDropdown?: SvelteHeaderDropdown;
  columnEditorConfig?: SvelteColumnEditorConfig;
  icons?: SvelteIconsConfig;
  /** Per-row action buttons; each entry is a Svelte component rendered into the row's selection column. */
  rowButtons?: SvelteRowButton[];
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
