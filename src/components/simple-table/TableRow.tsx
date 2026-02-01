import React from "react";
import type TableRowType from "../../types/TableRow";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";
import RenderCells from "./RenderCells";
import { Pinned } from "../../types/Pinned";
import HeaderObject from "../../types/HeaderObject";
import ColumnIndices from "../../types/ColumnIndices";
import RowIndices from "../../types/RowIndices";
import { useTableContext } from "../../context/TableContext";
import { rowIdToString } from "../../utils/rowUtils";
import RowStateIndicator from "./RowStateIndicator";
import { ROW_SEPARATOR_WIDTH } from "../../consts/general-consts";
import NestedGridRow from "./NestedGridRow";

// Define just the props needed for RenderCells
interface TableRowProps {
  columnIndexStart?: number;
  columnIndices: ColumnIndices;
  gridTemplateColumns: string;
  headers: HeaderObject[];
  index: number;
  pinned?: Pinned;
  rowHeight: number;
  rowIndices: RowIndices;
  setHoveredIndex: (index: number | null) => void;
  tableRow: TableRowType;
  isSticky?: boolean;
  stickyIndex?: number;
  stickyOffset?: number;
}

const TableRow = ({
  columnIndices,
  columnIndexStart,
  gridTemplateColumns,
  headers,
  index,
  pinned,
  rowHeight,
  rowIndices,
  setHoveredIndex,
  tableRow,
  isSticky = false,
  stickyIndex = 0,
  stickyOffset = 0,
}: TableRowProps) => {
  const {
    customTheme,
    emptyStateRenderer,
    errorStateRenderer,
    heightOffsets,
    isAnimating,
    isRowSelected,
    loadingStateRenderer,
    maxHeaderDepth,
    rows,
    useHoverRowBackground,
    useOddEvenRowBackground,
  } = useTableContext();
  const { position, displayPosition, stateIndicator, nestedTable } = tableRow;

  // If this is a nested grid row, render it differently
  if (nestedTable) {
    // Determine which section should show the nested grid
    // For simplicity, show in all sections (main, left, right) but only render content in main
    const shouldShowNestedGrid = !pinned; // Only show in main section
    if (shouldShowNestedGrid) {
      return (
        <NestedGridRow
          calculatedHeight={nestedTable.calculatedHeight}
          childAccessor={nestedTable.childAccessor}
          depth={tableRow.depth - 1} // Pass parent depth
          expandableHeader={nestedTable.expandableHeader}
          index={index}
          parentRow={nestedTable.parentRow}
          position={position}
        />
      );
    }

    // For pinned sections, render an empty spacer row
    return (
      <div
        className="st-row st-nested-grid-spacer"
        data-index={index}
        style={{
          gridTemplateColumns,
          transform: `translate3d(0, ${calculateRowTopPosition({ position, rowHeight, heightOffsets, customTheme })}px, 0)`,
          height: `${nestedTable.calculatedHeight}px`,
        }}
      />
    );
  }

  // If this is a state indicator row, render it differently
  if (stateIndicator) {
    // Determine which section should show the indicator
    // triggerSection indicates where the expansion was initiated
    const shouldShowIndicator = stateIndicator.state.triggerSection === pinned;

    if (shouldShowIndicator) {
      // Check if any renderer is defined for the current state
      const hasRenderer =
        (stateIndicator.state.loading && loadingStateRenderer) ||
        (stateIndicator.state.error && errorStateRenderer) ||
        (stateIndicator.state.isEmpty && emptyStateRenderer);

      // If no renderer is defined, render an empty spacer row
      if (!hasRenderer) {
        return (
          <div
            className="st-row st-state-row-spacer"
            data-index={index}
            style={{
              gridTemplateColumns,
              transform: `translate3d(0, ${calculateRowTopPosition({ position, rowHeight, heightOffsets, customTheme })}px, 0)`,
              height: `${rowHeight}px`,
            }}
          />
        );
      }

      // Get the parent row from rows using the parentRowId
      // parentRowId is a string like "0" or "1-stores-5", so we compare it directly
      const parentRow = rows.find((r, index) => rowIdToString([index]) === stateIndicator.parentRowId);

      return (
        <div
          className="st-row st-state-row"
          data-index={index}
          style={{
            gridTemplateColumns,
            transform: `translate3d(0, ${calculateRowTopPosition({ position, rowHeight, heightOffsets, customTheme })}px, 0)`,
            height: `${rowHeight}px`,
          }}
        >
          <RowStateIndicator
            parentRow={parentRow || {}}
            rowState={stateIndicator.state}
            gridTemplateColumns={gridTemplateColumns}
            loadingStateRenderer={loadingStateRenderer}
            errorStateRenderer={errorStateRenderer}
            emptyStateRenderer={emptyStateRenderer}
          />
        </div>
      );
    }

    // For other sections, render an empty row to maintain scroll alignment
    return (
      <div
        className="st-row st-state-row-spacer"
        data-index={index}
        style={{
          gridTemplateColumns,
          transform: `translate3d(0, ${calculateRowTopPosition({ position, rowHeight, heightOffsets, customTheme })}px, 0)`,
          height: `${rowHeight}px`,
        }}
      />
    );
  }

  // For regular rows, calculate row properties
  const isOdd = position % 2 === 0;

  // Get stable row ID for key (includes path for nested rows)
  const rowId = rowIdToString(tableRow.rowId);

  // Check if this row is selected
  const isSelected = isRowSelected ? isRowSelected(rowId) : false;

  // Calculate row style based on whether it's sticky or regular
  const rowStyle = isSticky
    ? {
        gridTemplateColumns,
        transform: `translateY(${stickyIndex * (rowHeight + ROW_SEPARATOR_WIDTH) + stickyOffset}px)`,
        height: `${rowHeight}px`,
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
      }
    : {
        gridTemplateColumns,
        top: calculateRowTopPosition({ position, rowHeight, heightOffsets, customTheme }),
        height: `${rowHeight}px`,
      };

  return (
    <div
      className={`st-row ${isSticky ? "st-sticky-parent" : ""} ${
        useOddEvenRowBackground ? (isOdd ? "even" : "odd") : ""
      } ${isSelected ? "selected" : ""}`}
      data-index={index}
      aria-rowindex={position + maxHeaderDepth + 1}
      onMouseEnter={() => {
        // Don't apply hover effects during animations
        if (!isAnimating && useHoverRowBackground) {
          setHoveredIndex(index);
        }
      }}
      style={rowStyle}
    >
      <RenderCells
        columnIndexStart={columnIndexStart}
        columnIndices={columnIndices}
        displayRowNumber={displayPosition}
        headers={headers}
        key={rowId}
        pinned={pinned}
        rowIndex={position}
        rowIndices={rowIndices}
        tableRow={tableRow}
      />
    </div>
  );
};

