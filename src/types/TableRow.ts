import Row from "./Row";
import { Accessor } from "./HeaderObject";
import RowState from "./RowState";

type TableRow = {
  // Index in the original rows array (before sorting/filtering/grouping)
  // Used for O(1) lookup in imperative API operations
  // Optional because not all TableRow objects need it (e.g., state indicator rows)
  absoluteIndex?: number;
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
};

export default TableRow;
