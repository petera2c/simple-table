/**
 * CELL RENDERER TESTS
 * Tests for HeaderObject.cellRenderer - custom cell content.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/26 - Cell Renderer",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tests for cellRenderer: custom cell content per column.",
      },
    },
  },
};

export default meta;

const createData = () => [
  { id: 1, name: "Alice", score: 85 },
  { id: 2, name: "Bob", score: 92 },
];

export const CustomCellRendererElement = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "name",
        label: "Name",
        width: 150,
        type: "string",
        cellRenderer: ({ value, row }) => {
          const el = document.createElement("span");
          el.className = "custom-cell-rendered";
          el.setAttribute("data-row-id", String(row?.id));
          el.textContent = `Rendered: ${value}`;
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
    const customCells = canvasElement.querySelectorAll(".custom-cell-rendered");
    expect(customCells.length).toBe(2);
    expect(customCells[0].textContent).toBe("Rendered: Alice");
    expect(customCells[0].getAttribute("data-row-id")).toBe("1");
    expect(customCells[1].textContent).toBe("Rendered: Bob");
  },
};

export const CustomCellRendererString = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "score",
        label: "Score",
        width: 100,
        type: "number",
        cellRenderer: ({ value }) => `Score: ${value}`,
      },
    ];
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.textContent).toContain("Score: 85");
    expect(canvasElement.textContent).toContain("Score: 92");
  },
};

export const DefaultCellWithoutRenderer = {
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
    expect(canvasElement.textContent).toContain("Alice");
    expect(canvasElement.textContent).toContain("Bob");
    expect(canvasElement.querySelector(".custom-cell-rendered")).toBeFalsy();
  },
};
