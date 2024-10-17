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
import { onSort } from "../../utils/sortUtils";
import TableBody from "./TableBody";
import HeaderObject from "../../types/HeaderObject";
import TableFooter from "./TableFooter";
import AngleLeftIcon from "../../icons/AngleLeftIcon";
import AngleRightIcon from "../../icons/AngleRightIcon";
import "../../styles/simple-table.css";
export interface SpreadsheetProps {
  defaultHeaders: HeaderObject[];
  enableColumnResizing?: boolean;
  height?: string;
  hideFooter?: boolean;
  nextIcon?: ReactNode;
  prevIcon?: ReactNode;
  rows: { [key: string]: string | number | boolean | undefined | null }[];
  rowsPerPage?: number;
  shouldPaginate?: boolean;
}

const SimpleTable = ({
  defaultHeaders,
  enableColumnResizing = true,
  height,
  hideFooter = false,
  nextIcon = <AngleRightIcon />,
  prevIcon = <AngleLeftIcon />,
  rows,
  rowsPerPage = 10,
  shouldPaginate = true,
}: SpreadsheetProps) => {
  const [isWidthDragging, setIsWidthDragging] = useState(false);
  const headersRef = useRef(defaultHeaders);
  const [sortedRows, setSortedRows] = useState(rows);
  const [sortConfig, setSortConfig] = useState<{
    key: HeaderObject;
    direction: string;
  } | null>(null);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [currentPage, setCurrentPage] = useState(1);

  const tableRef = useRef<HTMLDivElement>(null);

  const shouldDisplayLastColumnCell = useMemo(() => {
    if (!tableRef.current) return false;
    const totalColumnWidth = headersRef.current.reduce(
      (acc, header) => acc + header.width,
      0
    );
    return totalColumnWidth < tableRef.current.clientWidth;
  }, []);

  const {
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    isSelected,
    getBorderClass,
    isTopLeftCell,
    setSelectedCells,
  } = useSelection(sortedRows, headersRef.current);

  const handleSort = (columnIndex: number) => {
    const { sortedData, newSortConfig } = onSort(
      headersRef.current,
      sortedRows,
      sortConfig,
      columnIndex
    );
    setSortedRows(sortedData);
    setSortConfig(newSortConfig);
  };

  const onTableHeaderDragEnd = (newHeaders: HeaderObject[]) => {
    headersRef.current = newHeaders;
    forceUpdate();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".st-cell")) {
        console.log(target);
        setSelectedCells([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelectedCells]);

  const currentRows = shouldPaginate
    ? sortedRows.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      )
    : sortedRows;

  return (
    <div ref={tableRef} className="st-wrapper" style={height ? { height } : {}}>
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
          onSort={handleSort}
          onTableHeaderDragEnd={onTableHeaderDragEnd}
          setIsWidthDragging={setIsWidthDragging}
          shouldDisplayLastColumnCell={shouldDisplayLastColumnCell}
        />
        <TableBody
          getBorderClass={getBorderClass}
          handleMouseDown={handleMouseDown}
          handleMouseOver={handleMouseOver}
          headers={headersRef.current}
          isSelected={isSelected}
          isTopLeftCell={isTopLeftCell}
          isWidthDragging={isWidthDragging}
          shouldDisplayLastColumnCell={shouldDisplayLastColumnCell}
          shouldPaginate={shouldPaginate}
          sortedRows={currentRows}
        />
      </div>
      {shouldPaginate && (
        <TableFooter
          currentPage={currentPage}
          hideFooter={hideFooter}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalRows={sortedRows.length}
          nextIcon={nextIcon}
          prevIcon={prevIcon}
        />
      )}
    </div>
  );
};

export default SimpleTable;
