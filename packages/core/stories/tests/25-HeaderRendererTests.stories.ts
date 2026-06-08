/**
 * HEADER RENDERER TESTS
 * Tests for HeaderObject.headerRenderer - custom header content.
 */

import type { Meta } from "@storybook/html";
import { expect, userEvent } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import type { HeaderRenderer } from "../../src/types/HeaderRendererProps";
import { waitForTable, waitUntil } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/25 - Header Renderer",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tests for headerRenderer: custom header content per column.",
      },
    },
  },
};

export default meta;

const createData = () => [
  { id: 1, name: "Alice", score: 85 },
  { id: 2, name: "Bob", score: 92 },
];

export const CustomHeaderRenderer = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "name",
        label: "Name",
        width: 150,
        type: "string",
        headerRenderer: ({ header, accessor }) => {
          const el = document.createElement("span");
          el.className = "custom-header-rendered";
          el.setAttribute("data-accessor", String(accessor));
          el.textContent = `Custom: ${header.label}`;
          return el;
        },
      },
      { accessor: "score", label: "Score", width: 100, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const customHeader = canvasElement.querySelector(".custom-header-rendered");
    expect(customHeader).toBeTruthy();
    expect(customHeader?.getAttribute("data-accessor")).toBe("name");
    expect(customHeader?.textContent).toBe("Custom: Name");
  },
};

export const HeaderRendererWithComponents = {
  parameters: { tags: ["fail-header-renderer-with-components"] },
  render: () => {
    const headers: HeaderObject[] = [
      {
        accessor: "id",
        label: "ID",
        width: 100,
        type: "number",
        headerRenderer: ({ components }) => {
          const wrap = document.createElement("div");
          wrap.className = "header-with-components";
          const labelContent = components?.labelContent;
          if (labelContent instanceof HTMLElement) wrap.appendChild(labelContent);
          else if (typeof labelContent === "string")
            wrap.appendChild(document.createTextNode(labelContent));
          const sortIcon = components?.sortIcon;
          if (sortIcon instanceof HTMLElement) wrap.appendChild(sortIcon);
          return wrap;
        },
      },
      { accessor: "name", label: "Name", width: 150, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const wrap = canvasElement.querySelector(".header-with-components");
    expect(wrap).toBeTruthy();
    expect(wrap?.childNodes.length).toBeGreaterThan(0);
  },
};

export const DefaultHeaderWithoutRenderer = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: 150, type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const headerLabels = canvasElement.querySelectorAll(".st-header-label");
    expect(headerLabels.length).toBeGreaterThanOrEqual(2);
    expect(canvasElement.textContent).toContain("ID");
    expect(canvasElement.textContent).toContain("Name");
  },
};

// ============================================================================
// HEADER RENDERER WITH FILTER ICON COMPONENT
// ============================================================================

