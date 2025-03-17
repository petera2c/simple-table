import {
  useState,
  useRef,
  useEffect,
  useReducer,
  ReactNode,
  useMemo,
  useCallback,
  memo,
} from "react";
import useSelection from "../../hooks/useSelection";
import HeaderObject from "../../types/HeaderObject";
import TableFooter from "./TableFooter";
import AngleLeftIcon from "../../icons/AngleLeftIcon";
import AngleRightIcon from "../../icons/AngleRightIcon";
import CellChangeProps from "../../types/CellChangeProps";
import TableContext from "../../context/TableContext";
import AngleUpIcon from "../../icons/AngleUpIcon";
import AngleDownIcon from "../../icons/AngleDownIcon";
import TableColumnEditor from "./TableColumnEditor/TableColumnEditor";
import "../../styles/simple-table.css";
import Theme from "../../types/Theme";
import TableContent from "./TableContent";
import TableHorizontalScrollbar from "./TableHorizontalScrollbar";
import Row from "../../types/Row";
import useSortableData from "../../hooks/useSortableData";

// Create enum for consistent values
enum ColumnEditorPosition {
  Left = "left",
  Right = "right",
}

interface SimpleTableProps {
  allowAnimations?: boolean; // Flag for allowing animations
  columnEditorPosition?: ColumnEditorPosition;
  columnEditorText?: string; // Text for the column editor
  columnResizing?: boolean; // Flag for column resizing
  defaultHeaders: HeaderObject[]; // Default headers
  draggable?: boolean; // Flag for draggable
  editColumns?: boolean; // Flag for column editing
  editColumnsInitOpen?: boolean; // Flag for opening the column editor when the table is loaded
  height?: string; // Height of the table
  hideFooter?: boolean; // Flag for hiding the footer
  nextIcon?: ReactNode; // Next icon
  onCellChange?: ({
    accessor,
    newValue,
    originalRowIndex,
    row,
  }: CellChangeProps) => void;
  prevIcon?: ReactNode; // Previous icon
  rows: Row[]; // Rows data
  rowsPerPage?: number; // Rows per page
  selectableCells?: boolean; // Flag if can select cells
  selectableColumns?: boolean; // Flag for selectable column headers
  shouldPaginate?: boolean; // Flag for pagination
  sortDownIcon?: ReactNode; // Sort down icon
  sortUpIcon?: ReactNode; // Sort up icon
  theme?: Theme; // Theme
}

