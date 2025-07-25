import {
  useState,
  useRef,
  useEffect,
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
import { TableProvider, CellRegistryEntry } from "../../context/TableContext";
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

interface SimpleTableProps {
  allowAnimations?: boolean; // Flag for allowing animations
  cellUpdateFlash?: boolean; // Flag for flash animation after cell update
  className?: string; // Class name for the table
  columnEditorPosition?: ColumnEditorPosition;
  columnEditorText?: string; // Text for the column editor
  columnReordering?: boolean; // Flag for column reordering
  columnResizing?: boolean; // Flag for column resizing
  defaultHeaders: HeaderObject[]; // Default headers
  editColumns?: boolean; // Flag for column editing
  editColumnsInitOpen?: boolean; // Flag for opening the column editor when the table is loaded
  enableRowSelection?: boolean; // Flag for enabling row selection with checkboxes
  expandAll?: boolean; // Flag for expanding all rows by default
  expandIcon?: ReactNode; // Icon for expandable rows (will rotate on expand/collapse)
  externalFilterHandling?: boolean; // Flag to let consumer handle filter logic completely
  externalSortHandling?: boolean; // Flag to let consumer handle sort logic completely
  height?: string; // Height of the table
  hideFooter?: boolean; // Flag for hiding the footer
  nextIcon?: ReactNode; // Next icon
  onCellEdit?: (props: CellChangeProps) => void;
  onCellClick?: (props: CellClickProps) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onFilterChange?: (filters: TableFilterState) => void; // Callback when filter is applied
  onGridReady?: () => void; // Custom handler for when the grid is ready
  onLoadMore?: () => void; // Callback when user scrolls near bottom to load more data
  onNextPage?: OnNextPage; // Custom handler for next page
  onRowSelectionChange?: (props: RowSelectionChangeProps) => void; // Callback when row selection changes
  onSortChange?: (sort: SortColumn | null) => void; // Callback when sort is applied
  prevIcon?: ReactNode; // Previous icon
  rowGrouping?: Accessor[]; // Array of property names that define row grouping hierarchy
  rowHeight?: number; // Height of each row
  rowIdAccessor: Accessor; // Property name to use as row ID (defaults to index-based ID)
  rows: Row[]; // Rows data
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
  columnEditorPosition = "right",
  columnEditorText = "Columns",
  columnReordering = false,
  columnResizing = false,
  defaultHeaders,
  editColumns = false,
  editColumnsInitOpen = false,
  enableRowSelection = false,
  expandAll = true,
  expandIcon = <AngleRightIcon className="st-expand-icon" />,
  externalFilterHandling = false,
  externalSortHandling = false,
  height,
  hideFooter = false,
  nextIcon = <AngleRightIcon className="st-next-prev-icon" />,
  onCellEdit,
  onCellClick,
  onColumnOrderChange,
  onFilterChange,
  onGridReady,
  onLoadMore,
  onNextPage,
  onRowSelectionChange,
  onSortChange,
  prevIcon = <AngleLeftIcon className="st-next-prev-icon" />,
  rowGrouping,
  rowHeight = 32,
  rowIdAccessor,
  rows,
  rowsPerPage = 10,
  selectableCells = false,
  selectableColumns = false,
  shouldPaginate = false,
  sortDownIcon = <DescIcon className="st-header-icon" />,
  sortUpIcon = <AscIcon className="st-header-icon" />,
  tableRef,
  theme = "light",
  useHoverRowBackground = true,
  useOddEvenRowBackground = true,
  useOddColumnBackground = false,
}: SimpleTableProps) => {
  if (useOddColumnBackground) useOddEvenRowBackground = false;

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
    if (!enableRowSelection || headers?.[0]?.isSelectionColumn) return headers;

    const selectionHeader = createSelectionHeader();
    return [selectionHeader, ...headers];
  }, [enableRowSelection, headers]);

  const [scrollTop, setScrollTop] = useState<number>(0);
  const [unexpandedRows, setUnexpandedRows] = useState<Set<string>>(new Set());

  // Apply aggregation to current rows
  const { scrollbarWidth, setScrollbarWidth } = useScrollbarWidth({ tableBodyContainerRef });

  // Calculate the width of the sections
  const { mainBodyWidth, pinnedLeftWidth, pinnedRightWidth } = useMemo(() => {
    const { mainWidth, leftWidth, rightWidth } = recalculateAllSectionWidths({
      headers: effectiveHeaders,
    });
    return { mainBodyWidth: mainWidth, pinnedLeftWidth: leftWidth, pinnedRightWidth: rightWidth };
  }, [effectiveHeaders]);

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
  } = useSelection({
    selectableCells,
    headers,
    tableRows: currentTableRows,
    rowIdAccessor,
    onCellEdit,
    cellRegistry: cellRegistryRef.current,
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
  });
  useWindowResize({
    forceUpdate,
    tableBodyContainerRef,
    setScrollbarWidth,
  });
  useOnGridReady({ onGridReady });
  useTableAPI({ cellRegistryRef, rowIdAccessor, rows, tableRef });
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
        columnReordering,
        columnResizing,
        draggedHeaderRef,
        editColumns,
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
        headerContainerRef,
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
        onLoadMore,
        onSort,
        onTableHeaderDragEnd,
        pinnedLeftRef,
        pinnedRightRef,
        prevIcon,
        rowGrouping,
        rowHeight,
        rowIdAccessor,
        scrollbarWidth,
        selectColumns,
        selectableColumns,
        selectedRows,
        selectedRowCount,
        selectedRowsData,
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
      }}
    >
      <div
        className={`simple-table-root st-wrapper theme-${theme} ${className ?? ""}`}
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
              tableBodyContainerRef={tableBodyContainerRef}
            />
            <TableFooter
              currentPage={currentPage}
              hideFooter={hideFooter}
              onPageChange={setCurrentPage}
              onNextPage={onNextPage}
              shouldPaginate={shouldPaginate}
              totalPages={Math.ceil(sortedRows.length / rowsPerPage)}
            />
          </div>
        </ScrollSync>
      </div>
    </TableProvider>
  );
};

export default SimpleTable;
