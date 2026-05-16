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