const SimpleTable = ({
  allowAnimations = false,
  columnEditorPosition = ColumnEditorPosition.Right,
  columnEditorText = "Columns",
  columnResizing = false,
  defaultHeaders,
  draggable = false,
  editColumns = false,
  editColumnsInitOpen = false,
  height,
  hideFooter = false,
  nextIcon = <AngleRightIcon className="st-next-prev-icon" />,
  onCellChange,
  prevIcon = <AngleLeftIcon className="st-next-prev-icon" />,
  rows,
  rowsPerPage = 10,
  selectableCells = false,
  selectableColumns = false,
  shouldPaginate = false,
  sortDownIcon = <AngleDownIcon className="st-sort-icon" />,
  sortUpIcon = <AngleUpIcon className="st-sort-icon" />,
  theme = "light",
}: SimpleTableProps) => {
  // State for tracking expanded rows
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(new Set());

  // Initialize originalRowIndex on each row
  const tableRows = useMemo(() => {
    const rowsWithOriginalRowIndex = rows.map((row, index) => ({
      ...row,
      originalRowIndex: index,
    }));
    return rowsWithOriginalRowIndex;
  }, [rows]);

  // Refs
  const tableRef = useRef<HTMLDivElement>(null);
  const draggedHeaderRef = useRef<HeaderObject | null>(null);
  const hoveredHeaderRef = useRef<HeaderObject | null>(null);
  const pinnedLeftRef = useRef<HTMLDivElement>(null);
  const pinnedRightRef = useRef<HTMLDivElement>(null);
  const headersRef = useRef(defaultHeaders);

  // Local state
  const [isWidthDragging, setIsWidthDragging] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Use custom hook for sorting
  const { sort, setSort, sortedRows, hiddenColumns, setHiddenColumns } =
    useSortableData(tableRows, headersRef.current);

  // Expand/collapse handler
  const onExpandRowClick = useCallback(
    (rowId: string | number) => {
      rowId = String(rowId);
      setExpandedRowIds((prev) => {
        const next = new Set(prev);
        if (next.has(rowId)) {
          next.delete(rowId);
        } else {
          next.add(rowId);
        }
        return next;
      });
    },
    [sortedRows]
  );

  // Memoized function to check if a row is expanded
  const isRowExpanded = useCallback(
    (rowId: string | number) => {
      return expandedRowIds.has(String(rowId));
    },
    [expandedRowIds]
  );

  // Hooks
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const {
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    isSelected,
    getBorderClass,
    isTopLeftCell,
    setSelectedCells,
  } = useSelection({
    selectableCells,
    headers: headersRef.current,
    rows: sortedRows,
  });

  // Memoize currentRows calculation
  const currentRows = useMemo(() => {
    if (!shouldPaginate) return sortedRows;
    return sortedRows.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [currentPage, rowsPerPage, shouldPaginate, sortedRows]);

  // Memoize handlers
  const onSort = useCallback(
    (columnIndex: number, accessor: string) => {
      setSort((prevSort) => {
        if (prevSort?.key.accessor !== accessor) {
          return {
            key: headersRef.current[columnIndex],
            direction: "ascending",
          };
        } else if (prevSort?.direction === "ascending") {
          return {
            key: headersRef.current[columnIndex],
            direction: "descending",
          };
        }
        return null;
      });
    },
    [setSort]
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
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectableColumns, setSelectedCells]);

  return (
    <TableContext.Provider value={{ rows, tableRows }}>
      <div
        className={`st-wrapper theme-${theme}`}
        style={height ? { height } : {}}
      >
        <div className="st-table-wrapper-container">
          <div
            className="st-table-wrapper"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <TableContent
              allowAnimations={allowAnimations}
              columnResizing={columnResizing}
              currentRows={currentRows}
              draggable={draggable}
              draggedHeaderRef={draggedHeaderRef}
              editColumns={editColumns}
              forceUpdate={forceUpdate}
              getBorderClass={getBorderClass}
              handleMouseDown={handleMouseDown}
              handleMouseOver={handleMouseOver}
              headers={headersRef.current}
              headersRef={headersRef}
              hiddenColumns={hiddenColumns}
              hoveredHeaderRef={hoveredHeaderRef}
              isRowExpanded={isRowExpanded}
              isSelected={isSelected}
              isTopLeftCell={isTopLeftCell}
              isWidthDragging={isWidthDragging}
              onCellChange={onCellChange}
              onExpandRowClick={onExpandRowClick}
              onSort={onSort}
              onTableHeaderDragEnd={onTableHeaderDragEnd}
              pinnedLeftRef={pinnedLeftRef}
              pinnedRightRef={pinnedRightRef}
              selectableColumns={selectableColumns}
              setIsWidthDragging={setIsWidthDragging}
              setSelectedCells={setSelectedCells}
              shouldPaginate={shouldPaginate}
              sort={sort}
              sortDownIcon={sortDownIcon}
              sortUpIcon={sortUpIcon}
              tableRef={tableRef}
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
            headersRef={headersRef}
            pinnedLeftRef={pinnedLeftRef}
            pinnedRightRef={pinnedRightRef}
            tableRef={tableRef}
          />
        </div>
        <TableFooter
          currentPage={currentPage}
          hideFooter={hideFooter}
          nextIcon={nextIcon}
          onPageChange={setCurrentPage}
          prevIcon={prevIcon}
          rowsPerPage={rowsPerPage}
          shouldPaginate={shouldPaginate}
          totalRows={sortedRows.length}
        />
      </div>
    </TableContext.Provider>
  );
};

// Add prop validation
SimpleTable.defaultProps = {
  allowAnimations: false,
  columnEditorPosition: ColumnEditorPosition.Right,
  columnEditorText: "Columns",
  columnResizing: false,
  defaultHeaders: [],
  draggable: false,
  editColumns: false,
  editColumnsInitOpen: false,
  height: "",
  hideFooter: false,
  nextIcon: <AngleRightIcon className="st-next-prev-icon" />,
  onCellChange: () => {},
  prevIcon: <AngleLeftIcon className="st-next-prev-icon" />,
  rows: [],
  rowsPerPage: 10,
  selectableCells: false,
  selectableColumns: false,
  shouldPaginate: false,
  sortDownIcon: <AngleDownIcon className="st-sort-icon" />,
  sortUpIcon: <AngleUpIcon className="st-sort-icon" />,
  theme: "light",
};

export default memo(SimpleTable);
