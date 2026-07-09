/**
 * AUTO-SIZE COLUMNS TESTS
 *
 * Comprehensive coverage for content-fit columns (`width: "auto"`):
 * - shrink / grow, per-column `maxWidth` cap and `minWidth` floor
 * - `autoSizeMode: "header"`
 * - custom (vanilla) renderers, valueFormatter (incl. multi-line), valueGetter, chart columns
 * - outliers (single giant value clipped) vs. a legitimate wide minority (kept)
 * - very large datasets (50k rows) with bounded sampling
 * - re-fit on data change, sort stability, empty data, mixed/pinned layouts
 * - a no-flicker stability guard
 * - an exhaustive deterministic unit block for the sampling/percentile/outlier helpers
 *
 * Width assertions rely on real layout, so these run under the Storybook
 * test-runner (Playwright). The helper unit block is layout-independent.
 */

import { HeaderObject, SimpleTableVanilla } from "../../src/index";
import {
  buildHybridSampleIndices,
  percentileOf,
  selectContentWidthWithOutlierClip,
} from "../../src/utils/headerWidthUtils";
import { expect } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/46 - Auto-Size Columns",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tests for content-fit columns (width:'auto'): shrink/grow, maxWidth/minWidth, header-only mode, renderers, formatters, outliers, 50k rows, re-fit, and stability.",
      },
    },
  },
};

export default meta;

// ── Shared helpers ──────────────────────────────────────────────────────────

const makeRows = <T>(n: number, fn: (i: number) => T): T[] =>
  Array.from({ length: n }, (_, i) => fn(i));

const findHeaderCellByLabel = (canvasElement: HTMLElement, label: string): Element | null => {
  const headers = Array.from(canvasElement.querySelectorAll(".st-header-cell"));
  for (const header of headers) {
    const labelElement = header.querySelector(".st-header-label-text");
    if (labelElement?.textContent?.trim() === label) return header;
  }
  return null;
};

