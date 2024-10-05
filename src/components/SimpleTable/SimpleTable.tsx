import { useState, createRef, useRef, useReducer } from "react";
import useSelection from "../../hooks/useSelection";
import TableHeader from "./TableHeader";
import { onSort } from "../../utils/sortUtils";
import Animate from "../Animate";
import TableRow from "./TableRow";
import HeaderObject from "../../types/HeaderObject";

interface SpreadsheetProps {
  headers: HeaderObject[];
  rows: { [key: string]: any }[];
}

const SimpleTable = ({ headers, rows }: SpreadsheetProps) => {
  // Define the widths for each column
  const columnWidths = headers.map((header) => header.width || "auto");

  const headersRef = useRef(headers);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
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
  const onDragEnd = (newHeaders: HeaderObject[]) => {
    headersRef.current = newHeaders;
    forceUpdate();
  };

  return (
    <div className="table-wrapper">
      <table
        className="st-table"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <TableHeader
          headersRef={headersRef}
          onSort={handleSort}
          onDragEnd={onDragEnd}
          columnWidths={columnWidths} // Pass column widths to TableHeader
        />
        <tbody>
          <Animate animateRow={true}>
            {sortedRows.map((row, rowIndex) => (
              <TableRow
                getBorderClass={getBorderClass}
                handleMouseDown={handleMouseDown}
                handleMouseOver={handleMouseOver}
                headers={headersRef.current}
                isSelected={isSelected}
                isTopLeftCell={isTopLeftCell}
                key={row.id}
                ref={createRef()}
                row={row}
                rowIndex={rowIndex}
              />
            ))}
          </Animate>
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;
