import { useState, useRef, useEffect, useReducer, ReactNode, useMemo, useCallback, memo, useLayoutEffect } from "react";
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
  editColumns?: boolean; // Flag for column editing
  editColumnsInitOpen?: boolean; // Flag for opening the column editor when the table is loaded
  enableColumnReordering?: boolean; // Flag for column reordering
  height?: string; // Height of the table
  hideFooter?: boolean; // Flag for hiding the footer
  nextIcon?: ReactNode; // Next icon
  onCellChange?: ({ accessor, newValue, originalRowIndex, row }: CellChangeProps) => void;
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
  enableColumnReordering = false,
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
  // Initialize originalRowIndex on each row
  const tableRows = useMemo(() => {
    const rowsWithOriginalRowIndex = rows.map((row, index) => ({
      ...row,
      originalRowIndex: index,
    }));
    return rowsWithOriginalRowIndex;
  }, [rows]);

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

  // Use custom hook for sorting
  const { sort, sortedRows, hiddenColumns, setHiddenColumns, updateSort } = useSortableData(
    tableRows,
    headersRef.current
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
    return sortedRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [currentPage, rowsPerPage, shouldPaginate, sortedRows]);

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
          ? !target.classList.contains("st-header-cell") && !target.classList.contains("st-header-label")
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

  // Calculate the width of the scrollbar
  useLayoutEffect(() => {
    if (!tableBodyContainerRef.current) return;

    const newScrollbarWidth = tableBodyContainerRef.current.offsetWidth - tableBodyContainerRef.current.clientWidth;
    const newTableContentWidth = tableBodyContainerRef.current.clientWidth;

    setScrollbarWidth(newScrollbarWidth);
    setTableContentWidth(newTableContentWidth);
  }, []);

  return (
    <TableContext.Provider value={{ rows, tableRows }}>
      <div className={`simple-table-root st-wrapper theme-${theme}`} style={height ? { height } : {}}>
        <div className="st-table-wrapper-container">
          <div className="st-table-wrapper" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <TableContent
              allowAnimations={allowAnimations}
              columnResizing={columnResizing}
              currentRows={currentRows}
              draggedHeaderRef={draggedHeaderRef}
              editColumns={editColumns}
              enableColumnReordering={enableColumnReordering}
              forceUpdate={forceUpdate}
              getBorderClass={getBorderClass}
              handleMouseDown={handleMouseDown}
              handleMouseOver={handleMouseOver}
              headers={headersRef.current}
              headersRef={headersRef}
              hiddenColumns={hiddenColumns}
              hoveredHeaderRef={hoveredHeaderRef}
              isSelected={isSelected}
              isTopLeftCell={isTopLeftCell}
              isWidthDragging={isWidthDragging}
              mainBodyRef={mainBodyRef}
              onCellChange={onCellChange}
              onSort={onSort}
              onTableHeaderDragEnd={onTableHeaderDragEnd}
              pinnedLeftRef={pinnedLeftRef}
              pinnedRightRef={pinnedRightRef}
              scrollbarWidth={scrollbarWidth}
              selectableColumns={selectableColumns}
              setIsWidthDragging={setIsWidthDragging}
              setSelectedCells={setSelectedCells}
              shouldPaginate={shouldPaginate}
              sort={sort}
              sortDownIcon={sortDownIcon}
              sortUpIcon={sortUpIcon}
              tableBodyContainerRef={tableBodyContainerRef}
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
  editColumns: false,
  editColumnsInitOpen: false,
  enableColumnReordering: false,
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
