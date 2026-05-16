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

    const scrollContainer = canvasElement.querySelector(
      "#external-scroll-host",
    ) as HTMLElement;
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
    (window as unknown as { __externalLoadMoreCapture?: { count: number } }).__externalLoadMoreCapture = captured;

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
  },
};
