import Row from "./Row";

export interface GetRowIdParams {
  row: Row;
  depth: number;
  index: number;
  rowPath: (string | number)[];
  rowIndexPath: number[];
  groupingKey?: string;
}

export type GetRowId = (params: GetRowIdParams) => string | number;
