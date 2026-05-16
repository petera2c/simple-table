/**
 * EXTERNAL SCROLL TESTS
 *
 * Tests for the `scrollParent` prop which lets a consumer point the table at
 * an external scroll container (HTMLElement or window). When active and
 * neither height nor maxHeight is set, the external parent's scroll drives
 * row virtualization and onLoadMore.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { SimpleTableVanilla, HeaderObject } from "../../src/index";
import { waitForTable, getRowCount } from "./testUtils";

const meta: Meta = {
  title: "Tests/44 - External Scroll",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

const headers: HeaderObject[] = [
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

// ============================================================================
// TEST 1: External element scroll virtualizes a large dataset
// ============================================================================

export const ExternalElementVirtualizes = {
  tags: ["external-scroll"],
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "1rem";

    const scrollContainer = document.createElement("div");
    scrollContainer.id = "external-scroll-host";
    scrollContainer.style.height = "400px";
    scrollContainer.style.overflow = "auto";
    scrollContainer.style.border = "1px solid #ccc";
    wrapper.appendChild(scrollContainer);

    const tableContainer = document.createElement("div");
    scrollContainer.appendChild(tableContainer);

    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createRows(2000),
      getRowId: (p) => String((p.row as { id?: number })?.id),
      scrollParent: scrollContainer,
    });
    table.mount();
    (wrapper as unknown as { _table?: SimpleTableVanilla })._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const scrollContainer = canvasElement.querySelector("#external-scroll-host") as HTMLElement;
    expect(scrollContainer).toBeTruthy();

    const tableRoot = canvasElement.querySelector(".simple-table-root") as HTMLElement;
    expect(tableRoot).toBeTruthy();

    // Internal body container must NOT be scrollable: the external host owns scroll.
    const bodyContainer = canvasElement.querySelector(".st-body-container") as HTMLElement;
    expect(bodyContainer.scrollHeight).toBe(bodyContainer.clientHeight);

    // External container, on the other hand, must show a large scrollHeight (table grew).
    expect(scrollContainer.scrollHeight).toBeGreaterThan(scrollContainer.clientHeight + 1000);

    // Only a virtualized subset of rows is rendered (must be far less than 2000).
    const rendered = getRowCount(canvasElement);
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(200);
  },
};

// ============================================================================
// TEST 2: Scrolling the external container fires onLoadMore near table bottom
// ============================================================================

export const ExternalScrollFiresOnLoadMore = {
  tags: ["external-scroll"],
  render: () => {
    const captured: { count: number } = { count: 0 };
    (
      window as unknown as { __externalLoadMoreCapture?: { count: number } }
    ).__externalLoadMoreCapture = captured;

    const wrapper = document.createElement("div");
    wrapper.style.padding = "1rem";

    const scrollContainer = document.createElement("div");
    scrollContainer.id = "external-scroll-host-loadmore";
    scrollContainer.style.height = "350px";
    scrollContainer.style.overflow = "auto";
    scrollContainer.style.border = "1px solid #ccc";
    wrapper.appendChild(scrollContainer);

    const tableContainer = document.createElement("div");
    scrollContainer.appendChild(tableContainer);

    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createRows(500),
      getRowId: (p) => String((p.row as { id?: number })?.id),
      scrollParent: scrollContainer,
      infiniteScrollThreshold: 200,
      onLoadMore: () => {
        captured.count += 1;
      },
    });
    table.mount();
    (wrapper as unknown as { _table?: SimpleTableVanilla })._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const captured = (window as unknown as { __externalLoadMoreCapture?: { count: number } })
      .__externalLoadMoreCapture;
    expect(captured).toBeTruthy();
    expect(captured!.count).toBe(0);

    const scrollContainer = canvasElement.querySelector(
      "#external-scroll-host-loadmore",
    ) as HTMLElement;
    expect(scrollContainer).toBeTruthy();

    // Scroll to near the bottom (within the 200px threshold) — onLoadMore must fire.
    scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight - 50;
    scrollContainer.dispatchEvent(new Event("scroll", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 250));

    expect(captured!.count).toBeGreaterThanOrEqual(1);
  },
};

// ============================================================================
// TEST 3: When neither scrollParent nor height/maxHeight is set, render all rows
// ============================================================================

export const NoScrollParentRendersAll = {
  tags: ["external-scroll"],
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "1rem";

    const tableContainer = document.createElement("div");
    wrapper.appendChild(tableContainer);

    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createRows(50),
      getRowId: (p) => String((p.row as { id?: number })?.id),
    });
    table.mount();
    (wrapper as unknown as { _table?: SimpleTableVanilla })._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const rendered = getRowCount(canvasElement);
    // Without virtualization, all 50 rows render.
    expect(rendered).toBe(50);
  },
};

// ============================================================================
// TEST 4: height takes precedence over scrollParent
// ============================================================================

export const HeightOverridesScrollParent = {
  tags: ["external-scroll"],
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "1rem";

    const scrollContainer = document.createElement("div");
    scrollContainer.id = "ignored-scroll-host";
    scrollContainer.style.height = "800px";
    scrollContainer.style.overflow = "auto";
    wrapper.appendChild(scrollContainer);

    const tableContainer = document.createElement("div");
    scrollContainer.appendChild(tableContainer);

    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createRows(500),
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "300px",
      scrollParent: scrollContainer,
    });
    table.mount();
    (wrapper as unknown as { _table?: SimpleTableVanilla })._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Internal body container should be the one that's scrollable when height is set.
    const bodyContainer = canvasElement.querySelector(".st-body-container") as HTMLElement;
    expect(bodyContainer.scrollHeight).toBeGreaterThan(bodyContainer.clientHeight);

    // Virtualization is active via the table's own height, so rendered rows are far fewer than 500.
    const rendered = getRowCount(canvasElement);
    expect(rendered).toBeLessThan(200);

    // Sticky header mode is OFF when height takes precedence — no external-scroll class on the root.
    const tableRoot = canvasElement.querySelector(".simple-table-root") as HTMLElement;
    expect(tableRoot.classList.contains("st-external-scroll")).toBe(false);
  },
};

// ============================================================================
// TEST 5: Header is sticky to the top of the external scroll viewport
// ============================================================================

export const StickyHeaderInExternalScroll = {
  tags: ["external-scroll"],
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "1rem";

    const scrollContainer = document.createElement("div");
    scrollContainer.id = "external-scroll-host-sticky";
    scrollContainer.style.height = "400px";
    scrollContainer.style.overflow = "auto";
    scrollContainer.style.border = "1px solid #ccc";
    scrollContainer.style.padding = "1rem";
    wrapper.appendChild(scrollContainer);

    const tableContainer = document.createElement("div");
    scrollContainer.appendChild(tableContainer);

    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: createRows(2000),
      getRowId: (p) => String((p.row as { id?: number })?.id),
      scrollParent: scrollContainer,
    });
    table.mount();
    (wrapper as unknown as { _table?: SimpleTableVanilla })._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const scrollContainer = canvasElement.querySelector(
      "#external-scroll-host-sticky",
    ) as HTMLElement;
    expect(scrollContainer).toBeTruthy();

    const tableRoot = canvasElement.querySelector(".simple-table-root") as HTMLElement;
    expect(tableRoot).toBeTruthy();

    // External scroll mode should opt the root into the sticky-header CSS class.
    expect(tableRoot.classList.contains("st-external-scroll")).toBe(true);

    const headerContainer = canvasElement.querySelector(".st-header-container") as HTMLElement;
    expect(headerContainer).toBeTruthy();

    // The CSS class must actually resolve to position: sticky at runtime
    // (no ancestor with `overflow: hidden` between header and scrollContainer).
    expect(getComputedStyle(headerContainer).position).toBe("sticky");

    // Before scrolling, the header sits at its natural position inside the
    // scroll container — that is, below any padding-top the consumer added.
    // (CSS sticky preserves the element's natural in-flow position; only the
    // pinned position is offset by our negative-`top` variable.)
    const containerTop = scrollContainer.getBoundingClientRect().top;
    const paddingTop = parseFloat(getComputedStyle(scrollContainer).paddingTop) || 0;
    const headerTopBefore = headerContainer.getBoundingClientRect().top;
    expect(Math.abs(headerTopBefore - (containerTop + paddingTop))).toBeLessThan(3);

    // Scroll the external container; the header must stay pinned to the
    // *outer* top edge of the scroll container — not the padding edge — so
    // there is no visible gap above the header when the parent has padding.
    scrollContainer.scrollTop = 500;
    scrollContainer.dispatchEvent(new Event("scroll", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 100));

    const headerTopAfter = headerContainer.getBoundingClientRect().top;
    expect(Math.abs(headerTopAfter - containerTop)).toBeLessThan(3);
  },
};

// ============================================================================
// TEST 6: Row grouping works in external scroll mode (and enableStickyParents
// is safely no-op + warns, since position: sticky parent rows are incompatible
// with the external scroll containing block).
// ============================================================================

const groupedHeaders: HeaderObject[] = [
  // `expandable: true` is required for the column to render the
  // expand/collapse chevron next to grouped parent rows.
  { accessor: "name", label: "Name", width: 240, expandable: true },
  { accessor: "id", label: "ID", width: 160, type: "string" },
  { accessor: "value", label: "Value", width: 120, type: "number" },
];

const createGroupedRows = (groupCount: number, childrenPerGroup: number) =>
  Array.from({ length: groupCount }, (_, gi) => ({
    id: `group-${gi + 1}`,
    name: `Group ${gi + 1}`,
    value: (gi + 1) * 100,
    children: Array.from({ length: childrenPerGroup }, (_, ci) => ({
      id: `group-${gi + 1}-child-${ci + 1}`,
      name: `Child ${ci + 1} of group ${gi + 1}`,
      value: (gi + 1) * 100 + ci,
    })),
  }));

export const RowGroupingInExternalScroll = {
  tags: ["external-scroll"],
  render: () => {
    // Capture console.warn so we can assert the enableStickyParents conflict
    // warning is emitted exactly once.
    const captured: { warnings: string[] } = { warnings: [] };
    (
      window as unknown as { __externalGroupingWarnCapture?: { warnings: string[] } }
    ).__externalGroupingWarnCapture = captured;

    const previousWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      captured.warnings.push(args.map((a) => String(a)).join(" "));
      previousWarn.apply(console, args as []);
    };
    (
      window as unknown as { __externalGroupingWarnRestore?: () => void }
    ).__externalGroupingWarnRestore = () => {
      console.warn = previousWarn;
    };

    const wrapper = document.createElement("div");
    wrapper.style.padding = "1rem";

    const scrollContainer = document.createElement("div");
    scrollContainer.id = "external-scroll-host-grouping";
    scrollContainer.style.height = "400px";
    scrollContainer.style.overflow = "auto";
    scrollContainer.style.border = "1px solid #ccc";
    wrapper.appendChild(scrollContainer);

    const tableContainer = document.createElement("div");
    scrollContainer.appendChild(tableContainer);

    // 50 groups × 20 children fully expanded = 1050 visible rows — plenty for
    // virtualization to kick in inside a 400px viewport.
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: groupedHeaders,
      rows: createGroupedRows(50, 20),
      getRowId: ({ row }) => String((row as { id?: string }).id),
      rowGrouping: ["children"],
      expandAll: true,
      // Set deliberately to trigger the warn-and-noop path. The table must
      // still render grouped rows correctly without any .st-sticky-top
      // overlay (sticky parents are incompatible with external scroll mode).
      enableStickyParents: true,
      scrollParent: scrollContainer,
    });
    table.mount();
    (wrapper as unknown as { _table?: SimpleTableVanilla })._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const scrollContainer = canvasElement.querySelector(
      "#external-scroll-host-grouping",
    ) as HTMLElement;
    expect(scrollContainer).toBeTruthy();

    const tableRoot = canvasElement.querySelector(".simple-table-root") as HTMLElement;
    expect(tableRoot).toBeTruthy();

    // External scroll mode is active even with rowGrouping configured.
    expect(tableRoot.classList.contains("st-external-scroll")).toBe(true);

    // Grouping warning was emitted because enableStickyParents was set alongside
    // scrollParent. Exactly one warning, with the expected guidance.
    const captured = (
      window as unknown as { __externalGroupingWarnCapture?: { warnings: string[] } }
    ).__externalGroupingWarnCapture;
    expect(captured).toBeTruthy();
    const stickyWarnings = captured!.warnings.filter((w) =>
      w.includes("`enableStickyParents` is not supported"),
    );
    expect(stickyWarnings.length).toBe(1);

    // No sticky-top overlay should be present — the warn-and-noop must skip
    // building the sticky parents container in external scroll mode.
    const stickyTopOverlay = canvasElement.querySelector(".st-sticky-top");
    expect(stickyTopOverlay).toBeNull();

    // Virtualization is active: only a subset of the 1050 expanded rows is rendered.
    const renderedBeforeScroll = getRowCount(canvasElement);
    expect(renderedBeforeScroll).toBeGreaterThan(0);
    expect(renderedBeforeScroll).toBeLessThan(200);

    // Group parent rows are present: the first rendered group's parent cell
    // ("Group 1") should be in the DOM with the table fully scrolled to top.
    const allCells = Array.from(canvasElement.querySelectorAll(".st-cell"));
    const hasGroupParent = allCells.some((c) => c.textContent?.includes("Group 1"));
    const hasGroupChild = allCells.some((c) =>
      c.textContent?.includes("Child 1 of group 1"),
    );
    expect(hasGroupParent).toBe(true);
    expect(hasGroupChild).toBe(true);

    // Expand/collapse chevrons must render on the `expandable` column for the
    // parent rows — this is the user-facing affordance for grouped rows.
    const bodyContainer = canvasElement.querySelector(".st-body-container") as HTMLElement;
    const expandIcons = bodyContainer.querySelectorAll(".st-expand-icon-container");
    expect(expandIcons.length).toBeGreaterThan(0);

    // Scroll the external container; row virtualization must shift the rendered
    // window. We expect different row indices to be on screen after a large
    // scroll, proving the external parent's scroll drives the body windowing.
    const indicesBefore = new Set(
      Array.from(canvasElement.querySelectorAll(".st-cell[data-row-index]")).map((c) =>
        c.getAttribute("data-row-index"),
      ),
    );

    scrollContainer.scrollTop = 8000; // well past the first viewport
    scrollContainer.dispatchEvent(new Event("scroll", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));

    const indicesAfter = new Set(
      Array.from(canvasElement.querySelectorAll(".st-cell[data-row-index]")).map((c) =>
        c.getAttribute("data-row-index"),
      ),
    );
    // The rendered window must have shifted — at least one new row index that
    // wasn't visible before scrolling.
    const newlyVisible = Array.from(indicesAfter).filter((idx) => !indicesBefore.has(idx));
    expect(newlyVisible.length).toBeGreaterThan(0);

    // Still no sticky parents overlay after scrolling.
    expect(canvasElement.querySelector(".st-sticky-top")).toBeNull();

    // Restore console.warn so we don't leak the wrapper into the next story.
    const restore = (
      window as unknown as { __externalGroupingWarnRestore?: () => void }
    ).__externalGroupingWarnRestore;
    restore?.();
  },
};
