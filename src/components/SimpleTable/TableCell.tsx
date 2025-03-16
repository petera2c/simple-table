import { forwardRef, Ref, useContext, useEffect, useState } from "react";
import EditableCell from "./EditableCell/EditableCell";
import CellValue from "../../types/CellValue";
import TableContext from "../../context/TableContext";
import { useThrottle } from "../../utils/performanceUtils";
import useDragHandler from "../../hooks/useDragHandler";
import { DRAG_THROTTLE_LIMIT } from "../../consts/general-consts";
import { getCellId } from "../../utils/cellUtils";
import TableCellProps from "../../types/TableCellProps";

const TableCell = forwardRef(
  (
    {
      borderClass,
      colIndex,
      content,
      draggedHeaderRef,
      header,
      headersRef,
      hoveredHeaderRef,
      isSelected,
      isTopLeftCell,
      onCellChange,
      onMouseDown,
      onMouseOver,
      onTableHeaderDragEnd,
      row,
      rowIndex,
    }: TableCellProps,
    ref: Ref<HTMLDivElement>
  ) => {
    // Context
    const { rows, tableRows } = useContext(TableContext);

    // Local state
    const [localContent, setLocalContent] = useState<CellValue>(
      content as CellValue
    );
    const [isEditing, setIsEditing] = useState(false);

    // Hooks
    const { handleDragOver } = useDragHandler({
      draggedHeaderRef,
      headersRef,
      hoveredHeaderRef,
      onTableHeaderDragEnd,
    });
    const throttle = useThrottle();

    // Derived state
    const clickable = Boolean(header?.isEditable);
    const isOddRow = rowIndex % 2 === 0;
    const cellClassName = `st-cell ${
      isSelected(rowIndex, colIndex)
        ? isTopLeftCell(rowIndex, colIndex)
          ? `st-cell-selected-first-cell ${borderClass}`
          : `st-cell-selected ${borderClass}`
        : ""
    } ${isOddRow ? "st-cell-odd-row" : "st-cell-even-row"} ${
      clickable ? "clickable" : ""
    }`;

    // Update local content when the content changes
    useEffect(() => {
      // Check if the content is a ReactNode. If it is we don't need to update the local content
      if (typeof content === "object") return;
      setLocalContent(content as CellValue);
    }, [content]);

    // Update local content when the table rows change
    useEffect(() => {
      if (
        row.rowMeta?.rowId === undefined ||
        typeof row.rowMeta?.rowId !== "number"
      )
        return;

      const tableRowContent = rows[row.rowMeta?.rowId];
      // Check if the cell is a ReactNode. If it is we don't need to update the local content
      if (typeof tableRowContent.rowData[header.accessor] === "object") return;

      if (tableRowContent.rowData[header.accessor] !== localContent) {
        setLocalContent(tableRowContent.rowData[header.accessor] as CellValue);
      } else {
        tableRows[row.rowMeta?.rowId].rowData[header.accessor] = localContent;
      }
    }, [header.accessor, localContent, rows, row.rowMeta?.rowId, tableRows]);

    const updateLocalContent = (newValue: CellValue) => {
      setLocalContent(newValue);
      onCellChange?.({
        accessor: header.accessor,
        newValue,
        newRowIndex: rowIndex,
        originalRowIndex: row.rowMeta?.rowId,
        row,
      });
    };

    if (isEditing) {
      return (
        <div
          className={`st-cell-editing ${
            isOddRow ? "st-cell-odd-row" : "st-cell-even-row"
          }`}
          id={getCellId({ accessor: header.accessor, rowIndex: rowIndex + 1 })}
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
        id={getCellId({ accessor: header.accessor, rowIndex: rowIndex + 1 })}
        onDoubleClick={() => header.isEditable && setIsEditing(true)}
        onMouseDown={() => onMouseDown(rowIndex, colIndex)}
        onMouseOver={() => onMouseOver(rowIndex, colIndex)}
        onDragOver={(event) =>
          throttle({
            callback: handleDragOver,
            callbackProps: { event, hoveredHeader: header },
            limit: DRAG_THROTTLE_LIMIT,
          })
        }
        ref={ref}
      >
        {localContent}
      </div>
    );
  }
);

export default TableCell;
