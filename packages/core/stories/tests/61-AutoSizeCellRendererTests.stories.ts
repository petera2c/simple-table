/**
 * AUTO-SIZE WITH CELL RENDERERS
 *
 * Two email columns hold the same address. Email is plain text. Rendered
 * paints through an async host (the React portal shape). After the content
 * is in the DOM, both columns should land on the same width.
 *
 * The addresses are short enough to stay under the 500px cap, so a match is
 * a content width rather than both columns sitting on the cap.
 */

import type { ColumnDef, SimpleTableVanilla } from "../../src/index";
import { expect } from "@storybook/test";
import { waitForTable, waitUntil } from "./testUtils";
import { renderVanillaTable } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/61 - Auto-Size Cell Renderer",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Two email columns, one plain and one rendered. width: 'auto' should give them the same content width across hide/show, page changes, appended rows, loading, off-screen samples, and a drag.",
      },
    },
  },
};

export default meta;

const LONG = "alexandra.montgomery@international-shipping.example.com";
const SHORT = "ada@x.co";

type Row = { id: number; email: string; emailRendered: string };

type Harness = {
  table: SimpleTableVanilla<Row>;
  fill: () => void;
  columns: (hideRendered?: boolean) => ColumnDef<Row>[];
};

const pair = (id: number, email: string): Row => ({ id, email, emailRendered: email });

const buildContent = (value: string): HTMLElement => {
  const span = document.createElement("span");
  span.style.whiteSpace = "nowrap";
  span.textContent = value;
  return span;
};

/**
 * Empty host until fill(), then content on a microtask. Marked as a portal
 * host so auto-size waits for the painted output.
 */
const makePortalRenderer = () => {
  const pending: Array<{ el: HTMLElement; value: string }> = [];
  let mounted = false;
  const fillEl = (el: HTMLElement, value: string) => {
    if (el.childNodes.length === 0) el.appendChild(buildContent(value));
  };
  return {
    cellRenderer: ({ value }: { value: unknown }) => {
      const el = document.createElement("div");
      el.setAttribute("data-st-portal-id", "story-auto-size");
      const text = value == null ? "" : String(value);
      if (mounted) queueMicrotask(() => fillEl(el, text));
      else pending.push({ el, value: text });
      return el;
    },
    fill() {
      mounted = true;
      for (const item of pending) fillEl(item.el, item.value);
      pending.length = 0;
    },
  };
};

const widthOf = (root: HTMLElement, label: string): number => {
  const headers = Array.from(root.querySelectorAll(".st-header-cell"));
  for (const header of headers) {
    const text = header.querySelector(".st-header-label-text");
    if (text?.textContent?.trim() === label) return header.getBoundingClientRect().width;
  }
  return 0;
};

const harnessOf = (canvas: HTMLElement): Harness => {
  const marked = canvas.querySelector("[data-auto-size-harness]") as
    | (HTMLElement & { __harness?: Harness })
    | null;
  const harness = marked?.__harness;
  if (!harness) throw new Error("auto-size harness missing");
  return harness;
};

const mount = (
  rows: Row[],
  extras?: {
    enablePagination?: boolean;
    rowsPerPage?: number;
    columnResizing?: boolean;
    height?: string;
  },
): HTMLDivElement => {
  const renderer = makePortalRenderer();
  const columns = (hideRendered = false): ColumnDef<Row>[] => [
    { accessor: "email", label: "Email", width: "auto", type: "string" },
    {
      accessor: "emailRendered",
      label: "Rendered",
      width: "auto",
      type: "string",
      hide: hideRendered,
      cellRenderer: renderer.cellRenderer,
    },
  ];
  const { wrapper, table } = renderVanillaTable<Row>(columns(), rows, {
    getRowId: (params: { row: Row }) => String(params.row.id),
    height: extras?.height ?? "280px",
    theme: "light",
    animations: { enabled: false },
    autoExpandColumns: false,
    enablePagination: extras?.enablePagination,
    rowsPerPage: extras?.rowsPerPage,
    columnResizing: extras?.columnResizing,
  });
  wrapper.setAttribute("data-auto-size-harness", "");
  (wrapper as HTMLDivElement & { __harness?: Harness }).__harness = {
    table,
    fill: renderer.fill,
    columns,
  };
  return wrapper;
};

