import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactHeaderObject } from "../index";

// Repro for the "stale rowId cell" bug.
//
// Body cells are reused by the DOM id `${rowId}-${accessor}`, where `rowId`
// comes from `getRowId`. The classic trigger is `getRowId` returning
// "undefined" while data is loading (the row's real id hasn't arrived yet) and
// the real id after it resolves.
//
// While loading, every skeleton/placeholder row resolves to the SAME id
// ("undefined"), so all of their cells share the same DOM id. Cells are tracked
// in a Map keyed by that id, so only the last cell per id is tracked — the rest
// become untracked DOM orphans. When the data resolves and `getRowId` starts
// returning real, unique ids, the removal pass only sees the tracked cells and
// the orphaned "undefined"-keyed skeleton cells linger in the DOM, stacked
// underneath the freshly-keyed data cells.
//
// Cells whose ids are no longer present in the current row set should be
// removed. This test fails until they are.

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
      // The classic trigger: id is undefined while loading, real once resolved.
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
    // getRowId returns "undefined" for every one of them.
    render([], true);

    await waitFor(() => host.querySelectorAll(".st-body-container .st-cell").length > 0);

    // Sanity: the skeleton cells are keyed under the "undefined" rowId
    // (DOM id is `${rowId}-${accessor}`).
    const skeletonCells = host.querySelectorAll('.st-body-container [id^="undefined-"]');
    expect(skeletonCells.length).toBeGreaterThan(0);

    // Data resolves: each row now has a real, unique id, so getRowId returns a
    // different value than the "undefined" used during loading.
    const loadedRows: RowData[] = [
      { id: 1, name: "Alpha" },
      { id: 2, name: "Beta" },
      { id: 3, name: "Gamma" },
    ];
    render(loadedRows, false);

    await waitFor(() => host.textContent?.includes("Alpha") ?? false);
    await wait(80);

    // The previous "undefined"-keyed skeleton cells must be gone — otherwise
    // they remain stacked underneath the new data cells at the same position.
    const stale = host.querySelectorAll('.st-body-container [id^="undefined-"]');
    expect(stale.length).toBe(0);

    // And the body should hold exactly one set of cells per loaded row (3 rows
    // × 2 columns = 6), with no leftover orphans from the loading phase.
    const bodyCells = host.querySelectorAll(".st-body-container .st-cell");
    expect(bodyCells.length).toBe(loadedRows.length * headers.length);
  });
});
