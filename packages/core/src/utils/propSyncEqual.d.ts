/**
 * Shared prop-sync helpers for framework adapters.
 * Used to skip no-op `defaultHeaders` / `rows` updates when consumers rebuild
 * column configs or shallow-clone rows every render.
 */
import type { GetRowIdParams } from "../types/GetRowId";
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
    isSortable?: boolean;
    filterable?: boolean;
    align?: string;
    collapsible?: boolean;
    collapseDefault?: boolean;
    showWhen?: string;
    isEditable?: boolean;
    isEssential?: boolean;
    disableReorder?: boolean;
    expandable?: boolean;
    excludeFromRender?: boolean;
    autoSizeMode?: string;
    tooltip?: string;
    quickFilterable?: boolean;
    filterOperators?: ReadonlyArray<string>;
    children?: ReadonlyArray<HeaderStructureLike>;
};
/**
 * True when two header trees describe the same columns (accessors, widths,
 * flags, nesting). Ignores renderer identity.
 */
export declare function headersStructurallyEqual(a: ReadonlyArray<HeaderStructureLike> | undefined, b: ReadonlyArray<HeaderStructureLike> | undefined): boolean;
/** Collect every accessor in a header tree (for renderer-cache pruning). */
export declare function collectHeaderAccessors(headers: ReadonlyArray<HeaderStructureLike>, into?: Set<string>): Set<string>;
/**
 * Shallow equality of a single row object (own enumerable keys, `===` values).
 * Identical references are equal. In-place mutation on a shared object is
 * invisible — callers must pass new object identities when data changes.
 */
export declare function shallowEqualRow(a: object, b: object): boolean;
/** Compatible with `GetRowId`; return may be nullish for sync helpers. */
export type GetRowIdLike = (params: GetRowIdParams) => string | number | null | undefined;
/**
 * Above this length, skip per-field shallow compares when row object identity
 * differs. Same-array-ref and same-row-object cases stay O(1) / O(n) pointer
 * checks. Protects huge client datasets from O(n × fields) scans.
 */
export declare const SHALLOW_ROW_COMPARE_MAX = 50000;
/**
 * True when `next` is a no-op relative to `prev` for table sync:
 * same length, matching `getRowId` sequence (when provided), and each row
 * either the same object or shallow-equal (for modest list sizes).
 */
export declare function rowsShallowUnchanged(prev: ReadonlyArray<object> | undefined, next: ReadonlyArray<object> | undefined, getRowId?: GetRowIdLike): boolean;
