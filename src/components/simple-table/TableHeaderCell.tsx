import {
  cloneElement,
  DragEvent,
  useEffect,
  MouseEvent,
  TouchEvent,
  useState,
  useMemo,
  useCallback,
} from "react";
import useDragHandler from "../../hooks/useDragHandler";
import { useThrottle } from "../../utils/performanceUtils";
import HeaderObject, { DEFAULT_SHOW_WHEN } from "../../types/HeaderObject";
import SortColumn from "../../types/SortColumn";
import { DRAG_THROTTLE_LIMIT } from "../../consts/general-consts";
import { getCellId } from "../../utils/cellUtils";
import { getHeaderLeafIndices, getColumnRange } from "../../utils/headerUtils";
import { useTableContext } from "../../context/TableContext";
import { HandleResizeStartProps } from "../../types/HandleResizeStartProps";
import { handleResizeStart } from "../../utils/resizeUtils";
import Dropdown from "../dropdown/Dropdown";
import FilterDropdown from "../filters/FilterDropdown";
import { FilterCondition } from "../../types/FilterTypes";
import { Animate } from "../LazyComponents";
import Checkbox from "../Checkbox";
import StringEdit from "./editable-cells/StringEdit";
import useDropdownPosition from "../../hooks/useDropdownPosition";
import { hasCollapsibleChildren } from "../../utils/collapseUtils";
import Tooltip from "../Tooltip";

interface HeaderCellProps {
  colIndex: number;
  gridColumnEnd: number;
  gridColumnStart: number;
  gridRowEnd: number;
  gridRowStart: number;
  header: HeaderObject;
  parentHeader?: HeaderObject;
  reverse?: boolean;
  sort: SortColumn | null;
}

