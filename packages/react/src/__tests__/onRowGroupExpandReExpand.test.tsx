import { createElement, useState, type Dispatch, type SetStateAction } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { OnRowGroupExpandProps, ReactHeaderObject } from "../index";

// Repro: onRowGroupExpand is invoked with a stale `row` snapshot when a grouped
// row is re-expanded after lazy-loaded children were already fetched. Consumers
// typically guard with `if (row[groupingKey]?.length) return` — that guard fails
// with the closure row, so every re-expand re-triggers setLoading and a fetch.
//
// Related: the spurious setLoading → setRowStateMap accordion cycle also makes
// sibling rows below the expanded group play incorrect collapse/expand motion on
// the second expand. Only newly revealed child rows should carry the accordion
// grow marker; rows that were already visible should simply FLIP-shift.

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
  setRowsRef.current = null;
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 5000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

async function waitForElement(
  scope: HTMLElement,
  selector: string,
  timeoutMs = 5000,
): Promise<HTMLElement> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const el = scope.querySelector<HTMLElement>(selector);
    if (el) return el;
    await wait(20);
  }
  throw new Error(`Timed out waiting for element: ${selector}`);
}

const headers: ReactHeaderObject[] = [
  { accessor: "name", label: "Name", width: 200, type: "string", expandable: true },
  { accessor: "budget", label: "Budget", width: 120, type: "number" },
];

interface TeamRow {
  id: string;
  name: string;
}

