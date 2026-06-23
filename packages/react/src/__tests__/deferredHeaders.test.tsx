import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactHeaderObject } from "../index";

// Repro for the "deferred headers" anti-pattern: `defaultHeaders` mounts as an
// empty array and is populated after mount (e.g. from a useEffect / async
// fetch). The body renders, but the header band must also appear once the
// columns arrive. Regression guard for the DimensionManager not recomputing
// header depth/height when `update({ defaultHeaders })` swaps empty -> non-empty.

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

const rows = [
  { id: 1, name: "Alpha" },
  { id: 2, name: "Beta" },
];

function render(host: HTMLDivElement, defaultHeaders: ReactHeaderObject[]): void {
  root!.render(
    createElement(SimpleTable, {
      defaultHeaders,
      rows,
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "light",
    }),
  );
}

describe("SimpleTable (React adapter) — deferred headers", () => {
  it("renders the header row when defaultHeaders is populated after mount", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    container = host;
    root = createRoot(host);

    // Mount with an empty header set, like a parent that hasn't resolved its
    // columns yet.
    render(host, []);
    await wait(50);

    // Then populate the columns (new array reference), mimicking a post-mount
    // useEffect / async assignment.
    render(host, headers);

    // The header band must become visible: at least one header cell, with a
    // non-zero header container height.
    await waitFor(() => host.querySelectorAll(".st-header-cell").length > 0);

    const headerContainer = host.querySelector(".st-header-container") as HTMLElement | null;
    expect(headerContainer).not.toBeNull();

    const headerHeight = parseFloat(headerContainer!.style.height || "0");
    expect(headerHeight).toBeGreaterThan(0);

    expect(host.textContent).toContain("Name");
  });
});
