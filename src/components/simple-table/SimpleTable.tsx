import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useReducer,
  ReactNode,
  useMemo,
  useCallback,
  MutableRefObject,
} from "react";
import useSelection from "../../hooks/useSelection";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import TableFooter from "./TableFooter";
import { AngleLeftIcon, AngleRightIcon, DescIcon, AscIcon, FilterIcon } from "../../icons";
import CellChangeProps from "../../types/CellChangeProps";
import Theme from "../../types/Theme";
import TableContent from "./TableContent";
import TableHorizontalScrollbar from "./TableHorizontalScrollbar";
import Row from "../../types/Row";
import useSortableData from "../../hooks/useSortableData";
import TableColumnEditor from "./table-column-editor/TableColumnEditor";
import { TableProvider, CellRegistryEntry, HeaderRegistryEntry } from "../../context/TableContext";
import ColumnEditorPosition from "../../types/ColumnEditorPosition";
import TableRefType from "../../types/TableRefType";
import OnNextPage from "../../types/OnNextPage";
import "../../styles/all-themes.css";
import { ScrollSync } from "../scroll-sync/ScrollSync";
import useFilterableData from "../../hooks/useFilterableData";
import { useContentHeight } from "../../hooks/useContentHeight";
import useHandleOutsideClick from "../../hooks/useHandleOutsideClick";
import useWindowResize from "../../hooks/useWindowResize";
import { FilterCondition, TableFilterState } from "../../types/FilterTypes";
import { recalculateAllSectionWidths } from "../../utils/resizeUtils";
import { useAggregatedRows } from "../../hooks/useAggregatedRows";
import { getResponsiveMaxPinnedPercent } from "../../consts/general-consts";
import SortColumn, { SortDirection } from "../../types/SortColumn";
import useExternalFilters from "../../hooks/useExternalFilters";
import useExternalSort from "../../hooks/useExternalSort";
import useScrollbarWidth from "../../hooks/useScrollbarWidth";
import useOnGridReady from "../../hooks/useOnGridReady";
import useTableAPI from "../../hooks/useTableAPI";
import useTableRowProcessing from "../../hooks/useTableRowProcessing";
import useFlattenedRows from "../../hooks/useFlattenedRows";
import { useRowSelection } from "../../hooks/useRowSelection";
import { createSelectionHeader } from "../../utils/rowSelectionUtils";
import RowSelectionChangeProps from "../../types/RowSelectionChangeProps";
import CellClickProps from "../../types/CellClickProps";
import { RowButton } from "../../types/RowButton";
import { HeaderDropdown } from "../../types/HeaderDropdownProps";
import FooterRendererProps from "../../types/FooterRendererProps";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import OnRowGroupExpandProps from "../../types/OnRowGroupExpandProps";
import RowState from "../../types/RowState";
import { getRowId, flattenRowsWithGrouping } from "../../utils/rowUtils";
import {
  LoadingStateRenderer,
  ErrorStateRenderer,
  EmptyStateRenderer,
} from "../../types/RowStateRendererProps";
import DefaultEmptyState from "../empty-state/DefaultEmptyState";

