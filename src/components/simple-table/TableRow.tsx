import React from "react";
import type TableRowType from "../../types/TableRow";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";
import RenderCells from "./RenderCells";
import { Pinned } from "../../types/Pinned";
import HeaderObject from "../../types/HeaderObject";
import ColumnIndices from "../../types/ColumnIndices";
import RowIndices from "../../types/RowIndices";
import { ColumnWindow } from "../../utils/columnVirtualizationUtils";
import { useTableContext } from "../../context/TableContext";
import { rowIdToString } from "../../utils/rowUtils";
import RowStateIndicator from "./RowStateIndicator";
import { ROW_SEPARATOR_WIDTH } from "../../consts/general-consts";
import NestedGridRow from "./NestedGridRow";

// Define just the props needed for RenderCells
interface TableRowProps {
  columnIndexStart?: number;
  columnIndices: ColumnIndices;
  columnWindow?: ColumnWindow | null;
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
  stickyZIndex?: number;
}

const TableRow = ({
  columnIndices,
  columnIndexStart,
  columnWindow,
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
  stickyZIndex,
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
          transform: `translate3d(0, ${calculateRowTopPosition({
            position,
            rowHeight,
            heightOffsets,
            customTheme,
          })}px, 0)`,
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
              transform: `translate3d(0, ${calculateRowTopPosition({
                position,
                rowHeight,
                heightOffsets,
                customTheme,
              })}px, 0)`,
              height: `${rowHeight}px`,
            }}
          />
        );
      }

      return (
        <div
          className="st-row st-state-row"
          data-index={index}
          style={{
            gridTemplateColumns,
            transform: `translate3d(0, ${calculateRowTopPosition({
              position,
              rowHeight,
              heightOffsets,
              customTheme,
            })}px, 0)`,
            height: `${rowHeight}px`,
          }}
        >
          <RowStateIndicator
            parentRow={stateIndicator.parentRow}
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
          transform: `translate3d(0, ${calculateRowTopPosition({
            position,
            rowHeight,
            heightOffsets,
            customTheme,
          })}px, 0)`,
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
        transform: `translateY(${
          stickyIndex * (rowHeight + ROW_SEPARATOR_WIDTH) + stickyOffset
        }px)`,
        height: `${rowHeight}px`,
        position: "absolute" as const,
        top: 0,
        left: 0,
        zIndex: stickyZIndex,
      }
    : {
        gridTemplateColumns,
        top: calculateRowTopPosition({
          position,
          rowHeight,
          heightOffsets,
          customTheme,
        }),
        height: `${rowHeight}px`,
      };

  return (
    <div
      className={`st-row ${isSticky ? "st-sticky-parent" : ""} ${
        useOddEvenRowBackground ? (isOdd ? "even" : "odd") : ""
      } ${isSelected ? "selected" : ""}`}
      data-index={position}
      role="row"
      aria-rowindex={position + maxHeaderDepth + 1}
      onMouseEnter={() => {
        // Don't apply hover effects during animations
        if (!isAnimating && useHoverRowBackground) {
          setHoveredIndex(position);
        }
      }}
      style={rowStyle}
    >
      <RenderCells
        columnIndexStart={columnIndexStart}
        columnIndices={columnIndices}
        columnWindow={columnWindow}
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
const arePropsEqual = (
  prevProps: TableRowProps,
  nextProps: TableRowProps,
): boolean => {
  // `index` is the row's position WITHIN the current virtualization window, so it
  // changes on every scroll shift. Regular data rows don't use it for rendering
  // (they key off `tableRow.position`); only nested-grid / state spacer rows do.
  // Comparing it unconditionally defeated memoization and forced every visible row
  // to re-render (all ~60 cells) on each scroll frame.
  const isSpecialRow = !!(
    nextProps.tableRow.nestedTable || nextProps.tableRow.stateIndicator
  );

  // NOTE: `rowIndices` is intentionally NOT compared. It is a brand-new object on
  // every scroll frame (rebuilt from the sliced window) but is only forwarded down
  // the cell tree and never actually read (TableCell doesn't consume it). Comparing
  // it by reference broke memoization for every visible row on each scroll shift.
  // `columnWindow` is memoized in TableBody and only changes on horizontal scroll /
  // column changes, so during vertical scroll it stays equal and the row keeps its
  // memoization (skips re-render).
  return (
    !(isSpecialRow && prevProps.index !== nextProps.index) &&
    prevProps.tableRow.position === nextProps.tableRow.position &&
    prevProps.tableRow.displayPosition === nextProps.tableRow.displayPosition &&
    prevProps.tableRow.row === nextProps.tableRow.row &&
    prevProps.tableRow.stateIndicator === nextProps.tableRow.stateIndicator &&
    prevProps.rowHeight === nextProps.rowHeight &&
    prevProps.gridTemplateColumns === nextProps.gridTemplateColumns &&
    prevProps.pinned === nextProps.pinned &&
    prevProps.headers === nextProps.headers &&
    prevProps.columnIndices === nextProps.columnIndices &&
    prevProps.columnWindow === nextProps.columnWindow &&
    prevProps.columnIndexStart === nextProps.columnIndexStart
  );
};

// Export memoized TableRow component with custom comparison
// Reduces re-renders of rows that haven't changed during virtual scrolling
export default React.memo(TableRow, arePropsEqual);
