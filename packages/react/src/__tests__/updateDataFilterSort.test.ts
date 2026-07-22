import { afterEach, describe, expect, it } from "vitest";
/**
 * Live `updateData` must re-evaluate active filters and sort so visibility and
 * order stay correct after in-place cell writes (not only refresh DOM cells).
 */
import { SimpleTableVanilla } from "simple-table-core";
import type { ColumnDef, SimpleTableConfig } from "simple-table-core";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0));

let container: HTMLDivElement | null = null;
let instance: SimpleTableVanilla | null = null;

afterEach(() => {
  instance?.destroy();
  instance = null;
  container?.remove();
  container = null;
});

const getRowId = (p: { row: unknown }) => String((p.row as { id?: number })?.id);

/** Visible product labels in display order (by data-row-index / top). */
function visibleProductNamesInOrder(): string[] {
  return Array.from(container!.querySelectorAll('[data-accessor="product"][data-row-index]'))
    .map((el) => ({
      index: Number(el.getAttribute("data-row-index")),
      text: el.querySelector(".st-cell-content")?.textContent ?? "",
    }))
    .sort((a, b) => a.index - b.index)
    .map((c) => c.text);
}

function mountTable(
  config: Partial<SimpleTableConfig> & { rows: RowLike[]; columns: ColumnDef[] },
) {
  container = document.createElement("div");
  document.body.appendChild(container);
  instance = new SimpleTableVanilla(container, {
    getRowId,
    height: "400px",
    theme: "light",
    cellUpdateFlash: false,
    ...config,
  });
  instance.mount();
  return instance;
}

type RowLike = Record<string, unknown>;

describe("updateData — filter and sort", () => {
  it("removes a row from the visible set when a live update fails the active filter", async () => {
    const rows = [
      { id: 1, product: "Widget A", stock: 42 },
      { id: 2, product: "Widget B", stock: 28 },
      { id: 3, product: "Widget C", stock: 15 },
    ];
    const headers: ColumnDef[] = [
      { accessor: "product", label: "Product", width: 180, type: "string" },
      { accessor: "stock", label: "Stock", width: 120, type: "number" },
    ];

    const table = mountTable({ columns: headers, rows });
    const api = table.getAPI();

    await api.applyFilter({ accessor: "stock", operator: "greaterThan", value: 20 });
    await waitFor(() => visibleProductNamesInOrder().length === 2);
    expect(visibleProductNamesInOrder()).toEqual(["Widget A", "Widget B"]);

    // Source index 0 is Widget A; drop stock below the filter threshold.
    api.updateData({ accessor: "stock", rowIndex: 0, newValue: 5 });
    await flushMicrotasks();
    await waitFor(() => visibleProductNamesInOrder().length === 1);
    expect(visibleProductNamesInOrder()).toEqual(["Widget B"]);
  });

  it("reorders visible rows when a live update changes the sorted column", async () => {
    const rows = [
      { id: 1, product: "Widget A", price: 10 },
      { id: 2, product: "Widget B", price: 20 },
      { id: 3, product: "Widget C", price: 30 },
    ];
    const headers: ColumnDef[] = [
      { accessor: "product", label: "Product", width: 180, type: "string" },
      { accessor: "price", label: "Price", width: 120, type: "number" },
    ];

    const table = mountTable({ columns: headers, rows });
    const api = table.getAPI();

    await api.applySortState({ accessor: "price", direction: "asc" });
    await waitFor(() => visibleProductNamesInOrder()[0] === "Widget A");
    expect(visibleProductNamesInOrder()).toEqual(["Widget A", "Widget B", "Widget C"]);

    // Raise Widget A's price above the others → should move to the end (asc).
    api.updateData({ accessor: "price", rowIndex: 0, newValue: 50 });
    await flushMicrotasks();
    await waitFor(() => {
      const order = api.getVisibleRows().map((vr) => (vr.row as { product: string }).product);
      return order[2] === "Widget A";
    });
    expect(api.getVisibleRows().map((vr) => (vr.row as { product: string }).product)).toEqual([
      "Widget B",
      "Widget C",
      "Widget A",
    ]);
    expect(visibleProductNamesInOrder()).toEqual(["Widget B", "Widget C", "Widget A"]);
  });

  it("writes nested accessors so filter/sort see the updated value", async () => {
    const rows = [
      { id: 1, product: "Widget A", stats: { score: 10 } },
      { id: 2, product: "Widget B", stats: { score: 50 } },
      { id: 3, product: "Widget C", stats: { score: 90 } },
    ];
    const headers: ColumnDef[] = [
      { accessor: "product", label: "Product", width: 180, type: "string" },
      { accessor: "stats.score", label: "Score", width: 120, type: "number" },
    ];

    const table = mountTable({ columns: headers, rows });
    const api = table.getAPI();

    await api.applyFilter({
      accessor: "stats.score",
      operator: "greaterThan",
      value: 40,
    });
    await waitFor(() => visibleProductNamesInOrder().length === 2);
    expect(visibleProductNamesInOrder()).toEqual(["Widget B", "Widget C"]);

    // Nested write on Widget B should drop it from the filter.
    api.updateData({ accessor: "stats.score", rowIndex: 1, newValue: 5 });
    await flushMicrotasks();
    await waitFor(() => visibleProductNamesInOrder().length === 1);
    expect(visibleProductNamesInOrder()).toEqual(["Widget C"]);
    expect((rows[1].stats as { score: number }).score).toBe(5);
    // Must not leave a spurious flat key on the row.
    expect(Object.prototype.hasOwnProperty.call(rows[1], "stats.score")).toBe(false);
  });

  it("still updates cell content when no filter or sort is active", async () => {
    const rows = [
      { id: 1, product: "Widget A", price: 19.99 },
      { id: 2, product: "Widget B", price: 24.99 },
    ];
    const headers: ColumnDef[] = [
      { accessor: "product", label: "Product", width: 180, type: "string" },
      {
        accessor: "price",
        label: "Price",
        width: 120,
        type: "number",
        valueFormatter: ({ value }) =>
          typeof value === "number" ? `$${value.toFixed(2)}` : "$0.00",
      },
    ];

    const table = mountTable({ columns: headers, rows });
    const api = table.getAPI();

    await waitFor(() => container!.querySelector('[data-accessor="price"]') != null);

    api.updateData({ accessor: "price", rowIndex: 0, newValue: 99.99 });
    await flushMicrotasks();
    await waitFor(() => {
      const cell = container!.querySelector(
        '[data-row-index="0"][data-accessor="price"] .st-cell-content',
      );
      return cell?.textContent === "$99.99";
    });
    expect(visibleProductNamesInOrder()).toEqual(["Widget A", "Widget B"]);
  });
});
