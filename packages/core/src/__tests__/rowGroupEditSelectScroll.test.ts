import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableVanilla } from "../index";
import type { ColumnDef } from "../types/ColumnDef";

/**
 * Mixes editing, cell selection, custom cells, live updates, scrolling, and
 * row grouping with motion off. Cells that leave the view can be reused for
 * other rows, so values, badges, and selection must follow the right row
 * when we scroll back or reopen a group.
 */

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 4000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

async function flushRaf(rounds = 2): Promise<void> {
  for (let i = 0; i < rounds; i++) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }
}

type UserRow = { id: string; name: string; title: string; score: number };
type DeptRow = { id: string; name: string; title: string; score: number; users: UserRow[] };

function users(prefix: string, count: number): UserRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-user-${i}`,
    name: `${prefix} user ${i}`,
    title: `${prefix} title ${i}`,
    score: i,
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
  el.className = "st-test-title-badge st-test-title-styled";
  el.setAttribute("data-st-row-title", title);
  el.textContent = title;
  return el;
}

function cellLabel(cell: HTMLElement): string {
  const span = cell.querySelector(".st-cell-content");
  if (!span) return (cell.textContent ?? "").trim();
  const clone = span.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".st-expand-icon-container, input").forEach((el) => el.remove());
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

function selectedCells(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(".st-cell-selected, .st-cell-selected-first"),
  );
}

function selectedKeys(root: HTMLElement): string[] {
  return selectedCells(root)
    .map((cell) => `${cell.getAttribute("data-row-id")}::${cell.getAttribute("data-accessor")}`)
    .sort();
}

function cellPos(cell: HTMLElement) {
  return {
    rowIndex: Number(cell.getAttribute("data-row-index")),
    colIndex: Number(cell.getAttribute("data-col-index")),
    rowId: cell.getAttribute("data-row-id") ?? "",
  };
}

function cellByRow(root: HTMLElement, rowId: string, accessor: string): HTMLElement | null {
  return root.querySelector(`.st-cell[data-row-id="${rowId}"][data-accessor="${accessor}"]`);
}

function cellOnNamedRow(root: HTMLElement, name: string, accessor: string): HTMLElement | null {
  const nameCell = dataCell(root, "name", name);
  const rowId = nameCell?.getAttribute("data-row-id");
  if (!rowId) return null;
  return cellByRow(root, rowId, accessor);
}

async function scrollBody(root: HTMLElement, top: number): Promise<void> {
  const body = root.querySelector<HTMLElement>(".st-body-container");
  if (!body) throw new Error("Missing .st-body-container");
  let current = top;
  Object.defineProperty(body, "scrollTop", {
    configurable: true,
    get: () => current,
    set: (value: number) => {
      current = Number(value);
    },
  });
  Object.defineProperty(body, "clientHeight", {
    configurable: true,
    get: () => 200,
  });
  Object.defineProperty(body, "scrollHeight", {
    configurable: true,
    get: () => 4000,
  });
  body.dispatchEvent(new Event("scroll", { bubbles: true }));
  await flushRaf(3);
  await wait(180);
  await flushRaf(2);
}

async function commitEdit(root: HTMLElement, cell: HTMLElement, nextValue: string): Promise<void> {
  cell.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
  await waitFor(() => Boolean(root.querySelector(".editable-cell-input")));
  const input = root.querySelector<HTMLInputElement>(".editable-cell-input");
  if (!input) throw new Error("Edit input not found");
  input.value = nextValue;
  input.dispatchEvent(new Event("blur", { bubbles: true }));
  await waitFor(() => !root.querySelector(".editable-cell-input"));
}

const columns: ColumnDef[] = [
  {
    accessor: "name",
    label: "Name",
    width: 200,
    type: "string",
    expandable: true,
    pinned: "left",
    cellRenderer: ({ row }) => nameBadge(String((row as UserRow).name)),
  },
  {
    accessor: "title",
    label: "Title",
    width: 180,
    type: "string",
    editable: true,
    cellRenderer: ({ row }) => titleBadge(String((row as UserRow).title)),
  },
  { accessor: "score", label: "Score", width: 80, type: "number", editable: true },
];

function makeDepts(engCount = 80, salesCount = 8): DeptRow[] {
  return [
    {
      id: "eng",
      name: "Engineering",
      title: "Eng title",
      score: 100,
      users: users("Eng", engCount),
    },
    {
      id: "sales",
      name: "Sales",
      title: "Sales title",
      score: 50,
      users: users("Sales", salesCount),
    },
  ];
}

function mountTable(rows: DeptRow[] = makeDepts()) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const table = new SimpleTableVanilla(container, {
    columns,
    rows,
    getRowId: ({ row }) => String((row as { id: string }).id),
    height: "200px",
    customTheme: { rowHeight: 32, headerHeight: 32 },
    theme: "light",
    rowGrouping: ["users"],
    expandAll: true,
    selectableCells: true,
    animations: { enabled: false },
  });
  table.mount();
  return { table, container, api: table.getAPI(), rows };
}

const mounted: { table: SimpleTableVanilla<DeptRow>; container: HTMLDivElement }[] = [];

afterEach(() => {
  for (const entry of mounted.splice(0)) {
    entry.table.destroy();
    entry.container.remove();
  }
});

describe("edit, select, scroll, live update, and row grouping", () => {
  it("keeps an edited value, custom badges, a live update, and selection after scrolling away and back", async () => {
    const { table, container, api } = mountTable();
    mounted.push({ table, container });

    await waitFor(() => Boolean(dataCell(container, "title", "Eng title 0")));

    const titleCell = dataCell(container, "title", "Eng title 0")!;
    await commitEdit(container, titleCell, "Renamed title");
    await waitFor(() => Boolean(dataCell(container, "title", "Renamed title")));

    api.updateData({ rowId: "eng", accessor: "title", newValue: "HQ" });
    await waitFor(() => Boolean(dataCell(container, "title", "HQ")));

    const first = dataCell(container, "title", "Renamed title")!;
    const second = dataCell(container, "title", "Eng title 1")!;
    api.selectCellRange(
      {
        rowIndex: Number(first.getAttribute("data-row-index")),
        colIndex: Number(first.getAttribute("data-col-index")),
        rowId: first.getAttribute("data-row-id") ?? "",
      },
      {
        rowIndex: Number(second.getAttribute("data-row-index")),
        colIndex: Number(second.getAttribute("data-col-index")),
        rowId: second.getAttribute("data-row-id") ?? "",
      },
    );
    await wait(30);

    const selectedBefore = [...api.getSelectedCells()].sort();
    const selectedDomBefore = selectedKeys(container);
    const originalRowIds = new Set(selectedDomBefore.map((key) => key.split("::")[0]));
    expect(selectedBefore.length).toBeGreaterThanOrEqual(2);
    expect(selectedDomBefore.length).toBeGreaterThanOrEqual(2);

    expect(dataCell(container, "name", "Eng user 0")?.querySelector("[data-st-row-name='Eng user 0']")).toBeTruthy();
    expect(
      dataCell(container, "title", "Renamed title")?.querySelector(".st-test-title-styled"),
    ).toBeTruthy();

    await scrollBody(container, 2500);
    await waitFor(() => dataCell(container, "title", "Renamed title") === undefined);

    expect(api.getSelectedCells().size).toBe(selectedBefore.length);
    expect([...api.getSelectedCells()].sort()).toEqual(selectedBefore);

    for (const cell of selectedCells(container)) {
      expect(originalRowIds.has(cell.getAttribute("data-row-id") ?? "")).toBe(true);
    }

    await scrollBody(container, 0);
    await waitFor(() => Boolean(dataCell(container, "title", "Renamed title")));

    expect(dataCell(container, "title", "Renamed title")?.querySelector(".st-test-title-styled")).toBeTruthy();
    expect(dataCell(container, "title", "Renamed title")?.querySelector("[data-st-row-title='Renamed title']")).toBeTruthy();
    expect(dataCell(container, "title", "HQ")?.querySelector("[data-st-row-title='HQ']")).toBeTruthy();
    expect(dataCell(container, "name", "Eng user 0")?.querySelector("[data-st-row-name='Eng user 0']")).toBeTruthy();
    expect(selectedKeys(container)).toEqual(selectedDomBefore);
    expect([...api.getSelectedCells()].sort()).toEqual(selectedBefore);
  });

  it("does not leave selection styling on the wrong rows after a long scroll", async () => {
    const { table, container, api } = mountTable();
    mounted.push({ table, container });

    await waitFor(() => Boolean(dataCell(container, "title", "Eng title 0")));
    const first = dataCell(container, "title", "Eng title 0")!;
    const second = dataCell(container, "title", "Eng title 1")!;
    const selectedRowIds = new Set([
      first.getAttribute("data-row-id"),
      second.getAttribute("data-row-id"),
    ]);
    api.selectCellRange(
      {
        rowIndex: Number(first.getAttribute("data-row-index")),
        colIndex: Number(first.getAttribute("data-col-index")),
        rowId: first.getAttribute("data-row-id") ?? "",
      },
      {
        rowIndex: Number(second.getAttribute("data-row-index")),
        colIndex: Number(second.getAttribute("data-col-index")),
        rowId: second.getAttribute("data-row-id") ?? "",
      },
    );
    await wait(30);

    await scrollBody(container, 2500);
    await waitFor(() => dataCell(container, "title", "Eng title 0") === undefined);

    for (const cell of selectedCells(container)) {
      expect(selectedRowIds.has(cell.getAttribute("data-row-id"))).toBe(true);
    }

    await scrollBody(container, 0);
    await waitFor(() => Boolean(dataCell(container, "title", "Eng title 0")));

    const selectedAfter = selectedCells(container).filter((cell) => cell.getAttribute("data-accessor") === "title");
    expect(selectedAfter.length).toBeGreaterThanOrEqual(2);
    expect(selectedAfter.every((cell) => selectedRowIds.has(cell.getAttribute("data-row-id")))).toBe(
      true,
    );
  });

  it("keeps an edited child value after collapsing and reopening the group", async () => {
    const { table, container } = mountTable();
    mounted.push({ table, container });

    await waitFor(() => Boolean(dataCell(container, "title", "Eng title 0")));
    await commitEdit(container, dataCell(container, "title", "Eng title 0")!, "Kept after toggle");
    await waitFor(() => Boolean(dataCell(container, "title", "Kept after toggle")));

    findExpandIcon(container, "Engineering")!.click();
    await waitFor(() => dataCell(container, "title", "Kept after toggle") === undefined);
    expect(dataCell(container, "name", "Sales")).toBeTruthy();

    findExpandIcon(container, "Engineering")!.click();
    await waitFor(() => Boolean(dataCell(container, "title", "Kept after toggle")));
    expect(
      dataCell(container, "title", "Kept after toggle")?.querySelector(".st-test-title-styled"),
    ).toBeTruthy();
  });

  it("applies a live update to a custom cell that was off screen, then shows it on scroll back", async () => {
    const { table, container, api } = mountTable();
    mounted.push({ table, container });

    await waitFor(() => Boolean(dataCell(container, "title", "Eng title")));
    await scrollBody(container, 2500);
    await waitFor(() => dataCell(container, "title", "Eng title") === undefined);

    api.updateData({ rowId: "eng", accessor: "title", newValue: "Offscreen HQ" });
    await wait(50);

    await scrollBody(container, 0);
    await waitFor(() => Boolean(dataCell(container, "title", "Offscreen HQ")));
    expect(dataCell(container, "title", "Offscreen HQ")?.querySelector(".st-test-title-styled")).toBeTruthy();
  });

  it("updates a selected custom cell while it is off screen and keeps the highlight", async () => {
    const { table, container, api, rows } = mountTable();
    mounted.push({ table, container });

    await waitFor(() => Boolean(dataCell(container, "title", "Eng title 0")));
    const first = dataCell(container, "title", "Eng title 0")!;
    const second = dataCell(container, "title", "Eng title 1")!;
    const firstKey = `${first.getAttribute("data-row-id")}::title`;
    const secondKey = `${second.getAttribute("data-row-id")}::title`;
    api.selectCellRange(cellPos(first), cellPos(second));
    await wait(30);
    const selectedBefore = [...api.getSelectedCells()].sort();

    await scrollBody(container, 2500);
    await waitFor(() => dataCell(container, "title", "Eng title 0") === undefined);

    const nextRows: DeptRow[] = rows.map((dept) =>
      dept.id !== "eng"
        ? dept
        : {
            ...dept,
            users: dept.users.map((user) =>
              user.id === "Eng-user-0" ? { ...user, title: "Live selected" } : user,
            ),
          },
    );
    table.update({ rows: nextRows });
    await wait(50);
    expect([...api.getSelectedCells()].sort()).toEqual(selectedBefore);

    await scrollBody(container, 0);
    await waitFor(() => Boolean(dataCell(container, "title", "Live selected")));
    expect(dataCell(container, "title", "Live selected")?.querySelector(".st-test-title-styled")).toBeTruthy();
    expect(dataCell(container, "title", "Live selected")?.querySelector("[data-st-row-title='Live selected']")).toBeTruthy();
    expect(selectedKeys(container)).toContain(firstKey);
    expect(selectedKeys(container)).toContain(secondKey);
    expect([...api.getSelectedCells()].sort()).toEqual(selectedBefore);
  });

  it("keeps an edit in a later group after scrolling to the top and back", async () => {
    const { table, container, rows } = mountTable(makeDepts(30, 8));
    mounted.push({ table, container });

    await waitFor(() => Boolean(dataCell(container, "title", "Eng title 0")));
    await scrollBody(container, 900);
    await waitFor(() => Boolean(dataCell(container, "title", "Sales title 0")));

    await commitEdit(container, dataCell(container, "title", "Sales title 0")!, "Sales renamed");
    await waitFor(() => Boolean(dataCell(container, "title", "Sales renamed")));
    expect(rows[1].users[0].title).toBe("Sales renamed");

    await scrollBody(container, 0);
    await waitFor(() => Boolean(dataCell(container, "title", "Eng title 0")));
    expect(dataCell(container, "title", "Sales renamed")).toBeUndefined();

    await scrollBody(container, 900);
    await waitFor(() => Boolean(dataCell(container, "title", "Sales renamed")));
    expect(dataCell(container, "title", "Sales renamed")?.querySelector(".st-test-title-styled")).toBeTruthy();
    expect(dataCell(container, "name", "Sales user 0")?.querySelector("[data-st-row-name='Sales user 0']")).toBeTruthy();
  });

  it("keeps a plain edited number next to a custom name badge after scroll", async () => {
    const { table, container } = mountTable();
    mounted.push({ table, container });

    await waitFor(() => Boolean(cellOnNamedRow(container, "Eng user 0", "score")));
    await commitEdit(container, cellOnNamedRow(container, "Eng user 0", "score")!, "99");
    await waitFor(() => cellOnNamedRow(container, "Eng user 0", "score")?.textContent?.includes("99") === true);

    await scrollBody(container, 2500);
    await waitFor(() => cellOnNamedRow(container, "Eng user 0", "score") === null);

    await scrollBody(container, 0);
    await waitFor(() => Boolean(cellOnNamedRow(container, "Eng user 0", "score")));
    expect(cellOnNamedRow(container, "Eng user 0", "score")?.textContent).toContain("99");
    expect(dataCell(container, "name", "Eng user 0")?.querySelector("[data-st-row-name='Eng user 0']")).toBeTruthy();
  });
});
