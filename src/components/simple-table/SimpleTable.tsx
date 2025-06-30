import {
  useState,
  useRef,
  useEffect,
  useReducer,
  ReactNode,
  useMemo,
  useCallback,
  useLayoutEffect,
  RefObject,
} from "react";
import useSelection from "../../hooks/useSelection";
import HeaderObject from "../../types/HeaderObject";
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
import { BUFFER_ROW_COUNT } from "../../consts/general-consts";
import { getVisibleRows } from "../../utils/infiniteScrollUtils";
import { TableProvider, CellRegistryEntry } from "../../context/TableContext";
import ColumnEditorPosition from "../../types/ColumnEditorPosition";
import UpdateDataProps from "../../types/UpdateCellProps";
import TableRefType from "../../types/TableRefType";
import { getCellKey } from "../../utils/cellUtils";
import OnNextPage from "../../types/OnNextPage";
import "../../styles/simple-table.css";
import DescIcon from "../../icons/DescIcon";
import AscIcon from "../../icons/AscIcon";
import { ScrollSync } from "../scroll-sync/ScrollSync";
import FilterBar from "../filters/FilterBar";
import { useTableFilters } from "../../hooks/useTableFilters";
import { useContentHeight } from "../../hooks/useContentHeight";
import useHandleOutsideClick from "../../hooks/useHandleOutsideClick";
import useWindowResize from "../../hooks/useWindowResize";
import { getRowId, flattenRowsWithGrouping } from "../../utils/rowUtils";
import { FilterCondition, TableFilterState } from "../../types/FilterTypes";
import { recalculateAllSectionWidths } from "../../utils/resizeUtils";
import { useAggregatedRows } from "../../hooks/useAggregatedRows";
import SortConfig from "../../types/SortConfig";

interface SimpleTableProps {
  allowAnimations?: boolean; // Flag for allowing animations
  cellUpdateFlash?: boolean; // Flag for flash animation after cell update
  columnEditorPosition?: ColumnEditorPosition;
  columnEditorText?: string; // Text for the column editor
  columnReordering?: boolean; // Flag for column reordering
  columnResizing?: boolean; // Flag for column resizing
  defaultHeaders: HeaderObject[]; // Default headers
  editColumns?: boolean; // Flag for column editing
  editColumnsInitOpen?: boolean; // Flag for opening the column editor when the table is loaded
  expandAll?: boolean; // Flag for expanding all rows by default
  expandIcon?: ReactNode; // Icon for expandable rows (will rotate on expand/collapse)
  externalFilterHandling?: boolean; // Flag to let consumer handle filter logic completely
  externalSortHandling?: boolean; // Flag to let consumer handle sort logic completely
  height?: string; // Height of the table
  hideFooter?: boolean; // Flag for hiding the footer
  nextIcon?: ReactNode; // Next icon
  onCellEdit?: (props: CellChangeProps) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onFilterChange?: (filters: TableFilterState) => void; // Callback when filter is applied
  onGridReady?: () => void; // Custom handler for when the grid is ready
  onNextPage?: OnNextPage; // Custom handler for next page
  onSortChange?: (sort: SortConfig | null) => void; // Callback when sort is applied
  prevIcon?: ReactNode; // Previous icon
  rowGrouping?: string[]; // Array of property names that define row grouping hierarchy
  rowHeight?: number; // Height of each row
  rowIdAccessor: string; // Property name to use as row ID (defaults to index-based ID)
  rows: Row[]; // Rows data
  rowsPerPage?: number; // Rows per page
  selectableCells?: boolean; // Flag if can select cells
  selectableColumns?: boolean; // Flag for selectable column headers
  shouldPaginate?: boolean; // Flag for pagination
  sortDownIcon?: ReactNode; // Sort down icon
  sortUpIcon?: ReactNode; // Sort up icon
  tableRef?: RefObject<TableRefType | null>;
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
  columnEditorPosition = "right",
  columnEditorText = "Columns",
  columnReordering = false,
  columnResizing = false,
  defaultHeaders,
  editColumns = false,
  editColumnsInitOpen = false,
  expandAll = true,
  expandIcon = <AngleRightIcon className="st-expand-icon" />,
  externalFilterHandling = false,
  externalSortHandling = false,
  height,
  hideFooter = false,
  nextIcon = <AngleRightIcon className="st-next-prev-icon" />,
  onCellEdit,
  onColumnOrderChange,
  onFilterChange,
  onGridReady,
  onNextPage,
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

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [headers, setHeaders] = useState(defaultHeaders);

  // Update headers when defaultHeaders prop changes
  useEffect(() => {
    setHeaders(defaultHeaders);
  }, [defaultHeaders]);

  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [unexpandedRows, setUnexpandedRows] = useState<Set<string>>(new Set());

  // Apply aggregation to current rows
  const aggregatedRows = useAggregatedRows({
    rows,
    headers,
    rowGrouping,
  });

  // Use filter hook
  const {
    filters,
    filteredRows,
    handleApplyFilter: internalHandleApplyFilter,
    handleClearFilter,
    handleClearAllFilters,
  } = useTableFilters({ externalFilterHandling, rows: aggregatedRows });

  // Custom filter handler that respects external filter handling flag
  const handleApplyFilter = useCallback(
    (filter: FilterCondition) => {
      // Update internal state and call external handler if provided
      internalHandleApplyFilter(filter);
    },
    [internalHandleApplyFilter]
  );

