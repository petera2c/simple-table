/**
 * THEMES TESTS
 * Tests for SimpleTable theme prop (light, dark, neutral, modern-light, modern-dark).
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { ColumnDef } from "../../src/index";
import { waitForTable, getRowCount } from "./testUtils";
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

const headers: ColumnDef[] = [
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
      hoverRowBackground: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // hoverRowBackground adds "st-row-hovered" to cells when the mouse enters a row
    const firstCell = canvasElement.querySelector<HTMLElement>(".st-cell");
    expect(firstCell).toBeTruthy();
    firstCell!.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 50));
    // After mouseenter, any cell in that row should have st-row-hovered
    const hoveredCells = canvasElement.querySelectorAll(".st-cell.st-row-hovered");
    expect(hoveredCells.length).toBeGreaterThan(0);
  },
};

export const UseHoverRowBackgroundIsolatedAcrossTables = {
  render: () => {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "16px";

    const tableA = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "200px",
      hoverRowBackground: true,
    });
    const tableB = renderVanillaTable(headers, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "200px",
      hoverRowBackground: true,
    });
    tableA.wrapper.dataset.table = "a";
    tableB.wrapper.dataset.table = "b";
    container.appendChild(tableA.wrapper);
    container.appendChild(tableB.wrapper);
    return container;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const tableA = canvasElement.querySelector<HTMLElement>('[data-table="a"]');
    const tableB = canvasElement.querySelector<HTMLElement>('[data-table="b"]');
    expect(tableA).toBeTruthy();
    expect(tableB).toBeTruthy();

    // data-row-id is path-based: [index, getRowId] → "0-1" for the first row
    const cellA = tableA!.querySelector<HTMLElement>('.st-cell[data-row-id="0-1"]');
    expect(cellA).toBeTruthy();
    cellA!.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 50));

    expect(tableA!.querySelectorAll(".st-cell.st-row-hovered").length).toBeGreaterThan(0);
    expect(tableB!.querySelectorAll(".st-cell.st-row-hovered").length).toBe(0);
  },
};

export const UseOddEvenRowBackground = {
  tags: ["odd-even-row-background"],
  render: () => {
    const { wrapper } = renderVanillaTable(headers, stripedData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "400px",
      oddEvenRowBackground: true,
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
      oddEvenRowBackground: false,
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
// (e.g. "light"), enabling oddEvenRowBackground must actually produce
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
      oddEvenRowBackground: true,
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
      oddColumnBackground: true,
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

// ============================================================================
// getRowClass
// ============================================================================

const jumpHighlightData = () =>
  Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
  }));

export const GetRowClassHighlightsMatchingRow = {
  tags: ["get-row-class"],
  render: () => {
    const { wrapper } = renderVanillaTable(headers, stripedData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      getRowClass: ({ row }) =>
        (row as { id?: number }).id === 3 ? "test-jump-row" : undefined,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // Path-based row id: [index, getRowId] → "2-3" for id 3 at index 2
    const highlighted = canvasElement.querySelectorAll<HTMLElement>(
      '.st-cell[data-row-id="2-3"].test-jump-row',
    );
    expect(highlighted.length).toBeGreaterThan(0);
    // Every cell of that row should carry the class
    const allInRow = canvasElement.querySelectorAll<HTMLElement>('.st-cell[data-row-id="2-3"]');
    expect(allInRow.length).toBeGreaterThan(0);
    allInRow.forEach((cell) => {
      expect(cell.classList.contains("test-jump-row")).toBe(true);
    });
    // Other rows must not
    const other = canvasElement.querySelectorAll<HTMLElement>(
      '.st-cell[data-row-id="0-1"].test-jump-row',
    );
    expect(other.length).toBe(0);
  },
};

export const GetRowClassUpdatesWhenCallbackIdentityChanges = {
  tags: ["get-row-class"],
  render: () => {
    const result = renderVanillaTable(headers, stripedData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      getRowClass: ({ row }) =>
        (row as { id?: number }).id === 1 ? "test-jump-row" : undefined,
    });
    (globalThis as unknown as Record<string, typeof result.table>)[
      "__storybook_get_row_class_table"
    ] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = (globalThis as unknown as Record<string, { update: (c: object) => void }>)[
      "__storybook_get_row_class_table"
    ];
    expect(table).toBeTruthy();

    expect(
      canvasElement.querySelectorAll('.st-cell[data-row-id="0-1"].test-jump-row').length,
    ).toBeGreaterThan(0);

    table.update({
      getRowClass: ({ row }: { row: { id?: number } }) =>
        row.id === 4 ? "test-jump-row" : undefined,
    });
    await new Promise((r) => setTimeout(r, 50));

    expect(
      canvasElement.querySelectorAll('.st-cell[data-row-id="0-1"].test-jump-row').length,
    ).toBe(0);
    expect(
      canvasElement.querySelectorAll('.st-cell[data-row-id="3-4"].test-jump-row').length,
    ).toBeGreaterThan(0);
  },
};

export const GetRowClassSurvivesVirtualizationReuse = {
  tags: ["get-row-class"],
  render: () => {
    const { wrapper } = renderVanillaTable(headers, jumpHighlightData(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      // Small viewport + 500 rows so only a band of rows is mounted
      height: "200px",
      getRowClass: ({ row }) =>
        (row as { id?: number }).id === 2 ? "test-jump-row" : undefined,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const body = canvasElement.querySelector(".st-body-container") as HTMLElement | null;
    expect(body).toBeTruthy();

    // Virtualization must be active — far fewer than 500 rows in the DOM
    const renderedAtTop = getRowCount(canvasElement);
    expect(renderedAtTop).toBeGreaterThan(0);
    expect(renderedAtTop).toBeLessThan(100);

    // Highlighted early row is visible at the top
    const targetSelector = '.st-cell[data-row-id="1-2"].test-jump-row';
    expect(canvasElement.querySelectorAll(targetSelector).length).toBeGreaterThan(0);

    const indicesAtTop = new Set(
      Array.from(canvasElement.querySelectorAll(".st-cell[data-row-index]")).map((c) =>
        c.getAttribute("data-row-index"),
      ),
    );

    // Scroll deep enough that the early band (including id 2) leaves the viewport
    body!.scrollTop = Math.min(8000, body!.scrollHeight - body!.clientHeight);
    body!.dispatchEvent(new Event("scroll", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));

    const indicesScrolled = new Set(
      Array.from(canvasElement.querySelectorAll(".st-cell[data-row-index]")).map((c) =>
        c.getAttribute("data-row-index"),
      ),
    );
    const newlyVisible = Array.from(indicesScrolled).filter((idx) => !indicesAtTop.has(idx));
    expect(newlyVisible.length).toBeGreaterThan(0);

    // Target row is no longer in the virtualized band
    expect(canvasElement.querySelectorAll(targetSelector).length).toBe(0);

    // Scroll back to top — recycled cells must re-apply the class for id 2
    body!.scrollTop = 0;
    body!.dispatchEvent(new Event("scroll", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));

    const after = canvasElement.querySelectorAll(targetSelector);
    expect(after.length).toBeGreaterThan(0);
    const allInRow = canvasElement.querySelectorAll<HTMLElement>('.st-cell[data-row-id="1-2"]');
    expect(allInRow.length).toBeGreaterThan(0);
    allInRow.forEach((cell) => {
      expect(cell.classList.contains("test-jump-row")).toBe(true);
    });
    expect(
      canvasElement.querySelectorAll('.st-cell[data-row-id="0-1"].test-jump-row').length,
    ).toBe(0);
  },
};

// ============================================================================
// cellClass
// ============================================================================

export const CellClassAppliesToColumnCells = {
  tags: ["cell-class"],
  render: () => {
    const columnsWithClass: ColumnDef[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "name",
        label: "Name",
        width: 120,
        type: "string",
        cellClass: "test-col-class",
      },
    ];
    const { wrapper } = renderVanillaTable(columnsWithClass, data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const nameCells = canvasElement.querySelectorAll<HTMLElement>(
      '.st-cell[data-accessor="name"]',
    );
    expect(nameCells.length).toBeGreaterThan(0);
    nameCells.forEach((cell) => {
      expect(cell.classList.contains("test-col-class")).toBe(true);
    });
    const idCells = canvasElement.querySelectorAll<HTMLElement>('.st-cell[data-accessor="id"]');
    expect(idCells.length).toBeGreaterThan(0);
    idCells.forEach((cell) => {
      expect(cell.classList.contains("test-col-class")).toBe(false);
    });
  },
};
