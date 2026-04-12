import type { Component } from "svelte";
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
// Svelte components are typed as Component<Props> from 'svelte'.
export type SvelteCellRenderer = Component<CellRendererProps>;
export type SvelteHeaderRenderer = Component<HeaderRendererProps>;
export type SvelteFooterRenderer = Component<FooterRendererProps>;
export type SvelteHeaderDropdown = Component<HeaderDropdownProps>;
export type SvelteColumnEditorRowRenderer = Component<ColumnEditorRowRendererProps>;
export type SvelteColumnEditorCustomRenderer = Component<ColumnEditorCustomRendererProps>;

// State renderers are always components (Svelte has no static "node" concept
// outside of a component — consumers wanting static markup should use a wrapper
// component or supply an HTMLElement via the vanilla API directly).
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
export interface SvelteColumnEditorConfig
  extends Omit<ColumnEditorConfig, "rowRenderer" | "customRenderer"> {
  rowRenderer?: SvelteColumnEditorRowRenderer;
  customRenderer?: SvelteColumnEditorCustomRenderer;
}

// ─── HeaderObject override ────────────────────────────────────────────────────
/**
 * Column definition for `defaultHeaders`: core column metadata with Svelte-only
 * renderer fields. `defaultHeaders` also accepts plain `HeaderObject[]` from shared configs.
 */
export interface SvelteHeaderObject
  extends Omit<HeaderObject, "cellRenderer" | "headerRenderer" | "children" | "nestedTable"> {
  cellRenderer?: SvelteCellRenderer;
  headerRenderer?: SvelteHeaderRenderer;
  children?: SvelteHeaderObject[];
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
export interface SimpleTableSvelteProps
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
  defaultHeaders: ReadonlyArray<HeaderObject | SvelteHeaderObject>;
  /** Row data: domain objects or core `Row[]`; cast inside the adapter. */
  rows: ReadonlyArray<Row> | ReadonlyArray<object>;
  footerRenderer?: SvelteFooterRenderer;
  loadingStateRenderer?: SvelteLoadingStateRenderer;
  errorStateRenderer?: SvelteErrorStateRenderer;
  emptyStateRenderer?: SvelteEmptyStateRenderer;
  /** Svelte component (no props) or plain markup — adapter mounts components for the vanilla table slot. */
  tableEmptyStateRenderer?: Component | HTMLElement | string | null;
  headerDropdown?: SvelteHeaderDropdown;
  columnEditorConfig?: SvelteColumnEditorConfig;
  icons?: SvelteIconsConfig;
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
