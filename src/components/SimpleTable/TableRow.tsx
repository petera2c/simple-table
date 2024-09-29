import React, { createRef, forwardRef, LegacyRef } from "react";
import AnimateRows from "../AnimateRows";
import TableCell from "./TableCell";

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
  ) => (
    <tr key={row.id} ref={ref}>
      {headers.map((header, columnIndex) => (
        <TableCell
          key={columnIndex}
          rowIndex={rowIndex}
          colIndex={columnIndex}
          content={row[header]}
          isSelected={isSelected(rowIndex, columnIndex)}
          isTopLeftCell={isTopLeftCell(rowIndex, columnIndex)}
          borderClass={getBorderClass(rowIndex, columnIndex)}
          onMouseDown={() => handleMouseDown(rowIndex, columnIndex)}
          onMouseOver={() => handleMouseOver(rowIndex, columnIndex)}
        />
      ))}
    </tr>
  )
);

export default TableRow;
