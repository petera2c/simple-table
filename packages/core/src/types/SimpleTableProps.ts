import { TableAPI } from "./TableAPI";
import HeaderObject, { Accessor } from "./HeaderObject";
import Row from "./Row";
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
import { ColumnEditorConfig } from "./ColumnEditorConfig";
import { IconsConfig } from "./IconsConfig";
import { QuickFilterConfig } from "./QuickFilterTypes";
import { AnimationsConfig } from "./AnimationsConfig";
import type { FooterPosition } from "./FooterPosition";
import type { PivotConfig } from "./PivotTypes";

export interface SimpleTableProps {
  animations?: AnimationsConfig; // Cell animation configuration (FLIP-style on sort and programmatic column reorder). Defaults: enabled=true, duration=240ms, easing=cubic-bezier(0.2, 0.8, 0.2, 1).
  autoExpandColumns?: boolean; // Expand-only fill: stretch columns proportionally when their natural widths leave surplus space; never squeeze below natural width (horizontal scroll instead)
  canExpandRowGroup?: (row: Row) => boolean; // Function to conditionally control if a row group can be expanded
  cellUpdateFlash?: boolean; // Flag for flash animation after cell update
  className?: string; // Class name for the table
  columnBorders?: boolean; // Flag for showing column borders
  columnEditorConfig?: ColumnEditorConfig; // Configuration for the column editor drawer
  columnReordering?: boolean; // Flag for column reordering
  columnResizing?: boolean; // Flag for column resizing
  copyHeadersToClipboard?: boolean; // Flag for including column headers when copying cells to clipboard (default: false)
  customTheme?: CustomThemeProps; // Custom theme configuration for dimensions and spacing
  /**
   * Column definitions.
   * @deprecated Prefer {@link columns}
   */
  defaultHeaders?: HeaderObject[];
  /** Column definitions. Preferred over `defaultHeaders`. */
  columns?: HeaderObject[];
  /**
   * Show the column editor / visibility UI.
   * @deprecated Prefer {@link enableColumnEditor}
   */
  editColumns?: boolean;
  /** Show the column editor / visibility UI. Preferred over `editColumns`. */
  enableColumnEditor?: boolean;
  /**
   * Open the column editor when the table loads.
   * @deprecated Prefer {@link enableColumnEditorInitOpen}
   */
  editColumnsInitOpen?: boolean;
  /** Open the column editor when the table loads. Preferred over `editColumnsInitOpen`. */
  enableColumnEditorInitOpen?: boolean;
  emptyStateRenderer?: EmptyStateRenderer; // Custom renderer for empty states (for nested row states)
  enableHeaderEditing?: boolean; // Flag for enabling header label editing when clicking already active headers
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
  errorStateRenderer?: ErrorStateRenderer; // Custom renderer for error states
  expandAll?: boolean; // Flag for expanding all rows by default
  externalFilterHandling?: boolean; // Flag to let consumer handle filter logic completely
  externalSortHandling?: boolean; // Flag to let consumer handle sort logic completely
  footerRenderer?: (props: FooterRendererProps) => HTMLElement | string | null; // Custom footer renderer
  footerPosition?: FooterPosition; // Pagination footer placement (default "bottom")
  headerDropdown?: HeaderDropdown; // Custom dropdown component for headers
  height?: string | number; // Height of the table
  hideFooter?: boolean; // Flag for hiding the footer
  hideHeader?: boolean; // Flag for hiding the header
  icons?: IconsConfig; // Configuration for all table icons
  includeHeadersInCSVExport?: boolean; // Flag for including column headers in CSV export (default: true)
  initialSortColumn?: string; // Accessor of the column to sort by on initial load
  initialSortDirection?: SortDirection; // Sort direction for initial sort
  isLoading?: boolean; // Flag for showing loading skeleton state
  loadingStateRenderer?: LoadingStateRenderer; // Custom renderer for loading states
  maxHeight?: string | number; // Maximum height of the table (enables adaptive height with virtualization)
  onCellClick?: (props: CellClickProps) => void;
  onCellEdit?: (props: CellChangeProps) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onColumnSelect?: (header: HeaderObject) => void; // Callback when a column is selected/clicked
  onColumnVisibilityChange?: (visibilityState: ColumnVisibilityState) => void; // Callback when column visibility changes
  onColumnWidthChange?: (headers: HeaderObject[]) => void; // Callback when column widths change (resize or auto-size)
  onFilterChange?: (filters: TableFilterState) => void; // Callback when filter is applied
  /**
   * Called once when the table is ready.
   * @deprecated Prefer {@link onTableReady}
   */
  onGridReady?: () => void;
  /** Called once when the table is ready. Preferred over `onGridReady`. */
  onTableReady?: () => void;
  onHeaderEdit?: (header: HeaderObject, newLabel: string) => void; // Callback when a header is edited
  infiniteScrollThreshold?: number; // Pixel distance from the bottom of the scrollable area at which `onLoadMore` fires (default: 200)
  onLoadMore?: () => void; // Callback when user scrolls near bottom to load more data
  onNextPage?: OnNextPage; // Custom handler for next page
  onPageChange?: (page: number) => void | Promise<void>; // Callback when page changes (for server-side pagination)
  onRowGroupExpand?: (props: OnRowGroupExpandProps) => void | Promise<void>; // Callback when a row is expanded/collapsed
  onRowSelectionChange?: (props: RowSelectionChangeProps) => void; // Callback when row selection changes
  onSortChange?: (sort: SortColumn | null) => void; // Callback when sort is applied
  /**
   * Declarative matrix pivot. When set, flat `rows` are reshaped into a
   * pivoted grid with dynamic columns. Ignores consumer `rowGrouping` while active.
   */
  pivot?: PivotConfig | null;
  /** Fired when pivot config changes via TableAPI.setPivot. */
  onPivotChange?: (pivot: PivotConfig | null) => void;
  quickFilter?: QuickFilterConfig; // Global search configuration across all columns
  rowButtons?: RowButton[]; // Array of buttons to show in each row
  rowGrouping?: Accessor[]; // Array of property names that define row grouping hierarchy
  getRowId?: GetRowId; // Stable business id for a row. Return null/undefined when the row has no id (pivot aggregates, loading) to use reference-based identity.
  rows: Row[]; // Rows data
  rowsPerPage?: number; // Rows per page
  scrollParent?: HTMLElement | "window" | (() => HTMLElement | null); // External scroll container that drives virtualization and onLoadMore when neither height nor maxHeight is set. Accepts an element, the string "window", or a getter (useful for refs that resolve after first render).
  selectableCells?: boolean; // Flag if can select cells
  selectableColumns?: boolean; // Flag for selectable column headers
  serverSidePagination?: boolean; // Flag to disable internal pagination slicing (for server-side pagination)
  /**
   * Enable client-side pagination.
   * @deprecated Prefer {@link enablePagination}
   */
  shouldPaginate?: boolean;
  /** Enable client-side pagination. Preferred over `shouldPaginate`. */
  enablePagination?: boolean;
  tableEmptyStateRenderer?: HTMLElement | string | null; // Custom empty state component when table has no rows
  theme?: Theme; // Theme
  totalRowCount?: number; // Total number of rows on server (for server-side pagination)
  /**
   * Highlight the hovered row.
   * @deprecated Prefer {@link hoverRowBackground}
   */
  useHoverRowBackground?: boolean;
  /** Highlight the hovered row. Preferred over `useHoverRowBackground`. */
  hoverRowBackground?: boolean;
  /**
   * Alternate column background.
   * @deprecated Prefer {@link oddColumnBackground}
   */
  useOddColumnBackground?: boolean;
  /** Alternate column background. Preferred over `useOddColumnBackground`. */
  oddColumnBackground?: boolean;
  /**
   * Alternate odd/even row backgrounds.
   * @deprecated Prefer {@link oddEvenRowBackground}
   */
  useOddEvenRowBackground?: boolean;
  /** Alternate odd/even row backgrounds. Preferred over `useOddEvenRowBackground`. */
  oddEvenRowBackground?: boolean;
}
