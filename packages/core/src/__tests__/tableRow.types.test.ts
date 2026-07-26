/**
 * Compile-time probe: TableAPI.getVisibleRows / getAllRows expose row: TData.
 * Included in `npm run typecheck` (no runner).
 */
import type { TableAPI, TableRow } from "../index";

interface HREmployee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  performanceScore: number;
}

declare const api: TableAPI<HREmployee>;

const visible: TableRow<HREmployee>[] = api.getVisibleRows();
const all: TableRow<HREmployee>[] = api.getAllRows();

const first = visible[0];
if (first) {
  const id: number = first.row.id;
  const score: number = first.row.performanceScore;
  // @ts-expect-error HREmployee has no `missing`
  const missing: string = first.row.missing;
  void id;
  void score;
  void missing;
}

void all;

export {};
