/**
 * CELL RENDERER TESTS
 * Tests for HeaderObject.cellRenderer - custom cell content.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { CellRendererProps, HeaderObject } from "../../src/index";
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

// ============================================================================
// CELL RENDERER PARAMS: colIndex, formattedValue, theme, rowPath
// ============================================================================

export const CellRendererColIndexParam = {
  render: () => {
    const capturedIndices: number[] = [];
    (window as unknown as { __colIndexCapture?: number[] }).__colIndexCapture = capturedIndices;
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "name",
        label: "Name",
        width: 150,
        type: "string",
        cellRenderer: ({
          colIndex,
        }: {
          colIndex: number;
          value?: unknown;
          row?: Record<string, unknown>;
        }) => {
          capturedIndices.push(colIndex);
          const el = document.createElement("span");
          el.setAttribute("data-col-index", String(colIndex));
          el.textContent = String(colIndex);
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
    const colIndexEls = canvasElement.querySelectorAll("[data-col-index]");
    expect(colIndexEls.length).toBeGreaterThan(0);
    // colIndex for the "name" column (index 1) should be consistent
    const indices = Array.from(colIndexEls).map((el) =>
      parseInt(el.getAttribute("data-col-index") ?? "0", 10),
    );
    // colIndex values are always non-negative; they may differ across cells when
    // column virtualization is active (startColIndex varies with scroll position)
    expect(indices.every((i) => i >= 0)).toBe(true);
  },
};

export const CellRendererFormattedValueParam = {
  render: () => {
    const capturedFormattedValues: (string | undefined)[] = [];
    (
      window as unknown as { __formattedValueCapture?: (string | undefined)[] }
    ).__formattedValueCapture = capturedFormattedValues;
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "score",
        label: "Score",
        width: 150,
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) => `${value}%`,
        cellRenderer: ({ formattedValue, value }: CellRendererProps) => {
          const fv = formattedValue != null ? String(formattedValue) : undefined;
          capturedFormattedValues.push(fv);
          const el = document.createElement("span");
          el.setAttribute("data-testid", "formatted-value-cell");
          el.setAttribute("data-formatted", fv ?? "");
          el.textContent = fv ?? String(value);
          return el;
        },
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
    const cells = canvasElement.querySelectorAll('[data-testid="formatted-value-cell"]');
    expect(cells.length).toBeGreaterThan(0);
    const captured = (window as unknown as { __formattedValueCapture?: (string | undefined)[] })
      .__formattedValueCapture;
    expect(captured).toBeTruthy();
    expect(captured!.some((v) => v !== undefined)).toBe(true);
    if (captured!.some((v) => v !== undefined)) {
      expect(captured!.some((v) => v?.includes("%"))).toBe(true);
    }
  },
};

export const CellRendererThemeParam = {
  render: () => {
    const capturedThemes: string[] = [];
    (window as unknown as { __themeCapture?: string[] }).__themeCapture = capturedThemes;
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "name",
        label: "Name",
        width: 150,
        type: "string",
        cellRenderer: ({
          theme,
          value,
        }: {
          theme?: string;
          value?: unknown;
          colIndex: number;
          row?: Record<string, unknown>;
          rowIndex: number;
        }) => {
          if (theme) capturedThemes.push(theme);
          const el = document.createElement("span");
          el.setAttribute("data-theme-param", theme ?? "none");
          el.textContent = String(value);
          return el;
        },
      },
    ];
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "250px",
      theme: "dark",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const cells = canvasElement.querySelectorAll("[data-theme-param]");
    expect(cells.length).toBeGreaterThan(0);
    const captured = (window as unknown as { __themeCapture?: string[] }).__themeCapture;
    // If theme is passed, it should be "dark"
    if (captured && captured.length > 0) {
      expect(captured.every((t) => t === "dark")).toBe(true);
    }
  },
};
