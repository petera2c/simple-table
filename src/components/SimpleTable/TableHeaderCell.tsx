import {
  forwardRef,
  LegacyRef,
  useState,
  useRef,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import useTableHeaderCell from "../../hooks/useTableHeaderCell";
import { throttle } from "../../utils/performanceUtils";
import HeaderObject from "../../types/HeaderObject";

interface TableHeaderCellProps {
  draggedHeaderRef: React.MutableRefObject<HeaderObject | null>;
  headers: HeaderObject[];
  hoveredHeaderRef: React.MutableRefObject<HeaderObject | null>;
  index: number;
  onSort: (columnIndex: number) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  setHeaders: Dispatch<SetStateAction<HeaderObject[]>>;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
}

const TableHeaderCell = forwardRef<HTMLDivElement, TableHeaderCellProps>(
  (
    {
      draggedHeaderRef,
      headers,
      hoveredHeaderRef,
      index,
      onSort,
      onTableHeaderDragEnd,
      setHeaders,
      setIsWidthDragging,
    },
    ref
  ) => {
    const header = headers[index];

    const { handleDragStart, handleDragOver, handleDragEnd } =
      useTableHeaderCell({
        draggedHeaderRef,
        headers,
        hoveredHeaderRef,
        onTableHeaderDragEnd,
      });

    const handleDragStartWrapper = (header: HeaderObject) => {
      handleDragStart(header);
    };

    const handleDragEndWrapper = () => {
      handleDragEnd();
    };

    // Throttle the handleDragOver function
    const throttledHandleDragOver = useRef(
      throttle((header: HeaderObject) => {
        handleDragOver(header);
      }, 50) // Adjust the delay as needed
    ).current;

    const handleResizeStart = (e: React.MouseEvent) => {
      setIsWidthDragging(true);
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = header.width;

      const throttledMouseMove = throttle((e: MouseEvent) => {
        const newWidth = Math.max(startWidth + (e.clientX - startX), 10); // Ensure a minimum width
        setHeaders((prevHeaders) => {
          const updatedHeaders = [...prevHeaders];
          updatedHeaders[index] = { ...updatedHeaders[index], width: newWidth };
          return updatedHeaders;
        });
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
        }`}
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
