import { forwardRef, LegacyRef, useState, useRef } from "react";
import useTableHeaderCell from "../../hooks/useTableHeaderCell";
import { throttle } from "../../utils/performanceUtils"; // Import the throttle function
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
    ref: LegacyRef<HTMLTableCellElement>
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const header = headersRef.current?.[index];
    const { handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
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
      throttle((header: HeaderObject, event: React.DragEvent) => {
        handleDragOver(header, event);
      }, 500) // Adjust the delay as needed
    ).current;
    if (!header) return null;

    return (
      <th
        className={`table-header-cell ${
          header === hoveredHeaderRef.current ? "hovered" : ""
        } ${isDragging ? "dragging" : ""}`}
        key={header?.accessor}
        draggable
        onDragStart={() => handleDragStartWrapper(header)}
        onDragOver={(event) => throttledHandleDragOver(header, event)}
        onDrop={() => handleDrop(header)}
        onDragEnd={handleDragEndWrapper}
        onClick={() => onSort(index)}
        ref={ref}
      >
        {header?.label}
      </th>
    );
  }
);

export default TableHeaderCell;
