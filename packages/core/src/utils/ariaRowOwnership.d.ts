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
/**
 * Return the `role="row"` element for `rowKey` inside `container`, creating it
 * (as a zero-box `display: contents` element) on first use. Refreshes
 * `aria-rowindex` when it changes. New cells should be appended to the returned
 * element so they become DOM descendants of a row.
 */
export declare const getOrCreateRowElement: (container: HTMLElement, rowKey: string, ariaRowIndex: number) => HTMLElement;
/**
 * Remove row elements that no longer contain any cells. Retained animation
 * "ghost" cells keep their row alive until they finish and remove themselves,
 * so we prune purely on emptiness rather than on a live-row set.
 */
export declare const reconcileRowElements: (container: HTMLElement) => void;
/** Remove every row element tracked for `container`. */
export declare const cleanupAriaRows: (container: HTMLElement) => void;