interface DeptRow {
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

const LAZY_TEAMS: TeamRow[] = [
  { id: "team-1", name: "Frontend Team" },
  { id: "team-2", name: "Backend Team" },
];

const initialRows: DeptRow[] = [
  { id: "dept-1", name: "Engineering", budget: 500_000 },
  { id: "dept-2", name: "Sales", budget: 300_000 },
];

const setRowsRef: { current: Dispatch<SetStateAction<DeptRow[]>> | null } = { current: null };

function findExpandIconForRowIndex(host: HTMLElement, rowIndex: number): HTMLElement | null {
  const rowCells = host.querySelectorAll<HTMLElement>(`.st-cell[data-row-index="${rowIndex}"]`);
  for (const cell of rowCells) {
    const icon = cell.querySelector(".st-expand-icon-container");
    if (icon && icon.getAttribute("aria-hidden") !== "true") {
      return icon as HTMLElement;
    }
  }
  return null;
}

function findExpandIconForRowName(host: HTMLElement, name: string): HTMLElement | null {
  const nameCell = Array.from(
    host.querySelectorAll<HTMLElement>('.st-cell[data-accessor="name"]'),
  ).find((cell) => cell.textContent?.includes(name));
  if (!nameCell) return null;
  const rowIndex = nameCell.getAttribute("data-row-index");
  if (rowIndex === null) return null;
  return findExpandIconForRowIndex(host, Number(rowIndex));
}

function cellsForRowCustomId(host: HTMLElement, customId: string): HTMLElement[] {
  return Array.from(host.querySelectorAll<HTMLElement>(".st-cell[data-row-id]")).filter((cell) => {
    const rowId = cell.getAttribute("data-row-id") ?? "";
    return rowId === customId || rowId.endsWith(`-${customId}`);
  });
}

function isChildTeamRowId(rowId: string | null): boolean {
  if (!rowId) return false;
  return rowId.includes("team-1") || rowId.includes("team-2");
}

function countLoadingSkeletonRows(host: HTMLElement): number {
  return host.querySelectorAll('.st-cell[data-row-id*="loading-skeleton"]').length;
}

async function commitLazyTeams(): Promise<void> {
  setRowsRef.current?.((prev) => {
    const next = prev.map((row) => ({ ...row }));
    next[0] = { ...next[0], teams: [...LAZY_TEAMS] };
    return next;
  });
  await wait(50);
}

async function clickExpandIcon(host: HTMLElement, name: string): Promise<void> {
  const icon = findExpandIconForRowName(host, name);
  expect(icon, `expand icon for "${name}"`).toBeTruthy();
  icon!.click();
}

function mountLazyReExpandTable(): { host: HTMLDivElement; probe: ReExpandProbe } {
  const probe: ReExpandProbe = {
    expandSnapshots: [],
    fetchCount: 0,
    loadingTrueCount: 0,
  };

  const host = document.createElement("div");
  document.body.appendChild(host);
  container = host;
  root = createRoot(host);

  const Harness = () => {
    const [rows, setRows] = useState<DeptRow[]>(() => initialRows.map((row) => ({ ...row })));
    setRowsRef.current = setRows;

    return createElement(SimpleTable, {
      defaultHeaders: headers,
      rows,
      height: "320px",
      theme: "light",
      rowGrouping: ["teams"],
      expandAll: false,
      getRowId: (p) => String((p.row as unknown as DeptRow).id),
      onRowGroupExpand: async ({
        row,
        groupingKey,
        isExpanded,
        setLoading,
      }: OnRowGroupExpandProps) => {
        const childCount =
          groupingKey && Array.isArray(row[groupingKey])
            ? (row[groupingKey] as TeamRow[]).length
            : 0;
        probe.expandSnapshots.push({ childCount, isExpanded });

        if (!isExpanded) return;
        if (childCount > 0) return;

        probe.fetchCount++;
        setLoading(true);
        probe.loadingTrueCount++;
        await wait(50);
        setLoading(false);
        await wait(20);
        await commitLazyTeams();
      },
      animations: { enabled: true, duration: 300 },
    });
  };

  root!.render(createElement(Harness));
  return { host, probe };
}

/** Expand (lazy load) → collapse → re-expand. */
async function expandLoadCollapseAndReExpand(host: HTMLDivElement): Promise<void> {
  await clickExpandIcon(host, "Engineering");
  await waitFor(() => host.textContent?.includes("Frontend Team") ?? false);
  await wait(350);

  await clickExpandIcon(host, "Engineering");
  await wait(350);

  await clickExpandIcon(host, "Engineering");
}

describe("SimpleTable (React adapter) — onRowGroupExpand re-expand", () => {
  it("passes a row snapshot that includes already-loaded children on re-expand", async () => {
    const { host, probe } = mountLazyReExpandTable();
    await waitForElement(host, ".st-body-container .st-cell");
    await expandLoadCollapseAndReExpand(host);
    await wait(80);

    const expandedCalls = probe.expandSnapshots.filter((entry) => entry.isExpanded);
    expect(expandedCalls.length).toBeGreaterThanOrEqual(2);

    expect(
      expandedCalls[1].childCount,
      "re-expand should see cached teams on the row snapshot",
    ).toBe(LAZY_TEAMS.length);
  });

  it("does not re-fetch lazy-loaded children when re-expanding a cached group", async () => {
    const { host, probe } = mountLazyReExpandTable();
    await waitForElement(host, ".st-body-container .st-cell");
    await expandLoadCollapseAndReExpand(host);
    await wait(80);

    expect(probe.fetchCount, "lazy load should run only once across collapse/re-expand").toBe(1);
  });

  it("does not call setLoading when re-expanding a group with cached children", async () => {
    const { host, probe } = mountLazyReExpandTable();
    await waitForElement(host, ".st-body-container .st-cell");
    await expandLoadCollapseAndReExpand(host);
    await wait(80);

    expect(
      probe.loadingTrueCount,
      "setLoading(true) should run only on the first expand, not on re-expand",
    ).toBe(1);
  });
});

describe("SimpleTable (React adapter) — row group re-expand accordion animation", () => {
  it("does not render loading-skeleton rows when re-expanding cached lazy-loaded data", async () => {
    const { host } = mountLazyReExpandTable();
    await waitForElement(host, ".st-body-container .st-cell");

    await clickExpandIcon(host, "Engineering");
    await waitFor(() => host.textContent?.includes("Frontend Team") ?? false);
    await wait(350);

    await clickExpandIcon(host, "Engineering");
    await wait(350);

    await clickExpandIcon(host, "Engineering");
    await wait(15);

    expect(
      countLoadingSkeletonRows(host),
      "cached re-expand must not insert loading-skeleton rows",
    ).toBe(0);
  });

  it("does not mark sibling rows below with accordion grow on lazy re-expand", async () => {
    const { host, probe } = mountLazyReExpandTable();
    await waitForElement(host, ".st-body-container .st-cell");
    await expandLoadCollapseAndReExpand(host);

    expect(probe.fetchCount, "spurious re-fetch triggers extra accordion cycles").toBe(1);

    const salesCells = cellsForRowCustomId(host, "dept-2");
    expect(salesCells.length).toBeGreaterThan(0);
    for (const cell of salesCells) {
      expect(
        cell.dataset.stAccordionGrow,
        "sibling row below should shift, not play accordion grow",
      ).toBeUndefined();
    }
  });

  it("does not use accordion grow on lazy re-expand", async () => {
    const { host, probe } = mountLazyReExpandTable();
    await waitForElement(host, ".st-body-container .st-cell");

    await clickExpandIcon(host, "Engineering");
    await waitFor(() => host.textContent?.includes("Frontend Team") ?? false);
    await wait(350);

    await clickExpandIcon(host, "Engineering");
    await wait(350);

    await clickExpandIcon(host, "Engineering");

    expect(probe.loadingTrueCount, "re-expand must not re-enter loading state").toBe(1);

    const growingCells = host.querySelectorAll<HTMLElement>(
      '.st-cell[data-st-accordion-grow="vertical"]',
    );
    expect(growingCells.length, "row grouping must not use accordion grow").toBe(0);
  });
});