const pageRows = (): Row[] => [
  ...Array.from({ length: 5 }, (_, i) => pair(i + 1, SHORT)),
  ...Array.from({ length: 5 }, (_, i) => pair(i + 6, LONG)),
];

/** Fill renderer hosts, re-fit, and wait until both columns share a content width. */
const settleLong = async (canvas: HTMLElement): Promise<void> => {
  const { fill, table } = harnessOf(canvas);
  fill();
  table.refitAutoSizeColumns();
  await waitUntil(
    () => {
      const plain = widthOf(canvas, "Email");
      const rendered = widthOf(canvas, "Rendered");
      return plain > 250 && rendered > 250 && Math.abs(plain - rendered) < 80;
    },
    { timeoutMs: 4000 },
  );
};

export const HideShowRestoresRenderedWidth = {
  parameters: { tags: ["auto-size-renderer-hide-show"] },
  render: () => mount([pair(1, LONG), pair(2, LONG)]),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable(canvasElement);
    await settleLong(canvasElement);
    const fitted = widthOf(canvasElement, "Rendered");

    const { table, columns } = harnessOf(canvasElement);
    table.update({ columns: columns(true) });
    table.update({ columns: columns(false) });

    await waitUntil(
      () => Math.abs(widthOf(canvasElement, "Rendered") - fitted) < 80,
      { timeoutMs: 4000 },
    );
    expect(Math.abs(widthOf(canvasElement, "Email") - widthOf(canvasElement, "Rendered"))).toBeLessThan(
      80,
    );
  },
};

export const FooterPageChangeRefitsRenderedColumn = {
  parameters: { tags: ["auto-size-renderer-footer-page"] },
  render: () =>
    mount(pageRows(), { enablePagination: true, rowsPerPage: 5 }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable(canvasElement);
    const { fill, table } = harnessOf(canvasElement);
    fill();
    table.refitAutoSizeColumns();
    await waitUntil(() => widthOf(canvasElement, "Email") > 0 && widthOf(canvasElement, "Rendered") > 0);

    const plainBefore = widthOf(canvasElement, "Email");
    const renderedBefore = widthOf(canvasElement, "Rendered");
    canvasElement.querySelector<HTMLButtonElement>('[aria-label="Go to page 2"]')!.click();

    await waitUntil(
      () =>
        widthOf(canvasElement, "Email") > plainBefore + 80 &&
        widthOf(canvasElement, "Rendered") > renderedBefore + 80,
      { timeoutMs: 4000 },
    );
    expect(
      Math.abs(widthOf(canvasElement, "Email") - widthOf(canvasElement, "Rendered")),
    ).toBeLessThan(80);
  },
};

export const SetPageRefitsBothColumns = {
  parameters: { tags: ["auto-size-renderer-set-page"] },
  render: () => mount(pageRows(), { enablePagination: true, rowsPerPage: 5 }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable(canvasElement);
    const { fill, table } = harnessOf(canvasElement);
    fill();
    table.refitAutoSizeColumns();
    await waitUntil(() => widthOf(canvasElement, "Email") > 0);

    const plainBefore = widthOf(canvasElement, "Email");
    const renderedBefore = widthOf(canvasElement, "Rendered");
    await table.getAPI().setPage(2);

    await waitUntil(
      () =>
        widthOf(canvasElement, "Email") > plainBefore + 80 &&
        widthOf(canvasElement, "Rendered") > renderedBefore + 80,
      { timeoutMs: 4000 },
    );
  },
};

export const AppendedRowsRefitRenderedColumn = {
  parameters: { tags: ["auto-size-renderer-append"] },
  render: () => mount(Array.from({ length: 8 }, (_, i) => pair(i + 1, SHORT))),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable(canvasElement);
    const { fill, table } = harnessOf(canvasElement);
    fill();
    table.refitAutoSizeColumns();
    await waitUntil(() => widthOf(canvasElement, "Rendered") > 0);
    const before = widthOf(canvasElement, "Rendered");

    table.update({
      rows: Array.from({ length: 8 }, (_, i) => pair(i + 1, LONG)),
    });

    await waitUntil(() => widthOf(canvasElement, "Rendered") > before + 80, { timeoutMs: 4000 });
    expect(widthOf(canvasElement, "Email")).toBeGreaterThan(250);
  },
};

