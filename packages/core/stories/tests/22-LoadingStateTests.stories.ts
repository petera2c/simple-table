/**
 * LOADING STATE TESTS
 * Tests for isLoading prop - skeleton loaders in cells when data is loading.
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import { HeaderObject, SimpleTableVanilla } from "../../src/index";
import { waitForTable, waitUntil } from "./testUtils";
import { renderVanillaTable } from "../utils";

const meta: Meta = {
  title: "Tests/22 - Loading State",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tests for isLoading: table shows skeleton loaders in cells when loading.",
      },
    },
  },
};

export default meta;

const createData = () => [
  { id: 1, name: "Alice", score: 85 },
  { id: 2, name: "Bob", score: 92 },
  { id: 3, name: "Carol", score: 78 },
];

const headers: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 150, type: "string" },
  { accessor: "score", label: "Score", width: 100, type: "number" },
];

export const LoadingStateShowsSkeletons = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      isLoading: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const skeletons = canvasElement.querySelectorAll(".st-loading-skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
    const cells = canvasElement.querySelectorAll(".st-cell");
    expect(cells.length).toBeGreaterThan(0);
    const firstCell = cells[0];
    expect(firstCell.querySelector(".st-loading-skeleton")).toBeTruthy();
  },
};

export const NotLoadingShowsData = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, createData(), {
      getRowId: (p) => String(p.row?.id),
      height: "300px",
      isLoading: false,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const skeletons = canvasElement.querySelectorAll(".st-loading-skeleton");
    expect(skeletons.length).toBe(0);
    expect(canvasElement.textContent).toContain("Alice");
    expect(canvasElement.textContent).toContain("85");
  },
};

export const LoadingStateWithEmptyRows = {
  render: () => {
    const { wrapper } = renderVanillaTable(headers, [], {
      height: "300px",
      isLoading: true,
    });
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = canvasElement.querySelector(".simple-table-root");
    expect(table).toBeTruthy();
    const skeletons = canvasElement.querySelectorAll(".st-loading-skeleton");
    expect(skeletons.length).toBeGreaterThanOrEqual(0);
  },
};

type TableInstance = InstanceType<typeof SimpleTableVanilla>;

const LOADING_TO_LOADED_REF_KEY = "__storybook_loading_to_loaded_table_ref";
const getLoadingToLoadedTable = (): TableInstance => {
  const t = (globalThis as unknown as Record<string, TableInstance | undefined>)[
    LOADING_TO_LOADED_REF_KEY
  ];
  if (!t) throw new Error("Table ref not set (run render first)");
  return t;
};

/**
 * Repro for the stale-cell bug. Body cells are keyed by `${rowId}-${accessor}`,
 * where `rowId` comes from `getRowId`. When `getRowId` derives the id from row
 * data, a row that is still loading has no id yet, so `getRowId` returns
 * `undefined` (→ "undefined"). While `isLoading` is true the core renders a
 * batch of skeleton rows that ALL collapse to the same cell id
 * (`undefined-<accessor>`); only the last one is tracked in the rendered-cell
 * registry, so the rest are orphaned in the DOM. Once the data resolves and
 * `getRowId` returns a real id, the registry-driven cleanup removes only the
 * tracked cell, leaving the orphaned skeleton cells underneath the real data
 * cell indefinitely.
 *
 * After a single row resolves, the body should hold exactly one cell per
 * column and no leftover loading skeletons.
 */
export const LoadingToLoadedRemovesStaleCells = {
  render: () => {
    // Mount in the loading state with no rows yet, so `getRowId` returns
    // "undefined" for every skeleton row.
    const result = renderVanillaTable(headers, [], {
      getRowId: (p: { row?: { id?: unknown } }) => String(p.row?.id),
      height: "300px",
      isLoading: true,
    });
    (globalThis as unknown as Record<string, TableInstance>)[LOADING_TO_LOADED_REF_KEY] =
      result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    // Loading: skeleton cells are present.
    await waitUntil(() => canvasElement.querySelectorAll(".st-loading-skeleton").length > 0);

    // Data resolves: a single row with a real id.
    getLoadingToLoadedTable().update({
      rows: [{ id: "u1", name: "Alice", score: 85 }],
      isLoading: false,
    });

    // Wait for the resolved row's cell to render.
    await waitUntil(() => canvasElement.textContent?.includes("Alice") ?? false);

    // Exactly one row resolved, so the body must hold exactly one cell per
    // column with no leftover skeleton cells overlapping the real data.
    const bodyContainer = canvasElement.querySelector(".st-body-container") as HTMLElement;
    expect(bodyContainer).toBeTruthy();

    const nameCells = bodyContainer.querySelectorAll('.st-cell[data-accessor="name"]');
    const idCells = bodyContainer.querySelectorAll('.st-cell[data-accessor="id"]');
    const skeletons = bodyContainer.querySelectorAll(".st-loading-skeleton");

    expect(skeletons.length).toBe(0);
    expect(nameCells.length).toBe(1);
    expect(idCells.length).toBe(1);
    expect(bodyContainer.textContent).toContain("Alice");
  },
};
