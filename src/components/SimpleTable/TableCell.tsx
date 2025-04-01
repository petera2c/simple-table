import { forwardRef, Ref, useEffect, useState } from "react";
import EditableCell from "./editable-cells/EditableCell";
import CellValue from "../../types/CellValue";
import { useThrottle } from "../../utils/performanceUtils";
import useDragHandler from "../../hooks/useDragHandler";
import { DRAG_THROTTLE_LIMIT } from "../../consts/general-consts";
import { getCellId } from "../../utils/cellUtils";
import TableCellProps from "../../types/TableCellProps";
import AngleDownIcon from "../../icons/AngleDownIcon";
import AngleRightIcon from "../../icons/AngleRightIcon";

const TableCell = forwardRef(
  (
    {
      borderClass,
      cellHasChildren,
      colIndex,
      depth,
      draggedHeaderRef,
      header,
      headersRef,
      hoveredHeaderRef,
      isSelected,
      isTopLeftCell,
      onCellEdit,
      onExpandRowClick,
      onMouseDown,
      onMouseOver,
      onTableHeaderDragEnd,
      row,
      rowIndex,
    }: TableCellProps,
    ref: Ref<HTMLDivElement>
  ) => {
    // Local state
    const [localContent, setLocalContent] = useState<CellValue>(row.rowData[header.accessor] as CellValue);
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
    const cellClassName = `st-cell ${depth > 0 && header.expandable ? `st-cell-depth-${depth}` : ""} ${
      isSelected
        ? isTopLeftCell
          ? `st-cell-selected-first-cell ${borderClass}`
          : `st-cell-selected ${borderClass}`
        : ""
    } ${isOddRow ? "st-cell-odd-row" : "st-cell-even-row"} ${clickable ? "clickable" : ""} ${
      header.align === "right" ? "right-aligned" : ""
    }`;

    // Update local content when the table rows change
    // useEffect(() => {
    //   return;
    //   if (row.rowMeta?.rowId === undefined || typeof row.rowMeta?.rowId !== "number") return;

    //   const tableRowContent = rows[row.rowMeta?.rowId];
    //   // Check if the cell is a ReactNode. If it is we don't need to update the local content
    //   if (typeof tableRowContent.rowData[header.accessor] === "object") return;

    //   if (tableRowContent.rowData[header.accessor] !== localContent) {
    //     setLocalContent(tableRowContent.rowData[header.accessor] as CellValue);
    //   } else {
    //     tableRows[row.rowMeta?.rowId].rowData[header.accessor] = localContent;
    //   }
    // }, [header.accessor, localContent, rows, row.rowMeta?.rowId, tableRows]);

    const updateLocalContent = (newValue: CellValue) => {
      setLocalContent(newValue);
      onCellEdit?.({
        accessor: header.accessor,
        newValue,
        row,
      });
    };
    useEffect(() => {
      setLocalContent(row.rowData[header.accessor] as CellValue);
    }, [header.accessor, row]);

    if (isEditing) {
      return (
        <div
          className={`st-cell-editing ${isOddRow ? "st-cell-odd-row" : "st-cell-even-row"}`}
          id={getCellId({ accessor: header.accessor, rowIndex: rowIndex + 1 })}
        >
          <EditableCell onChange={updateLocalContent} setIsEditing={setIsEditing} value={localContent} />
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
        {header.expandable && cellHasChildren ? (
          row.rowMeta.isExpanded ? (
            <div className="st-sort-icon-container" onClick={() => onExpandRowClick(row.rowMeta.rowId)}>
              <AngleDownIcon className="st-sort-icon" />
            </div>
          ) : (
            <div className="st-sort-icon-container" onClick={() => onExpandRowClick(row.rowMeta.rowId)}>
              <AngleRightIcon className="st-sort-icon" />
            </div>
          )
        ) : null}
        <span className="st-cell-content">
          {header.cellRenderer ? header.cellRenderer({ accessor: header.accessor, colIndex, row }) : localContent}
        </span>
      </div>
    );
  }
);

export default TableCell;
