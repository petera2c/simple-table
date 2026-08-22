import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactColumnDef } from "../index";

// Server-side pagination: `rows` is the current page. While `isLoading` is
// true, the body shows a skeleton page instead of the old page plus skeletons
// underneath (that append path is for load-more / infinite scroll).

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

const headers: ReactColumnDef[] = [
  { accessor: "name", label: "Name", width: 160, type: "string" },
  { accessor: "age", label: "Age", width: 80, type: "number" },
];

const pageOne = [
  { id: "r1", name: "Alice", age: 30 },
  { id: "r2", name: "Bob", age: 40 },
];

describe("SimpleTable (React adapter) — server-side pagination loading", () => {
  it("replaces the current page with skeletons when isLoading is true", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    container = host;
    root = createRoot(host);

    const renderWith = (isLoading: boolean) =>
      root!.render(
        createElement(SimpleTable, {
          columns: headers,
          rows: pageOne,
          isLoading,
          enablePagination: true,
          serverSidePagination: true,
          rowsPerPage: 2,
          totalRowCount: 10,
          getRowId: (p) => String((p.row as { id?: unknown })?.id),
          height: "250px",
          theme: "light",
        }),
      );

    renderWith(false);
    await waitForElement(host, ".st-body-container .st-cell");
    await wait(80);
    expect(host.textContent).toContain("Alice");
    expect(host.textContent).toContain("Bob");

    renderWith(true);
    await wait(150);

    expect(host.textContent).not.toContain("Alice");
    expect(host.textContent).not.toContain("Bob");
    expect(host.querySelectorAll(".st-loading-skeleton").length).toBeGreaterThan(0);
  });
});