  // Use custom hook for sorting (now operates on filtered rows)
  const { sort, sortedRows, updateSort } = useSortableData({
    headers,
    tableRows: filteredRows,
    externalSortHandling,
    onSortChange,
    rowGrouping,
  });

  useEffect(() => {
    onFilterChange?.(filters);
  }, [filters, onFilterChange]);

  useEffect(() => {
    onSortChange?.(sort);
  }, [sort, onSortChange]);

  // Calculate the width of the sections
  const { mainBodyWidth, pinnedLeftWidth, pinnedRightWidth } = useMemo(() => {
    const { mainWidth, leftWidth, rightWidth } = recalculateAllSectionWidths({
      headers,
    });
    return { mainBodyWidth: mainWidth, pinnedLeftWidth: leftWidth, pinnedRightWidth: rightWidth };
  }, [headers]);

  useEffect(() => {
    onGridReady?.();
  }, [onGridReady]);

  // Memoize currentRows calculation
  const currentRows = useMemo(() => {
    if (!shouldPaginate) return sortedRows;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const rows = sortedRows.slice(startIndex, endIndex);
    return rows;
  }, [currentPage, rowsPerPage, shouldPaginate, sortedRows]);

  // Flatten rows based on row grouping and expansion state - now includes ALL properties
  const tableRows = useMemo(() => {
    if (!rowGrouping || rowGrouping.length === 0) {
      // No grouping - just return flat structure with calculated positions
      return currentRows.map((row, index) => ({
        row,
        depth: 0,
        groupingKey: undefined,
        position: index,
        isLastGroupRow: false,
      }));
    }

    return flattenRowsWithGrouping({
      rows: currentRows,
      rowGrouping,
      rowIdAccessor,
      unexpandedRows,
      expandAll,
    });
  }, [currentRows, rowGrouping, rowIdAccessor, unexpandedRows, expandAll]);

  // Calculate content height using hook
  const contentHeight = useContentHeight({ height, rowHeight });

  // Visible rows
  const visibleRows = useMemo(
    () =>
      getVisibleRows({
        bufferRowCount: BUFFER_ROW_COUNT,
        contentHeight,
        tableRows,
        rowHeight,
        scrollTop,
      }),
    [contentHeight, rowHeight, tableRows, scrollTop]
  );

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
    tableRows,
    rowIdAccessor,
    onCellEdit,
    cellRegistry: cellRegistryRef.current,
  });

  // Memoize handlers
  const onSort = useCallback(
    (columnIndex: number, accessor: string) => {
      updateSort(columnIndex, accessor);
    },
    [updateSort]
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
  // Calculate the width of the scrollbar
  useLayoutEffect(() => {
    if (!tableBodyContainerRef.current) return;

    const newScrollbarWidth =
      tableBodyContainerRef.current.offsetWidth - tableBodyContainerRef.current.clientWidth;

    setScrollbarWidth(newScrollbarWidth);
  }, []);
  useWindowResize({
    forceUpdate,
    tableBodyContainerRef,
    setScrollbarWidth,
  });

  // Set up API methods on the ref if provided
  useEffect(() => {
    if (tableRef) {
      tableRef.current = {
        updateData: ({ accessor, rowIndex, newValue }: UpdateDataProps) => {
          // Get the row ID using the new utility
          const row = rows?.[rowIndex];
          if (row) {
            const rowId = getRowId(row, rowIndex, rowIdAccessor);
            const key = getCellKey({ rowId, accessor });
            const cell = cellRegistryRef.current.get(key);

            if (cell) {
              // If the cell is registered (visible), update it directly
              cell.updateContent(newValue);
            }

            // Always update the data source - now directly on the row
            if (row[accessor] !== undefined) {
              row[accessor] = newValue;
            }
          }
        },
      };
    }
  }, [tableRef, rows, rowIdAccessor]);

  return (
    <TableProvider
      value={{
        allowAnimations,
        cellRegistry: cellRegistryRef.current,
        cellUpdateFlash,
        columnReordering,
        columnResizing,
        draggedHeaderRef,
        editColumns,
        expandIcon,
        unexpandedRows,
        filters,
        tableRows,
        forceUpdate,
        getBorderClass,
        handleApplyFilter,
        handleClearFilter,
        handleClearAllFilters,
        handleMouseDown,
        handleMouseOver,
        headers,
        hoveredHeaderRef,
        isCopyFlashing,
        isInitialFocusedCell,
        isSelected,
        isWarningFlashing,
        mainBodyRef,
        nextIcon,
        onCellEdit,
        onColumnOrderChange,
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
        setUnexpandedRows,
        setHeaders,
        setInitialFocusedCell,
        setSelectedCells,
        setSelectedColumns,
        shouldPaginate,
        sortDownIcon,
        sortUpIcon,
        tableBodyContainerRef,
        theme,
        useHoverRowBackground,
        useOddColumnBackground,
        useOddEvenRowBackground,
      }}
    >
      <div
        className={`simple-table-root st-wrapper theme-${theme}`}
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
                tableRows={tableRows}
                pinnedLeftWidth={pinnedLeftWidth}
                pinnedRightWidth={pinnedRightWidth}
                setScrollTop={setScrollTop}
                sort={sort}
                visibleRows={visibleRows}
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
