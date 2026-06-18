import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SimpleTable } from "../index";
import type { CellRendererProps, ReactHeaderObject } from "../index";

const rows = [
  { id: 1, name: "Alice", score: 10 },
  { id: 2, name: "Bob", score: 20 },
];

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
  vi.restoreAllMocks();
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

function mount(node: React.ReactElement): HTMLDivElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  container = host;
  root = createRoot(host);
  root.render(node);
  return host;
}

const getRowId = (p: { row: unknown }) => String((p.row as { id?: number })?.id);

// Each portalled renderer is wrapped in PortalErrorBoundary. Because the portal is
// part of the host tree, an uncaught throw would otherwise unmount <SimpleTable>.
// The boundary renders nothing for the failing slot and logs, leaving the rest of
// the table intact.
describe("SimpleTable (React adapter) — custom renderer error isolation", () => {
  it("isolates a throwing cellRenderer so the rest of the table still renders", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    function BoomCell(_props: CellRendererProps): React.ReactElement {
      throw new Error("cell renderer blew up");
    }

    function OkCell(_props: CellRendererProps) {
      return createElement("span", { className: "ok-cell" }, "OK");
    }

    const headers: ReactHeaderObject[] = [
      { accessor: "name", label: "Name", width: 120, type: "string", cellRenderer: BoomCell },
      { accessor: "score", label: "Score", width: 120, type: "number", cellRenderer: OkCell },
    ];

    const host = mount(
      createElement(SimpleTable, { defaultHeaders: headers, rows, getRowId, height: "250px", theme: "light" }),
    );

    // Sibling cells (and the table chrome) still render despite the throw.
    await waitFor(() => host.querySelectorAll(".ok-cell").length > 0);

    expect(host.querySelectorAll(".ok-cell").length).toBeGreaterThan(0);
    // The failing slot rendered nothing rather than crashing the whole table.
    expect(host.querySelector(".st-body-container")).not.toBeNull();
    // The boundary logged the error with the library prefix.
    await waitFor(() =>
      consoleError.mock.calls.some((args) =>
        args.some((a) => typeof a === "string" && a.includes("[simple-table]")),
      ),
    );
  });
});
