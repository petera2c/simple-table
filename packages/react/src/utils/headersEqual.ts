/**
 * Re-export shared prop-sync helpers from core so React tests/imports that
 * target this path keep working. Source of truth: simple-table-core.
 */
export {
  headersStructurallyEqual,
  collectHeaderAccessors,
  rowsShallowUnchanged,
  shallowEqualRow,
  SHALLOW_ROW_COMPARE_MAX,
} from "simple-table-core";
export type { HeaderStructureLike, GetRowIdLike } from "simple-table-core";
