import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableVanilla } from "../index";
import { untrackCellByRow } from "../utils/bodyCell/styling";
import type { ColumnDef } from "../types/ColumnDef";
import type { SimpleTableConfig } from "../types/SimpleTableConfig";

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
  { accessor: "company", label: "Company", width: 120, type: "string" },
  { accessor: "y2026", label: "2026", width: 80, type: "number" },
  { accessor: "y2027", label: "2027", width: 80, type: "number" },
  { accessor: "y2028", label: "2028", width: 80, type: "number" },
  { accessor: "y2029", label: "2029", width: 80, type: "number" },
  { accessor: "y2030", label: "2030", width: 80, type: "number" },
  { accessor: "y2031", label: "2031", width: 80, type: "number" },
];

const rows = [
  { id: 1, company: "Nvidia", y2026: 218, y2027: 325, y2028: 325, y2029: 440, y2030: 596, y2031: 807 },
  { id: 2, company: "Tesla", y2026: 365, y2027: 390, y2028: 421, y2029: 455, y2030: 491, y2031: 531 },
];

const getRowId = (p: { row: unknown }) => String((p.row as { id?: number })?.id);

function mountTable(extras?: Partial<SimpleTableConfig>) {
  const container = document.createElement("div");
  container.style.width = "900px";
  document.body.appendChild(container);
  const table = new SimpleTableVanilla(container, {
    columns,
    rows,
    getRowId,
    height: "200px",
    theme: "modern-black",
    autoExpandColumns: true,
    hoverRowBackground: true,
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

describe("row hover on the last column", () => {
  it("keeps the last column in the hovered row after an update", async () => {
    const { table, container } = mountTable();
    mounted.push({ table, container });

    await waitFor(() => Boolean(container.querySelector('.st-cell[data-accessor="y2031"]')));

    const firstCell = container.querySelector<HTMLElement>(".st-cell");
    const lastCell = container.querySelector<HTMLElement>('.st-cell[data-accessor="y2031"]');
    expect(firstCell).toBeTruthy();
    expect(lastCell).toBeTruthy();

    firstCell!.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(lastCell!.classList.contains("st-row-hovered")).toBe(true);

    const rowId = lastCell!.getAttribute("data-row-id");
    expect(rowId).toBeTruthy();
    untrackCellByRow(rowId!, lastCell!);
    lastCell!.classList.remove("st-row-hovered");
    expect(lastCell!.classList.contains("st-row-hovered")).toBe(false);

    table.update({ theme: "modern-black" });
    expect(lastCell!.classList.contains("st-row-hovered")).toBe(true);

    firstCell!.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    expect(lastCell!.classList.contains("st-row-hovered")).toBe(false);
  });
});
