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

// ============================================================================
// EXPANDABLE CELLS + LOADING STATE
// ============================================================================

const expandableLoadingHeaders: HeaderObject[] = [
  { accessor: "name", label: "Name", width: 200, expandable: true, type: "string" },
  { accessor: "role", label: "Role", width: 120, type: "string" },
];

const expandableLoadingRows = [
  {
    id: "dept-1",
    name: "Engineering",
    role: "Dept",
    teams: [
      { id: "team-1", name: "Frontend", role: "Team" },
      { id: "team-2", name: "Backend", role: "Team" },
    ],
  },
  {
    id: "dept-2",
    name: "Sales",
    role: "Dept",
    teams: [{ id: "team-3", name: "West", role: "Team" }],
  },
];

const EXPANDABLE_ENTER_LOADING_REF_KEY = "__storybook_expandable_enter_loading_table_ref";
const getExpandableEnterLoadingTable = (): TableInstance => {
  const t = (globalThis as unknown as Record<string, TableInstance | undefined>)[
    EXPANDABLE_ENTER_LOADING_REF_KEY
  ];
  if (!t) throw new Error("Table ref not set (run render first)");
  return t;
};

const EXPANDABLE_EXIT_LOADING_REF_KEY = "__storybook_expandable_exit_loading_table_ref";
const getExpandableExitLoadingTable = (): TableInstance => {
  const t = (globalThis as unknown as Record<string, TableInstance | undefined>)[
    EXPANDABLE_EXIT_LOADING_REF_KEY
  ];
  if (!t) throw new Error("Table ref not set (run render first)");
  return t;
};

/**
 * Repro: `updateBodyCellElement` skips content rebuilds for expandable cells
 * so the expand-icon DOM node survives for CSS transitions. That bypass also
 * skips loading-skeleton swaps, so toggling `isLoading` on already-rendered
 * row-grouped rows leaves the expandable column out of sync with every other
 * column.
 *
 * Entering loading: non-expandable columns show skeletons; expandable columns
 * keep their stale expand icon + value.
 */
export const ExpandableCellsShowSkeletonWhenEnteringLoading = {
  render: () => {
    const result = renderVanillaTable(expandableLoadingHeaders, expandableLoadingRows, {
      getRowId: (p: { row?: { id?: unknown } }) => String(p.row?.id),
      rowGrouping: ["teams"],
      height: "300px",
      isLoading: false,
    });
    (globalThis as unknown as Record<string, TableInstance>)[EXPANDABLE_ENTER_LOADING_REF_KEY] =
      result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const body = () => canvasElement.querySelector(".st-body-container") as HTMLElement;
    const nameCells = () => body().querySelectorAll<HTMLElement>('.st-cell[data-accessor="name"]');
    const roleCells = () => body().querySelectorAll<HTMLElement>('.st-cell[data-accessor="role"]');

    await waitUntil(() => nameCells().length > 0);
    expect(canvasElement.textContent).toContain("Engineering");
    expect(nameCells()[0].querySelector(".st-expand-icon-container")).toBeTruthy();
    expect(body().querySelectorAll(".st-loading-skeleton").length).toBe(0);

    getExpandableEnterLoadingTable().update({ isLoading: true });
    await waitUntil(() => roleCells()[0]?.querySelector(".st-loading-skeleton") !== null);

    const nameWhileLoading = Array.from(nameCells());
    const roleWhileLoading = Array.from(roleCells());
    expect(nameWhileLoading.length).toBeGreaterThan(0);
    expect(roleWhileLoading.length).toBeGreaterThan(0);

    roleWhileLoading.forEach((cell) => {
      expect(cell.querySelector(".st-loading-skeleton")).toBeTruthy();
    });
    nameWhileLoading.forEach((cell) => {
      expect(
        cell.querySelector(".st-loading-skeleton"),
        "expandable cell should show a loading skeleton when isLoading becomes true",
      ).toBeTruthy();
    });
  },
};

/**
 * Repro (exit path): expandable cells created while `isLoading` is true render
 * as skeletons. When loading ends, content updates are still skipped for
 * expandable cells, so they stay stuck on the skeleton instead of restoring
 * the expand icon + value.
 */
export const ExpandableCellsRestoreContentWhenLeavingLoading = {
  render: () => {
    const result = renderVanillaTable(expandableLoadingHeaders, expandableLoadingRows, {
      getRowId: (p: { row?: { id?: unknown } }) => String(p.row?.id),
      rowGrouping: ["teams"],
      height: "300px",
      isLoading: true,
    });
    (globalThis as unknown as Record<string, TableInstance>)[EXPANDABLE_EXIT_LOADING_REF_KEY] =
      result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    const body = () => canvasElement.querySelector(".st-body-container") as HTMLElement;
    const nameCells = () => body().querySelectorAll<HTMLElement>('.st-cell[data-accessor="name"]');

    await waitUntil(
      () => nameCells()[0]?.querySelector(".st-loading-skeleton") !== null,
    );
    expect(nameCells().length).toBeGreaterThan(0);

    getExpandableExitLoadingTable().update({ isLoading: false });
    await waitUntil(() => (canvasElement.textContent?.includes("Engineering") ?? false));

    const nameAfterLoad = Array.from(nameCells());
    const expandableSkeletons = body().querySelectorAll(
      '.st-cell[data-accessor="name"] .st-loading-skeleton',
    );
    expect(
      expandableSkeletons.length,
      "expandable cells must not stay stuck on loading skeletons after isLoading becomes false",
    ).toBe(0);
    expect(nameAfterLoad.some((c) => c.textContent?.includes("Engineering"))).toBe(true);
    nameAfterLoad
      .filter((c) => c.textContent?.includes("Engineering") || c.textContent?.includes("Sales"))
      .forEach((cell) => {
        expect(
          cell.querySelector(".st-expand-icon-container"),
          "expand chevron should be restored after loading ends",
        ).toBeTruthy();
      });
  },
};
