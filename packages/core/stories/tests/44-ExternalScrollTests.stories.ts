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
// TEST 6: Row grouping with enableStickyParents works in external scroll mode.
// The sticky-parents container's `top` is JS-driven by the external scrollTop
// so grouped parent rows pin under the sticky header instead of scrolling away.
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

    // Scroll the external container deep into the dataset — past the first
    // group's children so the grouping renderer must pick a sticky ancestor.
    const indicesBefore = new Set(
      Array.from(canvasElement.querySelectorAll(".st-cell[data-row-index]")).map((c) =>
        c.getAttribute("data-row-index"),
      ),
    );

    scrollContainer.scrollTop = 8000;
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

    // After scrolling, enableStickyParents must produce the .st-sticky-top
    // overlay (this is the user-facing fix — grouped parents pin under the
    // sticky header rather than scrolling out of view with the table).
    const stickyTop = canvasElement.querySelector(".st-sticky-top") as HTMLElement | null;
    expect(stickyTop).not.toBeNull();

    // The overlay must pin directly under the sticky header. The header is
    // already proven to pin flush to the parent's outer edge (Test 5), so
    // the sticky-top's top edge should equal scrollContainerTop + headerHeight
    // (within a small layout tolerance).
    const headerContainer = canvasElement.querySelector(".st-header-container") as HTMLElement;
    const headerRect = headerContainer.getBoundingClientRect();
    const stickyTopRect = stickyTop!.getBoundingClientRect();
    expect(Math.abs(stickyTopRect.top - headerRect.bottom)).toBeLessThan(3);

    // The pinned parent row should belong to a group whose children are
    // currently in view at scrollTop ~ 8000. We don't pin the exact group
    // number (depends on row height + grouping math), but we *do* assert that
    // the sticky-top renders at least one parent cell labelled "Group N".
    const stickyParentCells = Array.from(stickyTop!.querySelectorAll(".st-cell"));
    const hasPinnedGroupParent = stickyParentCells.some((c) =>
      /^Group \d+$/.test((c.textContent ?? "").trim()),
    );
    expect(hasPinnedGroupParent).toBe(true);
  },
};
