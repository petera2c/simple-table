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
          headersRef={headersRef}
          onSort={handleSort}
          onDragEnd={onDragEnd}
        />
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
      </div>
    </div>
  );
};

export default SimpleTable;
