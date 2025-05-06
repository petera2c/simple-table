import { forwardRef, Ref, useEffect, useState, KeyboardEvent, useCallback, useRef } from "react";
import EditableCell from "./editable-cells/EditableCell";
import CellValue from "../../types/CellValue";
import { useThrottle } from "../../utils/performanceUtils";
import useDragHandler from "../../hooks/useDragHandler";
import { DRAG_THROTTLE_LIMIT } from "../../consts/general-consts";
import { getCellId, getCellKey } from "../../utils/cellUtils";
import TableCellProps from "../../types/TableCellProps";
import { useTableContext } from "../../context/TableContext";
import HeaderObject from "../../types/HeaderObject";
import { formatDate } from "../../utils/formatters";

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

const displayContent = ({ content, header }: { content: CellValue; header: HeaderObject }) => {
  if (typeof content === "boolean") {
    return content ? "True" : "False";
  } else if (
    header.type === "date" &&
    content !== null &&
    (typeof content === "string" ||
      typeof content === "number" ||
      (typeof content === "object" && (content as any) instanceof Date))
  ) {
    return formatDate(content);
  }
  return content;
};

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
      cellRegistry,
      cellUpdateFlash,
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
    const [isUpdating, setIsUpdating] = useState(false);
    const updateTimeout = useRef<NodeJS.Timeout | null>(null);

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

    // Generate a unique key that includes the content value to force re-render when it changes
    const cellKey = getCellKey({ rowId: row.rowMeta.rowId, accessor: header.accessor });

    // Register this cell with the cell registry for direct updates
    useEffect(() => {
      if (cellRegistry) {
        const key = `${row.rowMeta.rowId}-${header.accessor}`;
        cellRegistry.set(key, {
          updateContent: (newValue: CellValue) => {
            // If the value is different, trigger the update animation
            if (localContent !== newValue) {
              setLocalContent(newValue);
              if (cellUpdateFlash) {
                setIsUpdating(true);

                // Clear any existing timeout
                if (updateTimeout.current) {
                  clearTimeout(updateTimeout.current);
                }

                // Remove the animation class after animation completes
                updateTimeout.current = setTimeout(() => {
                  setIsUpdating(false);
                }, 800);
              }
            } else {
              setLocalContent(newValue);
            }
          },
        });

        return () => {
          cellRegistry.delete(key);
          // Clear timeout on unmount
          if (updateTimeout.current) {
            clearTimeout(updateTimeout.current);
          }
        };
      }
    }, [cellRegistry, cellUpdateFlash, row.rowMeta.rowId, header.accessor, localContent]);

    // Add another effect to ensure animation gets removed
    useEffect(() => {
      if (isUpdating) {
        const timer = setTimeout(() => {
          setIsUpdating(false);
        }, 850);

        return () => clearTimeout(timer);
      }
    }, [isUpdating]);

    // Update local content when row data changes
    useEffect(() => {
      setLocalContent(row.rowData[header.accessor] as CellValue);
    }, [row.rowData, header.accessor]);

    // If the cell is not highlighted, stop editing
    useEffect(() => {
      if (!isHighlighted) {
        setIsEditing(false);
      }
    }, [isHighlighted]);

    // Derived state
    const isEditInDropdown =
      header.type === "boolean" || header.type === "date" || header.type === "enum";
    const cellHasChildren = Boolean(row.rowMeta?.children?.length);
    const clickable = Boolean(header?.isEditable);

    const cellClassName = `st-cell ${
      depth > 0 && header.expandable ? `st-cell-depth-${depth}` : ""
    } ${
      isHighlighted
        ? isInitialFocused
          ? `st-cell-selected-first ${borderClass}`
          : `st-cell-selected ${borderClass}`
        : ""
    } ${clickable ? "clickable" : ""} ${isUpdating ? "st-cell-updating" : ""}`;

    const updateLocalContent = useCallback(
      (newValue: CellValue) => {
        setLocalContent(newValue);

        onCellEdit?.({
          accessor: header.accessor,
          newValue,
          row,
        });
      },
      [header.accessor, onCellEdit, row]
    );

    // Handle keyboard events when cell is focused
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      // Start editing on F2 or Enter if the cell is editable
      if ((e.key === "F2" || e.key === "Enter") && header.isEditable && !isEditing) {
        e.preventDefault();
        setIsEditing(true);
      }
    };

    if (isEditing && !isEditInDropdown) {
      return (
        <div
          className="st-cell-editing"
          id={getCellId({ accessor: header.accessor, rowIndex: rowIndex + 1 })}
        >
          <EditableCell
            enumOptions={header.enumOptions}
            onChange={updateLocalContent}
            setIsEditing={setIsEditing}
            type={header.type}
            value={localContent}
          />
        </div>
      );
    }

    return (
      <div
        key={cellKey}
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
        data-row-id={row.rowMeta.rowId}
        data-accessor={header.accessor}
      >
        {header.expandable && cellHasChildren ? (
          row.rowMeta.isExpanded ? (
            <div
              className="st-sort-icon-container"
              onClick={() => onExpandRowClick(row.rowMeta.rowId)}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              {collapseIcon}
            </div>
          ) : (
            <div
              className="st-sort-icon-container"
              onClick={() => onExpandRowClick(row.rowMeta.rowId)}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
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
            : displayContent({ content: localContent, header })}
        </span>
        {isEditing && isEditInDropdown && (
          <EditableCell
            enumOptions={header.enumOptions}
            onChange={updateLocalContent}
            setIsEditing={setIsEditing}
            type={header.type}
            value={localContent}
          />
        )}
      </div>
    );
  }
);

export default TableCell;
