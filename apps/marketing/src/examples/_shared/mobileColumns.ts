"use client";

import { useMemo } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const DEFAULT_MAX_PINNED = 1;
const MOBILE_COLUMN_WIDTH = 110;
const MOBILE_IDENTITY_WIDTH = 150;
const MOBILE_METRIC_WIDTH = 82;

type MobileColumnBase = {
  accessor: unknown;
  label?: unknown;
  pinned?: "left" | "right";
  minWidth?: number | string;
  children?: readonly MobileColumnBase[];
};

export type MobileColumnOptions = {
  maxPinned?: number;
  /** Wider slot on phones for the name/asset column; other kept columns stay narrower. */
  identityAccessors?: readonly string[];
  /** Header labels to use on phones when the desktop label is too long. */
  labels?: Readonly<Record<string, string>>;
};

/**
 * On phones, drop extra columns and keep at most one pinned column.
 * A 10-column desktop table should show 2 or 3 columns on a small screen.
 */
export function columnsForMobile<T extends MobileColumnBase>(
  columns: readonly T[],
  isMobile: boolean,
  keepAccessors: readonly string[],
  options?: MobileColumnOptions,
): T[] {
  if (!isMobile) {
    return columns as T[];
  }

  const keep = new Set(keepAccessors);
  const filtered = filterToKept(columns, keep);
  const unwrapped = unwrapOrphanGroups(filtered, keep);
  const unpinned = capPinnedColumns(unwrapped, options?.maxPinned ?? DEFAULT_MAX_PINNED);
  const identity = options?.identityAccessors
    ? new Set(options.identityAccessors.map(String))
    : undefined;
  return compactMobileColumns(unpinned, identity, options?.labels);
}

export function useMobileExampleColumns<T extends MobileColumnBase>(
  columns: readonly T[],
  keepAccessors: readonly string[],
  options?: MobileColumnOptions,
): T[] {
  const isMobile = useIsMobile();
  const maxPinned = options?.maxPinned;
  const identityKey = options?.identityAccessors?.join(",") ?? "";
  const labelsKey = options?.labels ? JSON.stringify(options.labels) : "";
  return useMemo(
    () =>
      columnsForMobile(columns, isMobile, keepAccessors, {
        maxPinned,
        identityAccessors: identityKey ? identityKey.split(",") : undefined,
        labels: labelsKey ? (JSON.parse(labelsKey) as Record<string, string>) : undefined,
      }),
    [columns, isMobile, identityKey, keepAccessors, labelsKey, maxPinned],
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

function compactMobileColumns<T extends MobileColumnBase>(
  columns: readonly T[],
  identityAccessors?: ReadonlySet<string>,
  labels?: Readonly<Record<string, string>>,
): T[] {
  return columns.map((col) => {
    const accessor = String(col.accessor);
    const isIdentity = identityAccessors?.has(accessor) ?? false;
    const width = identityAccessors
      ? isIdentity
        ? MOBILE_IDENTITY_WIDTH
        : MOBILE_METRIC_WIDTH
      : MOBILE_COLUMN_WIDTH;
    const label = labels?.[accessor];
    return {
      ...col,
      minWidth: undefined,
      maxWidth: undefined,
      width,
      ...(label !== undefined ? { label } : {}),
      children: col.children
        ? compactMobileColumns(col.children as readonly T[], identityAccessors, labels)
        : col.children,
    } as T;
  });
}
