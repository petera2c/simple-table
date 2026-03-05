import React from "react";
import type TableRowType from "../../types/TableRow";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";
import { Pinned } from "../../types/Pinned";
import HeaderObject from "../../types/HeaderObject";
import ColumnIndices from "../../types/ColumnIndices";
import RowIndices from "../../types/RowIndices";
import { useTableContext } from "../../context/TableContext";
import RowStateIndicator from "./RowStateIndicator";
import NestedGridRow from "./NestedGridRow";

// TableRow now only handles special row types (state indicators and nested tables)
// Regular rows are rendered by the DOM renderer in TableSection
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
  gridTemplateColumns,
  index,
  pinned,
  rowHeight,
  tableRow,
}: TableRowProps) => {
  const {
    customTheme,
    emptyStateRenderer,
    errorStateRenderer,
    heightOffsets,
    loadingStateRenderer,
  } = useTableContext();
  const { position, stateIndicator, nestedTable } = tableRow;

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

  // This component should never reach here - it only handles special rows
  // Regular rows are rendered by DOM renderer
  return null;
};

// Export TableRow for special row types only
export default TableRow;
