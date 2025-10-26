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
import AngleLeftIcon from "../../icons/AngleLeftIcon";
import AngleRightIcon from "../../icons/AngleRightIcon";
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
import "../../styles/simple-table.css";
import DescIcon from "../../icons/DescIcon";
import AscIcon from "../../icons/AscIcon";
import { ScrollSync } from "../scroll-sync/ScrollSync";
import FilterBar from "../filters/FilterBar";
import useFilterableData from "../../hooks/useFilterableData";
import { useContentHeight } from "../../hooks/useContentHeight";
import useHandleOutsideClick from "../../hooks/useHandleOutsideClick";
import useWindowResize from "../../hooks/useWindowResize";
import { FilterCondition, TableFilterState } from "../../types/FilterTypes";
import { recalculateAllSectionWidths } from "../../utils/resizeUtils";
import { useAggregatedRows } from "../../hooks/useAggregatedRows";
import { getResponsiveMaxPinnedPercent } from "../../consts/general-consts";
import SortColumn from "../../types/SortColumn";
import useExternalFilters from "../../hooks/useExternalFilters";
import useExternalSort from "../../hooks/useExternalSort";
import useScrollbarWidth from "../../hooks/useScrollbarWidth";
import useOnGridReady from "../../hooks/useOnGridReady";
import useTableAPI from "../../hooks/useTableAPI";
import useTableRowProcessing from "../../hooks/useTableRowProcessing";
import { useRowSelection } from "../../hooks/useRowSelection";
import { createSelectionHeader } from "../../utils/rowSelectionUtils";
import RowSelectionChangeProps from "../../types/RowSelectionChangeProps";
import CellClickProps from "../../types/CellClickProps";
import { RowButton } from "../../types/RowButton";
import { HeaderDropdown } from "../../types/HeaderDropdownProps";
import FooterRendererProps from "../../types/FooterRendererProps";

