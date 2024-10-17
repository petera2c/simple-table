import { forwardRef, LegacyRef } from "react";

interface TableCellProps {
  rowIndex: number;
  colIndex: number;
  content: any;
  isSelected: boolean;
  isTopLeftCell: boolean;
  borderClass: string;
  onMouseDown: (rowIndex: number, colIndex: number) => void;
  onMouseOver: (rowIndex: number, colIndex: number) => void;
  isLastRow: boolean;
}

const TableCell = forwardRef(
  (
    {
      rowIndex,
      colIndex,
      content,
      isSelected,
      isTopLeftCell,
      borderClass,
      onMouseDown,
      onMouseOver,
      isLastRow,
    }: TableCellProps,
    ref: LegacyRef<HTMLTableCellElement>
  ) => {
    const isOddRow = rowIndex % 2 === 0;
    return (
      <div
        onMouseDown={() => onMouseDown(rowIndex, colIndex)}
        onMouseOver={() => onMouseOver(rowIndex, colIndex)}
        ref={ref}
        className={`st-cell ${
          isSelected
            ? isTopLeftCell
              ? `st-cell-selected-first-cell ${borderClass}`
              : `st-cell-selected ${borderClass}`
            : ""
        } ${isOddRow ? "st-cell-odd-row" : ""}`}
      >
        {content}
      </div>
    );
  }
);

export default TableCell;
