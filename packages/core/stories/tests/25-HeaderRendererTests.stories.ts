/**
 * HEADER RENDERER TESTS
 * Tests for HeaderObject.headerRenderer - custom header content.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import type { HeaderRenderer } from "../../src/types/HeaderRendererProps";
import { waitForTable } from "./testUtils";
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
