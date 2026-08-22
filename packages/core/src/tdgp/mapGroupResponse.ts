import type Row from "../types/Row";
import type { RowData } from "../types/Row";
import { TDGP_CHILDREN_ACCESSOR, TDGP_GROUP_KEYS, type TdgpGroupNode } from "./types";

export function isTdgpGroupNode<TData extends RowData = Row>(
  value: unknown,
): value is TdgpGroupNode<TData> {
  if (!value || typeof value !== "object") return false;
  const node = value as TdgpGroupNode<TData>;
  return Array.isArray(node.keys) && node.data != null && typeof node.data === "object";
}

/** Flatten a server group node into a Simple Table row with an empty children array. */
export function tdgpGroupNodeToRow<TData extends RowData = Row>(
  node: TdgpGroupNode<TData>,
  childrenAccessor: string = TDGP_CHILDREN_ACCESSOR,
): TData {
  const data = node.data as Record<string, unknown>;
  const row: Record<string, unknown> = {
    ...data,
    ...(node.aggregations ?? {}),
    [TDGP_GROUP_KEYS]: node.keys,
    [childrenAccessor]: [],
  };
  if (row.id == null) {
    row.id = `group:${node.keys.join("/")}`;
  }
  return row as TData;
}

export function tdgpGroupNodesToRows<TData extends RowData = Row>(
  nodes: Array<TData | TdgpGroupNode<TData>>,
  childrenAccessor: string = TDGP_CHILDREN_ACCESSOR,
): TData[] {
  return nodes.filter(isTdgpGroupNode<TData>).map((node) => tdgpGroupNodeToRow(node, childrenAccessor));
}

export function getTdgpGroupKeys(row: object | null | undefined): string[] | null {
  if (!row) return null;
  const keys = (row as Record<string, unknown>)[TDGP_GROUP_KEYS];
  if (!Array.isArray(keys)) return null;
  return keys.map((key) => String(key));
}
