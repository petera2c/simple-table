import { createContext, createElement, useContext } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { CellRendererProps, HeaderRendererProps, ReactColumnDef } from "../index";

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

describe("SimpleTable (React adapter) — host context + DOM slot bridging", () => {
  it("lets a custom cellRenderer read context from a host provider", async () => {
    const ThemeLabelContext = createContext("DEFAULT_NO_PROVIDER");

    function ThemeCell(_props: CellRendererProps) {
      const label = useContext(ThemeLabelContext);
      return createElement("span", { className: "ctx-cell" }, label);
    }

    const headers: ReactColumnDef[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
      { accessor: "score", label: "Score", width: 120, type: "number", cellRenderer: ThemeCell },
    ];

    const host = mount(
      createElement(
        ThemeLabelContext.Provider,
        { value: "FROM_HOST" },
        createElement(SimpleTable, {
          columns: headers,
          rows,
          getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
          height: "250px",
          theme: "light",
        }),
      ),
    );

    await waitFor(() => host.querySelectorAll(".ctx-cell").length > 0);

    const cells = Array.from(host.querySelectorAll(".ctx-cell"));
    expect(cells.length).toBeGreaterThan(0);
    // The custom cell inherits the host provider's value (the bug rendered the default).
    expect(cells.every((c) => c.textContent === "FROM_HOST")).toBe(true);
    expect(host.textContent).not.toContain("DEFAULT_NO_PROVIDER");
  });

  it("renders header `components.sortIcon` passed by core as a DOM node through JSX", async () => {
    function ScoreHeader({ header, components }: HeaderRendererProps) {
      return createElement(
        "span",
        { className: "custom-head" },
        header.label,
        components?.sortIcon,
      );
    }

    const headers: ReactColumnDef[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
      {
        accessor: "score",
        label: "Score",
        width: 120,
        type: "number",
        sortable: true,
        headerRenderer: ScoreHeader,
      },
    ];

    const host = mount(
      createElement(SimpleTable, {
        columns: headers,
        rows,
        getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
        height: "250px",
        theme: "light",
        // Active sort on `score` so core supplies a sortIcon to the renderer.
        initialSortColumn: "score",
        initialSortDirection: "asc",
      }),
    );

    await waitFor(() => host.querySelector(".custom-head") !== null);
    // The sort icon (a DOM node) is bridged into the React header and appended.
    await waitFor(() => host.querySelector(".custom-head .st-icon-container") !== null);

    expect(host.querySelector(".custom-head .st-icon-container")).not.toBeNull();
  });
});
