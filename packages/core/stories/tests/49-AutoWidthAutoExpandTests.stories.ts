/**
 * AUTO WIDTH + AUTO EXPAND COLUMNS TESTS
 *
 * Combined coverage for `width: "auto"` columns under `autoExpandColumns`
 * (the expand-only model):
 * - surplus: content-measured natural widths stretched proportionally to fill
 * - deficit: natural widths kept, horizontal scroll, never squeezed
 * - container resize crossing the fit threshold both ways (no compounding)
 * - drag-resize into horizontal overflow and back out of it
 * - neighbor shrink floors at the measured (natural) width during drags
 * - maxWidth caps during expansion with surplus redistribution
 * - pinned + auto + autoExpand layout
 * - data updates and pagination page changes re-measuring auto columns
 * - double-click auto-fit under the expand-or-scroll model
 */

import { HeaderObject, Row, SimpleTableVanilla } from "../../src/index";
import { expect, userEvent } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/49-AutoWidthAutoExpandTests",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tests for width:'auto' columns combined with autoExpandColumns: expand-only fill from measured natural widths, horizontal scroll on deficit, natural-width shrink floors during resize, re-measure on data/page changes.",
      },
    },
  },
};

export default meta;

// ── Shared helpers ──────────────────────────────────────────────────────────

const WIDTH_TOLERANCE = 5;
const RESIZE_TOLERANCE = 20;

const makeRows = <T,>(n: number, fn: (i: number) => T): T[] =>
  Array.from({ length: n }, (_, i) => fn(i));

const longText =
  "This is a very long cell value that should make a content-fit column grow much wider than the header label";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const getHeaderCells = (canvasElement: HTMLElement): Element[] =>
  Array.from(canvasElement.querySelectorAll(".st-header-cell"));

const findHeaderCellByLabel = (
  canvasElement: HTMLElement,
  label: string,
): Element | null => {
  for (const header of getHeaderCells(canvasElement)) {
    const labelEl =
      header.querySelector(".st-header-label-text") ||
      header.querySelector(".st-header-label");
    if (labelEl?.textContent?.trim() === label) return header;
  }
  return null;
};

const widthOf = (canvasElement: HTMLElement, label: string): number => {
  const cell = findHeaderCellByLabel(canvasElement, label);
  return cell ? cell.getBoundingClientRect().width : 0;
};

const totalHeaderWidth = (canvasElement: HTMLElement): number =>
  getHeaderCells(canvasElement).reduce(
    (sum, cell) => sum + cell.getBoundingClientRect().width,
    0,
  );

const containerWidthOf = (canvasElement: HTMLElement, fallback: number): number => {
  const container = canvasElement.querySelector(".st-body-container") as HTMLElement | null;
  return container?.clientWidth ?? fallback;
};

const bodyMainOf = (canvasElement: HTMLElement): HTMLElement => {
  const bodyMain = canvasElement.querySelector(".st-body-main") as HTMLElement | null;
  expect(bodyMain, "body-main should exist").toBeTruthy();
  return bodyMain!;
};

const hasHorizontalScroll = (canvasElement: HTMLElement): boolean => {
  const bodyMain = bodyMainOf(canvasElement);
  return bodyMain.scrollWidth > bodyMain.clientWidth + 2;
};

/** Horizontal overflow in px (0 when the columns fit the viewport). */
const horizontalOverflowOf = (canvasElement: HTMLElement): number => {
  const bodyMain = bodyMainOf(canvasElement);
  return bodyMain.scrollWidth - bodyMain.clientWidth;
};

/** Wait (bounded) for post-drag re-renders to settle the overflow state. */
const waitForOverflowAtMost = async (
  canvasElement: HTMLElement,
  maxOverflow: number,
  maxMs = 1000,
): Promise<void> => {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    if (horizontalOverflowOf(canvasElement) <= maxOverflow) return;
    await wait(50);
  }
};

/** Scroll the main body horizontally (columns are virtualized: off-screen
 *  header cells are not in the DOM until scrolled into view). */
const scrollMainTo = async (
  canvasElement: HTMLElement,
  scrollLeft: number,
): Promise<void> => {
  const bodyMain = bodyMainOf(canvasElement);
  bodyMain.scrollLeft = scrollLeft;
  bodyMain.dispatchEvent(new Event("scroll", { bubbles: true }));
  await wait(200);
};

