import type { Type } from "@angular/core";
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
} from "simple-table-core";

// ─── Internal instance contract ───────────────────────────────────────────────
export interface TableInstance {
  mount(): void;
  update(config: Partial<SimpleTableConfig>): void;
  destroy(): void;
  getAPI(): TableAPI;
}

// ─── Renderer overrides ───────────────────────────────────────────────────────
/**
 * Angular table slots are component class refs (`Type<unknown>`), not `Type<SomeProps>`.
 * `Type<CellRendererProps>` would mean `new () => CellRendererProps`, but cell components
 * construct decorated classes whose instances are not structurally `CellRendererProps`
 * even though the adapter binds those values via `@Input()` at runtime. The concrete
 * input contract for each slot remains the matching `*RendererProps` type from
 * `simple-table-core` (re-exported below).
 */
/** Angular component class, or a core vanilla renderer (non-`ɵcmp` values pass through). */
export type AngularCellRenderer = Type<unknown> | CellRenderer;
export type AngularHeaderRenderer = Type<unknown> | HeaderRenderer;
export type AngularFooterRenderer = Type<unknown>;
export type AngularHeaderDropdown = Type<unknown>;
export type AngularColumnEditorRowRenderer = Type<unknown>;
export type AngularColumnEditorCustomRenderer = Type<unknown>;
export type AngularLoadingStateRenderer = Type<unknown>;
export type AngularErrorStateRenderer = Type<unknown>;
export type AngularEmptyStateRenderer = Type<unknown>;
// Per-row action buttons. Each entry is an Angular component class; the adapter
// binds RowButtonProps (`row` / `rowIndex`) via @Input() at render time.
export type AngularRowButton = Type<unknown>;

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
export interface AngularColumnEditorConfig extends Omit<
  ColumnEditorConfig,
  "rowRenderer" | "customRenderer"
> {
  rowRenderer?: AngularColumnEditorRowRenderer;
  customRenderer?: AngularColumnEditorCustomRenderer;
}

// ─── ColumnDef override ────────────────────────────────────────────────────
/**
 * Column definition for `columns`: core column metadata with
 * Angular-only renderer fields. `columns` also accept plain
 * `ColumnDef[]` from shared configs.
 */
export interface AngularColumnDef extends Omit<
  ColumnDef,
  "cellRenderer" | "headerRenderer" | "children" | "nestedTable"
> {
  cellRenderer?: AngularCellRenderer;
  headerRenderer?: AngularHeaderRenderer;
  children?: AngularColumnDef[];
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
//
//   Overridden to Angular equivalents:
//     - columns → ReadonlyArray<ColumnDef | AngularColumnDef>
export interface SimpleTableAngularProps extends Omit<
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
  columns?: ReadonlyArray<ColumnDef | AngularColumnDef>;
  /** Row data: domain objects or core `Row[]`; cast inside the adapter. */
  rows: ReadonlyArray<Row> | ReadonlyArray<object>;
  onColumnOrderChange?: (newHeaders: AngularColumnDef[]) => void;
  onColumnWidthChange?: (headers: AngularColumnDef[]) => void;
  onHeaderEdit?: (header: AngularColumnDef, newLabel: string) => void;
  onColumnSelect?: (header: AngularColumnDef) => void;
  footerRenderer?: AngularFooterRenderer;
  loadingStateRenderer?: AngularLoadingStateRenderer;
  errorStateRenderer?: AngularErrorStateRenderer;
  emptyStateRenderer?: AngularEmptyStateRenderer;
  tableEmptyStateRenderer?: HTMLElement | string | null;
  headerDropdown?: AngularHeaderDropdown;
  columnEditorConfig?: AngularColumnEditorConfig;
  icons?: AngularIconsConfig;
  /** Per-row action buttons; each entry is an Angular component rendered into the row's selection column. */
  rowButtons?: AngularRowButton[];
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
