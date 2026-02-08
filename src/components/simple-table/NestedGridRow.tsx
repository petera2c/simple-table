import SimpleTable from "./SimpleTable";
import Row from "../../types/Row";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import { getNestedValue } from "../../utils/rowUtils";
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
const NestedGridRow = ({
  calculatedHeight,
  childAccessor,
  depth,
  expandableHeader,
  index,
  parentRow,
  position,
}: NestedGridRowProps) => {
  const {
    theme,
    rowGrouping,
    rowHeight: parentRowHeight,
    heightOffsets,
    customTheme,
    // Get inherited props from parent table
    loadingStateRenderer,
    errorStateRenderer,
    emptyStateRenderer,
    icons,
  } = useTableContext();

  const nestedGridConfig = expandableHeader.nestedTable;

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

  // The SimpleTable height should exclude the padding and borders since those are applied to the wrapper
  const tableHeight =
    calculatedHeight - customTheme.nestedGridPaddingTop - customTheme.nestedGridPaddingBottom;

  // Merge parent customTheme with nested grid's customTheme (if provided)
  // This allows nested grids to inherit parent dimensions while optionally overriding them
  const nestedCustomTheme = nestedGridConfig.customTheme
    ? { ...customTheme, ...nestedGridConfig.customTheme }
    : customTheme;

  return (
    <div
      className="st-row st-nested-grid-row"
      data-index={index}
      style={{
        transform: `translate3d(0, ${calculateRowTopPosition({ position, rowHeight: parentRowHeight, heightOffsets, customTheme })}px, 0)`,
        height: `${calculatedHeight}px`,
        paddingTop: `${customTheme.nestedGridPaddingTop}px`,
        paddingBottom: `${customTheme.nestedGridPaddingBottom}px`,
      }}
    >
      <SimpleTable
        {...nestedGridConfig}
        rows={childRows}
        theme={theme}
        customTheme={nestedCustomTheme}
        height={`${tableHeight}px`}
        rowGrouping={childRowGrouping}
        // Inherit props from parent table
        loadingStateRenderer={loadingStateRenderer}
        errorStateRenderer={errorStateRenderer}
        emptyStateRenderer={emptyStateRenderer}
        icons={icons}
        // onRowGroupExpand comes from nestedGridConfig if provided
        // Each nested table should have its own explicit handler
      />
    </div>
  );
};

export default NestedGridRow;
