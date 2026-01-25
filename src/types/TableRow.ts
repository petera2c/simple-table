import Row from "./Row";
import RowState from "./RowState";
import HeaderObject, { Accessor } from "./HeaderObject";

type TableRow = {
  depth: number;
  displayPosition: number;
  groupingKey?: string;
  isLastGroupRow: boolean;
  position: number;
  row: Row;
  // Path to reach this row in the nested structure (e.g., [0, 'teams', 2] means rows[0].teams[2])
  rowPath?: (string | number)[];
  // If this row is a state indicator (loading/error/empty), this contains the state info and parent row ID
  stateIndicator?: {
    parentRowId: string | number;
    state: RowState;
  };
  // If this row is a loading skeleton (used when expanding rows without a custom loadingStateRenderer)
  isLoadingSkeleton?: boolean;
  // If this row should render a nested grid, this contains the necessary information
  nestedTable?: {
    parentRow: Row;
    expandableHeader: HeaderObject;
    childAccessor: Accessor;
    calculatedHeight: number; // The calculated height in pixels for this nested grid
  };
  // The absolute row index accounting for pagination (e.g., on page 2 with 10 rows per page, first row has absoluteRowIndex = 10)
  absoluteRowIndex: number;
  // Indices of parent rows in the flattened array (for sticky parent functionality in row grouping)
  // For a row at depth 2, this would be [indexOfDepth0Parent, indexOfDepth1Parent]
  parentIndices?: number[];
};

export default TableRow;
