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
import "../../styles/simple-table.css";
import CellValue from "../../types/CellValue";
import CellChangeProps from "../../types/CellChangeProps";
import SortConfig from "../../types/SortConfig";
import TableContext from "../../context/TableContext";
import AngleUpIcon from "../../icons/AngleUpIcon";
import AngleDownIcon from "../../icons/AngleDownIcon";
import TableColumnEditor from "./TableColumnEditor";
export interface SpreadsheetProps {
  defaultHeaders: HeaderObject[];
  editColumns?: boolean;
  enableColumnResizing?: boolean;
  height?: string;
  hideFooter?: boolean;
  nextIcon?: ReactNode;
  onCellChange?: ({
    accessor,
    newValue,
    originalRowIndex,
    row,
  }: CellChangeProps) => void;
  prevIcon?: ReactNode;
  rows: { [key: string]: CellValue }[];
  rowsPerPage?: number;
  shouldPaginate?: boolean;
  sortDownIcon?: ReactNode;
  sortUpIcon?: ReactNode;
}

const SimpleTable = ({
  defaultHeaders,
  editColumns = false,
  enableColumnResizing = true,
  height,
  hideFooter = false,
  nextIcon = <AngleRightIcon />,
  onCellChange,
  prevIcon = <AngleLeftIcon />,
  rows,
  rowsPerPage = 10,
  shouldPaginate = true,
  sortDownIcon = <AngleDownIcon className="st-sort-icon" />,
  sortUpIcon = <AngleUpIcon className="st-sort-icon" />,
}: SpreadsheetProps) => {
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

  // Local state
  const [isWidthDragging, setIsWidthDragging] = useState(false);
  const headersRef = useRef(defaultHeaders);
  const [sort, setSort] = useState<SortConfig | null>(null);

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
  } = useSelection(sortedRows, headersRef.current);

  // Derived state
  const currentHeaders = headersRef.current.filter((header) => !header.hide);
  const shouldDisplayLastColumnCell = useMemo(() => {
    if (!tableRef.current) return false;
    const totalColumnWidth = headersRef.current.reduce(
      (acc, header) => acc + header.width,
      0
    );
    return totalColumnWidth < tableRef.current.clientWidth;
  }, []);
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
      if (!target.closest(".st-cell")) {
        setSelectedCells([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelectedCells]);

  return (
    <TableContext.Provider value={{ rows, tableRows }}>
      <div
        ref={tableRef}
        className="st-wrapper"
        style={height ? { height } : {}}
      >
        <div
          className="st-table"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            gridTemplateColumns: `${headersRef.current
              ?.map((header) => `${header.width}px`)
              .join(" ")} 1fr`,
          }}
        >
          <TableHeader
            enableColumnResizing={enableColumnResizing}
            forceUpdate={forceUpdate}
            headersRef={headersRef}
            isWidthDragging={isWidthDragging}
            onSort={onSort}
            onTableHeaderDragEnd={onTableHeaderDragEnd}
            setIsWidthDragging={setIsWidthDragging}
            shouldDisplayLastColumnCell={shouldDisplayLastColumnCell}
            sort={sort}
            sortDownIcon={sortDownIcon}
            sortUpIcon={sortUpIcon}
          />
          <TableBody
            getBorderClass={getBorderClass}
            handleMouseDown={handleMouseDown}
            handleMouseOver={handleMouseOver}
            headers={headersRef.current}
            isSelected={isSelected}
            isTopLeftCell={isTopLeftCell}
            isWidthDragging={isWidthDragging}
            onCellChange={onCellChange}
            shouldDisplayLastColumnCell={shouldDisplayLastColumnCell}
            shouldPaginate={shouldPaginate}
            sortedRows={currentRows}
          />
        </div>
        {/* <TableColumnEditor
          editColumns={editColumns}
          headersRef={headersRef}
          onTableHeaderDragEnd={onTableHeaderDragEnd}
        /> */}
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
