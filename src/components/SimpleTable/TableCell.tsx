import { forwardRef, LegacyRef, useState } from "react";
import EditableCell from "./EditableCell/EditableCell";

interface TableCellProps {
  borderClass: string;
  colIndex: number;
  content: any;
  isSelected: boolean;
  isTopLeftCell: boolean;
  onMouseDown: (rowIndex: number, colIndex: number) => void;
  onMouseOver: (rowIndex: number, colIndex: number) => void;
  rowIndex: number;
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
    const [isEditing, setIsEditing] = useState(
      rowIndex === 0 && colIndex === 0
    );

    const isOddRow = rowIndex % 2 === 0;

    const cellClassName = `st-cell ${
      isSelected
        ? isTopLeftCell
          ? `st-cell-selected-first-cell ${borderClass}`
          : `st-cell-selected ${borderClass}`
        : ""
    } ${isOddRow ? "st-cell-odd-row" : ""}`;

    if (isEditing) {
      console.log("isEditing", isEditing);
      return (
        <div className={`st-cell-editing ${isOddRow ? "st-cell-odd-row" : ""}`}>
          <EditableCell
            onChange={() => {}}
            setIsEditing={setIsEditing}
            value={content}
          />
        </div>
      );
    }

    return (
      <div
        className={cellClassName}
        onDoubleClick={() => setIsEditing(true)}
        onMouseDown={() => onMouseDown(rowIndex, colIndex)}
        onMouseOver={() => onMouseOver(rowIndex, colIndex)}
        ref={ref}
      >
        {content}
      </div>
    );
  }
);

export default TableCell;
