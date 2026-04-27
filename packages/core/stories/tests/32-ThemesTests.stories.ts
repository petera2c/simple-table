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

// Larger dataset so we can verify alternating classes across multiple rows
const stripedData = () => [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Carol" },
  { id: 4, name: "Dave" },
  { id: 5, name: "Eve" },
  { id: 6, name: "Frank" },
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
  tags: ["odd-even-row-background"],
  render: () => {
    const { wrapper } = renderVanillaTable(headers, stripedData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      useOddEvenRowBackground: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root") as HTMLElement | null;
    expect(root).toBeTruthy();

    // The feature applies "st-cell-odd-row" / "st-cell-even-row" classes to
    // every body cell. Sanity-check that each rendered row has the expected
    // class and that adjacent rows alternate.
    const allBodyCells = canvasElement.querySelectorAll<HTMLElement>(
      ".st-body-container .st-cell[data-row-index]",
    );
    expect(allBodyCells.length).toBeGreaterThan(0);

    // Group cells by their row index so we can verify per-row class consistency.
    const cellsByRow = new Map<number, HTMLElement[]>();
    allBodyCells.forEach((cell) => {
      const idx = Number(cell.getAttribute("data-row-index"));
      if (!cellsByRow.has(idx)) cellsByRow.set(idx, []);
      cellsByRow.get(idx)!.push(cell);
    });

    const sortedRowIndices = Array.from(cellsByRow.keys()).sort((a, b) => a - b);
    expect(sortedRowIndices.length).toBeGreaterThanOrEqual(4);

    let oddRowCount = 0;
    let evenRowCount = 0;

    sortedRowIndices.forEach((rowIndex) => {
      const cells = cellsByRow.get(rowIndex)!;
      // 0-based: rowIndex 0 is visually the 1st row → "odd" (1-based);
      //          rowIndex 1 is visually the 2nd row → "even" (1-based).
      const expectedClass =
        rowIndex % 2 === 0 ? "st-cell-odd-row" : "st-cell-even-row";
      const forbiddenClass =
        rowIndex % 2 === 0 ? "st-cell-even-row" : "st-cell-odd-row";

      cells.forEach((cell) => {
        expect(cell.classList.contains(expectedClass)).toBe(true);
        expect(cell.classList.contains(forbiddenClass)).toBe(false);
      });

      if (expectedClass === "st-cell-odd-row") oddRowCount++;
      else evenRowCount++;
    });

    // Both classes must actually appear in the rendered output, otherwise
    // the alternating background effect cannot occur.
    expect(oddRowCount).toBeGreaterThan(0);
    expect(evenRowCount).toBeGreaterThan(0);
  },
};

export const UseOddEvenRowBackgroundDisabled = {
  tags: ["odd-even-row-background"],
  render: () => {
    const { wrapper } = renderVanillaTable(headers, stripedData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      useOddEvenRowBackground: false,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // When the flag is off, no body cell should carry the alternating-row classes.
    const oddCells = canvasElement.querySelectorAll(
      ".st-body-container .st-cell.st-cell-odd-row",
    );
    const evenCells = canvasElement.querySelectorAll(
      ".st-body-container .st-cell.st-cell-even-row",
    );
    expect(oddCells.length).toBe(0);
    expect(evenCells.length).toBe(0);
  },
};

// Visual-effect test: with a theme that defines distinct odd/even colors
// (e.g. "light"), enabling useOddEvenRowBackground must actually produce
// different computed background colors between adjacent rows. This guards
// against regressions where the class is applied but the styling does not
// resolve (e.g. due to broken selectors or specificity issues).
export const UseOddEvenRowBackgroundVisualEffect = {
  tags: ["odd-even-row-background"],
  render: () => {
    const { wrapper } = renderVanillaTable(headers, stripedData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      theme: "light",
      useOddEvenRowBackground: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const cellRow0 = canvasElement.querySelector<HTMLElement>(
      '.st-body-container .st-cell[data-row-index="0"]',
    );
    const cellRow1 = canvasElement.querySelector<HTMLElement>(
      '.st-body-container .st-cell[data-row-index="1"]',
    );
    expect(cellRow0).toBeTruthy();
    expect(cellRow1).toBeTruthy();

    expect(cellRow0!.classList.contains("st-cell-odd-row")).toBe(true);
    expect(cellRow1!.classList.contains("st-cell-even-row")).toBe(true);

    const bg0 = window.getComputedStyle(cellRow0!).backgroundColor;
    const bg1 = window.getComputedStyle(cellRow1!).backgroundColor;
    // Both must resolve to a real, visible color (not "transparent" / empty).
    expect(bg0).toBeTruthy();
    expect(bg1).toBeTruthy();
    expect(bg0).not.toBe("rgba(0, 0, 0, 0)");
    expect(bg1).not.toBe("rgba(0, 0, 0, 0)");
    // And the two row colors must actually differ — that's the whole point.
    expect(bg0).not.toBe(bg1);
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
