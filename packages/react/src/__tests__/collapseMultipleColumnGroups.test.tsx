import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactHeaderObject } from "../index";

// Regression test for the "only one column group can be collapsed at a time" bug.
//
// The collapse chevron's click handler closes over the render context captured
// when the header cell was first created (cells are reused, not recreated). Its
// functional `setCollapsedHeaders((prev) => ...)` update used to be seeded from
// that stale per-render `collapsedHeaders` snapshot (empty at first render), so
// collapsing a second group rebuilt the set from `[]` and DROPPED every other
// group's collapsed state. The fix seeds the update from the live
// `getCollapsedHeaders()` getter so collapses accumulate.

const rows = [
  { id: 1, perfAlways: 1, perfExpanded: 2, mktAlways: 3, mktExpanded: 4 },
  { id: 2, perfAlways: 5, perfExpanded: 6, mktAlways: 7, mktExpanded: 8 },
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

function clickChevron(el: Element): void {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

describe("SimpleTable (React adapter) — collapsing multiple column groups", () => {
  it("keeps a previously-collapsed group collapsed when collapsing another group", async () => {
    // Pin the groups left so jsdom's zero-width viewport (which virtualizes out
    // main-section columns) doesn't hide the expanded children — pinned
    // sections always render all of their cells, isolating the collapse logic.
    const headers: ReactHeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number", pinned: "left" },
      {
        accessor: "perf",
        label: "Performance",
        width: 240,
        collapsible: true,
        pinned: "left",
        children: [
          { accessor: "perfAlways", label: "P-always", width: 120, showWhen: "always" },
          { accessor: "perfExpanded", label: "P-expanded", width: 120, showWhen: "parentExpanded" },
        ],
      },
      {
        accessor: "mkt",
        label: "Market",
        width: 240,
        collapsible: true,
        pinned: "left",
        children: [
          { accessor: "mktAlways", label: "M-always", width: 120, showWhen: "always" },
          { accessor: "mktExpanded", label: "M-expanded", width: 120, showWhen: "parentExpanded" },
        ],
      },
    ];

    const host = mount(
      createElement(SimpleTable, {
        defaultHeaders: headers,
        rows,
        getRowId: (p: { row: unknown }) => String((p.row as { id?: number })?.id),
        height: "300px",
        theme: "light",
      }),
    );

    const headerCell = (accessor: string): HTMLElement | null =>
      host.querySelector<HTMLElement>(`.st-header-cell[data-accessor="${accessor}"]`);
    const chevron = (accessor: string): HTMLElement => {
      const el = host.querySelector<HTMLElement>(
        `.st-header-cell[data-accessor="${accessor}"] .st-collapsible-header-icon`,
      );
      if (!el) throw new Error(`No collapse chevron for group "${accessor}"`);
      return el;
    };

    // Both groups start expanded: their parentExpanded children are rendered.
    await waitFor(() => Boolean(headerCell("perfExpanded") && headerCell("mktExpanded")));

    // Collapse the first group → its parentExpanded child disappears.
    clickChevron(chevron("perf"));
    await waitFor(() => headerCell("perfExpanded") === null);
    expect(headerCell("perfAlways")).toBeTruthy();
    // The second group is untouched and still expanded.
    expect(headerCell("mktExpanded")).toBeTruthy();

    // Collapse the second group.
    clickChevron(chevron("mkt"));
    await waitFor(() => headerCell("mktExpanded") === null);

    // Regression assertion: collapsing the second group must NOT re-expand the
    // first. Before the fix, `perfExpanded` reappeared here because the
    // collapsed set was rebuilt from a stale empty base.
    expect(headerCell("perfExpanded")).toBeNull();
    expect(headerCell("mktExpanded")).toBeNull();
    // Always-visible children of both groups remain.
    expect(headerCell("perfAlways")).toBeTruthy();
    expect(headerCell("mktAlways")).toBeTruthy();
  });
});
