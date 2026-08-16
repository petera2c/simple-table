import { afterEach, describe, expect, it } from "vitest";
// Run via the React vitest suite against core source. Asserts that hide, pin,
// and update never write onto the caller's ColumnDef objects.
import { SimpleTableVanilla } from "../index";
import type { ColumnDef } from "../types/ColumnDef";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

type ColumnSnapshot = {
  accessor: string;
  hide: boolean | undefined;
  width: ColumnDef["width"];
  pinned: ColumnDef["pinned"];
  label: string;
  children?: ColumnSnapshot[];
};

function snapshotColumns(cols: ColumnDef[]): ColumnSnapshot[] {
  return cols.map((column) => ({
    accessor: String(column.accessor),
    hide: column.hide,
    width: column.width,
    pinned: column.pinned,
    label: column.label,
    children: column.children ? snapshotColumns(column.children) : undefined,
  }));
}

function visibleHeaderLabels(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll(".st-header-label-text")).map(
    (el) => el.textContent ?? "",
  );
}

function toggleEditorCheckbox(root: HTMLElement, label: string): void {
  const row = Array.from(root.querySelectorAll(".st-header-checkbox-item")).find(
    (item) => item.querySelector(".st-column-label-container")?.textContent === label,
  );
  if (!row) throw new Error(`Column editor row for "${label}" not found`);
  const input = row.querySelector<HTMLInputElement>(".st-checkbox-input");
  if (!input) throw new Error(`Checkbox input for "${label}" not found`);
  input.click();
}

const rows = [
  { id: 1, name: "Alice", email: "a@x.com", phone: "111", extra: "e1" },
  { id: 2, name: "Bob", email: "b@x.com", phone: "222", extra: "e2" },
];

const getRowId = (p: { row: unknown }) => String((p.row as { id?: number })?.id);

const cellRenderer = ({ value }: { value: unknown }) => String(value ?? "");
const headerRenderer = () => "Name";
const nestedTable = {
  columns: [{ accessor: "extra", label: "Extra", width: 80 }],
};

function makeColumns(): ColumnDef[] {
  const childEmail: ColumnDef = { accessor: "email", label: "Email", width: 120, type: "string" };
  const childPhone: ColumnDef = { accessor: "phone", label: "Phone", width: 120, type: "string" };
  return [
    {
      accessor: "name",
      label: "Name",
      width: 120,
      type: "string",
      cellRenderer: cellRenderer as ColumnDef["cellRenderer"],
      headerRenderer: headerRenderer as ColumnDef["headerRenderer"],
    },
    {
      accessor: "contact",
      label: "Contact",
      width: 240,
      children: [childEmail, childPhone],
    },
    {
      accessor: "extra",
      label: "Extra",
      width: 80,
      type: "string",
      nestedTable,
    },
  ];
}

function mountTable(columns: ColumnDef[]) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const table = new SimpleTableVanilla(container, {
    columns,
    rows,
    getRowId,
    height: "250px",
    theme: "light",
    enableColumnEditor: true,
    enableColumnEditorInitOpen: true,
  });
  table.mount();
  return { table, container };
}

function apiHeader(
  table: ReturnType<typeof mountTable>["table"],
  accessor: string,
) {
  return table.getAPI().getHeaders().find((header) => String(header.accessor) === accessor);
}

const mounted: ReturnType<typeof mountTable>[] = [];

afterEach(() => {
  for (const entry of mounted.splice(0)) {
    entry.table.destroy();
    entry.container.remove();
  }
});