/** Drag a column's resize handle in small steps (simulates a slow user drag). */
const resizeColumnSlow = async (
  headerCell: Element,
  resizeAmount: number,
  steps = 8,
  stepDelayMs = 30,
): Promise<void> => {
  const doc = headerCell.ownerDocument;
  const resizeHandle = headerCell.querySelector(".st-header-resize-handle-container");
  if (!resizeHandle) throw new Error("Resize handle not found");
  const rect = resizeHandle.getBoundingClientRect();
  const startX = rect.left + 5;
  const endX = startX + resizeAmount;
  const y = rect.top + 5;
  resizeHandle.dispatchEvent(
    new MouseEvent("mousedown", { clientX: startX, clientY: y, bubbles: true, cancelable: true }),
  );
  for (let i = 1; i <= steps; i++) {
    const x = startX + (resizeAmount * i) / steps;
    doc.dispatchEvent(
      new MouseEvent("mousemove", { clientX: x, clientY: y, bubbles: true, cancelable: true }),
    );
    await wait(stepDelayMs);
  }
  doc.dispatchEvent(
    new MouseEvent("mouseup", { clientX: endX, clientY: y, bubbles: true, cancelable: true }),
  );
  await wait(150);
};

// Module-level handles so play() can drive update() / container resizes on
// the mounted table (canvasElement.firstElementChild is a Storybook decorator
// wrapper, not the story's own wrapper element).
let dataUpdateTable: SimpleTableVanilla | null = null;
let resizeWrapper: HTMLElement | null = null;

// ============================================================================
// LAYOUT — surplus / deficit / threshold crossing
// ============================================================================

/** Surplus: auto column is content-measured, then all columns stretch
 *  proportionally to fill the container. No horizontal scroll. */
export const AutoWidthSurplusStretchesToFill = {
  parameters: { tags: ["auto-width-expand-surplus"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: "auto", type: "number" },
      { accessor: "name", label: "Name", width: 150, type: "string" },
      { accessor: "department", label: "Department", width: 150, type: "string" },
    ];
    const data = makeRows(20, (i) => ({
      id: i + 1,
      name: `Name ${i}`,
      department: `Dept ${i % 4}`,
    }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
      autoExpandColumns: true,
    });
    wrapper.style.width = "800px";
    wrapper.style.boxSizing = "border-box";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const containerWidth = containerWidthOf(canvasElement, 800);

    // Columns stretched to fill exactly — declared 150s grew past 150.
    const totalW = totalHeaderWidth(canvasElement);
    expect(Math.abs(totalW - containerWidth)).toBeLessThanOrEqual(WIDTH_TOLERANCE);
    expect(widthOf(canvasElement, "Name")).toBeGreaterThan(160);
    expect(widthOf(canvasElement, "Department")).toBeGreaterThan(160);
    // The measured auto column participates (has a sane, non-collapsed width).
    expect(widthOf(canvasElement, "ID")).toBeGreaterThan(38);

    expect(hasHorizontalScroll(canvasElement)).toBe(false);
  },
};

/** Deficit: the measured auto column plus fixed columns exceed the container.
 *  Nothing is squeezed — natural widths are kept and the table scrolls. */
export const AutoWidthDeficitScrollsNoSqueeze = {
  parameters: { tags: ["auto-width-expand-deficit"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "notes", label: "Notes", width: "auto", type: "string" },
      { accessor: "name", label: "Name", width: 300, type: "string" },
      { accessor: "department", label: "Department", width: 300, type: "string" },
    ];
    const data = makeRows(20, (i) => ({
      notes: `${longText} ${i}`,
      name: `Name ${i}`,
      department: `Dept ${i % 4}`,
    }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.name),
      height: "300px",
      autoExpandColumns: true,
    });
    wrapper.style.width = "600px";
    wrapper.style.boxSizing = "border-box";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // The auto column keeps its measured content width.
    expect(widthOf(canvasElement, "Notes")).toBeGreaterThan(250);
    // The first fixed column keeps its declared (natural) width — no squeeze.
    expect(Math.abs(widthOf(canvasElement, "Name") - 300)).toBeLessThanOrEqual(WIDTH_TOLERANCE);

    // The overflow shows up as horizontal scroll.
    expect(hasHorizontalScroll(canvasElement)).toBe(true);

    // The last column is virtualized out of view; scroll it in and verify it
    // also kept its natural width.
    const bodyMain = bodyMainOf(canvasElement);
    await scrollMainTo(canvasElement, bodyMain.scrollWidth);
    expect(
      Math.abs(widthOf(canvasElement, "Department") - 300),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
  },
};

