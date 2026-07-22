import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { FooterRendererProps, HeaderRendererProps, ReactColumnDef } from "../index";

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

const getRowId = (p: { row: unknown }) => String((p.row as { id?: number })?.id);

// Core hands header/footer renderers their icon + label slots as *live DOM nodes*,
// which JSX silently drops. The adapter bridges them to React nodes (string markup
// via dangerouslySetInnerHTML, live nodes via ImperativeDomSlot) so consumers can
// place them directly in JSX. These tests assert the bridged node lands in the DOM.
describe("SimpleTable (React adapter) — DOM-node slots bridged into headerRenderer", () => {
  it("bridges `components.labelContent` (DOM node) into the custom header", async () => {
    function Head({ header, components }: HeaderRendererProps) {
      return createElement("span", { className: "custom-head" }, components?.labelContent ?? header.label);
    }

    const headers: ReactColumnDef[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
      { accessor: "score", label: "Score", width: 120, type: "number", headerRenderer: Head },
    ];

    const host = mount(
      createElement(SimpleTable, { columns: headers, rows, getRowId, height: "250px", theme: "light" }),
    );

    await waitFor(() => host.querySelector(".custom-head .st-header-label-text") !== null);
    expect(host.querySelector(".custom-head .st-header-label-text")?.textContent).toContain("Score");
  });

  it("bridges `components.filterIcon` (DOM node) into the custom header for a filterable column", async () => {
    function Head({ header, components }: HeaderRendererProps) {
      return createElement("span", { className: "custom-head" }, header.label, components?.filterIcon);
    }

    const headers: ReactColumnDef[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
      {
        accessor: "score",
        label: "Score",
        width: 120,
        type: "number",
        filterable: true,
        headerRenderer: Head,
      },
    ];

    const host = mount(
      createElement(SimpleTable, { columns: headers, rows, getRowId, height: "250px", theme: "light" }),
    );

    await waitFor(() => host.querySelector(".custom-head") !== null);
    await waitFor(() => host.querySelector(".custom-head .st-icon-container") !== null);
    expect(host.querySelector(".custom-head .st-icon-container")).not.toBeNull();
  });

  it("bridges `components.collapseIcon` (DOM node) into a collapsible group header", async () => {
    function GroupHead({ header, components }: HeaderRendererProps) {
      return createElement("span", { className: "custom-head" }, header.label, components?.collapseIcon);
    }

    const headers: ReactColumnDef[] = [
      {
        accessor: "group",
        label: "Group",
        width: 240,
        type: "string",
        collapsible: true,
        headerRenderer: GroupHead,
        children: [
          { accessor: "name", label: "Name", width: 120, type: "string" },
          { accessor: "score", label: "Score", width: 120, type: "number" },
        ],
      },
    ];

    const host = mount(
      createElement(SimpleTable, { columns: headers, rows, getRowId, height: "250px", theme: "light" }),
    );

    await waitFor(() => host.querySelector(".custom-head") !== null);
    await waitFor(() => host.querySelector(".custom-head .st-collapsible-header-icon") !== null);
    expect(host.querySelector(".custom-head .st-collapsible-header-icon")).not.toBeNull();
  });
});

describe("SimpleTable (React adapter) — DOM-node slots bridged into footerRenderer", () => {
  it("bridges `nextIcon` / `prevIcon` (DOM nodes) into the custom footer", async () => {
    function Footer({ nextIcon, prevIcon }: FooterRendererProps) {
      return createElement(
        "div",
        { className: "custom-footer" },
        createElement("span", { className: "prev-slot" }, prevIcon),
        createElement("span", { className: "next-slot" }, nextIcon),
      );
    }

    const headers: ReactColumnDef[] = [
      { accessor: "name", label: "Name", width: 120, type: "string" },
    ];

    const host = mount(
      createElement(SimpleTable, {
        columns: headers,
        rows,
        getRowId,
        height: "250px",
        theme: "light",
        enablePagination: true,
        rowsPerPage: 1,
        footerRenderer: Footer,
      }),
    );

    await waitFor(() => host.querySelector(".custom-footer") !== null);
    await waitFor(() => host.querySelector(".custom-footer .next-slot .st-next-prev-icon") !== null);

    expect(host.querySelector(".custom-footer .prev-slot .st-next-prev-icon")).not.toBeNull();
    expect(host.querySelector(".custom-footer .next-slot .st-next-prev-icon")).not.toBeNull();
  });
});
