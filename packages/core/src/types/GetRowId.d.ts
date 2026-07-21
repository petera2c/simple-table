import Row from "./Row";
export interface GetRowIdParams {
    row: Row;
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
export type GetRowId = (params: GetRowIdParams) => string | number | null | undefined;
