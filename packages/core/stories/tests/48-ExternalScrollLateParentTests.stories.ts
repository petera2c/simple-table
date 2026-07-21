/**
 * EXTERNAL SCROLL — LATE-RESOLVING PARENT TESTS
 *
 * Regression tests for the three fixes that make external scroll mode robust
 * when `scrollParent` is a getter that is not resolvable at mount time (the
 * common React case: `scrollParent={() => ref.current?.parentElement}` where
 * `ref` is on an ancestor that React attaches *after* the table's mount effect).
 *
 * Fix 1 — the table retries resolving the parent on later frames, so a getter
 *         that returns null at mount still wires up once it resolves.
 * Fix 2 — while the parent is unresolved, a provisional viewport keeps row
 *         virtualization ON, so the table never renders every row at once
 *         (the original symptom was a multi-second freeze + collapsed table).
 * Fix 3 — that provisional viewport feeds the render-window math (it is not
 *         gated on a resolved parent), so the very first render is virtualized
 *         and external-scroll mode (sticky header) engages immediately.
 *
 * These run in a real browser via the Storybook test-runner, so layout
 * (getBoundingClientRect / scrollHeight / clientHeight) is real — which the
 * external-scroll virtualization math depends on.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { SimpleTableVanilla, ColumnDef } from "../../src/index";
import { waitForTable, getRowCount } from "./testUtils";

const meta: Meta = {
  title: "Tests/48 - External Scroll Late Parent",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

const headers: ColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 200, type: "string" },
  { accessor: "description", label: "Description", width: 300, type: "string" },
];

const createRows = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
  }));

const renderedRowIndices = (root: HTMLElement): Set<string> =>
  new Set(
    Array.from(root.querySelectorAll(".st-cell[data-row-index]")).map(
      (c) => c.getAttribute("data-row-index") as string,
    ),
  );

// ============================================================================
// TEST 1 — Fix 1: a scrollParent getter that resolves *after* mount still wires
// up (the bounded rAF retry picks it up). Proven by the real parent's scroll
// driving virtualization (the rendered window shifts on scroll).
// ============================================================================

export const LateResolvingParentGetsWired = {
  tags: ["external-scroll"],
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "1rem";

    const scrollContainer = document.createElement("div");
    scrollContainer.id = "late-parent-scroll-host";
    scrollContainer.style.height = "400px";
    scrollContainer.style.overflow = "auto";
    scrollContainer.style.border = "1px solid #ccc";
    wrapper.appendChild(scrollContainer);

    const tableContainer = document.createElement("div");
    scrollContainer.appendChild(tableContainer);

    // The getter is intentionally NOT resolvable during mount; it only becomes
    // resolvable on a later macrotask. This mirrors a React ancestor ref that
    // attaches after the table's mount layout effect. Only the rAF retry (Fix 1)
    // can recover from this.
    let resolvable = false;

    const table = new SimpleTableVanilla(tableContainer, {
      columns: headers,
      rows: createRows(2000),
      getRowId: (p) => String((p.row as { id?: number })?.id),
      scrollParent: () => (resolvable ? scrollContainer : null),
    });
    table.mount();
    setTimeout(() => {
      resolvable = true;
    }, 0);

    (wrapper as unknown as { _table?: SimpleTableVanilla })._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const scrollContainer = canvasElement.querySelector(
      "#late-parent-scroll-host",
    ) as HTMLElement;
    expect(scrollContainer).toBeTruthy();

    // Give the retry a few frames to resolve the now-available parent.
    await new Promise((r) => setTimeout(r, 300));

    // The table grew to its natural height inside the external host (so the
    // external container is the scroller), which only happens once the parent
    // is wired.
    expect(scrollContainer.scrollHeight).toBeGreaterThan(scrollContainer.clientHeight + 1000);

    const before = renderedRowIndices(canvasElement);
    expect(before.size).toBeGreaterThan(0);

    // Scroll the EXTERNAL container deep into the dataset. This only shifts the
    // rendered window if the table wired its scroll listener to the real parent
    // (Fix 1). Without the retry, the parent is never wired and nothing moves.
    scrollContainer.scrollTop = 8000;
    scrollContainer.dispatchEvent(new Event("scroll", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));

    const after = renderedRowIndices(canvasElement);
    const newlyVisible = Array.from(after).filter((idx) => !before.has(idx));
    expect(newlyVisible.length).toBeGreaterThan(0);
  },
};

// ============================================================================
// TEST 2 — Fix 2: while the scrollParent stays unresolved, the provisional
// viewport keeps row virtualization ON, so the table renders only a subset of
// the 2000 rows (not every row, which froze the page before the fix).
// ============================================================================

export const UnresolvedParentStaysVirtualized = {
  tags: ["external-scroll"],
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "1rem";

    const scrollContainer = document.createElement("div");
    scrollContainer.id = "never-resolves-scroll-host";
    scrollContainer.style.height = "400px";
    scrollContainer.style.overflow = "auto";
    scrollContainer.style.border = "1px solid #ccc";
    wrapper.appendChild(scrollContainer);

    const tableContainer = document.createElement("div");
    scrollContainer.appendChild(tableContainer);

    // Getter NEVER resolves — we stay in the provisional phase for the whole
    // test, isolating the provisional-viewport behavior.
    const table = new SimpleTableVanilla(tableContainer, {
      columns: headers,
      rows: createRows(2000),
      getRowId: (p) => String((p.row as { id?: number })?.id),
      scrollParent: () => null,
    });
    table.mount();

    (wrapper as unknown as { _table?: SimpleTableVanilla })._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Virtualization must be active even though the parent never resolved:
    // a bounded subset of the 2000 rows is rendered, not the whole dataset.
    const rendered = getRowCount(canvasElement);
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(200);
  },
};

// ============================================================================
// TEST 3 — Fix 3: the provisional viewport feeds the render-window math (it is
// not gated on a resolved parent), so the first render is virtualized AND
// external-scroll mode (sticky header) engages immediately while the parent is
// still unresolved.
// ============================================================================

export const ProvisionalViewportFeedsRenderWindow = {
  tags: ["external-scroll"],
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "1rem";

    const scrollContainer = document.createElement("div");
    scrollContainer.id = "provisional-window-scroll-host";
    scrollContainer.style.height = "400px";
    scrollContainer.style.overflow = "auto";
    scrollContainer.style.border = "1px solid #ccc";
    wrapper.appendChild(scrollContainer);

    const tableContainer = document.createElement("div");
    scrollContainer.appendChild(tableContainer);

    const table = new SimpleTableVanilla(tableContainer, {
      columns: headers,
      rows: createRows(2000),
      getRowId: (p) => String((p.row as { id?: number })?.id),
      scrollParent: () => null,
    });
    table.mount();

    (wrapper as unknown as { _table?: SimpleTableVanilla })._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const tableRoot = canvasElement.querySelector(".simple-table-root") as HTMLElement;
    expect(tableRoot).toBeTruthy();

    // (a) The provisional viewport drove the render window: only a subset of the
    // 2000 rows is rendered. If the windowing path ignored the provisional value
    // (gated on a resolved parent), every row would render.
    const rendered = getRowCount(canvasElement);
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(200);

    // (b) External-scroll mode engaged from the provisional viewport alone — the
    // sticky-header class is present even though the parent never resolved.
    expect(tableRoot.classList.contains("st-external-scroll")).toBe(true);
  },
};
