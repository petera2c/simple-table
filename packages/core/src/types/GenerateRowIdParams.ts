import Row from "./Row";
import type { RowData } from "./Row";
import { GetRowId } from "./GetRowId";

export interface GenerateRowIdParams<TData extends RowData = Row> {
  row: TData;
  getRowId?: GetRowId<TData>;
  depth: number;
  index: number;
  rowPath: (string | number)[];
  rowIndexPath: number[];
  groupingKey?: string;
}
