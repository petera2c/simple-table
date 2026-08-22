import type Row from "../types/Row";

/**
 * Set the children array on the row at `rowIndexPath`.
 * Path `[0, 2]` writes `rows[0][groupingKeys[0]][2][groupingKeys[1]]`.
 */
export function setNestedChildren(
  rows: Row[],
  rowIndexPath: number[],
  groupingKeys: string[],
  children: Row[],
): Row[] {
  if (rowIndexPath.length === 0) return rows;
  return patchLevel(rows, 0);

  function patchLevel(list: Row[], depth: number): Row[] {
    const index = rowIndexPath[depth];
    if (index == null || index < 0 || index >= list.length) return list;

    const next = list.slice();
    const row = { ...next[index] };
    const field = groupingKeys[depth];
    if (!field) return list;

    if (depth === rowIndexPath.length - 1) {
      row[field] = children;
    } else {
      const nested = Array.isArray(row[field]) ? (row[field] as Row[]) : [];
      row[field] = patchLevel(nested, depth + 1);
    }
    next[index] = row;
    return next;
  }
}
