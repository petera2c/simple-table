import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactColumnDef } from "../index";

// Repro for "maxHeight + serverSidePagination doesn't create an inner scrollbar
// when the table mounts with an empty rows array".
//
// A serverSidePagination table normally mounts with `rows=[]` while the first
// page is still loading, plus a `totalRowCount` describing the full data set.
// With `maxHeight` set, the root must become height-bounded once the loaded
// page overflows the cap so the body (and pagination footer) can scroll.
//
// The bug: the DimensionManager — which owns `contentHeight`, the value that
// gates the root between a fixed height and `height: auto` — is initialized from
// the *local* row count (0 at mount) and is never updated when `rows` arrive.
// So after the first page loads and the rows exceed `maxHeight`, the root stays
// at `height: auto`, the body grows past the cap, and the `overflow: hidden`
// wrapper clips both the rows and the footer instead of scrolling.

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

const headers: ReactColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 160, type: "string" },
];

// One page worth of rows. With headerHeight (32) + 10 * rowHeight (32) +
// footerHeight (40) = 392px, a page of 10 rows comfortably overflows the 300px
// cap, so the root must be bounded for the body to scroll.
const pageRows = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}` }));

describe("SimpleTable (React adapter) — maxHeight + serverSidePagination empty initial rows", () => {
  it("bounds the root height once the first page loads, even when mounted with empty rows", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    container = host;
    root = createRoot(host);

    const renderWith = (rows: Array<{ id: number; name: string }>) =>
      root!.render(
        createElement(SimpleTable, {
          columns: headers,
          rows,
          getRowId: (p) => String((p.row as { id: number }).id),
          maxHeight: "300px",
          theme: "light",
          enablePagination: true,
          serverSidePagination: true,
          rowsPerPage: 10,
          totalRowCount: 100,
        }),
      );

    // Mount with an empty rows array — the normal state while the first page is
    // still being fetched.
    renderWith([]);
    await waitFor(() => host.querySelector(".simple-table-root") !== null);

    // The first page arrives: rows now overflow the 300px cap.
    renderWith(pageRows);
    await waitFor(() => host.querySelectorAll(".st-body-container .st-cell").length > 0);

    const tableRoot = host.querySelector<HTMLElement>(".simple-table-root");
    expect(tableRoot).not.toBeNull();

    // The CSS cap is applied correctly...
    expect(tableRoot!.style.maxHeight).toBe("300px");

    // ...but the root must ALSO be height-bounded to create an inner scroll
    // region. With the bug, the DimensionManager still believes there are 0 rows
    // (its initial local count), decides the content fits, and leaves the root at
    // `height: auto` — so the body grows past the cap and gets clipped by
    // `overflow: hidden` with no inner scrollbar.
    expect(tableRoot!.style.height).not.toBe("auto");
    expect(tableRoot!.style.height).toBe("300px");
  });
});
