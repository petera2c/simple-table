/**
 * AUTO-SIZE COLUMNS TESTS
 *
 * Covers declarative `width: "auto"` content fitting, per-column `maxWidth`
 * capping, `autoSizeMode: "header"`, custom-renderer measurement, and the
 * sampling / outlier-clip helpers used for large datasets.
 */

import { HeaderObject } from "../../src/index";
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
          "Tests for content-fit columns (width:'auto'): shrink/grow, maxWidth cap, header-only mode, custom renderers, and outlier-safe sampling.",
      },
    },
  },
};

export default meta;

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

const longText =
  "This is a very long cell value that should make a content-fit column grow much wider than the header label";

// ============================================================================
// DECLARATIVE width: "auto" — shrink and grow
// ============================================================================

export const AutoWidthShrinksNarrowColumn = {
  parameters: { tags: ["auto-size-shrink"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: "auto", type: "number" },
      { accessor: "name", label: "Name", width: 200, type: "string" },
    ];
    const data = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}` }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // Single/double digit numeric ids + short header => column fits in well under
    // the 150px provisional default.
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
    // Every row is long (so it's the norm, not an outlier to be clipped).
    const data = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      notes: `${longText} ${i}`,
    }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // Long content across all rows => the column grows well beyond the 150px
    // provisional default (capped only by the global max).
    const notesWidth = widthOf(canvasElement, "Notes");
    expect(notesWidth).toBeGreaterThan(250);
  },
};

// ============================================================================
// maxWidth cap
// ============================================================================

export const AutoWidthRespectsMaxWidth = {
  parameters: { tags: ["auto-size-maxwidth"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "comment", label: "Comment", width: "auto", maxWidth: 160, type: "string" },
    ];
    const data = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      comment: longText + " " + i,
    }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // Every row is very long, but maxWidth caps the column near 160px.
    const commentWidth = widthOf(canvasElement, "Comment");
    expect(commentWidth).toBeGreaterThan(120);
    expect(commentWidth).toBeLessThanOrEqual(170); // 160 cap + small buffer
  },
};

// ============================================================================
// header-only mode
// ============================================================================

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
    const data = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, description: longText }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // Cells are very long, but header-only mode fits the short "Desc" label.
    const descWidth = widthOf(canvasElement, "Desc");
    expect(descWidth).toBeGreaterThan(0);
    expect(descWidth).toBeLessThan(140);
  },
};

// ============================================================================
// custom (vanilla) cell renderer measurement
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
          badge.style.width = "240px"; // wider than the formatted text or header
          badge.style.whiteSpace = "nowrap";
          badge.textContent = String(value);
          return badge;
        },
      },
    ];
    const data = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, status: "ok" }));
    const { wrapper } = renderVanillaTable(headers, data, {
      getRowId: (params: any) => String(params.row.id),
      height: "300px",
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    // Formatted text "ok" is tiny, but the renderer emits a 240px badge — the
    // column must size to the rendered output, not the text.
    const statusWidth = widthOf(canvasElement, "Status");
    expect(statusWidth).toBeGreaterThan(220);
  },
};

// ============================================================================
// large dataset + outlier clipping (no flicker re-fit on data change)
// ============================================================================

export const AutoSizeClipsOutliers = {
  parameters: { tags: ["auto-size-outlier"] },
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, type: "number" },
      { accessor: "amount", label: "Amount", width: "auto", type: "string" },
    ];
    // 200 short values + a single rogue 2000px-ish sentence partway through.
    const data = Array.from({ length: 200 }, (_, i) => ({
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
    // The single huge outlier must NOT define the column; it should stay compact.
    const amountWidth = widthOf(canvasElement, "Amount");
    expect(amountWidth).toBeGreaterThan(0);
    expect(amountWidth).toBeLessThan(200);
  },
};

// ============================================================================
// Pure helper unit checks (deterministic, no DOM)
// ============================================================================

export const SamplingAndOutlierHelpers = {
  parameters: { tags: ["auto-size-helpers"] },
  render: () => {
    const div = document.createElement("div");
    div.textContent = "See assertions in the play function.";
    return div;
  },
  play: async () => {
    // Hybrid sampling: head rows + strided rows + last row, deduped & sorted.
    const small = buildHybridSampleIndices(5, 25, 75);
    expect(small).toEqual([0, 1, 2, 3, 4]);

    const big = buildHybridSampleIndices(1000, 25, 75);
    // First 25 always present.
    for (let i = 0; i < 25; i++) expect(big.includes(i)).toBe(true);
    // Last row always present (deepest values considered).
    expect(big.includes(999)).toBe(true);
    // Strictly increasing / deduped.
    for (let i = 1; i < big.length; i++) expect(big[i]).toBeGreaterThan(big[i - 1]);
    // Bounded by the budget (head + strided + last).
    expect(big.length).toBeLessThanOrEqual(25 + 75 + 1);

    // Percentile interpolation.
    expect(percentileOf([10, 20, 30, 40, 50], 50)).toBe(30);
    expect(percentileOf([10], 95)).toBe(10);

    // Outlier clip: a single huge value among a uniform bulk gets clipped.
    const uniformPlusOutlier = [
      ...Array.from({ length: 50 }, () => 50),
      2000,
    ];
    const clipped = selectContentWidthWithOutlierClip(uniformPlusOutlier, {
      percentile: 95,
      threshold: 0.5,
    });
    expect(clipped).toBeLessThan(100); // ~50, not 2000

    // Uniform column keeps its true max (nothing clipped).
    const uniform = Array.from({ length: 50 }, () => 80);
    expect(selectContentWidthWithOutlierClip(uniform)).toBe(80);

    // Below the min-sample guard, never clip (use raw max).
    expect(selectContentWidthWithOutlierClip([10, 10, 2000])).toBe(2000);
  },
};
