/**
 * Re-export shared row-sync helpers from core.
 * Source of truth: simple-table-core `propSyncEqual`.
 */
export {
  rowsShallowUnchanged,
  shallowEqualRow,
  SHALLOW_ROW_COMPARE_MAX,
} from "simple-table-core";
export type { GetRowIdLike } from "simple-table-core";
