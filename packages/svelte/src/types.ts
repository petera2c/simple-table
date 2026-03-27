import type { Component } from "svelte";
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

// ─── Renderer overrides ───────────────────────────────────────────────────────
// Svelte components are typed as Component<Props> from 'svelte'.
export type SvelteCellRenderer = Component<CellRendererProps>;
export type SvelteHeaderRenderer = Component<HeaderRendererProps>;
export type SvelteFooterRenderer = Component<FooterRendererProps>;
export type SvelteHeaderDropdown = Component<HeaderDropdownProps>;
export type SvelteColumnEditorRowRenderer = Component<ColumnEditorRowRendererProps>;

// State renderers are always components (Svelte has no static "node" concept
// outside of a component — consumers wanting static markup should use a wrapper
// component or supply an HTMLElement via the vanilla API directly).
export type SvelteLoadingStateRenderer = Component<LoadingStateRendererProps>;
export type SvelteErrorStateRenderer = Component<ErrorStateRendererProps>;
export type SvelteEmptyStateRenderer = Component<EmptyStateRendererProps>;

// ─── Column editor config override ───────────────────────────────────────────
export interface SvelteColumnEditorConfig extends Omit<ColumnEditorConfig, "rowRenderer"> {
  rowRenderer?: SvelteColumnEditorRowRenderer;
}

// ─── HeaderObject override ────────────────────────────────────────────────────
export interface SvelteHeaderObject
  extends Omit<HeaderObject, "cellRenderer" | "headerRenderer" | "children" | "nestedTable"> {
  cellRenderer?: SvelteCellRenderer;
  headerRenderer?: SvelteHeaderRenderer;
  children?: SvelteHeaderObject[];
  nestedTable?: Omit<SimpleTableSvelteProps, "rows">;
}

// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with Svelte-specific overrides.
// `tableRef` is omitted — consumers use Svelte's bind:this directive instead:
//   <SimpleTable bind:this={tableRef} ... />
//   then: tableRef.getAPI().sort(...)
export interface SimpleTableSvelteProps
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
  defaultHeaders: SvelteHeaderObject[];
  footerRenderer?: SvelteFooterRenderer;
  loadingStateRenderer?: SvelteLoadingStateRenderer;
  errorStateRenderer?: SvelteErrorStateRenderer;
  emptyStateRenderer?: SvelteEmptyStateRenderer;
  tableEmptyStateRenderer?: HTMLElement | string | null;
  headerDropdown?: SvelteHeaderDropdown;
  columnEditorConfig?: SvelteColumnEditorConfig;
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
