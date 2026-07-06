/**
 * ROW GROUP RE-EXPAND REGRESSION TESTS
 *
 * Reproduces bugs when a lazy-loaded grouped row is collapsed and re-expanded:
 *
 *   1. onRowGroupExpand receives a stale `row` snapshot (missing cached children),
 *      so consumer guards like `if (row[groupingKey]?.length) return` fail and
 *      every re-expand re-triggers setLoading + fetch.
 *
 *   2. Re-expand must not re-enter loading state or spuriously animate sibling
 *      rows below the expanded group.
 *
 * Mirrors packages/react/src/__tests__/onRowGroupExpandReExpand.test.tsx.
 * All play tests should FAIL until the stale-row fix lands.
 */

import type { Meta } from "@storybook/html";
import { expect, userEvent } from "@storybook/test";
import type { HeaderObject, OnRowGroupExpandProps, Row } from "../../src/index";
import { SimpleTableVanilla } from "../../src/index";
import { addParagraph } from "../utils";
import { waitForTable, waitUntil } from "./testUtils";

const meta: Meta = {
  title: "Tests/51 - Row Group Re-Expand",
  tags: ["test", "row-grouping", "re-expand", "lazy-loading"],
  parameters: {
    layout: "padded",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Regression tests for lazy-loaded row group collapse/re-expand: stale onRowGroupExpand row snapshots and accordion animation markers.",
      },
    },
  },
};

export default meta;

const STORY_TABLE_REF_KEY = "__storybook_row_group_reexpand_table";

type StoryTable = InstanceType<typeof SimpleTableVanilla>;

interface TeamRow {
  id: string;
  name: string;
}

interface DeptRow extends Row {
  id: string;
  name: string;
  budget: number;
  teams?: TeamRow[];
}

interface ReExpandProbe {
  expandSnapshots: Array<{ childCount: number; isExpanded: boolean }>;
  fetchCount: number;
  loadingTrueCount: number;
}

declare global {
  interface Window {
    __rowGroupReExpandProbe?: ReExpandProbe;
  }
}

const LAZY_TEAMS: TeamRow[] = [
  { id: "team-1", name: "Frontend Team" },
  { id: "team-2", name: "Backend Team" },
];

const LAZY_HEADERS: HeaderObject[] = [
  { accessor: "name", label: "Name", width: 220, expandable: true },
  { accessor: "budget", label: "Budget", width: 120, type: "number" },
];

const INITIAL_LAZY_ROWS: DeptRow[] = [
  { id: "dept-1", name: "Engineering", budget: 500_000 },
  { id: "dept-2", name: "Sales", budget: 300_000 },
];

const LAZY_FETCH_MS = 100;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const getStoryTable = (): StoryTable => {
  const table = (globalThis as unknown as Record<string, StoryTable | undefined>)[
    STORY_TABLE_REF_KEY
  ];
  if (!table) throw new Error("Story table ref not set (render must assign global ref)");
  return table;
};

const resetProbe = (): ReExpandProbe => {
  const probe: ReExpandProbe = {
    expandSnapshots: [],
    fetchCount: 0,
    loadingTrueCount: 0,
  };
  window.__rowGroupReExpandProbe = probe;
  return probe;
};

const getVisibleRowCount = (canvasElement: HTMLElement): number => {
  const body = canvasElement.querySelector(".st-body-container");
  if (!body) return 0;
  const cells = body.querySelectorAll(".st-cell[data-row-id]");
  return new Set(Array.from(cells).map((c) => c.getAttribute("data-row-id"))).size;
};

const findExpandIconForRowIndex = (
  canvasElement: HTMLElement,
  rowIndex: number,
): HTMLElement | null => {
  const body = canvasElement.querySelector(".st-body-container");
  if (!body) return null;
  const rowCells = body.querySelectorAll(`.st-cell[data-row-index="${rowIndex}"]`);
  for (const cell of Array.from(rowCells)) {
    const icon = cell.querySelector(".st-expand-icon-container");
    if (icon && icon.getAttribute("aria-hidden") !== "true") {
      return icon as HTMLElement;
    }
  }
  return null;
};

const findExpandIconForRowName = (canvasElement: HTMLElement, name: string): HTMLElement | null => {
  const nameCell = Array.from(
    canvasElement.querySelectorAll<HTMLElement>('.st-cell[data-accessor="name"]'),
  ).find((cell) => cell.textContent?.includes(name));
  if (!nameCell) return null;
  const rowIndex = nameCell.getAttribute("data-row-index");
  if (rowIndex === null) return null;
  return findExpandIconForRowIndex(canvasElement, Number(rowIndex));
};

