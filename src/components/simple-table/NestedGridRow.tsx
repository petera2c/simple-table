import React from "react";
import SimpleTable from "./SimpleTable";
import Row from "../../types/Row";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import { getNestedValue, NESTED_GRID_PADDING_TOP, NESTED_GRID_PADDING_BOTTOM, NESTED_GRID_BORDER_WIDTH } from "../../utils/rowUtils";
import { useTableContext } from "../../context/TableContext";
import { calculateRowTopPosition } from "../../utils/infiniteScrollUtils";

interface NestedGridRowProps {
  calculatedHeight: number;
  childAccessor: Accessor;
  depth: number;
  expandableHeader: HeaderObject;
  index: number;
  parentRow: Row;
  position: number;
}

/**
 * Component that renders a nested SimpleTable inside an expanded row
 * Spans the full width of the parent table (grid column 1 / -1)
 */
const NestedGridRow= ({
  calculatedHeight,
  childAccessor,
  depth,
  expandableHeader,
  index,
  parentRow,
  position,
}: NestedGridRowProps) => {
  const { theme, rowGrouping, rowHeight: parentRowHeight, heightOffsets } = useTableContext();

  const nestedGridConfig = expandableHeader.nestedGrid;

  // If no nested grid config, don't render anything
  if (!nestedGridConfig) {
    return null;
  }

  // Get the child data from the parent row using the childAccessor
  const childData = getNestedValue(parentRow, childAccessor);

  // Ensure childData is an array of Row objects
  const childRows: Row[] = Array.isArray(childData) ? (childData as Row[]) : [];

  // Determine if this nested grid should also support nested grids
  // Check if there's a next level in rowGrouping
  const nextLevelGrouping = rowGrouping && rowGrouping[depth + 1];
  const childRowGrouping = nextLevelGrouping ? rowGrouping?.slice(depth + 1) : undefined;

  console.log('calculatedHeight', calculatedHeight);

  // The SimpleTable height should exclude the padding and borders since those are applied to the wrapper
  const tableHeight = calculatedHeight - NESTED_GRID_PADDING_TOP - NESTED_GRID_PADDING_BOTTOM;

  console.log('tableHeight', tableHeight);

  return (
    <div
      className="st-row st-nested-grid-row"
      data-index={index}
      style={{
        transform: `translate3d(0, ${calculateRowTopPosition({ position, rowHeight: parentRowHeight, heightOffsets })}px, 0)`,
        height: `${calculatedHeight}px`,
        paddingTop: `${NESTED_GRID_PADDING_TOP}px`,
        paddingBottom: `${NESTED_GRID_PADDING_BOTTOM}px`,
        paddingLeft: "8px",
        paddingRight: "8px",
      }}
    >
      <SimpleTable
        {...nestedGridConfig}
        rows={childRows}
        theme={theme}
        rowHeight={parentRowHeight}
        height={`${tableHeight}px`}
        rowGrouping={childRowGrouping}
      />
    </div>
  );
};

export default NestedGridRow;
