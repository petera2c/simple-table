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
import AngleDownIcon from "../../icons/AngleDownIcon";
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
import UpdateCellProps from "../../types/UpdateCellProps";

interface SimpleTableProps {
  allowAnimations?: boolean; // Flag for allowing animations
  cellUpdateFlash?: boolean; // Flag for flash animation after cell update
  collapseIcon?: ReactNode; // Collapse icon
  columnEditorPosition?: ColumnEditorPosition;
  columnEditorText?: string; // Text for the column editor
  columnReordering?: boolean; // Flag for column reordering
  columnResizing?: boolean; // Flag for column resizing
  defaultHeaders: HeaderObject[]; // Default headers
  editColumns?: boolean; // Flag for column editing
  editColumnsInitOpen?: boolean; // Flag for opening the column editor when the table is loaded
  expandIcon?: ReactNode; // Expand icon
  height?: string; // Height of the table
  hideFooter?: boolean; // Flag for hiding the footer
  nextIcon?: ReactNode; // Next icon
  onCellEdit?: (props: CellChangeProps) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onGridReady?: () => void; // Custom handler for when the grid is ready
  onNextPage?: OnNextPage; // Custom handler for next page
  prevIcon?: ReactNode; // Previous icon
  rowHeight?: number; // Height of each row
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
  collapseIcon = <AngleDownIcon className="st-expand-icon" />,
  columnEditorPosition = "right",
  columnEditorText = "Columns",
  columnReordering = false,
  columnResizing = false,
  defaultHeaders,
  editColumns = false,
  editColumnsInitOpen = false,
  expandIcon = <AngleRightIcon className="st-expand-icon" />,
  height,
  hideFooter = false,
  nextIcon = <AngleRightIcon className="st-next-prev-icon" />,
  onCellEdit,
  onColumnOrderChange,
  onGridReady,
  onNextPage,
  prevIcon = <AngleLeftIcon className="st-next-prev-icon" />,
  rowHeight = 40,
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
  // Refs
  const draggedHeaderRef = useRef<HeaderObject | null>(null);
  const headersRef = useRef(defaultHeaders);
  const hoveredHeaderRef = useRef<HeaderObject | null>(null);
  const mainBodyRef = useRef<HTMLDivElement>(null);
  const pinnedLeftRef = useRef<HTMLDivElement>(null);
  const pinnedRightRef = useRef<HTMLDivElement>(null);
  const tableBodyContainerRef = useRef<HTMLDivElement>(null);

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [isWidthDragging, setIsWidthDragging] = useState(false);
  const [mainBodyWidth, setMainBodyWidth] = useState(0);
  const [pinnedLeftWidth, setPinnedLeftWidth] = useState(0);
  const [pinnedRightWidth, setPinnedRightWidth] = useState(0);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  // Use filter hook
  const { filters, filteredRows, handleApplyFilter, handleClearFilter, handleClearAllFilters } =
    useTableFilters({ rows });

  // Use custom hook for sorting (now operates on filtered rows)
  const { sort, sortedRows, hiddenColumns, setHiddenColumns, updateSort } = useSortableData({
    headers: headersRef.current,
    tableRows: filteredRows,
  });

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

  const [flattenedRows, setFlattenedRows] = useState<Row[]>(currentRows);

  useEffect(() => {
    setFlattenedRows(currentRows);
  }, [currentRows]);

  // Calculate content height using hook
  const contentHeight = useContentHeight({ height, rowHeight });

  // We could probably move this to the table body component
  const visibleRows = useMemo(
    () =>
      getVisibleRows({
        bufferRowCount: BUFFER_ROW_COUNT,
        contentHeight,
        flattenedRows,
        rowHeight,
        scrollTop,
      }),
    [contentHeight, rowHeight, flattenedRows, scrollTop]
  );

  // Hooks
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const {
    getBorderClass,
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    isInitialFocusedCell,
    isSelected,
    selectColumns,
    selectedCells,
    selectedColumns,
    setInitialFocusedCell,
    setSelectedCells,
    setSelectedColumns,
  } = useSelection({
    selectableCells,
    headers: headersRef.current,
    visibleRows,
  });

