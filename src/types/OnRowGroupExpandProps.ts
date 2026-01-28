import { KeyboardEvent, MouseEvent } from "react";
import Row from "./Row";
import { Accessor } from "./HeaderObject";

interface OnRowGroupExpandProps {
  row: Row;
  depth: number;
  event: MouseEvent | KeyboardEvent;
  groupingKey?: string;
  isExpanded: boolean;
  // Path through nested structure using array indices
  // Example: [0, 1, 2] means rows[0].stores[1].products[2]
  // Use this to directly navigate and update nested data by index
  rowIndexPath: number[];
  // Path through nested structure using row IDs (when rowIdAccessor is provided)
  // Example: ['REG-1', 'STORE-101', 'PROD-5']
  // Use this to find rows by ID when data order may change
  rowIdPath?: (string | number)[];
  // All grouping keys from the hierarchy
  // Example: ['teams', 'employees']
  groupingKeys: Accessor[];
  // Helper functions for managing row state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setEmpty: (isEmpty: boolean, message?: string) => void;
}

export default OnRowGroupExpandProps;
