import { createElement, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CONTAINER_RESIZE_NOTIFY_DEBOUNCE_MS, CONTAINER_RESIZE_BURST_END_MS } from "../../../core/src/managers/DimensionManager";
import { SimpleTable } from "../index";
import type { CellRendererProps, ReactColumnDef } from "../index";

/**
 * Regression: after a few container resize events, scrolling back up leaves
 * some rows blank. The blank state survives sort / column visibility changes
 * and only recovers after another resize.
 *
 * Two failure modes this suite targets:
 * 1. Body context cache keyed only on `containerWidth`, so
 *    `mainSectionViewportWidth` can go stale when pinned section widths shift
 *    (or when auto-expand redistributes) and column virtualization culls every
 *    cell for a row.
 * 2. React cellRenderer portals disposed (e.g. animation / host discard) while
 *    `contentKeyMap` still thinks content is unchanged, so later full renders
 *    (sort, visibility) skip rebuilding the empty cell.
 */

const FLOATING_ATTR = "data-st-test-floating-cell";

function FloatingCell({ value }: CellRendererProps) {
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute(FLOATING_ATTR, "true");
    el.textContent = `floating:${String(value ?? "")}`;
    document.body.appendChild(el);
    return () => {
      el.remove();
    };
  }, [value]);

  return createElement("span", { className: "custom-cell" }, String(value ?? ""));
}

/** ResizeObserver we can fire manually to simulate layout animation frames. */
class ControllableResizeObserver {
  static instances: ControllableResizeObserver[] = [];
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    ControllableResizeObserver.instances.push(this);
  }

  observe(): void {
    queueMicrotask(() => this.callback([], this as unknown as ResizeObserver));
  }

  trigger(): void {
    this.callback([], this as unknown as ResizeObserver);
  }

  unobserve(): void {}

  disconnect(): void {
    ControllableResizeObserver.instances = ControllableResizeObserver.instances.filter(
      (instance) => instance !== this,
    );
  }
}

function defineClientWidth(element: HTMLElement, getWidth: () => number): void {
  Object.defineProperty(element, "clientWidth", {
    configurable: true,
    get: getWidth,
  });
}

function defineClientHeight(element: HTMLElement, height: number): void {
  Object.defineProperty(element, "clientHeight", {
    configurable: true,
    get: () => height,
  });
}

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

async function flushResizeSettle(): Promise<void> {
  await new Promise<void>((resolve) =>
    setTimeout(
      resolve,
      CONTAINER_RESIZE_NOTIFY_DEBOUNCE_MS + CONTAINER_RESIZE_BURST_END_MS + 20,
    ),
  );
  await flushRaf();
}

function nameTextForVisibleRows(host: HTMLElement): string[] {
  const cells = Array.from(
    host.querySelectorAll<HTMLElement>('.st-body-container .st-cell[data-accessor="name"]'),
  );
  return cells
    .map((cell) => {
      const custom = cell.querySelector(".custom-cell");
      const text = (custom?.textContent ?? cell.textContent ?? "").trim();
      const top = parseFloat(cell.style.top || "0");
      return { text, top };
    })
    .sort((a, b) => a.top - b.top)
    .map((c) => c.text);
}

function countBlankNameCells(host: HTMLElement): number {
  return nameTextForVisibleRows(host).filter((t) => t.length === 0).length;
}

const ROW_COUNT = 80;
const rows = Array.from({ length: ROW_COUNT }, (_, i) => ({
  id: i + 1,
  name: `Row ${i + 1}`,
  score: (ROW_COUNT - i) * 10,
}));

let container: HTMLDivElement | null = null;
let root: Root | null = null;
let originalResizeObserver: typeof ResizeObserver;

beforeEach(() => {
  originalResizeObserver = globalThis.ResizeObserver;
  ControllableResizeObserver.instances = [];
  globalThis.ResizeObserver = ControllableResizeObserver as unknown as typeof ResizeObserver;
});