/**
 * Custom comparison function for TableRow memoization
 * Compares row props to determine if re-render is needed
 * Prevents unnecessary re-renders when scrolling through virtualized list
 */
const arePropsEqual = (prevProps: TableRowProps, nextProps: TableRowProps): boolean => {
  // Check index and row position
  if (
    prevProps.index !== nextProps.index ||
    prevProps.tableRow.position !== nextProps.tableRow.position ||
    prevProps.tableRow.displayPosition !== nextProps.tableRow.displayPosition
  ) {
    return false;
  }

  // Check if the actual row data changed
  if (prevProps.tableRow.row !== nextProps.tableRow.row) {
    return false;
  }

  // Check if state indicator changed (for loading/error/empty rows)
  if (prevProps.tableRow.stateIndicator !== nextProps.tableRow.stateIndicator) {
    return false;
  }

  // Check row height
  if (prevProps.rowHeight !== nextProps.rowHeight) {
    return false;
  }

  // Check grid template columns
  if (prevProps.gridTemplateColumns !== nextProps.gridTemplateColumns) {
    return false;
  }

  // Check pinned state
  if (prevProps.pinned !== nextProps.pinned) {
    return false;
  }

  // Check if headers array changed (by reference)
  if (prevProps.headers !== nextProps.headers) {
    return false;
  }

  // Check if column/row indices changed (by reference)
  if (prevProps.columnIndices !== nextProps.columnIndices) {
    return false;
  }

  if (prevProps.rowIndices !== nextProps.rowIndices) {
    return false;
  }

  // Column index start
  if (prevProps.columnIndexStart !== nextProps.columnIndexStart) {
    return false;
  }

  // All checks passed - props are equal
  return true;
};

// Export memoized TableRow component with custom comparison
// Reduces re-renders of rows that haven't changed during virtual scrolling
export default React.memo(TableRow, arePropsEqual);
