import { Accessor } from "./HeaderObject";

// Column visibility state for the entire table
// Maps column accessor to visibility (true = visible, false = hidden)
export interface ColumnVisibilityState {
  [accessor: Accessor]: boolean;
}
