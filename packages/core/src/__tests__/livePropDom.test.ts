import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableVanilla } from "../index";
import type { ColumnDef } from "../types/ColumnDef";
import type { SimpleTableConfig } from "../types/SimpleTableConfig";

/**
 * After mount, changing a prop must write the matching DOM. These cases
 * cover shell classes, header/footer visibility, editor chrome, and grouping.
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

const columns: ColumnDef[] = [
  { accessor: "artist", label: "Artist", width: 140, type: "string" },
  { accessor: "song", label: "Song", width: 140, type: "string" },
];

const rows = [
  { id: 1, artist: "Miles", song: "So What" },
  { id: 2, artist: "Bill", song: "Waltz" },
];

const getRowId = (p: { row: unknown }) => String((p.row as { id?: number })?.id);

function mountTable(extras?: Partial<SimpleTableConfig>) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const table = new SimpleTableVanilla(container, {
    columns,
    rows,
    getRowId,
    height: "250px",
    theme: "light",
    animations: { enabled: false },
    ...extras,
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

describe("live props write to the DOM", () => {
  it("updates root className and columnBorders", async () => {
    const { table, container } = mountTable({ className: "alpha" });
    mounted.push({ table, container });

    await waitFor(() => Boolean(container.querySelector(".simple-table-root")));
    const root = container.querySelector(".simple-table-root");
    expect(root?.className).toContain("alpha");
    expect(root?.classList.contains("st-column-borders")).toBe(false);

    table.update({ className: "beta", columnBorders: true });
    expect(root?.className).toContain("beta");
    expect(root?.className).not.toContain("alpha");
    expect(root?.classList.contains("st-column-borders")).toBe(true);
    expect(root?.className).toContain("theme-light");
  });

  it("hides and shows the header", async () => {
    const { table, container } = mountTable();
    mounted.push({ table, container });

    const header = container.querySelector<HTMLElement>(".st-header-container");
    await waitFor(() => (container.querySelectorAll(".st-header-cell").length ?? 0) > 0);
    expect(header?.style.display).not.toBe("none");

    table.update({ hideHeader: true });
    expect(header?.style.display).toBe("none");

    table.update({ hideHeader: false });
    expect(header?.style.display).not.toBe("none");
    expect(container.querySelectorAll(".st-header-cell").length).toBeGreaterThan(0);
  });

  it("removes and restores the pagination footer", async () => {
    const { table, container } = mountTable({
      enablePagination: true,
      rowsPerPage: 1,
    });
    mounted.push({ table, container });

    await waitFor(() => Boolean(container.querySelector(".st-footer")));
    expect(container.querySelector(".st-footer")).toBeTruthy();

    table.update({ hideFooter: true });
    expect(container.querySelector(".st-footer")).toBeNull();

    table.update({ hideFooter: false });
    await waitFor(() => Boolean(container.querySelector(".st-footer")));
    expect(container.querySelector(".st-footer")).toBeTruthy();
  });

  it("adds header edit and reorder classes when those flags turn on", async () => {
    const { table, container } = mountTable();
    mounted.push({ table, container });

    await waitFor(() => Boolean(container.querySelector(".st-header-cell")));
    const cell = container.querySelector(".st-header-cell");
    expect(cell?.className).not.toContain("st-header-editable");

    table.update({ enableHeaderEditing: true, columnReordering: true, columnResizing: true });
    const next = container.querySelector(".st-header-cell");
    expect(next?.className).toContain("st-header-editable");
    expect(next?.querySelector(".st-header-label")?.getAttribute("draggable")).toBe("true");
    expect(next?.querySelector(".st-header-resize-handle-container")).toBeTruthy();

    table.update({
      enableHeaderEditing: false,
      columnReordering: false,
      columnResizing: false,
    });
    expect(next?.className).not.toContain("st-header-editable");
    expect(next?.querySelector(".st-header-label")?.getAttribute("draggable")).toBeNull();
    expect(next?.querySelector(".st-header-resize-handle-container")).toBeNull();
  });

  it("rebuilds pin controls and reset text in the column editor", async () => {
    const { table, container } = mountTable({
      enableColumnEditor: true,
      enableColumnEditorInitOpen: true,
      columnEditorConfig: { text: "Columns", resetText: "Reset columns" },
    });
    mounted.push({ table, container });

    await waitFor(() => Boolean(container.querySelector(".st-column-pin-btn")));
    expect(container.querySelector(".st-column-editor-reset-btn")?.textContent).toBe(
      "Reset columns",
    );

    table.update({
      enableColumnEditor: true,
      columnEditorConfig: {
        text: "Columns",
        allowColumnPinning: false,
        resetText: "컬럼 초기화",
      },
    });

    await waitFor(
      () => container.querySelector(".st-column-editor-reset-btn")?.textContent === "컬럼 초기화",
    );
    expect(container.querySelector(".st-column-pin-btn")).toBeNull();
  });

  it("switches the grid role when row grouping is added", async () => {
    const { table, container } = mountTable();
    mounted.push({ table, container });

    const grid = container.querySelector(".st-content");
    await waitFor(() => Boolean(grid));
    expect(grid?.getAttribute("role")).toBe("grid");

    table.update({ rowGrouping: ["artist"] });
    expect(grid?.getAttribute("role")).toBe("treegrid");

    table.update({ rowGrouping: [] });
    expect(grid?.getAttribute("role")).toBe("grid");
  });
});
