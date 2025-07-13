import {
  forwardRef,
  DragEvent,
  useEffect,
  ForwardedRef,
  MouseEvent,
  TouchEvent,
  useState,
} from "react";
import useDragHandler from "../../hooks/useDragHandler";
import { useThrottle } from "../../utils/performanceUtils";
import HeaderObject from "../../types/HeaderObject";
import SortConfig from "../../types/SortConfig";
import { DRAG_THROTTLE_LIMIT } from "../../consts/general-consts";
import { getCellId } from "../../utils/cellUtils";
import { getHeaderLeafIndices, getColumnRange } from "../../utils/headerUtils";
import { useTableContext } from "../../context/TableContext";
import { HandleResizeStartProps } from "../../types/HandleResizeStartProps";
import { handleResizeStart } from "../../utils/resizeUtils";
import FilterIcon from "../../icons/FilterIcon";
import Dropdown from "../dropdown/Dropdown";
import FilterDropdown from "../filters/FilterDropdown";
import { FilterCondition } from "../../types/FilterTypes";

interface HeaderCellProps {
  colIndex: number;
  gridColumnEnd: number;
  gridColumnStart: number;
  gridRowEnd: number;
  gridRowStart: number;
  header: HeaderObject;
  reverse?: boolean;
  sort: SortConfig | null;
}

