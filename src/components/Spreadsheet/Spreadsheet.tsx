import useSelection from "../../hooks/useSelection";
import TableRow from "./TableRow";
import "../../styles/Spreadsheet.css";

interface SpreadsheetProps {
  headers: string[];
  rows: { [key: string]: any }[];
}

const Spreadsheet = ({ headers, rows }: SpreadsheetProps) => {
  const {
    // selectedCells,
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
    isSelected,
    getBorderClass,
    isTopLeftCell,
  } = useSelection(rows, headers);

  return (
    <div>
      <table onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
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
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Spreadsheet;
