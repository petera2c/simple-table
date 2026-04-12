import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { SimpleTable } from "../..";
import { HeaderObject } from "../..";

/**
 * MAX HEIGHT SCROLLING TESTS
 *
 * Regression test for v2.6.5 fix: when maxHeight is set and total content
 * height exceeds maxHeight, the table body must scroll even when row count
 * is below VIRTUALIZATION_THRESHOLD (20).
 */

const meta: Meta = {
  title: "Tests/22 - MaxHeight Scroll",
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

const waitForTable = async (timeout = 5000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (document.querySelector(".simple-table-root")) {
      await new Promise((r) => setTimeout(r, 200));
      return;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("Table did not render within timeout");
};

// ============================================================================
// TEST 1: maxHeight with < 20 rows that overflow — body must scroll
// ============================================================================

export const MaxHeightScrollsWithFewRows: StoryObj = {
  tags: ["maxheight-scroll"],
  render: () => {
    const data = createRows(15);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>
          maxHeight=300px, 15 rows (below virtualization threshold)
        </h2>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          maxHeight="300px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const tableRoot = canvasElement.querySelector(
      ".simple-table-root"
    ) as HTMLElement;
    if (!tableRoot) throw new Error("Table root not found");

    // The wrapper must be constrained to ~300px, not auto-sized
    expect(tableRoot.offsetHeight).toBeLessThanOrEqual(310);
    expect(tableRoot.offsetHeight).toBeGreaterThan(0);

    // Body container must be scrollable (scrollHeight > clientHeight)
    const bodyContainer = canvasElement.querySelector(
      ".st-body-container"
    ) as HTMLElement;
    if (!bodyContainer) throw new Error("Body container not found");

    expect(bodyContainer.scrollHeight).toBeGreaterThan(
      bodyContainer.clientHeight
    );
  },
};

// ============================================================================
// TEST 2: maxHeight with < 20 rows that fit — no unnecessary scroll
// ============================================================================

export const MaxHeightNoScrollWhenContentFits: StoryObj = {
  tags: ["maxheight-scroll"],
  render: () => {
    const data = createRows(3);

    return (
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>
          maxHeight=600px, 3 rows (content fits)
        </h2>
        <SimpleTable
          defaultHeaders={headers}
          rows={data}
          maxHeight="600px"
        />
      </div>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const tableRoot = canvasElement.querySelector(
      ".simple-table-root"
    ) as HTMLElement;
    if (!tableRoot) throw new Error("Table root not found");

    // Table should shrink to content, well under 600px
    expect(tableRoot.offsetHeight).toBeLessThan(400);
    expect(tableRoot.offsetHeight).toBeGreaterThan(0);
  },
};
