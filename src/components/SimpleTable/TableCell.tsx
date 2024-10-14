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
    return (
      <div
        onMouseDown={() => onMouseDown(rowIndex, colIndex)}
        onMouseOver={() => onMouseOver(rowIndex, colIndex)}
        ref={ref}
        className={`st-table-cell ${
          isSelected
            ? isTopLeftCell
              ? `st-table-cell-selected-first-cell ${borderClass}`
              : `st-table-cell-selected ${borderClass}`
            : ""
        } ${isLastRow ? "st-table-cell-last-row" : ""}`}
      >
        {content}
      </div>
    );
  }
);

export default TableCell;
