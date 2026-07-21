import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableVanilla, buildPivotAccessor } from "simple-table-core";
import type { HeaderObject, SimpleTableConfig } from "simple-table-core";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

let container: HTMLDivElement | null = null;
let instance: SimpleTableVanilla | null = null;

afterEach(() => {
  instance?.destroy();
  instance = null;
  container?.remove();
  container = null;
});

const headers: HeaderObject[] = [
  { accessor: "region", label: "Region", width: 120, type: "string" },
  { accessor: "quarter", label: "Quarter", width: 80, type: "string" },
  { accessor: "sales", label: "Sales", width: 100, type: "number" },
];

const rows = [
  { region: "West", quarter: "Q1", sales: 100 },
  { region: "West", quarter: "Q2", sales: 120 },
  { region: "East", quarter: "Q1", sales: 80 },
];

describe("setPivot regenerates columns", () => {
  it("swaps to pivot headers and back", async () => {
    container = document.createElement("div");
    document.body.appendChild(container);

    const config: SimpleTableConfig = {
      defaultHeaders: headers,
      rows,
      height: "300px",
      theme: "light",
    };

    instance = new SimpleTableVanilla(container, config);
    instance.mount();

    await waitFor(() => container!.querySelectorAll(".st-header-label-text").length >= 3);

    const api = instance.getAPI();
    api.setPivot({
      rows: ["region"],
      columns: ["quarter"],
      values: [{ accessor: "sales", aggregation: { type: "sum" } }],
      showColumnTotals: false,
      showRowTotals: false,
    });

    await waitFor(() => {
      const labels = Array.from(container!.querySelectorAll(".st-header-label-text")).map(
        (el) => el.textContent ?? ""
      );
      return labels.includes("Region") && labels.includes("Q1") && labels.includes("Q2");
    });

    const pivoted = api.getPivotedRows();
    expect(pivoted).toHaveLength(2);
    const west = pivoted.find((r) => r.region === "West")!;
    expect(west[buildPivotAccessor("Q1", "sales")]).toBe(100);

    expect(api.getPivot()).not.toBeNull();
    expect(api.getPivotHeaders().some((h) => h.label === "Q1" || h.children)).toBe(true);

    api.setPivot(null);
    await waitFor(() => {
      const labels = Array.from(container!.querySelectorAll(".st-header-label-text")).map(
        (el) => el.textContent ?? ""
      );
      return labels.includes("Quarter") && labels.includes("Sales");
    });
    expect(api.getPivot()).toBeNull();
  });
});
