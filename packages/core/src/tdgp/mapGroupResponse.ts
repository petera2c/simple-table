import { TDGP_CHILDREN_ACCESSOR, TDGP_GROUP_KEYS, type TdgpGroupNode } from "./types";

export function isTdgpGroupNode(value: unknown): value is TdgpGroupNode {
  if (!value || typeof value !== "object") return false;
  const node = value as TdgpGroupNode;
  return Array.isArray(node.keys) && node.data != null && typeof node.data === "object";
}

/** Flatten a server group node into a Simple Table row with an empty children array. */
export function tdgpGroupNodeToRow(
  node: TdgpGroupNode,
  childrenAccessor: string = TDGP_CHILDREN_ACCESSOR,
): Record<string, unknown> {
  const row: Record<string, unknown> = {
    ...node.data,
    ...(node.aggregations ?? {}),
    [TDGP_GROUP_KEYS]: node.keys,
    [childrenAccessor]: [],
  };
  if (row.id == null) {
    row.id = `group:${node.keys.join("/")}`;
  }
  return row;
}

export function tdgpGroupNodesToRows(
  nodes: TdgpGroupNode[],
  childrenAccessor: string = TDGP_CHILDREN_ACCESSOR,
): Record<string, unknown>[] {
  return nodes.map((node) => tdgpGroupNodeToRow(node, childrenAccessor));
}

export function getTdgpGroupKeys(row: Record<string, unknown> | null | undefined): string[] | null {
  const keys = row?.[TDGP_GROUP_KEYS];
  if (!Array.isArray(keys)) return null;
  return keys.map((key) => String(key));
}
