import { useState, createRef } from "react";
import useSelection from "../../hooks/useSelection";
import TableHeader from "./TableHeader";
import { onSort } from "../../utils/sortUtils";
import Animate from "../Animate";
import TableRow from "./TableRow";

interface SpreadsheetProps {
  headers: string[];
  rows: { [key: string]: any }[];
}

const SimpleTable = ({ headers, rows }: SpreadsheetProps) => {
  const [headersState, setHeaders] = useState(headers);
  const [sortedRows, setSortedRows] = useState(rows);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
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
  const onDragEnd = (newHeaders: string[]) => {
    setHeaders(newHeaders);
  };

  return (
    <div className="table-wrapper">
      <table
        className="simple-table"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <TableHeader
          headers={headersState}
          onSort={handleSort}
          onDragEnd={onDragEnd}
        />
        <tbody>
          <Animate animateRow={true}>
            {sortedRows.map((row, rowIndex) => (
              <TableRow
                getBorderClass={getBorderClass}
                handleMouseDown={handleMouseDown}
                handleMouseOver={handleMouseOver}
                headers={headersState}
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
