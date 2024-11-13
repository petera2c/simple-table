import { forwardRef, LegacyRef, useContext, useEffect, useState } from "react";
import EditableCell from "./EditableCell/EditableCell";
import HeaderObject from "../../types/HeaderObject";
import CellChangeProps from "../../types/CellChangeProps";
import CellValue from "../../types/CellValue";
import TableContext from "../../context/TableContext";

interface TableCellProps {
  borderClass: string;
  colIndex: number;
  content: CellValue;
  header: HeaderObject;
  isSelected: boolean;
  isTopLeftCell: boolean;
  onCellChange?: (props: CellChangeProps) => void;
  onMouseDown: (rowIndex: number, colIndex: number) => void;
  onMouseOver: (rowIndex: number, colIndex: number) => void;
  row: { [key: string]: CellValue };
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
    const { rows, tableRows } = useContext(TableContext);
    const [localContent, setLocalContent] = useState(content);
    const [isEditing, setIsEditing] = useState(false);

    const clickable = Boolean(header?.isEditable);

    const isOddRow = rowIndex % 2 === 0;

    const cellClassName = `st-cell ${
      isSelected
        ? isTopLeftCell
          ? `st-cell-selected-first-cell ${borderClass}`
          : `st-cell-selected ${borderClass}`
        : ""
    } ${isOddRow ? "st-cell-odd-row" : "st-cell-even-row"} ${
      clickable ? "clickable" : ""
    }`;

    // Update local content when the content changes
    useEffect(() => {
      setLocalContent(content);
    }, [content]);

    // Update local content when the table rows change
    useEffect(() => {
      if (
        row.originalRowIndex === undefined ||
        typeof row.originalRowIndex !== "number"
      )
        return;

      const tableRowContent = rows[row.originalRowIndex];

      if (tableRowContent[header.accessor] !== localContent) {
        setLocalContent(tableRowContent[header.accessor]);
      } else {
        tableRows[row.originalRowIndex][header.accessor] = localContent;
      }
    }, [header.accessor, localContent, rows, row.originalRowIndex, tableRows]);

    const updateLocalContent = (newValue: CellValue) => {
      setLocalContent(newValue);
      onCellChange?.({
        accessor: header.accessor,
        newValue,
        newRowIndex: rowIndex,
        originalRowIndex: row.originalRowIndex as number,
        row,
      });
    };

    if (isEditing) {
      return (
        <div
          className={`st-cell-editing ${
            isOddRow ? "st-cell-odd-row" : "st-cell-even-row"
          }`}
        >
          <EditableCell
            onChange={updateLocalContent}
            setIsEditing={setIsEditing}
            value={localContent}
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
        {localContent}
      </div>
    );
  }
);

export default TableCell;
