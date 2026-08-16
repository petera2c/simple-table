import type ColumnDef from "./ColumnDef";
import { Accessor } from "./ColumnDef";
import Row from "./Row";
import type { RowData } from "./Row";
import {
  EmptyStateRenderer,
  ErrorStateRenderer,
  LoadingStateRenderer,
} from "./RowStateRendererProps";
import FooterRendererProps from "./FooterRendererProps";
import { HeaderDropdown } from "./HeaderDropdownProps";
import SortColumn, { SortDirection } from "./SortColumn";
import CellClickProps from "./CellClickProps";
import CellChangeProps from "./CellChangeProps";
import { ColumnVisibilityState } from "./ColumnVisibilityTypes";
import { TableFilterState } from "./FilterTypes";
import OnNextPage from "./OnNextPage";
import OnRowGroupExpandProps from "./OnRowGroupExpandProps";
import RowSelectionChangeProps from "./RowSelectionChangeProps";
import type { RowSelectionMode } from "./RowSelectionMode";
import { RowButton } from "./RowButton";
import Theme from "./Theme";
import { CustomThemeProps } from "./CustomTheme";
import { GetRowId } from "./GetRowId";
import { GetRowClass } from "./GetRowClass";
import { ColumnEditorConfig } from "./ColumnEditorConfig";
import { IconsConfig } from "./IconsConfig";
import { QuickFilterConfig } from "./QuickFilterTypes";
import { AnimationsConfig } from "./AnimationsConfig";
import type { FooterPosition } from "./FooterPosition";
import type { PivotConfig } from "./PivotTypes";

