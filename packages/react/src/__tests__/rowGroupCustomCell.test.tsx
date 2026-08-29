import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactColumnDef } from "../index";

/**
 * React custom cells sit in portals. Group expand/collapse with motion off
 * reuses on-screen cells, so a reused grouping cell must remount the portal
 * for the new row, not keep the previous row's badge.
 */

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(() => {
  root?.unmount();
  root = null;
  container?.remove();
  container = null;
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 4000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

function cellLabel(cell: HTMLElement): string {
  const span = cell.querySelector(".st-cell-content");
  if (!span) return (cell.textContent ?? "").trim();
  const clone = span.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".st-expand-icon-container").forEach((el) => el.remove());
  return (clone.textContent ?? "").trim();
}

function nameCell(host: HTMLElement, name: string): HTMLElement | undefined {
  return Array.from(host.querySelectorAll<HTMLElement>('.st-cell[data-accessor="name"]')).find(
    (cell) => cellLabel(cell) === name,
  );
}

function findExpandIcon(host: HTMLElement, name: string): HTMLElement | null {
  const cell = nameCell(host, name);
  if (!cell) return null;
  return cell.querySelector(".st-expand-icon-container:not(.placeholder)");
}

type UserRow = { id: string; name: string };
type DeptRow = { id: string; name: string; users: UserRow[] };
type RegionRow = { id: string; name: string; depts: DeptRow[] };

function users(prefix: string, count: number): UserRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-user-${i}`,
    name: `${prefix} user ${i}`,
  }));
}

function NameBadge({ name }: { name: string }) {
  return createElement("span", { className: "st-test-name-badge", "data-st-row-name": name }, name);
}

const columns: ReactColumnDef[] = [
  {
    accessor: "name",
    label: "Name",
    width: 220,
    type: "string",
    expandable: true,
    pinned: "left",
    cellRenderer: ({ row }) => createElement(NameBadge, { name: String((row as UserRow).name) }),
  },
  { accessor: "id", label: "Id", width: 80, type: "string" },
];

function mountGroupedTable(rows: DeptRow[] | RegionRow[], rowGrouping: string[]) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  container = host;
  root = createRoot(host);
  root.render(
    createElement(SimpleTable, {
      columns,
      rows,
      getRowId: (p: { row: unknown }) => String((p.row as { id: string }).id),
      height: "200px",
      customTheme: { rowHeight: 32, headerHeight: 32 },
      theme: "light",
      rowGrouping,
      expandAll: true,
      animations: { enabled: false },
    }),
  );
  return host;
}

describe("SimpleTable (React) — custom cells with row grouping", () => {
  it("shows the new group badge after collapsing a large group", async () => {
    const depts: DeptRow[] = [
      { id: "eng", name: "Engineering", users: users("Eng", 50) },
      { id: "sales", name: "Sales", users: users("Sales", 8) },
    ];
    const host = mountGroupedTable(depts, ["users"]);

    await waitFor(() => Boolean(findExpandIcon(host, "Engineering")));
    expect(host.querySelector('[data-st-row-name="Engineering"]')).toBeTruthy();
    expect(nameCell(host, "Sales")).toBeUndefined();

    findExpandIcon(host, "Engineering")!.click();
    await waitFor(() => Boolean(nameCell(host, "Sales")));

    expect(nameCell(host, "Sales")?.querySelector('[data-st-row-name="Sales"]')).toBeTruthy();
    expect(findExpandIcon(host, "Sales")).toBeTruthy();
  });

  it("shows the new region badge after collapsing another expanded region", async () => {
    const regions: RegionRow[] = [
      {
        id: "east",
        name: "East",
        depts: [
          { id: "eng", name: "Engineering", users: users("Eng", 50) },
          { id: "sales", name: "Sales", users: users("Sales", 4) },
        ],
      },
      {
        id: "west",
        name: "West",
        depts: [{ id: "ops", name: "Ops", users: users("Ops", 2) }],
      },
    ];
    const host = mountGroupedTable(regions, ["depts", "users"]);

    await waitFor(() => Boolean(findExpandIcon(host, "East")));
    expect(host.querySelector('[data-st-row-name="East"]')).toBeTruthy();
    expect(nameCell(host, "West")).toBeUndefined();

    findExpandIcon(host, "East")!.click();
    await waitFor(() => Boolean(nameCell(host, "West")));

    expect(nameCell(host, "West")?.querySelector('[data-st-row-name="West"]')).toBeTruthy();
    expect(nameCell(host, "East")?.querySelector('[data-st-row-name="East"]')).toBeTruthy();
    expect(findExpandIcon(host, "West")).toBeTruthy();
  });
});