interface SimpleTableProps {
  allowAnimations?: boolean; // Flag for allowing animations
  cellUpdateFlash?: boolean; // Flag for flash animation after cell update
  className?: string; // Class name for the table
  columnBorders?: boolean; // Flag for showing column borders
  columnEditorPosition?: ColumnEditorPosition;
  columnEditorText?: string; // Text for the column editor
  columnReordering?: boolean; // Flag for column reordering
  columnResizing?: boolean; // Flag for column resizing
  defaultHeaders: HeaderObject[]; // Default headers
  editColumns?: boolean; // Flag for column editing
  editColumnsInitOpen?: boolean; // Flag for opening the column editor when the table is loaded
  enableHeaderEditing?: boolean; // Flag for enabling header label editing when clicking already active headers
  enableRowSelection?: boolean; // Flag for enabling row selection with checkboxes
  expandAll?: boolean; // Flag for expanding all rows by default
  expandIcon?: ReactNode; // Icon for expanded state (used in expandable rows)
  externalFilterHandling?: boolean; // Flag to let consumer handle filter logic completely
  externalSortHandling?: boolean; // Flag to let consumer handle sort logic completely
  footerRenderer?: (props: FooterRendererProps) => ReactNode; // Custom footer renderer
  headerCollapseIcon?: ReactNode; // Icon for collapsed column headers
  headerExpandIcon?: ReactNode; // Icon for expanded column headers
  headerDropdown?: HeaderDropdown; // Custom dropdown component for headers
  headerHeight?: number; // Height of the header
  height?: string | number; // Height of the table
  hideFooter?: boolean; // Flag for hiding the footer
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
  shouldPaginate?: boolean; // Flag for pagination
  sortDownIcon?: ReactNode; // Sort down icon
  sortUpIcon?: ReactNode; // Sort up icon
  tableRef?: MutableRefObject<TableRefType | null>;
  theme?: Theme; // Theme
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
  cellUpdateFlash = false,
  className,
  columnBorders = false,
  columnEditorPosition = "right",
  columnEditorText = "Columns",
  columnReordering = false,
  columnResizing = false,
  defaultHeaders,
  editColumns = false,
  editColumnsInitOpen = false,
  enableHeaderEditing = false,
  enableRowSelection = false,
  expandAll = true,
  expandIcon = <AngleRightIcon className="st-expand-icon" />,
  externalFilterHandling = false,
  externalSortHandling = false,
  footerRenderer,
  headerCollapseIcon = <AngleRightIcon className="st-header-icon" />,
  headerExpandIcon = <AngleLeftIcon className="st-header-icon" />,
  headerDropdown,
  headerHeight,
  height,
  hideFooter = false,
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
  onRowSelectionChange,
  onSortChange,
  prevIcon = <AngleLeftIcon className="st-next-prev-icon" />,
  rowButtons,
  rowGrouping,
  rowHeight = 32,
  rowIdAccessor,
  rows,
  selectionColumnWidth = 42,
  rowsPerPage = 10,
  selectableCells = false,
  selectableColumns = false,
  shouldPaginate = false,
  sortDownIcon = <DescIcon className="st-header-icon" />,
  sortUpIcon = <AscIcon className="st-header-icon" />,
  tableRef,
  theme = "light",
  useHoverRowBackground = true,
  useOddEvenRowBackground = false,
  useOddColumnBackground = false,
}: SimpleTableProps) => {
  if (useOddColumnBackground) useOddEvenRowBackground = false;
  // Disable hover row background when column borders are enabled to prevent visual conflicts
  if (columnBorders) useHoverRowBackground = false;

  // Force update function - needed early for header updates
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // Refs
  const draggedHeaderRef = useRef<HeaderObject | null>(null);
  const hoveredHeaderRef = useRef<HeaderObject | null>(null);

  const mainBodyRef = useRef<HTMLDivElement>(null);
  const pinnedLeftRef = useRef<HTMLDivElement>(null);
  const pinnedRightRef = useRef<HTMLDivElement>(null);
  const tableBodyContainerRef = useRef<HTMLDivElement>(null);
  const headerContainerRef = useRef<HTMLDivElement>(null);

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [headers, setHeaders] = useState(defaultHeaders);
  const [isResizing, setIsResizing] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeHeaderDropdown, setActiveHeaderDropdown] = useState<HeaderObject | null>(null);
  const [collapsedHeaders, setCollapsedHeaders] = useState<Set<Accessor>>(new Set());

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
    rows,
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
  const [unexpandedRows, setUnexpandedRows] = useState<Set<string>>(new Set());

  // Apply aggregation to current rows
  const { scrollbarWidth, setScrollbarWidth } = useScrollbarWidth({ tableBodyContainerRef });

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
  const contentHeight = useContentHeight({ height, rowHeight });

  const aggregatedRows = useAggregatedRows({
    rows,
    headers,
    rowGrouping,
  });

  // Use filter hook
  const {
    filters,
    filteredRows,
    updateFilter: internalHandleApplyFilter,
    clearFilter: handleClearFilter,
    clearAllFilters: handleClearAllFilters,
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
  });

  // Process rows through pagination, grouping, and virtualization
  const {
    currentTableRows,
    rowsToRender,
    prepareForFilterChange,
    prepareForSortChange,
    isAnimating,
  } = useTableRowProcessing({
    allowAnimations,
    sortedRows,
    originalRows: aggregatedRows,
    currentPage,
    rowsPerPage,
    shouldPaginate,
    rowGrouping,
    rowIdAccessor,
    unexpandedRows,
    expandAll,
    contentHeight,
    rowHeight,
    scrollTop,
    computeFilteredRowsPreview,
    computeSortedRowsPreview,
  });

  // Create a registry for cells to enable direct updates
  const cellRegistryRef = useRef<Map<string, CellRegistryEntry>>(new Map());

  // Create a registry for header cells to enable direct updates (like editing)
  const headerRegistryRef = useRef<Map<string, HeaderRegistryEntry>>(new Map());
  const {
    getBorderClass,
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
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
    currentTableRows: currentTableRows,
    headerRegistryRef,
    headers: effectiveHeaders,
    rowIdAccessor,
    rows,
    tableRef,
    visibleRows: rowsToRender,
  });
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
        internalHandleApplyFilter(filter);
      }, 0);
    },
    [prepareForFilterChange, internalHandleApplyFilter]
  );

  return (
    <TableProvider
      value={{
        allowAnimations,
        areAllRowsSelected,
        cellRegistry: cellRegistryRef.current,
        cellUpdateFlash,
        clearSelection,
        collapsedHeaders,
        columnBorders,
        columnReordering,
        columnResizing,
        draggedHeaderRef,
        editColumns,
        enableHeaderEditing,
        enableRowSelection,
        expandIcon,
        filters,
        forceUpdate,
        getBorderClass,
        handleApplyFilter,
        handleClearAllFilters,
        handleClearFilter,
        handleMouseDown,
        handleMouseOver,
        handleRowSelect,
        handleSelectAll,
        handleToggleRow,
        headerCollapseIcon,
        headerContainerRef,
        headerDropdown,
        headerExpandIcon,
        headerRegistry: headerRegistryRef.current,
        headers: effectiveHeaders,
        hoveredHeaderRef,
        isAnimating,
        isCopyFlashing,
        isInitialFocusedCell,
        isResizing,
        isRowSelected,
        isScrolling,
        isSelected,
        isWarningFlashing,
        mainBodyRef,
        nextIcon,
        onCellEdit,
        onCellClick,
        onColumnOrderChange,
        onColumnSelect,
        onLoadMore,
        onSort,
        onTableHeaderDragEnd,
        pinnedLeftRef,
        pinnedRightRef,
        prevIcon,
        rowButtons,
        rowGrouping,
        rowHeight,
        headerHeight: headerHeight ?? rowHeight,
        rowIdAccessor,
        scrollbarWidth,
        selectColumns,
        selectableColumns,
        selectedColumns,
        columnsWithSelectedCells,
        rowsWithSelectedCells,
        selectedRows,
        selectedRowCount,
        selectedRowsData,
        setCollapsedHeaders,
        setHeaders,
        setInitialFocusedCell,
        setIsResizing,
        setIsScrolling,
        setSelectedCells,
        setSelectedColumns,
        setSelectedRows,
        setUnexpandedRows,
        shouldPaginate,
        sortDownIcon,
        sortUpIcon,
        tableBodyContainerRef,
        tableRows: currentTableRows,
        theme,
        unexpandedRows,
        useHoverRowBackground,
        useOddColumnBackground,
        useOddEvenRowBackground,
        activeHeaderDropdown,
        setActiveHeaderDropdown,
        onHeaderEdit,
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
            <FilterBar />
            <div
              className="st-content-wrapper"
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <TableContent
                pinnedLeftWidth={pinnedLeftWidth}
                pinnedRightWidth={pinnedRightWidth}
                setScrollTop={setScrollTop}
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
            <TableHorizontalScrollbar
              mainBodyRef={mainBodyRef}
              mainBodyWidth={mainBodyWidth}
              pinnedLeftWidth={pinnedLeftWidth}
              pinnedRightWidth={pinnedRightWidth}
              pinnedLeftContentWidth={pinnedLeftContentWidth}
              pinnedRightContentWidth={pinnedRightContentWidth}
              tableBodyContainerRef={tableBodyContainerRef}
            />
            <TableFooter
              currentPage={currentPage}
              footerRenderer={footerRenderer}
              hideFooter={hideFooter}
              onPageChange={setCurrentPage}
              onNextPage={onNextPage}
              rowsPerPage={rowsPerPage}
              shouldPaginate={shouldPaginate}
              totalPages={Math.ceil(sortedRows.length / rowsPerPage)}
              totalRows={sortedRows.length}
            />
          </div>
        </ScrollSync>
      </div>
    </TableProvider>
  );
};

export default SimpleTable;
