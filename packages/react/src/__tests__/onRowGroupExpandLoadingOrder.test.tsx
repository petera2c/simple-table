import { createElement, useState, type Dispatch, type SetStateAction } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { OnRowGroupExpandProps, ReactColumnDef } from "../index";

// Lazy children have to show up either way:
//   setLoading(false) then setRows
//   setRows then setLoading(false)

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

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

async function waitForElement(scope: HTMLElement, selector: string): Promise<HTMLElement> {
  const start = Date.now();
  while (Date.now() - start < 3000) {
    const el = scope.querySelector<HTMLElement>(selector);
    if (el) return el;
    await wait(20);
  }
  throw new Error(`Timed out waiting for element: ${selector}`);
}

const headers: ReactColumnDef[] = [
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

const LAZY_TEAMS: TeamRow[] = [
  { id: "team-1", name: "Frontend Team" },
  { id: "team-2", name: "Backend Team" },
];

const initialRows: DeptRow[] = [
  { id: "dept-1", name: "Engineering", budget: 500_000 },
  { id: "dept-2", name: "Sales", budget: 300_000 },
];

const setRowsRef: { current: Dispatch<SetStateAction<DeptRow[]>> | null } = { current: null };

type CommitOrder = "loading-then-rows" | "rows-then-loading";

function findExpandIcon(host: HTMLElement): HTMLElement | null {
  const nameCell = Array.from(
    host.querySelectorAll<HTMLElement>('.st-cell[data-accessor="name"]'),
  ).find((cell) => cell.textContent?.includes("Engineering"));
  if (!nameCell) return null;
  const rowIndex = nameCell.getAttribute("data-row-index");
  if (rowIndex === null) return null;
  const rowCells = host.querySelectorAll<HTMLElement>(`.st-cell[data-row-index="${rowIndex}"]`);
  for (const cell of rowCells) {
    const icon = cell.querySelector(".st-expand-icon-container");
    if (icon && icon.getAttribute("aria-hidden") !== "true") {
      return icon as HTMLElement;
    }
  }
  return null;
}

function countLoadingSkeletonRows(host: HTMLElement): number {
  return host.querySelectorAll('.st-cell[data-row-id*="loading-skeleton"]').length;
}

function mountTable(order: CommitOrder): HTMLDivElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  container = host;
  root = createRoot(host);

  const Harness = () => {
    const [rows, setRows] = useState<DeptRow[]>(() => initialRows.map((row) => ({ ...row })));
    setRowsRef.current = setRows;

    return createElement(SimpleTable, {
      columns: headers,
      rows,
      height: "320px",
      theme: "light",
      rowGrouping: ["teams"],
      expandAll: false,
      animations: { enabled: false },
      getRowId: (p) => String((p.row as unknown as DeptRow).id),
      onRowGroupExpand: async ({
        isExpanded,
        setLoading,
        groupingKey,
        rowIndexPath,
      }: OnRowGroupExpandProps) => {
        if (!isExpanded) return;
        setLoading(true);
        await wait(40);
        const rowIndex = rowIndexPath[0];
        const commitRows = () => {
          if (typeof rowIndex !== "number" || !groupingKey) return;
          setRowsRef.current?.((prev) => {
            const next = prev.map((row) => ({ ...row }));
            next[rowIndex] = { ...next[rowIndex], [groupingKey]: [...LAZY_TEAMS] };
            return next;
          });
        };
        if (order === "loading-then-rows") {
          setLoading(false);
          commitRows();
        } else {
          commitRows();
          setLoading(false);
        }
      },
    });
  };

  root.render(createElement(Harness));
  return host;
}

async function expandAndExpectChildren(host: HTMLDivElement): Promise<void> {
  await waitForElement(host, ".st-body-container .st-cell");
  const icon = findExpandIcon(host);
  expect(icon).toBeTruthy();
  icon!.click();

  await waitFor(() => host.textContent?.includes("Frontend Team") ?? false);
  expect(countLoadingSkeletonRows(host)).toBe(0);
  expect(host.textContent).toContain("Backend Team");
}

describe("SimpleTable (React adapter) — onRowGroupExpand loading order", () => {
  it("renders lazy children when setLoading(false) runs before the rows update", async () => {
    const host = mountTable("loading-then-rows");
    await expandAndExpectChildren(host);
  });

  it("renders lazy children when the rows update runs before setLoading(false)", async () => {
    const host = mountTable("rows-then-loading");
    await expandAndExpectChildren(host);
  });
});