const TableHeaderCell = ({
  colIndex,
  gridColumnEnd,
  gridColumnStart,
  gridRowEnd,
  gridRowStart,
  header,
  parentHeader,
  reverse,
  sort,
}: HeaderCellProps) => {
  // Local state for filter dropdown and editing
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localLabel, setLocalLabel] = useState(header.label || "");

  // Get shared props from context
  const {
    activeHeaderDropdown,
    areAllRowsSelected,
    autoExpandColumns,
    collapsedHeaders,
    columnBorders,
    columnReordering,
    columnResizing,
    columnsWithSelectedCells,
    draggedHeaderRef,
    enableHeaderEditing,
    enableRowSelection,
    filterIcon,
    filters,
    handleApplyFilter,
    handleClearFilter,
    handleSelectAll,
    headerCollapseIcon,
    headerDropdown,
    headerExpandIcon,
    headerRegistry,
    headers,
    hoveredHeaderRef,
    onColumnOrderChange,
    onColumnSelect,
    onHeaderEdit,
    onSort,
    onTableHeaderDragEnd,
    headerHeight,
    selectColumns,
    selectableColumns,
    selectedColumns,
    setActiveHeaderDropdown,
    setCollapsedHeaders,
    setHeaders,
    setInitialFocusedCell,
    setIsResizing,
    setSelectedCells,
    setSelectedColumns,
    sortDownIcon,
    sortUpIcon,
    tableBodyContainerRef,
  } = useTableContext();

  // Derived state
  const clickable = Boolean(header?.isSortable);
  const filterable = Boolean(header?.filterable);
  const currentFilter = filters[header.accessor];
  const isDropdownOpen = activeHeaderDropdown?.accessor === header.accessor;

  // Check if this is the selection column
  const isSelectionColumn = header.isSelectionColumn && enableRowSelection;

  // Collapse state
  const isCollapsible = hasCollapsibleChildren(header);
  const isCollapsed = collapsedHeaders.has(header.accessor);

  // Hook for dropdown positioning
  const { triggerRef: headerCellRef, position: dropdownPosition } = useDropdownPosition({
    isOpen: isDropdownOpen,
    estimatedHeight: 200,
    estimatedWidth: 250,
    margin: 4,
  });

  // Determine if this is the last column in its section for column borders
  const isLastColumnInSection = useMemo(() => {
    if (!columnBorders) return false;

    const pinnedLeftColumns = headers.filter((h) => h.pinned === "left");
    const mainColumns = headers.filter((h) => !h.pinned);
    const pinnedRightColumns = headers.filter((h) => h.pinned === "right");

    if (header.pinned === "left") {
      return pinnedLeftColumns[pinnedLeftColumns.length - 1]?.accessor === header.accessor;
    } else if (header.pinned === "right") {
      return pinnedRightColumns[pinnedRightColumns.length - 1]?.accessor === header.accessor;
    } else {
      return mainColumns[mainColumns.length - 1]?.accessor === header.accessor;
    }
  }, [columnBorders, headers, header.accessor, header.pinned]);

  // Check if this header is selected (for styling)
  const isHeaderSelected = useMemo(() => {
    if (!selectableColumns || isSelectionColumn) return false;

    const columnsToSelect = getHeaderLeafIndices(header, colIndex);
    return columnsToSelect.some((columnIndex) => selectedColumns.has(columnIndex));
  }, [selectableColumns, isSelectionColumn, header, colIndex, selectedColumns]);

  // Check if this header has any highlighted cells in its column(s)
  // For parent headers, this checks all descendant columns
  const hasHighlightedCell = useMemo(() => {
    if (isSelectionColumn) return false;

    // Get all leaf column indices for this header (includes descendants for parent headers)
    const columnsToCheck = getHeaderLeafIndices(header, colIndex);

    // Check if ANY of those columns have selected cells
    return columnsToCheck.some((columnIndex) => columnsWithSelectedCells.has(columnIndex));
  }, [isSelectionColumn, header, colIndex, columnsWithSelectedCells]);

  // Check if header has visible children (considering collapsed state)
  const hasVisibleChildren = useMemo(() => {
    if (!header.children || header.children.length === 0) return false;

    // If collapsed, check if any children are visible when collapsed
    if (isCollapsed) {
      return header.children.some((child) => {
        const showWhen = child.showWhen || DEFAULT_SHOW_WHEN;
        return showWhen === "parentCollapsed" || showWhen === "always";
      });
    }

    // If not collapsed, has visible children if it has any children
    return true;
  }, [header.children, isCollapsed]);

  // Check if this is a sub-header (child of a parent with singleRowChildren)
  const isSubHeader = parentHeader?.singleRowChildren;

  // Don't apply "parent" class if the parent has singleRowChildren (to remove bottom border)
  const shouldApplyParentClass = hasVisibleChildren && !header.singleRowChildren;

  const className = `st-header-cell ${
    header.accessor === hoveredHeaderRef.current?.accessor ? "st-hovered" : ""
  } ${draggedHeaderRef.current?.accessor === header.accessor ? "st-dragging" : ""} ${
    clickable ? "clickable" : ""
  } ${columnReordering && !clickable ? "columnReordering" : ""} ${
    shouldApplyParentClass ? "parent" : ""
  } ${isSubHeader ? "st-sub-header" : ""} ${isLastColumnInSection ? "st-last-column" : ""} ${
    enableHeaderEditing && !isSelectionColumn ? "st-header-editable" : ""
  } ${isHeaderSelected ? "st-header-selected" : ""} ${
    hasHighlightedCell && !isHeaderSelected ? "st-header-has-highlighted-cell" : ""
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

  // Register this header cell with the header registry for API access
  useEffect(() => {
    if (headerRegistry && !header.isSelectionColumn) {
      const key = String(header.accessor);
      headerRegistry.set(key, {
        setEditing: (editing: boolean) => {
          setIsEditing(editing);
        },
      });

      return () => {
        headerRegistry.delete(key);
      };
    }
  }, [headerRegistry, header.accessor, header.isSelectionColumn]);

  // Update local label when header label changes
  useEffect(() => {
    setLocalLabel(header.label || "");
  }, [header.label]);

  // Handlers
  const handleDragStartWrapper = (header: HeaderObject) => {
    handleDragStart(header);
  };
  const handleDragEndWrapper = (event: DragEvent) => {
    event.preventDefault();
    handleDragEnd();
  };

  // Filter handlers
  const handleFilterIconClick = (event: MouseEvent | React.KeyboardEvent) => {
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

  // Update header label handler
  const updateHeaderLabel = useCallback(
    (newLabel: string) => {
      setLocalLabel(newLabel);
      // Update the header object
      const updatedHeaders = headers.map((h) =>
        h.accessor === header.accessor ? { ...h, label: newLabel } : h
      );
      setHeaders(updatedHeaders);

      // Call the header edit callback if provided
      if (onHeaderEdit) {
        onHeaderEdit(header, newLabel);
      }
    },
    [headers, setHeaders, onHeaderEdit, header]
  );

  // Handle header dropdown toggle
  // const handleHeaderDropdownToggle = useCallback(() => {
  //   if (setActiveHeaderDropdown) {
  //     setActiveHeaderDropdown(isDropdownOpen ? null : header);
  //   }
  // }, [setActiveHeaderDropdown, isDropdownOpen, header]);

  // Close header dropdown
  const handleHeaderDropdownClose = useCallback(() => {
    if (setActiveHeaderDropdown) {
      setActiveHeaderDropdown(null);
    }
  }, [setActiveHeaderDropdown]);

  // Handle collapse/expand toggle
  const handleCollapseToggle = useCallback(
    (event: MouseEvent | React.KeyboardEvent) => {
      event.stopPropagation();
      setCollapsedHeaders((prev) => {
        const newSet = new Set(prev);
        if (isCollapsed) {
          newSet.delete(header.accessor);
        } else {
          newSet.add(header.accessor);
        }
        return newSet;
      });
    },
    [setCollapsedHeaders, isCollapsed, header.accessor]
  );

  // Sort and select handler
  const handleColumnHeaderClick = ({
    event,
    header,
  }: {
    event: MouseEvent;
    header: HeaderObject;
  }) => {
    // If this is the selection column, don't handle column selection
    if (header.isSelectionColumn) {
      return;
    }

    if (selectableColumns) {
      // Get all column indices that should be selected (including children)
      const columnsToSelect = getHeaderLeafIndices(header, colIndex);

      // Check if this header is already selected and header editing is enabled
      const isHeaderAlreadySelected = columnsToSelect.some((columnIndex) =>
        selectedColumns.has(columnIndex)
      );

      if (enableHeaderEditing && isHeaderAlreadySelected && !event.shiftKey) {
        // Start editing the header label instead of re-selecting

        // Handle header dropdown toggle if dropdown component is provided
        if (headerDropdown) {
          // If dropdown is already open for this header, close it on second click
          if (isDropdownOpen) handleHeaderDropdownClose();
        }

        setIsEditing(true);
        return;
      }

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
    }

    // Call onColumnSelect callback if provided
    if (onColumnSelect) {
      onColumnSelect(header);
    }

    // If selectableColumns is disabled, handle sorting on single click
    if (!selectableColumns && header.isSortable) {
      onSort(header.accessor);
    }
  };

  // Double-click handler for sorting when selectableColumns is enabled
  const handleColumnHeaderDoubleClick = ({
    event,
    header,
  }: {
    event: MouseEvent;
    header: HeaderObject;
  }) => {
    // If this is the selection column, don't handle sorting
    if (header.isSelectionColumn) {
      return;
    }

    // Only handle sorting on double-click when selectableColumns is enabled
    if (selectableColumns && header.isSortable) {
      onSort(header.accessor);
    }
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

  const ResizeHandle = columnResizing && !isSelectionColumn && (
    <div
      className="st-header-resize-handle-container"
      role="separator"
      aria-label={`Resize ${header.label} column`}
      aria-orientation="vertical"
      onMouseDown={(event: MouseEvent) => {
        // Get the start width from the DOM element directly if ref is not available
        const startWidth = document.getElementById(
          getCellId({ accessor: header.accessor, rowId: "header" })
        )?.offsetWidth;

        throttle({
          callback: handleResizeStart,
          callbackProps: {
            event: event.nativeEvent,
            header,
            headers,
            setHeaders,
            setIsResizing,
            tableBodyContainerRef,
            startWidth,
            collapsedHeaders,
            autoExpandColumns,
            reverse,
          } as HandleResizeStartProps,
          limit: 10,
        });
      }}
      onTouchStart={(event: TouchEvent) => {
        // Get the start width from the DOM element directly if ref is not available
        const startWidth = document.getElementById(
          getCellId({ accessor: header.accessor, rowId: "header" })
        )?.offsetWidth;

        throttle({
          callback: handleResizeStart,
          callbackProps: {
            event,
            header,
            headers,
            setHeaders,
            setIsResizing,
            tableBodyContainerRef,
            startWidth,
            collapsedHeaders,
            autoExpandColumns,
            reverse,
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
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onSort(header.accessor);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Sort ${header.label} ${sort.direction === "asc" ? "descending" : "ascending"}`}
    >
      {sort.direction === "asc" && sortUpIcon && sortUpIcon}
      {sort.direction === "desc" && sortDownIcon && sortDownIcon}
    </div>
  );

  const FilterIconComponent = filterable && filterIcon && (
    <div
      className="st-icon-container"
      onClick={handleFilterIconClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleFilterIconClick(e);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Filter ${header.label}`}
      aria-expanded={isFilterDropdownOpen}
      aria-haspopup="dialog"
    >
      {cloneElement(filterIcon as React.ReactElement, {
        style: {
          fill: currentFilter
            ? "var(--st-button-active-background-color)"
            : "var(--st-header-icon-color)",
        },
      })}

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

  const CollapseIconComponent = isCollapsible && !isSelectionColumn && (
    <div
      className="st-icon-container st-collapse-icon-container"
      onClick={(event: MouseEvent) => handleCollapseToggle(event)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCollapseToggle(e);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${header.label} column`}
      aria-expanded={!isCollapsed}
    >
      {isCollapsed ? headerCollapseIcon : headerExpandIcon}
    </div>
  );

  // Handle select all checkbox change
  const handleSelectAllChange = (checked: boolean) => {
    if (handleSelectAll) {
      handleSelectAll(checked);
    }
  };

  // Create the default label content for headerRenderer
  const labelContent = (
    <Tooltip content={header.tooltip || ""}>
      <span
        className={`st-header-label-text ${
          header.align === "right"
            ? "right-aligned"
            : header.align === "center"
            ? "center-aligned"
            : "left-aligned"
        }`}
      >
        {isSelectionColumn ? (
          <Checkbox
            checked={areAllRowsSelected ? areAllRowsSelected() : false}
            onChange={handleSelectAllChange}
            ariaLabel="Select all rows"
          />
        ) : isEditing ? (
          <StringEdit
            defaultValue={localLabel}
            onBlur={() => setIsEditing(false)}
            onChange={updateHeaderLabel}
          />
        ) : (
          localLabel || header?.label
        )}
      </span>
    </Tooltip>
  );

  // Determine aria-sort value
  const getAriaSort = () => {
    if (!header.isSortable) return undefined;
    if (sort?.key.accessor === header.accessor) {
      return sort.direction === "asc" ? "ascending" : "descending";
    }
    return "none";
  };

  return (
    <Animate
      className={className}
      id={getCellId({ accessor: header.accessor, rowId: "header" })}
      aria-sort={getAriaSort()}
      aria-colindex={colIndex + 1}
      onDragOver={(event) => {
        if (!isSelectionColumn) {
          throttle({
            callback: handleDragOver,
            callbackProps: { event, hoveredHeader: header },
            limit: DRAG_THROTTLE_LIMIT,
          });
        }
      }}
      style={{
        gridRowStart,
        gridRowEnd,
        gridColumnStart,
        gridColumnEnd,
        ...(gridRowEnd - gridRowStart > 1 ? {} : { height: headerHeight }),
      }}
    >
      {reverse && ResizeHandle}
      {!header.headerRenderer && header.align === "right" && CollapseIconComponent}
      {!header.headerRenderer && header.align === "right" && FilterIconComponent}
      {!header.headerRenderer && header.align === "right" && SortIcon}
      <div
        ref={headerCellRef}
        className="st-header-label"
        draggable={columnReordering && !header.disableReorder && !isSelectionColumn}
        onClick={(event) => {
          if (!isSelectionColumn) {
            handleColumnHeaderClick({ event, header });
          }
        }}
        onDoubleClick={(event) => {
          if (!isSelectionColumn) {
            handleColumnHeaderDoubleClick({ event, header });
          }
        }}
        onDragEnd={!isSelectionColumn ? handleDragEndWrapper : undefined}
        onDragStart={!isSelectionColumn ? onDragStart : undefined}
      >
        {header.headerRenderer
          ? header.headerRenderer({
              accessor: header.accessor,
              colIndex,
              header,
              components: {
                sortIcon: SortIcon || undefined,
                filterIcon: FilterIconComponent || undefined,
                collapseIcon: CollapseIconComponent || undefined,
                labelContent,
              },
            })
          : labelContent}
      </div>
      {!header.headerRenderer && header.align !== "right" && SortIcon}
      {!header.headerRenderer && header.align !== "right" && FilterIconComponent}
      {!header.headerRenderer && header.align !== "right" && CollapseIconComponent}

      {!reverse && ResizeHandle}

      {/* Header dropdown component */}
      {headerDropdown && !isSelectionColumn && (
        <div className="st-header-dropdown-container">
          {headerDropdown({
            accessor: header.accessor,
            colIndex,
            header,
            isOpen: isDropdownOpen,
            onClose: handleHeaderDropdownClose,
            position: dropdownPosition,
          })}
        </div>
      )}
    </Animate>
  );
};

export default TableHeaderCell;
