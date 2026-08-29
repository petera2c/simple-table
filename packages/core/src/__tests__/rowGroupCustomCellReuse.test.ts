import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableVanilla } from "../index";
import type { ColumnDef } from "../types/ColumnDef";
import type { SimpleTableConfig } from "../types/SimpleTableConfig";
import { readExpandChromeKind } from "../utils/bodyCell/content";

/**
 * Group expand/collapse with motion off reuses on-screen cells. Custom cells
 * must show the new row's content, including when a group Name cell (caret)
 * is reused as a different group's Name cell (still a caret).
 */

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

type UserRow = { id: string; name: string; title: string };
type DeptRow = { id: string; name: string; title: string; users: UserRow[] };
type RegionRow = { id: string; name: string; title: string; depts: DeptRow[] };

function users(prefix: string, count: number): UserRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-user-${i}`,
    name: `${prefix} user ${i}`,
    title: `${prefix} title ${i}`,
  }));
}

function nameBadge(name: string): HTMLElement {
  const el = document.createElement("span");
  el.className = "st-test-name-badge";
  el.setAttribute("data-st-row-name", name);
  el.textContent = name;
  return el;
}

function titleBadge(title: string): HTMLElement {
  const el = document.createElement("span");
  el.className = "st-test-title-badge";
  el.setAttribute("data-st-row-title", title);
  el.textContent = title;
  return el;
}

function cellLabel(cell: HTMLElement): string {
  const span = cell.querySelector(".st-cell-content");
  if (!span) return (cell.textContent ?? "").trim();
  const clone = span.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".st-expand-icon-container").forEach((el) => el.remove());
  return (clone.textContent ?? "").trim();
}

function dataCell(root: HTMLElement, accessor: string, label: string): HTMLElement | undefined {
  return Array.from(root.querySelectorAll<HTMLElement>(`.st-cell[data-accessor="${accessor}"]`)).find(
    (cell) => cellLabel(cell) === label,
  );
}

function findExpandIcon(root: HTMLElement, name: string): HTMLElement | null {
  const cell = dataCell(root, "name", name);
  if (!cell) return null;
  return cell.querySelector(".st-expand-icon-container:not(.placeholder)");
}

function nameBadgeIn(root: HTMLElement, name: string): HTMLElement | null {
  const cell = dataCell(root, "name", name);
  if (!cell) return null;
  return cell.querySelector<HTMLElement>(`.st-test-name-badge[data-st-row-name="${name}"]`);
}

function titleBadgeIn(root: HTMLElement, title: string): HTMLElement | null {
  return root.querySelector<HTMLElement>(`.st-test-title-badge[data-st-row-title="${title}"]`);
}

function mountTable(config: SimpleTableConfig) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const table = new SimpleTableVanilla(container, {
    getRowId: ({ row }) => String((row as { id: string }).id),
    height: "200px",
    customTheme: { rowHeight: 32, headerHeight: 32 },
    theme: "light",
    expandAll: true,
    animations: { enabled: false },
    ...config,
  });
  table.mount();
  return { table, container };
}

const mounted: { table: SimpleTableVanilla; container: HTMLDivElement }[] = [];

afterEach(() => {
  for (const entry of mounted.splice(0)) {
    entry.table.destroy();
    entry.container.remove();
  }
});

describe("custom cells with row grouping and motion off", () => {
  it("shows the new group name in a DOM custom cell after collapsing a large group", async () => {
    const depts: DeptRow[] = [
      { id: "eng", name: "Engineering", title: "Eng title", users: users("Eng", 50) },
      { id: "sales", name: "Sales", title: "Sales title", users: users("Sales", 8) },
      { id: "ops", name: "Ops", title: "Ops title", users: users("Ops", 1) },
    ];
    const columns: ColumnDef[] = [
      {
        accessor: "name",
        label: "Name",
        width: 220,
        type: "string",
        expandable: true,
        pinned: "left",
        cellRenderer: ({ row }) => nameBadge(String((row as UserRow).name)),
      },
      { accessor: "id", label: "Id", width: 80, type: "string" },
    ];
    const { table, container } = mountTable({ columns, rows: depts, rowGrouping: ["users"] });
    mounted.push({ table, container });

    await waitFor(() => Boolean(findExpandIcon(container, "Engineering")));
    expect(nameBadgeIn(container, "Engineering")).toBeTruthy();
    expect(dataCell(container, "name", "Sales")).toBeUndefined();

    findExpandIcon(container, "Engineering")!.click();
    await waitFor(() => Boolean(dataCell(container, "name", "Sales")));

    expect(nameBadgeIn(container, "Sales")).toBeTruthy();
    expect(nameBadgeIn(container, "Ops")).toBeTruthy();
    expect(dataCell(container, "name", "Engineering")?.querySelector("[data-st-row-name='Engineering']")).toBeTruthy();
    expect(findExpandIcon(container, "Sales")).toBeTruthy();
  });

  it("updates a string custom cell on the grouping column after collapse", async () => {
    const depts: DeptRow[] = [
      { id: "eng", name: "Engineering", title: "Eng title", users: users("Eng", 50) },
      { id: "sales", name: "Sales", title: "Sales title", users: users("Sales", 8) },
    ];
    const columns: ColumnDef[] = [
      {
        accessor: "name",
        label: "Name",
        width: 220,
        type: "string",
        expandable: true,
        cellRenderer: ({ value }) => `★ ${String(value ?? "")}`,
      },
      { accessor: "id", label: "Id", width: 80, type: "string" },
    ];
    const { table, container } = mountTable({ columns, rows: depts, rowGrouping: ["users"] });
    mounted.push({ table, container });

    await waitFor(() => Boolean(findExpandIcon(container, "★ Engineering")));
    findExpandIcon(container, "★ Engineering")!.click();
    await waitFor(() => Boolean(dataCell(container, "name", "★ Sales")));

    expect(dataCell(container, "name", "★ Sales")).toBeTruthy();
    expect(dataCell(container, "name", "★ Engineering")).toBeTruthy();
  });

  it("updates a custom cell on a non-grouping column after collapse", async () => {
    const depts: DeptRow[] = [
      { id: "eng", name: "Engineering", title: "Eng title", users: users("Eng", 50) },
      { id: "sales", name: "Sales", title: "Sales title", users: users("Sales", 8) },
    ];
    const columns: ColumnDef[] = [
      { accessor: "name", label: "Name", width: 220, type: "string", expandable: true, pinned: "left" },
      {
        accessor: "title",
        label: "Title",
        width: 160,
        type: "string",
        cellRenderer: ({ row }) => titleBadge(String((row as UserRow).title)),
      },
    ];
    const { table, container } = mountTable({ columns, rows: depts, rowGrouping: ["users"] });
    mounted.push({ table, container });

    await waitFor(() => Boolean(findExpandIcon(container, "Engineering")));
    expect(titleBadgeIn(container, "Eng title")).toBeTruthy();
    expect(titleBadgeIn(container, "Sales title")).toBeNull();

    findExpandIcon(container, "Engineering")!.click();
    await waitFor(() => Boolean(dataCell(container, "name", "Sales")));

    expect(titleBadgeIn(container, "Sales title")).toBeTruthy();
    expect(titleBadgeIn(container, "Eng title")).toBeTruthy();
  });

  it("keeps custom grouping cells correct when the expandable column is not first", async () => {
    const depts: DeptRow[] = [
      { id: "eng", name: "Engineering", title: "Eng title", users: users("Eng", 50) },
      { id: "sales", name: "Sales", title: "Sales title", users: users("Sales", 8) },
    ];
    const columns: ColumnDef[] = [
      { accessor: "id", label: "Id", width: 80, type: "string" },
      {
        accessor: "name",
        label: "Name",
        width: 220,
        type: "string",
        expandable: true,
        cellRenderer: ({ row }) => nameBadge(String((row as UserRow).name)),
      },
    ];
    const { table, container } = mountTable({ columns, rows: depts, rowGrouping: ["users"] });
    mounted.push({ table, container });

    await waitFor(() => Boolean(findExpandIcon(container, "Engineering")));
    findExpandIcon(container, "Engineering")!.click();
    await waitFor(() => Boolean(nameBadgeIn(container, "Sales")));

    expect(nameBadgeIn(container, "Sales")).toBeTruthy();
    expect(findExpandIcon(container, "Sales")).toBeTruthy();
    expect(findExpandIcon(container, "Engineering")).toBeTruthy();
  });

  it("shows the new region's custom cell after collapsing another expanded region (two grouping levels)", async () => {
    const regions: RegionRow[] = [
      {
        id: "east",
        name: "East",
        title: "East title",
        depts: [
          { id: "eng", name: "Engineering", title: "Eng title", users: users("Eng", 50) },
          { id: "sales", name: "Sales", title: "Sales title", users: users("Sales", 4) },
        ],
      },
      {
        id: "west",
        name: "West",
        title: "West title",
        depts: [{ id: "ops", name: "Ops", title: "Ops title", users: users("Ops", 2) }],
      },
    ];
    const columns: ColumnDef[] = [
      {
        accessor: "name",
        label: "Name",
        width: 220,
        type: "string",
        expandable: true,
        pinned: "left",
        cellRenderer: ({ row }) => nameBadge(String((row as UserRow).name)),
      },
      { accessor: "id", label: "Id", width: 80, type: "string" },
    ];
    const { table, container } = mountTable({
      columns,
      rows: regions,
      rowGrouping: ["depts", "users"],
    });
    mounted.push({ table, container });

    await waitFor(() => Boolean(findExpandIcon(container, "East")));
    expect(nameBadgeIn(container, "East")).toBeTruthy();
    expect(nameBadgeIn(container, "Engineering")).toBeTruthy();
    expect(dataCell(container, "name", "West")).toBeUndefined();

    findExpandIcon(container, "East")!.click();
    await waitFor(() => Boolean(dataCell(container, "name", "West")));

    expect(nameBadgeIn(container, "West")).toBeTruthy();
    expect(nameBadgeIn(container, "East")).toBeTruthy();
    expect(dataCell(container, "name", "Engineering")).toBeUndefined();
    expect(findExpandIcon(container, "West")).toBeTruthy();

    const westCell = dataCell(container, "name", "West")!;
    expect(readExpandChromeKind(westCell.querySelector(".st-cell-content") ?? westCell)).toBe("icon");
    findExpandIcon(container, "West")!.click();
    await waitFor(() => dataCell(container, "name", "Ops") === undefined);
    expect(nameBadgeIn(container, "West")).toBeTruthy();
  });
});
