import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { CellRendererProps, ReactHeaderObject, SimpleTableReactProps } from "../index";

// NOTE: jsdom has no layout engine, so element widths are all 0 here. Width /
// flicker assertions for auto-sizing live in the browser-based core story
// (Tests/46 - Auto-Size Columns). This suite guards the React integration:
// an `width: "auto"` column that uses a React cellRenderer must mount and render
// its custom content through the post-mount re-fit pass without throwing.

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForText(scope: HTMLElement, text: string, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (scope.textContent?.includes(text)) return;
    await wait(20);
  }
  throw new Error(`Timed out waiting for text: ${text}`);
}

const StatusBadge = ({ value }: CellRendererProps) =>
  createElement("span", { className: "status-badge" }, `status:${String(value)}`);

const headers: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  {
    accessor: "status",
    label: "Status",
    width: "auto",
    type: "string",
    cellRenderer: StatusBadge,
  },
];

const rows = [
  { id: 1, status: "active" },
  { id: 2, status: "pending" },
];

function mountTable(props: Partial<SimpleTableReactProps> = {}): HTMLDivElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  container = host;

  root = createRoot(host);
  root.render(
    createElement(SimpleTable, {
      defaultHeaders: headers,
      rows,
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
      theme: "light",
      ...props,
    }),
  );
  return host;
}

describe("SimpleTable (React adapter) — auto-size columns", () => {
  it("renders a width:'auto' column that uses a React cellRenderer", async () => {
    const host = mountTable();

    // The custom React renderer output must appear (proves the auto column +
    // portal renderer + post-mount re-fit path all run without throwing).
    await waitForText(host, "status:active");
    expect(host.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("re-fits without error when row data changes", async () => {
    const host = mountTable();
    await waitForText(host, "status:active");

    // Re-render with new data; the adapter re-fits auto columns on the update.
    root!.render(
      createElement(SimpleTable, {
        defaultHeaders: headers,
        rows: [
          { id: 1, status: "archived" },
          { id: 2, status: "active" },
        ],
        getRowId: (p) => String((p.row as { id?: number })?.id),
        height: "250px",
        theme: "light",
      }),
    );

    await waitForText(host, "status:archived");
    expect(host.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });
});
