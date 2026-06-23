/**
 * AUTO-SIZE COLUMNS TESTS
 *
 * Comprehensive coverage for content-fit columns (`width: "auto"`):
 * - shrink / grow, per-column `maxWidth` cap and `minWidth` floor
 * - `autoSizeMode: "header"`
 * - custom (vanilla) renderers, valueFormatter, valueGetter, chart columns
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
    console.info(`[auto-size] 50k uniform: width=${idWidth.toFixed(1)} settled in ${elapsed.toFixed(0)}ms`);
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
    console.info(`[auto-size] 50k long: width=${blurbWidth.toFixed(1)} settled in ${elapsed.toFixed(0)}ms`);
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
    expect(selectContentWidthWithOutlierClip(single, { percentile: 95, threshold: 0.5 })).toBeLessThan(100);

    // Legitimate wide minority (>5%) -> NOT clipped (returns max).
    const minority = [...makeRows(80, () => 50), ...makeRows(20, () => 300)];
    expect(selectContentWidthWithOutlierClip(minority, { percentile: 95, threshold: 0.5 })).toBe(300);

    // Below the min-sample guard (20) -> never clip (raw max).
    expect(selectContentWidthWithOutlierClip([10, 10, 2000])).toBe(2000);

    // Threshold boundary: bulk of 100s, single extra value.
    const justUnder = [...makeRows(50, () => 100), 149]; // 149 <= 100 * 1.5 -> keep max
    expect(selectContentWidthWithOutlierClip(justUnder, { percentile: 95, threshold: 0.5 })).toBe(149);
    const justOver = [...makeRows(50, () => 100), 200]; // 200 > 100 * 1.5 -> clip to ~100
    expect(selectContentWidthWithOutlierClip(justOver, { percentile: 95, threshold: 0.5 })).toBeLessThan(120);

    // Percentile choice changes the outcome (7% long tail sits between p90 and p95).
    const tailData = [...makeRows(93, () => 50), ...makeRows(7, () => 500)];
    expect(selectContentWidthWithOutlierClip(tailData, { percentile: 95, threshold: 0.5 })).toBe(500); // p95 in tail -> keep
    expect(selectContentWidthWithOutlierClip(tailData, { percentile: 90, threshold: 0.5 })).toBeLessThan(100); // p90 in bulk -> clip

    // Threshold choice: a very large threshold disables clipping.
    expect(selectContentWidthWithOutlierClip(single, { percentile: 95, threshold: 100 })).toBe(2000);

    // Large array performance/correctness sanity.
    const huge = [...makeRows(10_000, () => 60), 5000];
    expect(selectContentWidthWithOutlierClip(huge, { percentile: 95, threshold: 0.5 })).toBeLessThan(120);
  },
};
