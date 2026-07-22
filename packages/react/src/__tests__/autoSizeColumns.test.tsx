import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type {
  CellRendererProps,
  HeaderRendererProps,
  ReactColumnDef,
  SimpleTableReactProps,
} from "../index";

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

const headers: ReactColumnDef[] = [
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
      columns: headers,
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
        columns: headers,
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

  it("mounts multiple auto columns alongside a React renderer", async () => {
    const multiHeaders: ReactColumnDef[] = [
      { accessor: "id", label: "ID", width: "auto", type: "number" },
      { accessor: "name", label: "Name", width: "auto", type: "string" },
      {
        accessor: "status",
        label: "Status",
        width: "auto",
        type: "string",
        cellRenderer: StatusBadge,
      },
    ];
    const multiRows = [
      { id: 1, name: "Alpha", status: "active" },
      { id: 2, name: "Beta", status: "pending" },
    ];

    const host = document.createElement("div");
    document.body.appendChild(host);
    container = host;
    root = createRoot(host);
    root.render(
      createElement(SimpleTable, {
        columns: multiHeaders,
        rows: multiRows,
        getRowId: (p) => String((p.row as { id?: number })?.id),
        height: "250px",
        theme: "light",
      }),
    );

    await waitForText(host, "status:active");
    expect(host.textContent).toContain("Alpha");
    expect(host.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("renders a width:'auto' column that uses a React headerRenderer", async () => {
    // Custom React header markup is measured generically (whole-label clone);
    // this guards that the measurement + post-mount re-fit path doesn't throw.
    const CustomHeader = ({ header }: HeaderRendererProps) =>
      createElement("span", { className: "custom-head" }, `head:${header.label}`);

    const customHeaders: ReactColumnDef[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "status",
        label: "Status",
        width: "auto",
        type: "string",
        headerRenderer: CustomHeader,
      },
    ];

    const host = document.createElement("div");
    document.body.appendChild(host);
    container = host;
    root = createRoot(host);
    root.render(
      createElement(SimpleTable, {
        columns: customHeaders,
        rows,
        getRowId: (p) => String((p.row as { id?: number })?.id),
        height: "250px",
        theme: "light",
      }),
    );

    await waitForText(host, "head:Status");
    expect(host.querySelectorAll(".custom-head").length).toBeGreaterThan(0);
  });

  it("mounts a 1k-row dataset with an auto column", async () => {
    const bigRows = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      status: i % 2 === 0 ? "active" : "pending",
    }));

    const host = document.createElement("div");
    document.body.appendChild(host);
    container = host;
    root = createRoot(host);
    root.render(
      createElement(SimpleTable, {
        columns: headers,
        rows: bigRows,
        getRowId: (p) => String((p.row as { id?: number })?.id),
        height: "250px",
        theme: "light",
      }),
    );

    await waitForText(host, "status:active");
    expect(host.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });

  it("is idempotent across repeated re-renders with identical props", async () => {
    const host = mountTable();
    await waitForText(host, "status:active");

    // Re-render twice with the same props; the post-mount re-fit must not throw
    // and the content must stay stable.
    for (let i = 0; i < 2; i++) {
      root!.render(
        createElement(SimpleTable, {
          columns: headers,
          rows,
          getRowId: (p) => String((p.row as { id?: number })?.id),
          height: "250px",
          theme: "light",
        }),
      );
      await wait(50);
    }

    await waitForText(host, "status:active");
    expect(host.querySelectorAll(".status-badge").length).toBeGreaterThan(0);
  });
});
