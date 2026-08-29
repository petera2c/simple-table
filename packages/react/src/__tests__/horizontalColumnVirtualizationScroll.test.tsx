import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactColumnDef } from "../index";
import { writePaneScrollX } from "../../../core/src/managers/horizontalScroll";

/**
 * Horizontal column virtualization on the main section: only columns that
 * intersect the visible band are in the DOM. Scrolling the main body past
 * the 20px virtualization threshold updates both body and header cells for
 * that band. Pinned columns stay mounted because they do not virtualize
 * horizontally.
 */

const COLUMN_COUNT = 30;
const COLUMN_WIDTH = 200;
const FAR_COLUMN_INDEX = 20;
const SCROLL_LEFT = FAR_COLUMN_INDEX * COLUMN_WIDTH;

const headers: ReactColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number", pinned: "left" },
  ...Array.from({ length: COLUMN_COUNT }, (_, i) => ({
    accessor: `c${i}`,
    label: `C${i}`,
    width: COLUMN_WIDTH,
    type: "number" as const,
  })),
];

const rows = Array.from({ length: 5 }, (_, i) => {
  const row: Record<string, number> = { id: i + 1 };
  for (let c = 0; c < COLUMN_COUNT; c++) {
    row[`c${c}`] = (i + 1) * 100 + c;
  }
  return row;
});

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

async function flushRaf(rounds = 2): Promise<void> {
  for (let i = 0; i < rounds; i++) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }
}

function accessorsIn(section: Element | null, cellSelector: string): Set<string> {
  if (!section) return new Set();
  return new Set(
    Array.from(section.querySelectorAll<HTMLElement>(cellSelector))
      .map((el) => el.getAttribute("data-accessor"))
      .filter((accessor): accessor is string => accessor != null),
  );
}

describe("SimpleTable — horizontal column virtualization on scroll", () => {
  it("moves the main body and header cell band when the main section scrolls horizontally", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    container = host;
    root = createRoot(host);

    root.render(
      createElement(SimpleTable, {
        columns: headers,
        rows,
        getRowId: (p) => String((p.row as { id: number }).id),
        height: "250px",
        theme: "light",
      }),
    );

    await waitFor(() => host.querySelectorAll(".st-body-main .st-cell").length > 0);
    await flushRaf(3);

    const tableRoot = host.querySelector<HTMLElement>(".simple-table-root");
    const mainBody = host.querySelector<HTMLElement>(".st-body-main");
    const mainHeader = host.querySelector<HTMLElement>(".st-header-main");
    const pinnedBody = host.querySelector<HTMLElement>(".st-body-pinned-left");
    const pinnedHeader = host.querySelector<HTMLElement>(".st-header-pinned-left");

    expect(tableRoot).not.toBeNull();
    expect(mainBody).not.toBeNull();
    expect(mainHeader).not.toBeNull();
    expect(pinnedBody).not.toBeNull();
    expect(pinnedHeader).not.toBeNull();

    const bodyBefore = accessorsIn(mainBody, ".st-cell");
    const headerBefore = accessorsIn(mainHeader, ".st-header-cell");

    expect(bodyBefore.has("c0")).toBe(true);
    expect(bodyBefore.has(`c${FAR_COLUMN_INDEX}`)).toBe(false);
    expect(headerBefore.has("c0")).toBe(true);
    expect(headerBefore.has(`c${FAR_COLUMN_INDEX}`)).toBe(false);
    expect(accessorsIn(pinnedBody, ".st-cell").has("id")).toBe(true);
    expect(accessorsIn(pinnedHeader, ".st-header-cell").has("id")).toBe(true);

    writePaneScrollX(tableRoot!, "main", SCROLL_LEFT);
    await flushRaf(2);

    const bodyAfter = accessorsIn(mainBody, ".st-cell");
    const headerAfter = accessorsIn(mainHeader, ".st-header-cell");

    expect(bodyAfter.has("c0")).toBe(false);
    expect(bodyAfter.has(`c${FAR_COLUMN_INDEX}`)).toBe(true);
    expect(headerAfter.has("c0")).toBe(false);
    expect(headerAfter.has(`c${FAR_COLUMN_INDEX}`)).toBe(true);
    expect(accessorsIn(pinnedBody, ".st-cell").has("id")).toBe(true);
    expect(accessorsIn(pinnedHeader, ".st-header-cell").has("id")).toBe(true);
  });
});
