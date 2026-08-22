import { describe, expect, it, vi } from "vitest";
import { mountTdgpTable } from "../tdgp/mountTdgpTable";
import type { ColumnDef } from "../index";
import type { TdgpQueryClient } from "../tdgp/types";

const columns: ColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 120, type: "string" },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(20);
  }
  throw new Error("Timed out waiting for condition");
}

describe("mountTdgpTable", () => {
  it("mounts the table and loads the first page", async () => {
    const query = vi.fn(async (_dataset: string) => ({
      protocol: "tdgp/1",
      data: [{ id: 1, name: "Ada" }],
      totalCount: 1,
    }));

    const host = document.createElement("div");
    document.body.appendChild(host);

    const mounted = mountTdgpTable(host, {
      client: { query } as TdgpQueryClient,
      dataset: "developers-10k",
      columns,
      pageSize: 10,
      primaryKey: "id",
      tableConfig: { height: "250px" },
    });

    try {
      await waitFor(() => query.mock.calls.length === 1 && host.textContent?.includes("Ada") === true);
      expect(query.mock.calls[0]?.[0]).toBe("developers-10k");
    } finally {
      mounted.destroy();
      host.remove();
    }
  });
});