interface SimpleTableProps {
  allowAnimations?: boolean; // Flag for allowing animations
  canExpandRowGroup?: (row: Row) => boolean; // Function to conditionally control if a row group can be expanded
  cellUpdateFlash?: boolean; // Flag for flash animation after cell update
  className?: string; // Class name for the table
  columnBorders?: boolean; // Flag for showing column borders
  columnEditorPosition?: ColumnEditorPosition;
  columnEditorText?: string; // Text for the column editor
  columnReordering?: boolean; // Flag for column reordering
  columnResizing?: boolean; // Flag for column resizing
  copyHeadersToClipboard?: boolean; // Flag for including column headers when copying cells to clipboard (default: false)
  defaultHeaders: HeaderObject[]; // Default headers
  editColumns?: boolean; // Flag for column editing
  editColumnsInitOpen?: boolean; // Flag for opening the column editor when the table is loaded
  enableHeaderEditing?: boolean; // Flag for enabling header label editing when clicking already active headers
  enableRowSelection?: boolean; // Flag for enabling row selection with checkboxes
  expandAll?: boolean; // Flag for expanding all rows by default
  expandIcon?: ReactNode; // Icon for expanded state (used in expandable rows)
  externalFilterHandling?: boolean; // Flag to let consumer handle filter logic completely
  externalSortHandling?: boolean; // Flag to let consumer handle sort logic completely
  filterIcon?: ReactNode; // Icon for filter button
  footerRenderer?: (props: FooterRendererProps) => ReactNode; // Custom footer renderer
  headerCollapseIcon?: ReactNode; // Icon for collapsed column headers
  headerExpandIcon?: ReactNode; // Icon for expanded column headers
  headerDropdown?: HeaderDropdown; // Custom dropdown component for headers
  headerHeight?: number; // Height of the header
  height?: string | number; // Height of the table
  hideFooter?: boolean; // Flag for hiding the footer
  includeHeadersInCSVExport?: boolean; // Flag for including column headers in CSV export (default: true)
  initialSortColumn?: string; // Accessor of the column to sort by on initial load
  initialSortDirection?: SortDirection; // Sort direction for initial sort
  isLoading?: boolean; // Flag for showing loading skeleton state
  loadingStateRenderer?: LoadingStateRenderer; // Custom renderer for loading states
  errorStateRenderer?: ErrorStateRenderer; // Custom renderer for error states
  emptyStateRenderer?: EmptyStateRenderer; // Custom renderer for empty states (for nested row states)
  nextIcon?: ReactNode; // Next icon
  onCellEdit?: (props: CellChangeProps) => void;
  onCellClick?: (props: CellClickProps) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onColumnSelect?: (header: HeaderObject) => void; // Callback when a column is selected/clicked
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
  rowGrouping?: Accessor[]; // Array of property names that define row grouping hierarchy
  rowButtons?: RowButton[]; // Array of buttons to show in each row
  rowHeight?: number; // Height of each row
  rowIdAccessor: Accessor; // Property name to use as row ID (defaults to index-based ID)
  rows: Row[]; // Rows data
  selectionColumnWidth?: number; // Width of the selection column (defaults to 42)
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
  useOddColumnBackground?: boolean; // Flag for using column background
  useHoverRowBackground?: boolean; // Flag for using hover row background
  useOddEvenRowBackground?: boolean; // Flag for using odd/even row background
}

const SimpleTable = (props: SimpleTableProps) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return null;
  return <SimpleTableComp {...props} />;
};