export const LoadingCycleRefitsRenderedColumn = {
  parameters: { tags: ["auto-size-renderer-loading"] },
  render: () => mount([pair(1, LONG), pair(2, LONG)]),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable(canvasElement);
    await settleLong(canvasElement);

    const { table } = harnessOf(canvasElement);
    const rows = [pair(1, LONG), pair(2, LONG)];
    table.update({ rows, isLoading: true });
    await waitUntil(() => canvasElement.querySelectorAll(".st-loading-skeleton").length > 0);
    table.update({ isLoading: false });

    await waitUntil(
      () => {
        const plain = widthOf(canvasElement, "Email");
        const rendered = widthOf(canvasElement, "Rendered");
        return plain > 250 && rendered > 250 && Math.abs(plain - rendered) < 80;
      },
      { timeoutMs: 4000 },
    );
  },
};

export const OffscreenSampleMatchesPlainColumn = {
  parameters: { tags: ["auto-size-renderer-offscreen"] },
  render: () =>
    mount(
      Array.from({ length: 120 }, (_, i) => pair(i + 1, i >= 80 ? LONG : SHORT)),
      { height: "220px" },
    ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable(canvasElement);
    await settleLong(canvasElement);
    expect(Math.abs(widthOf(canvasElement, "Email") - widthOf(canvasElement, "Rendered"))).toBeLessThan(
      80,
    );
  },
};

export const DraggedWidthSurvivesPageChange = {
  parameters: { tags: ["auto-size-renderer-drag"] },
  render: () =>
    mount(pageRows(), { enablePagination: true, rowsPerPage: 5, columnResizing: true }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable(canvasElement);
    const { fill, table } = harnessOf(canvasElement);
    fill();
    table.refitAutoSizeColumns();
    await waitUntil(() => widthOf(canvasElement, "Email") > 0);
    const beforeDrag = widthOf(canvasElement, "Email");

    const header = Array.from(canvasElement.querySelectorAll(".st-header-cell")).find((cell) =>
      cell.querySelector(".st-header-label-text")?.textContent?.trim() === "Email",
    );
    const handle = header?.querySelector(".st-header-resize-handle-container");
    expect(handle).toBeTruthy();
    const startX = handle!.getBoundingClientRect().left + 5;
    const y = handle!.getBoundingClientRect().top + 5;
    handle!.dispatchEvent(
      new MouseEvent("mousedown", { clientX: startX, clientY: y, bubbles: true, cancelable: true }),
    );
    document.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: startX + 180,
        clientY: y,
        bubbles: true,
        cancelable: true,
      }),
    );
    document.dispatchEvent(
      new MouseEvent("mouseup", {
        clientX: startX + 180,
        clientY: y,
        bubbles: true,
        cancelable: true,
      }),
    );
    await new Promise((resolve) => setTimeout(resolve, 50));
    const dragged = widthOf(canvasElement, "Email");
    expect(dragged).toBeGreaterThan(beforeDrag + 80);

    canvasElement.querySelector<HTMLButtonElement>('[aria-label="Go to page 2"]')!.click();
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(Math.abs(widthOf(canvasElement, "Email") - dragged)).toBeLessThan(8);
  },
};

export const TableAPIRefitsAfterPaint = {
  parameters: { tags: ["auto-size-renderer-api"] },
  render: () => mount([pair(1, LONG)]),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable(canvasElement);
    const { fill, table } = harnessOf(canvasElement);
    const before = widthOf(canvasElement, "Rendered");
    fill();
    table.getAPI().refitAutoSizeColumns();
    await waitUntil(() => widthOf(canvasElement, "Rendered") > before + 80, { timeoutMs: 4000 });
    expect(Math.abs(widthOf(canvasElement, "Email") - widthOf(canvasElement, "Rendered"))).toBeLessThan(
      80,
    );
  },
};