const TableHeaderCell = forwardRef(
  (
    {
      colIndex,
      gridColumnEnd,
      gridColumnStart,
      gridRowEnd,
      gridRowStart,
      header,
      reverse,
      sort,
    }: HeaderCellProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    // Local state for filter dropdown
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    // Get shared props from context
    const {
      columnReordering,
      columnResizing,
      draggedHeaderRef,
      filters,
      handleApplyFilter,
      handleClearFilter,
      headers,
      hoveredHeaderRef,
      onColumnOrderChange,
      onSort,
      onTableHeaderDragEnd,
      previousHeadersRectBounds,
      rowHeight,
      selectColumns,
      selectableColumns,
      setHeaders,
      setInitialFocusedCell,
      setIsResizing,
      setSelectedCells,
      setSelectedColumns,
      sortDownIcon,
      sortUpIcon,
    } = useTableContext();

    // Derived state
    const clickable = Boolean(header?.isSortable);
    const filterable = Boolean(header?.filterable);
    const currentFilter = filters[header.accessor];

    const className = `st-header-cell ${
      header.accessor === hoveredHeaderRef.current?.accessor ? "st-hovered" : ""
    } ${draggedHeaderRef.current?.accessor === header.accessor ? "st-dragging" : ""} ${
      clickable ? "clickable" : ""
    } ${columnReordering && !clickable ? "columnReordering" : ""} ${
      header.children ? "parent" : ""
    }`;

    // Hooks
    const { handleDragStart, handleDragEnd, handleDragOver } = useDragHandler({
      draggedHeaderRef,
      headers,
      hoveredHeaderRef,
      onColumnOrderChange,
      onTableHeaderDragEnd,
    });

    const throttle = useThrottle();

    // Handlers
    const handleDragStartWrapper = (header: HeaderObject) => {
      handleDragStart(header);
    };
    const handleDragEndWrapper = (event: DragEvent) => {
      event.preventDefault();
      handleDragEnd();
    };

    // Filter handlers
    const handleFilterIconClick = (event: MouseEvent) => {
      event.stopPropagation();
      setIsFilterDropdownOpen(!isFilterDropdownOpen);
    };

    const handleApplyFilterWrapper = (filter: FilterCondition) => {
      handleApplyFilter(filter);
      setIsFilterDropdownOpen(false);
    };

    const handleClearFilterWrapper = () => {
      handleClearFilter(header.accessor);
      setIsFilterDropdownOpen(false);
    };

    // Sort and select handler
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
          setSelectedColumns((prevSelected: Set<number>) => {
            // If no columns are currently selected, just select the clicked columns
            if (prevSelected.size === 0) {
              return new Set(columnsToSelect);
            }

            // Find the nearest column index in the existing selection
            const currentColumnIndex = columnsToSelect[0]; // Use first column as reference
            const selectedIndices = Array.from(prevSelected).sort((a: number, b: number) => a - b);

            let nearestIndex = selectedIndices[0]; // Default to first selected column
            let minDistance = Math.abs(currentColumnIndex - nearestIndex);

            // Find the nearest column to the currently clicked one
            selectedIndices.forEach((index: number) => {
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

        // Clear the selected cells
        setSelectedCells(new Set());
        setInitialFocusedCell(null);
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
        className="st-header-resize-handle-container"
        onMouseDown={(event: MouseEvent) => {
          throttle({
            callback: handleResizeStart,
            callbackProps: {
              event: event.nativeEvent,
              gridColumnEnd,
              gridColumnStart,
              header,
              headers,
              setHeaders,
              setIsResizing,
              previousHeadersRectBounds,
              startWidth:
                typeof ref === "object" && ref !== null && "current" in ref
                  ? ref.current?.offsetWidth
                  : undefined,
            } as HandleResizeStartProps,
            limit: 10,
          });
        }}
        onTouchStart={(event: TouchEvent) => {
          throttle({
            callback: handleResizeStart,
            callbackProps: {
              event,
              gridColumnEnd,
              gridColumnStart,
              header,
              headers,
              setHeaders,
              setIsResizing,
              previousHeadersRectBounds,
              startWidth:
                typeof ref === "object" && ref !== null && "current" in ref
                  ? ref.current?.offsetWidth
                  : undefined,
            } as HandleResizeStartProps,
            limit: 10,
          });
        }}
      >
        <div className="st-header-resize-handle" />
      </div>
    );

    const SortIcon = sort && sort.key.accessor === header.accessor && (
      <div
        className="st-icon-container"
        onClick={(event) => handleColumnHeaderClick({ event, header })}
      >
        {sort.direction === "ascending" && sortUpIcon && sortUpIcon}
        {sort.direction === "descending" && sortDownIcon && sortDownIcon}
      </div>
    );

    const FilterIconComponent = filterable && (
      <div className="st-icon-container" onClick={handleFilterIconClick}>
        <FilterIcon
          className="st-header-icon"
          style={{
            fill: currentFilter
              ? "var(--st-button-active-background-color)"
              : "var(--st-header-icon-color)",
          }}
        />

        <Dropdown
          open={isFilterDropdownOpen}
          overflow="visible"
          setOpen={setIsFilterDropdownOpen}
          onClose={() => setIsFilterDropdownOpen(false)}
        >
          <FilterDropdown
            header={header}
            currentFilter={currentFilter}
            onApplyFilter={handleApplyFilterWrapper}
            onClearFilter={handleClearFilterWrapper}
          />
        </Dropdown>
      </div>
    );

    return (
      <div
        className={className}
        id={getCellId({ accessor: header.accessor, rowId: "header" })}
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
        {header.align === "right" && FilterIconComponent}
        {header.align === "right" && SortIcon}
        <div
          className="st-header-label"
          draggable={columnReordering && !header.disableReorder}
          onClick={(event) => handleColumnHeaderClick({ event, header })}
          onDragEnd={handleDragEndWrapper}
          onDragStart={onDragStart}
        >
          <span
            className={`st-header-label-text ${
              header.align === "right"
                ? "right-aligned"
                : header.align === "center"
                ? "center-aligned"
                : "left-aligned"
            }`}
          >
            {header.headerRenderer
              ? header.headerRenderer({ accessor: header.accessor, colIndex, header })
              : header?.label}
          </span>
        </div>
        {header.align !== "right" && SortIcon}
        {header.align !== "right" && FilterIconComponent}

        {!reverse && ResizeHandle}
      </div>
    );
  }
);

export default TableHeaderCell;
