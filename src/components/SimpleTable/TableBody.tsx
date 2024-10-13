import { createRef, forwardRef, LegacyRef } from "react";
import TableCell from "./TableCell";
import Animate from "../Animate";
import HeaderObject from "../../types/HeaderObject";

interface TableRowProps {
  headers: HeaderObject[];
  isSelected: (rowIndex: number, columnIndex: number) => boolean;
  isTopLeftCell: (rowIndex: number, columnIndex: number) => boolean;
  getBorderClass: (rowIndex: number, columnIndex: number) => string;
  handleMouseDown: (rowIndex: number, columnIndex: number) => void;
  handleMouseOver: (rowIndex: number, columnIndex: number) => void;
  sortedRows: { [key: string]: any }[];
}

const TableBody = ({
  headers,
  isSelected,
  isTopLeftCell,
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  sortedRows,
}: TableRowProps) => {
  return (
    <>
      {sortedRows.map((row, rowIndex) => (
        <Animate key={rowIndex}>
          {headers.map((header, columnIndex) => (
            <TableCell
              key={header.accessor}
              rowIndex={rowIndex}
              colIndex={columnIndex}
              content={row[header.accessor]}
              isSelected={isSelected(rowIndex, columnIndex)}
              isTopLeftCell={isTopLeftCell(rowIndex, columnIndex)}
              borderClass={getBorderClass(rowIndex, columnIndex)}
              onMouseDown={() => handleMouseDown(rowIndex, columnIndex)}
              onMouseOver={() => handleMouseOver(rowIndex, columnIndex)}
              ref={createRef()}
            />
          ))}
        </Animate>
      ))}
    </>
  );
};

export default TableBody;
