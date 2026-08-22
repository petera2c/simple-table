import type SortColumn from "../types/SortColumn";
import type { TdgpSortModel } from "./types";

/** Turn Simple Table's active sort into a TDGP sort list. */
export function sortColumnToTdgpSort(sort: SortColumn | null | undefined): TdgpSortModel[] | undefined {
  if (!sort?.key?.accessor) return undefined;
  return [{ field: String(sort.key.accessor), dir: sort.direction }];
}
