import Row from "./Row";
import { Accessor } from "./HeaderObject";

interface OnRowGroupExpandProps {
  row: Row;
  depth: number;
  event: MouseEvent | KeyboardEvent;
  groupingKey?: string;
  isExpanded: boolean;
  rowIndexPath: number[];
  rowIdPath?: (string | number)[];
  groupingKeys: Accessor[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setEmpty: (isEmpty: boolean, message?: string) => void;
}

export default OnRowGroupExpandProps;
