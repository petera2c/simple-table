import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableVanilla } from "../index";
import type { ColumnDef } from "../types/ColumnDef";
import type Row from "../types/Row";
import type { AbsoluteBodyCell, CellRenderContext } from "../utils/bodyCell/types";
import { getExpandChromeKind, readExpandChromeKind } from "../utils/bodyCell/content";

/**
 * Group expand/collapse with motion off reuses on-screen cells. A child Name
 * cell (no caret) can be reused as a parent Name cell (needs a caret). These
 * cases check that remaining group rows still show a real caret after a
 * collapse, and that the caret still toggles the group.
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

type UserRow = { id: string; name: string };
type DeptRow = { id: string; name: string; users: UserRow[] };

const columns: ColumnDef[] = [
  { accessor: "name", label: "Name", width: 220, type: "string", expandable: true, pinned: "left" },
  { accessor: "id", label: "Id", width: 80, type: "string" },
];

function makeDepts(): DeptRow[] {
  return [
    {
      id: "eng",
      name: "Engineering",
      users: Array.from({ length: 50 }, (_, i) => ({
        id: `eng-user-${i}`,
        name: `Eng user ${i}`,
      })),
    },
    {
      id: "sales",
      name: "Sales",
      users: Array.from({ length: 8 }, (_, i) => ({
        id: `sales-user-${i}`,
        name: `Sales user ${i}`,
      })),
    },
    {
      id: "ops",
      name: "Ops",
      users: [{ id: "ops-user-0", name: "Ops user 0" }],
    },
  ];
}

function cellLabel(cell: HTMLElement): string {
  const span = cell.querySelector(".st-cell-content");
  if (!span) return (cell.textContent ?? "").trim();
  const clone = span.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".st-expand-icon-container").forEach((el) => el.remove());
  return (clone.textContent ?? "").trim();
}

function nameCell(root: HTMLElement, name: string): HTMLElement | undefined {
  return Array.from(root.querySelectorAll<HTMLElement>('.st-cell[data-accessor="name"]')).find(
    (cell) => cellLabel(cell) === name,
  );
}

function expandChrome(root: HTMLElement, name: string): "icon" | "placeholder" | "none" | null {
  const cell = nameCell(root, name);
  if (!cell) return null;
  const span = cell.querySelector<HTMLElement>(".st-cell-content") ?? cell;
  return readExpandChromeKind(span);
}

function findExpandIcon(root: HTMLElement, name: string): HTMLElement | null {
  const cell = nameCell(root, name);
  if (!cell) return null;
  const icon = cell.querySelector(".st-expand-icon-container:not(.placeholder)");
  return icon as HTMLElement | null;
}

function mountTable() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const table = new SimpleTableVanilla(container, {
    columns,
    rows: makeDepts(),
    getRowId: ({ row }) => String((row as { id: string }).id),
    height: "200px",
    customTheme: { rowHeight: 32, headerHeight: 32 },
    theme: "light",
    rowGrouping: ["users"],
    expandAll: true,
    animations: { enabled: false },
  });
  table.mount();
  return { table, container };
}

const mounted: ReturnType<typeof mountTable>[] = [];

afterEach(() => {
  for (const entry of mounted.splice(0)) {
    entry.table.destroy();
    entry.container.remove();
  }
});

describe("getExpandChromeKind", () => {
  const parentRow = { id: "eng", name: "Engineering", users: [{ id: "ada", name: "Ada" }] };
  const leafRow = { id: "ada", name: "Ada" };
  const expandableHeader = { accessor: "name", expandable: true } as ColumnDef;
  const plainHeader = { accessor: "name", expandable: false } as ColumnDef;

  function cell(row: Row, depth: number, header: ColumnDef): AbsoluteBodyCell {
    return {
      header,
      row,
      depth,
      rowIndex: 0,
      colIndex: 0,
      rowId: "x",
      displayRowNumber: 1,
      isOdd: false,
      tableRow: {
        depth,
        position: 0,
        displayPosition: 0,
        isLastGroupRow: false,
        row,
        rowId: [0],
        absoluteRowIndex: 0,
      },
      left: 0,
      top: 0,
      width: 100,
      height: 32,
    };
  }

  it("shows a caret on a group row, nothing on a leaf, and a spacer when a deeper group is still possible", () => {
    const oneLevel = { rowGrouping: ["users"] } as CellRenderContext;
    const twoLevels = { rowGrouping: ["depts", "users"] } as CellRenderContext;

    expect(getExpandChromeKind(cell(parentRow, 0, expandableHeader), oneLevel)).toBe("icon");
    expect(getExpandChromeKind(cell(leafRow, 1, expandableHeader), oneLevel)).toBe("none");
    expect(getExpandChromeKind(cell(leafRow, 1, expandableHeader), twoLevels)).toBe("placeholder");
    expect(getExpandChromeKind(cell(parentRow, 0, plainHeader), oneLevel)).toBe("none");
  });

  it("reads caret vs spacer vs none from the cell content", () => {
    const span = document.createElement("span");
    expect(readExpandChromeKind(span)).toBe("none");

    const icon = document.createElement("div");
    icon.className = "st-expand-icon-container";
    span.appendChild(icon);
    expect(readExpandChromeKind(span)).toBe("icon");

    icon.classList.add("placeholder");
    expect(readExpandChromeKind(span)).toBe("placeholder");
  });
});

describe("grouped expand/collapse with motion off", () => {
  it("keeps a real caret on remaining group rows after collapsing a large group", async () => {
    const { table, container } = mountTable();
    mounted.push({ table, container });

    await waitFor(() => Boolean(findExpandIcon(container, "Engineering")));
    expect(nameCell(container, "Sales")).toBeUndefined();
    expect(nameCell(container, "Eng user 0")).toBeTruthy();

    findExpandIcon(container, "Engineering")!.click();

    await waitFor(() => Boolean(nameCell(container, "Sales")));
    expect(nameCell(container, "Eng user 0")).toBeUndefined();
    expect(expandChrome(container, "Engineering")).toBe("icon");
    expect(expandChrome(container, "Sales")).toBe("icon");

    findExpandIcon(container, "Sales")!.click();
    await waitFor(() => nameCell(container, "Sales user 0") === undefined);
    expect(expandChrome(container, "Sales")).toBe("icon");
    expect(nameCell(container, "Ops")).toBeTruthy();
    expect(expandChrome(container, "Ops")).toBe("icon");
  });

  it("shows child rows before the expand click returns", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const table = new SimpleTableVanilla(container, {
      columns,
      rows: [
        {
          id: "eng",
          name: "Engineering",
          users: [
            { id: "emp-1", name: "Alice" },
            { id: "emp-2", name: "Bob" },
          ],
        },
        { id: "sales", name: "Sales", users: [{ id: "emp-3", name: "Charlie" }] },
      ],
      getRowId: ({ row }) => String((row as { id: string }).id),
      height: "320px",
      customTheme: { rowHeight: 32, headerHeight: 32 },
      theme: "light",
      rowGrouping: ["users"],
      expandAll: false,
      animations: { enabled: true, duration: 600 },
    });
    table.mount();
    mounted.push({ table, container });

    await waitFor(() => Boolean(findExpandIcon(container, "Engineering")));
    const rowsBefore = new Set(
      Array.from(container.querySelectorAll(".st-cell[data-row-index]")).map((c) =>
        c.getAttribute("data-row-index"),
      ),
    ).size;
    findExpandIcon(container, "Engineering")!.click();
    const rowsAfter = new Set(
      Array.from(container.querySelectorAll(".st-cell[data-row-index]")).map((c) =>
        c.getAttribute("data-row-index"),
      ),
    ).size;
    expect(rowsAfter).toBeGreaterThan(rowsBefore);
    expect(nameCell(container, "Alice")).toBeTruthy();
  });
});
