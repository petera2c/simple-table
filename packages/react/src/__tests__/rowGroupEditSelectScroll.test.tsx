import { createElement, createRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTable } from "../index";
import type { ReactColumnDef, TableAPI } from "../index";

/**
 * React custom cells use portals. Edit, select, live-update, then scroll away
 * and back with grouping on and motion off. The portal and selection styling
 * must match the row that is actually showing.
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

function NameBadge({ name }: { name: string }) {
  return createElement("span", { className: "st-test-name-badge", "data-st-row-name": name }, name);
}

function TitleBadge({ title }: { title: string }) {
  return createElement(
    "span",
    { className: "st-test-title-badge st-test-title-styled", "data-st-row-title": title },
    title,
  );
}

function cellLabel(cell: HTMLElement): string {
  const span = cell.querySelector(".st-cell-content");
  if (!span) return (cell.textContent ?? "").trim();
  const clone = span.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".st-expand-icon-container, input").forEach((el) => el.remove());
  return (clone.textContent ?? "").trim();
}

function dataCell(host: HTMLElement, accessor: string, label: string): HTMLElement | undefined {
  return Array.from(host.querySelectorAll<HTMLElement>(`.st-cell[data-accessor="${accessor}"]`)).find(
    (cell) => cellLabel(cell) === label,
  );
}

function findExpandIcon(host: HTMLElement, name: string): HTMLElement | null {
  const cell = dataCell(host, "name", name);
  if (!cell) return null;
  return cell.querySelector(".st-expand-icon-container:not(.placeholder)");
}

function selectedCells(host: HTMLElement): HTMLElement[] {
  return Array.from(
    host.querySelectorAll<HTMLElement>(".st-cell-selected, .st-cell-selected-first"),
  );
}

function cellPos(cell: HTMLElement) {
  return {
    rowIndex: Number(cell.getAttribute("data-row-index")),
    colIndex: Number(cell.getAttribute("data-col-index")),
    rowId: cell.getAttribute("data-row-id") ?? "",
  };
}

function cellByRow(host: HTMLElement, rowId: string, accessor: string): HTMLElement | null {
  return host.querySelector(`.st-cell[data-row-id="${rowId}"][data-accessor="${accessor}"]`);
}

function cellOnNamedRow(host: HTMLElement, name: string, accessor: string): HTMLElement | null {
  const nameCell = dataCell(host, "name", name);
  const rowId = nameCell?.getAttribute("data-row-id");
  if (!rowId) return null;
  return cellByRow(host, rowId, accessor);
}

function selectedKeys(host: HTMLElement): string[] {
  return Array.from(host.querySelectorAll<HTMLElement>(".st-cell-selected, .st-cell-selected-first"))
    .map((cell) => `${cell.getAttribute("data-row-id")}::${cell.getAttribute("data-accessor")}`)
    .sort();
}

async function scrollBody(host: HTMLElement, top: number): Promise<void> {
  const body = host.querySelector<HTMLElement>(".st-body-container");
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

async function commitEdit(host: HTMLElement, cell: HTMLElement, nextValue: string): Promise<void> {
  cell.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
  await waitFor(() => Boolean(host.querySelector(".editable-cell-input")));
  const input = host.querySelector<HTMLInputElement>(".editable-cell-input");
  if (!input) throw new Error("Edit input not found");
  input.value = nextValue;
  input.dispatchEvent(new Event("blur", { bubbles: true }));
  await waitFor(() => !host.querySelector(".editable-cell-input"));
}

const columns: ReactColumnDef[] = [
  {
    accessor: "name",
    label: "Name",
    width: 200,
    type: "string",
    expandable: true,
    pinned: "left",
    cellRenderer: ({ row }) => createElement(NameBadge, { name: String((row as UserRow).name) }),
  },
  {
    accessor: "title",
    label: "Title",
    width: 180,
    type: "string",
    editable: true,
    cellRenderer: ({ row }) => createElement(TitleBadge, { title: String((row as UserRow).title) }),
  },
  { accessor: "score", label: "Score", width: 80, type: "number", editable: true },
];

function makeDepts(engCount = 80, salesCount = 8): DeptRow[] {
  return [
    { id: "eng", name: "Engineering", title: "Eng title", score: 100, users: users("Eng", engCount) },
    { id: "sales", name: "Sales", title: "Sales title", score: 50, users: users("Sales", salesCount) },
  ];
}

function mountKitchenSink(depts: DeptRow[] = makeDepts()) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  container = host;
  root = createRoot(host);
  const tableRef = createRef<TableAPI>();
  const render = (rows: DeptRow[]) => {
    root!.render(
      createElement(SimpleTable, {
        ref: tableRef,
        columns,
        rows,
        getRowId: (p: { row: unknown }) => String((p.row as { id: string }).id),
        height: "200px",
        customTheme: { rowHeight: 32, headerHeight: 32 },
        theme: "light",
        rowGrouping: ["users"],
        expandAll: true,
        selectableCells: true,
        animations: { enabled: false },
      }),
    );
  };
  render(depts);
  return { host, tableRef, render, depts };
}

describe("SimpleTable (React) — edit, select, scroll, live update, grouping", () => {
  it("keeps portal badges, an edited value, a live update, and selection after scrolling away and back", async () => {
    const { host, tableRef } = mountKitchenSink();
    await waitFor(() => tableRef.current != null);
    await waitFor(() => Boolean(dataCell(host, "title", "Eng title 0")));
    const api = tableRef.current!;

    await commitEdit(host, dataCell(host, "title", "Eng title 0")!, "Renamed title");
    await waitFor(() => Boolean(dataCell(host, "title", "Renamed title")));

    api.updateData({ rowId: "eng", accessor: "title", newValue: "HQ" });
    await waitFor(() => Boolean(dataCell(host, "title", "HQ")));

    const first = dataCell(host, "title", "Renamed title")!;
    const second = dataCell(host, "title", "Eng title 1")!;
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
    const selectedDomBefore = selectedKeys(host);
    expect(selectedBefore.length).toBeGreaterThanOrEqual(2);

    await scrollBody(host, 2500);
    await waitFor(() => dataCell(host, "title", "Renamed title") === undefined);
    expect([...api.getSelectedCells()].sort()).toEqual(selectedBefore);

    await scrollBody(host, 0);
    await waitFor(() => Boolean(dataCell(host, "title", "Renamed title")));

    expect(dataCell(host, "title", "Renamed title")?.querySelector("[data-st-row-title='Renamed title']")).toBeTruthy();
    expect(dataCell(host, "title", "Renamed title")?.querySelector(".st-test-title-styled")).toBeTruthy();
    expect(dataCell(host, "title", "HQ")?.querySelector("[data-st-row-title='HQ']")).toBeTruthy();
    expect(dataCell(host, "name", "Eng user 0")?.querySelector("[data-st-row-name='Eng user 0']")).toBeTruthy();
    expect(selectedKeys(host)).toEqual(selectedDomBefore);
    expect([...api.getSelectedCells()].sort()).toEqual(selectedBefore);
  });

  it("does not leave selection styling on the wrong rows after a long scroll", async () => {
    const { host, tableRef } = mountKitchenSink();
    await waitFor(() => tableRef.current != null);
    await waitFor(() => Boolean(dataCell(host, "title", "Eng title 0")));
    const api = tableRef.current!;

    const selectedRowIds = new Set([
      dataCell(host, "title", "Eng title 0")!.getAttribute("data-row-id"),
      dataCell(host, "title", "Eng title 1")!.getAttribute("data-row-id"),
    ]);
    api.selectCellRange(
      cellPos(dataCell(host, "title", "Eng title 0")!),
      cellPos(dataCell(host, "title", "Eng title 1")!),
    );
    await wait(30);

    await scrollBody(host, 2500);
    await waitFor(() => dataCell(host, "title", "Eng title 0") === undefined);

    for (const cell of selectedCells(host)) {
      expect(selectedRowIds.has(cell.getAttribute("data-row-id"))).toBe(true);
    }

    await scrollBody(host, 0);
    await waitFor(() => Boolean(dataCell(host, "title", "Eng title 0")));

    const selectedAfter = selectedCells(host).filter((cell) => cell.getAttribute("data-accessor") === "title");
    expect(selectedAfter.length).toBeGreaterThanOrEqual(2);
    expect(selectedAfter.every((cell) => selectedRowIds.has(cell.getAttribute("data-row-id")))).toBe(true);
  });

  it("keeps an edited child value after collapsing and reopening the group", async () => {
    const { host, tableRef } = mountKitchenSink();
    await waitFor(() => tableRef.current != null);
    await waitFor(() => Boolean(dataCell(host, "title", "Eng title 0")));

    await commitEdit(host, dataCell(host, "title", "Eng title 0")!, "Kept after toggle");
    await waitFor(() => Boolean(dataCell(host, "title", "Kept after toggle")));

    findExpandIcon(host, "Engineering")!.click();
    await waitFor(() => dataCell(host, "title", "Kept after toggle") === undefined);
    await waitFor(() => Boolean(dataCell(host, "name", "Sales")));

    findExpandIcon(host, "Engineering")!.click();
    await waitFor(() => Boolean(dataCell(host, "title", "Kept after toggle")));
    expect(dataCell(host, "title", "Kept after toggle")?.querySelector(".st-test-title-styled")).toBeTruthy();
    expect(dataCell(host, "title", "Kept after toggle")?.querySelector("[data-st-row-title='Kept after toggle']")).toBeTruthy();
  });

  it("applies a live update to a custom cell that was off screen, then shows it on scroll back", async () => {
    const { host, tableRef } = mountKitchenSink();
    await waitFor(() => tableRef.current != null);
    await waitFor(() => Boolean(dataCell(host, "title", "Eng title")));
    const api = tableRef.current!;

    await scrollBody(host, 2500);
    await waitFor(() => dataCell(host, "title", "Eng title") === undefined);

    api.updateData({ rowId: "eng", accessor: "title", newValue: "Offscreen HQ" });
    await wait(50);

    await scrollBody(host, 0);
    await waitFor(() => Boolean(dataCell(host, "title", "Offscreen HQ")));
    expect(dataCell(host, "title", "Offscreen HQ")?.querySelector(".st-test-title-styled")).toBeTruthy();
  });

  it("updates a selected custom cell while it is off screen and keeps the highlight", async () => {
    const { host, tableRef, render, depts } = mountKitchenSink();
    await waitFor(() => tableRef.current != null);
    await waitFor(() => Boolean(dataCell(host, "title", "Eng title 0")));
    const api = tableRef.current!;

    const first = dataCell(host, "title", "Eng title 0")!;
    const second = dataCell(host, "title", "Eng title 1")!;
    const firstKey = `${first.getAttribute("data-row-id")}::title`;
    const secondKey = `${second.getAttribute("data-row-id")}::title`;
    api.selectCellRange(cellPos(first), cellPos(second));
    await wait(30);
    const selectedBefore = [...api.getSelectedCells()].sort();

    await scrollBody(host, 2500);
    await waitFor(() => dataCell(host, "title", "Eng title 0") === undefined);

    render(
      depts.map((dept) =>
        dept.id !== "eng"
          ? dept
          : {
              ...dept,
              users: dept.users.map((user) =>
                user.id === "Eng-user-0" ? { ...user, title: "Live selected" } : user,
              ),
            },
      ),
    );
    await wait(50);
    expect([...api.getSelectedCells()].sort()).toEqual(selectedBefore);

    await scrollBody(host, 0);
    await waitFor(() => Boolean(dataCell(host, "title", "Live selected")));
    expect(dataCell(host, "title", "Live selected")?.querySelector(".st-test-title-styled")).toBeTruthy();
    expect(selectedKeys(host)).toContain(firstKey);
    expect(selectedKeys(host)).toContain(secondKey);
    expect([...api.getSelectedCells()].sort()).toEqual(selectedBefore);
  });

  it("keeps an edit in a later group after scrolling to the top and back", async () => {
    const { host, tableRef } = mountKitchenSink(makeDepts(30, 8));
    await waitFor(() => tableRef.current != null);
    await waitFor(() => Boolean(dataCell(host, "title", "Eng title 0")));

    await scrollBody(host, 900);
    await waitFor(() => Boolean(dataCell(host, "title", "Sales title 0")));

    await commitEdit(host, dataCell(host, "title", "Sales title 0")!, "Sales renamed");
    await waitFor(() => Boolean(dataCell(host, "title", "Sales renamed")));

    await scrollBody(host, 0);
    await waitFor(() => Boolean(dataCell(host, "title", "Eng title 0")));
    expect(dataCell(host, "title", "Sales renamed")).toBeUndefined();

    await scrollBody(host, 900);
    await waitFor(() => Boolean(dataCell(host, "title", "Sales renamed")));
    expect(dataCell(host, "title", "Sales renamed")?.querySelector(".st-test-title-styled")).toBeTruthy();
    expect(dataCell(host, "name", "Sales user 0")?.querySelector("[data-st-row-name='Sales user 0']")).toBeTruthy();
  });

  it("keeps a plain edited number next to a custom name badge after scroll", async () => {
    const { host, tableRef } = mountKitchenSink();
    await waitFor(() => tableRef.current != null);
    await waitFor(() => Boolean(cellOnNamedRow(host, "Eng user 0", "score")));

    await commitEdit(host, cellOnNamedRow(host, "Eng user 0", "score")!, "99");
    await waitFor(() => cellOnNamedRow(host, "Eng user 0", "score")?.textContent?.includes("99") === true);

    await scrollBody(host, 2500);
    await waitFor(() => cellOnNamedRow(host, "Eng user 0", "score") === null);

    await scrollBody(host, 0);
    await waitFor(() => Boolean(cellOnNamedRow(host, "Eng user 0", "score")));
    expect(cellOnNamedRow(host, "Eng user 0", "score")?.textContent).toContain("99");
    expect(dataCell(host, "name", "Eng user 0")?.querySelector("[data-st-row-name='Eng user 0']")).toBeTruthy();
  });
});