/** Container resize across the fit threshold in both directions: shrink below
 *  the natural total (scroll, naturals kept), then grow back (re-expand).
 *  Widths must return to the original expanded values — no compounding. */
export const AutoWidthContainerResizeNoCompounding = {
  parameters: { tags: ["auto-width-expand-container-resize"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: "auto", type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 150, type: "string" },
    ];
    const data = makeRows(20, (i) => ({
      id: i + 1,
      name: `Name ${i}`,
      city: `City ${i % 5}`,
    }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
      autoExpandColumns: true,
    });
    resizeWrapper = wrapper;
    wrapper.style.width = "900px";
    wrapper.style.boxSizing = "border-box";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const wrapperEl = resizeWrapper!;
    expect(wrapperEl).toBeTruthy();

    const wideContainerWidth = containerWidthOf(canvasElement, 900);
    const expandedName = widthOf(canvasElement, "Name");
    const expandedId = widthOf(canvasElement, "ID");
    // Wide container: expanded fill.
    expect(expandedName).toBeGreaterThan(210);
    expect(
      Math.abs(totalHeaderWidth(canvasElement) - wideContainerWidth),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);

    // Shrink the container below the natural total: columns fall back to
    // their natural widths (declared 200 for Name) and the table scrolls.
    wrapperEl.style.width = "300px";
    await wait(350);
    expect(Math.abs(widthOf(canvasElement, "Name") - 200)).toBeLessThanOrEqual(WIDTH_TOLERANCE);
    expect(hasHorizontalScroll(canvasElement)).toBe(true);

    // Grow back: the exact same expanded widths return (scaling always starts
    // from the naturals, never from previously scaled widths).
    wrapperEl.style.width = "900px";
    await wait(350);
    expect(Math.abs(widthOf(canvasElement, "Name") - expandedName)).toBeLessThanOrEqual(3);
    expect(Math.abs(widthOf(canvasElement, "ID") - expandedId)).toBeLessThanOrEqual(3);
    expect(
      Math.abs(totalHeaderWidth(canvasElement) - containerWidthOf(canvasElement, 900)),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
    expect(hasHorizontalScroll(canvasElement)).toBe(false);
  },
};

// ============================================================================
// RESIZE — overflow and natural-width floors
// ============================================================================

/** Drag a column into overflow (past the neighbors' natural floors), then drag
 *  it back: the freed space first swallows the overflow, then refills the
 *  neighbors, ending exactly full again. */
export const AutoExpandDragIntoOverflowAndBack = {
  parameters: { tags: ["auto-width-expand-drag-overflow-back"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "a", label: "Alpha", width: 100, type: "string" },
      { accessor: "b", label: "Beta", width: 150, type: "string" },
      { accessor: "c", label: "Gamma", width: 150, type: "string" },
    ];
    const data = makeRows(15, (i) => ({ a: `a${i}`, b: `b${i}`, c: `c${i}` }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.a),
      height: "300px",
      autoExpandColumns: true,
      columnResizing: true,
    });
    wrapper.style.width = "700px";
    wrapper.style.boxSizing = "border-box";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const containerWidth = containerWidthOf(canvasElement, 700);

    // Phase 1: grow Alpha far past what Beta/Gamma can give up.
    const alphaHeader = findHeaderCellByLabel(canvasElement, "Alpha");
    expect(alphaHeader).toBeTruthy();
    await resizeColumnSlow(alphaHeader!, 500, 10, 25);
    await wait(200);

    // The extra growth overflowed into horizontal scroll.
    expect(horizontalOverflowOf(canvasElement)).toBeGreaterThan(250);

    // Scroll the (virtualized) neighbors into view: both floored at their
    // natural (declared) 150s, not at the 40px hard minimum.
    await scrollMainTo(canvasElement, bodyMainOf(canvasElement).scrollWidth);
    expect(widthOf(canvasElement, "Beta")).toBeGreaterThanOrEqual(148);
    expect(widthOf(canvasElement, "Beta")).toBeLessThanOrEqual(165);
    expect(widthOf(canvasElement, "Gamma")).toBeGreaterThanOrEqual(148);
    expect(widthOf(canvasElement, "Gamma")).toBeLessThanOrEqual(165);

    // Phase 2: drag Alpha back down by the same amount. Freed space first
    // eliminates the overflow, then regrows the neighbors to refill.
    await scrollMainTo(canvasElement, 0);
    const alphaAfterGrow = findHeaderCellByLabel(canvasElement, "Alpha");
    expect(alphaAfterGrow).toBeTruthy();
    await resizeColumnSlow(alphaAfterGrow!, -500, 10, 25);
    await waitForOverflowAtMost(canvasElement, 2);

    expect(horizontalOverflowOf(canvasElement)).toBeLessThanOrEqual(2);
    expect(
      Math.abs(totalHeaderWidth(canvasElement) - containerWidth),
    ).toBeLessThanOrEqual(RESIZE_TOLERANCE);
  },
};

