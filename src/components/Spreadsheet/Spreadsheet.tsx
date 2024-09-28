import { useState, useEffect, useRef } from "react";
import useSelection from "../../hooks/useSelection";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";
import { onSort } from "../../utils/sortUtils";
import "../../styles/Spreadsheet.css";
import "../../styles/animations.css";

interface SpreadsheetProps {
  headers: string[];
  rows: { [key: string]: any }[];
}

const Spreadsheet = ({ headers, rows }: SpreadsheetProps) => {
  const [sortedRows, setSortedRows] = useState(rows);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

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

  useEffect(() => {
    const rows = tableBodyRef.current?.children;
    if (!rows) return;

    const initialPositions = Array.from(rows).map((row) =>
      row.getBoundingClientRect()
    );

    requestAnimationFrame(() => {
      Array.from(rows).forEach((row, index) => {
        const initialPosition = initialPositions[index];
        const newPosition = row.getBoundingClientRect();
        const deltaY = initialPosition.top - newPosition.top;

        (row as HTMLElement).style.transition = "none";
        (row as HTMLElement).style.transform = `translateY(${deltaY}px)`;

        requestAnimationFrame(() => {
          (row as HTMLElement).style.transition = "transform 0.5s ease";
          (row as HTMLElement).style.transform = "";
        });
      });
    });
  }, [sortedRows]);

  return (
    <div className="table-wrapper">
      <table
        className="table"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <TableHeader headers={headers} onSort={handleSort} />
        <tbody className="table-body" ref={tableBodyRef}>
          {sortedRows.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              rowIndex={rowIndex}
              row={row}
              headers={headers}
              isSelected={isSelected}
              isTopLeftCell={isTopLeftCell}
              getBorderClass={getBorderClass}
              handleMouseDown={handleMouseDown}
              handleMouseOver={handleMouseOver}
              className="table-row"
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Spreadsheet;
