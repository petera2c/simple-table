import { forwardRef, DragEvent, useEffect, ForwardedRef, MouseEvent } from "react";
import useDragHandler from "../../hooks/useDragHandler";
import { useThrottle } from "../../utils/performanceUtils";
import HeaderObject from "../../types/HeaderObject";
import SortConfig from "../../types/SortConfig";
import { DRAG_THROTTLE_LIMIT } from "../../consts/general-consts";
import { getCellId } from "../../utils/cellUtils";
import { getHeaderLeafIndices, getColumnRange } from "../../utils/headerUtils";
import { useTableContext } from "../../context/TableContext";
import { HandleResizeStartProps } from "../../types/HandleResizeStartProps";
import { handleResizeStart } from "../../utils/resizeUtils";

interface HeaderCellProps {
  colIndex: number;
  forceHeadersUpdate: () => void;
  gridColumnEnd: number;
  gridColumnStart: number;
  gridRowEnd: number;
  gridRowStart: number;
  header: HeaderObject;
  reverse?: boolean;
  sort: SortConfig | null;
}

const TableHeaderCell = forwardRef(
  (
    {
      colIndex,
      forceHeadersUpdate,
      gridColumnEnd,
      gridColumnStart,
      gridRowEnd,
      gridRowStart,
      header,
      reverse,
      sort,
    }: HeaderCellProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    // Get shared props from context
    const {
      columnReordering,
      columnResizing,
      draggedHeaderRef,
      forceUpdate,
      headersRef,
      hoveredHeaderRef,
      onColumnOrderChange,
      onSort,
      onTableHeaderDragEnd,
      rowHeight,
      selectColumns,
      selectableColumns,
      setInitialFocusedCell,
      setIsWidthDragging,
      setPinnedLeftWidth,
      setPinnedRightWidth,
      setSelectedCells,
      setSelectedColumns,
      sortDownIcon,
      sortUpIcon,
    } = useTableContext();

    // Derived state
    const clickable = Boolean(header?.isSortable);
    const className = `st-header-cell ${
      header.accessor === hoveredHeaderRef.current?.accessor ? "st-hovered" : ""
    } ${draggedHeaderRef.current?.accessor === header.accessor ? "st-dragging" : ""} ${
      clickable ? "clickable" : ""
    } ${columnReordering && !clickable ? "columnReordering" : ""} ${
      header?.align === "right"
        ? "right-aligned"
        : header?.align === "center"
        ? "center-aligned"
        : ""
    }`;

    // Hooks
    const { handleDragStart, handleDragEnd, handleDragOver } = useDragHandler({
      draggedHeaderRef,
      headersRef,
      hoveredHeaderRef,
      onColumnOrderChange,
      onTableHeaderDragEnd,
    });

    const throttle = useThrottle();

    // Handlers
    const handleDragStartWrapper = (header: HeaderObject) => {
      handleDragStart(header);
    };
    const handleDragEndWrapper = (event: DragEvent) => {
      event.preventDefault();
      handleDragEnd();
      forceHeadersUpdate();
    };

    // Sort and select handler
    const handleColumnHeaderClick = ({
      event,
      header,
    }: {
      event: MouseEvent;
      header: HeaderObject;
    }) => {
      if (selectableColumns) {
        // Get all column indices that should be selected (including children)
        const columnsToSelect = getHeaderLeafIndices(header, colIndex);

        if (event.shiftKey && selectColumns) {
          // If shift key is pressed and we have columns already selected
          setSelectedColumns((prevSelected: Set<number>) => {
            // If no columns are currently selected, just select the clicked columns
            if (prevSelected.size === 0) {
              return new Set(columnsToSelect);
            }

            // Find the nearest column index in the existing selection
            const currentColumnIndex = columnsToSelect[0]; // Use first column as reference
            const selectedIndices = Array.from(prevSelected).sort((a: number, b: number) => a - b);

            let nearestIndex = selectedIndices[0]; // Default to first selected column
            let minDistance = Math.abs(currentColumnIndex - nearestIndex);

            // Find the nearest column to the currently clicked one
            selectedIndices.forEach((index: number) => {
              const distance = Math.abs(currentColumnIndex - index);
              if (distance < minDistance) {
                minDistance = distance;
                nearestIndex = index;
              }
            });

            // Get all columns in the range between nearest and current
            const columnsInRange = getColumnRange(nearestIndex, currentColumnIndex);

            // Add all columns in the selected header
            const allColumnsToSelect = [...columnsInRange, ...columnsToSelect];

            // Create a new set with all existing selections plus the new range
            const newSelection = new Set([...Array.from(prevSelected), ...allColumnsToSelect]);
            return newSelection;
          });
        } else if (selectColumns) {
          // Regular click - just select the columns under this header
          selectColumns(columnsToSelect);
        }

        // Clear the selected cells
        setSelectedCells(new Set());
        setInitialFocusedCell(null);
        return;
      }

      if (!header.isSortable) return;
      onSort(colIndex, header.accessor);
    };
    // Drag handler
    const onDragStart = (event: DragEvent) => {
      if (!columnReordering || !header) return;

      handleDragStartWrapper(header);
    };

    // This helps prevent the drag ghost from being shown
    useEffect(() => {
      const dragOverImageRemoval = (event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      };

      document.addEventListener("dragover", dragOverImageRemoval);

      return () => {
        document.removeEventListener("dragover", dragOverImageRemoval);
      };
    }, []);

    if (!header) {
      return null;
    }

    const ResizeHandle = columnResizing && (
      <div
        className="st-header-resize-handle"
        onMouseDown={(event: MouseEvent) => {
          throttle({
            callback: handleResizeStart,
            callbackProps: {
              event: event.nativeEvent,
              forceUpdate,
              header,
              headersRef,
              gridColumnEnd,
              gridColumnStart,
              setIsWidthDragging,
              setPinnedLeftWidth,
              setPinnedRightWidth,
              startWidth:
                typeof ref === "object" && ref !== null && "current" in ref
                  ? ref.current?.offsetWidth
                  : undefined,
            } as HandleResizeStartProps,
            limit: 10,
          });
        }}
      />
    );

    const SortIcon = sort && sort.key.accessor === header.accessor && (
      <div
        className="st-sort-icon-container"
        onClick={(event) => handleColumnHeaderClick({ event, header })}
      >
        {sort.direction === "ascending" && sortUpIcon && sortUpIcon}
        {sort.direction === "descending" && sortDownIcon && sortDownIcon}
      </div>
    );

    return (
      <div
        className={className}
        id={getCellId({ accessor: header.accessor, rowIndex: 0 })}
        onDragOver={(event) => {
          throttle({
            callback: handleDragOver,
            callbackProps: { event, hoveredHeader: header },
            limit: DRAG_THROTTLE_LIMIT,
          });
        }}
        ref={ref}
        style={{
          gridRowStart,
          gridRowEnd,
          gridColumnStart,
          gridColumnEnd,
          ...(gridColumnEnd - gridColumnStart > 1 ? {} : { width: header.width }),
          ...(gridRowEnd - gridRowStart > 1 ? {} : { height: rowHeight }),
        }}
      >
        {reverse && ResizeHandle}
        <div
          className={`st-header-label ${
            header.align === "right"
              ? "right-aligned"
              : header.align === "center"
              ? "center-aligned"
              : ""
          }`}
          draggable={columnReordering && !header.disableReorder}
          onClick={(event) => handleColumnHeaderClick({ event, header })}
          onDragEnd={handleDragEndWrapper}
          onDragStart={onDragStart}
        >
          {header.align === "right" && SortIcon}
          {header?.label}
          {header.align !== "right" && SortIcon}
        </div>

        {!reverse && ResizeHandle}
      </div>
    );
  }
);

export default TableHeaderCell;
