import Row from "./Row";
import type { RowData } from "./Row";

export interface GetRowClassParams<TData extends RowData = Row> {
  row: TData;
  /** Table identity string for the row. Prefer matching on `row` for business ids. */
  rowId: string;
  /** 0-based index of the row in the table. */
  position: number;
  depth: number;
}

/**
 * Return CSS class name(s) for the row, or `undefined` / `null` for default styling.
 * Classes are applied to each body cell — style with `.st-cell.yourClass`.
 */
export type GetRowClass<TData extends RowData = Row> = (
  params: GetRowClassParams<TData>
) => string | string[] | undefined | null;
