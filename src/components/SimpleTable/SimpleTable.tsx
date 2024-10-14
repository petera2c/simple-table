import { useState, createRef, useRef, useReducer } from "react";
import useSelection from "../../hooks/useSelection";
import TableHeader from "./TableHeader";
import { onSort } from "../../utils/sortUtils";
import Animate from "../Animate";
import TableRow from "./TableBody";
import HeaderObject from "../../types/HeaderObject";
import TableBody from "./TableBody";

interface SpreadsheetProps {
  defaultHeaders: HeaderObject[];
  rows: { [key: string]: any }[];
}

const SimpleTable = ({ defaultHeaders, rows }: SpreadsheetProps) => {
  const [isWidthDragging, setIsWidthDragging] = useState(false);
  const [headers, setHeaders] = useState(defaultHeaders);
  const [sortedRows, setSortedRows] = useState(rows);
  const [sortConfig, setSortConfig] = useState<{
    key: HeaderObject;
    direction: string;
  } | null>(null);

  const {
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    isSelected,
    getBorderClass,
    isTopLeftCell,
  } = useSelection(sortedRows, headers);

  const handleSort = (columnIndex: number) => {
    const { sortedData, newSortConfig } = onSort(
      headers,
      sortedRows,
      sortConfig,
      columnIndex
    );
    setSortedRows(sortedData);
    setSortConfig(newSortConfig);
  };
  const onTableHeaderDragEnd = (newHeaders: HeaderObject[]) => {
    setHeaders(newHeaders);
  };

  return (
    <div className="st-table-wrapper">
      <div
        className="st-table"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          gridTemplateColumns: headers
            ?.map((header) => `${header.width}px`)
            .join(" "),
        }}
      >
        <TableHeader
          headers={headers}
          onSort={handleSort}
          onTableHeaderDragEnd={onTableHeaderDragEnd}
          setHeaders={setHeaders}
          setIsWidthDragging={setIsWidthDragging}
          isWidthDragging={isWidthDragging}
        />
        <TableBody
          getBorderClass={getBorderClass}
          handleMouseDown={handleMouseDown}
          handleMouseOver={handleMouseOver}
          headers={headers}
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
