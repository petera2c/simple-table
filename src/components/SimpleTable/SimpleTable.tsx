import {
  useState,
  useRef,
  useEffect,
  useReducer,
  ReactNode,
  useMemo,
} from "react";
import useSelection from "../../hooks/useSelection";
import TableHeader from "./TableHeader";
import { handleSort } from "../../utils/sortUtils";
import TableBody from "./TableBody";
import HeaderObject from "../../types/HeaderObject";
import TableFooter from "./TableFooter";
import AngleLeftIcon from "../../icons/AngleLeftIcon";
import AngleRightIcon from "../../icons/AngleRightIcon";
import CellValue from "../../types/CellValue";
import CellChangeProps from "../../types/CellChangeProps";
import SortConfig from "../../types/SortConfig";
import TableContext from "../../context/TableContext";
import AngleUpIcon from "../../icons/AngleUpIcon";
import AngleDownIcon from "../../icons/AngleDownIcon";
import TableColumnEditor from "./TableColumnEditor/TableColumnEditor";
import "../../styles/simple-table.css";
import Theme from "../../types/Theme";

interface SpreadsheetProps {
  allowAnimations?: boolean; // Flag for allowing animations
  columnEditorPosition?: "left" | "right";
  columnEditorText?: string; // Text for the column editor
  columnResizing?: boolean; // Flag for column resizing
  defaultHeaders: HeaderObject[]; // Default headers
  draggable?: boolean; // Flag for draggable
  editColumns?: boolean; // Flag for column editing
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
  rows: { [key: string]: CellValue }[]; // Rows data
  rowsPerPage?: number; // Rows per page
  selectableCells?: boolean; // Flag if can select cells
  selectableColumns?: boolean; // Flag for selectable column headers
  shouldPaginate?: boolean; // Flag for pagination
  sortDownIcon?: ReactNode; // Sort down icon
  sortUpIcon?: ReactNode; // Sort up icon
  theme?: Theme; // Theme
}

// Utility function to load fonts
const loadFont = (fontName: string) => {
  const existingLink = document.querySelector(`link[data-font="${fontName}"]`);
  if (existingLink) return; // Font already loaded

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
    / /g,
    "+"
  )}:wght@400;700&display=swap`;
  link.setAttribute("data-font", fontName);
  document.head.appendChild(link);
};

const SimpleTable = ({
  allowAnimations = false,
  columnEditorPosition = "right",
  columnEditorText = "Columns",
  columnResizing = false,
  defaultHeaders,
  draggable = false,
  editColumns = false,
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
}: SpreadsheetProps) => {
  useEffect(() => {
    switch (theme) {
      case "light":
        loadFont("Nunito");
        break;
      case "dark":
        loadFont("Open Sans");
        break;
      case "pastel":
        loadFont("Comic Sans MS");
        break;
      case "vibrant":
        loadFont("Lobster");
        break;
      case "solarized-light":
      case "solarized-dark":
        loadFont("Georgia");
        break;
      case "desert":
        loadFont("Times New Roman");
        break;
      case "forest":
        loadFont("Tahoma");
        break;
      case "ocean":
        loadFont("Verdana");
        break;
      case "bubblegum":
        loadFont("Pacifico");
        break;
      case "90s":
        loadFont("Courier New");
        break;
      default:
        loadFont("Nunito"); // Default font
        break;
    }
  }, [theme]);

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

  // Local state
  const [isWidthDragging, setIsWidthDragging] = useState(false);
  const headersRef = useRef(defaultHeaders);
  const [sort, setSort] = useState<SortConfig | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<{
    [key: string]: boolean;
  }>({});

  const [currentPage, setCurrentPage] = useState(1);

  const sortedRows = useMemo(() => {
    if (!sort) return tableRows;
    const { sortedData } = handleSort(headersRef.current, tableRows, sort);

    return sortedData;
  }, [tableRows, sort]);

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

  // Derived state
  const currentHeaders = headersRef.current.filter((header) => !header.hide);
  const shouldDisplayLastColumnCell = useMemo(() => {
    if (!tableRef.current) return false;
    const totalColumnWidth = currentHeaders.reduce(
      (acc, header) => acc + header.width,
      0
    );
    return totalColumnWidth < tableRef.current.clientWidth;
  }, [currentHeaders]);

  const currentRows = shouldPaginate
    ? sortedRows.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      )
    : sortedRows;

  // Handlers
  const onSort = (columnIndex: number, accessor: string) => {
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
      } else {
        return null;
      }
    });
  };
  const onTableHeaderDragEnd = (newHeaders: HeaderObject[]) => {
    headersRef.current = newHeaders;
    forceUpdate();
  };

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

  const gridTemplateColumns = useMemo(() => {
    return `${currentHeaders
      .filter((header) => hiddenColumns[header.accessor] !== true)
      .map((header) => `${header.width}px`)
      .join(" ")} 1fr`;
  }, [currentHeaders, hiddenColumns]);

  return (
    <TableContext.Provider value={{ rows, tableRows }}>
      <div
        className={`st-wrapper theme-${theme}`}
        style={height ? { height } : {}}
      >
        <div className="st-table-wrapper">
          <div
            className="st-table"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={tableRef}
            style={{
              gridTemplateColumns,
            }}
          >
            <TableHeader
              allowAnimations={allowAnimations}
              columnResizing={columnResizing}
              currentRows={currentRows}
              draggable={draggable}
              draggedHeaderRef={draggedHeaderRef}
              forceUpdate={forceUpdate}
              headersRef={headersRef}
              hiddenColumns={hiddenColumns}
              hoveredHeaderRef={hoveredHeaderRef}
              isWidthDragging={isWidthDragging}
              onSort={onSort}
              onTableHeaderDragEnd={onTableHeaderDragEnd}
              selectableColumns={selectableColumns}
              setIsWidthDragging={setIsWidthDragging}
              setSelectedCells={setSelectedCells}
              shouldDisplayLastColumnCell={shouldDisplayLastColumnCell}
              sort={sort}
              sortDownIcon={sortDownIcon}
              sortUpIcon={sortUpIcon}
              tableRef={tableRef}
            />
            <TableBody
              allowAnimations={allowAnimations}
              currentRows={currentRows}
              draggedHeaderRef={draggedHeaderRef}
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
              onCellChange={onCellChange}
              onTableHeaderDragEnd={onTableHeaderDragEnd}
              shouldDisplayLastColumnCell={shouldDisplayLastColumnCell}
              shouldPaginate={shouldPaginate}
              tableRef={tableRef}
            />
          </div>
          <TableColumnEditor
            headers={headersRef.current}
            columnEditorText={columnEditorText}
            editColumns={editColumns}
            position={columnEditorPosition}
            setHiddenColumns={setHiddenColumns}
            hiddenColumns={hiddenColumns}
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

export default SimpleTable;
