/** Class on the per-instance table wrapper created by DOMManager. */
export const TABLE_ROOT_CLASS = "simple-table-root";
export const TABLE_ROOT_SELECTOR = `.${TABLE_ROOT_CLASS}`;

/** Walks up from `from` to this table's `.simple-table-root`, or null. */
export const resolveTableRoot = (from: Element | null | undefined): HTMLElement | null => {
  if (!from) return null;
  if (from instanceof HTMLElement && from.classList.contains(TABLE_ROOT_CLASS)) {
    return from;
  }
  return from.closest(TABLE_ROOT_SELECTOR);
};

/**
 * True when `el` belongs to this table instance, not a nested table inside it.
 * Nested grids mount their own `.simple-table-root` under the parent.
 */
export const isOwnedByTable = (root: Element, el: Element): boolean =>
  el.closest(TABLE_ROOT_SELECTOR) === root;

/**
 * `querySelectorAll` within `root`, skipping nodes that belong to a nested table.
 * Pass this instance's `.simple-table-root` (or any descendant of it).
 */
export const queryAllInTable = <E extends Element = HTMLElement>(
  root: ParentNode | null | undefined,
  selector: string,
): E[] => {
  if (!root) return [];
  const tableRoot = root instanceof Element ? resolveTableRoot(root) : null;
  const nodes = root.querySelectorAll(selector);
  if (!tableRoot) {
    return Array.from(nodes) as E[];
  }
  const result: E[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i];
    if (el instanceof Element && isOwnedByTable(tableRoot, el)) {
      result.push(el as E);
    }
  }
  return result;
};

/** First match of `queryAllInTable`, or null. */
export const queryInTable = <E extends Element = HTMLElement>(
  root: ParentNode | null | undefined,
  selector: string,
): E | null => queryAllInTable<E>(root, selector)[0] ?? null;

/** Escape a value for use inside a quoted CSS attribute selector. */
const escapeAttrValue = (value: string): string => value.replace(/["\\]/g, "\\$&");

/** Looks up an element by `id` inside this table, not `document.getElementById`. */
export const getElementByIdInTable = (
  root: ParentNode | null | undefined,
  id: string,
): HTMLElement | null => queryInTable(root, `[id="${escapeAttrValue(id)}"]`);

export const escapeTableAttrValue = escapeAttrValue;
