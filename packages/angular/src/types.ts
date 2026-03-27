import type { Type } from "@angular/core";
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
  IconsConfig,
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
export type AngularLoadingStateRenderer = Type<LoadingStateRendererProps>;
export type AngularErrorStateRenderer = Type<ErrorStateRendererProps>;
export type AngularEmptyStateRenderer = Type<EmptyStateRendererProps>;

// ─── Column editor config override ───────────────────────────────────────────
export interface AngularColumnEditorConfig extends Omit<ColumnEditorConfig, "rowRenderer"> {
  rowRenderer?: AngularColumnEditorRowRenderer;
}

// ─── HeaderObject override ────────────────────────────────────────────────────
export interface AngularHeaderObject
  extends Omit<HeaderObject, "cellRenderer" | "headerRenderer" | "children" | "nestedTable"> {
  cellRenderer?: AngularCellRenderer;
  headerRenderer?: AngularHeaderRenderer;
  children?: AngularHeaderObject[];
  nestedTable?: Omit<SimpleTableAngularProps, "rows">;
}

// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with Angular-specific overrides.
// `tableRef` is omitted — consumers use Angular's @ViewChild decorator instead:
//   @ViewChild(SimpleTableComponent) tableRef!: SimpleTableComponent;
//   then: this.tableRef.getAPI()?.sort(...)
export interface SimpleTableAngularProps
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
  > {
  defaultHeaders: AngularHeaderObject[];
  footerRenderer?: AngularFooterRenderer;
  loadingStateRenderer?: AngularLoadingStateRenderer;
  errorStateRenderer?: AngularErrorStateRenderer;
  emptyStateRenderer?: AngularEmptyStateRenderer;
  tableEmptyStateRenderer?: HTMLElement | string | null;
  headerDropdown?: AngularHeaderDropdown;
  columnEditorConfig?: AngularColumnEditorConfig;
  icons?: IconsConfig;
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
