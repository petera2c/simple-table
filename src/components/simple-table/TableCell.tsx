import { useEffect, useState, KeyboardEvent, useCallback, useRef } from "react";
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
import { getRowId, hasNestedRows } from "../../utils/rowUtils";
import Animate from "../animate/Animate";
import Checkbox from "../Checkbox";

const displayContent = ({ content, header }: { content: CellValue; header: HeaderObject }) => {
  if (typeof content === "boolean") {
    return content ? "True" : "False";
  } else if (Array.isArray(content)) {
    // Handle arrays by joining elements with commas
    if (content.length === 0) {
      return "[]";
    }
    return content
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          // For objects, show a JSON representation or customize as needed
          return JSON.stringify(item);
        }
        return String(item);
      })
      .join(", ");
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

const TableCell = ({
  borderClass,
  colIndex,
  header,
  isHighlighted,
  isInitialFocused,
  nestedIndex,
  rowIndex,
  tableRow,
}: TableCellProps) => {
  // Get shared props from context
  const {
    cellRegistry,
    cellUpdateFlash,
    draggedHeaderRef,
    enableRowSelection,
    expandIcon,
    handleMouseDown,
    handleMouseOver,
    handleRowSelect,
    headers,
    hoveredHeaderRef,
    isCopyFlashing,
    isRowSelected,
    isWarningFlashing,
    onCellEdit,
    onCellClick,
    onTableHeaderDragEnd,
    rowGrouping,
    rowIdAccessor,
    setUnexpandedRows,
    tableBodyContainerRef,
    theme,
    unexpandedRows,
    useOddColumnBackground,
  } = useTableContext();

  const { depth, row } = tableRow;

  // Local state
  const [localContent, setLocalContent] = useState<CellValue>(row[header.accessor] as CellValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);

  // Get row ID and check if row has children
  const rowId = getRowId({ row, rowIdAccessor });
  const currentGroupingKey = rowGrouping && rowGrouping[depth];
  const cellHasChildren = currentGroupingKey ? hasNestedRows(row, currentGroupingKey) : false;
  const isRowExpanded = !unexpandedRows.has(String(rowId));

  // Check if this cell is currently flashing from copy operation
  const isCellCopyFlashing = isCopyFlashing({ rowIndex, colIndex, rowId });

  // Check if this cell is currently showing warning flash
  const isCellWarningFlashing = isWarningFlashing({ rowIndex, colIndex, rowId });

  // Hooks
  const { handleDragOver } = useDragHandler({
    draggedHeaderRef,
    headers,
    hoveredHeaderRef,
    onTableHeaderDragEnd,
  });
  const throttle = useThrottle();

  // Cell focus id (used for keyboard navigation)
  const cellId = getCellId({ accessor: header.accessor, rowId });

  // Generate a unique key that includes the content value to force re-render when it changes
  const cellKey = getCellKey({ rowId, accessor: header.accessor });

  // Check if this is the selection column
  const isSelectionColumn = header.isSelectionColumn && enableRowSelection;

  // Register this cell with the cell registry for direct updates
  useEffect(() => {
    if (cellRegistry) {
      const key = `${rowId}-${header.accessor}`;
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
  }, [cellRegistry, cellUpdateFlash, rowId, header.accessor, localContent]);

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
    setLocalContent(row[header.accessor] as CellValue);
  }, [row, header.accessor]);

  // Derived state
  const isEditInDropdown =
    header.type === "boolean" || header.type === "date" || header.type === "enum";
  const clickable = Boolean(header?.isEditable);

  const cellClassName = `st-cell ${
    depth > 0 && header.expandable ? `st-cell-depth-${depth}` : ""
  } ${
    isHighlighted
      ? isInitialFocused
        ? `st-cell-selected-first ${borderClass}`
        : `st-cell-selected ${borderClass}`
      : ""
  } ${clickable ? "clickable" : ""} ${
    isUpdating ? (isInitialFocused ? "st-cell-updating-first" : "st-cell-updating") : ""
  } ${
    isCellCopyFlashing ? (isInitialFocused ? "st-cell-copy-flash-first" : "st-cell-copy-flash") : ""
  } ${
    isCellWarningFlashing
      ? isInitialFocused
        ? "st-cell-warning-flash-first"
        : "st-cell-warning-flash"
      : ""
  } ${useOddColumnBackground ? (nestedIndex % 2 === 0 ? "even-column" : "odd-column") : ""} ${
    isSelectionColumn ? "st-selection-cell" : ""
  }`;

  const updateContent = useCallback(
    (newValue: CellValue) => {
      setLocalContent(newValue);
      row[header.accessor] = newValue;

      onCellEdit?.({
        accessor: header.accessor,
        newValue,
        row,
        rowIndex,
      });
    },
    [header.accessor, onCellEdit, row, rowIndex]
  );

  // Handle row expansion
  const handleRowExpansion = useCallback(() => {
    setUnexpandedRows((prev) => {
      const newSet = new Set(prev);
      const rowIdStr = String(rowId);
      if (newSet.has(rowIdStr)) {
        newSet.delete(rowIdStr);
      } else {
        newSet.add(rowIdStr);
      }
      return newSet;
    });
  }, [rowId, setUnexpandedRows]);

  // Handle keyboard events when cell is focused
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // If we're editing or this is a selection column, don't handle table navigation keys
    if (isEditing || isSelectionColumn) {
      return;
    }

    // Start editing on F2 or Enter if the cell is editable
    if ((e.key === "F2" || e.key === "Enter") && header.isEditable && !isEditing) {
      e.preventDefault();
      setIsEditing(true);
    }
  };

  // Handle mouse down - only if not editing and not selection column
  const handleCellMouseDown = () => {
    if (!isEditing && !isSelectionColumn) {
      handleMouseDown({ rowIndex, colIndex, rowId });
    }
  };

  // Handle mouse over - only if not editing and not selection column
  const handleCellMouseOver = () => {
    if (!isEditing && !isSelectionColumn) {
      handleMouseOver({ rowIndex, colIndex, rowId });
    }
  };

  // Handle row selection checkbox change
  const handleRowCheckboxChange = (checked: boolean) => {
    if (handleRowSelect) {
      handleRowSelect(String(rowId), checked);
    }
  };

  // Handle cell click callback
  const handleCellClick = () => {
    if (onCellClick && !isSelectionColumn) {
      onCellClick({
        accessor: header.accessor,
        colIndex,
        row,
        rowId,
        rowIndex,
        value: localContent,
      });
    }
  };

  // Don't handle cell editing for selection column
  if (isEditing && !isEditInDropdown && !isSelectionColumn) {
    return (
      <div
        className="st-cell-editing"
        id={getCellId({ accessor: header.accessor, rowId })}
        onMouseDown={(e) => e.stopPropagation()} // Prevent cell selection when clicking in edit mode
        onKeyDown={(e) => e.stopPropagation()} // Prevent table navigation when editing
      >
        <EditableCell
          enumOptions={header.enumOptions}
          onChange={updateContent}
          setIsEditing={setIsEditing}
          type={header.type}
          value={localContent}
        />
      </div>
    );
  }

  return (
    <Animate
      className={cellClassName}
      data-accessor={header.accessor}
      data-col-index={colIndex}
      data-row-id={rowId}
      data-row-index={rowIndex}
      id={cellId}
      key={cellKey}
      onClick={handleCellClick}
      onDoubleClick={() => header.isEditable && !isSelectionColumn && setIsEditing(true)}
      onDragOver={(event) => {
        if (!isSelectionColumn) {
          throttle({
            callback: handleDragOver,
            callbackProps: { event, hoveredHeader: header },
            limit: DRAG_THROTTLE_LIMIT,
          });
        }
      }}
      onKeyDown={handleKeyDown}
      onMouseDown={handleCellMouseDown}
      onMouseOver={handleCellMouseOver}
      parentRef={tableBodyContainerRef}
      tableRow={tableRow}
    >
      {header.expandable && cellHasChildren ? (
        <div
          className={`st-icon-container st-expand-icon-container ${
            isRowExpanded ? "expanded" : "collapsed"
          }`}
          onClick={handleRowExpansion}
        >
          {expandIcon}
        </div>
      ) : null}

      <span
        className={`st-cell-content ${
          header.align === "right"
            ? "right-aligned"
            : header.align === "center"
            ? "center-aligned"
            : "left-aligned"
        }`}
      >
        <span>
          {isSelectionColumn ? (
            <Checkbox
              checked={isRowSelected ? isRowSelected(String(rowId)) : false}
              onChange={handleRowCheckboxChange}
            />
          ) : header.cellRenderer ? (
            header.cellRenderer({ accessor: header.accessor, colIndex, row, theme })
          ) : (
            displayContent({ content: localContent, header })
          )}
        </span>
      </span>

      {isEditing && isEditInDropdown && !isSelectionColumn && (
        <EditableCell
          enumOptions={header.enumOptions}
          onChange={updateContent}
          setIsEditing={setIsEditing}
          type={header.type}
          value={localContent}
        />
      )}
    </Animate>
  );
};

export default TableCell;
