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
