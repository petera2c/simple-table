import React from "react";
import SimpleTable from "./SimpleTable";
import Row from "../../types/Row";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import { getNestedValue, NESTED_GRID_PADDING_TOP, NESTED_GRID_PADDING_BOTTOM } from "../../utils/rowUtils";
import { useTableContext } from "../../context/TableContext";

interface NestedGridRowProps {
  parentRow: Row;
  expandableHeader: HeaderObject;
  childAccessor: Accessor;
  depth: number;
  calculatedHeight: number;
}

/**
 * Component that renders a nested SimpleTable inside an expanded row
 * Spans the full width of the parent table (grid column 1 / -1)
 */
const NestedGridRow: React.FC<NestedGridRowProps> = ({
  parentRow,
  expandableHeader,
  childAccessor,
  depth,
  calculatedHeight,
}) => {
  const { theme, rowGrouping, rowHeight: parentRowHeight } = useTableContext();

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

  // The SimpleTable height should exclude the padding since padding is applied to the wrapper
  const tableHeight = calculatedHeight - NESTED_GRID_PADDING_TOP - NESTED_GRID_PADDING_BOTTOM;

  return (
    <div
      className="st-cell st-nested-grid-cell"
      style={{
        gridColumn: "1 / -1", // Span all columns
        padding: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          paddingTop: `${NESTED_GRID_PADDING_TOP}px`,
          paddingBottom: `${NESTED_GRID_PADDING_BOTTOM}px`,
          paddingLeft: "8px",
          paddingRight: "8px",
          background: "var(--st-nested-grid-background, rgba(0, 0, 0, 0.02))",
        }}
      >
        <SimpleTable
          rows={childRows}
          theme={theme}
          rowHeight={parentRowHeight}
          height={`${tableHeight}px`}
          rowGrouping={childRowGrouping}
          {...nestedGridConfig}
        />
      </div>
    </div>
  );
};

export default NestedGridRow;
