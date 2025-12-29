import { KeyboardEvent, MouseEvent } from "react";
import Row from "./Row";
import { Accessor } from "./HeaderObject";

interface OnRowGroupExpandProps {
  row: Row;
  depth: number;
  event: MouseEvent | KeyboardEvent;
  rowId: string | number;
  groupingKey?: string;
  isExpanded: boolean;
  // Path through nested structure to reach this row
  // Example: [0, 'teams', 1] means rows[0].teams[1]
  // Can be used to directly navigate and update nested data
  rowIndexPath: (string | number)[];
  // All grouping keys from the hierarchy
  // Example: ['teams', 'employees']
  groupingKeys: Accessor[];
  // Helper functions for managing row state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setEmpty: (isEmpty: boolean, message?: string) => void;
}

export default OnRowGroupExpandProps;
