import { forwardRef, LegacyRef, useState, useRef, useEffect } from "react";
import useTableHeaderCell from "../../hooks/useTableHeaderCell";
import { throttle } from "../../utils/performanceUtils";
import HeaderObject from "../../types/HeaderObject";

interface TableHeaderCellProps {
  draggedHeaderRef: React.MutableRefObject<HeaderObject | null>;
  headersRef: React.RefObject<HeaderObject[]>;
  hoveredHeaderRef: React.MutableRefObject<HeaderObject | null>;
  index: number;
  onDragEnd: (newHeaders: HeaderObject[]) => void;
  onSort: (columnIndex: number) => void;
}

const TableHeaderCell = forwardRef(
  (
    {
      draggedHeaderRef,
      headersRef,
      hoveredHeaderRef,
      index,
      onDragEnd,
      onSort,
    }: TableHeaderCellProps,
    ref: any
  ) => {
    const header = headersRef.current?.[index];

    const [isDragging, setIsDragging] = useState(false);
    const [width, setWidth] = useState<string | number | undefined>(
      header?.width
    );
    const { handleDragStart, handleDragOver, handleDragEnd } =
      useTableHeaderCell({
        draggedHeaderRef,
        headersRef,
        hoveredHeaderRef,
        onDragEnd,
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
      }, 50) // Adjust the delay as needed
    ).current;

    const handleResizeStart = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      document.addEventListener("mousemove", handleResizing);
      document.addEventListener("mouseup", handleResizeEnd);
    };

    const handleResizing = (event: MouseEvent) => {
      const newWidth =
        event.clientX - ref?.current?.getBoundingClientRect().left;
      console.log(newWidth);
      setWidth(newWidth);
    };

    const handleResizeEnd = () => {
      document.removeEventListener("mousemove", handleResizing);
      document.removeEventListener("mouseup", handleResizeEnd);
    };

    if (!header) return null;

    return (
      <th
        className={`st-th ${
          header === hoveredHeaderRef.current ? "st-hovered" : ""
        } ${isDragging ? "st-dragging" : ""}`}
        key={header?.accessor}
        onClick={() => onSort(index)}
        ref={ref}
        style={{ width: width ? `${width}px` : "auto" }}
      >
        <div
          className="st-table-header-label"
          draggable
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
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "5px",
            cursor: "col-resize",
          }}
        />
      </th>
    );
  }
);

export default TableHeaderCell;
