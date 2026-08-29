"use client";

import { useMemo } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const DEFAULT_MAX_PINNED = 1;
const MOBILE_COLUMN_WIDTH = 110;

type MobileColumnBase = {
  accessor: unknown;
  pinned?: "left" | "right";
  minWidth?: number | string;
  children?: readonly MobileColumnBase[];
};

/**
 * On phones, drop extra columns and keep at most one pinned column.
 * A 10-column desktop table should show 2 or 3 columns on a small screen.
 */
export function columnsForMobile<T extends MobileColumnBase>(
  columns: readonly T[],
  isMobile: boolean,
  keepAccessors: readonly string[],
  options?: { maxPinned?: number },
): T[] {
  if (!isMobile) {
    return columns as T[];
  }

  const keep = new Set(keepAccessors);
  const filtered = filterToKept(columns, keep);
  const unwrapped = unwrapOrphanGroups(filtered, keep);
  const unpinned = capPinnedColumns(unwrapped, options?.maxPinned ?? DEFAULT_MAX_PINNED);
  return compactMobileColumns(unpinned);
}

export function useMobileExampleColumns<T extends MobileColumnBase>(
  columns: readonly T[],
  keepAccessors: readonly string[],
): T[] {
  const isMobile = useIsMobile();
  return useMemo(
    () => columnsForMobile(columns, isMobile, keepAccessors),
    [columns, isMobile, keepAccessors],
  );
}

function filterToKept<T extends MobileColumnBase>(columns: readonly T[], keep: Set<string>): T[] {
  const result: T[] = [];
  for (const col of columns) {
    const accessor = String(col.accessor);
    if (keep.has(accessor)) {
      result.push(col);
      continue;
    }
    if (!col.children?.length) continue;
    const children = filterToKept(col.children as readonly T[], keep);
    if (children.length === 0) continue;
    result.push({ ...col, children } as T);
  }
  return result;
}

/** Drop a leftover group header when it only exists to wrap one kept child. */
function unwrapOrphanGroups<T extends MobileColumnBase>(
  columns: readonly T[],
  keep: Set<string>,
): T[] {
  return columns.flatMap((col) => {
    const children = col.children
      ? unwrapOrphanGroups(col.children as readonly T[], keep)
      : undefined;
    const accessor = String(col.accessor);
    if (children?.length === 1 && !keep.has(accessor)) {
      return [children[0]];
    }
    if (children && children !== col.children) {
      return [{ ...col, children } as T];
    }
    return [col];
  });
}

function capPinnedColumns<T extends MobileColumnBase>(columns: T[], maxPinned: number): T[] {
  if (maxPinned < 1) {
    return stripPinsExcept(columns, new Set());
  }

  const winner = pickPinnedWinner(columns);
  if (!winner) return columns;

  const keepPins = new Set<string>([winner]);
  let extra = maxPinned - 1;
  if (extra > 0) {
    for (const accessor of collectPinnedAccessors(columns)) {
      if (keepPins.has(accessor)) continue;
      keepPins.add(accessor);
      extra -= 1;
      if (extra === 0) break;
    }
  }

  return stripPinsExcept(columns, keepPins);
}

function collectPinnedAccessors<T extends MobileColumnBase>(columns: readonly T[]): string[] {
  const out: string[] = [];
  const walk = (cols: readonly T[]) => {
    for (const col of cols) {
      if (col.pinned) out.push(String(col.accessor));
      if (col.children) walk(col.children as readonly T[]);
    }
  };
  walk(columns);
  return out;
}

/**
 * Prefer the last left-pinned column (usually the name, not the rank number).
 * If nothing is left-pinned, keep the first right-pinned column.
 */
function pickPinnedWinner<T extends MobileColumnBase>(columns: readonly T[]): string | null {
  let lastLeft: string | null = null;
  let firstRight: string | null = null;
  const walk = (cols: readonly T[]) => {
    for (const col of cols) {
      if (col.pinned === "left") lastLeft = String(col.accessor);
      else if (col.pinned === "right" && firstRight == null) {
        firstRight = String(col.accessor);
      }
      if (col.children) walk(col.children as readonly T[]);
    }
  };
  walk(columns);
  return lastLeft ?? firstRight;
}

function stripPinsExcept<T extends MobileColumnBase>(
  columns: readonly T[],
  keepPins: Set<string>,
): T[] {
  return columns.map((col) => {
    const children = col.children
      ? stripPinsExcept(col.children as readonly T[], keepPins)
      : col.children;
    const keepPin = Boolean(col.pinned && keepPins.has(String(col.accessor)));
    if (keepPin ? children === col.children : !col.pinned && children === col.children) {
      return col;
    }
    return { ...col, children, pinned: keepPin ? col.pinned : undefined } as T;
  });
}

function compactMobileColumns<T extends MobileColumnBase>(columns: readonly T[]): T[] {
  return columns.map(
    (col) =>
      ({
        ...col,
        minWidth: undefined,
        maxWidth: undefined,
        width: MOBILE_COLUMN_WIDTH,
        children: col.children ? compactMobileColumns(col.children as readonly T[]) : col.children,
      }) as T,
  );
}
