import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SimpleTable } from "../index";
import type { FooterRendererProps, ReactHeaderObject } from "../index";

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

const headers: ReactHeaderObject[] = [
  { accessor: "name", label: "Name", width: 120, type: "string" },
  { accessor: "score", label: "Score", width: 120, type: "number" },
];

// With serverSidePagination, the consumer fetches each page's data in
// `onPageChange`. The built-in footer wires that callback (via
// `onUserPageChange`), but a custom `footerRenderer` only receives the internal
// pagination handlers. Those handlers must still invoke `config.onPageChange`
// so server-side consumers can fetch the next page — otherwise the highlighted
// page updates but no new data is ever requested.
describe("SimpleTable (React adapter) — serverSidePagination + custom footerRenderer", () => {
  it("invokes the consumer onPageChange when a custom footer changes page", async () => {
    const onPageChange = vi.fn();

    function Footer({ currentPage, onPageChange: changePage }: FooterRendererProps) {
      return createElement(
        "button",
        {
          className: "ssp-next",
          onClick: () => changePage(currentPage + 1),
        },
        "Next",
      );
    }

    const host = mount(
      createElement(SimpleTable, {
        defaultHeaders: headers,
        rows,
        getRowId,
        height: "250px",
        theme: "light",
        shouldPaginate: true,
        serverSidePagination: true,
        rowsPerPage: 1,
        // Drives totalPages so the footer reports more than one page.
        totalRowCount: 3,
        onPageChange,
        footerRenderer: Footer,
      }),
    );

    await waitFor(() => host.querySelector<HTMLButtonElement>(".ssp-next") !== null);

    const nextButton = host.querySelector<HTMLButtonElement>(".ssp-next");
    nextButton!.click();

    await waitFor(() => onPageChange.mock.calls.length > 0);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("invokes the consumer onPageChange when a custom footer hits next page", async () => {
    const onPageChange = vi.fn();

    function Footer({ onNextPage }: FooterRendererProps) {
      return createElement(
        "button",
        {
          className: "ssp-next-page",
          onClick: () => {
            void onNextPage();
          },
        },
        "Next page",
      );
    }

    const host = mount(
      createElement(SimpleTable, {
        defaultHeaders: headers,
        rows,
        getRowId,
        height: "250px",
        theme: "light",
        shouldPaginate: true,
        serverSidePagination: true,
        rowsPerPage: 1,
        totalRowCount: 3,
        onPageChange,
        footerRenderer: Footer,
      }),
    );

    await waitFor(() => host.querySelector<HTMLButtonElement>(".ssp-next-page") !== null);

    const nextButton = host.querySelector<HTMLButtonElement>(".ssp-next-page");
    nextButton!.click();

    await waitFor(() => onPageChange.mock.calls.length > 0);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