  // Memoize handlers
  const onSort = useCallback(
    (columnIndex: number, accessor: string) => {
      updateSort(columnIndex, accessor);
    },
    [updateSort]
  );

  const onTableHeaderDragEnd = useCallback((newHeaders: HeaderObject[]) => {
    headersRef.current = newHeaders;
    forceUpdate();
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

  // Create a registry for cells to enable direct updates
  const cellRegistryRef = useRef<Map<string, CellRegistryEntry>>(new Map());

  const updateCell = useCallback(
    ({ rowIndex, accessor, newValue }: UpdateCellProps) => {
      rows[rowIndex].rowData[accessor] = newValue;
    },
    [rows]
  );

  // Set up API methods on the ref if provided
  useEffect(() => {
    if (tableRef) {
      tableRef.current = {
        updateData: ({ accessor, rowIndex, newValue }: UpdateDataProps) => {
          // Direct cell update through registry if cell is visible/registered
          const rowId = rows?.[rowIndex]?.rowMeta?.rowId;
          if (rowId !== undefined) {
            const key = getCellKey({ rowId, accessor });
            const cell = cellRegistryRef.current.get(key);
            if (cell) {
              // If the cell is registered (visible), update it directly
              cell.updateContent(newValue);
            }

            // Always update the data source
            if (rows?.[rowIndex]?.rowData?.[accessor] !== undefined) {
              rows[rowIndex].rowData[accessor] = newValue;
            }
          }
        },
      };
    }
  }, [tableRef, rows]);

  return (
    <TableProvider
      value={{
        allowAnimations,
        cellRegistry: cellRegistryRef.current,
        cellUpdateFlash,
        collapseIcon,
        columnReordering,
        columnResizing,
        draggedHeaderRef,
        editColumns,
        expandIcon,
        filters,
        forceUpdate,
        getBorderClass,
        handleApplyFilter,
        handleClearFilter,
        handleClearAllFilters,
        handleMouseDown,
        handleMouseOver,
        headersRef,
        hiddenColumns,
        hoveredHeaderRef,
        isInitialFocusedCell,
        isSelected,
        mainBodyRef,
        nextIcon,
        onCellEdit,
        onColumnOrderChange,
        onSort,
        onTableHeaderDragEnd,
        pinnedLeftRef,
        pinnedRightRef,
        prevIcon,
        rowHeight,
        scrollbarWidth,
        selectColumns,
        selectableColumns,
        setInitialFocusedCell,
        setIsWidthDragging,
        setMainBodyWidth,
        setPinnedLeftWidth,
        setPinnedRightWidth,
        setSelectedCells,
        setSelectedColumns,
        shouldPaginate,
        sortDownIcon,
        sortUpIcon,
        tableBodyContainerRef,
        theme,
        updateCell,
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
                flattenedRows={flattenedRows}
                isWidthDragging={isWidthDragging}
                pinnedLeftWidth={pinnedLeftWidth}
                pinnedRightWidth={pinnedRightWidth}
                setFlattenedRows={setFlattenedRows}
                setScrollTop={setScrollTop}
                sort={sort}
                visibleRows={visibleRows}
              />
              <TableColumnEditor
                columnEditorText={columnEditorText}
                editColumns={editColumns}
                editColumnsInitOpen={editColumnsInitOpen}
                headers={headersRef.current}
                hiddenColumns={hiddenColumns}
                position={columnEditorPosition}
                setHiddenColumns={setHiddenColumns}
              />
            </div>
            <TableHorizontalScrollbar
              mainBodyRef={mainBodyRef}
              mainBodyWidth={mainBodyWidth}
              pinnedLeftWidth={pinnedLeftWidth}
              pinnedRightWidth={pinnedRightWidth}
              setMainBodyWidth={setMainBodyWidth}
              tableBodyContainerRef={tableBodyContainerRef}
            />
            <TableFooter
              currentPage={currentPage}
              hideFooter={hideFooter}
              onPageChange={setCurrentPage}
              onNextPage={onNextPage}
              shouldPaginate={shouldPaginate}
              totalPages={Math.ceil(filteredRows.length / rowsPerPage)}
            />
          </div>
        </ScrollSync>
      </div>
    </TableProvider>
  );
};

export default SimpleTable;