/** During a drag, a `width: "auto"` neighbor gives up only its expanded
 *  surplus: it shrinks down to its measured content width and no further. */
export const AutoWidthNeighborFloorsAtMeasuredWidth = {
  parameters: { tags: ["auto-width-expand-neighbor-floor"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "name", label: "Name", width: 150, type: "string" },
      { accessor: "notes", label: "Notes", width: "auto", type: "string" },
      { accessor: "tail", label: "Tail", width: 100, type: "string" },
    ];
    const data = makeRows(20, (i) => ({
      name: `Name ${i}`,
      notes: `${longText} ${i}`,
      tail: `t${i}`,
    }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.name),
      height: "300px",
      autoExpandColumns: true,
      columnResizing: true,
    });
    wrapper.style.width = "1100px";
    wrapper.style.boxSizing = "border-box";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const containerWidth = containerWidthOf(canvasElement, 1100);

    // Grow Name by far more than the neighbors' expanded surplus.
    const nameHeader = findHeaderCellByLabel(canvasElement, "Name");
    expect(nameHeader).toBeTruthy();
    await resizeColumnSlow(nameHeader!, 600, 10, 25);
    await wait(200);

    // Growth past the floors overflowed into horizontal scroll.
    expect(horizontalOverflowOf(canvasElement)).toBeGreaterThan(100);

    // Scroll the (virtualized) neighbors into view.
    await scrollMainTo(canvasElement, bodyMainOf(canvasElement).scrollWidth);

    // The auto column floored at its measured content width (roughly 250–520
    // for `longText`), NOT at the 40px hard minimum.
    const notesWidth = widthOf(canvasElement, "Notes");
    expect(notesWidth).toBeGreaterThanOrEqual(250);
    expect(notesWidth).toBeLessThanOrEqual(530);
    // The fixed neighbor floored at its declared width.
    expect(widthOf(canvasElement, "Tail")).toBeGreaterThanOrEqual(98);
    expect(widthOf(canvasElement, "Tail")).toBeLessThanOrEqual(115);
  },
};

// ============================================================================
// MAX WIDTH — caps during expansion, surplus redistributes
// ============================================================================

/** During expansion, capped columns (including a measured auto column with
 *  maxWidth) stop at their cap; the surplus flows to the uncapped column. */
export const AutoWidthMaxWidthCapsExpansion = {
  parameters: { tags: ["auto-width-expand-maxwidth"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 100, maxWidth: 120, type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "notes", label: "Notes", width: "auto", maxWidth: 160, type: "string" },
    ];
    const data = makeRows(20, (i) => ({
      id: i + 1,
      name: `Name ${i}`,
      notes: `${longText} ${i}`,
    }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
      autoExpandColumns: true,
    });
    wrapper.style.width = "1200px";
    wrapper.style.boxSizing = "border-box";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const containerWidth = containerWidthOf(canvasElement, 1200);

    // Capped columns pinned at their maxWidth.
    const idWidth = widthOf(canvasElement, "ID");
    expect(idWidth).toBeGreaterThanOrEqual(115);
    expect(idWidth).toBeLessThanOrEqual(125);
    const notesWidth = widthOf(canvasElement, "Notes");
    expect(notesWidth).toBeGreaterThanOrEqual(150);
    expect(notesWidth).toBeLessThanOrEqual(170);

    // The uncapped column absorbs the redistributed surplus; table still full.
    expect(widthOf(canvasElement, "Name")).toBeGreaterThan(
      containerWidth - idWidth - notesWidth - 20,
    );
    expect(
      Math.abs(totalHeaderWidth(canvasElement) - containerWidth),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
  },
};

