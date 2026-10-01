import { signal } from "@angular/core";
import type { HeaderEmployee } from "./header-renderer.demo-data";

export type HeaderDemoSortDir = "asc" | "desc" | null;

type HeaderKey = keyof HeaderEmployee;

function isHeaderKey(accessor: string): accessor is HeaderKey {
  return (
    accessor === "id" ||
    accessor === "name" ||
    accessor === "email" ||
    accessor === "role" ||
    accessor === "salary" ||
    accessor === "department"
  );
}

const CYCLE: HeaderDemoSortDir[] = ["asc", "desc", null];

export const headerDemoSortAccessor = signal<HeaderKey | null>(null);
export const headerDemoSortDirection = signal<HeaderDemoSortDir>(null);

export function cycleHeaderDemoSort(accessor: string): void {
  if (!isHeaderKey(accessor)) return;
  const currentAcc = headerDemoSortAccessor();
  const dir = headerDemoSortDirection();
  if (currentAcc !== accessor) {
    headerDemoSortAccessor.set(accessor);
    headerDemoSortDirection.set("asc");
    return;
  }
  const idx = CYCLE.indexOf(dir);
  const next = CYCLE[(idx + 1) % CYCLE.length]!;
  if (next) {
    headerDemoSortAccessor.set(accessor);
    headerDemoSortDirection.set(next);
  } else {
    headerDemoSortAccessor.set(null);
    headerDemoSortDirection.set(null);
  }
}
