import type ColumnDef from "../types/ColumnDef";

/**
 * True when a column must not participate in table layout: cells, widths,
 * positions, colspan, pinned-section math, etc.
 *
 * Covers both user-hidden columns (`hide`) and export-only columns
 * (`excludeFromRender`). Prefer this over checking either flag alone.
 */
export const isHeaderExcludedFromLayout = (
  header: Pick<ColumnDef, "hide" | "excludeFromRender">,
): boolean => Boolean(header.hide || header.excludeFromRender);
