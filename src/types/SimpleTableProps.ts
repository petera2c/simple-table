import { MutableRefObject, ReactNode } from "react";
import ColumnEditorPosition from "./ColumnEditorPosition";
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
import { RowButton } from "./RowButton";
import TableRefType from "./TableRefType";
import Theme from "./Theme";
import { CustomThemeProps } from "./CustomTheme";
import { GetRowId } from "./GetRowId";

export interface SimpleTableProps {
  allowAnimations?: boolean; // Flag for allowing animations
  autoExpandColumns?: boolean; // Flag for converting pixel widths to proportional fr units that fill table width
  canExpandRowGroup?: (row: Row) => boolean; // Function to conditionally control if a row group can be expanded
  cellUpdateFlash?: boolean; // Flag for flash animation after cell update
  className?: string; // Class name for the table
  columnBorders?: boolean; // Flag for showing column borders
  columnEditorPosition?: ColumnEditorPosition;
  columnEditorText?: string; // Text for the column editor
  columnReordering?: boolean; // Flag for column reordering
  columnResizing?: boolean; // Flag for column resizing
  copyHeadersToClipboard?: boolean; // Flag for including column headers when copying cells to clipboard (default: false)
  customTheme?: CustomThemeProps; // Custom theme configuration for dimensions and spacing
  defaultHeaders: HeaderObject[]; // Default headers
  editColumns?: boolean; // Flag for column editing
  editColumnsInitOpen?: boolean; // Flag for opening the column editor when the table is loaded
  emptyStateRenderer?: EmptyStateRenderer; // Custom renderer for empty states (for nested row states)
  enableHeaderEditing?: boolean; // Flag for enabling header label editing when clicking already active headers
  enableRowSelection?: boolean; // Flag for enabling row selection with checkboxes
  enableStickyParents?: boolean; // Flag for enabling sticky parent rows during scrolling in grouped tables (default: false)
  errorStateRenderer?: ErrorStateRenderer; // Custom renderer for error states
  expandAll?: boolean; // Flag for expanding all rows by default
  expandIcon?: ReactNode; // Icon for expanded state (used in expandable rows)
  externalFilterHandling?: boolean; // Flag to let consumer handle filter logic completely
  externalSortHandling?: boolean; // Flag to let consumer handle sort logic completely
  filterIcon?: ReactNode; // Icon for filter button
  footerRenderer?: (props: FooterRendererProps) => ReactNode; // Custom footer renderer
  headerCollapseIcon?: ReactNode; // Icon for collapsed column headers
  headerDropdown?: HeaderDropdown; // Custom dropdown component for headers
  headerExpandIcon?: ReactNode; // Icon for expanded column headers
  height?: string | number; // Height of the table
  hideFooter?: boolean; // Flag for hiding the footer
  hideHeader?: boolean; // Flag for hiding the header
  includeHeadersInCSVExport?: boolean; // Flag for including column headers in CSV export (default: true)
  initialSortColumn?: string; // Accessor of the column to sort by on initial load
  initialSortDirection?: SortDirection; // Sort direction for initial sort
  isLoading?: boolean; // Flag for showing loading skeleton state
  loadingStateRenderer?: LoadingStateRenderer; // Custom renderer for loading states
  maxHeight?: string | number; // Maximum height of the table (enables adaptive height with virtualization)
  nextIcon?: ReactNode; // Next icon
  onCellClick?: (props: CellClickProps) => void;
  onCellEdit?: (props: CellChangeProps) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onColumnSelect?: (header: HeaderObject) => void; // Callback when a column is selected/clicked
  onColumnVisibilityChange?: (visibilityState: ColumnVisibilityState) => void; // Callback when column visibility changes
  onFilterChange?: (filters: TableFilterState) => void; // Callback when filter is applied
  onGridReady?: () => void; // Custom handler for when the grid is ready
  onHeaderEdit?: (header: HeaderObject, newLabel: string) => void; // Callback when a header is edited
  onLoadMore?: () => void; // Callback when user scrolls near bottom to load more data
  onNextPage?: OnNextPage; // Custom handler for next page
  onPageChange?: (page: number) => void | Promise<void>; // Callback when page changes (for server-side pagination)
  onRowGroupExpand?: (props: OnRowGroupExpandProps) => void | Promise<void>; // Callback when a row is expanded/collapsed
  onRowSelectionChange?: (props: RowSelectionChangeProps) => void; // Callback when row selection changes
  onSortChange?: (sort: SortColumn | null) => void; // Callback when sort is applied
  prevIcon?: ReactNode; // Previous icon
  rowButtons?: RowButton[]; // Array of buttons to show in each row
  rowGrouping?: Accessor[]; // Array of property names that define row grouping hierarchy
  getRowId?: GetRowId; // Function to generate unique row IDs for stable row identification across data changes. Receives row data, depth, index, paths, and grouping key. If not provided, uses index-based IDs.
  rows: Row[]; // Rows data
  rowsPerPage?: number; // Rows per page
  selectableCells?: boolean; // Flag if can select cells
  selectableColumns?: boolean; // Flag for selectable column headers
  serverSidePagination?: boolean; // Flag to disable internal pagination slicing (for server-side pagination)
  shouldPaginate?: boolean; // Flag for pagination
  sortDownIcon?: ReactNode; // Sort down icon
  sortUpIcon?: ReactNode; // Sort up icon
  tableEmptyStateRenderer?: ReactNode; // Custom empty state component when table has no rows
  tableRef?: MutableRefObject<TableRefType | null>;
  theme?: Theme; // Theme
  totalRowCount?: number; // Total number of rows on server (for server-side pagination)
  useHoverRowBackground?: boolean; // Flag for using hover row background
  useOddColumnBackground?: boolean; // Flag for using column background
  useOddEvenRowBackground?: boolean; // Flag for using odd/even row background
}
