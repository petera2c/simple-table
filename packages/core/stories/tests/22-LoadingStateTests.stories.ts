/**
 * LOADING STATE TESTS
 * Tests for isLoading prop - skeleton loaders when data is loading.
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
        component:
          "Tests for isLoading: empty tables show a skeleton page; loaded rows stay visible with skeletons appended below.",
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

/**
 * Rows + isLoading: real data stays visible and skeleton rows are appended below.
 */
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
    expect(canvasElement.textContent).toContain("Alice");
    expect(canvasElement.textContent).toContain("85");
    const skeletons = canvasElement.querySelectorAll(".st-loading-skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
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
    expect(skeletons.length).toBeGreaterThan(0);
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

const APPEND_SKELETONS_REF_KEY = "__storybook_append_skeletons_table_ref";
const getAppendSkeletonsTable = (): TableInstance => {
  const t = (globalThis as unknown as Record<string, TableInstance | undefined>)[
    APPEND_SKELETONS_REF_KEY
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

/**
 * Pagination / infinite-scroll style: loaded rows stay put; skeletons append;
 * clearing loading with more rows removes skeletons.
 */
export const LoadingAppendsSkeletonsUnderLoadedRows = {
  render: () => {
    const result = renderVanillaTable(headers, createData(), {
      getRowId: (p: { row?: { id?: unknown } }) => String(p.row?.id),
      height: "300px",
      isLoading: false,
    });
    (globalThis as unknown as Record<string, TableInstance>)[APPEND_SKELETONS_REF_KEY] =
      result.table;
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    expect(canvasElement.textContent).toContain("Alice");
    expect(canvasElement.querySelectorAll(".st-loading-skeleton").length).toBe(0);

    getAppendSkeletonsTable().update({ isLoading: true });
    await waitUntil(() => canvasElement.querySelectorAll(".st-loading-skeleton").length > 0);

    expect(canvasElement.textContent).toContain("Alice");
    expect(canvasElement.textContent).toContain("Bob");
    const skeletonCountWhileLoading = canvasElement.querySelectorAll(
      ".st-loading-skeleton",
    ).length;
    expect(skeletonCountWhileLoading).toBeGreaterThan(0);

    getAppendSkeletonsTable().update({
      isLoading: false,
      rows: [
        ...createData(),
        { id: 4, name: "Dave", score: 88 },
      ],
    });
    await waitUntil(() => canvasElement.textContent?.includes("Dave") ?? false);
    expect(canvasElement.querySelectorAll(".st-loading-skeleton").length).toBe(0);
    expect(canvasElement.textContent).toContain("Alice");
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
 * Entering loading with existing expandable rows keeps their chevrons/content
 * and only appends skeleton placeholder rows below.
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

    await waitUntil(() => nameCells().length > 0);
    expect(canvasElement.textContent).toContain("Engineering");
    expect(nameCells()[0].querySelector(".st-expand-icon-container")).toBeTruthy();
    expect(body().querySelectorAll(".st-loading-skeleton").length).toBe(0);

    getExpandableEnterLoadingTable().update({ isLoading: true });
    await waitUntil(() => body().querySelectorAll(".st-loading-skeleton").length > 0);

    expect(canvasElement.textContent).toContain("Engineering");
    const engineeringCell = Array.from(nameCells()).find((c) =>
      c.textContent?.includes("Engineering"),
    );
    expect(engineeringCell).toBeTruthy();
    expect(engineeringCell!.querySelector(".st-expand-icon-container")).toBeTruthy();
    expect(engineeringCell!.querySelector(".st-loading-skeleton")).toBeNull();

    const skeletonNameCells = Array.from(nameCells()).filter(
      (c) => c.querySelector(".st-loading-skeleton") !== null,
    );
    expect(skeletonNameCells.length).toBeGreaterThan(0);
  },
};

/**
 * Full-table skeleton (empty + loading) then resolve expandable rows: expandable
 * cells must restore chevron + value instead of staying stuck on skeletons.
 */
export const ExpandableCellsRestoreContentWhenLeavingLoading = {
  render: () => {
    const result = renderVanillaTable(expandableLoadingHeaders, [], {
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

    await waitUntil(() => nameCells()[0]?.querySelector(".st-loading-skeleton") !== null);
    expect(nameCells().length).toBeGreaterThan(0);

    getExpandableExitLoadingTable().update({
      rows: expandableLoadingRows,
      isLoading: false,
    });
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
