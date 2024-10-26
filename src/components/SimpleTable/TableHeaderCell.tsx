import { forwardRef, useRef, SetStateAction, Dispatch, useState } from "react";
import useTableHeaderCell from "../../hooks/useTableHeaderCell";
import { throttle } from "../../utils/performanceUtils";
import HeaderObject from "../../types/HeaderObject";
import AngleUpIcon from "../../icons/AngleUpIcon";
import AngleDownIcon from "../../icons/AngleDownIcon";
import SortConfig from "../../types/SortConfig";

interface TableHeaderCellProps {
  draggedHeaderRef: React.MutableRefObject<HeaderObject | null>;
  enableColumnResizing: boolean;
  forceUpdate: () => void;
  headersRef: React.RefObject<HeaderObject[]>;
  hoveredHeaderRef: React.MutableRefObject<HeaderObject | null>;
  index: number;
  onSort: (columnIndex: number) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  sort: SortConfig | null;
}

const TableHeaderCell = forwardRef<HTMLDivElement, TableHeaderCellProps>(
  (
    {
      draggedHeaderRef,
      enableColumnResizing,
      forceUpdate,
      headersRef,
      hoveredHeaderRef,
      index,
      onSort,
      onTableHeaderDragEnd,
      setIsWidthDragging,
      sort,
    },
    ref
  ) => {
    const prevDraggingPosition = useRef({ pageX: 0, pageY: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const header = headersRef.current?.[index];

    const { handleDragStart, handleDragOver, handleDragEnd } =
      useTableHeaderCell({
        draggedHeaderRef,
        headersRef,
        hoveredHeaderRef,
        onTableHeaderDragEnd,
      });

    const handleDragStartWrapper = (header: HeaderObject) => {
      setIsDragging(true);
      handleDragStart(header);
    };

    const handleDragEndWrapper = () => {
      setIsDragging(false);
      handleDragEnd();
    };

    // Throttle the handleDragOver function
    const throttledHandleDragOver = useRef(
      throttle((header: HeaderObject) => {
        handleDragOver(header);
      }, 100)
    ).current;

    const handleResizeStart = (e: React.MouseEvent) => {
      setIsWidthDragging(true);
      e.preventDefault();
      const startX = e.clientX;
      if (!header) return;
      const startWidth = header.width;

      const throttledMouseMove = throttle((e: MouseEvent) => {
        const newWidth = Math.max(startWidth + (e.clientX - startX), 10); // Ensure a minimum width
        if (!header) return;
        headersRef.current[index].width = newWidth;
        forceUpdate();
      }, 10); // Adjust the throttle delay as needed

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", throttledMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        setIsWidthDragging(false);
      };

      document.addEventListener("mousemove", throttledMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    if (!header) return null;

    console.log(sort);
    return (
      <div
        className={`st-header-cell ${
          header === hoveredHeaderRef.current ? "st-hovered" : ""
        } ${isDragging ? "st-dragging" : ""}`}
        ref={ref}
        style={{ width: header.width }}
      >
        <div
          className="st-header-label"
          draggable
          onClick={() => {
            if (!header.isSortable) return;
            onSort(index);
          }}
          onDragStart={() => handleDragStartWrapper(header)}
          onDragOver={(event) => {
            const { pageX, pageY } = event;
            if (
              pageX === prevDraggingPosition.current.pageX &&
              pageY === prevDraggingPosition.current.pageY
            ) {
              return;
            }
            prevDraggingPosition.current = { pageX, pageY };
            event.preventDefault();
            throttledHandleDragOver(header, event);
          }}
          onDragEnd={handleDragEndWrapper}
        >
          {header?.label}
          {sort && sort.key.accessor === header.accessor && (
            <div className="st-sort-icon-container">
              {sort.direction === "ascending" && (
                <AngleUpIcon className="st-sort-icon" />
              )}
              {sort.direction === "descending" && (
                <AngleDownIcon className="st-sort-icon" />
              )}
            </div>
          )}
        </div>

        {enableColumnResizing && (
          <div
            className="st-header-resize-handle"
            onMouseDown={handleResizeStart}
          />
        )}
      </div>
    );
  }
);

export default TableHeaderCell;
