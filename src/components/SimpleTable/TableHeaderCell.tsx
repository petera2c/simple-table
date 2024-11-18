/* eslint-disable */
import {
  forwardRef,
  useRef,
  SetStateAction,
  Dispatch,
  useState,
  ReactNode,
  DragEvent,
  useEffect,
  ForwardedRef,
  MouseEvent,
} from "react";
import useTableHeaderCell from "../../hooks/useTableHeaderCell";
import { throttle } from "../../utils/performanceUtils";
import HeaderObject from "../../types/HeaderObject";
import SortConfig from "../../types/SortConfig";
import OnSortProps from "../../types/OnSortProps";
import Row from "../../types/Row";
import OnDragOverProps from "../../types/OnDragOverProps";
import { useOnDragOver } from "../../hooks/useOnDragOver";

interface TableHeaderCellProps {
  columnResizing: boolean;
  currentRows: Row[];
  draggable: boolean;
  draggedHeaderRef: React.MutableRefObject<HeaderObject | null>;
  forceUpdate: () => void;
  headersRef: React.RefObject<HeaderObject[]>;
  hoveredHeaderRef: React.MutableRefObject<HeaderObject | null>;
  index: number;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  selectableColumns: boolean;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  setSelectedCells: Dispatch<React.SetStateAction<Set<string>>>;
  sort: SortConfig | null;
  sortDownIcon?: ReactNode;
  sortUpIcon?: ReactNode;
}

const TableHeaderCell = forwardRef(
  (
    {
      columnResizing,
      currentRows,
      draggable,
      draggedHeaderRef,
      forceUpdate,
      headersRef,
      hoveredHeaderRef,
      index,
      onSort,
      onTableHeaderDragEnd,
      selectableColumns,
      setIsWidthDragging,
      setSelectedCells,
      sort,
      sortDownIcon,
      sortUpIcon,
    }: TableHeaderCellProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
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
    const { onDragOver } = useOnDragOver();

    const handleDragStartWrapper = (header: HeaderObject) => {
      setIsDragging(true);
      handleDragStart(header);
    };

    const handleDragEndWrapper = (event: DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      setIsDragging(false);
      handleDragEnd();
    };

    // Throttle the handleDragOver function
    const throttledHandleDragOver = useRef(
      throttle((header: HeaderObject) => {
        handleDragOver(header);
      }, 10)
    ).current;

    // Resize handler
    const handleResizeStart = (e: MouseEvent) => {
      setIsWidthDragging(true);
      e.preventDefault();
      const startX = e.clientX;
      if (!header) return;
      const startWidth = header.width;

      const throttledMouseMove = throttle((e: MouseEvent) => {
        const newWidth = Math.max(startWidth + (e.clientX - startX), 40); // Ensure a minimum width
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
    // Sort handler
    const handleColumnHeaderClick = ({
      event,
      header,
    }: {
      event: MouseEvent;
      header: HeaderObject;
    }) => {
      if (selectableColumns) {
        const rowCount = currentRows.length;
        const newColumnCells = Array.from(
          { length: rowCount },
          (_, rowIndex) => `${rowIndex}-${index}`
        );

        const selectCellsInRange = (
          startColumnIndex: number,
          endColumnIndex: number
        ): Set<string> => {
          const selectedCells = new Set<string>();
          const minColumnIndex = Math.min(startColumnIndex, endColumnIndex);
          const maxColumnIndex = Math.max(startColumnIndex, endColumnIndex);

          Array.from({ length: rowCount }).forEach((_, rowIndex) => {
            Array.from({ length: maxColumnIndex - minColumnIndex + 1 }).forEach(
              (_, offset) => {
                selectedCells.add(`${rowIndex}-${minColumnIndex + offset}`);
              }
            );
          });

          return selectedCells;
        };

        if (event.shiftKey) {
          setSelectedCells((prevSelectedCells) => {
            const firstPrevColumnIndex = Number(
              Array.from(prevSelectedCells)[0]?.split("-")[1]
            );
            const newFirstColumnIndex = Number(newColumnCells[0].split("-")[1]);

            if (firstPrevColumnIndex === newFirstColumnIndex) {
              return new Set(newColumnCells);
            } else if (firstPrevColumnIndex > newFirstColumnIndex) {
              return selectCellsInRange(
                newFirstColumnIndex,
                firstPrevColumnIndex
              );
            } else {
              return selectCellsInRange(
                firstPrevColumnIndex,
                newFirstColumnIndex
              );
            }
          });
        } else {
          setSelectedCells(new Set(newColumnCells));
        }
        return;
      }
      if (!header.isSortable) return;
      onSort(index, header.accessor);
    };
    // Drag handler
    const onDragStart = (event: DragEvent) => {
      if (!draggable || !header) return;
      // This helps prevent the drag ghost from being shown
      event.dataTransfer.dropEffect = "move";

      handleDragStartWrapper(header);
    };

    // This helps prevent the drag ghost from being shown
    useEffect(() => {
      const setDragImage = (event: any) => {
        var img = new Image();
        img.src =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
        event.dataTransfer.setDragImage(img, 0, 0);
      };
      document.addEventListener("dragend", setDragImage, false);
      return () => {
        document.removeEventListener("dragend", setDragImage);
      };
    }, []);

    if (!header) return null;

    return (
      <div
        className={className}
        onDragOver={(event) =>
          onDragOver({ event, header, throttledHandleDragOver })
        }
        ref={ref}
        style={{ width: header.width }}
      >
        <div
          className="st-header-label"
          draggable={draggable}
          onClick={(event) => handleColumnHeaderClick({ event, header })}
          onDragEnd={handleDragEndWrapper}
          onDragStart={onDragStart}
          onMouseEnter={() => (document.body.style.overflow = "hidden")}
          onMouseLeave={() => (document.body.style.overflow = "auto")}
        >
          {header?.label}
        </div>
        {sort && sort.key.accessor === header.accessor && (
          <div
            className="st-sort-icon-container"
            onClick={(event) => handleColumnHeaderClick({ event, header })}
          >
            {sort.direction === "ascending" && sortUpIcon && sortUpIcon}
            {sort.direction === "descending" && sortDownIcon && sortDownIcon}
          </div>
        )}

        {columnResizing && (
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
