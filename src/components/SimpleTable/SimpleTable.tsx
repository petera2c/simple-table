import { useState, useRef, useEffect, useReducer, ReactNode, useMemo, useCallback, memo, useLayoutEffect } from "react";
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

// Create enum for consistent values
enum ColumnEditorPosition {
  Left = "left",
  Right = "right",
}

interface SimpleTableProps {
  allowAnimations?: boolean; // Flag for allowing animations
  columnEditorPosition?: ColumnEditorPosition;
  columnEditorText?: string; // Text for the column editor
  columnReordering?: boolean; // Flag for column reordering
  columnResizing?: boolean; // Flag for column resizing
  defaultHeaders: HeaderObject[]; // Default headers
  editColumns?: boolean; // Flag for column editing
  editColumnsInitOpen?: boolean; // Flag for opening the column editor when the table is loaded
  height?: string; // Height of the table
  hideFooter?: boolean; // Flag for hiding the footer
  nextIcon?: ReactNode; // Next icon
  onCellEdit?: (props: CellChangeProps) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onNextPage?: (page: number) => void; // Custom handler for next page
  onPreviousPage?: (page: number) => void; // Custom handler for previous page
  prevIcon?: ReactNode; // Previous icon
  rows: Row[]; // Rows data
  rowsPerPage?: number; // Rows per page
  selectableCells?: boolean; // Flag if can select cells
  selectableColumns?: boolean; // Flag for selectable column headers
  shouldPaginate?: boolean; // Flag for pagination
  sortDownIcon?: ReactNode; // Sort down icon
  sortUpIcon?: ReactNode; // Sort up icon
  theme?: Theme; // Theme
  totalPages?: number; // Total pages
}

const SimpleTable = ({
  allowAnimations = false,
  columnEditorPosition = ColumnEditorPosition.Right,
  columnEditorText = "Columns",
  columnResizing = false,
  defaultHeaders,
  editColumns = false,
  editColumnsInitOpen = false,
  columnReordering = false,
  height,
  hideFooter = false,
  nextIcon = <AngleRightIcon className="st-next-prev-icon" />,
  onCellEdit,
  onColumnOrderChange,
  onNextPage,
  onPreviousPage,
  prevIcon = <AngleLeftIcon className="st-next-prev-icon" />,
  rows,
  rowsPerPage = 10,
  selectableCells = false,
  selectableColumns = false,
  shouldPaginate = false,
  sortDownIcon = <AngleDownIcon className="st-sort-icon" />,
  sortUpIcon = <AngleUpIcon className="st-sort-icon" />,
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

  // Use custom hook for sorting
  const { sort, sortedRows, hiddenColumns, setHiddenColumns, updateSort } = useSortableData({
    headers: headersRef.current,
    tableRows: rows,
  });

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

  // On window risize completely re-render the table
  useLayoutEffect(() => {
    const handleResize = () => {
      // Force a re-render of the table
      forceUpdate();
      // Re-calculate the width of the scrollbar and table content
      if (!tableBodyContainerRef.current) return;

      const newScrollbarWidth = tableBodyContainerRef.current.offsetWidth - tableBodyContainerRef.current.clientWidth;
      const newTableContentWidth = tableBodyContainerRef.current.clientWidth;

      setScrollbarWidth(newScrollbarWidth);
      setTableContentWidth(newTableContentWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`simple-table-root st-wrapper theme-${theme}`} style={height ? { height } : {}}>
      <div className="st-table-wrapper-container">
        <div className="st-table-wrapper" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <TableContent
            allowAnimations={allowAnimations}
            columnResizing={columnResizing}
            currentRows={currentRows}
            draggedHeaderRef={draggedHeaderRef}
            editColumns={editColumns}
            columnReordering={columnReordering}
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
            onCellEdit={onCellEdit}
            onColumnOrderChange={onColumnOrderChange}
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
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        prevIcon={prevIcon}
        shouldPaginate={shouldPaginate}
        totalPages={totalPages || Math.ceil(sortedRows.length / rowsPerPage)}
      />
    </div>
  );
};

export default memo(SimpleTable);
