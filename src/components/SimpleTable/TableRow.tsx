import { createRef, forwardRef, LegacyRef } from "react";
import TableCell from "./TableCell";
import Animate from "../Animate";

interface TableRowProps {
  rowIndex: number;
  row: { [key: string]: any };
  headers: string[];
  isSelected: (rowIndex: number, columnIndex: number) => boolean;
  isTopLeftCell: (rowIndex: number, columnIndex: number) => boolean;
  getBorderClass: (rowIndex: number, columnIndex: number) => string;
  handleMouseDown: (rowIndex: number, columnIndex: number) => void;
  handleMouseOver: (rowIndex: number, columnIndex: number) => void;
}

const TableRow = forwardRef(
  (
    {
      rowIndex,
      row,
      headers,
      isSelected,
      isTopLeftCell,
      getBorderClass,
      handleMouseDown,
      handleMouseOver,
    }: TableRowProps,
    ref: LegacyRef<HTMLTableRowElement>
  ) => {
    return (
      <tr key={row.id} ref={ref}>
        <Animate>
          {headers.map((header, columnIndex) => (
            <TableCell
              key={header}
              rowIndex={rowIndex}
              colIndex={columnIndex}
              content={row[header]}
              isSelected={isSelected(rowIndex, columnIndex)}
              isTopLeftCell={isTopLeftCell(rowIndex, columnIndex)}
              borderClass={getBorderClass(rowIndex, columnIndex)}
              onMouseDown={() => handleMouseDown(rowIndex, columnIndex)}
              onMouseOver={() => handleMouseOver(rowIndex, columnIndex)}
              ref={createRef()}
            />
          ))}
        </Animate>
      </tr>
    );
  }
);

export default TableRow;
