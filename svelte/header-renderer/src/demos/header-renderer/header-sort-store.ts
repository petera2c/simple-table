import { writable, get } from "svelte/store";

export type HeaderDemoSortDir = "asc" | "desc" | null;

const CYCLE: HeaderDemoSortDir[] = ["asc", "desc", null];

export const headerDemoSortAccessor = writable<string | null>(null);
export const headerDemoSortDirection = writable<HeaderDemoSortDir>(null);

export function cycleHeaderDemoSort(accessor: string): void {
  const currentAcc = get(headerDemoSortAccessor);
  const dir = get(headerDemoSortDirection);
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
