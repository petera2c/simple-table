import Row from "./Row";
import type { RowData } from "./Row";
import { Accessor } from "./ColumnDef";

interface OnRowGroupExpandProps<TData extends RowData = Row> {
  row: TData;
  depth: number;
  event: MouseEvent | KeyboardEvent;
  groupingKey?: string;
  isExpanded: boolean;
  rowIndexPath: number[];
  rowIdPath?: (string | number)[];
  groupingKeys: Accessor<TData>[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setEmpty: (isEmpty: boolean, message?: string) => void;
}

export default OnRowGroupExpandProps;
