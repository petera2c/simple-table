import { createContext, createElement, useContext } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SimpleTable } from "../index";
import type {
  CellRendererProps,
  FooterRendererProps,
  HeaderRendererProps,
  ReactColumnDef,
} from "../index";

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

// The v3 fix renders every custom renderer through a portal that lives inside the
// host <SimpleTable> tree, so consumer components see the host's React context.
// Each test wraps the table in a provider and asserts the rendered slot shows the
// provider value rather than the context default (the symptom of the old bug).
describe("SimpleTable (React adapter) — host context reaches every renderer type", () => {
  it("lets a custom headerRenderer read context from a host provider", async () => {
    const Ctx = createContext("DEFAULT_NO_PROVIDER");

    function ScoreHeader({ header }: HeaderRendererProps) {
      const label = useContext(Ctx);
      return createElement("span", { className: "ctx-head" }, header.label, ":", label);
    }

    const headers: ReactColumnDef[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
      { accessor: "score", label: "Score", width: 120, type: "number", headerRenderer: ScoreHeader },
    ];

    const host = mount(
      createElement(
        Ctx.Provider,
        { value: "FROM_HOST" },
        createElement(SimpleTable, { columns: headers, rows, getRowId, height: "250px", theme: "light" }),
      ),
    );

    await waitFor(() => host.querySelector(".ctx-head") !== null);

    expect(host.querySelector(".ctx-head")?.textContent).toContain("FROM_HOST");
    expect(host.textContent).not.toContain("DEFAULT_NO_PROVIDER");
  });

  it("lets a custom footerRenderer read context from a host provider", async () => {
    const Ctx = createContext("DEFAULT_NO_PROVIDER");

    function Footer(_props: FooterRendererProps) {
      const label = useContext(Ctx);
      return createElement("span", { className: "ctx-footer" }, label);
    }

    const headers: ReactColumnDef[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
    ];

    const host = mount(
      createElement(
        Ctx.Provider,
        { value: "FROM_HOST" },
        createElement(SimpleTable, {
          columns: headers,
          rows,
          getRowId,
          height: "250px",
          theme: "light",
          // Paginate so core renders the footer (and thus invokes footerRenderer).
          enablePagination: true,
          rowsPerPage: 1,
          footerRenderer: Footer,
        }),
      ),
    );

    await waitFor(() => host.querySelector(".ctx-footer") !== null);

    expect(host.querySelector(".ctx-footer")?.textContent).toBe("FROM_HOST");
    expect(host.textContent).not.toContain("DEFAULT_NO_PROVIDER");
  });

  it("renders a provider-dependent cell that would throw outside its provider (the reported bug)", async () => {
    // Mirrors the reported `useGlobalAlert must be used within GlobalAlertProvider`
    // failure: the consumer throws unless the context is supplied by the host. With
    // the portal bridge the provider value flows through, so it renders normally.
    const Ctx = createContext<string | null>(null);

    function useRequiredCtx(): string {
      const value = useContext(Ctx);
      if (value === null) throw new Error("must be used within Provider");
      return value;
    }

    function GuardedCell(_props: CellRendererProps) {
      const value = useRequiredCtx();
      return createElement("span", { className: "ctx-guard" }, value);
    }

    const headers: ReactColumnDef[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
      { accessor: "score", label: "Score", width: 120, type: "number", cellRenderer: GuardedCell },
    ];

    const host = mount(
      createElement(
        Ctx.Provider,
        { value: "PROVIDED" },
        createElement(SimpleTable, { columns: headers, rows, getRowId, height: "250px", theme: "light" }),
      ),
    );

    await waitFor(() => host.querySelectorAll(".ctx-guard").length > 0);

    const cells = Array.from(host.querySelectorAll(".ctx-guard"));
    expect(cells.length).toBeGreaterThan(0);
    expect(cells.every((c) => c.textContent === "PROVIDED")).toBe(true);
  });
});