const cellsForRowCustomId = (canvasElement: HTMLElement, customId: string): HTMLElement[] => {
  return Array.from(canvasElement.querySelectorAll<HTMLElement>(".st-cell[data-row-id]")).filter(
    (cell) => {
      const rowId = cell.getAttribute("data-row-id") ?? "";
      return rowId === customId || rowId.endsWith(`-${customId}`);
    },
  );
};

const countLoadingSkeletonRows = (canvasElement: HTMLElement): number =>
  canvasElement.querySelectorAll('.st-cell[data-row-id*="loading-skeleton"]').length;

const isChildTeamRowId = (rowId: string | null): boolean => {
  if (!rowId) return false;
  return rowId.includes("team-1") || rowId.includes("team-2");
};

const clickExpandIconByName = async (
  canvasElement: HTMLElement,
  name: string,
  postClickWaitMs = 400,
): Promise<void> => {
  const icon = findExpandIconForRowName(canvasElement, name);
  if (!icon) throw new Error(`Expand icon not found for row "${name}"`);
  const user = userEvent.setup();
  await user.click(icon);
  if (postClickWaitMs > 0) {
    await sleep(postClickWaitMs);
  }
};

/** Wait until the first lazy-load fetch completes and child rows are visible. */
const waitForLazyTeamsLoaded = async (canvasElement: HTMLElement): Promise<void> => {
  await waitUntil(
    () => {
      const probe = window.__rowGroupReExpandProbe;
      const hasTeamsText = canvasElement.textContent?.includes("Frontend Team") ?? false;
      const rowCountGrew = getVisibleRowCount(canvasElement) > 2;
      return (probe?.fetchCount ?? 0) >= 1 && (hasTeamsText || rowCountGrew);
    },
    { timeoutMs: 10_000, intervalMs: 50 },
  );
};

const renderLazyReExpandTable = (options?: { showStatusPanel?: boolean }): HTMLDivElement => {
  let rows: DeptRow[] = INITIAL_LAZY_ROWS.map((row) => ({ ...row }));
  resetProbe();

  const wrapper = document.createElement("div");
  wrapper.style.padding = "2rem";

  const h2 = document.createElement("h2");
  h2.style.marginBottom = "1rem";
  h2.textContent = "Lazy Row Group Re-Expand";
  wrapper.appendChild(h2);

  addParagraph(
    wrapper,
    "Expand Engineering to lazy-load teams, collapse, then re-expand. " +
      "Cached children should skip fetch/loading; sibling Sales row should only shift.",
  );

  let statusEl: HTMLElement | null = null;
  if (options?.showStatusPanel) {
    statusEl = document.createElement("div");
    statusEl.style.cssText =
      "margin-bottom:1rem;padding:0.75rem 1rem;background:#f5f5f5;border-radius:6px;font-family:monospace;font-size:13px;line-height:1.6";
    wrapper.appendChild(statusEl);
  }

  const updateStatus = (): void => {
    if (!statusEl) return;
    const probe = window.__rowGroupReExpandProbe;
    if (!probe) return;
    const lastExpand = [...probe.expandSnapshots].reverse().find((e) => e.isExpanded);
    statusEl.textContent = [
      `fetchCount: ${probe.fetchCount}`,
      `setLoading(true) calls: ${probe.loadingTrueCount}`,
      `last expand childCount: ${lastExpand?.childCount ?? "—"}`,
      `expand events: ${probe.expandSnapshots.length}`,
    ].join("\n");
  };

  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);

  const handleExpand = async ({
    row,
    groupingKey,
    isExpanded,
    setLoading,
    rowIndexPath,
  }: OnRowGroupExpandProps): Promise<void> => {
    const probe = window.__rowGroupReExpandProbe!;
    const childCount =
      groupingKey && Array.isArray(row[groupingKey]) ? (row[groupingKey] as TeamRow[]).length : 0;
    probe.expandSnapshots.push({ childCount, isExpanded });
    updateStatus();

    if (!isExpanded) return;
    if (childCount > 0) return;

    probe.fetchCount++;
    setLoading(true);
    probe.loadingTrueCount++;
    updateStatus();

    await sleep(LAZY_FETCH_MS);
    setLoading(false);
    await sleep(20);

    const rowIndex = rowIndexPath[0];
    if (typeof rowIndex === "number" && groupingKey) {
      const nextRows = rows.map((entry) => ({ ...entry }));
      nextRows[rowIndex] = { ...nextRows[rowIndex], teams: [...LAZY_TEAMS] };
      rows = nextRows;
      getStoryTable().update({ rows: nextRows });
    }

    updateStatus();
  };

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: LAZY_HEADERS,
    rows,
    height: "320px",
    rowGrouping: ["teams"],
    expandAll: false,
    getRowId: ({ row }) => String((row as DeptRow).id),
    onRowGroupExpand: handleExpand,
    animations: { enabled: true, duration: 300 },
  });
  table.mount();

  (globalThis as unknown as Record<string, StoryTable>)[STORY_TABLE_REF_KEY] = table;
  return wrapper;
};

