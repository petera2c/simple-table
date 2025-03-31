import {
  forwardRef,
  SetStateAction,
  Dispatch,
  useState,
  ReactNode,
  DragEvent,
  useEffect,
  ForwardedRef,
  MouseEvent,
  RefObject,
} from "react";
import useDragHandler from "../../hooks/useDragHandler";
import { useThrottle } from "../../utils/performanceUtils";
import HeaderObject from "../../types/HeaderObject";
import SortConfig from "../../types/SortConfig";
import OnSortProps from "../../types/OnSortProps";
import Row from "../../types/Row";
import { handleResizeStart } from "../../utils/sortUtils";
import { DRAG_THROTTLE_LIMIT } from "../../consts/general-consts";
import { getCellId } from "../../utils/cellUtils";

interface TableHeaderCellProps {
  columnResizing: boolean;
  currentRows: Row[];
  columnReordering: boolean;
  draggedHeaderRef: RefObject<HeaderObject | null>;
  forceUpdate: () => void;
  headersRef: RefObject<HeaderObject[]>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  index: number;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  reverse?: boolean;
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
      columnReordering,
      draggedHeaderRef,
      forceUpdate,
      headersRef,
      hoveredHeaderRef,
      index,
      onSort,
      onTableHeaderDragEnd,
      reverse,
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
    const className = `st-header-cell ${header === hoveredHeaderRef.current ? "st-hovered" : ""} ${
      isDragging ? "st-dragging" : ""
    } ${clickable ? "clickable" : ""} ${columnReordering && !clickable ? "columnReordering" : ""} ${
      header?.align === "right" ? "right-aligned" : ""
    }`;

    // Hooks
    const { handleDragStart, handleDragEnd } = useDragHandler({
      draggedHeaderRef,
      headersRef,
      hoveredHeaderRef,
      onTableHeaderDragEnd,
    });
    const { handleDragOver } = useDragHandler({
      draggedHeaderRef,
      headersRef,
      hoveredHeaderRef,
      onTableHeaderDragEnd,
    });
    const throttle = useThrottle();

    // Handlers
    const handleDragStartWrapper = (header: HeaderObject) => {
      setIsDragging(true);
      handleDragStart(header);
    };
    const handleDragEndWrapper = (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      handleDragEnd();
    };

    // Sort handler
    const handleColumnHeaderClick = ({ event, header }: { event: MouseEvent; header: HeaderObject }) => {
      if (selectableColumns) {
        const rowCount = currentRows.length;
        const newColumnCells = Array.from({ length: rowCount }, (_, rowIndex) => `${rowIndex}-${index}`);

        const selectCellsInRange = (startColumnIndex: number, endColumnIndex: number): Set<string> => {
          const selectedCells = new Set<string>();
          const minColumnIndex = Math.min(startColumnIndex, endColumnIndex);
          const maxColumnIndex = Math.max(startColumnIndex, endColumnIndex);

          Array.from({ length: rowCount }).forEach((_, rowIndex) => {
            Array.from({ length: maxColumnIndex - minColumnIndex + 1 }).forEach((_, offset) => {
              selectedCells.add(`${rowIndex}-${minColumnIndex + offset}`);
            });
          });

          return selectedCells;
        };

        if (event.shiftKey) {
          setSelectedCells((prevSelectedCells) => {
            const firstPrevColumnIndex = Number(Array.from(prevSelectedCells)[0]?.split("-")[1]);
            const newFirstColumnIndex = Number(newColumnCells[0].split("-")[1]);

            if (firstPrevColumnIndex === newFirstColumnIndex) {
              return new Set(newColumnCells);
            } else if (firstPrevColumnIndex > newFirstColumnIndex) {
              return selectCellsInRange(newFirstColumnIndex, firstPrevColumnIndex);
            } else {
              return selectCellsInRange(firstPrevColumnIndex, newFirstColumnIndex);
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

    if (!header) return null;

    const ResizeHandle = columnResizing && (
      <div
        className="st-header-resize-handle"
        onMouseDown={(event) => {
          throttle({
            callback: handleResizeStart,
            callbackProps: {
              event,
              forceUpdate,
              header,
              headersRef,
              index,
              setIsWidthDragging,
            },
            limit: 10,
          });
        }}
      />
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
        style={{ width: header.width }}
      >
        {reverse && ResizeHandle}
        <div
          className="st-header-label"
          draggable={columnReordering}
          onClick={(event) => handleColumnHeaderClick({ event, header })}
          onDragEnd={handleDragEndWrapper}
          onDragStart={onDragStart}
        >
          {header?.label}
        </div>
        {sort && sort.key.accessor === header.accessor && (
          <div className="st-sort-icon-container" onClick={(event) => handleColumnHeaderClick({ event, header })}>
            {sort.direction === "ascending" && sortUpIcon && sortUpIcon}
            {sort.direction === "descending" && sortDownIcon && sortDownIcon}
          </div>
        )}
        {!reverse && ResizeHandle}
      </div>
    );
  }
);

export default TableHeaderCell;
