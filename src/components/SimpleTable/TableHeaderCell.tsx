import { forwardRef, useRef, SetStateAction, Dispatch, useState } from "react";
import useTableHeaderCell from "../../hooks/useTableHeaderCell";
import { throttle } from "../../utils/performanceUtils";
import HeaderObject from "../../types/HeaderObject";

interface TableHeaderCellProps {
  draggedHeaderRef: React.MutableRefObject<HeaderObject | null>;
  forceUpdate: () => void;
  headersRef: React.RefObject<HeaderObject[]>;
  hoveredHeaderRef: React.MutableRefObject<HeaderObject | null>;
  index: number;
  onSort: (columnIndex: number) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
}

const TableHeaderCell = forwardRef<HTMLDivElement, TableHeaderCellProps>(
  (
    {
      draggedHeaderRef,
      forceUpdate,
      headersRef,
      hoveredHeaderRef,
      index,
      onSort,
      onTableHeaderDragEnd,
      setIsWidthDragging,
    },
    ref
  ) => {
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

    return (
      <div
        className={`st-table-header-cell ${
          header === hoveredHeaderRef.current ? "st-hovered" : ""
        } ${isDragging ? "st-dragging" : ""}`}
        ref={ref}
        style={{ width: header.width }}
      >
        <div
          className="st-table-header-label"
          draggable
          onClick={() => onSort(index)}
          onDragStart={() => handleDragStartWrapper(header)}
          onDragOver={(event) => {
            event.preventDefault();
            throttledHandleDragOver(header, event);
          }}
          onDragEnd={handleDragEndWrapper}
        >
          {header?.label}
        </div>
        <div
          className="st-table-header-resize-handle"
          onMouseDown={handleResizeStart}
        />
      </div>
    );
  }
);

export default TableHeaderCell;