const SimpleTableComp = ({
  allowAnimations = false,
  canExpandRowGroup,
  cellUpdateFlash = false,
  className,
  columnBorders = false,
  columnEditorPosition = "right",
  columnEditorText = "Columns",
  columnReordering = false,
  columnResizing = false,
  copyHeadersToClipboard = false,
  defaultHeaders,
  editColumns = false,
  editColumnsInitOpen = false,
  enableHeaderEditing = false,
  enableRowSelection = false,
  expandAll = true,
  expandIcon = <AngleRightIcon className="st-expand-icon" />,
  externalFilterHandling = false,
  externalSortHandling = false,
  filterIcon = <FilterIcon className="st-header-icon" />,
  footerRenderer,
  headerCollapseIcon = <AngleRightIcon className="st-header-icon" />,
  headerExpandIcon = <AngleLeftIcon className="st-header-icon" />,
  headerDropdown,
  headerHeight,
  height,
  hideFooter = false,
  includeHeadersInCSVExport = true,
  initialSortColumn,
  initialSortDirection = "asc",
  isLoading = false,
  loadingStateRenderer,
  errorStateRenderer,
  emptyStateRenderer,
  nextIcon = <AngleRightIcon className="st-next-prev-icon" />,
  onCellEdit,
  onCellClick,
  onColumnOrderChange,
  onColumnSelect,
  onFilterChange,
  onGridReady,
  onHeaderEdit,
  onLoadMore,
  onNextPage,
  onPageChange,
  onRowGroupExpand,
  onRowSelectionChange,
  onSortChange,
  prevIcon = <AngleLeftIcon className="st-next-prev-icon" />,
  rowButtons,
  rowGrouping,
  rowHeight = 32,
  rowIdAccessor,
  rows,
  rowsPerPage = 10,
  selectableCells = false,
  selectableColumns = false,
  selectionColumnWidth = 42,
  serverSidePagination = false,
  shouldPaginate = false,
  sortDownIcon = <DescIcon className="st-header-icon" />,
  sortUpIcon = <AscIcon className="st-header-icon" />,
  tableEmptyStateRenderer = <DefaultEmptyState />,
  tableRef,
  theme = "light",
  totalRowCount,
  useHoverRowBackground = true,
  useOddColumnBackground = false,
  useOddEvenRowBackground = false,
}: SimpleTableProps) => {
  if (useOddColumnBackground) useOddEvenRowBackground = false;
  // Disable hover row background when column borders are enabled to prevent visual conflicts
  if (columnBorders) useHoverRowBackground = false;

  // Refs
  const draggedHeaderRef = useRef<HeaderObject | null>(null);
  const hoveredHeaderRef = useRef<HeaderObject | null>(null);

  const mainBodyRef = useRef<HTMLDivElement>(null);
  const pinnedLeftRef = useRef<HTMLDivElement>(null);
  const pinnedRightRef = useRef<HTMLDivElement>(null);
  const tableBodyContainerRef = useRef<HTMLDivElement>(null);
  const headerContainerRef = useRef<HTMLDivElement>(null);

  // Force update function - needed early for header updates
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // Row state map for managing loading/error/empty states
  const [rowStateMap, setRowStateMap] = useState<Map<string | number, RowState>>(new Map());

  // Local state
  // Manage rows internally to allow imperative API mutations to trigger re-renders
  const [localRows, setLocalRows] = useState<Row[]>(rows);

  // Create a mapping of rowId -> absolute index for O(1) lookups
  // This maps each row to its position in the original localRows array
  const rowIndexMapRef = useRef<Map<string | number, number>>(new Map());

  // Sync local rows when prop changes and rebuild index map
  useEffect(() => {
    setLocalRows(rows);

    // Rebuild the index map
    const newIndexMap = new Map<string | number, number>();
    rows.forEach((row, index) => {
      const rowId = getRowId({ row, rowIdAccessor });
      newIndexMap.set(rowId, index);
    });
    rowIndexMapRef.current = newIndexMap;
  }, [rows, rowIdAccessor]);

  // Apply aggregation to current rows
  const { scrollbarWidth, setScrollbarWidth } = useScrollbarWidth({ tableBodyContainerRef });

  // Track vertical scrollbar visibility
  const { isMainSectionScrollable } = useScrollbarVisibility({
    headerContainerRef,
    mainSectionRef: tableBodyContainerRef,
    scrollbarWidth,
  });
  const effectiveRows = useMemo(() => {
    if (isLoading && localRows.length === 0) {
      // Calculate how many rows can fit in the visible area
      let rowsToShow = shouldPaginate ? rowsPerPage : 10; // Default to 10 rows for loading state
      if (isMainSectionScrollable) {
        rowsToShow += 1;
      }

      // Create dummy rows with empty data
      const dummyRows = Array.from({ length: rowsToShow }, (_, index) => {
        const dummyRow: Record<string, any> = {
          [rowIdAccessor]: `loading-${index}`,
        };
        return dummyRow;
      });
      return dummyRows;
    }
    return localRows;
  }, [isLoading, localRows, rowIdAccessor, rowsPerPage, isMainSectionScrollable, shouldPaginate]);

  const [currentPage, setCurrentPage] = useState(1);
  const [headers, setHeaders] = useState(defaultHeaders);
  const [isResizing, setIsResizing] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeHeaderDropdown, setActiveHeaderDropdown] = useState<HeaderObject | null>(null);

  // Initialize collapsed headers with columns that have collapsedByDefault set
  const getInitialCollapsedHeaders = useCallback(() => {
    const collapsed = new Set<Accessor>();
    const processHeaders = (hdrs: HeaderObject[]) => {
      hdrs.forEach((header) => {
        if (header.collapseDefault && header.collapsible) {
          collapsed.add(header.accessor);
        }
        if (header.children) {
          processHeaders(header.children);
        }
      });
    };
    processHeaders(defaultHeaders);
    return collapsed;
  }, [defaultHeaders]);

  const [collapsedHeaders, setCollapsedHeaders] = useState<Set<Accessor>>(
    getInitialCollapsedHeaders
  );

  // Update headers when defaultHeaders prop changes
  useEffect(() => {
    setHeaders(defaultHeaders);
  }, [defaultHeaders]);

  // Row selection hook
  const {
    selectedRows,
    setSelectedRows,
    isRowSelected,
    areAllRowsSelected,
    selectedRowCount,
    selectedRowsData,
    handleRowSelect,
    handleSelectAll,
    handleToggleRow,
    clearSelection,
  } = useRowSelection({
    rows: effectiveRows,
    rowIdAccessor,
    onRowSelectionChange,
    enableRowSelection,
  });

  // Create headers with selection column if enabled
  const effectiveHeaders = useMemo(() => {
    let processedHeaders = [...headers];

    // Add selection column if enabled and not already present
    if (enableRowSelection && !headers?.[0]?.isSelectionColumn) {
      const selectionHeader = createSelectionHeader(selectionColumnWidth);
      processedHeaders = [selectionHeader, ...processedHeaders];
    }

    return processedHeaders;
  }, [enableRowSelection, headers, selectionColumnWidth]);

  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | "none">("none");
  const [unexpandedRows, setUnexpandedRows] = useState<Set<string>>(new Set());

  // Track container width changes to ensure proper recalculation of pinned section limits
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Update container width when the table container changes
  useLayoutEffect(() => {
    const updateContainerWidth = () => {
      if (tableBodyContainerRef.current) {
        setContainerWidth(tableBodyContainerRef.current.clientWidth);
      }
    };

    updateContainerWidth();

    // Set up a ResizeObserver to watch for container size changes
    let resizeObserver: ResizeObserver | null = null;
    if (tableBodyContainerRef.current) {
      resizeObserver = new ResizeObserver(updateContainerWidth);
      resizeObserver.observe(tableBodyContainerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  // Calculate the width of the sections
  const {
    mainBodyWidth,
    pinnedLeftWidth,
    pinnedRightWidth,
    pinnedLeftContentWidth,
    pinnedRightContentWidth,
  } = useMemo(() => {
    // Get responsive max pinned percent based on viewport width for better mobile compatibility
    const maxPinnedWidthPercent = getResponsiveMaxPinnedPercent(window.innerWidth);

    const { mainWidth, leftWidth, rightWidth, leftContentWidth, rightContentWidth } =
      recalculateAllSectionWidths({
        headers: effectiveHeaders,
        containerWidth,
        maxPinnedWidthPercent,
        collapsedHeaders,
      });
    return {
      mainBodyWidth: mainWidth,
      pinnedLeftWidth: leftWidth,
      pinnedRightWidth: rightWidth,
      pinnedLeftContentWidth: leftContentWidth,
      pinnedRightContentWidth: rightContentWidth,
    };
  }, [effectiveHeaders, containerWidth, collapsedHeaders]);

  // Calculate content height using hook
  const contentHeight = useContentHeight({ height, rowHeight, shouldPaginate, rowsPerPage });

  const aggregatedRows = useAggregatedRows({
    rows: effectiveRows,
    headers,
    rowGrouping,
  });

  // Use filter hook
  const {
    filters,
    filteredRows,
    updateFilter,
    clearFilter,
    clearAllFilters,
    computeFilteredRowsPreview,
  } = useFilterableData({
    rows: aggregatedRows,
    externalFilterHandling,
    onFilterChange,
  });

  // Use custom hook for sorting (now operates on filtered rows)
  const { sort, sortedRows, updateSort, computeSortedRowsPreview } = useSortableData({
    headers,
    tableRows: filteredRows,
    externalSortHandling,
    onSortChange,
    rowGrouping,
    initialSortColumn,
    initialSortDirection,
  });

  // Flatten sorted rows - this converts nested Row[] to flat TableRow[]
  // Done BEFORE pagination so rowsPerPage correctly counts all visible rows including nested children
  const flattenedRows = useFlattenedRows({
    rows: sortedRows,
    rowGrouping,
    rowIdAccessor,
    unexpandedRows,
    expandAll,
    rowStateMap,
    hasLoadingRenderer: Boolean(loadingStateRenderer),
    hasErrorRenderer: Boolean(errorStateRenderer),
    hasEmptyRenderer: Boolean(emptyStateRenderer),
  });

  // Also flatten the original aggregated rows for animation baseline positions
  const originalFlattenedRows = useFlattenedRows({
    rows: aggregatedRows,
    rowGrouping,
    rowIdAccessor,
    unexpandedRows,
    expandAll,
    rowStateMap,
    hasLoadingRenderer: Boolean(loadingStateRenderer),
    hasErrorRenderer: Boolean(errorStateRenderer),
    hasEmptyRenderer: Boolean(emptyStateRenderer),
  });

  // Create flattened preview functions for animations
  const computeFlattenedFilteredRowsPreview = useCallback(
    (filter: FilterCondition) => {
      const filteredPreview = computeFilteredRowsPreview(filter);
      // Flatten the preview using the same logic as useFlattenedRows
      if (!rowGrouping || rowGrouping.length === 0) {
        return filteredPreview.map((row, index) => ({
          row,
          depth: 0,
          displayPosition: index,
          groupingKey: undefined,
          position: index,
          isLastGroupRow: index === filteredPreview.length - 1,
          rowPath: [index],
          absoluteRowIndex: index,
        }));
      }
      return flattenRowsWithGrouping({
        rows: filteredPreview,
        rowGrouping,
        rowIdAccessor,
        unexpandedRows,
        expandAll,
        rowStateMap,
        hasLoadingRenderer: Boolean(loadingStateRenderer),
        hasErrorRenderer: Boolean(errorStateRenderer),
        hasEmptyRenderer: Boolean(emptyStateRenderer),
      });
    },
    [
      computeFilteredRowsPreview,
      rowGrouping,
      rowIdAccessor,
      unexpandedRows,
      expandAll,
      rowStateMap,
      loadingStateRenderer,
      errorStateRenderer,
      emptyStateRenderer,
    ]
  );

  const computeFlattenedSortedRowsPreview = useCallback(
    (accessor: Accessor) => {
      const sortedPreview = computeSortedRowsPreview(accessor);
      // Flatten the preview using the same logic as useFlattenedRows
      if (!rowGrouping || rowGrouping.length === 0) {
        return sortedPreview.map((row, index) => ({
          row,
          depth: 0,
          displayPosition: index,
          groupingKey: undefined,
          position: index,
          isLastGroupRow: index === sortedPreview.length - 1,
          rowPath: [index],
          absoluteRowIndex: index,
        }));
      }
      return flattenRowsWithGrouping({
        rows: sortedPreview,
        rowGrouping,
        rowIdAccessor,
        unexpandedRows,
        expandAll,
        rowStateMap,
        hasLoadingRenderer: Boolean(loadingStateRenderer),
        hasErrorRenderer: Boolean(errorStateRenderer),
        hasEmptyRenderer: Boolean(emptyStateRenderer),
      });
    },
    [
      computeSortedRowsPreview,
      rowGrouping,
      rowIdAccessor,
      unexpandedRows,
      expandAll,
      rowStateMap,
      loadingStateRenderer,
      errorStateRenderer,
      emptyStateRenderer,
    ]
  );

  // Process rows through pagination and virtualization (now operates on flattened rows)
  const {
    currentTableRows,
    rowsToRender,
    prepareForFilterChange,
    prepareForSortChange,
    isAnimating,
  } = useTableRowProcessing({
    allowAnimations,
    flattenedRows,
    originalFlattenedRows,
    currentPage,
    rowsPerPage,
    shouldPaginate,
    serverSidePagination,
    rowIdAccessor,
    contentHeight,
    rowHeight,
    scrollTop,
    scrollDirection,
    computeFilteredRowsPreview: computeFlattenedFilteredRowsPreview,
    computeSortedRowsPreview: computeFlattenedSortedRowsPreview,
  });

  // Create a registry for cells to enable direct updates
  const cellRegistryRef = useRef<Map<string, CellRegistryEntry>>(new Map());

  // Create a registry for header cells to enable direct updates (like editing)
  const headerRegistryRef = useRef<Map<string, HeaderRegistryEntry>>(new Map());
  const {
    getBorderClass,
    handleMouseDown,
    handleMouseOver,
    isCopyFlashing,
    isInitialFocusedCell,
    isSelected,
    isWarningFlashing,
    selectColumns,
    selectedCells,
    selectedColumns,
    setInitialFocusedCell,
    setSelectedCells,
    setSelectedColumns,
    columnsWithSelectedCells,
    rowsWithSelectedCells,
  } = useSelection({
    selectableCells,
    headers,
    tableRows: currentTableRows,
    rowIdAccessor,
    onCellEdit,
    cellRegistry: cellRegistryRef.current,
    collapsedHeaders,
    rowHeight,
    enableRowSelection,
    copyHeadersToClipboard,
  });

  // Memoize handlers
  const onSort = useCallback(
    (accessor: Accessor) => {
      // STAGE 1: Prepare animation by adding entering rows before applying sort
      prepareForSortChange(accessor);

      // STAGE 2: Apply sort after Stage 1 is rendered (next frame)
      setTimeout(() => {
        updateSort(accessor);
      }, 0);
    },
    [prepareForSortChange, updateSort]
  );

  const onTableHeaderDragEnd = useCallback((newHeaders: HeaderObject[]) => {
    setHeaders(newHeaders);
  }, []);

  // Handle outside click
  useHandleOutsideClick({
    selectableColumns,
    selectedCells,
    selectedColumns,
    setSelectedCells,
    setSelectedColumns,
    activeHeaderDropdown,
    setActiveHeaderDropdown,
  });
  useWindowResize({
    forceUpdate,
    tableBodyContainerRef,
    setScrollbarWidth,
  });
  useOnGridReady({ onGridReady });
  useTableAPI({
    cellRegistryRef,
    clearAllFilters,
    clearFilter,
    filters,
    flattenedRows,
    headerRegistryRef,
    headers: effectiveHeaders,
    includeHeadersInCSVExport,
    rowIdAccessor,
    rowIndexMap: rowIndexMapRef,
    rows: effectiveRows,
    setRows: setLocalRows,
    sort,
    tableRef,
    updateFilter,
    updateSort,
    visibleRows: rowsToRender,
  });
  console.log("sort", sort);
  useExternalFilters({ filters, onFilterChange });
  useExternalSort({ sort, onSortChange });

  // Custom filter handler that respects external filter handling flag
  const handleApplyFilter = useCallback(
    (filter: FilterCondition) => {
      // STAGE 1: Prepare animation by adding entering rows before applying filter
      prepareForFilterChange(filter);

      // STAGE 2: Apply filter after Stage 1 is rendered (next frame)
      setTimeout(() => {
        // Update internal state and call external handler if provided
        updateFilter(filter);
      }, 0);
    },
    [prepareForFilterChange, updateFilter]
  );

  // Check if we should show the empty state (no rows after filtering and not loading)
  const shouldShowEmptyState = !isLoading && currentTableRows.length === 0;

  return (
    <TableProvider
      value={{
        activeHeaderDropdown,
        allowAnimations,
        areAllRowsSelected,
        canExpandRowGroup,
        cellRegistry: cellRegistryRef.current,
        cellUpdateFlash,
        clearSelection,
        collapsedHeaders,
        columnBorders,
        columnReordering,
        columnResizing,
        columnsWithSelectedCells,
        copyHeadersToClipboard,
        draggedHeaderRef,
        editColumns,
        emptyStateRenderer,
        enableHeaderEditing,
        enableRowSelection,
        errorStateRenderer,
        expandAll,
        expandIcon,
        filterIcon,
        filters,
        forceUpdate,
        getBorderClass,
        handleApplyFilter,
        handleClearAllFilters: clearAllFilters,
        handleClearFilter: clearFilter,
        handleMouseDown,
        handleMouseOver,
        handleRowSelect,
        handleSelectAll,
        handleToggleRow,
        headerCollapseIcon,
        headerContainerRef,
        headerDropdown,
        headerExpandIcon,
        headerHeight: headerHeight ?? rowHeight,
        headerRegistry: headerRegistryRef.current,
        headers: effectiveHeaders,
        hoveredHeaderRef,
        includeHeadersInCSVExport,
        isAnimating,
        isCopyFlashing,
        isInitialFocusedCell,
        isLoading,
        isResizing,
        isRowSelected,
        isScrolling,
        isSelected,
        isWarningFlashing,
        loadingStateRenderer,
        mainBodyRef,
        nextIcon,
        onCellClick,
        onCellEdit,
        onColumnOrderChange,
        onColumnSelect,
        onHeaderEdit,
        onLoadMore,
        onRowGroupExpand,
        onSort,
        onTableHeaderDragEnd,
        pinnedLeftRef,
        pinnedRightRef,
        prevIcon,
        rowButtons,
        rowGrouping,
        rowHeight,
        rowIdAccessor,
        rowStateMap,
        rows: localRows,
        rowsWithSelectedCells,
        scrollbarWidth,
        selectColumns,
        selectableColumns,
        selectedColumns,
        selectedRowCount,
        selectedRows,
        selectedRowsData,
        setActiveHeaderDropdown,
        setCollapsedHeaders,
        setHeaders,
        setInitialFocusedCell,
        setIsResizing,
        setIsScrolling,
        setRowStateMap,
        setSelectedCells,
        setSelectedColumns,
        setSelectedRows,
        setUnexpandedRows,
        shouldPaginate,
        sortDownIcon,
        sortUpIcon,
        tableBodyContainerRef,
        tableEmptyStateRenderer,
        tableRows: currentTableRows,
        theme,
        unexpandedRows,
        useHoverRowBackground,
        useOddColumnBackground,
        useOddEvenRowBackground,
      }}
    >
      <div
        className={`simple-table-root st-wrapper theme-${theme} ${className ?? ""} ${
          columnBorders ? "st-column-borders" : ""
        }`}
        style={height ? { height } : {}}
      >
        <ScrollSync>
          <div className="st-wrapper-container">
            <div className="st-content-wrapper">
              <TableContent
                pinnedLeftWidth={pinnedLeftWidth}
                pinnedRightWidth={pinnedRightWidth}
                setScrollTop={setScrollTop}
                setScrollDirection={setScrollDirection}
                shouldShowEmptyState={shouldShowEmptyState}
                sort={sort}
                tableRows={currentTableRows}
                rowsToRender={rowsToRender}
              />
              <TableColumnEditor
                columnEditorText={columnEditorText}
                editColumns={editColumns}
                editColumnsInitOpen={editColumnsInitOpen}
                headers={headers}
                position={columnEditorPosition}
              />
            </div>
            {!shouldShowEmptyState && (
              <TableHorizontalScrollbar
                mainBodyRef={mainBodyRef}
                mainBodyWidth={mainBodyWidth}
                pinnedLeftWidth={pinnedLeftWidth}
                pinnedRightWidth={pinnedRightWidth}
                pinnedLeftContentWidth={pinnedLeftContentWidth}
                pinnedRightContentWidth={pinnedRightContentWidth}
                tableBodyContainerRef={tableBodyContainerRef}
              />
            )}
            {!shouldShowEmptyState && (
              <TableFooter
                currentPage={currentPage}
                footerRenderer={footerRenderer}
                hideFooter={hideFooter}
                onPageChange={setCurrentPage}
                onNextPage={onNextPage}
                onUserPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                shouldPaginate={shouldPaginate}
                totalPages={Math.ceil((totalRowCount ?? flattenedRows.length) / rowsPerPage)}
                totalRows={totalRowCount ?? flattenedRows.length}
              />
            )}
          </div>
        </ScrollSync>
      </div>
    </TableProvider>
  );
};

export default SimpleTable;
