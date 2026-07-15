import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactHeaderObject } from "../index";

// Repro for the "stale rowId cell" bug.
//
// Body cells are reused by the DOM id `${rowId}-${accessor}`. When loading
// finishes, placeholder skeleton cells (keyed by synthetic stable ids) must be
// removed so they do not linger underneath the newly keyed data cells.
//
// Empty + isLoading synthesizes placeholder rows with unique identity keys
// (getRowId is skipped for that batch). After data loads, none of those
// loading-phase cell ids should remain in the DOM.

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

const headers: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 160, type: "string" },
];

interface RowData {
  id: number | undefined;
  name: string;
}

function render(rows: RowData[], isLoading: boolean): void {
  root!.render(
    createElement(SimpleTable, {
      defaultHeaders: headers,
      rows,
      isLoading,
      getRowId: (p) => String(p.row.id),
      height: "400px",
      theme: "light",
    }),
  );
}

describe("SimpleTable (React adapter) — stale rowId cells", () => {
  it("removes skeleton cells whose rowId is no longer present after data loads", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    container = host;
    root = createRoot(host);

    // Loading phase: no data yet, so the table renders loading skeleton rows.
    render([], true);

    await waitFor(() => host.querySelectorAll(".st-body-container .st-cell").length > 0);

    const loadingCells = host.querySelectorAll(".st-body-container .st-cell");
    const loadingCellIds = Array.from(loadingCells).map((el) => el.id);
    const skeletons = host.querySelectorAll(".st-body-container .st-loading-skeleton");

    expect(skeletons.length).toBeGreaterThan(0);
    expect(loadingCellIds.length).toBeGreaterThan(0);
    expect(loadingCellIds.every((id) => id.length > 0)).toBe(true);

    // Data resolves: each row now has a real, unique id.
    const loadedRows: RowData[] = [
      { id: 1, name: "Alpha" },
      { id: 2, name: "Beta" },
      { id: 3, name: "Gamma" },
    ];
    render(loadedRows, false);

    await waitFor(() => host.textContent?.includes("Alpha") ?? false);
    await wait(80);

    // Loading-phase cell ids must be gone — otherwise they remain stacked
    // underneath the new data cells at the same position.
    const remainingIds = new Set(
      Array.from(host.querySelectorAll(".st-body-container .st-cell")).map((el) => el.id),
    );
    for (const id of loadingCellIds) {
      expect(remainingIds.has(id)).toBe(false);
    }
    expect(host.querySelectorAll(".st-loading-skeleton").length).toBe(0);

    // And the body should hold exactly one set of cells per loaded row (3 rows
    // × 2 columns = 6), with no leftover orphans from the loading phase.
    const bodyCells = host.querySelectorAll(".st-body-container .st-cell");
    expect(bodyCells.length).toBe(loadedRows.length * headers.length);
  });
});