const widthOf = (canvasElement: HTMLElement, label: string): number => {
  const cell = findHeaderCellByLabel(canvasElement, label);
  return cell ? cell.getBoundingClientRect().width : 0;
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Read a column width twice across a delay; used to assert there is no post-paint snap. */
const stableWidth = async (
  canvasElement: HTMLElement,
  label: string,
): Promise<{ first: number; second: number }> => {
  const first = widthOf(canvasElement, label);
  await wait(150);
  const second = widthOf(canvasElement, label);
  return { first, second };
};

const longText =
  "This is a very long cell value that should make a content-fit column grow much wider than the header label";

// Module-level handles so play() can drive update()/sort on the mounted table.
let refitTable: SimpleTableVanilla | null = null;
let sortTable: SimpleTableVanilla | null = null;
let sortReserveTable: SimpleTableVanilla | null = null;
let truncationTable: SimpleTableVanilla | null = null;
let truncationFill: (() => void) | null = null;
let emptyHeaderTable: SimpleTableVanilla | null = null;
let emptyHeaderFill: (() => void) | null = null;

// ============================================================================
// CORRECTNESS — shrink / grow / cap / floor / mode
// ============================================================================

export const AutoWidthShrinksNarrowColumn = {
  parameters: { tags: ["auto-size-shrink"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: "auto", type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
    ];
    const data = makeRows(30, (i) => ({ id: i + 1, name: `Row ${i + 1}` }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const idWidth = widthOf(canvasElement, "ID");
    expect(idWidth).toBeGreaterThan(0);
    expect(idWidth).toBeLessThan(120);
  },
};

export const AutoWidthGrowsForLongContent = {
  parameters: { tags: ["auto-size-grow"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "notes", label: "Notes", width: "auto", type: "string" },
    ];
    const data = makeRows(30, (i) => ({ id: i + 1, notes: `${longText} ${i}` }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const notesWidth = widthOf(canvasElement, "Notes");
    expect(notesWidth).toBeGreaterThan(250);
    expect(notesWidth).toBeLessThan(520); // global cap (500) + buffer
  },
};

export const AutoWidthRespectsMaxWidth = {
  parameters: { tags: ["auto-size-maxwidth"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "comment", label: "Comment", width: "auto", maxWidth: 160, type: "string" },
    ];
    const data = makeRows(30, (i) => ({ id: i + 1, comment: `${longText} ${i}` }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const commentWidth = widthOf(canvasElement, "Comment");
    expect(commentWidth).toBeGreaterThan(120);
    expect(commentWidth).toBeLessThanOrEqual(170); // 160 cap + small buffer
  },
};

export const AutoWidthRespectsMinWidth = {
  parameters: { tags: ["auto-size-minwidth"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "x", label: "X", width: "auto", minWidth: 180, type: "number" },
      { accessor: "name", label: "Name", width: 160, type: "string" },
    ];
    // Tiny content that would otherwise fit in ~40px; minWidth must floor it.
    const data = makeRows(30, (i) => ({ x: i % 9, name: `Row ${i}` }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.x) + "-" + Math.random(),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const xWidth = widthOf(canvasElement, "X");
    expect(xWidth).toBeGreaterThanOrEqual(178); // 180 floor (allow sub-px rounding)
  },
};

export const AutoSizeHeaderModeIgnoresCells = {
  parameters: { tags: ["auto-size-header-mode"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "description",
        label: "Desc",
        width: "auto",
        autoSizeMode: "header",
        type: "string",
      },
    ];
    const data = makeRows(30, (i) => ({ id: i + 1, description: longText }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const descWidth = widthOf(canvasElement, "Desc");
    expect(descWidth).toBeGreaterThan(0);
    expect(descWidth).toBeLessThan(140); // fits "Desc", ignores long cells
  },
};

// ============================================================================
// CORRECTNESS — renderers / formatters / chart
// ============================================================================

export const AutoSizeMeasuresCustomRenderer = {
  parameters: { tags: ["auto-size-custom-renderer"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "status",
        label: "Status",
        width: "auto",
        type: "string",
        cellRenderer: ({ value }) => {
          const badge = document.createElement("span");
          badge.style.display = "inline-block";
          badge.style.width = "240px"; // wider than text or header
          badge.style.whiteSpace = "nowrap";
          badge.textContent = String(value);
          return badge;
        },
      },
    ];
    const data = makeRows(30, (i) => ({ id: i + 1, status: "ok" }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const statusWidth = widthOf(canvasElement, "Status");
    expect(statusWidth).toBeGreaterThan(220);
  },
};

export const AutoSizeMeasuresCustomHeaderRenderer = {
  parameters: { tags: ["auto-size-custom-header-renderer"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "state",
        label: "State",
        width: "auto",
        type: "string",
        // Custom header markup wider than both the label text and the cells;
        // the generic label measurement must pick it up.
        headerRenderer: () => {
          const el = document.createElement("div");
          el.style.display = "inline-block";
          el.style.width = "260px";
          el.style.whiteSpace = "nowrap";
          el.textContent = "Custom header";
          return el;
        },
      },
    ];
    const data = makeRows(30, (i) => ({ id: i + 1, state: "ok" }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // Custom headers have no .st-header-label-text span; find the cell by id.
    const cell = canvasElement.querySelector('[id="header-state"]');
    expect(cell).toBeTruthy();
    const stateWidth = cell!.getBoundingClientRect().width;
    // Must fit the 260px custom markup (cells are "ok" -> tiny).
    expect(stateWidth).toBeGreaterThan(250);
  },
};

export const AutoSizeSortIconDoesNotTruncateLabel = {
  parameters: { tags: ["auto-size-sort-icon-reserve"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "name",
        label: "Employee Full Name",
        width: "auto",
        type: "string",
        isSortable: true,
      },
    ];
    // Short cells so the header label (plus reserved sort icon space) defines
    // the column width.
    const data = makeRows(30, (i) => ({ id: i + 1, name: `n${i}` }));
    const { wrapper, table } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    sortReserveTable = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const before = widthOf(canvasElement, "Employee Full Name");
    expect(before).toBeGreaterThan(0);

    // Sorting makes the sort icon appear; the fit already reserved space for
    // it, so the width stays stable AND the label is not pushed into ellipsis.
    await sortReserveTable!.getAPI().applySortState({ accessor: "name", direction: "asc" });
    await wait(200);

    const after = widthOf(canvasElement, "Employee Full Name");
    expect(Math.abs(after - before)).toBeLessThan(2);

    const cell = findHeaderCellByLabel(canvasElement, "Employee Full Name");
    const textSpan = cell!.querySelector(".st-header-label-text") as HTMLElement;
    expect(textSpan.scrollWidth).toBeLessThanOrEqual(textSpan.clientWidth + 1);
  },
};

export const AutoSizeMeasuresFormattedValue = {
  parameters: { tags: ["auto-size-formatter"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "amount",
        label: "Amt",
        width: "auto",
        type: "number",
        valueFormatter: ({ value }) => `$${Number(value).toLocaleString()}.00`,
      },
    ];
    // Large numbers -> long formatted strings ("$9,999,999.00").
    const data = makeRows(30, (i) => ({ id: i + 1, amount: 9_000_000 + i }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // "$9,000,029.00" is ~13 chars; must fit the formatted text, not the raw number.
    const amtWidth = widthOf(canvasElement, "Amt");
    expect(amtWidth).toBeGreaterThan(95);
  },
};

/**
 * valueFormatter may return explicit multi-line text (e.g. an address). When the
 * cell is allowed to wrap (`white-space: pre-line`), auto-size must fit the
 * longest line — not the full string measured as one nowrap run (newlines
 * collapse to spaces under `white-space: nowrap` measurement).
 */
export const AutoSizeMultilineFormattedValueUsesLongestLine = {
  parameters: { tags: ["auto-size-formatter-multiline"] },
  render: () => {
    const shortLine = "HQ";
    const longestLine = "Building 12";
    // Concatenated single-line width is much larger than the longest line alone.
    const multiline = [shortLine, longestLine, "Floor 3", "Suite 400"].join("\n");

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      {
        accessor: "address",
        label: "Addr",
        width: "auto",
        type: "string",
        valueFormatter: () => multiline,
      },
    ];
    const data = makeRows(20, (i) => ({ id: i + 1, address: "raw" }));
    // Four wrapped lines (~14px font) need ~96px so nothing is clipped.
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "420px",
      customTheme: { rowHeight: 96 },
    });

    // Match the consumer setup where formatted newlines are allowed to wrap.
    const style = document.createElement("style");
    style.textContent = `
      .simple-table-root .st-cell-content {
        white-space: pre-line;
        text-overflow: clip;
        align-items: flex-start;
        line-height: 1.35;
      }
    `;
    wrapper.appendChild(style);
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await wait(50);

    const addrWidth = widthOf(canvasElement, "Addr");
    expect(addrWidth).toBeGreaterThan(0);

    // Reference widths: longest line alone vs. the full string as one nowrap run.
    const measure = (text: string, whiteSpace: string): number => {
      const el = document.createElement("div");
      el.style.visibility = "hidden";
      el.style.position = "absolute";
      el.style.whiteSpace = whiteSpace as any;
      el.style.display = "inline-block";
      el.style.font = "14px Nunito, sans-serif";
      el.textContent = text;
      document.body.appendChild(el);
      const w = el.offsetWidth;
      document.body.removeChild(el);
      return w;
    };

    const multiline = ["HQ", "Building 12", "Floor 3", "Suite 400"].join("\n");
    const longestLineWidth = measure("Building 12", "nowrap");
    const fullNowrapWidth = measure(multiline, "nowrap");

    // Sanity: the buggy nowrap-of-full-string path is meaningfully wider.
    expect(fullNowrapWidth).toBeGreaterThan(longestLineWidth + 40);

    // Column must track the longest line (plus cell padding / buffer), not the
    // collapsed full-string width. Allow generous padding slack for theme fonts.
    expect(addrWidth).toBeLessThan(longestLineWidth + 80);
    expect(addrWidth).toBeLessThan(fullNowrapWidth - 20);
    expect(addrWidth).toBeGreaterThan(longestLineWidth - 5);
  },
};

export const AutoSizeMeasuresValueGetter = {
  parameters: { tags: ["auto-size-valuegetter"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "score",
        label: "Score",
        width: "auto",
        type: "string",
        valueGetter: ({ row }) =>
          `Score ${(row as any).score} of 100 — performance rating computed`,
      },
    ];
    const data = makeRows(30, (i) => ({ id: i + 1, score: (i % 100) + 1 }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // Derived string is long -> column grows well beyond the plain number width.
    const scoreWidth = widthOf(canvasElement, "Score");
    expect(scoreWidth).toBeGreaterThan(200);
  },
};

export const AutoSizeChartColumnUsesChartMinimum = {
  parameters: { tags: ["auto-size-chart"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 60, type: "number" },
      { accessor: "trend", label: "Trend", width: "auto", type: "lineAreaChart" },
    ];
    const data = makeRows(20, (i) => ({ id: i + 1, trend: [i, i + 5, i + 2, i + 9, i + 3] }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // Chart columns skip cell sampling and use the chart minimum (~150px).
    const trendWidth = widthOf(canvasElement, "Trend");
    expect(trendWidth).toBeGreaterThanOrEqual(140);
    expect(trendWidth).toBeLessThan(220);
    expect(canvasElement.querySelectorAll(".st-line-area-chart").length).toBeGreaterThan(0);
  },
};

// ============================================================================
// OUTLIERS — clip the rogue, keep the legitimate minority
// ============================================================================

export const AutoSizeClipsSingleOutlier = {
  parameters: { tags: ["auto-size-outlier-single"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "amount", label: "Amount", width: "auto", type: "string" },
    ];
    // 200 short values + a single rogue sentence near the top (so it IS sampled).
    const data = makeRows(200, (i) => ({
      id: i + 1,
      amount: i === 10 ? longText.repeat(4) : String((i % 90) + 10),
    }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // The single huge outlier must NOT define the column.
    const amountWidth = widthOf(canvasElement, "Amount");
    expect(amountWidth).toBeGreaterThan(0);
    expect(amountWidth).toBeLessThan(200);
  },
};

export const AutoSizeKeepsLegitimateWideMinority = {
  parameters: { tags: ["auto-size-outlier-minority"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "label", label: "Label", width: "auto", type: "string" },
    ];
    // ~25% of rows are genuinely long -> above the p95 tail, so they are NOT
    // treated as outliers and the column must accommodate them.
    const data = makeRows(120, (i) => ({
      id: i + 1,
      label: i % 4 === 0 ? `${longText} ${i}` : `Short ${i}`,
    }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // A 25% wide minority is legitimate data -> column grows to fit it.
    const labelWidth = widthOf(canvasElement, "Label");
    expect(labelWidth).toBeGreaterThan(250);
  },
};

export const AutoSizeClipsFewOutliers = {
  parameters: { tags: ["auto-size-outlier-few"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "value", label: "Value", width: "auto", type: "string" },
    ];
    // Two huge values near the top among 300 short rows -> the tiny tail sits
    // well below the p95 boundary, so the column stays compact (clipped).
    const data = makeRows(300, (i) => ({
      id: i + 1,
      value: i < 2 ? longText.repeat(3) : String((i % 80) + 10),
    }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const valueWidth = widthOf(canvasElement, "Value");
    expect(valueWidth).toBeGreaterThan(0);
    expect(valueWidth).toBeLessThan(200);
  },
};

// ============================================================================
// LARGE DATASETS — bounded sampling, no hang
// ============================================================================

export const AutoSize50kUniformShort = {
  parameters: { tags: ["auto-size-50k-short"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: "auto", type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
    ];
    const data = makeRows(50_000, (i) => ({ id: i + 1, name: `Row ${i + 1}` }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "400px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const start = performance.now();
    await waitForTable();
    const idWidth = widthOf(canvasElement, "ID");
    const elapsed = performance.now() - start;
    // eslint-disable-next-line no-console
    console.info(
      `[auto-size] 50k uniform: width=${idWidth.toFixed(1)} settled in ${elapsed.toFixed(0)}ms`,
    );
    // Numeric ids (up to 50000) stay compact even with 50k rows.
    expect(idWidth).toBeGreaterThan(0);
    expect(idWidth).toBeLessThan(140);
    // Table actually mounted (didn't hang).
    expect(canvasElement.querySelectorAll(".st-cell").length).toBeGreaterThan(0);
  },
};

export const AutoSize50kDeepOutlierStaysCompact = {
  parameters: { tags: ["auto-size-50k-deep-outlier"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "value", label: "Value", width: "auto", type: "string" },
    ];
    // 50k short values, one giant value buried deep at index 40000. Sampling is
    // bounded (~100 rows) so it should stay compact; even if sampled it would be
    // clipped as an outlier. Either way: compact.
    const data = makeRows(50_000, (i) => ({
      id: i + 1,
      value: i === 40_000 ? longText.repeat(6) : String((i % 50) + 1),
    }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "400px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const valueWidth = widthOf(canvasElement, "Value");
    expect(valueWidth).toBeGreaterThan(0);
    expect(valueWidth).toBeLessThan(160);
  },
};

export const AutoSize50kWidespreadLongGrows = {
  parameters: { tags: ["auto-size-50k-long"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "blurb", label: "Blurb", width: "auto", maxWidth: 360, type: "string" },
    ];
    const data = makeRows(50_000, (i) => ({ id: i + 1, blurb: `${longText} #${i}` }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "400px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const start = performance.now();
    await waitForTable();
    const blurbWidth = widthOf(canvasElement, "Blurb");
    const elapsed = performance.now() - start;
    // eslint-disable-next-line no-console
    console.info(
      `[auto-size] 50k long: width=${blurbWidth.toFixed(1)} settled in ${elapsed.toFixed(0)}ms`,
    );
    // Widespread long content -> grows toward the cap (360).
    expect(blurbWidth).toBeGreaterThan(250);
    expect(blurbWidth).toBeLessThanOrEqual(370);
  },
};

// ============================================================================
// DYNAMIC — re-fit on data change, sort stability, empty, no-flicker
// ============================================================================

export const AutoSizeRefitsOnDataChange = {
  parameters: { tags: ["auto-size-refit"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "text", label: "Text", width: "auto", type: "string" },
    ];
    const shortData = makeRows(30, (i) => ({ id: i + 1, text: `s${i}` }));
    const { wrapper, table } = renderVanillaTable(headers, shortData, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    refitTable = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const initial = widthOf(canvasElement, "Text");
    expect(initial).toBeLessThan(150);

    // Swap in long data -> column should grow.
    refitTable!.update({
      rows: makeRows(30, (i) => ({ id: i + 1, text: `${longText} ${i}` })),
    });
    await wait(250);
    const grown = widthOf(canvasElement, "Text");
    expect(grown).toBeGreaterThan(initial + 80);

    // Swap back to short -> column should shrink again.
    refitTable!.update({ rows: makeRows(30, (i) => ({ id: i + 1, text: `s${i}` })) });
    await wait(250);
    const shrunk = widthOf(canvasElement, "Text");
    expect(shrunk).toBeLessThan(grown - 80);
  },
};

export const AutoSizeStableAcrossSort = {
  parameters: { tags: ["auto-size-sort-stable"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "name", label: "Name", width: "auto", type: "string", isSortable: true },
    ];
    const data = makeRows(40, (i) => ({ id: i + 1, name: `Person ${String(i).padStart(2, "0")}` }));
    const { wrapper, table } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    sortTable = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const before = widthOf(canvasElement, "Name");
    expect(before).toBeGreaterThan(0);

    await sortTable!.getAPI().applySortState({ accessor: "name", direction: "desc" });
    await wait(200);
    const afterDesc = widthOf(canvasElement, "Name");

    await sortTable!.getAPI().applySortState({ accessor: "name", direction: "asc" });
    await wait(200);
    const afterAsc = widthOf(canvasElement, "Name");

    // Sorting reorders rows but content set is identical -> width must not jitter.
    expect(Math.abs(afterDesc - before)).toBeLessThan(2);
    expect(Math.abs(afterAsc - before)).toBeLessThan(2);
  },
};

export const AutoSizeEmptyDataFitsHeader = {
  parameters: { tags: ["auto-size-empty"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "description", label: "Description", width: "auto", type: "string" },
    ];
    const { wrapper } = renderVanillaTable(headers, [], {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // No rows -> size to the header label "Description".
    const descWidth = widthOf(canvasElement, "Description");
    expect(descWidth).toBeGreaterThan(40);
    expect(descWidth).toBeLessThan(180);
  },
};

export const AutoSizeMixedColumnsLayout = {
  parameters: { tags: ["auto-size-mixed"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: "auto", type: "number" },
      { accessor: "name", label: "Name", width: "auto", type: "string" },
      { accessor: "score", label: "Score", width: 120, type: "number" },
      { accessor: "filler", label: "Filler", width: "1fr", type: "string" },
    ];
    const data = makeRows(40, (i) => ({
      id: i + 1,
      name: `Person ${i}`,
      score: i * 3,
      filler: "x",
    }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const idCell = findHeaderCellByLabel(canvasElement, "ID");
    const nameCell = findHeaderCellByLabel(canvasElement, "Name");
    const scoreCell = findHeaderCellByLabel(canvasElement, "Score");
    expect(idCell && nameCell && scoreCell).toBeTruthy();

    const idRect = idCell!.getBoundingClientRect();
    const nameRect = nameCell!.getBoundingClientRect();
    const scoreRect = scoreCell!.getBoundingClientRect();

    // Each auto column sized to its own content (id narrow, name wider).
    expect(idRect.width).toBeLessThan(100);
    expect(nameRect.width).toBeGreaterThan(idRect.width);
    // Adjacent, non-overlapping, cumulative left positions.
    expect(nameRect.left).toBeGreaterThanOrEqual(idRect.right - 2);
    expect(scoreRect.left).toBeGreaterThanOrEqual(nameRect.right - 2);
    // Fixed column keeps its width.
    expect(Math.abs(scoreRect.width - 120)).toBeLessThan(3);
  },
};

export const AutoSizePinnedColumn = {
  parameters: { tags: ["auto-size-pinned"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "code", label: "Code", width: "auto", pinned: "left", type: "string" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
      { accessor: "city", label: "City", width: 200, type: "string" },
      { accessor: "country", label: "Country", width: 200, type: "string" },
    ];
    const data = makeRows(40, (i) => ({
      code: `CODE-${1000 + i}`,
      name: `Name ${i}`,
      city: `City ${i}`,
      country: `Country ${i}`,
    }));
    const { wrapper, tableContainer } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.code),
      height: "300px",
    });
    tableContainer.style.width = "400px";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const codeCell = findHeaderCellByLabel(canvasElement, "Code");
    expect(codeCell).toBeTruthy();
    // Sized to "CODE-1039" content (compact, not the 150 default region).
    const codeWidth = codeCell!.getBoundingClientRect().width;
    expect(codeWidth).toBeGreaterThan(40);
    expect(codeWidth).toBeLessThan(140);
    // Still in the pinned-left section.
    const pinnedLeft = canvasElement.querySelector(".st-header-pinned-left");
    expect(pinnedLeft?.contains(codeCell!)).toBe(true);
  },
};

export const AutoSizeNoFlicker = {
  parameters: { tags: ["auto-size-no-flicker"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "notes", label: "Notes", width: "auto", type: "string" },
    ];
    const data = makeRows(60, (i) => ({ id: i + 1, notes: `${longText} ${i}` }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const { first, second } = await stableWidth(canvasElement, "Notes");
    // Auto-size resolves before paint, so the width is already settled and does
    // not change afterwards (no provisional-width snap).
    expect(first).toBeGreaterThan(250);
    expect(Math.abs(first - second)).toBeLessThan(1);
  },
};

// ============================================================================
// ASYNC RENDERERS / TRUNCATION — measurement must not depend on live-cell CSS
// ============================================================================

/**
 * Simulates the React adapter's portal flow at the core level: the renderer
 * returns an (initially empty) container that is filled asynchronously, after
 * which the host calls `refitAutoSizeColumns()` — exactly what the React
 * SimpleTable wrapper does once portals mount.
 */
const makeAsyncRenderer = (
  buildContent: (value: string) => HTMLElement,
): {
  cellRenderer: (props: { value: unknown }) => HTMLElement;
  fill: () => void;
} => {
  const pending: Array<{ el: HTMLElement; value: string }> = [];
  let mounted = false;
  const fillContainer = (el: HTMLElement, value: string) => {
    if (el.childNodes.length === 0) {
      el.appendChild(buildContent(value));
    }
  };
  return {
    cellRenderer: ({ value }) => {
      const container = document.createElement("div");
      container.style.display = "contents";
      if (mounted) {
        // After the simulated portal mount, React fills any newly registered
        // container on its next commit (e.g. cells recreated when rows scroll
        // back into the virtualization band). Emulate that async commit.
        queueMicrotask(() => fillContainer(container, String(value)));
      } else {
        pending.push({ el: container, value: String(value) });
      }
      return container;
    },
    fill: () => {
      mounted = true;
      for (const { el, value } of pending) {
        fillContainer(el, value);
      }
    },
  };
};

export const AutoSizeAsyncRendererInternalTruncation = {
  parameters: { tags: ["auto-size-async-renderer-truncation"] },
  render: () => {
    // The mounted content uses the common "truncate" pattern: a fixed-width
    // part that never shrinks plus a min-width:0 / overflow:hidden text span.
    // The content therefore NEVER overflows its cell (it truncates itself), so
    // a scrollWidth>clientWidth check can never see its true content width —
    // the width must come from measuring the content unconstrained.
    const buildContent = (value: string): HTMLElement => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      // The row is itself a flex item of .st-cell-content; min-width:0 is
      // required at EVERY flex nesting level for truncation to engage
      // (otherwise the row keeps its natural width and gets hard-clipped).
      row.style.minWidth = "0";

      const badge = document.createElement("span");
      badge.className = "fixed-badge";
      badge.style.flex = "0 0 140px";
      badge.style.height = "10px";
      badge.style.background = "#cbd5e1";

      const text = document.createElement("span");
      text.className = "trunc-text";
      text.style.minWidth = "0";
      text.style.overflow = "hidden";
      text.style.textOverflow = "ellipsis";
      text.style.whiteSpace = "nowrap";
      text.textContent = value;

      row.appendChild(badge);
      row.appendChild(text);
      return row;
    };

    const { cellRenderer, fill } = makeAsyncRenderer(buildContent);
    truncationFill = fill;

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "status",
        label: "Status",
        width: "auto",
        type: "string",
        cellRenderer: cellRenderer,
      },
      {
        // Same renderer but capped: the column stops at maxWidth, so the
        // renderer's internal truncation kicks in (visible ellipsis) while the
        // uncapped column above still fits its content exactly. This is the
        // "minimize clipping, truncate past maxWidth" combination.
        accessor: "note",
        label: "Capped",
        width: "auto",
        maxWidth: 220,
        type: "string",
        cellRenderer: cellRenderer,
      },
    ];
    const data = makeRows(30, (i) => ({
      id: i + 1,
      status: "Very long status text value",
      note: "This note is far too long to ever fit inside the capped column",
    }));
    const { wrapper, table } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    truncationTable = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Async content mounts (like React portals), then the host re-fits.
    truncationFill!();
    truncationTable!.refitAutoSizeColumns();
    await wait(250);

    // The uncapped column must fit the REAL renderer output (140px badge +
    // full text), not just the formatted text fallback — even though the live
    // cells truncate internally and never overflow. Nothing should be
    // truncated here: the whole point of width:"auto" is minimizing clipping.
    const statusWidth = widthOf(canvasElement, "Status");
    expect(statusWidth).toBeGreaterThan(250);
    expect(statusWidth).toBeLessThan(450);

    // The badge must actually be visible in the rendered cells (content is
    // mounted, not just measured).
    expect(canvasElement.querySelectorAll(".fixed-badge").length).toBeGreaterThan(0);

    // The capped column stops at its maxWidth (220 + small buffer)…
    const cappedWidth = widthOf(canvasElement, "Capped");
    expect(cappedWidth).toBeGreaterThan(180);
    expect(cappedWidth).toBeLessThanOrEqual(232);

    // …and its content visibly truncates: the text span is clipped (ellipsis)
    // because the content is wider than the capped column.
    const cappedText = canvasElement.querySelector(
      '.st-cell[data-accessor="note"] .trunc-text',
    ) as HTMLElement;
    expect(cappedText).toBeTruthy();
    expect(cappedText.scrollWidth).toBeGreaterThan(cappedText.clientWidth + 1);
  },
};

// ============================================================================
// CONTAINER INDEPENDENCE — same data => same auto width in any container
// ============================================================================

export const AutoSizeConsistentAcrossContainerWidths = {
  parameters: { tags: ["auto-size-container-independent"] },
  render: () => {
    // Two tables with identical data/columns but very different container
    // widths. In the narrow container the trailing auto column starts outside
    // the column-virtualization band (600px of fixed columns before it), so a
    // DOM-dependent measurement would fall back to the 150px default there.
    const outer = document.createElement("div");

    const build = (suffix: string, containerWidth: string) => {
      const headers: HeaderObject[] = [
        { accessor: `id${suffix}`, label: "ID", width: "auto", type: "number" },
        { accessor: `name${suffix}`, label: "Name", width: 200, type: "string" },
        { accessor: `city${suffix}`, label: "City", width: 200, type: "string" },
        { accessor: `country${suffix}`, label: "Country", width: 200, type: "string" },
        { accessor: `notes${suffix}`, label: "Notes", width: "auto", type: "string" },
      ];
      const data = makeRows(30, (i) => ({
        [`id${suffix}`]: i + 1,
        [`name${suffix}`]: `Name ${i}`,
        [`city${suffix}`]: `City ${i}`,
        [`country${suffix}`]: `Country ${i}`,
        [`notes${suffix}`]: `Content-based width sample row number ${i % 10}`,
      }));
      const { wrapper, tableContainer } = renderVanillaTable(headers, data, {
        getRowId: (params: any) => String(params.row[`id${suffix}`]),
        height: "300px",
      });
      tableContainer.style.width = containerWidth;
      wrapper.classList.add(`container-${suffix}`);
      outer.appendChild(wrapper);
      return wrapper;
    };

    build("A", "1200px");
    build("B", "360px");
    return outer;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await wait(200);

    const scopedWidthOf = (scope: Element, label: string): number => {
      const headers = Array.from(scope.querySelectorAll(".st-header-cell"));
      for (const header of headers) {
        const labelElement = header.querySelector(".st-header-label-text");
        if (labelElement?.textContent?.trim() === label) {
          return header.getBoundingClientRect().width;
        }
      }
      return 0;
    };

    const wide = canvasElement.querySelector(".container-A")!;
    const narrow = canvasElement.querySelector(".container-B")!;

    const wideNotes = scopedWidthOf(wide, "Notes");
    expect(wideNotes).toBeGreaterThan(200);

    // Bring the narrow table's Notes column into view so its header renders.
    const narrowBody = narrow.querySelector(".st-body-main") as HTMLElement;
    narrowBody.scrollLeft = narrowBody.scrollWidth;
    narrowBody.dispatchEvent(new Event("scroll", { bubbles: true }));
    await wait(300);

    const narrowNotes = scopedWidthOf(narrow, "Notes");
    expect(narrowNotes).toBeGreaterThan(200);

    // Same content => same computed width, regardless of container width.
    expect(Math.abs(wideNotes - narrowNotes)).toBeLessThan(3);
  },
};

// ============================================================================
// EMPTY STATE + ASYNC CUSTOM HEADER — must fall back to the label width
// ============================================================================

export const AutoSizeEmptyStateAsyncHeaderRenderer = {
  parameters: { tags: ["auto-size-empty-custom-header"] },
  render: () => {
    // Simulates a React headerRenderer: the label element receives an empty
    // portal container at render time; the real markup mounts asynchronously.
    // With no rows to measure, a naive measurement of the empty container
    // collapses the column to the minimum width.
    const pending: HTMLElement[] = [];
    emptyHeaderFill = () => {
      for (const el of pending) {
        if (el.childNodes.length === 0) {
          const span = document.createElement("span");
          span.style.whiteSpace = "nowrap";
          span.textContent = "Description Column";
          el.appendChild(span);
        }
      }
    };

    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      {
        accessor: "description",
        label: "Description Column",
        width: "auto",
        type: "string",
        headerRenderer: () => {
          const container = document.createElement("div");
          pending.push(container);
          return container;
        },
      },
    ];
    const { wrapper, table } = renderVanillaTable(headers, [], {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    emptyHeaderTable = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Custom headers have no .st-header-label-text span; find the cell by id.
    const cell = canvasElement.querySelector('[id="header-description"]');
    expect(cell).toBeTruthy();

    // Even before the async header content mounts, the column must fit the
    // header LABEL (the fallback), not collapse to the 40px minimum.
    const initialWidth = cell!.getBoundingClientRect().width;
    expect(initialWidth).toBeGreaterThan(120);
    expect(initialWidth).toBeLessThan(320);

    // Async header content mounts, host re-fits (React adapter flow): the
    // column must stay readable.
    emptyHeaderFill!();
    emptyHeaderTable!.refitAutoSizeColumns();
    await wait(250);

    const cellAfter = canvasElement.querySelector('[id="header-description"]');
    const afterWidth = cellAfter!.getBoundingClientRect().width;
    expect(afterWidth).toBeGreaterThan(120);
    expect(afterWidth).toBeLessThan(320);
  },
};

// ============================================================================
// COLLAPSE ICON — reserve space like the sort icon so labels don't ellipsize
// ============================================================================

export const AutoSizeCollapsibleHeaderReservesIconWidth = {
  parameters: { tags: ["auto-size-collapse-icon-reserve"] },
  render: () => {
    // Push the collapsible auto column past the initial virtualization band so
    // its header cell (and collapse icon) are not in the DOM during the first
    // measure. Sort icons are reserved without a rendered cell; collapse icons
    // must be too, or the label truncates once the column scrolls into view.
    const headers: HeaderObject[] = [
      { accessor: "pad1", label: "Pad One", width: 200, type: "string" },
      { accessor: "pad2", label: "Pad Two", width: 200, type: "string" },
      { accessor: "pad3", label: "Pad Three", width: 200, type: "string" },
      {
        accessor: "metrics",
        label: "Quarterly Performance Metrics",
        width: "auto",
        autoSizeMode: "header",
        type: "string",
        collapsible: true,
        singleRowChildren: true,
        children: [
          { accessor: "q1", label: "Q1", width: 60, type: "number", showWhen: "parentExpanded" },
          { accessor: "q2", label: "Q2", width: 60, type: "number", showWhen: "parentExpanded" },
        ],
      },
    ];
    const data = makeRows(20, (i) => ({
      pad1: `p1-${i}`,
      pad2: `p2-${i}`,
      pad3: `p3-${i}`,
      metrics: `m${i}`,
      q1: i,
      q2: i * 2,
    }));
    const { wrapper, tableContainer } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.pad1),
      height: "300px",
    });
    tableContainer.style.width = "360px";
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await wait(100);

    const bodyMain = canvasElement.querySelector(".st-body-main") as HTMLElement;
    bodyMain.scrollLeft = bodyMain.scrollWidth;
    bodyMain.dispatchEvent(new Event("scroll", { bubbles: true }));
    await wait(300);

    const cell = canvasElement.querySelector(
      '.st-header-cell[data-accessor="metrics"]',
    ) as HTMLElement | null;
    expect(cell, "metrics header should render after scroll").toBeTruthy();

    const collapseIcon = cell!.querySelector(".st-collapsible-header-icon") as HTMLElement | null;
    expect(collapseIcon, "collapse/expand icon should be present").toBeTruthy();

    const textSpan = cell!.querySelector(".st-header-label-text") as HTMLElement;
    expect(textSpan).toBeTruthy();
    // Label must not be pushed into ellipsis by the collapse icon — even though
    // the icon was absent from the DOM when the column was first measured.
    expect(textSpan.scrollWidth).toBeLessThanOrEqual(textSpan.clientWidth + 1);

    expect(cell!.getBoundingClientRect().width).toBeGreaterThan(180);
  },
};

export const AutoSizeLongHeaderConsistentAcrossContainerWidths = {
  parameters: { tags: ["auto-size-long-header-container-independent"] },
  render: () => {
    // Long header labels with short cells. Both containers need horizontal
    // scroll (total natural width > container). Widths must still match —
    // auto-size must not under-measure when columns start virtualized out.
    const outer = document.createElement("div");
    const longLabel = "Employee Department Assignment Code";

    const build = (suffix: string, containerWidth: string) => {
      const headers: HeaderObject[] = [
        {
          accessor: `a${suffix}`,
          label: "Alpha Column One",
          width: "auto",
          autoSizeMode: "header",
          type: "string",
        },
        {
          accessor: `b${suffix}`,
          label: "Beta Column Two Name",
          width: "auto",
          autoSizeMode: "header",
          type: "string",
        },
        {
          accessor: `c${suffix}`,
          label: "Gamma Column Three Title",
          width: "auto",
          autoSizeMode: "header",
          type: "string",
        },
        {
          accessor: `d${suffix}`,
          label: longLabel,
          width: "auto",
          autoSizeMode: "header",
          type: "string",
          isSortable: true,
          collapsible: true,
          singleRowChildren: true,
          children: [
            {
              accessor: `dChild${suffix}`,
              label: "Sub",
              width: 50,
              type: "string",
              showWhen: "parentExpanded",
            },
          ],
        },
        {
          accessor: `e${suffix}`,
          label: "Epsilon Column Five Label",
          width: "auto",
          autoSizeMode: "header",
          type: "string",
        },
        {
          accessor: `f${suffix}`,
          label: "Zeta Column Six Heading",
          width: "auto",
          autoSizeMode: "header",
          type: "string",
        },
      ];
      const data = makeRows(25, (i) => ({
        [`a${suffix}`]: `a${i}`,
        [`b${suffix}`]: `b${i}`,
        [`c${suffix}`]: `c${i}`,
        [`d${suffix}`]: `d${i}`,
        [`dChild${suffix}`]: `x${i}`,
        [`e${suffix}`]: `e${i}`,
        [`f${suffix}`]: `f${i}`,
      }));
      const { wrapper, tableContainer } = renderVanillaTable(headers, data, {
        getRowId: (params: any) => String(params.row[`a${suffix}`]),
        height: "280px",
      });
      tableContainer.style.width = containerWidth;
      wrapper.classList.add(`long-header-${suffix}`);
      outer.appendChild(wrapper);
      return wrapper;
    };

    build("W", "900px");
    build("N", "420px");
    return outer;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await wait(250);

    const scopedWidthOf = (scope: Element, label: string): number => {
      const headers = Array.from(scope.querySelectorAll(".st-header-cell"));
      for (const header of headers) {
        const labelElement = header.querySelector(".st-header-label-text");
        if (labelElement?.textContent?.trim() === label) {
          return header.getBoundingClientRect().width;
        }
      }
      return 0;
    };

    const wide = canvasElement.querySelector(".long-header-W")!;
    const narrow = canvasElement.querySelector(".long-header-N")!;
    const label = "Employee Department Assignment Code";

    const wideWidth = scopedWidthOf(wide, label);
    expect(wideWidth).toBeGreaterThan(160);

    // Scroll the narrow table so the target column paints, then compare.
    const narrowBody = narrow.querySelector(".st-body-main") as HTMLElement;
    narrowBody.scrollLeft = narrowBody.scrollWidth;
    narrowBody.dispatchEvent(new Event("scroll", { bubbles: true }));
    await wait(300);

    const narrowWidth = scopedWidthOf(narrow, label);
    expect(narrowWidth).toBeGreaterThan(160);

    // Same header content => same width regardless of container (both still
    // overflow and require horizontal scroll).
    expect(Math.abs(wideWidth - narrowWidth)).toBeLessThan(3);

    // And the painted label must not be truncated in either container.
    for (const scope of [wide, narrow]) {
      const headers = Array.from(scope.querySelectorAll(".st-header-cell"));
      for (const header of headers) {
        const text = header.querySelector(".st-header-label-text") as HTMLElement | null;
        if (text?.textContent?.trim() === label) {
          expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth + 1);
        }
      }
    }
  },
};

// ============================================================================
// HORIZONTAL SCROLLBAR — must account for header/content width, not body alone
// ============================================================================

export const HorizontalScrollbarShowsWhenHeaderOverflowsEmptyState = {
  parameters: { tags: ["horizontal-scrollbar-empty-header"] },
  render: () => {
    // Empty table: body has no .st-body-main / row separators, but headers are
    // still wider than the container and remain horizontally scrollable. The
    // scrollbar visibility check must not rely on body scrollWidth alone.
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 120, type: "number" },
      { accessor: "name", label: "Full Legal Name", width: 220, type: "string" },
      { accessor: "email", label: "Work Email Address", width: 260, type: "string" },
      { accessor: "dept", label: "Department Name", width: 200, type: "string" },
      { accessor: "role", label: "Job Role Title", width: 200, type: "string" },
    ];
    // Constrain the container BEFORE mount so DimensionManager measures the
    // narrow viewport on first paint (setting width after mount races the
    // initial scrollbar visibility check).
    const wrapper = document.createElement("div") as HTMLDivElement & {
      _table?: SimpleTableVanilla;
    };
    wrapper.style.padding = "2rem";
    const tableContainer = document.createElement("div");
    tableContainer.style.width = "360px";
    wrapper.appendChild(tableContainer);
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: [],
      getRowId: (params: any) => String(params.row.id),
      height: "280px",
    });
    table.mount();
    wrapper._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // Scrollbar creation is deferred by 1ms in TableRenderer.
    await wait(50);

    const headerMain = canvasElement.querySelector(".st-header-main") as HTMLElement;
    expect(headerMain).toBeTruthy();

    // Header content overflows the narrow container (sum of column widths =
    // 1000px > 360px viewport). Prefer content-width assertion over
    // scrollWidth/clientWidth: the header section may be sized to content.
    const headerCells = Array.from(headerMain.querySelectorAll(".st-header-cell"));
    const totalHeaderWidth = headerCells.reduce(
      (sum, cell) => sum + cell.getBoundingClientRect().width,
      0,
    );
    expect(totalHeaderWidth).toBeGreaterThan(500);

    // Header remains scrollable (wheel/trackpad over the header works).
    headerMain.scrollLeft = 80;
    headerMain.dispatchEvent(new Event("scroll", { bubbles: true }));
    await wait(30);
    expect(headerMain.scrollLeft).toBeGreaterThan(0);

    // The visible horizontal scrollbar must appear for the same overflow.
    const scrollbar = canvasElement.querySelector(".st-horizontal-scrollbar-container");
    expect(
      scrollbar,
      "horizontal scrollbar should show when header content overflows, even with no rows",
    ).toBeTruthy();
  },
};

/**
 * Empty tables still need a real body scrollport: wheel/trackpad over the
 * "No rows to display" area (and the horizontal scrollbar) must scroll the
 * headers. Replacing the body with a non-scrolling empty wrapper breaks that.
 */
export const EmptyStateBodyScrollSyncsWithHeader = {
  parameters: { tags: ["empty-state-body-scroll-sync"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 120, type: "number" },
      { accessor: "name", label: "Full Legal Name", width: 220, type: "string" },
      { accessor: "email", label: "Work Email Address", width: 260, type: "string" },
      { accessor: "dept", label: "Department Name", width: 200, type: "string" },
      { accessor: "role", label: "Job Role Title", width: 200, type: "string" },
    ];
    const wrapper = document.createElement("div") as HTMLDivElement & {
      _table?: SimpleTableVanilla;
    };
    wrapper.style.padding = "2rem";
    const tableContainer = document.createElement("div");
    tableContainer.style.width = "360px";
    wrapper.appendChild(tableContainer);
    const table = new SimpleTableVanilla(tableContainer, {
      defaultHeaders: headers,
      rows: [],
      getRowId: (params: any) => String(params.row.id),
      height: "280px",
    });
    table.mount();
    wrapper._table = table;
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await wait(50);

    const emptyWrapper = canvasElement.querySelector(".st-empty-state-wrapper");
    expect(emptyWrapper, "empty state should still render").toBeTruthy();

    const bodyMain = canvasElement.querySelector(".st-body-main") as HTMLElement | null;
    expect(
      bodyMain,
      "empty tables must keep a .st-body-main scrollport so body/scrollbar can scroll",
    ).toBeTruthy();
    expect(bodyMain!.scrollWidth).toBeGreaterThan(bodyMain!.clientWidth + 1);

    const headerMain = canvasElement.querySelector(".st-header-main") as HTMLElement;
    expect(headerMain).toBeTruthy();

    // Scroll the body (as a wheel/trackpad over the empty area would) and
    // expect the header to follow via SectionScrollController.
    bodyMain!.scrollLeft = 120;
    bodyMain!.dispatchEvent(new Event("scroll", { bubbles: true }));
    await wait(40);
    expect(headerMain.scrollLeft).toBe(120);

    // Scrollbar thumb must drive the same sync.
    const scrollbarMiddle = canvasElement.querySelector(
      ".st-horizontal-scrollbar-middle",
    ) as HTMLElement | null;
    expect(scrollbarMiddle, "horizontal scrollbar middle pane should exist").toBeTruthy();
    scrollbarMiddle!.scrollLeft = 200;
    scrollbarMiddle!.dispatchEvent(new Event("scroll", { bubbles: true }));
    await wait(40);
    expect(headerMain.scrollLeft).toBe(200);
    expect(bodyMain!.scrollLeft).toBe(200);
  },
};

// ============================================================================
// DETERMINISTIC HELPER UNIT BLOCK (layout-independent)
// ============================================================================

export const SamplingAndOutlierHelpers = {
  parameters: { tags: ["auto-size-helpers"] },
  render: () => {
    const div = document.createElement("div");
    div.textContent = "See assertions in the play function.";
    return div;
  },
  play: async () => {
    // ── buildHybridSampleIndices ──────────────────────────────────────────
    expect(buildHybridSampleIndices(0, 25, 75)).toEqual([]);
    expect(buildHybridSampleIndices(1, 25, 75)).toEqual([0]);

    // rowCount <= head + strided -> all indices.
    expect(buildHybridSampleIndices(100, 25, 75)).toEqual(makeRows(100, (i) => i));

    // strided = 0 -> only the head window (last row NOT force-added).
    expect(buildHybridSampleIndices(1000, 25, 0)).toEqual(makeRows(25, (i) => i));

    // head = 0 -> strided sample + last row.
    const headless = buildHybridSampleIndices(1000, 0, 75);
    expect(headless.includes(999)).toBe(true);
    expect(headless[0]).toBe(0);

    const big = buildHybridSampleIndices(1000, 25, 75);
    for (let i = 0; i < 25; i++) expect(big.includes(i)).toBe(true); // head present
    expect(big.includes(999)).toBe(true); // last present
    for (let i = 1; i < big.length; i++) expect(big[i]).toBeGreaterThan(big[i - 1]); // sorted/deduped
    expect(big.length).toBeLessThanOrEqual(25 + 75 + 1); // bounded
    // Stride math: first strided index after the head window is head + floor((N-head)/strided).
    const expectedStride = Math.floor((1000 - 25) / 75);
    expect(big.includes(25 + expectedStride)).toBe(true);

    // ── percentileOf ──────────────────────────────────────────────────────
    expect(percentileOf([], 50)).toBe(0);
    expect(percentileOf([42], 95)).toBe(42);
    expect(percentileOf([30, 10, 20], 50)).toBe(20); // unsorted handled
    expect(percentileOf([10, 20, 30, 40, 50], 0)).toBe(10); // p0 = min
    expect(percentileOf([10, 20, 30, 40, 50], 100)).toBe(50); // p100 = max
    expect(percentileOf([10, 20, 30, 40, 50], 50)).toBe(30); // odd length
    expect(percentileOf([10, 20, 30, 40], 50)).toBe(25); // even length (interpolated)
    expect(percentileOf([10, 20, 30, 40, 50], 150)).toBe(50); // clamped high
    expect(percentileOf([10, 20, 30, 40, 50], -10)).toBe(10); // clamped low

    // ── selectContentWidthWithOutlierClip ─────────────────────────────────
    expect(selectContentWidthWithOutlierClip([])).toBe(0);
    expect(selectContentWidthWithOutlierClip(makeRows(50, () => 80))).toBe(80); // all-equal

    // Uniform bulk + single huge outlier -> clipped near the bulk.
    const single = [...makeRows(50, () => 50), 2000];
    expect(
      selectContentWidthWithOutlierClip(single, { percentile: 95, threshold: 0.5 }),
    ).toBeLessThan(100);

    // Legitimate wide minority (>5%) -> NOT clipped (returns max).
    const minority = [...makeRows(80, () => 50), ...makeRows(20, () => 300)];
    expect(selectContentWidthWithOutlierClip(minority, { percentile: 95, threshold: 0.5 })).toBe(
      300,
    );

    // Below the min-sample guard (20) -> never clip (raw max).
    expect(selectContentWidthWithOutlierClip([10, 10, 2000])).toBe(2000);

    // Threshold boundary: bulk of 100s, single extra value.
    const justUnder = [...makeRows(50, () => 100), 149]; // 149 <= 100 * 1.5 -> keep max
    expect(selectContentWidthWithOutlierClip(justUnder, { percentile: 95, threshold: 0.5 })).toBe(
      149,
    );
    const justOver = [...makeRows(50, () => 100), 200]; // 200 > 100 * 1.5 -> clip to ~100
    expect(
      selectContentWidthWithOutlierClip(justOver, { percentile: 95, threshold: 0.5 }),
    ).toBeLessThan(120);

    // Percentile choice changes the outcome (7% long tail sits between p90 and p95).
    const tailData = [...makeRows(93, () => 50), ...makeRows(7, () => 500)];
    expect(selectContentWidthWithOutlierClip(tailData, { percentile: 95, threshold: 0.5 })).toBe(
      500,
    ); // p95 in tail -> keep
    expect(
      selectContentWidthWithOutlierClip(tailData, { percentile: 90, threshold: 0.5 }),
    ).toBeLessThan(100); // p90 in bulk -> clip

    // Threshold choice: a very large threshold disables clipping.
    expect(selectContentWidthWithOutlierClip(single, { percentile: 95, threshold: 100 })).toBe(
      2000,
    );

    // Large array performance/correctness sanity.
    const huge = [...makeRows(10_000, () => 60), 5000];
    expect(
      selectContentWidthWithOutlierClip(huge, { percentile: 95, threshold: 0.5 }),
    ).toBeLessThan(120);
  },
};
