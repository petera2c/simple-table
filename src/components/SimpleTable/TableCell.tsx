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
    const [isEditing, setIsEditing] = useState(false);

    const isOddRow = rowIndex % 2 === 0;

    if (isEditing) {
      console.log("isEditing", isEditing);
      return (
        <EditableCell
          onChange={() => {}}
          setIsEditing={setIsEditing}
          value={content}
        />
      );
    }

    return (
      <div
        onMouseDown={() => onMouseDown(rowIndex, colIndex)}
        onMouseOver={() => onMouseOver(rowIndex, colIndex)}
        onDoubleClick={() => setIsEditing(true)}
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