export interface SimpleTableProps<TData extends RowData = Row> {
  animations?: AnimationsConfig; // Cell animation configuration (FLIP-style on sort and programmatic column reorder). Defaults: enabled=true, duration=240ms, easing=cubic-bezier(0.2, 0.8, 0.2, 1).
  autoExpandColumns?: boolean; // Expand-only fill: stretch columns proportionally when their natural widths leave surplus space; never squeeze below natural width (horizontal scroll instead)
  canExpandRowGroup?: (row: TData) => boolean; // Function to conditionally control if a row group can be expanded
  cellUpdateFlash?: boolean; // Flag for flash animation after cell update
  className?: string; // Class name for the table
  columnBorders?: boolean; // Flag for showing column borders
  columnEditorConfig?: ColumnEditorConfig; // Configuration for the column editor drawer
  columnReordering?: boolean; // Flag for column reordering
  columnResizing?: boolean; // Flag for column resizing
  /** Column definitions. Mixed per-column TValue uses `any` on the column union. */
  columns?: ColumnDef<TData, any>[];
  copyHeadersToClipboard?: boolean; // Flag for including column headers when copying cells to clipboard (default: false)
  customTheme?: CustomThemeProps; // Custom theme configuration for dimensions and spacing
  /** Show the column editor / visibility UI. */
  enableColumnEditor?: boolean;
  /** Open the column editor when the table loads. */
  enableColumnEditorInitOpen?: boolean;
  /**
   * Show a Pivot section in the column editor popout (Rows / Columns / Values).
   * Requires `enableColumnEditor`. Does not apply a pivot by itself — pair with `pivot`.
   */
  enablePivotPanel?: boolean;
  emptyStateRenderer?: EmptyStateRenderer<TData>; // Custom renderer for empty states (for nested row states)
  enableHeaderEditing?: boolean; // Flag for enabling header label editing when clicking already active headers
  /** Enable client-side pagination. */
  enablePagination?: boolean;
  enableRowSelection?: boolean; // Flag for enabling row selection
  /**
   * Row selection mode when `enableRowSelection` is true.
   * - `"multiple"` (default): select any number of rows
   * - `"single"`: selecting a row replaces the previous selection
   */
  rowSelectionMode?: RowSelectionMode;
  /**
   * When true, clicking a data cell selects the row (toggles in multiple mode,
   * replaces selection in single mode). Default false.
   */
  selectRowOnClick?: boolean;
  /**
   * When false, the checkbox selection column is not shown; selection still works
   * via click, keyboard, or TableAPI. Default true. The column is still shown when
   * `rowButtons` is set (buttons need a home).
   */
  showRowSelectionColumn?: boolean;
  enableStickyParents?: boolean; // Flag for enabling sticky parent rows during scrolling in grouped tables (default: false)
  /**
   * When false, disables both row and column virtualization so every row and
   * column is rendered in the DOM. Useful for print, a11y tooling, or small
   * datasets that still need a fixed `height` / `maxHeight` for layout.
   * Default true.
   */
  enableVirtualization?: boolean;
  errorStateRenderer?: ErrorStateRenderer<TData>; // Custom renderer for error states
  expandAll?: boolean; // Flag for expanding all rows by default
  externalFilterHandling?: boolean; // Flag to let consumer handle filter logic completely
  externalSortHandling?: boolean; // Flag to let consumer handle sort logic completely
  footerRenderer?: (props: FooterRendererProps) => HTMLElement | string | null; // Custom footer renderer
  /**
   * Cache key for a custom `footerRenderer`. Include any external state the
   * footer reads (e.g. a loading flag) so the footer re-renders when that
   * state changes even if page/row-count inputs are unchanged.
   *
   * Scroll-driven re-renders still reuse the previous footer DOM when this key
   * (and pagination inputs) are stable — that avoids scroll-snap regressions.
   */
  footerRenderKey?: string | number;
  footerPosition?: FooterPosition; // Pagination footer placement (default "bottom")
  headerDropdown?: HeaderDropdown; // Custom dropdown component for headers
  height?: string | number; // Height of the table
  hideFooter?: boolean; // Flag for hiding the footer
  hideHeader?: boolean; // Flag for hiding the header
  /** Highlight the hovered row. */
  hoverRowBackground?: boolean;
  icons?: IconsConfig; // Configuration for all table icons
  includeHeadersInCSVExport?: boolean; // Flag for including column headers in CSV export (default: true)
  initialSortColumn?: string; // Accessor of the column to sort by on initial load
  initialSortDirection?: SortDirection; // Sort direction for initial sort
  isLoading?: boolean; // Flag for showing loading skeleton state
  loadingStateRenderer?: LoadingStateRenderer<TData>; // Custom renderer for loading states
  maxHeight?: string | number; // Maximum height of the table (enables adaptive height with virtualization)
  /** Alternate column background. */
  oddColumnBackground?: boolean;
  /** Alternate odd/even row backgrounds. */
  oddEvenRowBackground?: boolean;
  onCellClick?: (props: CellClickProps<TData>) => void;
  onCellEdit?: (props: CellChangeProps<TData>) => void;
  onColumnOrderChange?: (newHeaders: ColumnDef<TData, any>[]) => void;
  onColumnSelect?: (header: ColumnDef<TData, any>) => void; // Callback when a column is selected/clicked
  onColumnVisibilityChange?: (visibilityState: ColumnVisibilityState) => void; // Callback when column visibility changes
  onColumnWidthChange?: (headers: ColumnDef<TData, any>[]) => void; // Callback when column widths change (resize or auto-size)
  onFilterChange?: (filters: TableFilterState<TData>) => void; // Callback when filter is applied
  /** Called once when the table is ready. */
  onTableReady?: () => void;
  onHeaderEdit?: (header: ColumnDef<TData, any>, newLabel: string) => void; // Callback when a header is edited
  infiniteScrollThreshold?: number; // Pixel distance from the bottom of the scrollable area at which `onLoadMore` fires (default: 200)
  onLoadMore?: () => void; // Callback when user scrolls near bottom to load more data
  onNextPage?: OnNextPage; // Custom handler for next page
  onPageChange?: (page: number) => void | Promise<void>; // Callback when page changes (for server-side pagination)
  onRowGroupExpand?: (props: OnRowGroupExpandProps<TData>) => void | Promise<void>; // Callback when a row is expanded/collapsed
  onRowSelectionChange?: (props: RowSelectionChangeProps<TData>) => void; // Callback when row selection changes
  onSortChange?: (sort: SortColumn | null) => void; // Callback when sort is applied
  /**
   * Declarative matrix pivot. When set, flat `rows` are reshaped into a
   * pivoted grid with dynamic columns (one row per row-dimension combination).
   * Consumer `rowGrouping` is disabled while pivot is active.
   */
  pivot?: PivotConfig<TData> | null;
  /** Fired when pivot config changes via TableAPI.setPivot. */
  onPivotChange?: (pivot: PivotConfig<TData> | null) => void;
  quickFilter?: QuickFilterConfig; // Global search configuration across all columns
  rowButtons?: RowButton<TData>[]; // Array of buttons to show in each row
  /**
   * Property names that define the row grouping hierarchy.
   * `Accessor<TData>` keeps keyof autocomplete; the `string & {}` arm still
   * allows dynamic / heterogeneous nesting keys.
   */
  rowGrouping?: Accessor<TData>[];
  getRowId?: GetRowId<TData>; // Stable business id for a row. Return null/undefined when the row has no id (pivot aggregates, loading) to use reference-based identity.
  /**
   * Return CSS class name(s) for the row. Applied to each body cell — style with
   * `.st-cell.yourClass`. Return null/undefined for default styling.
   */
  getRowClass?: GetRowClass<TData>;
  rows: TData[]; // Rows data
  rowsPerPage?: number; // Rows per page
  scrollParent?: HTMLElement | "window" | (() => HTMLElement | null); // External scroll container that drives virtualization and onLoadMore when neither height nor maxHeight is set. Accepts an element, the string "window", or a getter (useful for refs that resolve after first render).
  selectableCells?: boolean; // Flag if can select cells
  selectableColumns?: boolean; // Flag for selectable column headers
  serverSidePagination?: boolean; // Flag to disable internal pagination slicing (for server-side pagination)
  tableEmptyStateRenderer?: HTMLElement | string | null; // Custom empty state component when table has no rows
  theme?: Theme; // Theme
  totalRowCount?: number; // Total number of rows on server (for server-side pagination)
}
