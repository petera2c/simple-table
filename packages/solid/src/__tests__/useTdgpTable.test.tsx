import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SimpleTable, useTdgpTable } from "../index";
import type { TdgpQueryClient } from "simple-table-core";
import type { SolidColumnDef } from "../types";

let host: HTMLDivElement | null = null;
let dispose: (() => void) | null = null;

afterEach(() => {
  dispose?.();
  dispose = null;
  host?.remove();
  host = null;
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

const columns: SolidColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 120, type: "string" },
];

describe("useTdgpTable (Solid)", () => {
  it("loads the first page into SimpleTable after mount", async () => {
    const query = vi.fn(async (_dataset: string) => ({
      protocol: "tdgp/1",
      data: [{ id: 1, name: "Ada" }],
      totalCount: 1,
    }));

    host = document.createElement("div");
    document.body.appendChild(host);

    dispose = render(() => {
      const tdgp = useTdgpTable({
        client: { query } as TdgpQueryClient,
        dataset: "developers-10k",
        columns,
        pageSize: 10,
        primaryKey: "id",
      });
      return (
        <SimpleTable
          columns={tdgp.columns()}
          rows={tdgp.rows()}
          height="250px"
          theme="light"
          {...tdgp.tableProps()}
        />
      );
    }, host);

    await waitFor(() => query.mock.calls.length === 1 && (host?.textContent?.includes("Ada") ?? false));
    expect(query.mock.calls[0]?.[0]).toBe("developers-10k");
  });

  it("does not reload when the getter returns new client and columns objects", async () => {
    const query = vi.fn(async (_dataset: string) => ({
      protocol: "tdgp/1",
      data: [{ id: 1, name: "Ada" }],
      totalCount: 1,
    }));

    host = document.createElement("div");
    document.body.appendChild(host);

    dispose = render(() => {
      const [bump, setBump] = createSignal(0);
      const tdgp = useTdgpTable(() => {
        bump();
        return {
          client: { query } as TdgpQueryClient,
          dataset: "developers-10k",
          columns: [
            { accessor: "id", label: "ID", width: 80, type: "number" as const },
            { accessor: "name", label: "Name", width: 120, type: "string" as const },
          ],
          pageSize: 10,
          primaryKey: "id",
        };
      });
      return (
        <div>
          <button class="rerender" onClick={() => setBump((n) => n + 1)} />
          <div data-bump={bump()} data-loading={String(tdgp.isLoading())} />
        </div>
      );
    }, host);

    await waitFor(
      () => query.mock.calls.length === 1 && host?.querySelector("[data-loading='false']") != null,
    );

    host.querySelector("button.rerender")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitFor(() => host?.querySelector("[data-bump='1']") != null);
    await wait(40);

    expect(query).toHaveBeenCalledTimes(1);
  });
});