/** Expand (lazy load) → collapse → re-expand. */
const expandLoadCollapseAndReExpand = async (canvasElement: HTMLElement): Promise<void> => {
  await clickExpandIconByName(canvasElement, "Engineering");
  await waitForLazyTeamsLoaded(canvasElement);
  await sleep(350);

  await clickExpandIconByName(canvasElement, "Engineering");
  await sleep(350);

  await clickExpandIconByName(canvasElement, "Engineering", 80);
};

// ============================================================================
// LAZY-LOAD RE-EXPAND (stale row snapshot — should fail until fixed)
// ============================================================================

export const ReExpand_PassesCachedRowSnapshot = {
  tags: ["lazy-load", "stale-row"],
  render: () => renderLazyReExpandTable(),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await expandLoadCollapseAndReExpand(canvasElement);

    const probe = window.__rowGroupReExpandProbe!;
    const expandedCalls = probe.expandSnapshots.filter((entry) => entry.isExpanded);
    expect(expandedCalls.length).toBeGreaterThanOrEqual(2);

    const secondExpand = expandedCalls[1];
    expect(secondExpand.childCount, "re-expand should see cached teams on the row snapshot").toBe(
      LAZY_TEAMS.length,
    );
  },
};

export const ReExpand_SkipsRefetch = {
  tags: ["lazy-load", "stale-row"],
  render: () => renderLazyReExpandTable(),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await expandLoadCollapseAndReExpand(canvasElement);

    expect(
      window.__rowGroupReExpandProbe!.fetchCount,
      "lazy load should run only once across collapse/re-expand",
    ).toBe(1);
  },
};

export const ReExpand_SkipsSetLoading = {
  tags: ["lazy-load", "stale-row"],
  render: () => renderLazyReExpandTable(),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await expandLoadCollapseAndReExpand(canvasElement);

    expect(
      window.__rowGroupReExpandProbe!.loadingTrueCount,
      "setLoading(true) should run only on the first expand, not on re-expand",
    ).toBe(1);
  },
};

/** Manual QA: status panel shows fetch/loading counts while toggling Engineering. */
export const ReExpand_LazyLoad_StatusPanel = {
  tags: ["manual", "lazy-load"],
  render: () => renderLazyReExpandTable({ showStatusPanel: true }),
};

// ============================================================================
// ACCORDION ANIMATION ON LAZY RE-EXPAND (should fail until fixed)
// ============================================================================

export const ReExpand_NoLoadingSkeletonOnLazyReExpand = {
  tags: ["animation", "accordion", "lazy-load"],
  render: () => renderLazyReExpandTable(),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    await clickExpandIconByName(canvasElement, "Engineering");
    await waitForLazyTeamsLoaded(canvasElement);
    await sleep(350);

    await clickExpandIconByName(canvasElement, "Engineering");
    await sleep(350);

    await clickExpandIconByName(canvasElement, "Engineering", 15);

    expect(
      countLoadingSkeletonRows(canvasElement),
      "cached re-expand must not insert loading-skeleton rows",
    ).toBe(0);
  },
};

export const ReExpand_SiblingRowsNoAccordionGrow = {
  tags: ["animation", "accordion", "lazy-load"],
  render: () => renderLazyReExpandTable(),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await expandLoadCollapseAndReExpand(canvasElement);

    expect(
      window.__rowGroupReExpandProbe!.fetchCount,
      "spurious re-fetch triggers extra accordion cycles",
    ).toBe(1);

    const salesCells = cellsForRowCustomId(canvasElement, "dept-2");
    expect(salesCells.length).toBeGreaterThan(0);
    for (const cell of salesCells) {
      expect(
        cell.dataset.stAccordionGrow,
        "sibling row below should shift, not play accordion grow",
      ).toBeUndefined();
    }
  },
};

export const ReExpand_NoAccordionGrowOnReExpand = {
  tags: ["animation", "lazy-load"],
  render: () => renderLazyReExpandTable(),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();

    await clickExpandIconByName(canvasElement, "Engineering");
    await waitForLazyTeamsLoaded(canvasElement);
    await sleep(350);

    await clickExpandIconByName(canvasElement, "Engineering");
    await sleep(350);

    const icon = findExpandIconForRowName(canvasElement, "Engineering");
    expect(icon).toBeTruthy();
    const user = userEvent.setup();
    await user.click(icon!);

    expect(
      window.__rowGroupReExpandProbe!.loadingTrueCount,
      "re-expand must not re-enter loading state",
    ).toBe(1);

    const growingCells = canvasElement.querySelectorAll<HTMLElement>(
      '.st-cell[data-st-accordion-grow="vertical"]',
    );
    expect(growingCells.length, "row grouping must not use accordion grow").toBe(0);
  },
};
