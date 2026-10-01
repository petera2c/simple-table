import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableVanilla } from "../index";
import type { ColumnDef } from "../types/ColumnDef";
import type { TableAPI } from "../types/TableAPI";

/**
 * `width: "auto"` with an async cell renderer (the React/Vue/Solid portal
 * shape: an empty host now, real content on a later turn). jsdom has no
 * layout, so offsetWidth is stubbed from text length. A plain column and a
 * rendered column hold the same string; they should end at the same width.
 */

const LONG = "W".repeat(80);
const SHORT = "ab";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

/** Let a queued portal fill and any post-paint re-fit run. */
async function flushPaint(): Promise<void> {
  await wait(0);
  await wait(30);
}

type Row = { id: number; genre: string; genreRendered: string };

function leafWidth(table: SimpleTableVanilla<Row>, accessor: string): number {
  const find = (list: ColumnDef[]): number | null => {
    for (const header of list) {
      if (header.children?.length) {
        const nested = find(header.children);
        if (nested != null) return nested;
      } else if (String(header.accessor) === accessor && typeof header.width === "number") {
        return header.width;
      }
    }
    return null;
  };
  return find(table.getAPI().getHeaders()) ?? 0;
}

/**
 * Async renderer: empty host while measuring, content arrives on a microtask
 * once `fill()` has run (same contract as a React portal).
 */
function makeAsyncRenderer() {
  const pending: Array<{ el: HTMLElement; value: string }> = [];
  let mounted = false;
  const fillEl = (el: HTMLElement, value: string) => {
    if (!el.textContent) el.textContent = value;
  };
  return {
    cellRenderer: ({ value }: { value: unknown }) => {
      const el = document.createElement("div");
      el.setAttribute("data-st-portal-id", "auto-size-test");
      const text = value == null ? "" : String(value);
      if (mounted) {
        queueMicrotask(() => fillEl(el, text));
      } else {
        pending.push({ el, value: text });
      }
      return el;
    },
    fill() {
      mounted = true;
      for (const item of pending) fillEl(item.el, item.value);
      pending.length = 0;
    },
  };
}

let restoreOffsetWidth: (() => void) | null = null;

function installTextWidth() {
  const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get() {
      const styleWidth = this.style?.width ?? "";
      if (styleWidth.endsWith("px")) {
        const px = parseFloat(styleWidth);
        if (px > 0) return px;
      }
      const structural =
        this.classList?.contains("simple-table-root") ||
        this.classList?.contains("st-body") ||
        this.classList?.contains("st-header") ||
        this.classList?.contains("st-content") ||
        this.classList?.contains("st-main") ||
        this.classList?.contains("st-cell") ||
        this.classList?.contains("st-header-cell") ||
        this.classList?.contains("st-footer");
      if (structural) return 120;
      const text = (this.textContent ?? "").replace(/\s+/g, " ").trim();
      return text.length * 8;
    },
  });
  restoreOffsetWidth = () => {
    if (original) {
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", original);
    } else {
      delete (HTMLElement.prototype as unknown as { offsetWidth?: number }).offsetWidth;
    }
    restoreOffsetWidth = null;
  };
}

const mounted: Array<{ table: SimpleTableVanilla<Row>; container: HTMLDivElement }> = [];

afterEach(() => {
  for (const entry of mounted.splice(0)) {
    entry.table.destroy();
    entry.container.remove();
  }
  restoreOffsetWidth?.();
});

function columnsFor(cellRenderer: ColumnDef["cellRenderer"], hideRendered = false): ColumnDef<Row>[] {
  return [
    { accessor: "id", label: "ID", width: 80, type: "number" },
    { accessor: "genre", label: "Genre", width: "auto", type: "string" },
    {
      accessor: "genreRendered",
      label: "Genre",
      width: "auto",
      type: "string",
      hide: hideRendered,
      cellRenderer,
    },
  ];
}

