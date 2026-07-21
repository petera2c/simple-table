import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactHeaderObject } from "../index";

// With dynamic row grouping (rowGrouping + onRowGroupExpand):
//
//   - empty + isLoading → full skeleton page (every column, including expandable)
//   - rows + isLoading → real rows keep content; skeleton placeholders append below
//   - leaving a full-skeleton mount for real rows restores expand icon + value

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

const headers: ReactHeaderObject[] = [
  { accessor: "name", label: "Name", width: 160, type: "string", expandable: true },
  { accessor: "age", label: "Age", width: 80, type: "number" },
];

const data = [
  { id: "r1", name: "Alice", age: 30 },
  { id: "r2", name: "Bob", age: 40 },
];

function render(
  host: HTMLDivElement,
  rows: Array<Record<string, unknown>>,
  isLoading: boolean,
): void {
  root!.render(
    createElement(SimpleTable, {
      defaultHeaders: headers,
      rows,
      isLoading,
      rowGrouping: ["children"],
      onRowGroupExpand: () => {},
      getRowId: (p) => String((p.row as { id?: unknown })?.id),
      height: "250px",
      theme: "light",
    }),
  );
}

function mount(): HTMLDivElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  container = host;
  root = createRoot(host);
  return host;
}

const expectAllCellsShowSkeleton = (host: HTMLElement): void => {
  const nameCells = host.querySelectorAll<HTMLElement>('.st-cell[data-accessor="name"]');
  const ageCells = host.querySelectorAll<HTMLElement>('.st-cell[data-accessor="age"]');

  expect(nameCells.length).toBeGreaterThan(0);
  expect(ageCells.length).toBeGreaterThan(0);

  ageCells.forEach((cell) => {
    expect(cell.querySelector(".st-loading-skeleton"), "age cell should show skeleton").not.toBeNull();
  });
  nameCells.forEach((cell) => {
    expect(
      cell.querySelector(".st-loading-skeleton"),
      "expandable name cell should show skeleton",
    ).not.toBeNull();
  });
};

describe("SimpleTable (React adapter) — loading skeletons with dynamic row grouping", () => {
  it("keeps expandable rows and appends skeletons when isLoading flips to true on rendered rows", async () => {
    const host = mount();

    render(host, data, false);
    await waitForElement(host, ".st-body-container .st-cell");
    await wait(80);

    render(host, data, true);
    await wait(150);

    expect(host.textContent).toContain("Alice");
    expect(host.textContent).toContain("Bob");
    const alice = Array.from(
      host.querySelectorAll<HTMLElement>('.st-cell[data-accessor="name"]'),
    ).find((c) => c.textContent?.includes("Alice"));
    expect(alice?.querySelector(".st-expand-icon-container")).not.toBeNull();
    expect(alice?.querySelector(".st-loading-skeleton")).toBeNull();
    expect(host.querySelectorAll(".st-loading-skeleton").length).toBeGreaterThan(0);
  });

  it("restores the expandable column content (expand icon + value) when isLoading flips back to false", async () => {
    const host = mount();

    render(host, data, false);
    await waitForElement(host, ".st-body-container .st-cell");
    await wait(80);

    render(host, data, true);
    await wait(150);

    render(host, data, false);
    await wait(150);

    const nameCells = host.querySelectorAll<HTMLElement>('.st-cell[data-accessor="name"]');
    expect(nameCells.length).toBe(2);
    expect(host.querySelectorAll(".st-loading-skeleton").length).toBe(0);
    const texts = Array.from(nameCells).map((c) => c.textContent);
    expect(texts).toContain("Alice");
    expect(texts).toContain("Bob");
    nameCells.forEach((cell) => {
      expect(
        cell.querySelector(".st-expand-icon-container"),
        "expand chevron should be restored",
      ).not.toBeNull();
    });
  });

  it("renders skeletons in every column when mounted with isLoading true and no rows", async () => {
    const host = mount();

    render(host, [], true);
    await waitForElement(host, ".st-body-container .st-cell");
    await wait(60);

    expectAllCellsShowSkeleton(host);
  });

  it("clears expandable-column skeletons when empty+loading resolves to rows", async () => {
    const host = mount();

    // Mount empty + loading so expandable cells are created as skeletons.
    render(host, [], true);
    await waitForElement(host, ".st-body-container .st-cell");
    await wait(80);
    expectAllCellsShowSkeleton(host);

    render(host, data, false);
    await wait(150);

    const nameCells = host.querySelectorAll<HTMLElement>('.st-cell[data-accessor="name"]');
    expect(host.querySelectorAll(".st-loading-skeleton").length).toBe(0);
    expect(nameCells.length).toBe(2);
    const texts = Array.from(nameCells).map((c) => c.textContent);
    expect(texts).toContain("Alice");
    expect(texts).toContain("Bob");
    nameCells.forEach((cell) => {
      expect(
        cell.querySelector(".st-expand-icon-container"),
        "expand chevron should be restored after leaving loading",
      ).not.toBeNull();
    });
  });
});
