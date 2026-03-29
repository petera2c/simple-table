import Row from "./Row";
import { GetRowId } from "./GetRowId";

export interface GenerateRowIdParams {
  row: Row;
  getRowId?: GetRowId;
  depth: number;
  index: number;
  rowPath: (string | number)[];
  rowIndexPath: number[];
  groupingKey?: string;
}