function mount(
  rows: Row[],
  cellRenderer: ColumnDef["cellRenderer"],
  extras?: { enablePagination?: boolean; rowsPerPage?: number; columnResizing?: boolean },
) {
  installTextWidth();
  const container = document.createElement("div");
  document.body.appendChild(container);
  const table = new SimpleTableVanilla<Row>(container, {
    columns: columnsFor(cellRenderer),
    rows,
    getRowId: (params) => String(params.row.id),
    height: "240px",
    theme: "light",
    animations: { enabled: false },
    autoExpandColumns: false,
    enablePagination: extras?.enablePagination,
    rowsPerPage: extras?.rowsPerPage,
    columnResizing: extras?.columnResizing,
  });
  table.mount();
  mounted.push({ table, container });
  return { table, container };
}

function pair(i: number, genre: string): Row {
  return { id: i, genre, genreRendered: genre };
}

describe("auto column width with async cell renderers", () => {
  it("re-fits a rendered auto column when it is shown again", async () => {
    const renderer = makeAsyncRenderer();
    const rows = [pair(1, LONG), pair(2, LONG)];
    const { table, container } = mount(rows, renderer.cellRenderer);
    await waitFor(() => container.querySelectorAll(".st-header-cell").length > 0);

    renderer.fill();
    table.refitAutoSizeColumns();
    const fitted = leafWidth(table, "genreRendered");
    expect(leafWidth(table, "genre")).toBeGreaterThan(200);
    expect(fitted).toBeGreaterThan(200);

    table.update({ columns: columnsFor(renderer.cellRenderer, true) });
    table.update({ columns: columnsFor(renderer.cellRenderer, false) });
    await flushPaint();

    const shown = leafWidth(table, "genreRendered");
    expect(shown).toBeGreaterThan(200);
    expect(Math.abs(shown - leafWidth(table, "genre"))).toBeLessThan(40);
  });

  it("re-fits both columns when the footer changes page", async () => {
    const renderer = makeAsyncRenderer();
    const rows = [
      ...Array.from({ length: 5 }, (_, i) => pair(i + 1, SHORT)),
      ...Array.from({ length: 5 }, (_, i) => pair(i + 6, LONG)),
    ];
    const { table, container } = mount(rows, renderer.cellRenderer, {
      enablePagination: true,
      rowsPerPage: 5,
    });
    await waitFor(() => container.querySelector('[aria-label="Go to page 2"]') != null);

    renderer.fill();
    table.refitAutoSizeColumns();
    const plainBefore = leafWidth(table, "genre");
    const renderedBefore = leafWidth(table, "genreRendered");

    container.querySelector<HTMLButtonElement>('[aria-label="Go to page 2"]')!.click();
    await flushPaint();

    expect(leafWidth(table, "genre")).toBeGreaterThan(plainBefore + 100);
    expect(leafWidth(table, "genreRendered")).toBeGreaterThan(renderedBefore + 100);
    expect(Math.abs(leafWidth(table, "genre") - leafWidth(table, "genreRendered"))).toBeLessThan(40);
  });

  it("re-fits both columns when setPage() changes page", async () => {
    const renderer = makeAsyncRenderer();
    const rows = [
      ...Array.from({ length: 5 }, (_, i) => pair(i + 1, SHORT)),
      ...Array.from({ length: 5 }, (_, i) => pair(i + 6, LONG)),
    ];
    const { table, container } = mount(rows, renderer.cellRenderer, {
      enablePagination: true,
      rowsPerPage: 5,
    });
    await waitFor(() => container.querySelectorAll(".st-cell").length > 0);

    renderer.fill();
    table.refitAutoSizeColumns();
    const plainBefore = leafWidth(table, "genre");
    const renderedBefore = leafWidth(table, "genreRendered");

    await table.getAPI().setPage(2);
    await flushPaint();

    expect(leafWidth(table, "genre")).toBeGreaterThan(plainBefore + 100);
    expect(leafWidth(table, "genreRendered")).toBeGreaterThan(renderedBefore + 100);
  });

  it("re-fits a rendered column when longer rows are appended", async () => {
    const renderer = makeAsyncRenderer();
    const { table, container } = mount(
      Array.from({ length: 8 }, (_, i) => pair(i + 1, SHORT)),
      renderer.cellRenderer,
    );
    await waitFor(() => container.querySelectorAll(".st-cell").length > 0);

    renderer.fill();
    table.refitAutoSizeColumns();
    const renderedBefore = leafWidth(table, "genreRendered");

    table.update({
      rows: Array.from({ length: 8 }, (_, i) => pair(i + 1, LONG)),
    });
    await flushPaint();

    expect(leafWidth(table, "genre")).toBeGreaterThan(200);
    expect(leafWidth(table, "genreRendered")).toBeGreaterThan(renderedBefore + 100);
  });

  it("does not keep a skeleton measurement after isLoading ends", async () => {
    const renderer = makeAsyncRenderer();
    const rows = [pair(1, LONG), pair(2, LONG)];
    const { table, container } = mount(rows, renderer.cellRenderer);
    await waitFor(() => container.querySelectorAll(".st-cell").length > 0);

    renderer.fill();
    table.refitAutoSizeColumns();
    const fitted = leafWidth(table, "genreRendered");
    expect(fitted).toBeGreaterThan(200);

    // New row objects rebuild the cells. The renderer fills on a microtask,
    // so the loading cycle's own measure still sees empty hosts.
    const next = rows.map((row) => ({ ...row }));
    table.update({ rows: next, isLoading: true });
    await waitFor(() => container.querySelectorAll(".st-loading-skeleton").length > 0);
    table.update({ isLoading: false });
    await flushPaint();

    const after = leafWidth(table, "genreRendered");
    expect(after).toBeGreaterThan(200);
    expect(Math.abs(after - leafWidth(table, "genre"))).toBeLessThan(40);
  });

  it("sizes a rendered column from sampled rows that are not on screen", async () => {
    const renderer = makeAsyncRenderer();
    // Long values sit past the rendered window. The head of the table is short.
    const rows = Array.from({ length: 120 }, (_, i) => pair(i + 1, i >= 80 ? LONG : SHORT));
    const { table, container } = mount(rows, renderer.cellRenderer);
    await waitFor(() => container.querySelectorAll(".st-cell").length > 0);

    renderer.fill();
    table.refitAutoSizeColumns();
    await flushPaint();

    const plain = leafWidth(table, "genre");
    const rendered = leafWidth(table, "genreRendered");
    expect(plain).toBeGreaterThan(200);
    expect(rendered).toBeGreaterThan(200);
    expect(Math.abs(plain - rendered)).toBeLessThan(40);
  });

  it("keeps a dragged width when a later page change re-measures", async () => {
    const renderer = makeAsyncRenderer();
    const rows = [
      ...Array.from({ length: 5 }, (_, i) => pair(i + 1, SHORT)),
      ...Array.from({ length: 5 }, (_, i) => pair(i + 6, LONG)),
    ];
    const { table, container } = mount(rows, renderer.cellRenderer, {
      enablePagination: true,
      rowsPerPage: 5,
      columnResizing: true,
    });
    await waitFor(() => container.querySelector(".st-header-resize-handle-container") != null);

    renderer.fill();
    table.refitAutoSizeColumns();
    const before = leafWidth(table, "genre");

    const header = container.querySelector<HTMLElement>('.st-header-cell[data-accessor="genre"]');
    const handle = header?.querySelector(".st-header-resize-handle-container");
    expect(handle).toBeTruthy();
    handle!.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 20, clientY: 10, bubbles: true, cancelable: true }),
    );
    document.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 220, clientY: 10, bubbles: true, cancelable: true }),
    );
    document.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 220, clientY: 10, bubbles: true, cancelable: true }),
    );

    const dragged = leafWidth(table, "genre");
    expect(dragged).toBeGreaterThan(before + 100);

    container.querySelector<HTMLButtonElement>('[aria-label="Go to page 2"]')!.click();
    await flushPaint();

    expect(Math.abs(leafWidth(table, "genre") - dragged)).toBeLessThan(2);
  });

  it("exposes refitAutoSizeColumns on TableAPI", async () => {
    const renderer = makeAsyncRenderer();
    const { table, container } = mount([pair(1, LONG)], renderer.cellRenderer);
    await waitFor(() => container.querySelectorAll(".st-cell").length > 0);

    const api = table.getAPI() as TableAPI<Row> & { refitAutoSizeColumns?: () => void };
    expect(typeof api.refitAutoSizeColumns).toBe("function");

    const before = leafWidth(table, "genreRendered");
    renderer.fill();
    api.refitAutoSizeColumns?.();
    await flushPaint();

    expect(leafWidth(table, "genreRendered")).toBeGreaterThan(before + 100);
  });
});
