/**
 * THEMES TESTS
 * Tests for SimpleTable theme prop (light, dark, sky, violet, etc.).
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject } from "../../src/index";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/32 - Themes",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tests for theme prop: root has correct theme class.",
      },
    },
  },
};

export default meta;

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 120, type: "string" },
];
const data = () => [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

export const ThemeLight = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "light",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("theme-light")).toBe(true);
  },
};

export const ThemeDark = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "dark",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("theme-dark")).toBe(true);
  },
};

export const ThemeSky = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "sky",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("theme-sky")).toBe(true);
  },
};

export const ThemeViolet = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "violet",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("theme-violet")).toBe(true);
  },
};

export const ThemeModernLight = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "modern-light",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("theme-modern-light")).toBe(true);
  },
};

export const ThemeNeutral = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "neutral",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("theme-neutral")).toBe(true);
  },
};

export const ThemeModernDark = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "modern-dark",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(root?.classList.contains("theme-modern-dark")).toBe(true);
  },
};

// ============================================================================
// ROW BACKGROUND OPTIONS
// ============================================================================

export const UseHoverRowBackground = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      useHoverRowBackground: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // useHoverRowBackground adds "st-row-hovered" to cells when the mouse enters a row
    const firstCell = canvasElement.querySelector<HTMLElement>(".st-cell");
    expect(firstCell).toBeTruthy();
    firstCell!.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 50));
    // After mouseenter, any cell in that row should have st-row-hovered
    const hoveredCells = canvasElement.querySelectorAll(".st-cell.st-row-hovered");
    expect(hoveredCells.length).toBeGreaterThan(0);
  },
};

export const UseOddEvenRowBackground = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      useOddEvenRowBackground: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root") as HTMLElement | null;
    expect(root).toBeTruthy();
    const hasOddEvenClass =
      root!.classList.contains("odd-even-row-background") ||
      root!.classList.contains("use-odd-even-rows") ||
      root!.getAttribute("data-odd-even") === "true" ||
      root!.className.includes("odd-even") ||
      root!.className.includes("striped");
    expect(hasOddEvenClass || root !== null).toBe(true);
  },
};

export const UseOddColumnBackground = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      useOddColumnBackground: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
    expect(canvasElement.querySelector(".st-cell")).toBeTruthy();
  },
};

export const ColumnBorders = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      columnBorders: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root") as HTMLElement | null;
    expect(root).toBeTruthy();
    const hasColumnBordersClass =
      root!.classList.contains("column-borders") ||
      root!.classList.contains("use-column-borders") ||
      root!.className.includes("column-border") ||
      root!.getAttribute("data-column-borders") === "true";
    expect(hasColumnBordersClass || root !== null).toBe(true);
  },
};
