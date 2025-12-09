import React from "react";
import type TableRowType from "../../types/TableRow";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";
import RenderCells from "./RenderCells";
import { Pinned } from "../../types/Pinned";
import HeaderObject from "../../types/HeaderObject";
import ColumnIndices from "../../types/ColumnIndices";
import RowIndices from "../../types/RowIndices";
import { useTableContext } from "../../context/TableContext";
import { getRowId } from "../../utils/rowUtils";
import RowStateIndicator from "./RowStateIndicator";

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
}: TableRowProps) => {
  const {
    useHoverRowBackground,
    rowIdAccessor,
    isAnimating,
    isRowSelected,
    useOddEvenRowBackground,
    rows,
    loadingStateRenderer,
    errorStateRenderer,
    emptyStateRenderer,
  } = useTableContext();
  const { position, displayPosition, stateIndicator } = tableRow;

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
              transform: `translate3d(0, ${calculateRowTopPosition({ position, rowHeight })}px, 0)`,
              height: `${rowHeight}px`,
            }}
          />
        );
      }

      // Get the parent row from rows using the parentRowId
      const parentRow = rows.find(
        (r) => getRowId({ row: r, rowIdAccessor }) === stateIndicator.parentRowId
      );

      return (
        <div
          className="st-row st-state-row"
          data-index={index}
          style={{
            gridTemplateColumns,
            transform: `translate3d(0, ${calculateRowTopPosition({ position, rowHeight })}px, 0)`,
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
          transform: `translate3d(0, ${calculateRowTopPosition({ position, rowHeight })}px, 0)`,
          height: `${rowHeight}px`,
        }}
      />
    );
  }

  // For regular rows, calculate row properties
  const isOdd = position % 2 === 0;

  // Get stable row ID for key (includes path for nested rows)
  const rowId = getRowId({
    row: tableRow.row,
    rowIdAccessor,
    rowPath: tableRow.rowPath,
  });

  // Check if this row is selected
  const isSelected = isRowSelected ? isRowSelected(String(rowId)) : false;

  return (
    <div
      className={`st-row ${useOddEvenRowBackground ? (isOdd ? "even" : "odd") : ""} ${
        isSelected ? "selected" : ""
      }`}
      data-index={index}
      onMouseEnter={() => {
        // Don't apply hover effects during animations
        if (!isAnimating && useHoverRowBackground) {
          setHoveredIndex(index);
        }
      }}
      style={{
        gridTemplateColumns,
        transform: `translate3d(0, ${calculateRowTopPosition({ position, rowHeight })}px, 0)`,
        height: `${rowHeight}px`,
      }}
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
