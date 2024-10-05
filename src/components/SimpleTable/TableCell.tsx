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
    }: TableCellProps,
    ref: LegacyRef<HTMLTableCellElement>
  ) => {
    return (
      <td
        onMouseDown={() => onMouseDown(rowIndex, colIndex)}
        onMouseOver={() => onMouseOver(rowIndex, colIndex)}
        ref={ref}
      >
        <div
          className={`st-table-cell ${
            isSelected
              ? isTopLeftCell
                ? `st-table-cell-selected-first-cell ${borderClass}`
                : `st-table-cell-selected ${borderClass}`
              : ""
          }`}
        >
          {content}
        </div>
      </td>
    );
  }
);

export default TableCell;
