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
}

const TableHeaderCell = forwardRef(
  (
    {
      draggedHeaderRef,
      headers,
      hoveredHeaderRef,
      index,
      onSort,
      onTableHeaderDragEnd,
      setHeaders,
    }: TableHeaderCellProps,
    ref: any
  ) => {
    const header = headers[index];

    const [isDragging, setIsDragging] = useState(false);
    const { handleDragStart, handleDragOver, handleDragEnd } =
      useTableHeaderCell({
        draggedHeaderRef,
        headers,
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
      if (!isNaN(newWidth)) {
        setHeaders((headers) => {
          const newHeaders = [...headers];
          newHeaders[index].width = newWidth;
          return newHeaders;
        });
      }
    };

    const handleResizeEnd = () => {
      document.removeEventListener("mousemove", handleResizing);
      document.removeEventListener("mouseup", handleResizeEnd);
    };

    if (!header) return null;

    return (
      <div
        className={`st-th ${
          header === hoveredHeaderRef.current ? "st-hovered" : ""
        } ${isDragging ? "st-dragging" : ""}`}
        key={header?.accessor}
        ref={ref}
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
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "5px",
            cursor: "col-resize",
          }}
        />
      </div>
    );
  }
);

export default TableHeaderCell;
