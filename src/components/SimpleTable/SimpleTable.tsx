import { useState, useRef, useEffect, useReducer } from "react";
import useSelection from "../../hooks/useSelection";
import TableHeader from "./TableHeader";
import { onSort } from "../../utils/sortUtils";
import Animate from "../Animate";
import TableBody from "./TableBody";
import HeaderObject from "../../types/HeaderObject";

interface SpreadsheetProps {
  defaultHeaders: HeaderObject[];
  rows: { [key: string]: any }[];
}

const SimpleTable = ({ defaultHeaders, rows }: SpreadsheetProps) => {
  const [isWidthDragging, setIsWidthDragging] = useState(false);
  const headersRef = useRef(defaultHeaders);
  const [sortedRows, setSortedRows] = useState(rows);
  const [sortConfig, setSortConfig] = useState<{
    key: HeaderObject;
    direction: string;
  } | null>(null);
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
      if (!target.closest(".st-table-cell")) {
        setSelectedCells([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelectedCells]);

  return (
    <div className="st-table-wrapper">
      <div
        className="st-table"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          gridTemplateColumns: headersRef.current
            ?.map((header) => `${header.width}px`)
            .join(" "),
        }}
      >
        <TableHeader
          forceUpdate={forceUpdate}
          headersRef={headersRef}
          isWidthDragging={isWidthDragging}
          onSort={handleSort}
          onTableHeaderDragEnd={onTableHeaderDragEnd}
          setIsWidthDragging={setIsWidthDragging}
        />
        <TableBody
          getBorderClass={getBorderClass}
          handleMouseDown={handleMouseDown}
          handleMouseOver={handleMouseOver}
          headers={headersRef.current}
          isSelected={isSelected}
          isTopLeftCell={isTopLeftCell}
          sortedRows={sortedRows}
          isWidthDragging={isWidthDragging}
        />
      </div>
    </div>
  );
};

export default SimpleTable;
