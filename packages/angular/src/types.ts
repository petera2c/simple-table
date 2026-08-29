import type { Type } from "@angular/core";
import type {
  SimpleTableProps,
  SimpleTableConfig,
  ColumnDef,
  TableAPI,
  CellValue,
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

/**
 * Default `TData` for Angular props bags / helpers: open records so untyped
 * object arrays keep assigning to `rows` without `asRows`.
 *
 * Prefer typed `rows` / `columns` (`AngularColumnDef<MyRow>`) so `TData` flows
 * into callbacks. Template/`@Input` inference is weaker than React/Solid JSX —
 * typed column defs and a typed `SimpleTableComponent<MyRow>` ViewChild still
 * give the demo win. Angular cell components stay `Type<unknown>` (see below).
 */
export type AngularDefaultRowData = Record<string, any>;

// ─── Internal instance contract ───────────────────────────────────────────────
export interface TableInstance {
  mount(): void;
  update(config: Partial<SimpleTableConfig>): void;
  destroy(): void;
  getAPI(): TableAPI;
  /** Re-measure `width: "auto"` columns after custom renderer DOM settles. */
  refitAutoSizeColumns?(): void;
}

// ─── Renderer overrides ───────────────────────────────────────────────────────
/**
 * Angular table slots are component class refs (`Type<unknown>`), not `Type<SomeProps>`.
 * `Type<CellRendererProps>` would mean `new () => CellRendererProps`, but cell components
 * construct decorated classes whose instances are not structurally `CellRendererProps`
 * even though the adapter binds those values via `@Input()` at runtime. The concrete
 * input contract for each slot remains the matching `*RendererProps` type from
 * `simple-table-core` (re-exported below). Function (vanilla) renderers keep `TData`.
 */
/** Angular component class, or a core vanilla renderer (non-`ɵcmp` values pass through). */
export type AngularCellRenderer<
  TData extends AngularDefaultRowData = AngularDefaultRowData,
  TValue = CellValue,
> = Type<unknown> | CellRenderer<TData, TValue>;
export type AngularHeaderRenderer<TData extends AngularDefaultRowData = AngularDefaultRowData> =
  | Type<unknown>
  | HeaderRenderer<TData>;
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
 * Column definition for `columns`: same column metadata as core
 * columns, but `cellRenderer` / `headerRenderer` / `children` / `nestedTable` are Angular-only.
 */
export interface AngularColumnDef<
  TData extends AngularDefaultRowData = AngularDefaultRowData,
  TValue = CellValue,
> extends Omit<
  ColumnDef<TData, TValue>,
  "cellRenderer" | "headerRenderer" | "children" | "nestedTable"
> {
  cellRenderer?: AngularCellRenderer<TData, TValue>;
  headerRenderer?: AngularHeaderRenderer<TData>;
  children?: ReadonlyArray<AngularColumnDef<TData, any>>;
  /** Nested grid; child columns may use a different row type than `TData`. */
  nestedTable?: NestedTableAngularConfig;
}

// ─── Top-level props ──────────────────────────────────────────────────────────
// Mirrors SimpleTableProps with Angular-specific overrides. Use @ViewChild on the
// table component and `getAPI()` for the imperative TableAPI.
//
//   Overridden to Angular equivalents:
//     - columns → ReadonlyArray<AngularColumnDef<TData>>
export interface SimpleTableAngularProps<
  TData extends AngularDefaultRowData = AngularDefaultRowData,
> extends Omit<
  SimpleTableProps<TData>,
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
  columns?: ReadonlyArray<AngularColumnDef<TData, any>>;
  onColumnOrderChange?: (newHeaders: AngularColumnDef<TData, any>[]) => void;
  onColumnWidthChange?: (headers: AngularColumnDef<TData, any>[]) => void;
  onHeaderEdit?: (header: AngularColumnDef<TData, any>, newLabel: string) => void;
  onColumnSelect?: (header: AngularColumnDef<TData, any>) => void;
  /** Row data; cast to vanilla `Row[]` inside the adapter. */
  rows: readonly TData[];
  footerRenderer?: AngularFooterRenderer;
  loadingStateRenderer?: AngularLoadingStateRenderer;
  errorStateRenderer?: AngularErrorStateRenderer;
  emptyStateRenderer?: AngularEmptyStateRenderer;
  /** Component class, prebuilt element, string, or null. */
  tableEmptyStateRenderer?: Type<unknown> | HTMLElement | string | null;
  headerDropdown?: AngularHeaderDropdown;
  columnEditorConfig?: AngularColumnEditorConfig;
  icons?: AngularIconsConfig;
  /** Per-row action buttons; each entry is an Angular component rendered into the row's selection column. */
  rowButtons?: AngularRowButton[];
}

// ─── Nested table config ─────────────────────────────────────────────────────
/**
 * TData-bound call signatures omitted at nest boundaries so
 * `AngularColumnDef<Child>[]` assigns under a parent column without casts/`any`.
 * Child columns stay fully checked at their own declaration site.
 */
type AngularColumnDefCallbacks =
  | "cellRenderer"
  | "headerRenderer"
  | "children"
  | "nestedTable"
  | "comparator"
  | "exportValueGetter"
  | "valueFormatter"
  | "valueGetter"
  | "quickFilterGetter";

/** Column shape accepted on nested grids — metadata only, no TData-bound callbacks. */
export type NestedAngularColumnDef = Omit<
  AngularColumnDef<AngularDefaultRowData>,
  AngularColumnDefCallbacks
> & {
  children?: ReadonlyArray<NestedAngularColumnDef>;
  nestedTable?: NestedTableAngularConfig;
};

/**
 * Nested grid props (no `rows` / inherited state renderers).
 * Child row shape may differ from the parent column's `TData`.
 */
export type NestedTableAngularConfig = Omit<
  SimpleTableAngularProps,
  | "rows"
  | "columns"
  | "loadingStateRenderer"
  | "errorStateRenderer"
  | "emptyStateRenderer"
  | "tableEmptyStateRenderer"
> & {
  columns?: ReadonlyArray<NestedAngularColumnDef>;
};

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
