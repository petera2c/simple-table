import { forwardRef, Ref, useEffect, useState, KeyboardEvent } from "react";
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
      colIndex,
      draggedHeaderRef,
      header,
      headersRef,
      hoveredHeaderRef,
      isSelected,
      isInitialFocusedCell,
      onCellEdit,
      onExpandRowClick,
      onMouseDown,
      onMouseOver,
      onTableHeaderDragEnd,
      rowIndex,
      visibleRow,
    }: TableCellProps,
    ref: Ref<HTMLDivElement>
  ) => {
    const { depth, row } = visibleRow;
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

    // Cell focus id (used for keyboard navigation)
    const cellId = `cell-${rowIndex}-${colIndex}`;

    // Derived state
    const cellHasChildren = Boolean(row.rowMeta?.children?.length);
    const clickable = Boolean(header?.isEditable);
    const isOddRow = rowIndex % 2 === 0;
    const cellClassName = `st-cell ${depth > 0 && header.expandable ? `st-cell-depth-${depth}` : ""} ${
      isSelected
        ? isInitialFocusedCell
          ? `st-cell-selected-first-cell ${borderClass}`
          : `st-cell-selected ${borderClass}`
        : ""
    } ${isOddRow ? "st-cell-odd-row" : "st-cell-even-row"} ${clickable ? "clickable" : ""}`;

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

    // Handle keyboard events when cell is focused
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      // Start editing on F2 or Enter if the cell is editable
      if ((e.key === "F2" || e.key === "Enter") && header.isEditable && !isEditing) {
        e.preventDefault();
        setIsEditing(true);
      }
    };

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
        id={cellId}
        onDoubleClick={() => header.isEditable && setIsEditing(true)}
        onMouseDown={() => onMouseDown({ rowIndex, colIndex, rowId: row.rowMeta.rowId })}
        onMouseOver={() => onMouseOver({ rowIndex, colIndex, rowId: row.rowMeta.rowId })}
        onDragOver={(event) =>
          throttle({
            callback: handleDragOver,
            callbackProps: { event, hoveredHeader: header },
            limit: DRAG_THROTTLE_LIMIT,
          })
        }
        onKeyDown={handleKeyDown}
        ref={ref}
        data-row-index={rowIndex}
        data-col-index={colIndex}
        aria-selected={isSelected}
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
        <span
          className={`st-cell-content ${
            header.align === "right" ? "right-aligned" : header.align === "center" ? "center-aligned" : ""
          }`}
        >
          {header.cellRenderer ? header.cellRenderer({ accessor: header.accessor, colIndex, row }) : localContent}
        </span>
      </div>
    );
  }
);

export default TableCell;
