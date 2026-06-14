/**
 * ARIA row layer.
 *
 * The table renders cells as absolutely-positioned, virtualized, FLIP-animated
 * elements. The ARIA `grid` pattern, however, requires the hierarchy
 * `grid → rowgroup → row → gridcell/columnheader`; a flat list of cells under
 * the section (rowgroup) makes validators (axe) report the cells as disallowed
 * children of the rowgroup and as missing their required `row` parent.
 *
 * `aria-owns` does NOT solve this: axe (and the ARIA tree) still treat a cell
 * as a child of its DOM parent, so the cell remains an invalid rowgroup child.
 * The cells must therefore be real DOM descendants of a `role="row"` element.
 *
 * To get that hierarchy without disturbing the carefully-tuned positioning and
 * animation machinery, the row element uses `display: contents`: it generates
 * no box, establishes no containing block, and takes part in no layout, so its
 * absolutely-positioned cell children are laid out exactly as if they were
 * still direct children of the section. It is still present in the
 * accessibility tree (axe's screen-reader visibility check only looks at
 * `display:none` / `visibility` / `content-visibility` / `aria-hidden`, never
 * at box size), so it provides the required `row` layer for free.
 */

const rowElementsMap = new WeakMap<HTMLElement, Map<string, HTMLElement>>();

const getRowElements = (container: HTMLElement): Map<string, HTMLElement> => {
  let map = rowElementsMap.get(container);
  if (!map) {
    map = new Map();
    rowElementsMap.set(container, map);
  }
  return map;
};

/**
 * Return the `role="row"` element for `rowKey` inside `container`, creating it
 * (as a zero-box `display: contents` element) on first use. Refreshes
 * `aria-rowindex` when it changes. New cells should be appended to the returned
 * element so they become DOM descendants of a row.
 */
export const getOrCreateRowElement = (
  container: HTMLElement,
  rowKey: string,
  ariaRowIndex: number,
): HTMLElement => {
  const rowElements = getRowElements(container);
  let rowEl = rowElements.get(rowKey);
  if (!rowEl) {
    rowEl = document.createElement("div");
    rowEl.className = "st-aria-row";
    rowEl.setAttribute("role", "row");
    // `display: contents` => no box, no containing block, no layout impact, so
    // the absolutely-positioned cell children keep resolving against the
    // section (their nearest positioned ancestor) exactly as before.
    rowEl.style.display = "contents";
    container.appendChild(rowEl);
    rowElements.set(rowKey, rowEl);
  }
  const indexStr = String(ariaRowIndex);
  if (rowEl.getAttribute("aria-rowindex") !== indexStr) {
    rowEl.setAttribute("aria-rowindex", indexStr);
  }
  return rowEl;
};

/**
 * Remove row elements that no longer contain any cells. Retained animation
 * "ghost" cells keep their row alive until they finish and remove themselves,
 * so we prune purely on emptiness rather than on a live-row set.
 */
export const reconcileRowElements = (container: HTMLElement): void => {
  const rowElements = rowElementsMap.get(container);
  if (!rowElements) return;
  rowElements.forEach((el, key) => {
    if (el.childElementCount === 0) {
      el.remove();
      rowElements.delete(key);
    }
  });
};

/** Remove every row element tracked for `container`. */
export const cleanupAriaRows = (container: HTMLElement): void => {
  const rowElements = rowElementsMap.get(container);
  if (!rowElements) return;
  rowElements.forEach((el) => el.remove());
  rowElements.clear();
};
