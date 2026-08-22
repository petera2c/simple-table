import { get } from "svelte/store";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createTdgpTable } from "../tdgp/createTdgpTable";
import type { TdgpQueryClient } from "simple-table-core";
import type { SvelteColumnDef } from "../types";

let table: ReturnType<typeof createTdgpTable> | null = null;

afterEach(() => {
  table?.destroy();
  table = null;
  vi.restoreAllMocks();
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

const columns: SvelteColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 120, type: "string" },
];

describe("createTdgpTable (Svelte)", () => {
  it("loads the first page", async () => {
    const query = vi.fn(async (_dataset: string) => ({
      protocol: "tdgp/1",
      data: [{ id: 1, name: "Ada" }],
      totalCount: 1,
    }));

    table = createTdgpTable({
      client: { query } as TdgpQueryClient,
      dataset: "developers-10k",
      columns,
      pageSize: 10,
      primaryKey: "id",
    });

    await waitFor(() => query.mock.calls.length === 1 && get(table!).isLoading === false);
    expect(get(table!).rows[0]?.name).toBe("Ada");
    expect(query.mock.calls[0]?.[0]).toBe("developers-10k");
  });

  it("does not reload when applyOptions gets a new client and columns object", async () => {
    const query = vi.fn(async (_dataset: string) => ({
      protocol: "tdgp/1",
      data: [{ id: 1, name: "Ada" }],
      totalCount: 1,
    }));

    table = createTdgpTable({
      client: { query } as TdgpQueryClient,
      dataset: "developers-10k",
      columns,
      pageSize: 10,
      primaryKey: "id",
    });

    await waitFor(() => query.mock.calls.length === 1 && get(table!).isLoading === false);

    table!.applyOptions({
      client: { query } as TdgpQueryClient,
      dataset: "developers-10k",
      columns: [
        { accessor: "id", label: "ID", width: 80, type: "number" },
        { accessor: "name", label: "Name", width: 120, type: "string" },
      ],
      pageSize: 10,
      primaryKey: "id",
    });
    await wait(40);

    expect(query).toHaveBeenCalledTimes(1);
  });
});
