import Row from "./Row";
import RowState from "./RowState";

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
};

export default TableRow;
