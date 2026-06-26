/**
 * MAX HEIGHT SCROLLING TESTS
 *
 * Regression test for v2.6.5 fix: when maxHeight is set and total content
 * height exceeds maxHeight, the table body must scroll even when row count
 * is below VIRTUALIZATION_THRESHOLD (20).
 */

import { HeaderObject } from "../../src/index";
import { expect } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderVanillaTable } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/40 - MaxHeight Scroll",
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
  },
};

export default meta;

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 200 },
  { accessor: "description", label: "Description", width: 300 },
];

const createRows = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Row ${i + 1}`,
    description: `Description for row ${i + 1}`,
  }));

// ============================================================================
// TEST 1: maxHeight with < 20 rows that overflow — body must scroll
// ============================================================================

export const MaxHeightScrollsWithFewRows = {
  tags: ["maxheight-scroll"],
  render: () => {
    const data = createRows(15);
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      maxHeight: "300px",
    });
    h2.textContent = "maxHeight=300px, 15 rows (below virtualization threshold)";
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();

    const tableRoot = canvasElement.querySelector(
      ".simple-table-root",
    ) as HTMLElement;
    if (!tableRoot) throw new Error("Table root not found");

    expect(tableRoot.offsetHeight).toBeLessThanOrEqual(310);
    expect(tableRoot.offsetHeight).toBeGreaterThan(0);

    const bodyContainer = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    if (!bodyContainer) throw new Error("Body container not found");

    expect(bodyContainer.scrollHeight).toBeGreaterThan(
      bodyContainer.clientHeight,
    );
  },
};

// ============================================================================
// TEST 2: maxHeight with < 20 rows that fit — no unnecessary scroll
// ============================================================================

export const MaxHeightNoScrollWhenContentFits = {
  tags: ["maxheight-scroll"],
  render: () => {
    const data = createRows(3);
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      maxHeight: "600px",
    });
    h2.textContent = "maxHeight=600px, 3 rows (content fits)";
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();

    const tableRoot = canvasElement.querySelector(
      ".simple-table-root",
    ) as HTMLElement;
    if (!tableRoot) throw new Error("Table root not found");

    expect(tableRoot.offsetHeight).toBeLessThan(400);
    expect(tableRoot.offsetHeight).toBeGreaterThan(0);
  },
};

// ============================================================================
// TEST 3: maxHeight using calc() — body must scroll, not clip
// ============================================================================
//
// Repro for the calc() clipping bug. With `maxHeight="calc(100vh - 700px)"`
// (no height, no scrollParent) CSS caps the root box at the resolved calc value,
// but the scroll math in `convertHeightToPixels` doesn't understand `calc(...)`
// and falls back to the full `window.innerHeight`. The JS therefore thinks the
// content fits, disables the internal scroll region, mounts every row, and the
// `overflow: hidden` wrapper clips the rows past the cap — no inner scrollbar,
// rows below the fold unreachable.
//
// The default test-runner viewport is 1280x720, so the calc resolves to ~20px
// while 15 rows of content (~512px) overflow it but stay under the full viewport
// height — exactly the window where the bug manifests. The body must scroll.

export const MaxHeightCalcScrolls = {
  tags: ["maxheight-scroll"],
  render: () => {
    const data = createRows(15);
    const { wrapper, h2 } = renderVanillaTable(headers, data, {
      maxHeight: "calc(100vh - 700px)",
    });
    h2.textContent = "maxHeight=calc(100vh - 700px), 15 rows (must scroll, not clip)";
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    await waitForTable();

    const tableRoot = canvasElement.querySelector(
      ".simple-table-root",
    ) as HTMLElement;
    if (!tableRoot) throw new Error("Table root not found");

    // The calc cap keeps the box small (well under the full content height)...
    expect(tableRoot.offsetHeight).toBeGreaterThan(0);
    expect(tableRoot.offsetHeight).toBeLessThan(window.innerHeight);

    const bodyContainer = canvasElement.querySelector(
      ".st-body-container",
    ) as HTMLElement;
    if (!bodyContainer) throw new Error("Body container not found");

    // ...so the body must provide an inner scroll region to reach the rows below
    // the fold. Under the bug the body grows to full content and is clipped by an
    // ancestor instead, leaving scrollHeight === clientHeight (no scrollbar).
    expect(bodyContainer.scrollHeight).toBeGreaterThan(bodyContainer.clientHeight);
  },
};
