import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactHeaderObject } from "../index";

// Repro for the stale-cell bug. Body cells are reused by the id
// `${rowId}-${accessor}`. When `getRowId` derives the id from the row data, a
// row that is still loading has no id yet, so `getRowId` returns `undefined`
// (stringified to "undefined"). While `isLoading` is true the core renders a
// batch of skeleton rows — and every one of them resolves to the SAME cell id
// (`undefined-<accessor>`).
//
// Because the rendered-cell registry is keyed by that id, many skeleton DOM
// cells share a single id and only the last one is tracked; the rest are
// orphaned. Once the data resolves and `getRowId` returns a real id, the
// registry-driven cleanup removes only the tracked cell, leaving the orphaned
// skeleton cells in the DOM underneath the real data cell indefinitely.
//
// The fix should ensure cells whose ids are no longer present in the current
// row set are removed, so a single resolved row leaves exactly one cell per
// column behind and no leftover skeletons.

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForElement(
  scope: HTMLElement,
  selector: string,
  timeoutMs = 3000,
): Promise<HTMLElement> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const el = scope.querySelector<HTMLElement>(selector);
    if (el) return el;
    await wait(20);
  }
  throw new Error(`Timed out waiting for element: ${selector}`);
}

const headers: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 160, type: "string" },
];

function render(
  host: HTMLDivElement,
  rows: Array<Record<string, unknown>>,
  isLoading: boolean,
): void {
  root!.render(
    createElement(SimpleTable, {
      defaultHeaders: headers,
      rows,
      isLoading,
      // The id comes from the row data, so it is `undefined` (→ "undefined")
      // while the row is loading and a real value once the row resolves.
      getRowId: (p) => String((p.row as { id?: unknown })?.id),
      height: "250px",
      theme: "light",
    }),
  );
}

describe("SimpleTable (React adapter) — getRowId value change while loading", () => {
  it("renders a skeleton cell per placeholder row when getRowId would collide", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    container = host;
    root = createRoot(host);

    // Empty + loading synthesizes ~10 `{}` placeholders. A typical getRowId
    // (`row.id`) returns "undefined" for each; without unique stable keys,
    // cell dedupe would only paint the first skeleton row.
    render(host, [], true);
    await waitForElement(host, ".st-body-container .st-cell");
    await wait(60);

    const nameCells = host.querySelectorAll('.st-body-container .st-cell[data-accessor="name"]');
    const idCells = host.querySelectorAll('.st-body-container .st-cell[data-accessor="id"]');
    const skeletons = host.querySelectorAll(".st-body-container .st-loading-skeleton");
    const nameRowIds = Array.from(nameCells).map((el) => el.getAttribute("data-row-id"));

    // Default placeholder count is 10 (11 when the main section is scrollable).
    expect(nameCells.length).toBeGreaterThanOrEqual(10);
    expect(idCells.length).toBe(nameCells.length);
    expect(skeletons.length).toBe(nameCells.length + idCells.length);
    expect(new Set(nameRowIds).size).toBe(nameCells.length);
    nameCells.forEach((cell) => {
      expect(cell.querySelector(".st-loading-skeleton")).not.toBeNull();
    });
  });

  it("removes stale skeleton cells when getRowId resolves from undefined to a real id", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    container = host;
    root = createRoot(host);

    // Loading: no rows yet. The core renders skeleton rows, all of which share
    // the cell id `undefined-<accessor>` because getRowId returns "undefined".
    render(host, [], true);
    await waitForElement(host, ".st-body-container .st-cell");
    await wait(60);

    // Data resolves: a single row with a real id.
    render(host, [{ id: "u1", name: "Alice" }], false);
    await wait(120);

    // Exactly one row resolved, so the body should hold exactly one cell per
    // column and no leftover loading skeletons.
    const nameCells = host.querySelectorAll('.st-body-container .st-cell[data-accessor="name"]');
    const idCells = host.querySelectorAll('.st-body-container .st-cell[data-accessor="id"]');
    const skeletons = host.querySelectorAll(".st-loading-skeleton");

    expect(skeletons.length).toBe(0);
    expect(nameCells.length).toBe(1);
    expect(idCells.length).toBe(1);
  });
});