afterEach(() => {
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
  document.querySelectorAll(`[${FLOATING_ATTR}]`).forEach((el) => el.remove());
  globalThis.ResizeObserver = originalResizeObserver;
  ControllableResizeObserver.instances = [];
});

describe("SimpleTable — blank rows after resize + scroll back", () => {
  it(
    "keeps row content after repeated container resizes and scrolling back to top",
    async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    container = host;
    root = createRoot(host);

    let containerWidth = 1200;

    const headers: ReactColumnDef[] = [
      { accessor: "id", label: "ID", width: 80, type: "number", pinned: "left" },
      {
        accessor: "name",
        label: "Name",
        width: 160,
        type: "string",
        cellRenderer: FloatingCell,
      },
      { accessor: "score", label: "Score", width: 120, type: "number" },
      ...Array.from({ length: 12 }, (_, i) => ({
        accessor: `m${i}`,
        label: `M${i}`,
        width: 140,
        type: "number" as const,
      })),
    ];

    const rowsWithMetrics = rows.map((row) => {
      const extended: Record<string, unknown> = { ...row };
      for (let i = 0; i < 12; i++) extended[`m${i}`] = row.id * (i + 1);
      return extended;
    });

    const renderTable = (nextHeaders: ReactColumnDef[]) => {
      root!.render(
        createElement(SimpleTable, {
          columns: nextHeaders,
          rows: rowsWithMetrics,
          getRowId: (p) => String((p.row as { id: number }).id),
          height: "400px",
          theme: "light",
          columnResizing: true,
          autoExpandColumns: true,
        }),
      );
    };

    renderTable(headers);

    await waitFor(() => host.querySelectorAll(".st-body-container .st-cell").length > 0);

    const bodyContainer = host.querySelector(".st-body-container") as HTMLElement;
    expect(bodyContainer).not.toBeNull();

    defineClientWidth(bodyContainer, () => containerWidth);
    defineClientHeight(bodyContainer, 400);

    // Several stepped resizes (collapsible-nav style), then settle.
    for (const nextWidth of [1100, 1000, 900, 800, 960]) {
      containerWidth = nextWidth;
      ControllableResizeObserver.instances.forEach((observer) => observer.trigger());
      await flushRaf();
    }
    await flushResizeSettle();

    // Widen the pinned column without changing containerWidth — this shifts
    // mainSectionViewportWidth while containerWidth stays put (the context-
    // cache hole that left rows blank after scroll-back).
    renderTable([
      { ...headers[0], width: 280 },
      ...headers.slice(1),
    ]);
    await flushRaf(3);
    await wait(50);

    await waitFor(() => countBlankNameCells(host) === 0);

    // Scroll down far enough to recycle the top band, then back to top.
    bodyContainer.scrollTop = 2000;
    bodyContainer.dispatchEvent(new Event("scroll"));
    await flushRaf(3);
    await wait(200);

    bodyContainer.scrollTop = 0;
    bodyContainer.dispatchEvent(new Event("scroll"));
    await flushRaf(3);
    await wait(200);

    const namesAfterScroll = nameTextForVisibleRows(host);
    expect(namesAfterScroll.length).toBeGreaterThan(0);
    expect(namesAfterScroll.every((t) => t.length > 0)).toBe(true);
    expect(countBlankNameCells(host)).toBe(0);

    // Sort must not leave blanks either (user-reported persistence).
    const scoreHeader = Array.from(host.querySelectorAll<HTMLElement>(".st-header-label")).find(
      (el) => el.textContent?.includes("Score"),
    );
    expect(scoreHeader).toBeTruthy();
    scoreHeader!.click();
    await wait(150);
    await flushRaf(2);

    expect(countBlankNameCells(host)).toBe(0);
    expect(nameTextForVisibleRows(host).every((t) => t.length > 0)).toBe(true);
  },
  15_000,
);
});
