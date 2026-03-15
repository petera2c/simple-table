/**
 * HEADER RENDERER TESTS
 * Tests for HeaderObject.headerRenderer - custom header content.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
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
          else if (typeof labelContent === "string") wrap.appendChild(document.createTextNode(labelContent));
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