// ============================================================================
// PINNED — auto column in a pinned section
// ============================================================================

/** A pinned-left auto column keeps its compact measured width (pinned sections
 *  don't stretch); the main section expands to fill the remaining space. */
export const AutoWidthPinnedAutoColumn = {
  parameters: { tags: ["auto-width-expand-pinned"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "code", label: "Code", width: "auto", pinned: "left", type: "string" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 200, type: "string" },
    ];
    const data = makeRows(20, (i) => ({
      code: `CODE-${1000 + i}`,
      name: `Name ${i}`,
      city: `City ${i % 5}`,
    }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.code),
      height: "300px",
      autoExpandColumns: true,
    });
    wrapper.style.width = "800px";
    wrapper.style.boxSizing = "border-box";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const containerWidth = containerWidthOf(canvasElement, 800);

    // The pinned auto column sized to "CODE-10xx" content — compact.
    const codeWidth = widthOf(canvasElement, "Code");
    expect(codeWidth).toBeGreaterThan(40);
    expect(codeWidth).toBeLessThan(145);
    const pinnedLeft = canvasElement.querySelector(".st-header-pinned-left");
    expect(pinnedLeft?.contains(findHeaderCellByLabel(canvasElement, "Code")!)).toBe(true);

    // The main columns stretch to fill the rest of the container.
    const mainTotal = widthOf(canvasElement, "Name") + widthOf(canvasElement, "City");
    expect(Math.abs(mainTotal - (containerWidth - codeWidth))).toBeLessThanOrEqual(10);
    expect(hasHorizontalScroll(canvasElement)).toBe(false);
  },
};

// ============================================================================
// DYNAMIC — data update / pagination re-measure
// ============================================================================

/** A data update that grows the auto column's content past the container
 *  crosses from "expanded fill" into "natural widths + scroll". */
export const AutoWidthDataUpdateGrowsPastThreshold = {
  parameters: { tags: ["auto-width-expand-data-update"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "text", label: "Text", width: "auto", type: "string" },
      { accessor: "name", label: "Name", width: 250, type: "string" },
      { accessor: "city", label: "City", width: 250, type: "string" },
    ];
    const shortData = makeRows(20, (i) => ({
      id: i + 1,
      text: `s${i}`,
      name: `Name ${i}`,
      city: `City ${i % 5}`,
    }));
    const { wrapper, table } = renderVanillaTable(headers, shortData, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
      autoExpandColumns: true,
    });
    dataUpdateTable = table;
    wrapper.style.width = "700px";
    wrapper.style.boxSizing = "border-box";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const containerWidth = containerWidthOf(canvasElement, 700);

    // Short content: surplus, expanded fill, no scroll.
    expect(
      Math.abs(totalHeaderWidth(canvasElement) - containerWidth),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
    expect(hasHorizontalScroll(canvasElement)).toBe(false);

    // Swap in long content: the auto column re-measures and grows past the
    // container. Fixed columns return to their naturals; the table scrolls.
    dataUpdateTable!.update({
      rows: makeRows(20, (i) => ({
        id: i + 1,
        text: `${longText} ${i}`,
        name: `Name ${i}`,
        city: `City ${i % 5}`,
      })),
    });
    await wait(300);

    expect(widthOf(canvasElement, "Text")).toBeGreaterThan(250);
    expect(Math.abs(widthOf(canvasElement, "Name") - 250)).toBeLessThanOrEqual(WIDTH_TOLERANCE);
    expect(hasHorizontalScroll(canvasElement)).toBe(true);

    // The last column is virtualized out of view; scroll it in and verify it
    // is back at its natural width too.
    const bodyMain = bodyMainOf(canvasElement);
    await scrollMainTo(canvasElement, bodyMain.scrollWidth);
    expect(Math.abs(widthOf(canvasElement, "City") - 250)).toBeLessThanOrEqual(WIDTH_TOLERANCE);
  },
};

