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
import AngleUpIcon from "../../icons/AngleUpIcon";
import AngleDownIcon from "../../icons/AngleDownIcon";
import "../../styles/simple-table.css";
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

// Add this at the top of the file, after imports
const isBrowser = typeof window !== "undefined";

// Create enum for consistent values

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
  onNextPage?: (page: number) => void; // Custom handler for next page
  onPreviousPage?: (page: number) => void; // Custom handler for previous page
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
  totalPages?: number; // Total pages
}

// Create a client-side only wrapper component
const ClientOnlySimpleTable = (props: SimpleTableProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading placeholder
  }

  return <SimpleTableImpl {...props} />;
};

// Rename the existing SimpleTable to SimpleTableImpl
const SimpleTableImpl = ({
  allowAnimations = false,
  cellUpdateFlash = false,
  collapseIcon = <AngleDownIcon className="st-sort-icon" />,
  columnEditorPosition = "right",
  columnEditorText = "Columns",
  columnReordering = false,
  columnResizing = false,
  defaultHeaders,
  editColumns = false,
  editColumnsInitOpen = false,
  expandIcon = <AngleRightIcon className="st-sort-icon" />,
  height,
  hideFooter = false,
  nextIcon = <AngleRightIcon className="st-next-prev-icon" />,
  onCellEdit,
  onColumnOrderChange,
  onNextPage,
  onPreviousPage,
  prevIcon = <AngleLeftIcon className="st-next-prev-icon" />,
  rowHeight = 40,
  rows,
  rowsPerPage = 10,
  selectableCells = false,
  selectableColumns = false,
  shouldPaginate = false,
  sortDownIcon = <AngleDownIcon className="st-sort-icon" />,
  sortUpIcon = <AngleUpIcon className="st-sort-icon" />,
  tableRef,
  theme = "light",
  totalPages,
}: SimpleTableProps) => {
  // Refs
  const draggedHeaderRef = useRef<HeaderObject | null>(null);
  const headersRef = useRef(defaultHeaders);
  const hoveredHeaderRef = useRef<HeaderObject | null>(null);
  const mainBodyRef = useRef<HTMLDivElement>(null);
  const pinnedLeftRef = useRef<HTMLDivElement>(null);
  const pinnedRightRef = useRef<HTMLDivElement>(null);
  const tableBodyContainerRef = useRef<HTMLDivElement>(null);

  // Local state
  const [isWidthDragging, setIsWidthDragging] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [tableContentWidth, setTableContentWidth] = useState(0);
  const [scrollTop, setScrollTop] = useState<number>(0);

  // Use custom hook for sorting
  const { sort, sortedRows, hiddenColumns, setHiddenColumns, updateSort } = useSortableData({
    headers: headersRef.current,
    tableRows: rows,
  });

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

  // Calculate content height (total height minus header height)
  const contentHeight = useMemo(() => {
    // Default height if none provided
    if (!height) return window.innerHeight - rowHeight;

    // Get the container element for measurement
    const container = document.querySelector(".simple-table-root");

    // Convert height string to pixels
    let totalHeightPx = 0;

    if (height.endsWith("px")) {
      // Direct pixel value
      totalHeightPx = parseInt(height, 10);
    } else if (height.endsWith("vh")) {
      // Viewport height percentage
      const vh = parseInt(height, 10);
      totalHeightPx = (window.innerHeight * vh) / 100;
    } else if (height.endsWith("%")) {
      // Percentage of parent
      const percentage = parseInt(height, 10);
      const parentHeight = container?.parentElement?.clientHeight || window.innerHeight;
      totalHeightPx = (parentHeight * percentage) / 100;
    } else {
      // Fall back to inner height if format is unknown
      totalHeightPx = window.innerHeight;
    }

    // Subtract header height
    return Math.max(0, totalHeightPx - rowHeight);
  }, [height, rowHeight]);

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
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    isSelected,
    getBorderClass,
    isInitialFocusedCell,
    setSelectedCells,
    setSelectedColumns,
    selectColumns,
    setInitialFocusedCell,
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
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".st-cell") &&
        (selectableColumns
          ? !target.classList.contains("st-header-cell") &&
            !target.classList.contains("st-header-label")
          : true)
      ) {
        setSelectedCells(new Set());
        if (selectableColumns) {
          setSelectedColumns(new Set());
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectableColumns, setSelectedCells, setSelectedColumns]);

  // Calculate the width of the scrollbar
  useLayoutEffect(() => {
    if (!tableBodyContainerRef.current) return;

    const newScrollbarWidth =
      tableBodyContainerRef.current.offsetWidth - tableBodyContainerRef.current.clientWidth;
    const newTableContentWidth = tableBodyContainerRef.current.clientWidth;

    setScrollbarWidth(newScrollbarWidth);
    setTableContentWidth(newTableContentWidth);
  }, []);

  // On window risize completely re-render the table
  useLayoutEffect(() => {
    const handleResize = () => {
      // Force a re-render of the table
      forceUpdate();
      // Re-calculate the width of the scrollbar and table content
      if (!tableBodyContainerRef.current) return;

      const newScrollbarWidth =
        tableBodyContainerRef.current.offsetWidth - tableBodyContainerRef.current.clientWidth;
      const newTableContentWidth = tableBodyContainerRef.current.clientWidth;

      setScrollbarWidth(newScrollbarWidth);
      setTableContentWidth(newTableContentWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Create a registry for cells to enable direct updates
  const cellRegistryRef = useRef<Map<string, CellRegistryEntry>>(new Map());

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
        cellUpdateFlash,
        collapseIcon,
        columnReordering,
        columnResizing,
        draggedHeaderRef,
        editColumns,
        expandIcon,
        forceUpdate,
        getBorderClass,
        handleMouseDown,
        handleMouseOver,
        headersRef,
        hiddenColumns,
        hoveredHeaderRef,
        isInitialFocusedCell,
        isSelected,
        mainBodyRef,
        onCellEdit,
        onColumnOrderChange,
        onSort,
        onTableHeaderDragEnd,
        pinnedLeftRef,
        pinnedRightRef,
        rowHeight,
        scrollbarWidth,
        selectColumns,
        selectableColumns,
        setInitialFocusedCell,
        setIsWidthDragging,
        setSelectedCells,
        setSelectedColumns,
        shouldPaginate,
        sortDownIcon,
        sortUpIcon,
        tableBodyContainerRef,
        cellRegistry: cellRegistryRef.current,
      }}
    >
      <div
        className={`simple-table-root st-wrapper theme-${theme}`}
        style={height ? { height } : {}}
      >
        <div className="st-wrapper-container">
          <div
            className="st-content-wrapper"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <TableContent
              flattenedRows={flattenedRows}
              isWidthDragging={isWidthDragging}
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
            pinnedLeftRef={pinnedLeftRef}
            pinnedRightRef={pinnedRightRef}
            tableContentWidth={tableContentWidth}
          />
        </div>
        <TableFooter
          currentPage={currentPage}
          hideFooter={hideFooter}
          nextIcon={nextIcon}
          onPageChange={setCurrentPage}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          prevIcon={prevIcon}
          shouldPaginate={shouldPaginate}
          totalPages={totalPages || Math.ceil(sortedRows.length / rowsPerPage)}
        />
      </div>
    </TableProvider>
  );
};

// Export the client-only version as the default
export default ClientOnlySimpleTable;
// Export the implementation for testing purposes
export { SimpleTableImpl };
