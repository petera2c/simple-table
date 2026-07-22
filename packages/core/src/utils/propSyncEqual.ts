/**
 * Shared prop-sync helpers for framework adapters.
 * Used to skip no-op `columns` / `rows` updates when consumers rebuild
 * column configs or shallow-clone rows every render.
 */

import type { GetRowIdParams } from "../types/GetRowId";
import type Row from "../types/Row";

/** Minimal header shape for structural comparison (renderers ignored). */
export type HeaderStructureLike = {
  accessor: string | number | symbol;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  label?: string;
  type?: string;
  pinned?: string | boolean | null;
  hide?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  align?: string;
  collapsible?: boolean;
  collapseDefault?: boolean;
  showWhen?: string;
  editable?: boolean;
  essential?: boolean;
  disableReorder?: boolean;
  expandable?: boolean;
  excludeFromRender?: boolean;
  autoSizeMode?: string;
  tooltip?: string;
  quickFilterable?: boolean;
  filterOperators?: ReadonlyArray<string>;
  children?: ReadonlyArray<HeaderStructureLike>;
};

function headerStructureEqual(a: HeaderStructureLike, b: HeaderStructureLike): boolean {
  if (a === b) return true;

  if (
    a.accessor !== b.accessor ||
    a.width !== b.width ||
    a.minWidth !== b.minWidth ||
    a.maxWidth !== b.maxWidth ||
    a.label !== b.label ||
    a.type !== b.type ||
    a.pinned !== b.pinned ||
    a.hide !== b.hide ||
    a.sortable !== b.sortable ||
    a.filterable !== b.filterable ||
    a.align !== b.align ||
    a.collapsible !== b.collapsible ||
    a.collapseDefault !== b.collapseDefault ||
    a.showWhen !== b.showWhen ||
    a.editable !== b.editable ||
    a.essential !== b.essential ||
    a.disableReorder !== b.disableReorder ||
    a.expandable !== b.expandable ||
    a.excludeFromRender !== b.excludeFromRender ||
    a.autoSizeMode !== b.autoSizeMode ||
    a.tooltip !== b.tooltip ||
    a.quickFilterable !== b.quickFilterable
  ) {
    return false;
  }

  const aOps = a.filterOperators;
  const bOps = b.filterOperators;
  if (aOps !== bOps) {
    if (!aOps || !bOps || aOps.length !== bOps.length) return false;
    for (let i = 0; i < aOps.length; i++) {
      if (aOps[i] !== bOps[i]) return false;
    }
  }

  const aChildren = a.children;
  const bChildren = b.children;
  if (aChildren === bChildren) return true;
  if (!aChildren || !bChildren) return !aChildren && !bChildren;
  if (aChildren.length !== bChildren.length) return false;

  for (let i = 0; i < aChildren.length; i++) {
    if (!headerStructureEqual(aChildren[i], bChildren[i])) return false;
  }
  return true;
}

/**
 * True when two header trees describe the same columns (accessors, widths,
 * flags, nesting). Ignores renderer identity.
 */
export function headersStructurallyEqual(
  a: ReadonlyArray<HeaderStructureLike> | undefined,
  b: ReadonlyArray<HeaderStructureLike> | undefined,
): boolean {
  if (a === b) return true;
  if (!a || !b) return !a && !b;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!headerStructureEqual(a[i], b[i])) return false;
  }
  return true;
}

/** Collect every accessor in a header tree (for renderer-cache pruning). */
export function collectHeaderAccessors(
  headers: ReadonlyArray<HeaderStructureLike>,
  into: Set<string> = new Set(),
): Set<string> {
  for (const h of headers) {
    into.add(String(h.accessor));
    if (h.children?.length) collectHeaderAccessors(h.children, into);
  }
  return into;
}

/**
 * Shallow equality of a single row object (own enumerable keys, `===` values).
 * Identical references are equal. In-place mutation on a shared object is
 * invisible — callers must pass new object identities when data changes.
 */
export function shallowEqualRow(a: object, b: object): boolean {
  if (a === b) return true;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if ((a as Record<string, unknown>)[key] !== (b as Record<string, unknown>)[key]) {
      return false;
    }
  }
  return true;
}

/** Compatible with `GetRowId`; return may be nullish for sync helpers. */
export type GetRowIdLike = (params: GetRowIdParams) => string | number | null | undefined;

/**
 * Above this length, skip per-field shallow compares when row object identity
 * differs. Same-array-ref and same-row-object cases stay O(1) / O(n) pointer
 * checks. Protects huge client datasets from O(n × fields) scans.
 */
export const SHALLOW_ROW_COMPARE_MAX = 50_000;

/**
 * True when `next` is a no-op relative to `prev` for table sync:
 * same length, matching `getRowId` sequence (when provided), and each row
 * either the same object or shallow-equal (for modest list sizes).
 */
export function rowsShallowUnchanged(
  prev: ReadonlyArray<object> | undefined,
  next: ReadonlyArray<object> | undefined,
  getRowId?: GetRowIdLike,
): boolean {
  if (prev === next) return true;
  if (!prev || !next) return !prev && !next;
  if (prev.length !== next.length) return false;

  const allowShallowFields = next.length <= SHALLOW_ROW_COMPARE_MAX;

  for (let i = 0; i < prev.length; i++) {
    const prevRow = prev[i];
    const nextRow = next[i];
    if (prevRow === nextRow) continue;

    if (getRowId) {
      const prevId = getRowId({
        row: prevRow as Row,
        depth: 0,
        index: i,
        rowPath: [],
        rowIndexPath: [i],
      });
      const nextId = getRowId({
        row: nextRow as Row,
        depth: 0,
        index: i,
        rowPath: [],
        rowIndexPath: [i],
      });
      if (String(prevId) !== String(nextId)) return false;
    }

    if (!allowShallowFields) return false;
    if (!shallowEqualRow(prevRow, nextRow)) return false;
  }
  return true;
}
