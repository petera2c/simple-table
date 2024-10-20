import { forwardRef, LegacyRef, useState } from "react";
import EditableCell from "./EditableCell/EditableCell";
import HeaderObject from "../../types/HeaderObject";
import CellChangeProps from "../../types/CellChangeProps";

interface TableCellProps {
  borderClass: string;
  colIndex: number;
  content: any;
  header: HeaderObject;
  isSelected: boolean;
  isTopLeftCell: boolean;
  onCellChange?: (props: CellChangeProps) => void;
  onMouseDown: (rowIndex: number, colIndex: number) => void;
  onMouseOver: (rowIndex: number, colIndex: number) => void;
  row: any;
  rowIndex: number;
}

const TableCell = forwardRef(
  (
    {
      borderClass,
      colIndex,
      content,
      header,
      isSelected,
      isTopLeftCell,
      onCellChange,
      onMouseDown,
      onMouseOver,
      row,
      rowIndex,
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
      return (
        <div className={`st-cell-editing ${isOddRow ? "st-cell-odd-row" : ""}`}>
          <EditableCell
            accessor={header.accessor}
            onCellChange={onCellChange}
            rowIndex={rowIndex}
            setIsEditing={setIsEditing}
            value={content}
            row={content}
          />
        </div>
      );
    }

    return (
      <div
        className={cellClassName}
        onDoubleClick={() => header.isEditable && setIsEditing(true)}
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
