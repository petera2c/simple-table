import { forwardRef, Ref, useEffect, useState, KeyboardEvent } from "react";
import EditableCell from "./editable-cells/EditableCell";
import CellValue from "../../types/CellValue";
import { useThrottle } from "../../utils/performanceUtils";
import useDragHandler from "../../hooks/useDragHandler";
import { DRAG_THROTTLE_LIMIT } from "../../consts/general-consts";
import { getCellId } from "../../utils/cellUtils";
import TableCellProps from "../../types/TableCellProps";
import { useTableContext } from "../../context/TableContext";

// Define minimal props that are specific to each cell
interface MinimalCellProps {
  borderClass: string;
  colIndex: number;
  header: TableCellProps["header"];
  isHighlighted: boolean;
  isInitialFocused: boolean;
  onExpandRowClick: TableCellProps["onExpandRowClick"];
  rowIndex: number;
  visibleRow: TableCellProps["visibleRow"];
}

const TableCell = forwardRef(
  (
    {
      borderClass,
      colIndex,
      header,
      isHighlighted,
      isInitialFocused,
      onExpandRowClick,
      rowIndex,
      visibleRow,
    }: MinimalCellProps,
    ref: Ref<HTMLDivElement>
  ) => {
    // Get shared props from context
    const {
      collapseIcon,
      draggedHeaderRef,
      expandIcon,
      handleMouseDown,
      handleMouseOver,
      headersRef,
      hoveredHeaderRef,
      onCellEdit,
      onTableHeaderDragEnd,
    } = useTableContext();

    const { depth, row } = visibleRow;
    // Local state
    const [localContent, setLocalContent] = useState<CellValue>(
      row.rowData[header.accessor] as CellValue
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

    // Cell focus id (used for keyboard navigation)
    const cellId = `cell-${rowIndex}-${colIndex}`;

    // Derived state
    const cellHasChildren = Boolean(row.rowMeta?.children?.length);
    const clickable = Boolean(header?.isEditable);

    // Use the absolute position value from visibleRow for stable odd/even determination
    const isOddRow = visibleRow.position % 2 === 0;

    const cellClassName = `st-cell ${
      depth > 0 && header.expandable ? `st-cell-depth-${depth}` : ""
    } ${
      isHighlighted
        ? isInitialFocused
          ? `st-cell-selected-first ${borderClass}`
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
        id={cellId}
        onDoubleClick={() => header.isEditable && setIsEditing(true)}
        onMouseDown={() => handleMouseDown({ rowIndex, colIndex, rowId: row.rowMeta.rowId })}
        onMouseOver={() => handleMouseOver({ rowIndex, colIndex, rowId: row.rowMeta.rowId })}
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
        aria-selected={isHighlighted}
      >
        {header.expandable && cellHasChildren ? (
          row.rowMeta.isExpanded ? (
            <div
              className="st-sort-icon-container"
              onClick={() => onExpandRowClick(row.rowMeta.rowId)}
            >
              {collapseIcon}
            </div>
          ) : (
            <div
              className="st-sort-icon-container"
              onClick={() => onExpandRowClick(row.rowMeta.rowId)}
            >
              {expandIcon}
            </div>
          )
        ) : null}
        <span
          className={`st-cell-content ${
            header.align === "right"
              ? "right-aligned"
              : header.align === "center"
              ? "center-aligned"
              : ""
          }`}
        >
          {header.cellRenderer
            ? header.cellRenderer({ accessor: header.accessor, colIndex, row })
            : localContent}
        </span>
      </div>
    );
  }
);

export default TableCell;