/** Pagination: each page re-measures the auto column against its own rows —
 *  a compact page fills the container, a long-content page overflows. */
export const AutoWidthPaginationRemeasuresPerPage = {
  parameters: { tags: ["auto-width-expand-pagination"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "text", label: "Text", width: "auto", type: "string" },
      { accessor: "name", label: "Name", width: 250, type: "string" },
      { accessor: "city", label: "City", width: 250, type: "string" },
    ];
    // Page 1 (rows 0-4): short text. Page 2 (rows 5-9): long text.
    const data = makeRows(10, (i) => ({
      id: i + 1,
      text: i < 5 ? `s${i}` : `${longText} ${i}`,
      name: `Name ${i}`,
      city: `City ${i % 5}`,
    }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "400px",
      autoExpandColumns: true,
      shouldPaginate: true,
      rowsPerPage: 5,
    });
    wrapper.style.width = "800px";
    wrapper.style.boxSizing = "border-box";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const containerWidth = containerWidthOf(canvasElement, 800);

    // Page 1: compact content -> expanded fill, no scroll.
    expect(
      Math.abs(totalHeaderWidth(canvasElement) - containerWidth),
    ).toBeLessThanOrEqual(WIDTH_TOLERANCE);
    expect(hasHorizontalScroll(canvasElement)).toBe(false);

    // Go to page 2: the auto column re-measures against the long rows.
    const footer = canvasElement.querySelector(".st-footer");
    expect(footer, "pagination footer should exist").toBeTruthy();
    const nextButton = footer!.querySelector<HTMLButtonElement>(
      'button[aria-label="Go to next page"]',
    );
    expect(nextButton, "next page button should exist").toBeTruthy();
    await userEvent.setup().click(nextButton!);
    await wait(500);

    // Page 2: long content -> natural widths exceed the container -> scroll,
    // and the fixed columns are back at their declared naturals (no squeeze).
    expect(widthOf(canvasElement, "Text")).toBeGreaterThan(250);
    expect(Math.abs(widthOf(canvasElement, "Name") - 250)).toBeLessThanOrEqual(WIDTH_TOLERANCE);
    expect(hasHorizontalScroll(canvasElement)).toBe(true);
  },
};

// ============================================================================
// DOUBLE-CLICK AUTO-FIT — expand-or-scroll model
// ============================================================================

/** Double-click auto-fit sets the column to its content width (its new natural
 *  width); the freed surplus flows to the neighbor and the table stays full. */
export const AutoWidthDoubleClickAutoFit = {
  parameters: { tags: ["auto-width-expand-double-click"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "notes", label: "Notes", width: 400, type: "string" },
      { accessor: "name", label: "Name", width: 150, type: "string" },
    ];
    // Notes content is short: auto-fit should shrink it well below 400.
    const data = makeRows(15, (i) => ({ notes: `n${i}`, name: `Name ${i}` }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.name),
      height: "300px",
      autoExpandColumns: true,
      columnResizing: true,
    });
    wrapper.style.width = "800px";
    wrapper.style.boxSizing = "border-box";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const containerWidth = containerWidthOf(canvasElement, 800);

    const notesBefore = widthOf(canvasElement, "Notes");
    expect(notesBefore).toBeGreaterThan(400); // expanded above its declared 400

    const notesHeader = findHeaderCellByLabel(canvasElement, "Notes");
    const handle = notesHeader!.querySelector<HTMLElement>(
      ".st-header-resize-handle-container",
    );
    expect(handle).toBeTruthy();
    handle!.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await wait(400);

    // Notes snapped to its content width (short content -> far below 400).
    const notesAfter = widthOf(canvasElement, "Notes");
    expect(notesAfter).toBeLessThan(300);

    // The freed space refilled the table: neighbor grew, total still full.
    expect(widthOf(canvasElement, "Name")).toBeGreaterThan(150);
    expect(
      Math.abs(totalHeaderWidth(canvasElement) - containerWidth),
    ).toBeLessThanOrEqual(RESIZE_TOLERANCE);
    expect(hasHorizontalScroll(canvasElement)).toBe(false);
  },
};
