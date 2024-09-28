import TableCell from "./TableCell";

interface TableRowProps {
  rowIndex: number;
  row: { [key: string]: any };
  headers: string[];
  isSelected: (rowIndex: number, colIndex: number) => boolean;
  isTopLeftCell: (rowIndex: number, colIndex: number) => boolean;
  getBorderClass: (rowIndex: number, colIndex: number) => string;
  handleMouseDown: (rowIndex: number, colIndex: number) => void;
  handleMouseOver: (rowIndex: number, colIndex: number) => void;
  className?: string;
}

const TableRow = ({
  rowIndex,
  row,
  headers,
  isSelected,
  isTopLeftCell,
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  className,
}: TableRowProps) => {
  return (
    <tr key={rowIndex} className={className}>
      {headers.map((header, colIndex) => (
        <TableCell
          key={colIndex}
          rowIndex={rowIndex}
          colIndex={colIndex}
          content={row[header]}
          isSelected={isSelected(rowIndex, colIndex)}
          isTopLeftCell={isTopLeftCell(rowIndex, colIndex)}
          borderClass={getBorderClass(rowIndex, colIndex)}
          onMouseDown={handleMouseDown}
          onMouseOver={handleMouseOver}
        />
      ))}
    </tr>
  );
};

export default TableRow;
