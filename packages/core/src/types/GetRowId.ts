import Row from "./Row";
import type { RowData } from "./Row";

export interface GetRowIdParams<TData extends RowData = Row> {
  row: TData;
  depth: number;
  index: number;
  rowPath: (string | number)[];
  rowIndexPath: number[];
  groupingKey?: string;
}

/**
 * Return a stable business id for the row, or `undefined` / `null` when the row
 * has no id yet (e.g. loading placeholders, pivot aggregates). Nullish returns
 * fall back to reference-based identity so cell keys never collide on
 * `String(undefined)`.
 */
export type GetRowId<TData extends RowData = Row> = (
  params: GetRowIdParams<TData>
) => string | number | null | undefined;
