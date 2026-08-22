import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SimpleTable, useTdgpTable } from "../index";
import type { ReactColumnDef } from "../index";
import type { TdgpQueryClient, TdgpQueryRequest } from "simple-table-core";

// Next/prev and expand go through the footer and chevron, the same path as the
// live TDGP demo — not by calling source methods directly.

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

async function waitFor(predicate: () => boolean, timeoutMs = 4000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

const columns: ReactColumnDef[] = [
  { accessor: "country", label: "Country", width: 160, type: "string", expandable: true },
  { accessor: "stack", label: "Stack", width: 140, type: "string" },
  { accessor: "firstName", label: "First name", width: 120, type: "string" },
];

function requestOf(query: ReturnType<typeof vi.fn>, index = -1): TdgpQueryRequest {
  const calls = query.mock.calls as unknown as Array<[string, TdgpQueryRequest?]>;
  const call = index < 0 ? calls.at(index) : calls[index];
  return call?.[1] ?? {};
}

function nextButton(host: HTMLElement): HTMLButtonElement | null {
  return host.querySelector('button[aria-label="Go to next page"]');
}

function prevButton(host: HTMLElement): HTMLButtonElement | null {
  return host.querySelector('button[aria-label="Go to previous page"]');
}

function findExpandIcon(host: HTMLElement, accessor: string, value: string): HTMLElement | null {
  const match = Array.from(host.querySelectorAll<HTMLElement>(`.st-cell[data-accessor="${accessor}"]`)).find(
    (cell) => cell.textContent?.includes(value),
  );
  if (!match) return null;
  const rowIndex = match.getAttribute("data-row-index");
  if (rowIndex == null) return null;
  const icon = host.querySelector(
    `.st-cell[data-row-index="${rowIndex}"] .st-expand-icon-container:not(.placeholder)`,
  );
  return icon instanceof HTMLElement ? icon : null;
}

function TdgpHarness({
  client,
  pageSize,
  groupBy,
}: {
  client: TdgpQueryClient;
  pageSize: number;
  groupBy?: string[];
}) {
  const { rows, tableProps } = useTdgpTable({
    client,
    dataset: "developers-10k",
    columns,
    pageSize,
    groupBy,
  });
  return createElement(SimpleTable, {
    columns,
    rows,
    height: "320px",
    theme: "light",
    ...tableProps,
  });
}

function mountTdgp(props: { client: TdgpQueryClient; pageSize: number; groupBy?: string[] }): HTMLDivElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  container = host;
  root = createRoot(host);
  root.render(createElement(TdgpHarness, props));
  return host;
}