describe("column ownership — caller ColumnDef objects are not mutated", () => {
  it("keeps caller column, child, renderer, and nestedTable identity after mount", async () => {
    const columns = makeColumns();
    const nameCol = columns[0];
    const contactCol = columns[1];
    const emailCol = contactCol.children![0];
    const extraCol = columns[2];
    const before = snapshotColumns(columns);

    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => visibleHeaderLabels(container).includes("Name"));

    expect(columns[0]).toBe(nameCol);
    expect(columns[1]).toBe(contactCol);
    expect(columns[1].children![0]).toBe(emailCol);
    expect(columns[2]).toBe(extraCol);
    expect(columns[0].cellRenderer).toBe(cellRenderer);
    expect(columns[0].headerRenderer).toBe(headerRenderer);
    expect(columns[2].nestedTable).toBe(nestedTable);
    expect(snapshotColumns(columns)).toEqual(before);

    expect(apiHeader(table, "name")).not.toBe(nameCol);
    expect(apiHeader(table, "email")).not.toBe(emailCol);
  });

  it("does not pick up hide written onto the caller's objects after mount", async () => {
    const columns = makeColumns();
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => visibleHeaderLabels(container).includes("Name"));

    columns[0].hide = true;
    table.update({ rows: rows.map((row) => ({ ...row })) });

    await waitFor(() => visibleHeaderLabels(container).includes("Name"));
    expect(visibleHeaderLabels(container)).toContain("Name");
  });

  it("hides a leaf in one table without mutating a shared columns array or a second table", async () => {
    const columns = makeColumns();
    const before = snapshotColumns(columns);

    const a = mountTable(columns);
    const b = mountTable(columns);
    mounted.push(a, b);

    await waitFor(() => visibleHeaderLabels(a.container).includes("Name"));
    await waitFor(() => visibleHeaderLabels(b.container).includes("Name"));

    toggleEditorCheckbox(a.container, "Name");
    await waitFor(() => !visibleHeaderLabels(a.container).includes("Name"));

    expect(snapshotColumns(columns)).toEqual(before);
    expect(columns[0].hide).toBeUndefined();
    expect(visibleHeaderLabels(b.container)).toContain("Name");
  });

  it("hides a leaf via the column editor without writing hide on the caller", async () => {
    const columns = makeColumns();
    const before = snapshotColumns(columns);
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => visibleHeaderLabels(container).includes("Name"));

    toggleEditorCheckbox(container, "Name");
    await waitFor(() => !visibleHeaderLabels(container).includes("Name"));

    expect(snapshotColumns(columns)).toEqual(before);
    expect(columns[0].hide).toBeUndefined();
  });

  it("hides a nested child via the column editor without writing hide on the caller", async () => {
    const columns = makeColumns();
    const before = snapshotColumns(columns);
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => visibleHeaderLabels(container).includes("Email"));

    toggleEditorCheckbox(container, "Email");
    await waitFor(() => !visibleHeaderLabels(container).includes("Email"));

    expect(visibleHeaderLabels(container)).toContain("Phone");
    expect(snapshotColumns(columns)).toEqual(before);
    expect(columns[1].children![0].hide).toBeUndefined();
  });

  it("hides a column group via the column editor without writing hide on parent or children", async () => {
    const columns = makeColumns();
    const before = snapshotColumns(columns);
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => visibleHeaderLabels(container).includes("Email"));

    toggleEditorCheckbox(container, "Contact");
    await waitFor(() => !visibleHeaderLabels(container).includes("Email"));

    expect(visibleHeaderLabels(container)).not.toContain("Phone");
    expect(snapshotColumns(columns)).toEqual(before);
    expect(columns[1].hide).toBeUndefined();
    expect(columns[1].children![0].hide).toBeUndefined();
    expect(columns[1].children![1].hide).toBeUndefined();
  });

  it("applies pin state without writing pinned on the caller", async () => {
    const columns = makeColumns();
    const before = snapshotColumns(columns);
    const { table, container } = mountTable(columns);
    mounted.push({ table, container });

    await waitFor(() => visibleHeaderLabels(container).includes("Name"));

    await table.getAPI().applyPinnedState({
      left: ["name"],
      main: ["contact", "extra"],
      right: [],
    });

    expect(table.getAPI().getPinnedState()).toEqual({
      left: ["name"],
      main: ["contact", "extra"],
      right: [],
    });
    expect(snapshotColumns(columns)).toEqual(before);
    expect(columns[0].pinned).toBeUndefined();
  });

  it("leaves the previous caller array untouched when update replaces columns", async () => {
    const first = makeColumns();
    const firstBefore = snapshotColumns(first);
    const { table, container } = mountTable(first);
    mounted.push({ table, container });

    await waitFor(() => visibleHeaderLabels(container).includes("Name"));

    const second: ColumnDef[] = [
      { accessor: "name", label: "Name", width: 160, type: "string" },
      { accessor: "email", label: "Email", width: 140, type: "string" },
    ];
    table.update({ columns: second });

    await waitFor(() => visibleHeaderLabels(container).includes("Email"));
    expect(visibleHeaderLabels(container)).not.toContain("Phone");

    expect(snapshotColumns(first)).toEqual(firstBefore);
    expect(apiHeader(table, "name")).not.toBe(second[0]);
    expect(second[0].hide).toBeUndefined();
    expect(second[0].width).toBe(160);
  });
});
