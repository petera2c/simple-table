import { MouseEvent } from "react";
import Row from "./Row";

interface OnRowGroupExpandProps {
  row: Row;
  rowIndex: number;
  depth: number;
  event: MouseEvent;
  rowId: string | number;
  groupingKey?: string;
  isExpanded: boolean;
  // Helper functions for managing row state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setEmpty: (isEmpty: boolean, message?: string) => void;
  // Helper function to update the row data internally
  updateRow: (updates: Partial<Row>) => void;
}

export default OnRowGroupExpandProps;
