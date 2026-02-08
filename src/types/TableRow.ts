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
  // Unique row ID array including indices, grouping keys, and optional custom ID
  // Example: [1, "stores", 5] or [1, "stores", 5, "STORE-101"]
  // Use rowIdToString(rowId) to convert to string for Map keys
  rowId: (string | number)[];
  // Path to reach this row using row IDs (when getRowId is provided)
  // Example: ['REG-1', 'stores', 'STORE-101'] means find region with id='REG-1', then its stores, then store with id='STORE-101'
  rowPath?: (string | number)[];
  // Path to reach this row using array indices (always available)
  // Example: [0, 1, 2] means rows[0].stores[1].products[2]
  rowIndexPath?: number[];
  // If this row is a state indicator (loading/error/empty), this contains the state info and parent row
  stateIndicator?: {
    parentRowId: string | number;
    parentRow: Row;
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
