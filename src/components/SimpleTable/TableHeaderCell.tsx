import {
  forwardRef,
  useRef,
  SetStateAction,
  Dispatch,
  useState,
  ReactNode,
  DragEvent,
} from "react";
import useTableHeaderCell from "../../hooks/useTableHeaderCell";
import { throttle } from "../../utils/performanceUtils";
import HeaderObject from "../../types/HeaderObject";
import SortConfig from "../../types/SortConfig";
import OnSortProps from "../../types/OnSortProps";

interface TableHeaderCellProps {
  draggable: boolean;
  draggedHeaderRef: React.MutableRefObject<HeaderObject | null>;
  enableColumnResizing: boolean;
  forceUpdate: () => void;
  headersRef: React.RefObject<HeaderObject[]>;
  hoveredHeaderRef: React.MutableRefObject<HeaderObject | null>;
  index: number;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  sort: SortConfig | null;
  sortDownIcon?: ReactNode;
  sortUpIcon?: ReactNode;
}

const TableHeaderCell = forwardRef<HTMLDivElement, TableHeaderCellProps>(
  (
    {
      draggable,
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
      sortDownIcon,
      sortUpIcon,
    },
    ref
  ) => {
    // Ref
    const prevDraggingPosition = useRef({ pageX: 0, pageY: 0 });

    // Local state
    const [isDragging, setIsDragging] = useState(false);

    // Derived state
    const header = headersRef.current?.[index];
    const clickable = Boolean(header?.isSortable);
    const className = `st-header-cell ${
      header === hoveredHeaderRef.current ? "st-hovered" : ""
    } ${isDragging ? "st-dragging" : ""} ${clickable ? "clickable" : ""} ${
      draggable && !clickable ? "draggable" : ""
    }`;

    // Handlers
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

    const handleDragEndWrapper = (event: DragEvent) => {
      event.dataTransfer.dropEffect = "move";
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

    // useEffect(() => {
    //   console.log("currentRef", currentRef);
    //   if (currentRef) {
    //     currentRef.style.transition = "none";
    //   }
    // }, [currentRef]);

    if (!header) return null;

    return (
      <div
        className={className}
        ref={ref}
        style={{ width: header.width, transition: "none" }}
      >
        <div
          className="st-header-label"
          draggable={draggable}
          onClick={() => {
            if (!header.isSortable) return;
            onSort(index, header.accessor);
          }}
          onDragStart={(event) => {
            if (!draggable) return;
            event.dataTransfer.dropEffect = "move";

            handleDragStartWrapper(header);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";

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
              {sort.direction === "ascending" && sortUpIcon && sortUpIcon}
              {sort.direction === "descending" && sortDownIcon && sortDownIcon}
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