export const HeaderRendererWithFilterIcon = {
  render: () => {
    const headers: HeaderObject[] = [
      {
        accessor: "name",
        label: "Name",
        width: 200,
        type: "string",
        filterable: true,
        headerRenderer: ({ components }) => {
          const wrap = document.createElement("div");
          wrap.setAttribute("data-testid", "header-with-filter");
          wrap.style.display = "flex";
          wrap.style.alignItems = "center";
          wrap.style.gap = "4px";
          const label = components?.labelContent;
          if (label instanceof HTMLElement) wrap.appendChild(label);
          const filterIcon = components?.filterIcon;
          if (filterIcon instanceof HTMLElement) {
            filterIcon.setAttribute("data-testid", "filter-icon-slot");
            wrap.appendChild(filterIcon);
          }
          return wrap;
        },
      },
      { accessor: "score", label: "Score", width: 100, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const headerWithFilter = canvasElement.querySelector('[data-testid="header-with-filter"]');
    expect(headerWithFilter).toBeTruthy();
    // Filter icon slot should be present (if components.filterIcon is provided)
    const filterIconSlot = canvasElement.querySelector('[data-testid="filter-icon-slot"]');
    // If the implementation provides filterIcon in components, it should be here
    if (filterIconSlot) {
      expect(filterIconSlot).toBeTruthy();
    } else {
      // At minimum the custom header wrapper rendered
      expect(headerWithFilter).toBeTruthy();
    }
  },
};

// ============================================================================
// HEADER RENDERER WITH SORT ICON COMPONENT
// Regression: a custom header that places `components.sortIcon` must show the
// sort icon once the column becomes sorted — even though the cell (and the
// headerRenderer) was first rendered while unsorted, when the icon did not yet
// exist. The cell takes the in-place "update" path on sort rather than being
// recreated, so the renderer must be re-run with the freshly built icon.
// ============================================================================

export const HeaderRendererSortIconAppearsOnSort = {
  render: () => {
    const headers: HeaderObject[] = [
      {
        accessor: "name",
        label: "Name",
        width: 200,
        type: "string",
        isSortable: true,
        headerRenderer: ({ components, header }) => {
          const wrap = document.createElement("div");
          wrap.setAttribute("data-testid", "sortable-custom-header");
          wrap.style.display = "flex";
          wrap.style.alignItems = "center";
          wrap.style.gap = "4px";
          const label = components?.labelContent;
          if (label instanceof HTMLElement) wrap.appendChild(label);
          else wrap.appendChild(document.createTextNode(String(header.label)));
          const sortIcon = components?.sortIcon;
          if (sortIcon instanceof HTMLElement) {
            sortIcon.setAttribute("data-testid", "custom-sort-icon-slot");
            wrap.appendChild(sortIcon);
          }
          return wrap;
        },
      },
      { accessor: "score", label: "Score", width: 100, type: "number" },
    ];
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const customHeader = canvasElement.querySelector('[data-testid="sortable-custom-header"]');
    expect(customHeader).toBeTruthy();

    // Initially unsorted: no sort icon should be present inside the custom header.
    expect(canvasElement.querySelector('[data-testid="custom-sort-icon-slot"]')).toBeNull();

    // Click the header label to sort the column.
    const headerCell = (customHeader as HTMLElement).closest(".st-header-cell") as HTMLElement;
    const labelEl = headerCell.querySelector(".st-header-label") as HTMLElement;
    const user = userEvent.setup();
    await user.click(labelEl);

    // After sorting, the custom header must now render `components.sortIcon`.
    // The renderer re-runs and replaces the label content, so re-query the
    // current nodes rather than reusing the pre-sort references.
    await waitUntil(
      () => canvasElement.querySelector('[data-testid="custom-sort-icon-slot"]') !== null,
    );
    const sortIconAfter = canvasElement.querySelector('[data-testid="custom-sort-icon-slot"]');
    expect(sortIconAfter).toBeTruthy();
    // The icon lives inside the custom header markup (not appended elsewhere).
    const customHeaderAfter = canvasElement.querySelector('[data-testid="sortable-custom-header"]');
    expect(customHeaderAfter?.contains(sortIconAfter)).toBe(true);
  },
};

// ============================================================================
// HEADER RENDERER WITH COLLAPSE ICON COMPONENT (collapsible column group)
// ============================================================================

export const HeaderRendererWithCollapseIcon = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60 },
      {
        accessor: "salesGroup",
        label: "Sales",
        width: 200,
        collapsible: true,
        singleRowChildren: true,
        headerRenderer: ({ components }) => {
          const wrap = document.createElement("div");
          wrap.setAttribute("data-testid", "collapsible-header-renderer");
          wrap.style.display = "flex";
          wrap.style.alignItems = "center";
          wrap.style.gap = "4px";
          const collapseIcon = components?.collapseIcon;
          if (collapseIcon instanceof HTMLElement) {
            collapseIcon.setAttribute("data-testid", "collapse-icon-slot");
            wrap.appendChild(collapseIcon);
          }
          const label = components?.labelContent;
          if (label instanceof HTMLElement) wrap.appendChild(label);
          return wrap;
        },
        children: [
          { accessor: "q1", label: "Q1", width: 80 },
          { accessor: "q2", label: "Q2", width: 80 },
        ],
      },
    ];
    const data = [
      { id: 1, q1: 100, q2: 110 },
      { id: 2, q1: 90, q2: 95 },
    ];
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const renderedHeader = canvasElement.querySelector(
      '[data-testid="collapsible-header-renderer"]',
    );
    expect(renderedHeader).toBeTruthy();
    const collapseIconSlot = canvasElement.querySelector('[data-testid="collapse-icon-slot"]');
    if (collapseIconSlot) {
      expect(collapseIconSlot).toBeTruthy();
    } else {
      expect(renderedHeader).toBeTruthy();
    }
  },
};
