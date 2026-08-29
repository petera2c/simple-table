import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableVanilla } from "../index";
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

const columns: ColumnDef[] = [{ accessor: "name", label: "Name", width: 140, type: "string" }];

const getRowId = (p: { row: unknown }) => String((p.row as { id?: number })?.id);

function mountTable(extras?: Partial<SimpleTableConfig>) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const table = new SimpleTableVanilla(container, {
    columns,
    rows: [],
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

describe("tableEmptyStateRenderer", () => {
  it("appends a function renderer so button clicks still fire", async () => {
    let clicks = 0;
    const { table, container } = mountTable({
      tableEmptyStateRenderer: () => {
        const wrap = document.createElement("div");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "Add";
        btn.addEventListener("click", () => {
          clicks += 1;
        });
        wrap.appendChild(btn);
        return wrap;
      },
    });
    mounted.push({ table, container });

    await waitFor(() => Boolean(container.querySelector("button")));
    container.querySelector("button")!.click();
    expect(clicks).toBe(1);
  });

  it("clones a prebuilt HTMLElement so the original node is not moved", async () => {
    const original = document.createElement("button");
    original.type = "button";
    original.textContent = "Add";
    document.body.appendChild(original);

    const { table, container } = mountTable({
      tableEmptyStateRenderer: original,
    });
    mounted.push({ table, container });

    await waitFor(() => container.querySelector("button") !== null);
    const painted = container.querySelector("button");
    expect(painted).not.toBe(original);
    expect(painted?.textContent).toBe("Add");
    expect(document.body.contains(original)).toBe(true);
    original.remove();
  });
});