describe("useTdgpTable + SimpleTable", () => {
  it("enables next when the server has more than one page, and loads page 2 from the footer", async () => {
    const query = vi.fn(async (_dataset: string, request?: TdgpQueryRequest) => {
      if ((request?.start ?? 0) === 0) {
        return {
          protocol: "tdgp/1",
          data: [{ id: 1, country: "France", firstName: "Ada" }],
          totalCount: 10,
        };
      }
      return {
        protocol: "tdgp/1",
        data: [{ id: 2, country: "Spain", firstName: "Linus" }],
        totalCount: 10,
      };
    });

    const host = mountTdgp({ client: { query } as TdgpQueryClient, pageSize: 5 });
    await waitFor(() => host.textContent?.includes("Ada") === true);

    const next = nextButton(host);
    expect(next, "next should be enabled when 10 rows / 5 per page").not.toBeNull();
    expect(next!.disabled).toBe(false);
    expect(prevButton(host)?.disabled).toBe(true);

    next!.click();
    await waitFor(() => host.textContent?.includes("Linus") === true);

    expect(host.textContent).not.toContain("Ada");
    expect(requestOf(query).start).toBe(5);
    expect(prevButton(host)?.disabled).toBe(false);
  });

  it("disables next when the server count fits on one page", async () => {
    const query = vi.fn(async () => ({
      protocol: "tdgp/1",
      data: Array.from({ length: 10 }, (_, i) => ({
        id: i,
        country: `Country ${i}`,
        firstName: `Name ${i}`,
      })),
      totalCount: 10,
    }));

    const host = mountTdgp({ client: { query } as TdgpQueryClient, pageSize: 25 });
    await waitFor(() => host.textContent?.includes("Country 0") === true);

    expect(nextButton(host)?.disabled).toBe(true);
    expect(prevButton(host)?.disabled).toBe(true);
  });

  it("replaces the current page with skeletons while the next page is in flight", async () => {
    let resolvePageTwo: ((value: {
      protocol: string;
      data: Array<{ id: number; country: string; firstName: string }>;
      totalCount: number;
    }) => void) | undefined;

    const query = vi.fn(async (_dataset: string, request?: TdgpQueryRequest) => {
      if ((request?.start ?? 0) === 0) {
        return {
          protocol: "tdgp/1",
          data: [{ id: 1, country: "France", firstName: "Ada" }],
          totalCount: 10,
        };
      }
      return new Promise<NonNullable<Parameters<NonNullable<typeof resolvePageTwo>>[0]>>((resolve) => {
        resolvePageTwo = resolve;
      });
    });

    const host = mountTdgp({ client: { query } as TdgpQueryClient, pageSize: 5 });
    await waitFor(() => host.textContent?.includes("Ada") === true);

    nextButton(host)!.click();
    await waitFor(
      () =>
        host.querySelectorAll(".st-loading-skeleton").length > 0 && host.textContent?.includes("Ada") !== true,
    );

    resolvePageTwo?.({
      protocol: "tdgp/1",
      data: [{ id: 2, country: "Spain", firstName: "Linus" }],
      totalCount: 10,
    });
    await waitFor(() => host.textContent?.includes("Linus") === true);
    expect(host.querySelectorAll(".st-loading-skeleton").length).toBe(0);
  });

  it("starts groups collapsed and loads children from the first chevron click", async () => {
    const query = vi.fn(async (_dataset: string, request?: TdgpQueryRequest) => {
      const keys = request?.groupKeys ?? [];
      if (keys.length === 0) {
        return {
          protocol: "tdgp/1",
          data: [{ keys: ["France"], data: { country: "France" } }],
          totalCount: 10,
        };
      }
      if (keys.length === 1) {
        return {
          protocol: "tdgp/1",
          data: [{ keys: ["France", "backend"], data: { country: "France", stack: "backend" } }],
          totalCount: 3,
        };
      }
      return {
        protocol: "tdgp/1",
        data: [{ id: 11, country: "France", stack: "backend", firstName: "Ada" }],
        totalCount: 1,
      };
    });

    const host = mountTdgp({
      client: { query } as TdgpQueryClient,
      pageSize: 5,
      groupBy: ["country", "stack"],
    });
    await waitFor(() => host.textContent?.includes("France") === true);

    expect(host.textContent).not.toContain("backend");
    expect(host.textContent).not.toContain("Ada");

    const countryChevron = findExpandIcon(host, "country", "France");
    expect(countryChevron, "expand arrow on the country row").not.toBeNull();
    expect(countryChevron!.getAttribute("aria-expanded")).toBe("false");

    countryChevron!.click();
    await waitFor(() => host.textContent?.includes("backend") === true);

    expect(query.mock.calls.some((call) => (call[1] as TdgpQueryRequest | undefined)?.groupKeys?.[0] === "France")).toBe(
      true,
    );
    expect(host.querySelectorAll('.st-cell[data-row-id*="loading-skeleton"]').length).toBe(0);

    const stackChevron = findExpandIcon(host, "stack", "backend");
    expect(stackChevron, "expand arrow on the stack row").not.toBeNull();
    stackChevron!.click();
    await waitFor(() => host.textContent?.includes("Ada") === true);
    expect(host.querySelectorAll('.st-cell[data-row-id*="loading-skeleton"]').length).toBe(0);
  });
});
