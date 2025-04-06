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
import { createSetString } from "../../hooks/useSelection";
import { getHeaderLeafIndices, getColumnRange } from "../../utils/headerUtils";

export interface TableHeaderCellProps {
  colIndex: number;
  columnReordering: boolean;
  columnResizing: boolean;
  currentRows: Row[];
  draggedHeaderRef: RefObject<HeaderObject | null>;
  forceUpdate: () => void;
  gridColumnEnd: number;
  gridColumnStart: number;
  gridRowEnd: number;
  gridRowStart: number;
  header: HeaderObject;
  headersRef: RefObject<HeaderObject[]>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  reverse?: boolean;
  rowHeight: number;
  selectableColumns: boolean;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  setSelectedColumns: Dispatch<SetStateAction<Set<number>>>;
  sort: SortConfig | null;
  sortDownIcon?: ReactNode;
  sortUpIcon?: ReactNode;
  lastSelectedColumnIndex?: number | null;
  selectColumns?: (columnIndices: number[], isShiftKey?: boolean) => void;
}

const TableHeaderCell = forwardRef(
  (
    {
      colIndex,
      columnReordering,
      columnResizing,
      currentRows,
      draggedHeaderRef,
      forceUpdate,
      gridColumnEnd,
      gridColumnStart,
      gridRowEnd,
      gridRowStart,
      header,
      headersRef,
      hoveredHeaderRef,
      onColumnOrderChange,
      onSort,
      onTableHeaderDragEnd,
      reverse,
      rowHeight,
      selectableColumns,
      setIsWidthDragging,
      setSelectedColumns,
      sort,
      sortDownIcon,
      sortUpIcon,
      lastSelectedColumnIndex,
      selectColumns,
    }: TableHeaderCellProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    // Local state
    const [isDragging, setIsDragging] = useState(false);

    // Derived state
    const clickable = Boolean(header?.isSortable);
    const className = `st-header-cell ${header === hoveredHeaderRef.current ? "st-hovered" : ""} ${
      isDragging ? "st-dragging" : ""
    } ${clickable ? "clickable" : ""} ${columnReordering && !clickable ? "columnReordering" : ""} ${
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
      setIsDragging(true);
      handleDragStart(header);
    };
    const handleDragEndWrapper = (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      handleDragEnd();
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
        // Get all column indices that should be selected (including children)
        const columnsToSelect = getHeaderLeafIndices(header, colIndex);

        if (event.shiftKey && selectColumns) {
          // If shift key is pressed and we have columns already selected
          setSelectedColumns((prevSelected) => {
            // If no columns are currently selected, just select the clicked columns
            if (prevSelected.size === 0) {
              return new Set(columnsToSelect);
            }

            // Find the nearest column index in the existing selection
            const currentColumnIndex = columnsToSelect[0]; // Use first column as reference
            const selectedIndices = Array.from(prevSelected).sort((a, b) => a - b);

            let nearestIndex = selectedIndices[0]; // Default to first selected column
            let minDistance = Math.abs(currentColumnIndex - nearestIndex);

            // Find the nearest column to the currently clicked one
            selectedIndices.forEach((index) => {
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
        onMouseDown={(event) => {
          throttle({
            callback: handleResizeStart,
            callbackProps: {
              colIndex,
              event,
              forceUpdate,
              header,
              headersRef,
              setIsWidthDragging,
              startWidth:
                typeof ref === "object" && ref !== null && "current" in ref
                  ? ref.current?.offsetWidth
                  : undefined,
            },
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
          draggable={columnReordering}
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
