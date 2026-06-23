/**
 * DEFERRED HEADERS TESTS
 * Regression tests for populating `defaultHeaders` after mount (the table
 * mounts with an empty header array, then `update({ defaultHeaders })` supplies
 * the real columns — e.g. from an async fetch / useEffect).
 *
 * The header band must become visible once the columns arrive. Previously the
 * DimensionManager kept maxHeaderDepth/calculatedHeaderHeight at 0 (computed
 * from the empty mount-time headers), so the header row rendered at 0px height
 * even though the body and the header cells existed.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject, SimpleTableVanilla } from "../../src/index";
import { waitForTable, waitUntil } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/47 - Deferred Headers",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tests for populating defaultHeaders after mount: the header row must appear (with non-zero height) once columns are supplied.",
      },
    },
  },
};

export default meta;

type TableInstance = InstanceType<typeof SimpleTableVanilla>;

const TABLE_REF_KEY = "__storybook_deferred_headers_table_ref";
const getTable = (): TableInstance => {
  const t = (globalThis as unknown as Record<string, TableInstance | undefined>)[TABLE_REF_KEY];
  if (!t) throw new Error("Table ref not set (run render first)");
  return t;
};

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 160, type: "string" },
];

const data = () => [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Carol" },
];

export const PopulateHeadersAfterMount = {
  render: () => {
    // Mount with an empty header set, like a parent that hasn't resolved its
    // columns yet, but with rows already available.
    const result = renderVanillaTable([], data(), {
      getRowId: (p) => String((p.row as { id?: number })?.id),
      height: "250px",
    });
    (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // No header cells while headers are empty.
    expect(canvasElement.querySelectorAll(".st-header-cell").length).toBe(0);

    // Populate the columns after mount, mimicking an async assignment.
    getTable().update({ defaultHeaders: headers });

    // The header cells must appear...
    await waitUntil(() => canvasElement.querySelectorAll(".st-header-cell").length >= 2);

    // ...and the header band must have a real, non-zero rendered height (the
    // regression: cells existed but the band collapsed to 0px).
    const headerContainer = canvasElement.querySelector(".st-header-container") as HTMLElement;
    expect(headerContainer).toBeTruthy();
    expect(headerContainer.getBoundingClientRect().height).toBeGreaterThan(0);

    const headerCell = canvasElement.querySelector(".st-header-cell") as HTMLElement;
    expect(headerCell.getBoundingClientRect().height).toBeGreaterThan(0);

    expect(canvasElement.textContent).toContain("Name");
    expect(canvasElement.textContent).toContain("Alice");
  },
};
